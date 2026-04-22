-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('TERRAIN_RESIDENTIAL', 'TERRAIN_COMMERCIAL', 'TERRAIN_AGRICULTURAL', 'TERRAIN_INDUSTRIAL', 'VILLA', 'HOUSE', 'TOWNHOUSE', 'COUNTRY_HOUSE', 'APARTMENT', 'STUDIO', 'PENTHOUSE', 'DUPLEX', 'LOFT', 'OFFICE', 'SHOP', 'WAREHOUSE', 'BUILDING', 'HOTEL', 'RESTAURANT');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('SALE', 'RENT', 'SEASONAL_RENT');

-- CreateEnum
CREATE TYPE "PropertyCondition" AS ENUM ('NEW', 'EXCELLENT', 'GOOD', 'TO_RENOVATE', 'UNDER_CONSTRUCTION');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'RENTED', 'DRAFT', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "propertyType" "PropertyType" NOT NULL,
    "transactionType" "TransactionType" NOT NULL DEFAULT 'SALE',
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "zipCode" TEXT,
    "coordinates" JSONB,
    "price" DOUBLE PRECISION NOT NULL,
    "pricePerM2" DOUBLE PRECISION,
    "rentPrice" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "totalSize" DOUBLE PRECISION NOT NULL,
    "livingSize" DOUBLE PRECISION,
    "landSize" DOUBLE PRECISION,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "rooms" INTEGER,
    "floors" INTEGER,
    "floor" INTEGER,
    "yearBuilt" INTEGER,
    "condition" "PropertyCondition",
    "features" TEXT[],
    "amenities" TEXT[],
    "images" TEXT[],
    "coverImage" TEXT,
    "virtualTour" TEXT,
    "videoUrl" TEXT,
    "status" "PropertyStatus" NOT NULL DEFAULT 'AVAILABLE',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "reference" TEXT,
    "energyClass" TEXT,
    "emissions" TEXT,
    "taxFonciere" DOUBLE PRECISION,
    "charges" DOUBLE PRECISION,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyContact" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "PropertyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Property_reference_key" ON "Property"("reference");

-- CreateIndex
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");

-- CreateIndex
CREATE INDEX "Property_city_idx" ON "Property"("city");

-- CreateIndex
CREATE INDEX "Property_status_idx" ON "Property"("status");

-- CreateIndex
CREATE INDEX "Property_transactionType_idx" ON "Property"("transactionType");

-- CreateIndex
CREATE INDEX "Property_price_idx" ON "Property"("price");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyFavorite_userId_propertyId_key" ON "PropertyFavorite"("userId", "propertyId");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyContact" ADD CONSTRAINT "PropertyContact_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyContact" ADD CONSTRAINT "PropertyContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyFavorite" ADD CONSTRAINT "PropertyFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyFavorite" ADD CONSTRAINT "PropertyFavorite_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
