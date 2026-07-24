-- CreateEnum
CREATE TYPE "FinanceType" AS ENUM ('EXPENSE', 'INCOME');

-- CreateEnum
CREATE TYPE "FinanceCategory" AS ENUM ('EQUIPMENT', 'TRAVEL', 'TOURNAMENT_FEES', 'SALARY', 'SUBSCRIPTION', 'FACILITY', 'SPONSORSHIP', 'MEMBERSHIP', 'DONATION', 'GRANT', 'OTHER');

-- CreateTable
CREATE TABLE "FinanceEntry" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "FinanceType" NOT NULL,
    "category" "FinanceCategory" NOT NULL DEFAULT 'OTHER',
    "amountCents" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "teamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FinanceEntry_teamId_idx" ON "FinanceEntry"("teamId");

-- CreateIndex
CREATE INDEX "FinanceEntry_date_idx" ON "FinanceEntry"("date");

-- AddForeignKey
ALTER TABLE "FinanceEntry" ADD CONSTRAINT "FinanceEntry_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
