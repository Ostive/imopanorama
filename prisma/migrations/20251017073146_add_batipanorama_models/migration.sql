-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'PLANNED');

-- CreateTable
CREATE TABLE "BatiProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "surface" DOUBLE PRECISION,
    "duration" TEXT,
    "budget" TEXT,
    "images" TEXT[],
    "coverImage" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'COMPLETED',
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BatiProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatiService" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "features" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BatiService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatiProcess" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,
    "duration" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BatiProcess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BatiProcess_step_key" ON "BatiProcess"("step");
