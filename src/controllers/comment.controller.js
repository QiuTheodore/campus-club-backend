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
    club: {
      select: {
        id: true,
        name: true,
        chineseName: true,
        englishName: true,
        category: true,
        logo: true,
        status: true,
        createdById: true,
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
    comment.club &&
    comment.club.createdById === user.id
  ) {
    return true;
  }

  return false;
}

async function getClubComments(req, res) {
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

    const comments = await prisma.clubComment.findMany({
      where: {
        clubId,
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

    return successResponse(res, "Club comments fetched successfully", comments, 200);
  } catch (error) {
    console.error("Get club comments error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function createClubComment(req, res) {
  try {
    const clubId = req.params.clubId;
    const { content } = req.body;

    if (!clubId) {
      return errorResponse(res, "Invalid club id", 400);
    }

    if (!content || !String(content).trim()) {
      return errorResponse(res, "Comment content is required", 400);
    }

    if (String(content).trim().length > 500) {
      return errorResponse(res, "Comment content must be less than 500 characters", 400);
    }

    const club = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
    });

    if (!club) {
      return errorResponse(res, "Club not found", 404);
    }

    if (club.status !== "active") {
      return errorResponse(res, "This club is not open for comments", 400);
    }

    const comment = await prisma.clubComment.create({
      data: {
        clubId,
        userId: req.user.id,
        content: String(content).trim(),
      },
      include: getCommentIncludeFields(),
    });

    return successResponse(res, "Comment created successfully", comment, 201);
  } catch (error) {
    console.error("Create club comment error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function deleteClubComment(req, res) {
  try {
    const commentId = req.params.commentId;

    if (!commentId) {
      return errorResponse(res, "Invalid comment id", 400);
    }

    const comment = await prisma.clubComment.findUnique({
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

    await prisma.clubComment.delete({
      where: {
        id: commentId,
      },
    });

    return successResponse(res, "Comment deleted successfully", {
      id: commentId,
    });
  } catch (error) {
    console.error("Delete club comment error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getMyClubComments(req, res) {
  try {
    const comments = await prisma.clubComment.findMany({
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
    console.error("Get my club comments error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getManagedClubComments(req, res) {
  try {
    const where = {};

    if (req.user.role === "club_admin") {
      where.club = {
        createdById: req.user.id,
      };
    }

    const comments = await prisma.clubComment.findMany({
      where,
      include: getCommentIncludeFields(),
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse(res, "Managed comments fetched successfully", comments, 200);
  } catch (error) {
    console.error("Get managed club comments error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

module.exports = {
  getClubComments,
  createClubComment,
  deleteClubComment,
  getMyClubComments,
  getManagedClubComments,
};