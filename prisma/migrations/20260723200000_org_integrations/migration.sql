-- Per-organization integration credentials.
ALTER TABLE "Organization" ADD COLUMN "faceitApiKey" TEXT;
ALTER TABLE "Organization" ADD COLUMN "helloAssoClientId" TEXT;
ALTER TABLE "Organization" ADD COLUMN "helloAssoClientSecret" TEXT;
ALTER TABLE "Organization" ADD COLUMN "helloAssoOrgSlug" TEXT;
