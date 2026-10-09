import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Copy,
  FileText,
  Loader2,
  Send,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProposalCardProps {
  proposal: {
    id: string;
    title: string;
    amount: number;
    status: string;
    client?: {
      name: string;
      company?: string;
    };
    updatedAt: string;
  };
  onViewOrEdit: () => void;
  onSend: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  actingOn: string | null;
}

function normalizeStatus(status?: string) {
  return String(status || "DRAFT")
    .trim()
    .toUpperCase();
}

function formatStatus(status?: string) {
  const normalized = normalizeStatus(status);

  switch (normalized) {
    case "DRAFT":
      return "Draft";
    case "SENT":
      return "Sent";
    case "VIEWED":
      return "Viewed";
    case "SIGNED":
      return "Signed";
    case "REJECTED":
      return "Rejected";
    case "EXPIRED":
      return "Expired";
    default:
      return normalized
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
}

function getStatusClass(status?: string) {
  const normalized = normalizeStatus(status);

  if (normalized === "SIGNED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalized === "VIEWED" || normalized === "SENT") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (normalized === "REJECTED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (normalized === "EXPIRED") {
    return "border-zinc-200 bg-zinc-100 text-zinc-500";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function getStatusDotClass(status?: string) {
  const normalized = normalizeStatus(status);

  if (normalized === "SIGNED") {
    return "bg-emerald-500";
  }

  if (normalized === "VIEWED" || normalized === "SENT") {
    return "bg-blue-500";
  }

  if (normalized === "REJECTED") {
    return "bg-red-500";
  }

  if (normalized === "EXPIRED") {
    return "bg-zinc-400";
  }

  return "bg-amber-500";
}

function formatRelativeTime(value?: string) {
  if (!value) return "Recently";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Recently";

  const difference = Date.now() - date.getTime();
  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
  });
}

export default function ProposalCard({
  proposal,
  onViewOrEdit,
  onSend,
  onDuplicate,
  onDelete,
  actingOn,
}: ProposalCardProps) {
  const isDeleting = actingOn === "delete";
  const isBusy = Boolean(actingOn);

  const formattedAmount = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(proposal.amount || 0);
  }, [proposal.amount]);

  const clientLabel = useMemo(() => {
    if (!proposal.client?.name) return "No client assigned";

    return proposal.client.company
      ? `${proposal.client.name} · ${proposal.client.company}`
      : proposal.client.name;
  }, [proposal.client]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDeleting ? 0.72 : 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 28,
      }}
      className="relative flex min-h-[320px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)]"
    >
      <AnimatePresence>
        {isDeleting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-white/90 backdrop-blur-[2px]"
          >
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 shadow-sm">
              <Loader2 size={14} className="animate-spin text-zinc-500" />
              Deleting proposal…
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-zinc-900">
            {proposal.title || "Untitled proposal"}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate text-[11px] text-zinc-400">
              {clientLabel}
            </span>

            <span className="text-[11px] text-zinc-300">·</span>

            <span className="text-[11px] text-zinc-400">
              {formatRelativeTime(proposal.updatedAt)}
            </span>
          </div>
        </div>

        {/* Delete trigger using shadcn AlertDialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              disabled={isBusy}
              title="Delete proposal"
              aria-label="Delete proposal"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={15} />
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <TriangleAlert size={18} className="text-red-600" />
                Delete this proposal?
              </AlertDialogTitle>

              <AlertDialogDescription>
                This will permanently delete{" "}
                <span className="font-semibold text-zinc-900">
                  {proposal.title || "Untitled proposal"}
                </span>{" "}
                for {clientLabel}. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  if (isBusy) return;
                  onDelete(proposal.id);
                }}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {isDeleting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Status + Amount row */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusClass(
            proposal.status
          )}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${getStatusDotClass(
              proposal.status
            )}`}
          />
          {formatStatus(proposal.status)}
        </span>

        <span className="font-serif text-xl font-bold tracking-tight text-zinc-900">
          {formattedAmount}
        </span>
      </div>

      {/* Proposal preview / summary box */}
      <div className="mt-4 rounded-lg border border-zinc-100 bg-zinc-50/70 p-3">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
          Proposal details
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-500 shadow-sm ring-1 ring-zinc-100">
              <FileText size={14} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-zinc-700">
                {proposal.title || "Untitled proposal"}
              </p>

              <p className="truncate text-[10px] text-zinc-400">
                {clientLabel}
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-zinc-600 ring-1 ring-zinc-100">
            {formatStatus(proposal.status)}
          </span>
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-auto border-t border-zinc-100 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onViewOrEdit}
            disabled={isBusy}
            className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {actingOn === "view" ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <ArrowUpRight size={13} />
            )}
            View & Edit
          </button>

          <button
            type="button"
            onClick={onSend}
            disabled={isBusy}
            title="Send proposal"
            aria-label="Send proposal"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {actingOn === "send" ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Send size={13} />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              onDuplicate();
              window.location.href = "/proposals";
            }}
            disabled={isBusy}
            title="Duplicate proposal"
            aria-label="Duplicate proposal"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {actingOn === "duplicate" ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Copy size={13} />
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}