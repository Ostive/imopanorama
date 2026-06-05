CREATE TYPE "LeadStatus" AS ENUM (
  'NEW',
  'TO_CONTACT',
  'CONTACTED',
  'VISIT_SCHEDULED',
  'VISIT_DONE',
  'NEGOTIATION',
  'WON',
  'LOST',
  'ARCHIVED'
);

CREATE TYPE "LeadPriority" AS ENUM (
  'LOW',
  'NORMAL',
  'HIGH',
  'URGENT'
);

ALTER TABLE "Contact"
  ADD COLUMN "leadStatus" "LeadStatus" NOT NULL DEFAULT 'NEW',
  ADD COLUMN "leadPriority" "LeadPriority" NOT NULL DEFAULT 'NORMAL',
  ADD COLUMN "assignedAgentId" TEXT,
  ADD COLUMN "nextFollowUpAt" TIMESTAMP(3),
  ADD COLUMN "scheduledVisitAt" TIMESTAMP(3),
  ADD COLUMN "visitOutcome" TEXT,
  ADD COLUMN "internalNotes" TEXT;

ALTER TABLE "PropertyContact"
  ADD COLUMN "leadStatus" "LeadStatus" NOT NULL DEFAULT 'NEW',
  ADD COLUMN "leadPriority" "LeadPriority" NOT NULL DEFAULT 'NORMAL',
  ADD COLUMN "assignedAgentId" TEXT,
  ADD COLUMN "nextFollowUpAt" TIMESTAMP(3),
  ADD COLUMN "scheduledVisitAt" TIMESTAMP(3),
  ADD COLUMN "visitOutcome" TEXT,
  ADD COLUMN "internalNotes" TEXT;

ALTER TABLE "Contact"
  ADD CONSTRAINT "Contact_assignedAgentId_fkey"
  FOREIGN KEY ("assignedAgentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PropertyContact"
  ADD CONSTRAINT "PropertyContact_assignedAgentId_fkey"
  FOREIGN KEY ("assignedAgentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Contact_leadStatus_idx" ON "Contact"("leadStatus");
CREATE INDEX "Contact_leadPriority_idx" ON "Contact"("leadPriority");
CREATE INDEX "Contact_assignedAgentId_idx" ON "Contact"("assignedAgentId");
CREATE INDEX "Contact_nextFollowUpAt_idx" ON "Contact"("nextFollowUpAt");

CREATE INDEX "PropertyContact_leadStatus_idx" ON "PropertyContact"("leadStatus");
CREATE INDEX "PropertyContact_leadPriority_idx" ON "PropertyContact"("leadPriority");
CREATE INDEX "PropertyContact_assignedAgentId_idx" ON "PropertyContact"("assignedAgentId");
CREATE INDEX "PropertyContact_nextFollowUpAt_idx" ON "PropertyContact"("nextFollowUpAt");
