import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Edit3,
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  Save,
  Send,
  Trash2,
  UserRound,
  XCircle,
} from "lucide-react";
import { createApiClient } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
}

interface Proposal {
  id: string;
  userId: string;
  clientId: string;
  title: string;
  amount: number;
  status: string;
  documentUrl?: string;
  scopeOfWork?: unknown;
  timeline?: unknown;
  pricing?: unknown;
  terms?: unknown;
  version?: number;
  sentAt?: string;
  viewedAt?: string;
  signedAt?: string;
  rejectedAt?: string;
  expiredAt?: string;
  sentCount?: number;
  viewedCount?: number;
  lastViewedAt?: string;
  createdAt: string;
  updatedAt: string;
  client?: Client;
}

type ProposalStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "signed"
  | "rejected"
  | "expired";

type BusyAction = "save" | "send" | "duplicate" | "delete" | null;

const statusConfig: Record<
  ProposalStatus,
  {
    label: string;
    icon: typeof FileText;
    className: string;
  }
> = {
  draft: {
    label: "Draft",
    icon: FileText,
    className: "border-zinc-200 bg-zinc-100 text-zinc-600",
  },
  sent: {
    label: "Sent",
    icon: Send,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  viewed: {
    label: "Viewed",
    icon: Eye,
    className: "border-violet-200 bg-violet-50 text-violet-700",
  },
  signed: {
    label: "Signed",
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-700",
  },
  expired: {
    label: "Expired",
    icon: Clock3,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
};

const toastConfig = {
  closeButton: true,
  classNames: {
    closeButton:
      "!left-auto !right-2 !top-2 !translate-y-0 !bg-zinc-100 hover:!bg-zinc-200 !text-zinc-500 hover:!text-zinc-800 !border-0 !rounded-full !w-6 !h-6 !flex !items-center !justify-center transition-colors",
  },
  style: {
    background: "#ffffff",
    border: "1px solid #e4e4e7",
    color: "#09090b",
    borderRadius: "1rem",
    padding: "16px",
  },
};

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

function formatDate(dateString?: string) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function ProposalDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [busyAction, setBusyAction] = useState<BusyAction>(null);

  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [scope, setScope] = useState<string[]>([""]);
  const [timeline, setTimeline] = useState<string[]>([""]);

  const api = useCallback(async () => {
    const token = await getToken();
    return createApiClient(token);
  }, [getToken]);

  const populateForm = useCallback((data: Proposal) => {
    setClientId(data.clientId || "");
    setTitle(data.title || "");
    setAmount(String(data.amount ?? ""));
    setScope(toStringArray(data.scopeOfWork).length > 0 ? toStringArray(data.scopeOfWork) : [""]);
    setTimeline(toStringArray(data.timeline).length > 0 ? toStringArray(data.timeline) : [""]);
    setFormError(null);
  }, []);

  const loadProposal = useCallback(async () => {
    // 🛑 STOP HERE: Explicitly handle missing id OR "new" as a brand new draft proposal
    if (!id || id === "new") {
      const blankProposal: Proposal = {
        id: "new",
        userId: "",
        clientId: "",
        title: "Untitled proposal",
        amount: 0,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProposal(blankProposal);
      populateForm(blankProposal);
      setIsEditing(true);
      setLoading(false);
      setPageError(null);
      return;
    }

    setLoading(true);
    setPageError(null);

    try {
      const client = await api();
      const response = await client.get<Proposal>(`/api/proposals/${id}`);

      setProposal(response);
      populateForm(response);
    } catch (err) {
      console.error("Failed to load proposal:", err);
      setPageError(err instanceof Error ? err.message : "Failed to load proposal.");
    } finally {
      setLoading(false);
    }
  }, [api, id, populateForm]);

  const loadClients = useCallback(async () => {
    setLoadingClients(true);

    try {
      const client = await api();
      const response = await client.get<{ clients: Client[] }>("/api/clients");
      setClients(response.clients || []);
    } catch (err) {
      console.error("Failed to load clients:", err);
    } finally {
      setLoadingClients(false);
    }
  }, [api]);

  useEffect(() => {
    void loadProposal();
    void loadClients();
  }, [loadClients, loadProposal]);

  const handleStartEditing = () => {
    if (!proposal) return;
    populateForm(proposal);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    if (proposal?.id === "new") {
      navigate("/proposals");
      return;
    }
    if (proposal) populateForm(proposal);
    setFormError(null);
    setIsEditing(false);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!proposal) return;

    if (!clientId || !title.trim() || !amount) {
      setFormError("Please complete the client, title, and total amount before saving.");
      return;
    }

    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
      setFormError("Enter a valid proposal amount.");
      return;
    }

    setBusyAction("save");
    setFormError(null);

    try {
      const client = await api();

      const payload = {
        clientId,
        title: title.trim(),
        amount: parsedAmount,
        scopeOfWork: scope.map((item) => item.trim()).filter(Boolean),
        timeline: timeline.map((item) => item.trim()).filter(Boolean),
        status: proposal.status || "draft",
      };

      let nextProposal: Proposal;

      if (proposal.id === "new") {
        const responseData = await client.post<{ proposal: Proposal }>("/api/proposals", payload);
        nextProposal = responseData.proposal;
        navigate(`/proposals/${nextProposal.id}`, { replace: true });
      } else {
        const updated = await client.patch<Proposal>(`/api/proposals/${id}`, payload);
        nextProposal = {
          ...proposal,
          ...updated,
          client:
            clients.find((clientItem) => clientItem.id === clientId) ||
            updated.client ||
            proposal.client,
        };
      }

      setProposal(nextProposal);
      populateForm(nextProposal);
      setIsEditing(false);

      toast.success("Proposal saved successfully!", {
        ...toastConfig,
        description: "Your changes have been saved.",
      });
    } catch (err) {
      console.error("Failed to save proposal:", err);

      const message = err instanceof Error ? err.message : "Failed to save proposal.";
      setFormError(message);

      toast.error("Unable to save proposal", {
        ...toastConfig,
        description: message,
        style: {
          ...toastConfig.style,
          borderColor: "#fecaca",
          background: "#fef2f2",
        },
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleSend = async () => {
    if (!proposal || !id || id === "new") return;

    setBusyAction("send");

    try {
      const client = await api();

      await client.post(`/api/proposals/${id}/send`, {
        clientEmail: proposal.client?.email,
      });

      await loadProposal();

      toast.success("Proposal sent successfully!", {
        ...toastConfig,
        description: "The client can now review this proposal.",
      });
    } catch (err) {
      console.error("Failed to send proposal:", err);

      toast.error("Unable to send proposal", {
        ...toastConfig,
        description: err instanceof Error ? err.message : "Please try again.",
        style: {
          ...toastConfig.style,
          borderColor: "#fecaca",
          background: "#fef2f2",
        },
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleDuplicate = async () => {
    if (!proposal || proposal.id === "new") return;

    setBusyAction("duplicate");

    try {
      const client = await api();

      const responseData = await client.post<{ proposal: Proposal }>("/api/proposals", {
        clientId: proposal.clientId,
        title: `${proposal.title} (Copy)`,
        amount: proposal.amount,
        scopeOfWork: proposal.scopeOfWork,
        timeline: proposal.timeline,
        pricing: proposal.pricing,
        terms: proposal.terms,
        status: "draft",
      });

      const created = responseData.proposal;

      toast.success("Proposal duplicated successfully!", {
        ...toastConfig,
        description: "You are now editing the new draft copy.",
      });

      navigate(`/proposals/${created.id}`);
    } catch (err) {
      console.error("Failed to duplicate proposal:", err);

      toast.error("Unable to duplicate proposal", {
        ...toastConfig,
        description: err instanceof Error ? err.message : "Please try again.",
        style: {
          ...toastConfig.style,
          borderColor: "#fecaca",
          background: "#fef2f2",
        },
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleDelete = async () => {
    if (!proposal || !id || id === "new") return;

    const confirmed = window.confirm(
      `Delete “${proposal.title}”? This action cannot be undone.`
    );

    if (!confirmed) return;

    setBusyAction("delete");

    try {
      const client = await api();
      await client.delete(`/api/proposals/${id}`);

      toast.success("Proposal deleted successfully!", {
        ...toastConfig,
        description: "The proposal has been permanently removed.",
      });

      navigate("/proposals");
    } catch (err) {
      console.error("Failed to delete proposal:", err);

      toast.error("Unable to delete proposal", {
        ...toastConfig,
        description: err instanceof Error ? err.message : "Please try again.",
        style: {
          ...toastConfig.style,
          borderColor: "#fecaca",
          background: "#fef2f2",
        },
      });
    } finally {
      setBusyAction(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-6 py-12">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-5 w-40 rounded bg-zinc-200" />
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-12">
            <div className="mb-5 h-4 w-24 rounded bg-zinc-100" />
            <div className="mb-3 h-12 max-w-xl rounded bg-zinc-100" />
            <div className="h-5 w-64 rounded bg-zinc-100" />
            <div className="mt-14 h-48 rounded-2xl bg-zinc-50" />
          </div>
        </div>
      </div>
    );
  }

  if (pageError || !proposal) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-6">
        <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle size={22} />
          </div>

          <h1 className="text-lg font-semibold text-zinc-900">
            Unable to load proposal
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            {pageError || "The proposal could not be found."}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => void loadProposal()}
              className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              Try again
            </button>

            <button
              type="button"
              onClick={() => navigate("/proposals")}
              className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const normalizedStatus = (proposal.status?.toLowerCase() || "draft") as ProposalStatus;
  const currentStatus = statusConfig[normalizedStatus] || statusConfig.draft;
  const StatusIcon = currentStatus.icon;

  const selectedClient =
    clients.find((clientItem) => clientItem.id === (isEditing ? clientId : proposal.clientId)) ||
    proposal.client;

  const clientName = selectedClient?.name || proposal.client?.name || "Client";
  const clientCompany = selectedClient?.company || proposal.client?.company;
  const clientInitial = clientName.trim().charAt(0).toUpperCase() || "C";

  const displayedTitle = isEditing ? title || "Untitled proposal" : proposal.title;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-16 text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
        .font-serif { font-family: 'DM Serif Display', serif; }
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-[#FAFAFA]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <button
            type="button"
            onClick={() => navigate("/proposals")}
            className="group inline-flex items-center gap-2 text-[13px] font-semibold text-zinc-500 transition-colors hover:text-zinc-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white transition-colors group-hover:border-zinc-300 group-hover:bg-zinc-50">
              <ArrowLeft size={15} />
            </span>
            <span className="hidden sm:inline">All proposals</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-xl border border-zinc-200 bg-white p-1 sm:flex">
              <button
                type="button"
                onClick={handleCancelEditing}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors",
                  !isEditing
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                )}
              >
                <Eye size={14} />
                Preview
              </button>

              <button
                type="button"
                onClick={handleStartEditing}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors",
                  isEditing
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                )}
              >
                <Edit3 size={14} />
                Edit
              </button>
            </div>

            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEditing}
                  disabled={busyAction !== null}
                  className="hidden rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 sm:inline-flex"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const form = document.getElementById("proposal-editor-form") as HTMLFormElement | null;
                    form?.requestSubmit();
                  }}
                  disabled={busyAction !== null}
                  className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busyAction === "save" ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}
                  <span className="hidden sm:inline">
                    {busyAction === "save" ? "Saving..." : "Save changes"}
                  </span>
                  <span className="sm:hidden">Save</span>
                </button>
              </>
            ) : (
              <>
                {proposal.status?.toLowerCase() === "draft" && (
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={busyAction !== null}
                    className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busyAction === "send" ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Send size={15} />
                    )}
                    <span className="hidden sm:inline">
                      {busyAction === "send" ? "Sending..." : "Send proposal"}
                    </span>
                    <span className="sm:hidden">Send</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleStartEditing}
                  disabled={busyAction !== null}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 sm:hidden"
                >
                  <Edit3 size={15} />
                  Edit
                </button>

                <details className="relative">
                  <summary
                    className={cn(
                      "flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50",
                      busyAction !== null && "pointer-events-none opacity-50"
                    )}
                  >
                    <MoreHorizontal size={18} />
                  </summary>

                  <div className="absolute right-0 top-12 z-30 w-48 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                    <button
                      type="button"
                      onClick={handleDuplicate}
                      disabled={busyAction !== null}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
                    >
                      {busyAction === "duplicate" ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Copy size={15} />
                      )}
                      Duplicate proposal
                    </button>

                    <div className="mx-2 my-1 border-t border-zinc-100" />

                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={busyAction !== null}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      {busyAction === "delete" ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                      Delete proposal
                    </button>
                  </div>
                </details>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:py-12">
        <div className="mb-7 flex flex-wrap items-center gap-x-2 gap-y-2 text-[12px] font-medium text-zinc-400">
          <button
            type="button"
            onClick={() => navigate("/proposals")}
            className="transition-colors hover:text-zinc-700"
          >
            Proposals
          </button>
          <ChevronRight size={13} />
          <span className="max-w-[250px] truncate text-zinc-600">
            {displayedTitle}
          </span>
          {isEditing && (
            <span className="rounded-md bg-zinc-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-600">
              Editing
            </span>
          )}
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <article className="overflow-hidden rounded-3xl border border-zinc-200/90 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
            <div className="border-b border-zinc-100 bg-gradient-to-br from-zinc-50 via-white to-white px-7 py-8 sm:px-12 sm:py-11">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]",
                    currentStatus.className
                  )}
                >
                  <StatusIcon size={13} />
                  {currentStatus.label}
                </div>

                <span className="text-[12px] font-medium text-zinc-400">
                  {proposal.version && proposal.version > 1
                    ? `Version ${proposal.version}`
                    : "Version 1"}
                </span>
              </div>

              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-400">
                {isEditing ? "Editing proposal" : "Project proposal"}
              </p>

              {isEditing ? (
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Proposal title"
                  className="font-serif w-full max-w-3xl border-0 bg-transparent p-0 text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 outline-none placeholder:text-zinc-300 focus:ring-0 sm:text-5xl"
                />
              ) : (
                <h1 className="font-serif max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl">
                  {proposal.title}
                </h1>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-zinc-500">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={15} className="text-zinc-400" />
                  Created {formatDate(proposal.createdAt)}
                </span>

                <span className="inline-flex items-center gap-2">
                  <UserRound size={15} className="text-zinc-400" />
                  For {clientName}
                  {clientCompany ? ` · ${clientCompany}` : ""}
                </span>
              </div>
            </div>

            <form id="proposal-editor-form" onSubmit={handleSave}>
              <div className="px-7 py-9 sm:px-12 sm:py-12">
                {formError && isEditing && (
                  <div className="mb-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <section className="grid gap-8 border-b border-zinc-100 pb-10 md:grid-cols-[1fr_auto] md:items-end">
                  <div>
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                      Prepared for
                    </p>

                    {isEditing ? (
                      <div className="max-w-md">
                        {loadingClients ? (
                          <div className="h-11 animate-pulse rounded-xl bg-zinc-100" />
                        ) : clients.length === 0 ? (
                          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-700">
                            No clients are available. Create a client in CRM first.
                          </p>
                        ) : (
                          <select
                            value={clientId}
                            onChange={(event) => setClientId(event.target.value)}
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-medium text-zinc-800 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                          >
                            <option value="">Select a client...</option>
                            {clients.map((clientItem) => (
                              <option key={clientItem.id} value={clientItem.id}>
                                {clientItem.name}
                                {clientItem.company ? ` · ${clientItem.company}` : ""}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-bold text-white">
                          {clientInitial}
                        </div>

                        <div>
                          <p className="text-[16px] font-semibold text-zinc-900">{clientName}</p>
                          <p className="mt-0.5 text-[13px] text-zinc-500">
                            {clientCompany || "Client account"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="md:text-right">
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                      Total investment
                    </p>

                    {isEditing ? (
                      <div className="relative ml-auto max-w-[230px]">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 font-serif text-3xl font-bold text-zinc-400">
                          $
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={amount}
                          onChange={(event) => setAmount(event.target.value)}
                          placeholder="0"
                          className="font-serif w-full border-0 border-b border-zinc-200 bg-transparent py-1 pl-7 text-right text-4xl font-bold tracking-tight text-zinc-900 outline-none placeholder:text-zinc-300 focus:border-zinc-900"
                        />
                      </div>
                    ) : (
                      <p className="font-serif text-4xl font-bold tracking-tight text-zinc-900">
                        {formatCurrency(proposal.amount)}
                      </p>
                    )}

                    <p className="mt-1 text-[12px] text-zinc-400">CAD</p>
                  </div>
                </section>
              </div>
            </form>
          </article>
        </div>
      </main>
    </div>
  );
}