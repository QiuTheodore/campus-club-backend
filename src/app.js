const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const clubRoutes = require("./routes/club.routes");
const eventRoutes = require("./routes/event.routes");
const announcementRoutes = require("./routes/announcement.routes");
const commentRoutes = require("./routes/comment.routes");

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file access
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Home test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Campus Club Backend API is running",
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api", eventRoutes);
app.use("/api", announcementRoutes);
app.use("/api", commentRoutes);

// 404 route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File size must be less than 2MB",
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;