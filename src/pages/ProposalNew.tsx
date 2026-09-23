import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Copy,
  Edit3,
  Eye,
  FileText,
  Loader2,
  Mail,
  MoreHorizontal,
  Send,
  Trash2,
  UserRound,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { createApiClient } from "@/lib/api";
import { cn } from "@/lib/utils";

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
  client?: {
    id: string;
    name: string;
    email?: string;
    company?: string;
  };
}

type StatusKey = "draft" | "sent" | "viewed" | "signed" | "rejected" | "expired";

const statusConfig: Record<
  StatusKey,
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

function asStringArray(value: unknown): string[] {
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

export default function ProposalDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingOn, setActingOn] = useState<"send" | "duplicate" | "delete" | null>(null);

  const api = useCallback(async () => {
    const token = await getToken();
    return createApiClient(token);
  }, [getToken]);

  const loadProposal = useCallback(async () => {
    if (!id) {
      setError("No proposal ID was provided.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const client = await api();
      const response = await client.get<Proposal>(`/api/proposals/${id}`);
      setProposal(response);
    } catch (err) {
      console.error("Failed to load proposal:", err);
      setError(err instanceof Error ? err.message : "Failed to load proposal.");
    } finally {
      setLoading(false);
    }
  }, [api, id]);

  useEffect(() => {
    void loadProposal();
  }, [loadProposal]);

  const handleSend = async () => {
    if (!proposal || !id) return;

    setActingOn("send");

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
      console.error("Error sending proposal:", err);

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
      setActingOn(null);
    }
  };

  const handleDuplicate = async () => {
    if (!proposal) return;

    setActingOn("duplicate");

    try {
      const client = await api();

      const created = await client.post<Proposal>("/api/proposals", {
        clientId: proposal.clientId,
        title: `${proposal.title} (Copy)`,
        amount: proposal.amount,
        scopeOfWork: proposal.scopeOfWork,
        timeline: proposal.timeline,
        pricing: proposal.pricing,
        terms: proposal.terms,
        status: "draft",
      });

      toast.success("Proposal duplicated successfully!", {
        ...toastConfig,
        description: "You are now editing the new draft copy.",
      });

      navigate(`/proposals/${created.id}/edit`);
    } catch (err) {
      console.error("Error duplicating proposal:", err);

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
      setActingOn(null);
    }
  };

  const handleDelete = async () => {
    if (!proposal || !id) return;

    const confirmed = window.confirm(
      `Delete “${proposal.title}”? This action cannot be undone.`
    );

    if (!confirmed) return;

    setActingOn("delete");

    try {
      const client = await api();

      await client.delete(`/api/proposals/${id}`);

      toast.success("Proposal deleted successfully!", {
        ...toastConfig,
        description: "The proposal has been permanently removed.",
      });

      navigate("/proposals");
    } catch (err) {
      console.error("Error deleting proposal:", err);

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
      setActingOn(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-6 py-12">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-5 w-36 rounded bg-zinc-200" />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-12">
              <div className="mb-6 h-4 w-24 rounded bg-zinc-100" />
              <div className="mb-3 h-11 max-w-xl rounded bg-zinc-100" />
              <div className="h-5 w-56 rounded bg-zinc-100" />
              <div className="mt-14 h-40 rounded-2xl bg-zinc-50" />
              <div className="mt-8 h-40 rounded-2xl bg-zinc-50" />
            </div>
            <div className="space-y-4">
              <div className="h-44 rounded-2xl border border-zinc-200 bg-white" />
              <div className="h-44 rounded-2xl border border-zinc-200 bg-white" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
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
            {error || "The proposal could not be found."}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
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
              Back to proposals
            </button>
          </div>
        </div>
      </div>
    );
  }

  const scopeItems = asStringArray(proposal.scopeOfWork);
  const timelineItems = asStringArray(proposal.timeline);
  const proposalStatus = (proposal.status?.toLowerCase() || "draft") as StatusKey;
  const currentStatus = statusConfig[proposalStatus] || statusConfig.draft;
  const StatusIcon = currentStatus.icon;
  const clientInitial = proposal.client?.name?.trim().charAt(0).toUpperCase() || "C";

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-16 text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
        .font-serif { font-family: 'DM Serif Display', serif; }
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Top application toolbar */}
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
            {proposal.status?.toLowerCase() === "draft" && (
              <button
                type="button"
                onClick={handleSend}
                disabled={actingOn !== null}
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actingOn === "send" ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}
                <span className="hidden sm:inline">
                  {actingOn === "send" ? "Sending..." : "Send proposal"}
                </span>
                <span className="sm:hidden">Send</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate(`/proposals/${id}/edit`)}
              disabled={actingOn !== null}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Edit3 size={15} />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <details className="relative">
              <summary
                className={cn(
                  "flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50",
                  actingOn !== null && "pointer-events-none opacity-50"
                )}
              >
                <MoreHorizontal size={18} />
              </summary>

              <div className="absolute right-0 top-12 z-30 w-48 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                <button
                  type="button"
                  onClick={handleDuplicate}
                  disabled={actingOn !== null}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
                >
                  {actingOn === "duplicate" ? (
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
                  disabled={actingOn !== null}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  {actingOn === "delete" ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                  Delete proposal
                </button>
              </div>
            </details>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:py-12">
        {/* Breadcrumb + small metadata */}
        <div className="mb-7 flex flex-wrap items-center gap-x-2 gap-y-2 text-[12px] font-medium text-zinc-400">
          <button
            type="button"
            onClick={() => navigate("/proposals")}
            className="transition-colors hover:text-zinc-700"
          >
            Proposals
          </button>
          <ChevronRight size={13} />
          <span className="max-w-[250px] truncate text-zinc-600">{proposal.title}</span>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          {/* Proposal document */}
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
                Project proposal
              </p>

              <h1 className="font-serif max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl">
                {proposal.title}
              </h1>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-zinc-500">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={15} className="text-zinc-400" />
                  Created {formatDate(proposal.createdAt)}
                </span>

                {proposal.client?.name && (
                  <span className="inline-flex items-center gap-2">
                    <UserRound size={15} className="text-zinc-400" />
                    For {proposal.client.name}
                    {proposal.client.company ? ` · ${proposal.client.company}` : ""}
                  </span>
                )}
              </div>
            </div>

            <div className="px-7 py-9 sm:px-12 sm:py-12">
              {/* Proposal recipient + price */}
              <section className="grid gap-8 border-b border-zinc-100 pb-10 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Prepared for
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-bold text-white">
                      {clientInitial}
                    </div>

                    <div>
                      <p className="text-[16px] font-semibold text-zinc-900">
                        {proposal.client?.name || "Client"}
                      </p>

                      <p className="mt-0.5 text-[13px] text-zinc-500">
                        {proposal.client?.company || "Client account"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:text-right">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Total investment
                  </p>

                  <p className="font-serif text-4xl font-bold tracking-tight text-zinc-900">
                    {formatCurrency(proposal.amount)}
                  </p>

                  <p className="mt-1 text-[12px] text-zinc-400">CAD</p>
                </div>
              </section>

              {/* Intro paragraph */}
              <section className="border-b border-zinc-100 py-10">
                <p className="max-w-2xl text-[15px] leading-7 text-zinc-600">
                  This proposal outlines the recommended scope, delivery plan, and investment
                  for <span className="font-medium text-zinc-900">{proposal.title}</span>.
                  We are excited to partner with{" "}
                  <span className="font-medium text-zinc-900">
                    {proposal.client?.name || "your team"}
                  </span>{" "}
                  to deliver meaningful outcomes with a focused, transparent process.
                </p>
              </section>

              {/* Scope */}
              <section className="py-10">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                    <FileText size={17} />
                  </span>

                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                      Scope of work
                    </h2>
                    <p className="mt-0.5 text-[13px] text-zinc-500">
                      What is included in this engagement.
                    </p>
                  </div>
                </div>

                {scopeItems.length > 0 ? (
                  <div className="overflow-hidden rounded-2xl border border-zinc-200">
                    {scopeItems.map((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className={cn(
                          "flex gap-4 px-5 py-4",
                          index !== scopeItems.length - 1 && "border-b border-zinc-100"
                        )}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-bold text-zinc-500">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <p className="pt-0.5 text-[14px] leading-6 text-zinc-700">{item}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 px-5 py-7 text-center">
                    <p className="text-sm font-medium text-zinc-600">
                      No scope items have been added yet.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(`/proposals/${id}/edit`)}
                      className="mt-2 text-[13px] font-semibold text-zinc-900 underline underline-offset-4"
                    >
                      Add scope items
                    </button>
                  </div>
                )}
              </section>

              {/* Timeline */}
              <section className="border-t border-zinc-100 py-10">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                    <CalendarDays size={17} />
                  </span>

                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                      Delivery timeline
                    </h2>
                    <p className="mt-0.5 text-[13px] text-zinc-500">
                      The proposed stages of the engagement.
                    </p>
                  </div>
                </div>

                {timelineItems.length > 0 ? (
                  <ol className="relative ml-3 space-y-0 border-l border-zinc-200">
                    {timelineItems.map((item, index) => (
                      <li key={`${item}-${index}`} className="relative pl-8 pb-7 last:pb-0">
                        <span className="absolute -left-[7px] top-1 flex h-3.5 w-3.5 rounded-full border-[3px] border-white bg-zinc-900 shadow-sm" />
                        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                          Phase {index + 1}
                        </p>
                        <p className="text-[14px] leading-6 text-zinc-700">{item}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 px-5 py-7 text-center">
                    <p className="text-sm font-medium text-zinc-600">
                      No timeline stages have been added yet.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(`/proposals/${id}/edit`)}
                      className="mt-2 text-[13px] font-semibold text-zinc-900 underline underline-offset-4"
                    >
                      Add timeline stages
                    </button>
                  </div>
                )}
              </section>

              {/* Footer */}
              <section className="mt-2 rounded-2xl bg-zinc-50 px-5 py-5 sm:px-6">
                <p className="text-[13px] leading-6 text-zinc-500">
                  This proposal was prepared in RelunoOS. Changes can be made before sending the
                  proposal to the client.
                </p>
              </section>
            </div>
          </article>

          {/* Right sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                Proposal overview
              </p>

              <dl className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                    <CircleDollarSign size={16} />
                  </span>

                  <div>
                    <dt className="text-[12px] text-zinc-500">Total value</dt>
                    <dd className="mt-0.5 text-[14px] font-semibold text-zinc-900">
                      {formatCurrency(proposal.amount)}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                    <CalendarDays size={16} />
                  </span>

                  <div>
                    <dt className="text-[12px] text-zinc-500">Created</dt>
                    <dd className="mt-0.5 text-[14px] font-semibold text-zinc-900">
                      {formatShortDate(proposal.createdAt)}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                    <Clock3 size={16} />
                  </span>

                  <div>
                    <dt className="text-[12px] text-zinc-500">Last updated</dt>
                    <dd className="mt-0.5 text-[14px] font-semibold text-zinc-900">
                      {formatShortDate(proposal.updatedAt)}
                    </dd>
                  </div>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                Client
              </p>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-sm font-bold text-white">
                  {clientInitial}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-zinc-900">
                    {proposal.client?.name || "Unknown client"}
                  </p>

                  {proposal.client?.company && (
                    <p className="mt-0.5 truncate text-[12px] text-zinc-500">
                      {proposal.client.company}
                    </p>
                  )}
                </div>
              </div>

              {proposal.client?.email && (
                <a
                  href={`mailto:${proposal.client.email}`}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-zinc-50 px-3 py-2.5 text-[12px] font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <Mail size={14} />
                  <span className="truncate">{proposal.client.email}</span>
                </a>
              )}
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                Engagement activity
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="flex items-center gap-2 text-zinc-500">
                    <Send size={14} />
                    Sent
                  </span>
                  <span className="font-semibold text-zinc-900">{proposal.sentCount ?? 0}</span>
                </div>

                <div className="flex items-center justify-between text-[13px]">
                  <span className="flex items-center gap-2 text-zinc-500">
                    <Eye size={14} />
                    Viewed
                  </span>
                  <span className="font-semibold text-zinc-900">{proposal.viewedCount ?? 0}</span>
                </div>

                {proposal.sentAt && (
                  <div className="border-t border-zinc-100 pt-3 text-[12px] text-zinc-500">
                    Sent on{" "}
                    <span className="font-medium text-zinc-700">
                      {formatShortDate(proposal.sentAt)}
                    </span>
                  </div>
                )}

                {proposal.lastViewedAt || proposal.viewedAt ? (
                  <div className="text-[12px] text-zinc-500">
                    Last viewed{" "}
                    <span className="font-medium text-zinc-700">
                      {formatShortDate(proposal.lastViewedAt || proposal.viewedAt)}
                    </span>
                  </div>
                ) : null}
              </div>
            </section>

            <button
              type="button"
              onClick={() => navigate(`/proposals/${id}/edit`)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[13px] font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
            >
              <Edit3 size={15} />
              Edit proposal
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}