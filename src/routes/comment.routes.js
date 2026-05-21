const express = require("express");
const router = express.Router();

const {
  getEventComments,
  createEventComment,
  deleteEventComment,
  getMyEventComments,
  getManagedEventComments,
} = require("../controllers/comment.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requireRoles } = require("../middleware/role.middleware");

router.get("/events/:id/comments", getEventComments);

router.post("/events/:id/comments", authenticate, createEventComment);

router.delete("/comments/:commentId", authenticate, deleteEventComment);

router.get("/users/me/comments", authenticate, getMyEventComments);

router.get(
  "/manage/comments",
  authenticate,
  requireRoles("club_admin", "super_admin"),
  getManagedEventComments
);

module.exports = router;