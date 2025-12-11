-- CreateTable
CREATE TABLE "Wedding" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heroImage" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL DEFAULT 'The Wedding Day',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'October 7, 2023 • Anaheim, CA',
    "highlights" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "gallery" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
