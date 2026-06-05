CREATE TYPE "NotificationType" AS ENUM (
  'CONTACT_CREATED',
  'PROPERTY_CONTACT_CREATED',
  'VISIT_REQUESTED',
  'CRM_FOLLOW_UP',
  'PROPERTY_CREATED',
  'SYSTEM'
);

CREATE TYPE "NotificationPriority" AS ENUM (
  'LOW',
  'NORMAL',
  'HIGH',
  'URGENT'
);

CREATE TABLE "Notification" (
  "id" TEXT NOT NULL,
  "type" "NotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "priority" "NotificationPriority" NOT NULL DEFAULT 'NORMAL',
  "targetUrl" TEXT,
  "entityType" TEXT,
  "entityId" TEXT,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "readAt" TIMESTAMP(3),
  "recipientId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Notification"
  ADD CONSTRAINT "Notification_recipientId_fkey"
  FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");
CREATE INDEX "Notification_type_idx" ON "Notification"("type");
CREATE INDEX "Notification_priority_idx" ON "Notification"("priority");
CREATE INDEX "Notification_recipientId_idx" ON "Notification"("recipientId");
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");
