// src/types/settings.ts

export interface WorkspaceSettings {
    id: string;
    organizationId: string;
    timezone: string;
    locale: string;
    dateFormat: string;
    weekStartsOn: number;
    defaultCurrency: string;
    defaultProposalExpiryDays: number;
    defaultPaymentTermsDays: number;
    proposalDefaults: Record<string, unknown> | null;
    defaultProjectStatus: string;
    defaultProjectHealth: string;
    defaultTaskPriority: string;
    projectWorkingDays: Record<string, unknown> | null;
    projectDefaultView: string;
  }
  
  export interface ClientPortalSettings {
    id: string;
    organizationId: string;
    enabled: boolean;
    portalName: string | null;
    portalSlug: string;
    logoUrl: string | null;
    primaryColor: string;
    welcomeTitle: string | null;
    welcomeMessage: string | null;
    supportEmail: string | null;
    supportUrl: string | null;
    accessMode: "INVITE_ONLY" | "CLIENT_EMAIL" | "PUBLIC_LINK";
    allowClientMessages: boolean;
    showProjectProgress: boolean;
    showInvoices: boolean;
    showProposals: boolean;
    showDocuments: boolean;
  }
  
  export interface NotificationPreference {
    id: string;
    organizationId: string | null;
    userId: string | null;
    eventKey: string;
    channel: "IN_APP" | "EMAIL";
    enabled: boolean;
  }
  
  export interface IntegrationConnection {
    id: string;
    provider: "STRIPE" | "CLERK" | "OPENAI" | "RESEND";
    status: string;
    externalAccountId: string | null;
    externalAccountName: string | null;
    connectedAt: string | null;
    lastSyncedAt: string | null;
  }
  
  export interface SettingsPayload {
    clerk: {
      userId: string;
      fullName: string | null;
      firstName: string | null;
      lastName: string | null;
      primaryEmail: string | null;
      imageUrl: string | null;
    };
    organization: { id: string; name: string; plan: string; clerkOrgId: string | null } | null;
    workspace: {
      businessName: string; businessSlug: string; currency: string; country: string;
      industry: string; businessType: string; agentName: string;
    } | null;
    workspaceSettings: WorkspaceSettings;
    clientPortal: ClientPortalSettings | null;
    notifications: NotificationPreference[];
    integrations: IntegrationConnection[];
    billing: { plan: string; stripeCustomerId: string | null; stripeConnected: boolean };
  }
  
  export interface WorkspacePatchInput {
    organizationName?: string;
    businessName?: string;
    businessSlug?: string;
    defaultCurrency?: string;
    timezone?: string;
    locale?: string;
    dateFormat?: string;
    weekStartsOn?: number;
    industry?: string;
    businessType?: string;
    agentName?: string;
  }
  
  export interface ClientPortalPatchInput {
    enabled?: boolean;
    portalName?: string;
    portalSlug?: string;
    logoUrl?: string;
    primaryColor?: string;
    welcomeTitle?: string;
    welcomeMessage?: string;
    supportEmail?: string;
    supportUrl?: string;
    accessMode?: "INVITE_ONLY" | "CLIENT_EMAIL" | "PUBLIC_LINK";
    allowClientMessages?: boolean;
    showProjectProgress?: boolean;
    showInvoices?: boolean;
    showProposals?: boolean;
    showDocuments?: boolean;
  }