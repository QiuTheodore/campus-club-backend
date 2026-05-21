const prisma = require("../config/prisma");
const { verifyToken } = require("../utils/token");
const { errorResponse } = require("../utils/response");

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Authentication token is required", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return errorResponse(res, "Authentication token is required", 401);
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
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
      },
    });

    if (!user) {
      return errorResponse(res, "User not found", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return errorResponse(res, "Invalid or expired token", 401);
  }
}

module.exports = {
  authenticate,
};