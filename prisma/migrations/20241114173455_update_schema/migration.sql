/*
  Warnings:

  - The `images` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `image` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "images",
ADD COLUMN     "images" BYTEA[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
ADD COLUMN     "image" BYTEA;
