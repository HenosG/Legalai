import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Loader2,
  Trash2,
  TriangleAlert,
  X,
  XCircle,
} from "lucide-react";
import LeadScoreBadge from "./LeadScoreBadge";

export interface Intake {
  id: string;
  clientId: string | null;
  channel: string;
  rawMessage: string;
  projectType: string | null;
  budget: {
    min?: number;
    max?: number;
  } | null;
  timeline: {
    deadline?: string;
    urgency?: string;
  } | null;
  requirements: string[];
  leadScore: number | null;
  qualified: boolean;
  status: string;
  createdAt: string;
}

interface Props {
  intake: Intake;
  onReview: (id: string) => void;
  onProposal: (id: string) => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  actingOn: string | null;
}

function normalizeStatus(status?: string) {
  return String(status || "PENDING")
    .trim()
    .toUpperCase();
}

function formatStatus(status?: string) {
  const normalized = normalizeStatus(status);

  switch (normalized) {
    case "NEW":
      return "New";
    case "PENDING":
      return "Pending";
    case "REVIEW":
    case "IN_REVIEW":
      return "In review";
    case "ACCEPTED":
      return "Accepted";
    case "QUALIFIED":
      return "Qualified";
    case "REJECTED":
      return "Rejected";
    case "PROPOSAL":
    case "PROPOSAL_CREATED":
      return "Proposal created";
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

  if (
    normalized === "ACCEPTED" ||
    normalized === "QUALIFIED" ||
    normalized === "PROPOSAL_CREATED" ||
    normalized === "PROPOSAL"
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalized === "REJECTED") {
    return "border-zinc-200 bg-zinc-100 text-zinc-500";
  }

  if (normalized === "REVIEW" || normalized === "IN_REVIEW") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function getStatusDotClass(status?: string) {
  const normalized = normalizeStatus(status);

  if (
    normalized === "ACCEPTED" ||
    normalized === "QUALIFIED" ||
    normalized === "PROPOSAL_CREATED" ||
    normalized === "PROPOSAL"
  ) {
    return "bg-emerald-500";
  }

  if (normalized === "REJECTED") {
    return "bg-zinc-400";
  }

  if (normalized === "REVIEW" || normalized === "IN_REVIEW") {
    return "bg-blue-500";
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

function formatMoney(value?: number) {
  if (value === undefined || value === null) return null;

  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatBudget(budget: Intake["budget"]) {
  if (!budget) return null;

  const min = formatMoney(budget.min);
  const max = formatMoney(budget.max);

  if (min && max) return `${min}–${max}`;
  if (min) return `From ${min}`;
  if (max) return `Up to ${max}`;

  return null;
}

function getInquiryPreview(intake: Intake) {
  if (intake.rawMessage?.trim()) {
    return intake.rawMessage.trim();
  }

  if (intake.requirements?.length) {
    return intake.requirements.join("\n");
  }

  return "No inquiry details were captured for this intake.";
}

export default function AIIntakeCard({
  intake,
  onDelete,
  onReview,
  onProposal,
  onAccept,
  onReject,
  actingOn,
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const statusUpper = normalizeStatus(intake.status);

  const isFinal =
    statusUpper === "ACCEPTED" ||
    statusUpper === "QUALIFIED" ||
    statusUpper === "REJECTED";

  const isAccepted =
    statusUpper === "ACCEPTED" || statusUpper === "QUALIFIED";

  const isDeleting = actingOn === "delete";
  const isBusy = Boolean(actingOn);

  const budgetLabel = useMemo(() => formatBudget(intake.budget), [intake.budget]);

  const inquiryPreview = useMemo(() => getInquiryPreview(intake), [intake]);

  const visibleRequirements = useMemo(
    () => (intake.requirements || []).filter(Boolean).slice(0, 3),
    [intake.requirements]
  );

  const handleConfirmDelete = () => {
    if (isBusy) return;

    onDelete(intake.id);
  };

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
      className="relative flex min-h-[330px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)]"
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
              Deleting intake…
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-zinc-900">
            {intake.projectType || "New client inquiry"}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            {intake.channel && (
              <span className="text-[11px] text-zinc-400">
                {intake.channel}
              </span>
            )}

            {intake.channel && (
              <span className="text-[11px] text-zinc-300">·</span>
            )}

            <span className="text-[11px] text-zinc-400">
              {formatRelativeTime(intake.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LeadScoreBadge score={intake.leadScore} />

          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            disabled={isBusy}
            title="Delete intake"
            aria-label="Delete intake"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusClass(
            intake.status
          )}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${getStatusDotClass(
              intake.status
            )}`}
          />
          {formatStatus(intake.status)}
        </span>

        {intake.qualified && !isAccepted && !isFinal && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700">
            <CheckCircle2 size={12} />
            Qualified
          </span>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-zinc-100 bg-zinc-50/70 p-3">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
          Inquiry
        </p>

        <div className="max-h-[76px] overflow-y-auto pr-1">
          <p className="whitespace-pre-wrap text-[11px] leading-5 text-zinc-600">
            {inquiryPreview}
          </p>
        </div>
      </div>

      <div className="mt-4 flex min-h-[22px] flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-zinc-500">
        {budgetLabel && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
            {budgetLabel}
          </span>
        )}

        {intake.timeline?.deadline && (
          <span className="inline-flex items-center gap-1.5">
            <Clock size={12} className="text-zinc-400" />
            Due {intake.timeline.deadline}
          </span>
        )}

        {intake.timeline?.urgency && (
          <span className="capitalize">
            {intake.timeline.urgency} urgency
          </span>
        )}
      </div>

      {visibleRequirements.length > 0 && (
        <div className="mt-3 flex min-h-[22px] flex-wrap gap-1.5">
          {visibleRequirements.map((requirement, index) => (
            <span
              key={`${requirement}-${index}`}
              title={requirement}
              className="max-w-full truncate rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-600"
            >
              {requirement}
            </span>
          ))}

          {intake.requirements.length > visibleRequirements.length && (
            <span className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-500">
              +{intake.requirements.length - visibleRequirements.length}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto border-t border-zinc-100 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onReview(intake.id)}
            disabled={isBusy}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Eye size={13} />
            Review
          </button>

          <button
            type="button"
            onClick={() => onProposal(intake.id)}
            disabled={isBusy}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {actingOn === "proposal" ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <FileText size={13} />
            )}
            Proposal
          </button>

          {!isFinal ? (
            <>
              <button
                type="button"
                onClick={() => onAccept(intake.id)}
                disabled={isBusy}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actingOn === "accept" ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={13} />
                )}
                Accept
              </button>

              <button
                type="button"
                onClick={() => onReject(intake.id)}
                disabled={isBusy}
                title="Reject intake"
                aria-label="Reject intake"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actingOn === "reject" ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <XCircle size={14} />
                )}
              </button>
            </>
          ) : (
            <span
              className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[10px] font-semibold uppercase tracking-wide ${
                isAccepted
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-zinc-200 bg-zinc-100 text-zinc-500"
              }`}
            >
              {isAccepted ? (
                <CheckCircle2 size={12} />
              ) : (
                <XCircle size={12} />
              )}
              {formatStatus(intake.status)}
            </span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {confirmDelete && !isDeleting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 p-5 backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 4 }}
              transition={{ duration: 0.16 }}
              className="w-full max-w-[260px] rounded-xl border border-zinc-200 bg-white p-4 shadow-xl shadow-zinc-900/10"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <TriangleAlert size={15} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-zinc-900">
                    Delete this intake?
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                    This permanently removes the inquiry from your workspace.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="inline-flex h-8 items-center rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-red-600 px-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}