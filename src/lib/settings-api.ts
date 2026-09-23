// src/lib/settings-api.ts
import { createApiClient } from "@/lib/api";
import type {
  SettingsPayload, WorkspacePatchInput, ClientPortalSettings, ClientPortalPatchInput,
} from "@/types/settings";

export const settingsApi = {
  getAll: (token: string | null) => createApiClient(token).get<SettingsPayload>("/api/settings"),

  updateWorkspace: (data: WorkspacePatchInput, token: string | null) =>
    createApiClient(token).patch("/api/settings/workspace", data),

  getClientPortal: (token: string | null) =>
    createApiClient(token).get<{ clientPortal: ClientPortalSettings | null }>("/api/settings/client-portal"),

  updateClientPortal: (data: ClientPortalPatchInput, token: string | null) =>
    createApiClient(token).patch<{ clientPortal: ClientPortalSettings; portalUrl: string }>("/api/settings/client-portal", data),
};