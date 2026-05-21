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

function getCommentIncludeFields() {
  return {
    user: {
      select: getUserSafeFields(),
    },
    event: {
      select: {
        id: true,
        title: true,
        clubId: true,
        club: {
          select: {
            id: true,
            name: true,
            createdById: true,
          },
        },
      },
    },
  };
}

function canDeleteComment(user, comment) {
  if (!user || !comment) return false;

  if (user.role === "super_admin") {
    return true;
  }

  if (comment.userId === user.id) {
    return true;
  }

  if (
    user.role === "club_admin" &&
    comment.event &&
    comment.event.club &&
    comment.event.club.createdById === user.id
  ) {
    return true;
  }

  return false;
}

async function getEventComments(req, res) {
  try {
    const eventId = Number(req.params.id);

    if (!eventId) {
      return errorResponse(res, "Invalid event id", 400);
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return errorResponse(res, "Event not found", 404);
    }

    const comments = await prisma.eventComment.findMany({
      where: {
        eventId,
      },
      include: {
        user: {
          select: getUserSafeFields(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse(res, "Event comments fetched successfully", comments, 200);
  } catch (error) {
    console.error("Get event comments error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function createEventComment(req, res) {
  try {
    const eventId = Number(req.params.id);
    const { content } = req.body;

    if (!eventId) {
      return errorResponse(res, "Invalid event id", 400);
    }

    if (!content || !content.trim()) {
      return errorResponse(res, "Comment content is required", 400);
    }

    if (content.trim().length > 500) {
      return errorResponse(res, "Comment content must be less than 500 characters", 400);
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return errorResponse(res, "Event not found", 404);
    }

    const comment = await prisma.eventComment.create({
      data: {
        eventId,
        userId: req.user.id,
        content: content.trim(),
      },
      include: getCommentIncludeFields(),
    });

    return successResponse(res, "Comment created successfully", comment, 201);
  } catch (error) {
    console.error("Create event comment error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function deleteEventComment(req, res) {
  try {
    const commentId = Number(req.params.commentId);

    if (!commentId) {
      return errorResponse(res, "Invalid comment id", 400);
    }

    const comment = await prisma.eventComment.findUnique({
      where: {
        id: commentId,
      },
      include: getCommentIncludeFields(),
    });

    if (!comment) {
      return errorResponse(res, "Comment not found", 404);
    }

    if (!canDeleteComment(req.user, comment)) {
      return errorResponse(res, "You do not have permission to delete this comment", 403);
    }

    await prisma.eventComment.delete({
      where: {
        id: commentId,
      },
    });

    return successResponse(res, "Comment deleted successfully", {
      id: commentId,
    });
  } catch (error) {
    console.error("Delete event comment error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getMyEventComments(req, res) {
  try {
    const comments = await prisma.eventComment.findMany({
      where: {
        userId: req.user.id,
      },
      include: getCommentIncludeFields(),
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse(res, "My comments fetched successfully", comments, 200);
  } catch (error) {
    console.error("Get my comments error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getManagedEventComments(req, res) {
  try {
    const where = {};

    if (req.user.role === "club_admin") {
      where.event = {
        club: {
          createdById: req.user.id,
        },
      };
    }

    const comments = await prisma.eventComment.findMany({
      where,
      include: getCommentIncludeFields(),
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse(res, "Managed comments fetched successfully", comments, 200);
  } catch (error) {
    console.error("Get managed comments error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

module.exports = {
  getEventComments,
  createEventComment,
  deleteEventComment,
  getMyEventComments,
  getManagedEventComments,
};