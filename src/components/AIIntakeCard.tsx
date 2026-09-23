import { motion } from "framer-motion";
import { Eye, FileText, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import LeadScoreBadge from "./LeadScoreBadge";

// Matches the real AIIntake model: budget/timeline are Json blobs, not
// separate min/max/deadline columns.
export interface Intake {
  id: string;
  clientId: string | null;
  channel: string;
  rawMessage: string;
  projectType: string | null;
  budget: { min?: number; max?: number } | null;
  timeline: { deadline?: string; urgency?: string } | null;
  requirements: string[];
  leadScore: number | null;
  qualified: boolean;
  status: string; // "new" | "reviewed" | "proposal_sent" | "accepted" | "rejected"
  createdAt: string;
}

interface Props {
  intake: Intake;
  onReview: () => void;
  onProposal: () => void;
  onAccept: () => void;
  onReject: () => void;
  actingOn: string | null; // "proposal" | "accept" | "reject" | null — for this card's loading state
}

export default function AIIntakeCard({ intake, onReview, onProposal, onAccept, onReject, actingOn }: Props) {
  const isFinal = intake.status === "accepted" || intake.status === "rejected";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-zinc-100 bg-white p-5 hover:border-zinc-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[14px] font-semibold text-zinc-800">
            {intake.projectType || "Unspecified project"}
          </p>
          <p className="text-[12px] text-zinc-400 capitalize">{intake.channel} · {intake.status}</p>
        </div>
        <LeadScoreBadge score={intake.leadScore} />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-zinc-500 mb-4">
        {(intake.budget?.min || intake.budget?.max) && (
          <span>${intake.budget?.min ?? "?"}–${intake.budget?.max ?? "?"}</span>
        )}
        {intake.timeline?.deadline && <span>Due {intake.timeline.deadline}</span>}
        {intake.timeline?.urgency && <span className="capitalize">{intake.timeline.urgency} urgency</span>}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onReview}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-[12px] font-semibold text-zinc-600 hover:bg-zinc-50 transition-all"
        >
          <Eye size={13} /> Review
        </button>
        <button
          onClick={onProposal}
          disabled={actingOn === "proposal"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-[12px] font-semibold text-zinc-600 hover:bg-zinc-50 transition-all disabled:opacity-60"
        >
          {actingOn === "proposal" ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} />}
          Proposal
        </button>
        {!isFinal && (
          <>
            <button
              onClick={onAccept}
              disabled={actingOn === "accept"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-[12px] font-semibold hover:bg-zinc-700 transition-all disabled:opacity-60"
            >
              {actingOn === "accept" ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
              Accept
            </button>
            <button
              onClick={onReject}
              disabled={actingOn === "reject"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-[12px] font-semibold text-red-600 hover:bg-red-50 transition-all disabled:opacity-60"
            >
              {actingOn === "reject" ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
              Reject
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}