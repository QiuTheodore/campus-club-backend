const express = require("express");
const router = express.Router();

const {
  getMe,
  updateMe,
  uploadMyAvatar,
  getAllUsers,
  getUserById,
  updateUserById,
  uploadUserAvatar,
} = require("../controllers/user.controller");

const {
  getMyClubApplications,
  getMyClubs,
} = require("../controllers/club.controller");

const {
  getMyEventSignups,
} = require("../controllers/event.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requireRoles } = require("../middleware/role.middleware");
const { uploadAvatar } = require("../middleware/upload.middleware");

router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateMe);
router.post("/me/avatar", authenticate, uploadAvatar.single("avatar"), uploadMyAvatar);

router.get("/me/club-applications", authenticate, getMyClubApplications);
router.get("/me/clubs", authenticate, getMyClubs);
router.get("/me/event-signups", authenticate, getMyEventSignups);

router.get("/", authenticate, requireRoles("super_admin"), getAllUsers);
router.get("/:id", authenticate, getUserById);
router.put("/:id", authenticate, updateUserById);
router.post("/:id/avatar", authenticate, uploadAvatar.single("avatar"), uploadUserAvatar);

module.exports = router;