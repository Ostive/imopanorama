/*
  Warnings:

  - You are about to drop the column `terrainId` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the `Favorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Terrain` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Contact" DROP CONSTRAINT "Contact_terrainId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_terrainId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Terrain" DROP CONSTRAINT "Terrain_ownerId_fkey";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "terrainId";

-- DropTable
DROP TABLE "public"."Favorite";

-- DropTable
DROP TABLE "public"."Terrain";

-- DropEnum
DROP TYPE "public"."TerrainStatus";

-- DropEnum
DROP TYPE "public"."TerrainType";
