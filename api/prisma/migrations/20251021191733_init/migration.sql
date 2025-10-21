-- CreateTable
CREATE TABLE "Chart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "meta" TEXT,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
