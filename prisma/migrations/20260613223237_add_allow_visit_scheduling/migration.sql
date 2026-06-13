-- DropIndex
DROP INDEX "Contact_assignedAgentId_idx";

-- DropIndex
DROP INDEX "Contact_leadPriority_idx";

-- DropIndex
DROP INDEX "Contact_leadStatus_idx";

-- DropIndex
DROP INDEX "Contact_nextFollowUpAt_idx";

-- DropIndex
DROP INDEX "Property_embedding_hnsw_idx";

-- DropIndex
DROP INDEX "PropertyContact_assignedAgentId_idx";

-- DropIndex
DROP INDEX "PropertyContact_leadPriority_idx";

-- DropIndex
DROP INDEX "PropertyContact_leadStatus_idx";

-- DropIndex
DROP INDEX "PropertyContact_nextFollowUpAt_idx";

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "allowVisitScheduling" BOOLEAN NOT NULL DEFAULT false;
