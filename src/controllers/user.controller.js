const prisma = require("../config/prisma");
const { successResponse, errorResponse } = require("../utils/response");

function getUserSelectFields() {
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
    createdAt: true,
    updatedAt: true,
  };
}

async function getMe(req, res) {
  try {
    return successResponse(res, "Current user fetched successfully", req.user, 200);
  } catch (error) {
    console.error("Get me error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function updateMe(req, res) {
  try {
    const { name, studentId, major, grade, bio } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        name: name !== undefined ? name : req.user.name,
        studentId: studentId !== undefined ? studentId : req.user.studentId,
        major: major !== undefined ? major : req.user.major,
        grade: grade !== undefined ? grade : req.user.grade,
        bio: bio !== undefined ? bio : req.user.bio,
      },
      select: getUserSelectFields(),
    });

    return successResponse(res, "Profile updated successfully", updatedUser, 200);
  } catch (error) {
    console.error("Update me error:", error);

    if (error.code === "P2002") {
      return errorResponse(res, "Student ID already exists", 409);
    }

    return errorResponse(res, "Server error", 500);
  }
}

async function uploadMyAvatar(req, res) {
  try {
    if (!req.file) {
      return errorResponse(res, "Avatar file is required", 400);
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        avatar: avatarUrl,
      },
      select: getUserSelectFields(),
    });

    return successResponse(res, "Avatar uploaded successfully", updatedUser, 200);
  } catch (error) {
    console.error("Upload my avatar error:", error);
    return errorResponse(res, error.message || "Server error", 500);
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: getUserSelectFields(),
      orderBy: {
        id: "asc",
      },
    });

    return successResponse(res, "Users fetched successfully", users, 200);
  } catch (error) {
    console.error("Get all users error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getUserById(req, res) {
  try {
    const userId = Number(req.params.id);

    if (!userId) {
      return errorResponse(res, "Invalid user id", 400);
    }

    if (req.user.role !== "super_admin" && req.user.id !== userId) {
      return errorResponse(res, "You can only view your own profile", 403);
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: getUserSelectFields(),
    });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, "User fetched successfully", user, 200);
  } catch (error) {
    console.error("Get user by id error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function updateUserById(req, res) {
  try {
    const userId = Number(req.params.id);

    if (!userId) {
      return errorResponse(res, "Invalid user id", 400);
    }

    if (req.user.role !== "super_admin" && req.user.id !== userId) {
      return errorResponse(res, "You can only update your own profile", 403);
    }

    const { name, studentId, major, grade, bio } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return errorResponse(res, "User not found", 404);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name !== undefined ? name : existingUser.name,
        studentId: studentId !== undefined ? studentId : existingUser.studentId,
        major: major !== undefined ? major : existingUser.major,
        grade: grade !== undefined ? grade : existingUser.grade,
        bio: bio !== undefined ? bio : existingUser.bio,
      },
      select: getUserSelectFields(),
    });

    return successResponse(res, "User updated successfully", updatedUser, 200);
  } catch (error) {
    console.error("Update user error:", error);

    if (error.code === "P2002") {
      return errorResponse(res, "Student ID already exists", 409);
    }

    return errorResponse(res, "Server error", 500);
  }
}

async function uploadUserAvatar(req, res) {
  try {
    const userId = Number(req.params.id);

    if (!userId) {
      return errorResponse(res, "Invalid user id", 400);
    }

    if (req.user.role !== "super_admin" && req.user.id !== userId) {
      return errorResponse(res, "You can only update your own avatar", 403);
    }

    if (!req.file) {
      return errorResponse(res, "Avatar file is required", 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return errorResponse(res, "User not found", 404);
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar: avatarUrl,
      },
      select: getUserSelectFields(),
    });

    return successResponse(res, "Avatar uploaded successfully", updatedUser, 200);
  } catch (error) {
    console.error("Upload avatar error:", error);
    return errorResponse(res, error.message || "Server error", 500);
  }
}

module.exports = {
  getMe,
  updateMe,
  uploadMyAvatar,
  getAllUsers,
  getUserById,
  updateUserById,
  uploadUserAvatar,
};