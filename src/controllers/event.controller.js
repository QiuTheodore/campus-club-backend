const prisma = require("../config/prisma");
const { successResponse, errorResponse } = require("../utils/response");

function getUserSafeFields() {
  return {
    id: true,
    email: true,
    role: true,
    name: true,
    studentId: true,
    major: true,
    grade: true,
    bio: true,
    avatar: true,
  };
}

function getEventIncludeFields() {
  return {
    club: {
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        logo: true,
        status: true,
        createdById: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    },
    _count: {
      select: {
        signups: true,
      },
    },
  };
}

function canManageClub(user, club) {
  if (!user || !club) return false;
  if (user.role === "super_admin") return true;
  if (user.role === "club_admin" && club.createdById === user.id) return true;
  return false;
}

function parseDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

async function getRegisteredCount(eventId) {
  return await prisma.eventSignup.count({
    where: {
      eventId,
      status: "registered",
    },
  });
}

async function getAllEvents(req, res) {
  try {
    const { keyword, clubId, status } = req.query;

    const where = {};

    if (keyword) {
      where.OR = [
        {
          title: {
            contains: keyword,
          },
        },
        {
          description: {
            contains: keyword,
          },
        },
        {
          location: {
            contains: keyword,
          },
        },
      ];
    }

    if (clubId) {
      where.clubId = Number(clubId);
    }

    if (status) {
      where.status = status;
    } else {
      where.status = "published";
    }

    const events = await prisma.event.findMany({
      where,
      include: getEventIncludeFields(),
      orderBy: {
        startTime: "asc",
      },
    });

    const eventsWithCount = await Promise.all(
      events.map(async (event) => {
        const registeredCount = await getRegisteredCount(event.id);
        const remainingSeats =
          event.capacity === null || event.capacity === undefined
            ? null
            : Math.max(event.capacity - registeredCount, 0);

        return {
          ...event,
          registeredCount,
          remainingSeats,
        };
      })
    );

    return successResponse(res, "Events fetched successfully", eventsWithCount, 200);
  } catch (error) {
    console.error("Get all events error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getEventById(req, res) {
  try {
    const eventId = Number(req.params.id);

    if (!eventId) {
      return errorResponse(res, "Invalid event id", 400);
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: getEventIncludeFields(),
    });

    if (!event) {
      return errorResponse(res, "Event not found", 404);
    }

    const registeredCount = await getRegisteredCount(event.id);
    const remainingSeats =
      event.capacity === null || event.capacity === undefined
        ? null
        : Math.max(event.capacity - registeredCount, 0);

    return successResponse(
      res,
      "Event fetched successfully",
      {
        ...event,
        registeredCount,
        remainingSeats,
      },
      200
    );
  } catch (error) {
    console.error("Get event by id error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function createEventForClub(req, res) {
  try {
    const clubId = Number(req.params.clubId);
    const { title, description, location, startTime, endTime, capacity, status } = req.body;

    if (!clubId) {
      return errorResponse(res, "Invalid club id", 400);
    }

    if (!title || !title.trim()) {
      return errorResponse(res, "Event title is required", 400);
    }

    if (!startTime || !endTime) {
      return errorResponse(res, "Start time and end time are required", 400);
    }

    const parsedStartTime = parseDate(startTime);
    const parsedEndTime = parseDate(endTime);

    if (!parsedStartTime || !parsedEndTime) {
      return errorResponse(res, "Invalid start time or end time", 400);
    }

    if (parsedEndTime <= parsedStartTime) {
      return errorResponse(res, "End time must be later than start time", 400);
    }

    const parsedCapacity =
      capacity === undefined || capacity === null || capacity === ""
        ? null
        : Number(capacity);

    if (parsedCapacity !== null && (!Number.isInteger(parsedCapacity) || parsedCapacity <= 0)) {
      return errorResponse(res, "Capacity must be a positive integer", 400);
    }

    const club = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
    });

    if (!club) {
      return errorResponse(res, "Club not found", 404);
    }

    if (!canManageClub(req.user, club)) {
      return errorResponse(res, "You do not have permission to create events for this club", 403);
    }

    const event = await prisma.event.create({
      data: {
        clubId,
        title: title.trim(),
        description: description || null,
        location: location || null,
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        capacity: parsedCapacity,
        status: status || "published",
      },
      include: getEventIncludeFields(),
    });

    return successResponse(res, "Event created successfully", event, 201);
  } catch (error) {
    console.error("Create event error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function updateEventById(req, res) {
  try {
    const eventId = Number(req.params.id);

    if (!eventId) {
      return errorResponse(res, "Invalid event id", 400);
    }

    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        club: true,
      },
    });

    if (!existingEvent) {
      return errorResponse(res, "Event not found", 404);
    }

    if (!canManageClub(req.user, existingEvent.club)) {
      return errorResponse(res, "You do not have permission to update this event", 403);
    }

    const { title, description, location, startTime, endTime, capacity, status } = req.body;

    let parsedStartTime = existingEvent.startTime;
    let parsedEndTime = existingEvent.endTime;

    if (startTime !== undefined) {
      parsedStartTime = parseDate(startTime);
      if (!parsedStartTime) {
        return errorResponse(res, "Invalid start time", 400);
      }
    }

    if (endTime !== undefined) {
      parsedEndTime = parseDate(endTime);
      if (!parsedEndTime) {
        return errorResponse(res, "Invalid end time", 400);
      }
    }

    if (parsedEndTime <= parsedStartTime) {
      return errorResponse(res, "End time must be later than start time", 400);
    }

    let parsedCapacity = existingEvent.capacity;

    if (capacity !== undefined) {
      parsedCapacity =
        capacity === null || capacity === ""
          ? null
          : Number(capacity);

      if (parsedCapacity !== null && (!Number.isInteger(parsedCapacity) || parsedCapacity <= 0)) {
        return errorResponse(res, "Capacity must be a positive integer", 400);
      }
    }

    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        title: title !== undefined ? title.trim() : existingEvent.title,
        description: description !== undefined ? description : existingEvent.description,
        location: location !== undefined ? location : existingEvent.location,
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        capacity: parsedCapacity,
        status: status !== undefined ? status : existingEvent.status,
      },
      include: getEventIncludeFields(),
    });

    return successResponse(res, "Event updated successfully", updatedEvent, 200);
  } catch (error) {
    console.error("Update event error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function deleteEventById(req, res) {
  try {
    const eventId = Number(req.params.id);

    if (!eventId) {
      return errorResponse(res, "Invalid event id", 400);
    }

    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        club: true,
      },
    });

    if (!existingEvent) {
      return errorResponse(res, "Event not found", 404);
    }

    if (!canManageClub(req.user, existingEvent.club)) {
      return errorResponse(res, "You do not have permission to delete this event", 403);
    }

    await prisma.event.delete({
      where: {
        id: eventId,
      },
    });

    return successResponse(res, "Event deleted successfully", {
      id: eventId,
    });
  } catch (error) {
    console.error("Delete event error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function uploadEventPosterById(req, res) {
  try {
    const eventId = Number(req.params.id);

    if (!eventId) {
      return errorResponse(res, "Invalid event id", 400);
    }

    if (!req.file) {
      return errorResponse(res, "Event poster file is required", 400);
    }

    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        club: true,
      },
    });

    if (!existingEvent) {
      return errorResponse(res, "Event not found", 404);
    }

    if (!canManageClub(req.user, existingEvent.club)) {
      return errorResponse(res, "You do not have permission to upload poster for this event", 403);
    }

    const posterUrl = `/uploads/events/${req.file.filename}`;

    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        poster: posterUrl,
      },
      include: getEventIncludeFields(),
    });

    return successResponse(res, "Event poster uploaded successfully", updatedEvent, 200);
  } catch (error) {
    console.error("Upload event poster error:", error);
    return errorResponse(res, error.message || "Server error", 500);
  }
}

