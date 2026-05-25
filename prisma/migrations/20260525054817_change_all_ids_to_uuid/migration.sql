/*
  Warnings:

  - The primary key for the `Announcement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ClubApplication` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ClubComment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ClubGalleryImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ClubMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `EventSignup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Announcement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clubId" TEXT NOT NULL,
    "createdById" TEXT,
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
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Club_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Club" ("category", "chineseName", "createdAt", "createdById", "description", "englishName", "id", "joinInfo", "logo", "mission", "name", "purpose", "reviewer", "sourceId", "status", "updatedAt") SELECT "category", "chineseName", "createdAt", "createdById", "description", "englishName", "id", "joinInfo", "logo", "mission", "name", "purpose", "reviewer", "sourceId", "status", "updatedAt" FROM "Club";
DROP TABLE "Club";
ALTER TABLE "new_Club" RENAME TO "Club";
CREATE UNIQUE INDEX "Club_sourceId_key" ON "Club"("sourceId");
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");
CREATE TABLE "new_ClubApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clubId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewedById" TEXT,
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
CREATE TABLE "new_ClubComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clubId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClubComment_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClubComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ClubComment" ("clubId", "content", "createdAt", "id", "updatedAt", "userId") SELECT "clubId", "content", "createdAt", "id", "updatedAt", "userId" FROM "ClubComment";
DROP TABLE "ClubComment";
ALTER TABLE "new_ClubComment" RENAME TO "ClubComment";
CREATE TABLE "new_ClubGalleryImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clubId" TEXT NOT NULL,
    "uploadedById" TEXT,
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
    "id" TEXT NOT NULL PRIMARY KEY,
    "clubId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
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
    "id" TEXT NOT NULL PRIMARY KEY,
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
CREATE TABLE "new_EventSignup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'registered',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EventSignup_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventSignup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EventSignup" ("createdAt", "eventId", "id", "status", "updatedAt", "userId") SELECT "createdAt", "eventId", "id", "status", "updatedAt", "userId" FROM "EventSignup";
DROP TABLE "EventSignup";
ALTER TABLE "new_EventSignup" RENAME TO "EventSignup";
CREATE UNIQUE INDEX "EventSignup_eventId_userId_key" ON "EventSignup"("eventId", "userId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "name" TEXT,
    "studentId" TEXT,
    "major" TEXT,
    "grade" TEXT,
    "bio" TEXT,
    "avatar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("avatar", "bio", "createdAt", "email", "grade", "id", "major", "name", "password", "role", "studentId", "updatedAt") SELECT "avatar", "bio", "createdAt", "email", "grade", "id", "major", "name", "password", "role", "studentId", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_studentId_key" ON "User"("studentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
