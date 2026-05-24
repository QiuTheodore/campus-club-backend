const multer = require("multer");
const path = require("path");
const fs = require("fs");

const avatarDir = path.join(__dirname, "..", "..", "uploads", "avatars");
const clubLogoDir = path.join(__dirname, "..", "..", "uploads", "clubs");
const eventPosterDir = path.join(__dirname, "..", "..", "uploads", "events");
const galleryDir = path.join(__dirname, "..", "..", "uploads", "gallery");

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDirExists(avatarDir);
ensureDirExists(clubLogoDir);
ensureDirExists(eventPosterDir);
ensureDirExists(galleryDir);

function imageFileFilter(req, file, cb) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, and WEBP images are allowed"), false);
  }

  cb(null, true);
}

function createStorage(destinationDir, prefix) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destinationDir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      const fileName = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, fileName);
    },
  });
}

const uploadAvatar = multer({
  storage: createStorage(avatarDir, "avatar"),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

const uploadClubLogo = multer({
  storage: createStorage(clubLogoDir, "club-logo"),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

const uploadEventPoster = multer({
  storage: createStorage(eventPosterDir, "event-poster"),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

const uploadGalleryImage = multer({
  storage: createStorage(galleryDir, "gallery"),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  uploadAvatar,
  uploadClubLogo,
  uploadEventPoster,
  uploadGalleryImage,
};