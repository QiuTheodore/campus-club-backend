/*
  Warnings:

  - The primary key for the `Club` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Announcement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clubId" TEXT NOT NULL,
    "createdById" INTEGER,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Announcement_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Announcement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Announcement" ("clubId", "content", "createdAt", "createdById", "id", "isPinned", "status", "title", "updatedAt") SELECT "clubId", "content", "createdAt", "createdById", "id", "isPinned", "status", "title", "updatedAt" FROM "Announcement";
DROP TABLE "Announcement";
ALTER TABLE "new_Announcement" RENAME TO "Announcement";
CREATE TABLE "new_Club" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" INTEGER,
    "name" TEXT NOT NULL,
    "chineseName" TEXT,
    "englishName" TEXT,
    "description" TEXT,
    "purpose" TEXT,
    "mission" TEXT,
    "category" TEXT,
    "logo" TEXT,
    "joinInfo" TEXT,
    "reviewer" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdById" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Club_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Club" ("category", "createdAt", "createdById", "description", "id", "logo", "name", "status", "updatedAt") SELECT "category", "createdAt", "createdById", "description", "id", "logo", "name", "status", "updatedAt" FROM "Club";
DROP TABLE "Club";
ALTER TABLE "new_Club" RENAME TO "Club";
CREATE UNIQUE INDEX "Club_sourceId_key" ON "Club"("sourceId");
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");
CREATE TABLE "new_ClubApplication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clubId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewedById" INTEGER,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClubApplication_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClubApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClubApplication_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ClubApplication" ("clubId", "createdAt", "id", "reason", "reviewedAt", "reviewedById", "status", "updatedAt", "userId") SELECT "clubId", "createdAt", "id", "reason", "reviewedAt", "reviewedById", "status", "updatedAt", "userId" FROM "ClubApplication";
DROP TABLE "ClubApplication";
ALTER TABLE "new_ClubApplication" RENAME TO "ClubApplication";
CREATE UNIQUE INDEX "ClubApplication_clubId_userId_key" ON "ClubApplication"("clubId", "userId");
CREATE TABLE "new_ClubGalleryImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clubId" TEXT NOT NULL,
    "uploadedById" INTEGER,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClubGalleryImage_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClubGalleryImage_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ClubGalleryImage" ("clubId", "createdAt", "description", "id", "imageUrl", "title", "updatedAt", "uploadedById") SELECT "clubId", "createdAt", "description", "id", "imageUrl", "title", "updatedAt", "uploadedById" FROM "ClubGalleryImage";
DROP TABLE "ClubGalleryImage";
ALTER TABLE "new_ClubGalleryImage" RENAME TO "ClubGalleryImage";
CREATE TABLE "new_ClubMember" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clubId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClubMember_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClubMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ClubMember" ("clubId", "id", "joinedAt", "role", "userId") SELECT "clubId", "id", "joinedAt", "role", "userId" FROM "ClubMember";
DROP TABLE "ClubMember";
ALTER TABLE "new_ClubMember" RENAME TO "ClubMember";
CREATE UNIQUE INDEX "ClubMember_clubId_userId_key" ON "ClubMember"("clubId", "userId");
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clubId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "capacity" INTEGER,
    "poster" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("capacity", "clubId", "createdAt", "description", "endTime", "id", "location", "poster", "startTime", "status", "title", "updatedAt") SELECT "capacity", "clubId", "createdAt", "description", "endTime", "id", "location", "poster", "startTime", "status", "title", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
