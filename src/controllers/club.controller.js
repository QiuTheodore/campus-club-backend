const prisma = require("../config/prisma");
const { successResponse, errorResponse } = require("../utils/response");

function getClubSelectFields() {
  return {
    id: true,
    sourceId: true,
    name: true,
    chineseName: true,
    englishName: true,
    description: true,
    purpose: true,
    mission: true,
    category: true,
    logo: true,
    joinInfo: true,
    reviewer: true,
    status: true,
    createdById: true,
    createdBy: {
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    },
    _count: {
      select: {
        members: true,
        applications: true,
        events: true,
        announcements: true,
        galleryImages: true,
        comments: true,
      },
    },
    createdAt: true,
    updatedAt: true,
  };
}

function getUserSafeFields() {
  return {
    id: true,
    email: true,
    role: true,
    name: true,
    studentId: true,
    major: true,
    grade: true,
    bio: true,
    avatar: true,
  };
}

function canManageClub(user, club) {
  if (!user || !club) return false;
  if (user.role === "super_admin") return true;
  if (user.role === "club_admin" && club.createdById === user.id) return true;
  return false;
}

function normalizeOptionalString(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : null;
}

function buildClubName({ name, chineseName, englishName }) {
  const normalizedName = normalizeOptionalString(name);
  const normalizedEnglishName = normalizeOptionalString(englishName);
  const normalizedChineseName = normalizeOptionalString(chineseName);

  return normalizedEnglishName || normalizedName || normalizedChineseName;
}

async function getAllClubs(req, res) {
  try {
    const { keyword, category, status } = req.query;

    const where = {};

    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { englishName: { contains: keyword } },
        { chineseName: { contains: keyword } },
        { description: { contains: keyword } },
        { purpose: { contains: keyword } },
        { mission: { contains: keyword } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    } else {
      where.status = "active";
    }

    const clubs = await prisma.club.findMany({
      where,
      select: getClubSelectFields(),
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse(res, "Clubs fetched successfully", clubs, 200);
  } catch (error) {
    console.error("Get all clubs error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getClubById(req, res) {
  try {
    const clubId = req.params.id;

    if (!clubId) {
      return errorResponse(res, "Invalid club id", 400);
    }

    const club = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
      select: getClubSelectFields(),
    });

    if (!club) {
      return errorResponse(res, "Club not found", 404);
    }

    return successResponse(res, "Club fetched successfully", club, 200);
  } catch (error) {
    console.error("Get club by id error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function createClub(req, res) {
  try {
    const {
      sourceId,
      name,
      chineseName,
      englishName,
      description,
      purpose,
      mission,
      category,
      joinInfo,
      reviewer,
    } = req.body;

    const finalName = buildClubName({
      name,
      chineseName,
      englishName,
    });

    if (!finalName) {
      return errorResponse(res, "Club name, English name, or Chinese name is required", 400);
    }

    const club = await prisma.club.create({
      data: {
        sourceId: sourceId !== undefined && sourceId !== null && sourceId !== "" ? Number(sourceId) : null,
        name: finalName,
        chineseName: normalizeOptionalString(chineseName),
        englishName: normalizeOptionalString(englishName) || finalName,
        description: normalizeOptionalString(description),
        purpose: normalizeOptionalString(purpose),
        mission: normalizeOptionalString(mission),
        category: normalizeOptionalString(category),
        joinInfo: normalizeOptionalString(joinInfo),
        reviewer: normalizeOptionalString(reviewer),
        status: "active",
        createdById: req.user.id,
      },
      select: getClubSelectFields(),
    });

    await prisma.clubMember.create({
      data: {
        clubId: club.id,
        userId: req.user.id,
        role: "president",
      },
    });

    return successResponse(res, "Club created successfully", club, 201);
  } catch (error) {
    console.error("Create club error:", error);

    if (error.code === "P2002") {
      return errorResponse(res, "Club name or source ID already exists", 409);
    }

    return errorResponse(res, "Server error", 500);
  }
}

async function updateClubById(req, res) {
  try {
    const clubId = req.params.id;

    if (!clubId) {
      return errorResponse(res, "Invalid club id", 400);
    }

    const existingClub = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
    });

    if (!existingClub) {
      return errorResponse(res, "Club not found", 404);
    }

    if (!canManageClub(req.user, existingClub)) {
      return errorResponse(res, "You do not have permission to manage this club", 403);
    }

    const {
      sourceId,
      name,
      chineseName,
      englishName,
      description,
      purpose,
      mission,
      category,
      joinInfo,
      reviewer,
      status,
    } = req.body;

    const hasNameUpdate =
      name !== undefined || chineseName !== undefined || englishName !== undefined;

    const finalName = hasNameUpdate
      ? buildClubName({
          name: name !== undefined ? name : existingClub.name,
          chineseName: chineseName !== undefined ? chineseName : existingClub.chineseName,
          englishName: englishName !== undefined ? englishName : existingClub.englishName,
        })
      : existingClub.name;

    if (!finalName) {
      return errorResponse(res, "Club name, English name, or Chinese name is required", 400);
    }

    const updatedClub = await prisma.club.update({
      where: {
        id: clubId,
      },
      data: {
        sourceId:
          sourceId !== undefined
            ? sourceId !== null && sourceId !== ""
              ? Number(sourceId)
              : null
            : existingClub.sourceId,
        name: finalName,
        chineseName:
          chineseName !== undefined
            ? normalizeOptionalString(chineseName)
            : existingClub.chineseName,
        englishName:
          englishName !== undefined
            ? normalizeOptionalString(englishName) || finalName
            : existingClub.englishName,
        description:
          description !== undefined
            ? normalizeOptionalString(description)
            : existingClub.description,
        purpose:
          purpose !== undefined
            ? normalizeOptionalString(purpose)
            : existingClub.purpose,
        mission:
          mission !== undefined
            ? normalizeOptionalString(mission)
            : existingClub.mission,
        category:
          category !== undefined
            ? normalizeOptionalString(category)
            : existingClub.category,
        joinInfo:
          joinInfo !== undefined
            ? normalizeOptionalString(joinInfo)
            : existingClub.joinInfo,
        reviewer:
          reviewer !== undefined
            ? normalizeOptionalString(reviewer)
            : existingClub.reviewer,
        status: status !== undefined ? status : existingClub.status,
      },
      select: getClubSelectFields(),
    });

    return successResponse(res, "Club updated successfully", updatedClub, 200);
  } catch (error) {
    console.error("Update club error:", error);

    if (error.code === "P2002") {
      return errorResponse(res, "Club name or source ID already exists", 409);
    }

    return errorResponse(res, "Server error", 500);
  }
}

async function deleteClubById(req, res) {
  try {
    const clubId = req.params.id;

    if (!clubId) {
      return errorResponse(res, "Invalid club id", 400);
    }

    const existingClub = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
    });

    if (!existingClub) {
      return errorResponse(res, "Club not found", 404);
    }

    if (!canManageClub(req.user, existingClub)) {
      return errorResponse(res, "You do not have permission to delete this club", 403);
    }

    await prisma.club.delete({
      where: {
        id: clubId,
      },
    });

    return successResponse(res, "Club deleted successfully", {
      id: clubId,
    });
  } catch (error) {
    console.error("Delete club error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function uploadClubLogoById(req, res) {
  try {
    const clubId = req.params.id;

    if (!clubId) {
      return errorResponse(res, "Invalid club id", 400);
    }

    if (!req.file) {
      return errorResponse(res, "Club logo file is required", 400);
    }

    const existingClub = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
    });

    if (!existingClub) {
      return errorResponse(res, "Club not found", 404);
    }

    if (!canManageClub(req.user, existingClub)) {
      return errorResponse(res, "You do not have permission to upload logo for this club", 403);
    }

    const logoUrl = `/uploads/clubs/${req.file.filename}`;

    const updatedClub = await prisma.club.update({
      where: {
        id: clubId,
      },
      data: {
        logo: logoUrl,
      },
      select: getClubSelectFields(),
    });

    return successResponse(res, "Club logo uploaded successfully", updatedClub, 200);
  } catch (error) {
    console.error("Upload club logo error:", error);
    return errorResponse(res, error.message || "Server error", 500);
  }
}

