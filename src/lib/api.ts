// Centralized API client for RelunoOS
// All requests route through http://localhost:5000 (or VITE_API_URL)

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── Core fetcher ──────────────────────────────────────────────────────────────
async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers,
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

// ─── Token-aware API Factory ───────────────────────────────────────────────────
export const createApiClient = (token?: string | null) => ({
  get: <T = unknown>(path: string, options?: RequestInit) =>
    apiFetch<T>(path, { method: "GET", ...options }, token),

  post: <T = unknown>(path: string, body: unknown, options?: RequestInit) =>
    apiFetch<T>(
      path,
      {
        method: "POST",
        body: JSON.stringify(body),
        ...options,
      },
      token
    ),

  put: <T = unknown>(path: string, body: unknown, options?: RequestInit) =>
    apiFetch<T>(
      path,
      {
        method: "PUT",
        body: JSON.stringify(body),
        ...options,
      },
      token
    ),

  patch: <T = unknown>(path: string, body: unknown, options?: RequestInit) =>
    apiFetch<T>(
      path,
      {
        method: "PATCH",
        body: JSON.stringify(body),
        ...options,
      },
      token
    ),

  delete: <T = unknown>(path: string, options?: RequestInit) =>
    apiFetch<T>(path, { method: "DELETE", ...options }, token),
});

// Fallback default client for non-hook usages
export const api = createApiClient(null);

// ─── Typed endpoint helpers ────────────────────────────────────────────────────

// Clients (CRM)
export interface Client {
  id: string;
  userId: string;
  organizationId?: string | null;
  name: string;
  email: string | null;
  company: string | null;
  phone: string | null;
  status: string; // 'lead' | 'active' | 'inactive'
  tags: string[];
  notes: string | null;
  assignedUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClientNote {
  id: string;
  clientId: string;
  body: string;
  createdAt: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: string;
  progress: number;
  createdAt: string;
}

export interface InvoiceSummary {
  id: string;
  amount: number;
  amountPaid: number;
  status: string; // "UNPAID" | "PAID" | "OVERDUE"
  dueDate: string | null;
  createdAt: string;
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  description: string;
  module: string | null;
  targetId: string | null;
  createdAt: string;
}

export interface AssignableUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export interface ClientDetail extends Client {
  projects: ProjectSummary[];
  invoices: InvoiceSummary[];
  proposals: { id: string; title: string; amount: number; status: string; createdAt: string }[];
  clientNotes: ClientNote[];
  activity: ActivityLogEntry[];
  assignedUser: AssignableUser | null;
}

export interface ClientsResponse {
  clients: Client[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const clientsApi = {
  getAll: (search?: string, status?: string, page?: number, limit?: number, token?: string | null): Promise<ClientsResponse> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'all') params.append('status', status);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return createApiClient(token).get<ClientsResponse>(`/api/clients?${params.toString()}`);
  },

  getById: (id: string, token?: string | null): Promise<ClientDetail> => {
    return createApiClient(token).get<ClientDetail>(`/api/clients/${id}`);
  },

  create: (data: Partial<Client>, token?: string | null): Promise<Client> => {
    return createApiClient(token).post<Client>('/api/clients', data);
  },

  update: (id: string, data: Partial<Client>, token?: string | null): Promise<Client> => {
    return createApiClient(token).patch<Client>(`/api/clients/${id}`, data);
  },

  delete: (id: string, token?: string | null): Promise<void> => {
    return createApiClient(token).delete<void>(`/api/clients/${id}`);
  },

  addNote: (id: string, body: string, token?: string | null): Promise<ClientNote> => {
    return createApiClient(token).post<ClientNote>(`/api/clients/${id}/notes`, { body });
  },

  getAssignableUsers: (id: string, token?: string | null): Promise<{ users: AssignableUser[] }> => {
    return createApiClient(token).get<{ users: AssignableUser[] }>(`/api/clients/${id}/assignable-users`);
  },
};

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
  getAll: (token?: string | null) => createApiClient(token).get<Task[]>("/api/tasks"),
  create: (data: { title: string; priority?: string; dueDate?: string; caseId?: string }, token?: string | null) =>
    createApiClient(token).post<Task>("/api/tasks", data),
  update: (id: string, data: Partial<Task>, token?: string | null) =>
    createApiClient(token).patch<Task>(`/api/tasks/${id}`, data),
  delete: (id: string, token?: string | null) => createApiClient(token).delete<{ success: boolean }>(`/api/tasks/${id}`),
  toggle: (id: string, completed: boolean, token?: string | null) =>
    createApiClient(token).patch<Task>(`/api/tasks/${id}`, { completed }),
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
  analyze: (data: { content: string; filename: string }, token?: string | null) =>
    createApiClient(token).post<PdfAnalysisResult>("/api/pdf-analysis", data),
  getHistory: (token?: string | null) => createApiClient(token).get<PdfAnalysisResult[]>("/api/pdf-analysis/history"),
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
  getDashboard: (token?: string | null) => createApiClient(token).get<AnalyticsData>("/api/analytics"),
  getResolutionVelocity: (token?: string | null) => createApiClient(token).get<AnalyticsData["resolutionTrend"]>("/api/analytics/resolution"),
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
  getCalendars: (token?: string | null) => createApiClient(token).get<CalendarConnection[]>("/api/integrations/calendars"),
  connectCalendar: (provider: string, token?: string | null) =>
    createApiClient(token).post<{ authUrl: string }>("/api/integrations/calendars/connect", { provider }),
  disconnectCalendar: (id: string, token?: string | null) =>
    createApiClient(token).delete<{ success: boolean }>(`/api/integrations/calendars/${id}`),
  getEmails: (token?: string | null) => createApiClient(token).get<EmailConnection[]>("/api/integrations/emails"),
  connectEmail: (provider: string, token?: string | null) =>
    createApiClient(token).post<{ authUrl: string }>("/api/integrations/emails/connect", { provider }),
  disconnectEmail: (id: string, token?: string | null) =>
    createApiClient(token).delete<{ success: boolean }>(`/api/integrations/emails/${id}`),
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
  exportPdf: (data: { documentIds: string[]; template?: string }, token?: string | null) =>
    createApiClient(token).post<ExportJob>("/api/export/pdf", data),
  exportWord: (data: { documentIds: string[]; template?: string }, token?: string | null) =>
    createApiClient(token).post<ExportJob>("/api/export/word", data),
  exportAnalytics: (data: { range: string; format: string }, token?: string | null) =>
    createApiClient(token).post<ExportJob>("/api/export/analytics", data),
  getJobs: (token?: string | null) => createApiClient(token).get<ExportJob[]>("/api/export/jobs"),
  getJob: (id: string, token?: string | null) => createApiClient(token).get<ExportJob>(`/api/export/jobs/${id}`),
};

// User / Subscription
export const userApi = {
  getProfile: (email: string, token?: string | null) =>
    createApiClient(token).get<{ plan: string; status: string; subscription: Record<string, unknown> }>(
      `/api/user/${encodeURIComponent(email)}`
    ),
};

export { API_BASE_URL };
export default api;