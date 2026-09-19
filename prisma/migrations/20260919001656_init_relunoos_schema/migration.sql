-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "tags" TEXT[],
ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "agentName" TEXT NOT NULL DEFAULT 'Rulo';

-- CreateIndex
CREATE INDEX "Client_status_idx" ON "Client"("status");

-- CreateIndex
CREATE INDEX "Client_createdAt_idx" ON "Client"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");
