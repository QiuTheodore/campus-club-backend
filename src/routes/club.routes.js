const express = require("express");
const router = express.Router();

const {
  getAllClubs,
  getClubById,
  createClub,
  updateClubById,
  deleteClubById,
  uploadClubLogoById,
  applyToClub,
  getClubApplications,
  approveClubApplication,
  rejectClubApplication,
  getClubMembers,
  removeClubMember,
} = require("../controllers/club.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requireRoles } = require("../middleware/role.middleware");
const { uploadClubLogo } = require("../middleware/upload.middleware");

router.get("/", getAllClubs);
router.get("/:id", getClubById);

router.post("/", authenticate, requireRoles("club_admin", "super_admin"), createClub);
router.put("/:id", authenticate, updateClubById);
router.delete("/:id", authenticate, deleteClubById);

router.post("/:id/logo", authenticate, uploadClubLogo.single("logo"), uploadClubLogoById);

router.post("/:id/apply", authenticate, applyToClub);
router.get("/:id/applications", authenticate, getClubApplications);
router.put("/:clubId/applications/:applicationId/approve", authenticate, approveClubApplication);
router.put("/:clubId/applications/:applicationId/reject", authenticate, rejectClubApplication);

router.get("/:id/members", authenticate, getClubMembers);
router.delete("/:clubId/members/:userId", authenticate, removeClubMember);

module.exports = router;