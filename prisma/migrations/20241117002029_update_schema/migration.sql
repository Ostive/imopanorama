-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" BYTEA,
    "password" TEXT,
    "phone_number" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "images" BYTEA[],
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParkingProperty" (
    "id" TEXT NOT NULL,
    "parking_type" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "ParkingProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoatProperty" (
    "id" TEXT NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "boat_type" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "BoatProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandProperty" (
    "id" TEXT NOT NULL,
    "land_area" DOUBLE PRECISION NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "LandProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResidentialProperty" (
    "id" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "living_space" DOUBLE PRECISION NOT NULL,
    "built_year" INTEGER NOT NULL,
    "floors" INTEGER NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "ResidentialProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommercialProperty" (
    "id" TEXT NOT NULL,
    "rooms" INTEGER NOT NULL,
    "commercial_space" DOUBLE PRECISION NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "CommercialProperty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_email_token_key" ON "VerificationToken"("email", "token");

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
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
