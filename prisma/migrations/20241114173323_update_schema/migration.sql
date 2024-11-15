/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('RESIDENTIAL', 'COMMERCIAL', 'LAND', 'BOAT', 'PARKING');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "phone_number" TEXT;

-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" "PropertyType" NOT NULL,
    "location" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParkingProperty" (
    "id" SERIAL NOT NULL,
    "parking_type" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "ParkingProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoatProperty" (
    "id" SERIAL NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "boat_type" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "BoatProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandProperty" (
    "id" SERIAL NOT NULL,
    "land_area" DOUBLE PRECISION NOT NULL,
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "LandProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResidentialProperty" (
    "id" SERIAL NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "living_space" DOUBLE PRECISION NOT NULL,
    "built_year" INTEGER NOT NULL,
    "floors" INTEGER NOT NULL,
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "ResidentialProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommercialProperty" (
    "id" SERIAL NOT NULL,
    "rooms" INTEGER NOT NULL,
    "commercial_space" DOUBLE PRECISION NOT NULL,
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "CommercialProperty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParkingProperty_propertyId_key" ON "ParkingProperty"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "BoatProperty_propertyId_key" ON "BoatProperty"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "LandProperty_propertyId_key" ON "LandProperty"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "ResidentialProperty_propertyId_key" ON "ResidentialProperty"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "CommercialProperty_propertyId_key" ON "CommercialProperty"("propertyId");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParkingProperty" ADD CONSTRAINT "ParkingProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoatProperty" ADD CONSTRAINT "BoatProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandProperty" ADD CONSTRAINT "LandProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentialProperty" ADD CONSTRAINT "ResidentialProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommercialProperty" ADD CONSTRAINT "CommercialProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
