-- Add multi-market location and trust fields for property listings.

CREATE TYPE "PropertyLegalStatus" AS ENUM (
  'TITLED',
  'CADASTRAL',
  'UNTITLED',
  'LONG_TERM_LEASE',
  'CO_OWNERSHIP',
  'COMPANY_OWNED',
  'OTHER'
);

CREATE TYPE "PropertyDocumentStatus" AS ENUM (
  'UNKNOWN',
  'PENDING',
  'PARTIAL',
  'VERIFIED'
);

ALTER TABLE "Property"
  ADD COLUMN "country" TEXT NOT NULL DEFAULT 'MG',
  ADD COLUMN "region" TEXT,
  ADD COLUMN "district" TEXT,
  ADD COLUMN "commune" TEXT,
  ADD COLUMN "fokontany" TEXT,
  ADD COLUMN "legalStatus" "PropertyLegalStatus",
  ADD COLUMN "documentStatus" "PropertyDocumentStatus" NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Property" ALTER COLUMN "currency" SET DEFAULT 'MGA';

CREATE INDEX "Property_country_idx" ON "Property"("country");
CREATE INDEX "Property_region_idx" ON "Property"("region");
