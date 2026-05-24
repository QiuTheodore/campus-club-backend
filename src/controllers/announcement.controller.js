const prisma = require("../config/prisma");
const { successResponse, errorResponse } = require("../utils/response");

const VALID_ANNOUNCEMENT_STATUS = ["draft", "published", "archived"];

function canManageClub(user, club) {
  if (!user || !club) return false;
  if (user.role === "super_admin") return true;
  if (user.role === "club_admin" && club.createdById === user.id) return true;
  return false;
}

function getAnnouncementIncludeFields() {
  return {
    club: {
      select: {
        id: true,
        name: true,
        chineseName: true,
        englishName: true,
        description: true,
        category: true,
        logo: true,
        status: true,
        createdById: true,
      },
    },
    createdBy: {
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    },
  };
}

async function getAllAnnouncements(req, res) {
  try {
    const { keyword, clubId, status, pinned } = req.query;

    const where = {};

    if (keyword) {
      where.OR = [
        {
          title: {
            contains: keyword,
          },
        },
        {
          content: {
            contains: keyword,
          },
        },
      ];
    }

    if (clubId) {
      where.clubId = String(clubId);
    }

    if (status) {
      where.status = status;
    } else {
      where.status = "published";
    }

    if (pinned !== undefined) {
      where.isPinned = pinned === "true";
    }

    const announcements = await prisma.announcement.findMany({
      where,
      include: getAnnouncementIncludeFields(),
      orderBy: [
        {
          isPinned: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return successResponse(
      res,
      "Announcements fetched successfully",
      announcements,
      200
    );
  } catch (error) {
    console.error("Get all announcements error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getAnnouncementById(req, res) {
  try {
    const announcementId = Number(req.params.id);

    if (!announcementId) {
      return errorResponse(res, "Invalid announcement id", 400);
    }

    const announcement = await prisma.announcement.findUnique({
      where: {
        id: announcementId,
      },
      include: getAnnouncementIncludeFields(),
    });

    if (!announcement) {
      return errorResponse(res, "Announcement not found", 404);
    }

    return successResponse(
      res,
      "Announcement fetched successfully",
      announcement,
      200
    );
  } catch (error) {
    console.error("Get announcement by id error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getClubAnnouncements(req, res) {
  try {
    const clubId = req.params.clubId;

    if (!clubId) {
      return errorResponse(res, "Invalid club id", 400);
    }

    const club = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
    });

    if (!club) {
      return errorResponse(res, "Club not found", 404);
    }

    const announcements = await prisma.announcement.findMany({
      where: {
        clubId,
        status: "published",
      },
      include: getAnnouncementIncludeFields(),
      orderBy: [
        {
          isPinned: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return successResponse(
      res,
      "Club announcements fetched successfully",
      announcements,
      200
    );
  } catch (error) {
    console.error("Get club announcements error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function createAnnouncementForClub(req, res) {
  try {
    const clubId = req.params.clubId;
    const { title, content, status, isPinned } = req.body;

    if (!clubId) {
      return errorResponse(res, "Invalid club id", 400);
    }

    if (!title || !String(title).trim()) {
      return errorResponse(res, "Announcement title is required", 400);
    }

    if (!content || !String(content).trim()) {
      return errorResponse(res, "Announcement content is required", 400);
    }

    const finalStatus = status || "published";

    if (!VALID_ANNOUNCEMENT_STATUS.includes(finalStatus)) {
      return errorResponse(
        res,
        "Invalid status. Status must be draft, published, or archived",
        400
      );
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
      return errorResponse(
        res,
        "You do not have permission to create announcements for this club",
        403
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        clubId,
        createdById: req.user.id,
        title: String(title).trim(),
        content: String(content).trim(),
        status: finalStatus,
        isPinned: Boolean(isPinned),
      },
      include: getAnnouncementIncludeFields(),
    });

    return successResponse(
      res,
      "Announcement created successfully",
      announcement,
      201
    );
  } catch (error) {
    console.error("Create announcement error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function updateAnnouncementById(req, res) {
  try {
    const announcementId = Number(req.params.id);

    if (!announcementId) {
      return errorResponse(res, "Invalid announcement id", 400);
    }

    const existingAnnouncement = await prisma.announcement.findUnique({
      where: {
        id: announcementId,
      },
      include: {
        club: true,
      },
    });

    if (!existingAnnouncement) {
      return errorResponse(res, "Announcement not found", 404);
    }

    if (!canManageClub(req.user, existingAnnouncement.club)) {
      return errorResponse(
        res,
        "You do not have permission to update this announcement",
        403
      );
    }

    const { title, content, status, isPinned } = req.body;

    if (status !== undefined && !VALID_ANNOUNCEMENT_STATUS.includes(status)) {
      return errorResponse(
        res,
        "Invalid status. Status must be draft, published, or archived",
        400
      );
    }

    const updatedAnnouncement = await prisma.announcement.update({
      where: {
        id: announcementId,
      },
      data: {
        title:
          title !== undefined ? String(title).trim() : existingAnnouncement.title,
        content:
          content !== undefined ? String(content).trim() : existingAnnouncement.content,
        status:
          status !== undefined ? status : existingAnnouncement.status,
        isPinned:
          isPinned !== undefined ? Boolean(isPinned) : existingAnnouncement.isPinned,
      },
      include: getAnnouncementIncludeFields(),
    });

    return successResponse(
      res,
      "Announcement updated successfully",
      updatedAnnouncement,
      200
    );
  } catch (error) {
    console.error("Update announcement error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function deleteAnnouncementById(req, res) {
  try {
    const announcementId = Number(req.params.id);

    if (!announcementId) {
      return errorResponse(res, "Invalid announcement id", 400);
    }

    const existingAnnouncement = await prisma.announcement.findUnique({
      where: {
        id: announcementId,
      },
      include: {
        club: true,
      },
    });

    if (!existingAnnouncement) {
      return errorResponse(res, "Announcement not found", 404);
    }

    if (!canManageClub(req.user, existingAnnouncement.club)) {
      return errorResponse(
        res,
        "You do not have permission to delete this announcement",
        403
      );
    }

    await prisma.announcement.delete({
      where: {
        id: announcementId,
      },
    });

    return successResponse(res, "Announcement deleted successfully", {
      id: announcementId,
    });
  } catch (error) {
    console.error("Delete announcement error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getManagedAnnouncements(req, res) {
  try {
    const where = {};

    if (req.user.role === "club_admin") {
      where.club = {
        createdById: req.user.id,
      };
    }

    const announcements = await prisma.announcement.findMany({
      where,
      include: getAnnouncementIncludeFields(),
      orderBy: [
        {
          isPinned: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return successResponse(
      res,
      "Managed announcements fetched successfully",
      announcements,
      200
    );
  } catch (error) {
    console.error("Get managed announcements error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

module.exports = {
  getAllAnnouncements,
  getAnnouncementById,
  getClubAnnouncements,
  createAnnouncementForClub,
  updateAnnouncementById,
  deleteAnnouncementById,
  getManagedAnnouncements,
};