import { motion } from "framer-motion";
import { Send, Copy, Trash2, ArrowUpRight } from "lucide-react";

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

const statusColors: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-600 border-zinc-200",
  sent: "bg-blue-50 text-blue-700 border-blue-200",
  viewed: "bg-amber-50 text-amber-700 border-amber-200",
  signed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  expired: "bg-zinc-100 text-zinc-500 border-zinc-200",
};

export default function ProposalCard({
  proposal,
  onViewOrEdit,
  onSend,
  onDuplicate,
  onDelete,
  actingOn,
}: ProposalCardProps) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(proposal.amount || 0);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-semibold text-zinc-900 text-[15px] group-hover:text-black transition-colors line-clamp-1">
              {proposal.title || "Untitled Proposal"}
            </h3>
            <p className="text-[13px] text-zinc-500 line-clamp-1 mt-0.5">
              {proposal.client?.name || "No Client"} {proposal.client?.company ? `• ${proposal.client.company}` : ""}
            </p>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
              statusColors[proposal.status] || statusColors.draft
            }`}
          >
            {proposal.status}
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-4 mb-6">
          <span className="text-2xl font-serif font-bold text-zinc-900">{formattedAmount}</span>
          <span className="text-[11px] text-zinc-400">
            Updated {new Date(proposal.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-zinc-100">
        {/* Unified View & Edit Rounded Rectangle Button */}
        <button
          type="button"
          onClick={onViewOrEdit}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-zinc-900 text-white text-[13px] font-medium hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <span>View & Edit</span>
          <ArrowUpRight size={14} className="opacity-70" />
        </button>

        {/* Quick action icons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onSend}
            disabled={actingOn === "send"}
            title="Send Proposal"
            className="p-2 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors disabled:opacity-50"
          >
            <Send size={15} />
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            disabled={actingOn === "duplicate"}
            title="Duplicate"
            className="p-2 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors disabled:opacity-50"
          >
            <Copy size={15} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={actingOn === "delete"}
            title="Delete"
            className="p-2 rounded-xl border border-zinc-200 text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}