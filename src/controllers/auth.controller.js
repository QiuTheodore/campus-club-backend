const prisma = require("../config/prisma");
const { successResponse, errorResponse } = require("../utils/response");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/token");

function isWkuEmail(email) {
  return typeof email === "string" && email.toLowerCase().endsWith("@wku.edu.cn");
}

function getSafeUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    studentId: user.studentId,
    major: user.major,
    grade: user.grade,
    bio: user.bio,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function register(req, res) {
  try {
    const { email, password, name, studentId, major, grade } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!isWkuEmail(normalizedEmail)) {
      return errorResponse(res, "Only @wku.edu.cn email is allowed", 400);
    }

    if (password.length < 6) {
      return errorResponse(res, "Password must be at least 6 characters", 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return errorResponse(res, "Email already registered", 409);
    }

    const encryptedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: encryptedPassword,
        role: "student",
        name: name || null,
        studentId: studentId || null,
        major: major || null,
        grade: grade || null,
      },
    });

    const token = generateToken(user);

    return successResponse(
      res,
      "Register successful",
      {
        token,
        user: getSafeUser(user),
      },
      201
    );
  } catch (error) {
    console.error("Register error:", error);

    if (error.code === "P2002") {
      return errorResponse(res, "Email or student ID already exists", 409);
    }

    return errorResponse(res, "Server error", 500);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    const token = generateToken(user);

    return successResponse(res, "Login successful", {
      token,
      user: getSafeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

module.exports = {
  register,
  login,
};