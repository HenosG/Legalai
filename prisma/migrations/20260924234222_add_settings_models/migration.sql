-- CreateEnum
CREATE TYPE "PortalAccessMode" AS ENUM ('INVITE_ONLY', 'CLIENT_EMAIL', 'PUBLIC_LINK');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL');

-- CreateEnum
CREATE TYPE "IntegrationProvider" AS ENUM ('STRIPE', 'CLERK', 'GEMINI', 'RESEND');

-- CreateTable
CREATE TABLE "WorkspaceSettings" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'America/Toronto',
    "locale" TEXT NOT NULL DEFAULT 'en-CA',
    "dateFormat" TEXT NOT NULL DEFAULT 'MMM d, yyyy',
    "weekStartsOn" INTEGER NOT NULL DEFAULT 1,
    "defaultCurrency" TEXT NOT NULL DEFAULT 'CAD',
    "defaultProposalExpiryDays" INTEGER NOT NULL DEFAULT 30,
    "defaultPaymentTermsDays" INTEGER NOT NULL DEFAULT 14,
    "proposalDefaults" JSONB,
    "defaultProjectStatus" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "defaultProjectHealth" "ProjectHealth" NOT NULL DEFAULT 'UNKNOWN',
    "defaultTaskPriority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "projectWorkingDays" JSONB,
    "projectDefaultView" TEXT NOT NULL DEFAULT 'board',
    "projectDefaults" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientPortalSettings" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "portalName" TEXT,
    "portalSlug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#18181B',
    "welcomeTitle" TEXT,
    "welcomeMessage" TEXT,
    "supportEmail" TEXT,
    "supportUrl" TEXT,
    "accessMode" "PortalAccessMode" NOT NULL DEFAULT 'INVITE_ONLY',
    "allowClientMessages" BOOLEAN NOT NULL DEFAULT true,
    "showProjectProgress" BOOLEAN NOT NULL DEFAULT true,
    "showInvoices" BOOLEAN NOT NULL DEFAULT true,
    "showProposals" BOOLEAN NOT NULL DEFAULT true,
    "showDocuments" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientPortalSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "userId" TEXT,
    "eventKey" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationConnection" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "provider" "IntegrationProvider" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DISCONNECTED',
    "externalAccountId" TEXT,
    "externalAccountName" TEXT,
    "metadata" JSONB,
    "connectedAt" TIMESTAMP(3),
    "lastSyncedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceSettings_organizationId_key" ON "WorkspaceSettings"("organizationId");

-- CreateIndex
CREATE INDEX "WorkspaceSettings_organizationId_idx" ON "WorkspaceSettings"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientPortalSettings_organizationId_key" ON "ClientPortalSettings"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientPortalSettings_portalSlug_key" ON "ClientPortalSettings"("portalSlug");

-- CreateIndex
CREATE INDEX "ClientPortalSettings_portalSlug_idx" ON "ClientPortalSettings"("portalSlug");

-- CreateIndex
CREATE INDEX "NotificationPreference_organizationId_idx" ON "NotificationPreference"("organizationId");

-- CreateIndex
CREATE INDEX "NotificationPreference_userId_idx" ON "NotificationPreference"("userId");

-- CreateIndex
CREATE INDEX "NotificationPreference_organizationId_eventKey_idx" ON "NotificationPreference"("organizationId", "eventKey");

-- CreateIndex
CREATE INDEX "NotificationPreference_userId_eventKey_idx" ON "NotificationPreference"("userId", "eventKey");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_organizationId_userId_eventKey_chann_key" ON "NotificationPreference"("organizationId", "userId", "eventKey", "channel");

-- CreateIndex
CREATE INDEX "IntegrationConnection_organizationId_status_idx" ON "IntegrationConnection"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationConnection_organizationId_provider_key" ON "IntegrationConnection"("organizationId", "provider");

-- AddForeignKey
ALTER TABLE "WorkspaceSettings" ADD CONSTRAINT "WorkspaceSettings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientPortalSettings" ADD CONSTRAINT "ClientPortalSettings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationConnection" ADD CONSTRAINT "IntegrationConnection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
