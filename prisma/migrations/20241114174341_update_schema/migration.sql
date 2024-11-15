/*
  Warnings:

  - The primary key for the `BoatProperty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CommercialProperty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LandProperty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ParkingProperty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Property` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ResidentialProperty` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "BoatProperty" DROP CONSTRAINT "BoatProperty_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "CommercialProperty" DROP CONSTRAINT "CommercialProperty_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "LandProperty" DROP CONSTRAINT "LandProperty_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "ParkingProperty" DROP CONSTRAINT "ParkingProperty_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "ResidentialProperty" DROP CONSTRAINT "ResidentialProperty_propertyId_fkey";

-- AlterTable
ALTER TABLE "BoatProperty" DROP CONSTRAINT "BoatProperty_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "propertyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "BoatProperty_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BoatProperty_id_seq";

-- AlterTable
ALTER TABLE "CommercialProperty" DROP CONSTRAINT "CommercialProperty_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "propertyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "CommercialProperty_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CommercialProperty_id_seq";

-- AlterTable
ALTER TABLE "LandProperty" DROP CONSTRAINT "LandProperty_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "propertyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "LandProperty_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "LandProperty_id_seq";

-- AlterTable
ALTER TABLE "ParkingProperty" DROP CONSTRAINT "ParkingProperty_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "propertyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ParkingProperty_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ParkingProperty_id_seq";

-- AlterTable
ALTER TABLE "Property" DROP CONSTRAINT "Property_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Property_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Property_id_seq";

-- AlterTable
ALTER TABLE "ResidentialProperty" DROP CONSTRAINT "ResidentialProperty_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "propertyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ResidentialProperty_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ResidentialProperty_id_seq";

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
