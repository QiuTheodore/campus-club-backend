const express = require("express");
const router = express.Router();

const {
  getClubComments,
  createClubComment,
  deleteClubComment,
  getMyClubComments,
  getManagedClubComments,
} = require("../controllers/comment.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requireRoles } = require("../middleware/role.middleware");

router.get("/clubs/:clubId/comments", getClubComments);

router.post("/clubs/:clubId/comments", authenticate, createClubComment);

router.delete("/comments/:commentId", authenticate, deleteClubComment);

router.get("/users/me/comments", authenticate, getMyClubComments);

router.get(
  "/manage/comments",
  authenticate,
  requireRoles("club_admin", "super_admin"),
  getManagedClubComments
);

module.exports = router;