async function signupEvent(req, res) {
  try {
    const eventId = Number(req.params.id);

    if (!eventId) {
      return errorResponse(res, "Invalid event id", 400);
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        club: true,
      },
    });

    if (!event) {
      return errorResponse(res, "Event not found", 404);
    }

    if (event.status !== "published") {
      return errorResponse(res, "This event is not open for registration", 400);
    }

    const membership = await prisma.clubMember.findUnique({
      where: {
        clubId_userId: {
          clubId: event.clubId,
          userId: req.user.id,
        },
      },
    });

    if (!membership) {
      return errorResponse(
        res,
        "You must be an approved club member before registering for this event",
        403
      );
    }

    const existingSignup = await prisma.eventSignup.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId: req.user.id,
        },
      },
    });

    if (existingSignup) {
      return errorResponse(res, "You have already registered for this event", 409);
    }

    const registeredCount = await getRegisteredCount(eventId);

    if (event.capacity !== null && event.capacity !== undefined && registeredCount >= event.capacity) {
      return errorResponse(res, "This event is already full", 400);
    }

    const signup = await prisma.eventSignup.create({
      data: {
        eventId,
        userId: req.user.id,
        status: "registered",
      },
      include: {
        event: {
          include: {
            club: {
              select: {
                id: true,
                name: true,
                category: true,
                logo: true,
              },
            },
          },
        },
        user: {
          select: getUserSafeFields(),
        },
      },
    });

    return successResponse(res, "Event registration successful", signup, 201);
  } catch (error) {
    console.error("Signup event error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function cancelEventSignup(req, res) {
  try {
    const eventId = Number(req.params.id);

    if (!eventId) {
      return errorResponse(res, "Invalid event id", 400);
    }

    const existingSignup = await prisma.eventSignup.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId: req.user.id,
        },
      },
    });

    if (!existingSignup) {
      return errorResponse(res, "You have not registered for this event", 404);
    }

    await prisma.eventSignup.delete({
      where: {
        eventId_userId: {
          eventId,
          userId: req.user.id,
        },
      },
    });

    return successResponse(res, "Event registration cancelled successfully", {
      eventId,
      userId: req.user.id,
    });
  } catch (error) {
    console.error("Cancel event signup error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getEventSignups(req, res) {
  try {
    const eventId = Number(req.params.id);

    if (!eventId) {
      return errorResponse(res, "Invalid event id", 400);
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        club: true,
      },
    });

    if (!event) {
      return errorResponse(res, "Event not found", 404);
    }

    if (!canManageClub(req.user, event.club)) {
      return errorResponse(res, "You do not have permission to view signups for this event", 403);
    }

    const signups = await prisma.eventSignup.findMany({
      where: {
        eventId,
        status: "registered",
      },
      include: {
        user: {
          select: getUserSafeFields(),
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const registeredCount = signups.length;
    const remainingSeats =
      event.capacity === null || event.capacity === undefined
        ? null
        : Math.max(event.capacity - registeredCount, 0);

    return successResponse(
      res,
      "Event signups fetched successfully",
      {
        event: {
          id: event.id,
          title: event.title,
          capacity: event.capacity,
          registeredCount,
          remainingSeats,
        },
        signups,
      },
      200
    );
  } catch (error) {
    console.error("Get event signups error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getEventSignupCount(req, res) {
  try {
    const eventId = Number(req.params.id);

    if (!eventId) {
      return errorResponse(res, "Invalid event id", 400);
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!event) {
      return errorResponse(res, "Event not found", 404);
    }

    const registeredCount = await getRegisteredCount(eventId);
    const remainingSeats =
      event.capacity === null || event.capacity === undefined
        ? null
        : Math.max(event.capacity - registeredCount, 0);

    return successResponse(
      res,
      "Event signup count fetched successfully",
      {
        eventId: event.id,
        title: event.title,
        club: event.club,
        capacity: event.capacity,
        registeredCount,
        remainingSeats,
      },
      200
    );
  } catch (error) {
    console.error("Get event signup count error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getMyEventSignups(req, res) {
  try {
    const signups = await prisma.eventSignup.findMany({
      where: {
        userId: req.user.id,
        status: "registered",
      },
      include: {
        event: {
          include: {
            club: {
              select: {
                id: true,
                name: true,
                category: true,
                logo: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse(res, "My event signups fetched successfully", signups, 200);
  } catch (error) {
    console.error("Get my event signups error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

module.exports = {
  getAllEvents,
  getEventById,
  createEventForClub,
  updateEventById,
  deleteEventById,
  uploadEventPosterById,
  signupEvent,
  cancelEventSignup,
  getEventSignups,
  getEventSignupCount,
  getMyEventSignups,
};