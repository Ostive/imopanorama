-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('DESKTOP', 'MOBILE', 'TABLET');

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "title" TEXT,
    "referrer" TEXT,
    "userId" TEXT,
    "sessionId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "country" TEXT,
    "city" TEXT,
    "device" "DeviceType" NOT NULL DEFAULT 'DESKTOP',
    "browser" TEXT,
    "os" TEXT,
    "screenWidth" INTEGER,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "label" TEXT,
    "value" DOUBLE PRECISION,
    "metadata" JSONB,
    "userId" TEXT,
    "sessionId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsSession" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "country" TEXT,
    "city" TEXT,
    "device" "DeviceType" NOT NULL DEFAULT 'DESKTOP',
    "browser" TEXT,
    "os" TEXT,
    "referrer" TEXT,
    "entryPage" TEXT,
    "exitPage" TEXT,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "AnalyticsSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageView_path_idx" ON "PageView"("path");

-- CreateIndex
CREATE INDEX "PageView_sessionId_idx" ON "PageView"("sessionId");

-- CreateIndex
CREATE INDEX "PageView_userId_idx" ON "PageView"("userId");

-- CreateIndex
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");

-- CreateIndex
CREATE INDEX "Event_name_idx" ON "Event"("name");

-- CreateIndex
CREATE INDEX "Event_category_idx" ON "Event"("category");

-- CreateIndex
CREATE INDEX "Event_sessionId_idx" ON "Event"("sessionId");

-- CreateIndex
CREATE INDEX "Event_userId_idx" ON "Event"("userId");

-- CreateIndex
CREATE INDEX "Event_createdAt_idx" ON "Event"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsSession_sessionId_key" ON "AnalyticsSession"("sessionId");

-- CreateIndex
CREATE INDEX "AnalyticsSession_sessionId_idx" ON "AnalyticsSession"("sessionId");

-- CreateIndex
CREATE INDEX "AnalyticsSession_userId_idx" ON "AnalyticsSession"("userId");

-- CreateIndex
CREATE INDEX "AnalyticsSession_startedAt_idx" ON "AnalyticsSession"("startedAt");
