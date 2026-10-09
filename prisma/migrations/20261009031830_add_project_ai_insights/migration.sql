-- CreateTable
CREATE TABLE "ProjectAiInsight" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "risks" TEXT[],
    "nextSteps" TEXT[],
    "healthScore" INTEGER,
    "model" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectAiInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectAiInsight_projectId_createdAt_idx" ON "ProjectAiInsight"("projectId", "createdAt");

-- AddForeignKey
ALTER TABLE "ProjectAiInsight" ADD CONSTRAINT "ProjectAiInsight_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
