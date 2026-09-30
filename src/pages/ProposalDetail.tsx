import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Edit3,
  Eye,
  FileText,
  Loader2,
  Mail,
  MoreHorizontal,
  Plus,
  Save,
  Send,
  Trash2,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import { createApiClient } from "@/lib/api";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Status ──────────────────────────────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
    currency: "USD",
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

function formatShortDate(dateString?: string) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getClientInitials(name: string) {
  const safeName = name.trim() || "Client";

  return safeName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getStatusTimelineLabel(proposal: Proposal) {
  const normalizedStatus = proposal.status?.toLowerCase();

  if (normalizedStatus === "signed" && proposal.signedAt) {
    return `Signed ${formatShortDate(proposal.signedAt)}`;
  }

  if (normalizedStatus === "rejected" && proposal.rejectedAt) {
    return `Rejected ${formatShortDate(proposal.rejectedAt)}`;
  }

  if (normalizedStatus === "expired" && proposal.expiredAt) {
    return `Expired ${formatShortDate(proposal.expiredAt)}`;
  }

  if (normalizedStatus === "viewed" && proposal.lastViewedAt) {
    return `Last viewed ${formatShortDate(proposal.lastViewedAt)}`;
  }

  if (normalizedStatus === "sent" && proposal.sentAt) {
    return `Sent ${formatShortDate(proposal.sentAt)}`;
  }

  return `Updated ${formatShortDate(proposal.updatedAt)}`;
}

// ─── UI Components ───────────────────────────────────────────────────────────

function SectionHeading({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-zinc-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
          <Icon size={16} strokeWidth={1.8} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>

          <p className="mt-1 text-[11px] leading-5 text-zinc-500">
            {description}
          </p>
        </div>
      </div>

      {action}
    </div>
  );
}

function ListEditor({
  label,
  helper,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  helper: string;
  items: string[];
  onChange: (nextItems: string[]) => void;
  placeholder: string;
}) {
  const updateItem = (index: number, value: string) => {
    const nextItems = [...items];
    nextItems[index] = value;
    onChange(nextItems);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      onChange([""]);
      return;
    }

    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const addItem = () => {
    onChange([...items, ""]);
  };

  return (
    <section>
      <div className="mb-4">
        <p className="text-sm font-semibold text-zinc-900">{label}</p>

        <p className="mt-1 text-[11px] leading-5 text-zinc-500">{helper}</p>
      </div>

      <div className="space-y-2.5">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-[11px] font-semibold text-zinc-500">
              {index + 1}
            </span>

            <input
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              placeholder={placeholder}
              className="h-10 min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
            />

            <button
              type="button"
              onClick={() => removeItem(index)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
              aria-label={`Remove ${label.toLowerCase()} item ${index + 1}`}
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
      >
        <Plus size={13} />
        Add item
      </button>
    </section>
  );
}

function EmptyProposalSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/70 px-4 py-5">
      <p className="text-xs font-medium text-zinc-600">{title}</p>

      <p className="mt-1 text-[11px] leading-5 text-zinc-400">
        {description}
      </p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

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

    setScope(
      toStringArray(data.scopeOfWork).length > 0
        ? toStringArray(data.scopeOfWork)
        : [""]
    );

    setTimeline(
      toStringArray(data.timeline).length > 0
        ? toStringArray(data.timeline)
        : [""]
    );

    setFormError(null);
  }, []);

  const loadProposal = useCallback(async () => {
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

      setPageError(
        err instanceof Error ? err.message : "Failed to load proposal."
      );
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

    if (proposal) {
      populateForm(proposal);
    }

    setFormError(null);
    setIsEditing(false);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!proposal) return;

    if (!clientId || !title.trim() || !amount) {
      setFormError(
        "Please complete the client, title, and total amount before saving."
      );
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
        const responseData = await client.post<{ proposal: Proposal }>(
          "/api/proposals",
          payload
        );

        nextProposal = responseData.proposal;
        navigate(`/proposals/${nextProposal.id}`, { replace: true });
      } else {
        const updated = await client.patch<Proposal>(
          `/api/proposals/${id}`,
          payload
        );

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

      const message =
        err instanceof Error ? err.message : "Failed to save proposal.";

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

      const responseData = await client.post<{ proposal: Proposal }>(
        "/api/proposals",
        {
          clientId: proposal.clientId,
          title: `${proposal.title} (Copy)`,
          amount: proposal.amount,
          scopeOfWork: proposal.scopeOfWork,
          timeline: proposal.timeline,
          pricing: proposal.pricing,
          terms: proposal.terms,
          status: "draft",
        }
      );

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

  const storedScope = useMemo(
    () => toStringArray(proposal?.scopeOfWork),
    [proposal?.scopeOfWork]
  );

  const storedTimeline = useMemo(
    () => toStringArray(proposal?.timeline),
    [proposal?.timeline]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] px-5 py-10 text-zinc-900 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-4 w-40 rounded bg-zinc-200" />

          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div className="border-b border-zinc-100 px-7 py-9 sm:px-10">
              <div className="h-4 w-20 rounded bg-zinc-100" />
              <div className="mt-6 h-12 max-w-2xl rounded bg-zinc-100" />
              <div className="mt-4 h-4 w-64 rounded bg-zinc-100" />
            </div>

            <div className="space-y-8 p-7 sm:p-10">
              <div className="h-32 rounded-xl bg-zinc-50" />
              <div className="h-44 rounded-xl bg-zinc-50" />
              <div className="h-44 rounded-xl bg-zinc-50" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageError || !proposal) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-5 text-zinc-900 sm:px-8">
        <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertCircle size={21} />
          </div>

          <h1 className="mt-4 text-lg font-semibold text-zinc-900">
            Unable to load proposal
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {pageError || "The proposal could not be found."}
          </p>

          <div className="mt-6 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => void loadProposal()}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-zinc-700"
            >
              <Loader2 size={14} />
              Try again
            </button>

            <button
              type="button"
              onClick={() => navigate("/proposals")}
              className="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Back to proposals
            </button>
          </div>
        </div>
      </div>
    );
  }

  const normalizedStatus = (
    proposal.status?.toLowerCase() || "draft"
  ) as ProposalStatus;

  const currentStatus =
    statusConfig[normalizedStatus] || statusConfig.draft;

  const StatusIcon = currentStatus.icon;

  const selectedClient =
    clients.find(
      (clientItem) =>
        clientItem.id === (isEditing ? clientId : proposal.clientId)
    ) || proposal.client;

  const clientName =
    selectedClient?.name || proposal.client?.name || "Client";

  const clientCompany =
    selectedClient?.company || proposal.client?.company;

  const clientEmail =
    selectedClient?.email || proposal.client?.email;

  const clientInitials = getClientInitials(clientName);

  const displayedTitle = isEditing
    ? title || "Untitled proposal"
    : proposal.title;

  const visibleScope = isEditing
    ? scope.map((item) => item.trim()).filter(Boolean)
    : storedScope;

  const visibleTimeline = isEditing
    ? timeline.map((item) => item.trim()).filter(Boolean)
    : storedTimeline;

  const canSend =
    proposal.id !== "new" &&
    normalizedStatus === "draft" &&
    Boolean(proposal.client?.email);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20 text-zinc-900 selection:bg-zinc-200">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");

        .font-serif {
          font-family: "DM Serif Display", serif;
        }

        * {
          font-family: "DM Sans", sans-serif;
        }
      `}</style>

      {/* Sticky Editor Toolbar */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-[#fafafa]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => navigate("/proposals")}
            className="group inline-flex items-center gap-2 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white transition-colors group-hover:bg-zinc-50">
              <ArrowLeft size={15} />
            </span>

            <span className="hidden sm:inline">All proposals</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-lg border border-zinc-200 bg-white p-1 sm:flex">
              <button
                type="button"
                onClick={handleCancelEditing}
                disabled={busyAction !== null}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
                  !isEditing
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                )}
              >
                <Eye size={13} />
                Preview
              </button>

              <button
                type="button"
                onClick={handleStartEditing}
                disabled={busyAction !== null}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
                  isEditing
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                )}
              >
                <Edit3 size={13} />
                Edit
              </button>
            </div>

            {isEditing ? (
              <>
                <button
  type="button"
  onClick={handleCancelEditing}
  disabled={busyAction !== null}
  className="hidden h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex"
>
  Cancel
</button>

                <button
                  type="button"
                  onClick={() => {
                    const form = document.getElementById(
                      "proposal-editor-form"
                    ) as HTMLFormElement | null;

                    form?.requestSubmit();
                  }}
                  disabled={busyAction !== null}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busyAction === "save" ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}

                  <span className="hidden sm:inline">
                    {busyAction === "save" ? "Saving…" : "Save changes"}
                  </span>

                  <span className="sm:hidden">Save</span>
                </button>
              </>
            ) : (
              <>
                {normalizedStatus === "draft" && (
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={busyAction !== null || !canSend}
                    title={
                      canSend
                        ? "Send proposal to client"
                        : "A client email is required before sending"
                    }
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busyAction === "send" ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}

                    <span className="hidden sm:inline">
                      {busyAction === "send" ? "Sending…" : "Send proposal"}
                    </span>

                    <span className="sm:hidden">Send</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleStartEditing}
                  disabled={busyAction !== null}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 sm:hidden"
                >
                  <Edit3 size={14} />
                  Edit
                </button>

                <details className="relative">
                  <summary
                    className={cn(
                      "flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50",
                      busyAction !== null && "pointer-events-none opacity-50"
                    )}
                  >
                    <MoreHorizontal size={17} />
                  </summary>

                  <div className="absolute right-0 top-11 z-40 w-52 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl shadow-zinc-900/10">
                    <button
                      type="button"
                      onClick={handleDuplicate}
                      disabled={busyAction !== null}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
                    >
                      {busyAction === "duplicate" ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Copy size={14} className="text-zinc-400" />
                      )}

                      Duplicate proposal
                    </button>

                    <div className="my-1 border-t border-zinc-100" />

                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={busyAction !== null}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      {busyAction === "delete" ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
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

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        {/* Breadcrumbs */}
        <div className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-[11px] font-medium text-zinc-400">
          <button
            type="button"
            onClick={() => navigate("/proposals")}
            className="transition-colors hover:text-zinc-700"
          >
            Proposals
          </button>

          <ChevronRight size={13} />

          <span className="max-w-[240px] truncate text-zinc-600">
            {displayedTitle}
          </span>

          {isEditing && (
            <span className="rounded-md bg-zinc-200 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
              Editing
            </span>
          )}
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_270px]">
          {/* Main Proposal */}
          <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            {/* Proposal Cover */}
            <div className="border-b border-zinc-100 bg-gradient-to-br from-zinc-50 via-white to-white px-6 py-8 sm:px-10 sm:py-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
                    currentStatus.className
                  )}
                >
                  <StatusIcon size={12} />
                  {currentStatus.label}
                </span>

                <span className="text-[11px] font-medium text-zinc-400">
                  {proposal.version && proposal.version > 1
                    ? `Version ${proposal.version}`
                    : "Version 1"}
                </span>
              </div>

              <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                {isEditing ? "Editing proposal" : "Project proposal"}
              </p>

              {isEditing ? (
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Proposal title"
                  className="font-serif mt-3 w-full max-w-3xl border-0 bg-transparent p-0 text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-zinc-900 outline-none placeholder:text-zinc-300 focus:ring-0 sm:text-5xl"
                />
              ) : (
                <h1 className="font-serif mt-3 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-zinc-900 sm:text-5xl">
                  {proposal.title}
                </h1>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-[12px] text-zinc-500">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={14} className="text-zinc-400" />
                  Created {formatDate(proposal.createdAt)}
                </span>

                <span className="inline-flex items-center gap-2">
                  <UserRound size={14} className="text-zinc-400" />
                  For {clientName}
                  {clientCompany ? ` · ${clientCompany}` : ""}
                </span>
              </div>
            </div>

            {/* Proposal Form / Content */}
            <form id="proposal-editor-form" onSubmit={handleSave}>
              <div className="space-y-10 px-6 py-8 sm:px-10 sm:py-10">
                {formError && isEditing && (
                  <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Client + Investment */}
                <section className="grid gap-5 lg:grid-cols-2">
                  <div className="rounded-xl border border-zinc-200 bg-white p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                      Prepared for
                    </p>

                    {isEditing ? (
                      <div className="mt-4">
                        <label
                          htmlFor="proposal-client"
                          className="mb-2 block text-xs font-medium text-zinc-700"
                        >
                          Client
                        </label>

                        {loadingClients ? (
                          <div className="h-10 animate-pulse rounded-lg bg-zinc-100" />
                        ) : clients.length === 0 ? (
                          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-xs leading-5 text-amber-700">
                            No clients are available. Create a client in CRM
                            before making a proposal.
                          </div>
                        ) : (
                          <select
                            id="proposal-client"
                            value={clientId}
                            onChange={(event) => setClientId(event.target.value)}
                            className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition-all focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
                          >
                            <option value="">Select a client…</option>

                            {clients.map((clientItem) => (
                              <option
                                key={clientItem.id}
                                value={clientItem.id}
                              >
                                {clientItem.name}
                                {clientItem.company
                                  ? ` · ${clientItem.company}`
                                  : ""}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-xs font-semibold text-zinc-600">
                          {clientInitials}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-zinc-900">
                            {clientName}
                          </p>

                          <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                            {clientCompany ||
                              clientEmail ||
                              "Client account"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border border-zinc-200 bg-white p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                      Total investment
                    </p>

                    {isEditing ? (
                      <div className="mt-4">
                        <label
                          htmlFor="proposal-amount"
                          className="mb-2 block text-xs font-medium text-zinc-700"
                        >
                          Proposal amount
                        </label>

                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-400">
                            $
                          </span>

                          <input
                            id="proposal-amount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            placeholder="0"
                            className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-7 pr-3 text-sm font-semibold tabular-nums text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
                          />
                        </div>

                        <p className="mt-2 text-[11px] text-zinc-400">
                          Currency: USD
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <p className="font-serif text-3xl font-bold tracking-tight text-zinc-900">
                          {formatCurrency(proposal.amount)}
                        </p>

                        <p className="mt-1 text-[11px] text-zinc-400">
                          USD · Total proposal value
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Scope */}
                <section>
                  <SectionHeading
                    icon={FileText}
                    title="Scope of work"
                    description="Define the client-facing deliverables and work included in this proposal."
                  />

                  <div className="mt-5">
                    {isEditing ? (
                      <ListEditor
                        label="Included deliverables"
                        helper="Add one clear deliverable per line item."
                        items={scope}
                        onChange={setScope}
                        placeholder="Example: UX research and interface design"
                      />
                    ) : visibleScope.length > 0 ? (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {visibleScope.map((item, index) => (
                          <div
                            key={`${item}-${index}`}
                            className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50/60 p-4"
                          >
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-semibold text-white">
                              {index + 1}
                            </span>

                            <p className="text-xs leading-5 text-zinc-700">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyProposalSection
                        title="No scope items have been added."
                        description="Edit this proposal to outline the deliverables and work included for the client."
                      />
                    )}
                  </div>
                </section>

                {/* Timeline */}
                <section>
                  <SectionHeading
                    icon={CalendarDays}
                    title="Timeline"
                    description="Set clear delivery milestones or phases so the client understands what happens next."
                  />

                  <div className="mt-5">
                    {isEditing ? (
                      <ListEditor
                        label="Delivery milestones"
                        helper="Add one phase, date, or delivery milestone per line item."
                        items={timeline}
                        onChange={setTimeline}
                        placeholder="Example: Discovery and planning — Week 1"
                      />
                    ) : visibleTimeline.length > 0 ? (
                      <div className="space-y-2">
                        {visibleTimeline.map((item, index) => (
                          <div
                            key={`${item}-${index}`}
                            className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-4"
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-[11px] font-semibold text-zinc-600">
                              {index + 1}
                            </div>

                            <div className="pt-0.5">
                              <p className="text-xs font-medium leading-5 text-zinc-700">
                                {item}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyProposalSection
                        title="No delivery timeline has been added."
                        description="Edit this proposal to add phases, milestones, or estimated delivery timing."
                      />
                    )}
                  </div>
                </section>

                {/* Proposal Summary */}
                <section>
                  <SectionHeading
                    icon={CheckCircle2}
                    title="Proposal summary"
                    description="A clear overview of the commercial and delivery context for this proposal."
                  />

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                        Client
                      </p>

                      <p className="mt-2 truncate text-xs font-semibold text-zinc-800">
                        {clientName}
                      </p>
                    </div>

                    <div className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                        Investment
                      </p>

                      <p className="mt-2 text-xs font-semibold text-zinc-800">
                        {isEditing
                          ? formatCurrency(Number(amount || 0))
                          : formatCurrency(proposal.amount)}
                      </p>
                    </div>

                    <div className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                        Deliverables
                      </p>

                      <p className="mt-2 text-xs font-semibold text-zinc-800">
                        {visibleScope.length} item
                        {visibleScope.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </article>

          {/* Side Context */}
          <aside className="space-y-4 xl:sticky xl:top-20">
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                Proposal status
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                  <StatusIcon size={16} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {currentStatus.label}
                  </p>

                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    {getStatusTimelineLabel(proposal)}
                  </p>
                </div>
              </div>

              {normalizedStatus === "draft" && (
                <div className="mt-5 border-t border-zinc-100 pt-4">
                  <p className="text-[11px] leading-5 text-zinc-500">
                    Review the content, then send the proposal when it is ready
                    for the client.
                  </p>

                  {!clientEmail && (
                    <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-700">
                      Add a client email in CRM before sending this proposal.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={busyAction !== null || !canSend}
                    className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busyAction === "send" ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Mail size={14} />
                    )}

                    {busyAction === "send" ? "Sending…" : "Send to client"}
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                Client contact
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-[11px] font-semibold text-zinc-600">
                  {clientInitials}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-zinc-800">
                    {clientName}
                  </p>

                  <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                    {clientEmail || clientCompany || "No email on file"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/crm/${proposal.clientId}`)}
                disabled={!proposal.clientId}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Open client record
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                Proposal activity
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-zinc-500">Created</span>
                  <span className="font-medium text-zinc-800">
                    {formatShortDate(proposal.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-zinc-500">Last updated</span>
                  <span className="font-medium text-zinc-800">
                    {formatShortDate(proposal.updatedAt)}
                  </span>
                </div>

                {(proposal.sentCount || proposal.viewedCount) && (
                  <>
                    <div className="h-px bg-zinc-100" />

                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-zinc-500">Times sent</span>
                      <span className="font-medium text-zinc-800">
                        {proposal.sentCount || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-zinc-500">Views</span>
                      <span className="font-medium text-zinc-800">
                        {proposal.viewedCount || 0}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Sticky mobile save bar */}
        {isEditing && (
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 p-3 backdrop-blur lg:hidden">
            <div className="mx-auto flex max-w-6xl gap-2 px-2">
              <button
                type="button"
                onClick={handleCancelEditing}
                disabled={busyAction !== null}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  const form = document.getElementById(
                    "proposal-editor-form"
                  ) as HTMLFormElement | null;

                  form?.requestSubmit();
                }}
                disabled={busyAction !== null}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
              >
                {busyAction === "save" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}

                {busyAction === "save" ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}