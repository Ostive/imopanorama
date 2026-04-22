-- AlterTable
ALTER TABLE "BatiProject" ADD COLUMN     "client" TEXT,
ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "year" INTEGER;
