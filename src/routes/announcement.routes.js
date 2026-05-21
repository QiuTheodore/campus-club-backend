const express = require("express");
const router = express.Router();

const {
  getAllAnnouncements,
  getAnnouncementById,
  getClubAnnouncements,
  createAnnouncementForClub,
  updateAnnouncementById,
  deleteAnnouncementById,
  getManagedAnnouncements,
} = require("../controllers/announcement.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requireRoles } = require("../middleware/role.middleware");

router.get("/announcements", getAllAnnouncements);
router.get("/announcements/:id", getAnnouncementById);

router.get("/clubs/:clubId/announcements", getClubAnnouncements);

router.post(
  "/clubs/:clubId/announcements",
  authenticate,
  requireRoles("club_admin", "super_admin"),
  createAnnouncementForClub
);

router.put(
  "/announcements/:id",
  authenticate,
  requireRoles("club_admin", "super_admin"),
  updateAnnouncementById
);

router.delete(
  "/announcements/:id",
  authenticate,
  requireRoles("club_admin", "super_admin"),
  deleteAnnouncementById
);

router.get(
  "/manage/announcements",
  authenticate,
  requireRoles("club_admin", "super_admin"),
  getManagedAnnouncements
);

module.exports = router;