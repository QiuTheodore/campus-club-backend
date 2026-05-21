const prisma = require("../config/prisma");
const { successResponse, errorResponse } = require("../utils/response");

const VALID_ROLES = ["student", "club_admin", "super_admin"];

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

async function getAdminUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: getUserSelectFields(),
      orderBy: {
        id: "asc",
      },
    });

    return successResponse(res, "Admin users fetched successfully", users, 200);
  } catch (error) {
    console.error("Admin get users error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getAdminUserById(req, res) {
  try {
    const userId = Number(req.params.id);

    if (!userId) {
      return errorResponse(res, "Invalid user id", 400);
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

    return successResponse(res, "Admin user fetched successfully", user, 200);
  } catch (error) {
    console.error("Admin get user by id error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function updateUserRole(req, res) {
  try {
    const userId = Number(req.params.id);
    const { role } = req.body;

    if (!userId) {
      return errorResponse(res, "Invalid user id", 400);
    }

    if (!role) {
      return errorResponse(res, "Role is required", 400);
    }

    if (!VALID_ROLES.includes(role)) {
      return errorResponse(
        res,
        "Invalid role. Role must be student, club_admin, or super_admin",
        400
      );
    }

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
        role,
      },
      select: getUserSelectFields(),
    });

    return successResponse(res, "User role updated successfully", updatedUser, 200);
  } catch (error) {
    console.error("Update user role error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function deleteUserById(req, res) {
  try {
    const userId = Number(req.params.id);

    if (!userId) {
      return errorResponse(res, "Invalid user id", 400);
    }

    if (req.user.id === userId) {
      return errorResponse(res, "You cannot delete your own account", 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return errorResponse(res, "User not found", 404);
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return successResponse(res, "User deleted successfully", {
      id: userId,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

module.exports = {
  getAdminUsers,
  getAdminUserById,
  updateUserRole,
  deleteUserById,
};