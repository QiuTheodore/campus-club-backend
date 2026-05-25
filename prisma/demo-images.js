const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const projectRoot = path.join(__dirname, "..");
const sourceDir = path.join(projectRoot, "demo-images");

const uploadsDir = path.join(projectRoot, "uploads");
const clubUploadDir = path.join(uploadsDir, "clubs");
const eventUploadDir = path.join(uploadsDir, "events");
const galleryUploadDir = path.join(uploadsDir, "gallery");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyImage(sourceFileName, targetDir, targetFileName) {
  const sourcePath = path.join(sourceDir, sourceFileName);
  const targetPath = path.join(targetDir, targetFileName);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Image not found: ${sourcePath}`);
  }

  fs.copyFileSync(sourcePath, targetPath);

  if (targetDir === clubUploadDir) {
    return `/uploads/clubs/${targetFileName}`;
  }

  if (targetDir === eventUploadDir) {
    return `/uploads/events/${targetFileName}`;
  }

  if (targetDir === galleryUploadDir) {
    return `/uploads/gallery/${targetFileName}`;
  }

  throw new Error("Unknown target directory");
}

const imageMap = [
  {
    clubName: "Street Dance Club",
    logoSource: "dance logo.png",
    logoTarget: "street-dance-logo.png",
    eventSource: "dance event.png",
    eventTarget: "street-dance-event.png",
    gallerySource: "dance gallery.png",
    galleryTarget: "street-dance-gallery.png",
    galleryTitle: "Street Dance Practice Moment",
    galleryDescription: "A dynamic moment from a street dance performance and rehearsal.",
  },
  {
    clubName: "Food Lovers Club",
    logoSource: "food logo.png",
    logoTarget: "food-lovers-logo.png",
    eventSource: "food event.png",
    eventTarget: "food-lovers-event.png",
    gallerySource: "food gallery.png",
    galleryTarget: "food-lovers-gallery.png",
    galleryTitle: "Food Sharing Preparation",
    galleryDescription: "Students preparing and sharing snacks during a food club gathering.",
  },
  {
    clubName: "Light by Light Psychology Club",
    logoSource: "psychology logo.png",
    logoTarget: "psychology-logo.png",
    eventSource: "psychology event.png",
    eventTarget: "psychology-event.png",
    gallerySource: "psychology gallery.png",
    galleryTarget: "psychology-gallery.png",
    galleryTitle: "Mindful Campus Moment",
    galleryDescription: "A warm and supportive activity moment from the psychology club.",
  },
  {
    clubName: "French Club",
    logoSource: "french logo.png",
    logoTarget: "french-logo.png",
    eventSource: "french event.png",
    eventTarget: "french-event.png",
    gallerySource: "french gallery.png",
    galleryTarget: "french-gallery.png",
    galleryTitle: "French Culture Activity",
    galleryDescription: "A French language and culture activity prepared by club members.",
  },
  {
    clubName: "Turing Computer Club",
    logoSource: "Turing logo.png",
    logoTarget: "turing-logo.png",
    eventSource: "Turing event.png",
    eventTarget: "turing-event.png",
    gallerySource: "Turing gallery.png",
    galleryTarget: "turing-gallery.png",
    galleryTitle: "Coding Workshop Moment",
    galleryDescription: "Students working together during a coding and AI project workshop.",
  },
];

async function main() {
  ensureDir(clubUploadDir);
  ensureDir(eventUploadDir);
  ensureDir(galleryUploadDir);

  for (const item of imageMap) {
    const club = await prisma.club.findFirst({
      where: {
        OR: [
          { name: item.clubName },
          { englishName: item.clubName },
        ],
      },
      include: {
        events: true,
      },
    });

    if (!club) {
      console.warn(`Club not found: ${item.clubName}`);
      continue;
    }

    const logoUrl = copyImage(item.logoSource, clubUploadDir, item.logoTarget);
    const eventPosterUrl = copyImage(item.eventSource, eventUploadDir, item.eventTarget);
    const galleryUrl = copyImage(item.gallerySource, galleryUploadDir, item.galleryTarget);

    await prisma.club.update({
      where: {
        id: club.id,
      },
      data: {
        logo: logoUrl,
      },
    });

    const firstEvent = club.events[0];

    if (firstEvent) {
      await prisma.event.update({
        where: {
          id: firstEvent.id,
        },
        data: {
          poster: eventPosterUrl,
        },
      });
    } else {
      console.warn(`No event found for club: ${item.clubName}`);
    }

    await prisma.clubGalleryImage.deleteMany({
      where: {
        clubId: club.id,
      },
    });

    await prisma.clubGalleryImage.create({
      data: {
        clubId: club.id,
        uploadedById: club.createdById,
        imageUrl: galleryUrl,
        title: item.galleryTitle,
        description: item.galleryDescription,
      },
    });

    console.log(`Images imported for ${item.clubName}`);
  }

  console.log("All demo images imported successfully.");
}

main()
  .catch((error) => {
    console.error("Image import failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });