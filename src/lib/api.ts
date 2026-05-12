// src/lib/api.ts
// Centralized API client for RelunoLegal
// All requests route through http://localhost:5000 (or VITE_API_URL)

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── Core fetcher ──────────────────────────────────────────────────────────────
async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let message = `API error ${res.status}`;
    try {
      const body = await res.json();
      message = body?.message || body?.error || message;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// ─── Convenience methods ───────────────────────────────────────────────────────
export const api = {
  get: <T = unknown>(path: string, options?: RequestInit) =>
    apiFetch<T>(path, { method: "GET", ...options }),

  post: <T = unknown>(path: string, body: unknown, options?: RequestInit) =>
    apiFetch<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),

  put: <T = unknown>(path: string, body: unknown, options?: RequestInit) =>
    apiFetch<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),

  patch: <T = unknown>(path: string, body: unknown, options?: RequestInit) =>
    apiFetch<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    }),

  delete: <T = unknown>(path: string, options?: RequestInit) =>
    apiFetch<T>(path, { method: "DELETE", ...options }),
};

// ─── Typed endpoint helpers ────────────────────────────────────────────────────

// Tasks
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  caseId?: string;
  createdAt: string;
  updatedAt: string;
}

export const tasksApi = {
  getAll: () => api.get<Task[]>("/api/tasks"),
  create: (data: { title: string; priority?: string; dueDate?: string; caseId?: string }) =>
    api.post<Task>("/api/tasks", data),
  update: (id: string, data: Partial<Task>) =>
    api.patch<Task>(`/api/tasks/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean }>(`/api/tasks/${id}`),
  toggle: (id: string, completed: boolean) =>
    api.patch<Task>(`/api/tasks/${id}`, { completed }),
};

// PDF Analysis
export interface PdfAnalysisResult {
  id: string;
  filename: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  summary: string;
  keyRisks: string[];
  clauses: Array<{ text: string; risk: string; severity: string }>;
  createdAt: string;
}

export const pdfApi = {
  analyze: (data: { content: string; filename: string }) =>
    api.post<PdfAnalysisResult>("/api/pdf-analysis", data),
  getHistory: () => api.get<PdfAnalysisResult[]>("/api/pdf-analysis/history"),
};

// Analytics
export interface AnalyticsData {
  queriesThisMonth: number;
  totalDocuments: number;
  openClaims: number;
  totalQueries: number;
  resolutionVelocity: number;
  avgCaseDuration: number;
  last7Days: Array<{ date: string; count: number }>;
  mattersByType: Array<{ type: string; count: number }>;
  resolutionTrend: Array<{ month: string; resolved: number; opened: number }>;
  workloadScore: number;
}

export const analyticsApi = {
  getDashboard: () => api.get<AnalyticsData>("/api/analytics"),
  getResolutionVelocity: () => api.get<AnalyticsData["resolutionTrend"]>("/api/analytics/resolution"),
};

// Integrations
export interface CalendarConnection {
  id: string;
  provider: "google" | "outlook";
  email: string;
  connected: boolean;
  lastSync?: string;
}

export interface EmailConnection {
  id: string;
  provider: "gmail" | "outlook" | "yahoo";
  email: string;
  connected: boolean;
  lastSync?: string;
}

export const integrationsApi = {
  getCalendars: () => api.get<CalendarConnection[]>("/api/integrations/calendars"),
  connectCalendar: (provider: string) =>
    api.post<{ authUrl: string }>("/api/integrations/calendars/connect", { provider }),
  disconnectCalendar: (id: string) =>
    api.delete<{ success: boolean }>(`/api/integrations/calendars/${id}`),
  getEmails: () => api.get<EmailConnection[]>("/api/integrations/emails"),
  connectEmail: (provider: string) =>
    api.post<{ authUrl: string }>("/api/integrations/emails/connect", { provider }),
  disconnectEmail: (id: string) =>
    api.delete<{ success: boolean }>(`/api/integrations/emails/${id}`),
};

// Export
export interface ExportJob {
  id: string;
  type: "pdf" | "word" | "analytics";
  filename: string;
  status: "pending" | "processing" | "done" | "error";
  url?: string;
  createdAt: string;
}

export const exportApi = {
  exportPdf: (data: { documentIds: string[]; template?: string }) =>
    api.post<ExportJob>("/api/export/pdf", data),
  exportWord: (data: { documentIds: string[]; template?: string }) =>
    api.post<ExportJob>("/api/export/word", data),
  exportAnalytics: (data: { range: string; format: string }) =>
    api.post<ExportJob>("/api/export/analytics", data),
  getJobs: () => api.get<ExportJob[]>("/api/export/jobs"),
  getJob: (id: string) => api.get<ExportJob>(`/api/export/jobs/${id}`),
};

// User / Subscription
export const userApi = {
  getProfile: (email: string) =>
    api.get<{ plan: string; status: string; subscription: Record<string, unknown> }>(
      `/api/user/${encodeURIComponent(email)}`
    ),
};

export { API_BASE_URL };
export default api;