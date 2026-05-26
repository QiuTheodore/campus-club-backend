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
    createdAt: true,
    updatedAt: true,
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
  };
}

function buildHighlightText(club, event, galleryImage) {
  if (event?.title) {
    return event.description
      ? `${event.title} · ${event.description}`
      : event.title;
  }

  if (galleryImage?.title) {
    return galleryImage.description
      ? `${galleryImage.title} · ${galleryImage.description}`
      : galleryImage.title;
  }

  return (
    club.description ||
    club.mission ||
    club.purpose ||
    "Explore this club and discover more campus activities."
  );
}

function buildHighlightImage(club, event, galleryImage) {
  return (
    event?.poster ||
    galleryImage?.imageUrl ||
    club.logo ||
    ""
  );
}

async function getHighlights(req, res) {
  try {
    const limit = Number(req.query.limit) || 5;

    const clubs = await prisma.club.findMany({
      where: {
        status: "active",
      },
      select: {
        ...getClubSelectFields(),
        events: {
          where: {
            status: "published",
          },
          orderBy: {
            startTime: "asc",
          },
          take: 1,
          select: {
            id: true,
            title: true,
            description: true,
            poster: true,
            startTime: true,
            endTime: true,
            location: true,
            capacity: true,
            status: true,
          },
        },
        galleryImages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            imageUrl: true,
            title: true,
            description: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    const highlights = clubs.map((club) => {
      const event = club.events?.[0] || null;
      const galleryImage = club.galleryImages?.[0] || null;

      const { events, galleryImages, ...clubData } = club;

      return {
        club: clubData,
        image: buildHighlightImage(clubData, event, galleryImage),
        text: buildHighlightText(clubData, event, galleryImage),
      };
    });

    return successResponse(res, "Highlights fetched successfully", highlights, 200);
  } catch (error) {
    console.error("Get highlights error:", error);
    return errorResponse(res, "Server error", 500);
  }
}

module.exports = {
  getHighlights,
};