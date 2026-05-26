const multer = require("multer");
const path = require("path");
const fs = require("fs");

const rootUploadDir = path.join(__dirname, "..", "..", "uploads");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function createStorage(folderName) {
  const uploadDir = path.join(rootUploadDir, folderName);
  ensureDir(uploadDir);

  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname || "").toLowerCase();
      const safeExt = ext || getExtByMimeType(file.mimetype);
      const uniqueName = `${folderName}-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${safeExt}`;

      cb(null, uniqueName);
    },
  });
}

function getExtByMimeType(mimetype) {
  const map = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/avif": ".avif",
  };

  return map[mimetype] || "";
}

function imageFileFilter(req, file, cb) {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  return cb(
    new Error("Only image files are allowed: jpg, jpeg, png, webp, gif, avif"),
    false
  );
}

const uploadAvatar = multer({
  storage: createStorage("avatars"),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

const uploadClubLogo = multer({
  storage: createStorage("clubs"),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

const uploadEventPoster = multer({
  storage: createStorage("events"),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadGalleryImage = multer({
  storage: createStorage("gallery"),
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