async function applyToClub(req, res) {
  try {
    const clubId = req.params.id;
    const { reason } = req.body;

    if (!clubId) {
      return errorResponse(res, "Invalid club id", 400);
    }

    if (!reason || !String(reason).trim()) {
      return errorResponse(res, "Application reason is required", 400);
    }

    const club = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
    });

    if (!club) {
      return errorResponse(res, "Club not found", 404);
    }

    if (club.status !== "active") {
      return errorResponse(res, "This club is not accepting applications", 400);
    }

    const existingMember = await prisma.clubMember.findUnique({
      where: {
        clubId_userId: {
          clubId,
          userId: req.user.id,
        },
      },
    });

    if (existingMember) {
      return errorResponse(res, "You are already a member of this club", 409);
    }

    const existingApplication = await prisma.clubApplication.findUnique({
      where: {
        clubId_userId: {
          clubId,
          userId: req.user.id,
        },
      },
    });

    if (existingApplication && existingApplication.status === "pending") {
      return errorResponse(res, "You already have a pending application for this club", 409);
    }

    if (existingApplication && existingApplication.status === "approved") {
      return errorResponse(res, "Your application has already been approved", 409);
    }

    const application = await prisma.clubApplication.upsert({
      where: {
        clubId_userId: {
          clubId,
          userId: req.user.id,
        },
      },
      update: {
        reason: String(reason).trim(),
        status: "pending",
        reviewedById: null,
        reviewedAt: null,
      },
      create: {
        clubId,
        userId: req.user.id,
        reason: String(reason).trim(),
        status: "pending",
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            chineseName: true,
            englishName: true,
            category: true,
            logo: true,
          },
        },
        user: {
          select: getUserSafeFields(),
        },
      },
    });

    return successResponse(res, "Club application submitted successfully", application, 201);
  } catch (error) {
    console.error("Apply to club error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getClubApplications(req, res) {
  try {
    const clubId = req.params.id;

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

    if (!canManageClub(req.user, club)) {
      return errorResponse(res, "You do not have permission to view applications for this club", 403);
    }

    const applications = await prisma.clubApplication.findMany({
      where: {
        clubId,
      },
      include: {
        user: {
          select: getUserSafeFields(),
        },
        reviewedBy: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse(res, "Club applications fetched successfully", applications, 200);
  } catch (error) {
    console.error("Get club applications error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function approveClubApplication(req, res) {
  try {
    const clubId = req.params.clubId;
    const applicationId = req.params.applicationId;

    if (!clubId || !applicationId) {
      return errorResponse(res, "Invalid club id or application id", 400);
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
      return errorResponse(res, "You do not have permission to approve applications for this club", 403);
    }

    const application = await prisma.clubApplication.findFirst({
      where: {
        id: applicationId,
        clubId,
      },
    });

    if (!application) {
      return errorResponse(res, "Application not found", 404);
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedApplication = await tx.clubApplication.update({
        where: {
          id: applicationId,
        },
        data: {
          status: "approved",
          reviewedById: req.user.id,
          reviewedAt: new Date(),
        },
        include: {
          user: {
            select: getUserSafeFields(),
          },
          club: {
            select: {
              id: true,
              name: true,
              chineseName: true,
              englishName: true,
            },
          },
          reviewedBy: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
            },
          },
        },
      });

      await tx.clubMember.upsert({
        where: {
          clubId_userId: {
            clubId,
            userId: application.userId,
          },
        },
        update: {
          role: "member",
        },
        create: {
          clubId,
          userId: application.userId,
          role: "member",
        },
      });

      return updatedApplication;
    });

    return successResponse(res, "Club application approved successfully", result, 200);
  } catch (error) {
    console.error("Approve club application error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function rejectClubApplication(req, res) {
  try {
    const clubId = req.params.clubId;
    const applicationId = req.params.applicationId;

    if (!clubId || !applicationId) {
      return errorResponse(res, "Invalid club id or application id", 400);
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
      return errorResponse(res, "You do not have permission to reject applications for this club", 403);
    }

    const application = await prisma.clubApplication.findFirst({
      where: {
        id: applicationId,
        clubId,
      },
    });

    if (!application) {
      return errorResponse(res, "Application not found", 404);
    }

    const updatedApplication = await prisma.clubApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status: "rejected",
        reviewedById: req.user.id,
        reviewedAt: new Date(),
      },
      include: {
        user: {
          select: getUserSafeFields(),
        },
        club: {
          select: {
            id: true,
            name: true,
            chineseName: true,
            englishName: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return successResponse(res, "Club application rejected successfully", updatedApplication, 200);
  } catch (error) {
    console.error("Reject club application error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getClubMembers(req, res) {
  try {
    const clubId = req.params.id;

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

    const members = await prisma.clubMember.findMany({
      where: {
        clubId,
      },
      include: {
        user: {
          select: getUserSafeFields(),
        },
      },
      orderBy: {
        joinedAt: "asc",
      },
    });

    return successResponse(res, "Club members fetched successfully", members, 200);
  } catch (error) {
    console.error("Get club members error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function removeClubMember(req, res) {
  try {
    const clubId = req.params.clubId;
    const userId = req.params.userId;

    if (!clubId || !userId) {
      return errorResponse(res, "Invalid club id or user id", 400);
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
      return errorResponse(res, "You do not have permission to remove members from this club", 403);
    }

    const member = await prisma.clubMember.findUnique({
      where: {
        clubId_userId: {
          clubId,
          userId,
        },
      },
    });

    if (!member) {
      return errorResponse(res, "Club member not found", 404);
    }

    await prisma.clubMember.delete({
      where: {
        clubId_userId: {
          clubId,
          userId,
        },
      },
    });

    return successResponse(res, "Club member removed successfully", {
      clubId,
      userId,
    });
  } catch (error) {
    console.error("Remove club member error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getMyClubApplications(req, res) {
  try {
    const applications = await prisma.clubApplication.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            chineseName: true,
            englishName: true,
            description: true,
            category: true,
            logo: true,
            status: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse(res, "My club applications fetched successfully", applications, 200);
  } catch (error) {
    console.error("Get my club applications error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

async function getMyClubs(req, res) {
  try {
    const memberships = await prisma.clubMember.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        club: {
          select: getClubSelectFields(),
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
    });

    return successResponse(res, "My clubs fetched successfully", memberships, 200);
  } catch (error) {
    console.error("Get my clubs error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

module.exports = {
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
  getMyClubApplications,
  getMyClubs,
};