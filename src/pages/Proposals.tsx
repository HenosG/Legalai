import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Search, Plus, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { createApiClient } from "@/lib/api";
import ProposalCard from "../components/proposals/ProposalCard";

interface Proposal {
  id: string;
  userId: string;
  clientId: string;
  title: string;
  amount: number;
  status: string;
  documentUrl?: string;
  scopeOfWork?: any;
  timeline?: any;
  pricing?: any;
  terms?: any;
  caseStudies?: string[];
  testimonials?: string[];
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

const springTransition = { type: "spring", stiffness: 300, damping: 28 } as const;
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: springTransition },
};

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "viewed", label: "Viewed" },
  { value: "signed", label: "Signed" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
];

export default function Proposals() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [actingOn, setActingOn] = useState<Record<string, string>>({});

  // Helper to instantiate the API client with a fresh token
  const getApi = useCallback(async () => {
    const token = await getToken();
    return createApiClient(token);
  }, [getToken]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const client = await getApi();
      const params = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const res = await client.get<{ proposals: Proposal[] }>(`/api/proposals${params}`);
      setProposals(res.proposals || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load proposals");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, getApi]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = proposals.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.client?.name?.toLowerCase().includes(q) ||
      p.client?.company?.toLowerCase().includes(q)
    );
  });

  const handleSend = async (proposal: Proposal) => {
    setActingOn((prev) => ({ ...prev, [proposal.id]: "send" }));
    try {
      const client = await getApi();
      await client.post(`/api/proposals/${proposal.id}/send`, { clientEmail: proposal.client?.email });
      toast.success("Proposal sent successfully!");
      await load();
    } catch (e) {
      console.error(`Error sending proposal:`, e);
      toast.error(`Failed to send proposal: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setActingOn((prev) => {
        const next = { ...prev };
        delete next[proposal.id];
        return next;
      });
    }
  };

  const handleDuplicate = async (proposal: Proposal) => {
    setActingOn((prev) => ({ ...prev, [proposal.id]: "duplicate" }));
    try {
      const client = await getApi();
      const created = await client.post<Proposal>("/api/proposals", {
        clientId: proposal.clientId,
        title: `${proposal.title} (Copy)`,
        amount: proposal.amount,
        scopeOfWork: proposal.scopeOfWork,
        timeline: proposal.timeline,
        pricing: proposal.pricing,
        terms: proposal.terms,
        caseStudies: proposal.caseStudies,
        testimonials: proposal.testimonials,
      });
      toast.success("Proposal duplicated successfully!");
      navigate(`/proposals/${created.id}`);
    } catch (e) {
      console.error(`Error duplicating proposal:`, e);
      toast.error(`Failed to duplicate proposal: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setActingOn((prev) => {
        const next = { ...prev };
        delete next[proposal.id];
        return next;
      });
    }
  };

  const handleDelete = async (proposal: Proposal) => {
    setActingOn((prev) => ({ ...prev, [proposal.id]: "delete" }));
    try {
      const client = await getApi();
      await client.delete(`/api/proposals/${proposal.id}`);
      toast.success("Proposal deleted successfully!");
      await load();
    } catch (e) {
      console.error(`Error deleting proposal:`, e);
      toast.error(`Failed to delete proposal: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setActingOn((prev) => {
        const next = { ...prev };
        delete next[proposal.id];
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
        .font-serif { font-family: 'DM Serif Display', serif; }
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <motion.main variants={containerVariants} initial="hidden" animate="visible" className="w-full px-6 sm:px-12 pt-16 pb-24 max-w-6xl mx-auto">
        <motion.div variants={itemVariants} className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-2">Proposals</p>
            <h1 className="font-serif text-4xl font-bold text-zinc-900 tracking-tight">Proposals</h1>
          </div>
          <button
            onClick={() => navigate("/proposals/new")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-[13px] font-semibold hover:bg-zinc-700 transition-colors shadow-sm"
          >
            <Plus size={15} /> New Proposal
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client name or proposal title…"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-[14px] text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)] transition-all"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-1.5 flex-wrap mb-8">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all border ${
                statusFilter === tab.value
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle size={22} className="text-red-400 mb-3" />
            <p className="text-sm text-zinc-500 mb-3">{error}</p>
            <button onClick={load} className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold">Try again</button>
          </div>
        ) : loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-zinc-100 bg-white p-5 h-44 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-zinc-100 bg-white p-16 text-center">
            <FileText size={24} className="text-zinc-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-zinc-500">No proposals yet</p>
            <p className="text-xs text-zinc-400 mt-1">Create your first proposal to get started.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onViewOrEdit={() => navigate(`/proposals/${proposal.id}`)}
                onSend={() => handleSend(proposal)}
                onDuplicate={() => handleDuplicate(proposal)}
                onDelete={() => handleDelete(proposal)}
                actingOn={actingOn[proposal.id] || null}
              />
            ))}
          </div>
        )}
      </motion.main>
    </div>
  );
}