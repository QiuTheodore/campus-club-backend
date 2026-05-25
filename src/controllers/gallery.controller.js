const prisma = require("../config/prisma");
const { successResponse, errorResponse } = require("../utils/response");

function canManageClub(user, club) {
  if (!user || !club) return false;

  if (user.role === "super_admin") {
    return true;
  }

  if (user.role === "club_admin" && club.createdById === user.id) {
    return true;
  }

  return false;
}

function getGalleryIncludeFields() {
  return {
    club: {
      select: {
        id: true,
        name: true,
        chineseName: true,
        englishName: true,
        category: true,
        logo: true,
        status: true,
        createdById: true,
      },
    },
    uploadedBy: {
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    },
  };
}

async function getClubGallery(req, res) {
  try {
    const clubId = req.params.clubId;

    if (!clubId) {
      return errorResponse(res, "Invalid club id", 400);
    }

    const club = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
    });

    if (!club) {
      return errorResponse(res, "Club not found", 404);
    }

    const images = await prisma.clubGalleryImage.findMany({
      where: {
        clubId,
      },
      include: getGalleryIncludeFields(),
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse(res, "Club gallery fetched successfully", images, 200);
  } catch (error) {
    console.error("Get club gallery error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function uploadClubGalleryImage(req, res) {
  try {
    const clubId = req.params.clubId;
    const { title, description } = req.body;

    if (!clubId) {
      return errorResponse(res, "Invalid club id", 400);
    }

    if (!req.file) {
      return errorResponse(res, "Gallery image file is required", 400);
    }

    const club = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
    });

    if (!club) {
      return errorResponse(res, "Club not found", 404);
    }

    if (!canManageClub(req.user, club)) {
      return errorResponse(res, "You do not have permission to upload images for this club", 403);
    }

    const imageUrl = `/uploads/gallery/${req.file.filename}`;

    const image = await prisma.clubGalleryImage.create({
      data: {
        clubId,
        uploadedById: req.user.id,
        imageUrl,
        title: title || null,
        description: description || null,
      },
      include: getGalleryIncludeFields(),
    });

    return successResponse(res, "Gallery image uploaded successfully", image, 201);
  } catch (error) {
    console.error("Upload gallery image error:", error);
    return errorResponse(res, error.message || "Server error", 500);
  }
}

async function updateGalleryImage(req, res) {
  try {
    const imageId = req.params.imageId;
    const { title, description } = req.body;

    if (!imageId) {
      return errorResponse(res, "Invalid image id", 400);
    }

    const image = await prisma.clubGalleryImage.findUnique({
      where: {
        id: imageId,
      },
      include: {
        club: true,
      },
    });

    if (!image) {
      return errorResponse(res, "Gallery image not found", 404);
    }

    if (!canManageClub(req.user, image.club)) {
      return errorResponse(res, "You do not have permission to update this gallery image", 403);
    }

    const updatedImage = await prisma.clubGalleryImage.update({
      where: {
        id: imageId,
      },
      data: {
        title: title !== undefined ? title : image.title,
        description: description !== undefined ? description : image.description,
      },
      include: getGalleryIncludeFields(),
    });

    return successResponse(res, "Gallery image updated successfully", updatedImage, 200);
  } catch (error) {
    console.error("Update gallery image error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function deleteGalleryImage(req, res) {
  try {
    const imageId = req.params.imageId;

    if (!imageId) {
      return errorResponse(res, "Invalid image id", 400);
    }

    const image = await prisma.clubGalleryImage.findUnique({
      where: {
        id: imageId,
      },
      include: {
        club: true,
      },
    });

    if (!image) {
      return errorResponse(res, "Gallery image not found", 404);
    }

    if (!canManageClub(req.user, image.club)) {
      return errorResponse(res, "You do not have permission to delete this gallery image", 403);
    }

    await prisma.clubGalleryImage.delete({
      where: {
        id: imageId,
      },
    });

    return successResponse(res, "Gallery image deleted successfully", {
      id: imageId,
    });
  } catch (error) {
    console.error("Delete gallery image error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

module.exports = {
  getClubGallery,
  uploadClubGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
};