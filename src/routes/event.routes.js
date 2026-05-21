const express = require("express");
const router = express.Router();

const {
  getAllEvents,
  getEventById,
  createEventForClub,
  updateEventById,
  deleteEventById,
  uploadEventPosterById,
  signupEvent,
  cancelEventSignup,
  getEventSignups,
  getEventSignupCount,
} = require("../controllers/event.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requireRoles } = require("../middleware/role.middleware");
const { uploadEventPoster } = require("../middleware/upload.middleware");

router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);
router.get("/events/:id/signup-count", getEventSignupCount);

router.post(
  "/clubs/:clubId/events",
  authenticate,
  requireRoles("club_admin", "super_admin"),
  createEventForClub
);

router.put("/events/:id", authenticate, updateEventById);
router.delete("/events/:id", authenticate, deleteEventById);

router.post(
  "/events/:id/poster",
  authenticate,
  uploadEventPoster.single("poster"),
  uploadEventPosterById
);

router.post("/events/:id/signup", authenticate, signupEvent);
router.delete("/events/:id/signup", authenticate, cancelEventSignup);
router.get("/events/:id/signups", authenticate, getEventSignups);

module.exports = router;