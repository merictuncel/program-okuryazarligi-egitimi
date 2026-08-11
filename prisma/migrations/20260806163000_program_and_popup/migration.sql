-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN "showAsPopup" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Announcement" ADD COLUMN "linkPath" TEXT;

-- CreateTable
CREATE TABLE "ProgramSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayLabel" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "instructorName" TEXT,
    "timeLabel" TEXT,
    "location" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
