const express = require("express");
const router = express.Router();

const {
  getClubGallery,
  uploadClubGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} = require("../controllers/gallery.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requireRoles } = require("../middleware/role.middleware");
const { uploadGalleryImage } = require("../middleware/upload.middleware");

router.get("/clubs/:clubId/gallery", getClubGallery);

router.post(
  "/clubs/:clubId/gallery",
  authenticate,
  requireRoles("club_admin", "super_admin"),
  uploadGalleryImage.single("image"),
  uploadClubGalleryImage
);

router.put(
  "/gallery/:imageId",
  authenticate,
  requireRoles("club_admin", "super_admin"),
  updateGalleryImage
);

router.delete(
  "/gallery/:imageId",
  authenticate,
  requireRoles("club_admin", "super_admin"),
  deleteGalleryImage
);

module.exports = router;