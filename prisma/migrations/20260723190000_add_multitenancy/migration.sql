-- CreateEnum
CREATE TYPE "OrgRole" AS ENUM ('OWNER', 'ADMIN', 'MANAGER', 'COACH', 'STAFF');

-- AlterTable: site-wide super-admin flag
ALTER TABLE "User" ADD COLUMN "isSiteAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable Organization
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateTable OrganizationMembership
CREATE TABLE "OrganizationMembership" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "OrgRole" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrganizationMembership_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "OrganizationMembership_userId_idx" ON "OrganizationMembership"("userId");
CREATE UNIQUE INDEX "OrganizationMembership_organizationId_userId_key" ON "OrganizationMembership"("organizationId", "userId");
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: create a default organization to hold any pre-existing data.
INSERT INTO "Organization" ("id", "name", "slug", "createdAt", "updatedAt")
VALUES ('org_default000000000000000', 'Mon association', 'mon-association', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Backfill: existing management users become members of the default org, and
-- existing global ADMINs also become site admins.
INSERT INTO "OrganizationMembership" ("id", "organizationId", "userId", "role", "createdAt")
SELECT 'mem_' || "id", 'org_default000000000000000', "id",
       CASE
           WHEN "role" = 'ADMIN' THEN 'OWNER'::"OrgRole"
           WHEN "role" = 'STAFF' THEN 'ADMIN'::"OrgRole"
           WHEN "role" = 'MANAGER' THEN 'MANAGER'::"OrgRole"
           WHEN "role" = 'COACH' THEN 'COACH'::"OrgRole"
           ELSE 'STAFF'::"OrgRole"
       END,
       CURRENT_TIMESTAMP
FROM "User"
WHERE "role" IN ('ADMIN', 'STAFF', 'MANAGER', 'COACH');

UPDATE "User" SET "isSiteAdmin" = true WHERE "role" = 'ADMIN';

-- Add organizationId to each managed model (nullable -> backfill -> NOT NULL).
ALTER TABLE "Team" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "Player" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "Staff" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "Event" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "FinanceEntry" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "GameServer" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "Document" ADD COLUMN "organizationId" TEXT;

UPDATE "Team" SET "organizationId" = 'org_default000000000000000' WHERE "organizationId" IS NULL;
UPDATE "Player" SET "organizationId" = 'org_default000000000000000' WHERE "organizationId" IS NULL;
UPDATE "Staff" SET "organizationId" = 'org_default000000000000000' WHERE "organizationId" IS NULL;
UPDATE "Event" SET "organizationId" = 'org_default000000000000000' WHERE "organizationId" IS NULL;
UPDATE "FinanceEntry" SET "organizationId" = 'org_default000000000000000' WHERE "organizationId" IS NULL;
UPDATE "GameServer" SET "organizationId" = 'org_default000000000000000' WHERE "organizationId" IS NULL;
UPDATE "Document" SET "organizationId" = 'org_default000000000000000' WHERE "organizationId" IS NULL;

ALTER TABLE "Team" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "Player" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "Staff" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "Event" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "FinanceEntry" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "GameServer" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "Document" ALTER COLUMN "organizationId" SET NOT NULL;

-- Team uniqueness becomes per-organization.
DROP INDEX "Team_name_game_key";
CREATE UNIQUE INDEX "Team_organizationId_name_game_key" ON "Team"("organizationId", "name", "game");

-- Indexes
CREATE INDEX "Team_organizationId_idx" ON "Team"("organizationId");
CREATE INDEX "Player_organizationId_idx" ON "Player"("organizationId");
CREATE INDEX "Staff_organizationId_idx" ON "Staff"("organizationId");
CREATE INDEX "Event_organizationId_idx" ON "Event"("organizationId");
CREATE INDEX "FinanceEntry_organizationId_idx" ON "FinanceEntry"("organizationId");
CREATE INDEX "GameServer_organizationId_idx" ON "GameServer"("organizationId");
CREATE INDEX "Document_organizationId_idx" ON "Document"("organizationId");

-- Foreign keys
ALTER TABLE "Team" ADD CONSTRAINT "Team_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Player" ADD CONSTRAINT "Player_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FinanceEntry" ADD CONSTRAINT "FinanceEntry_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GameServer" ADD CONSTRAINT "GameServer_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Document" ADD CONSTRAINT "Document_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
