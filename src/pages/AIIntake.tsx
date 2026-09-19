import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ArrowUpRight, Loader2, X, Clock, CheckCircle2,
  XCircle, FileText, Pencil, AlertCircle, ChevronRight, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createApiClient } from "@/lib/api";

// ─── Types (inferred from your feature spec — reconcile against your real
// AIIntake Prisma model; field names below are assumptions) ───────────────

interface Intake {
  id: string;
  contactName: string;
  company: string | null;
  email: string | null;
  projectType: string;
  budgetMin: number | null;
  budgetMax: number | null;
  timeline: string | null;
  requirements: string[];
  score: number;
  scoreBreakdown: { budgetFit: number; timelineFit: number; scopeClarity: number; urgency: number };
  confidence: Record<string, number>;
  status: "PENDING_REVIEW" | "HIGH_PRIORITY" | "ACCEPTED" | "REJECTED";
  clientId: string | null;
  createdAt: string;
}

interface ActivityEntry {
  id: string;
  action: string;
  description: string;
  createdAt: string;
}

interface ProposalDraft {
  scope: { phase: string; description: string; estimatedHours: number }[];
  timeline: { phase: string; durationDays: number }[];
  pricing: { item: string; amount: number }[];
  total: number;
}

// ─── Motion ───────────────────────────────────────────────────────────────
const springTransition = { type: "spring", stiffness: 300, damping: 28 } as const;
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: springTransition },
};

const formatRelativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ─── Command bar — same pattern as the dashboard's, but submits to
// POST /api/ai-intake instead of navigating ─────────────────────────────
const IntakeCommandBar = ({
  initialValue, onSubmit, submitting,
}: { initialValue: string; onSubmit: (msg: string) => void; submitting: boolean }) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setValue(initialValue), [initialValue]);

  const handleSubmit = useCallback(() => {
    if (!value.trim() || submitting) return;
    onSubmit(value.trim());
  }, [value, submitting, onSubmit]);

  return (
    <motion.div variants={itemVariants} className="w-full max-w-3xl mx-auto">
      <div className="relative rounded-2xl border border-zinc-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus-within:border-zinc-300 focus-within:shadow-[0_0_0_4px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
        <div className="flex items-center gap-3 px-5 py-4">
          {submitting ? (
            <Loader2 size={18} className="text-zinc-400 shrink-0 animate-spin" />
          ) : (
            <Sparkles size={18} className="text-zinc-400 shrink-0" />
          )}
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            disabled={submitting}
            placeholder="Paste a lead message, email, or describe a new inquiry…"
            className="flex-1 bg-transparent text-[15px] text-zinc-800 placeholder-zinc-400 outline-none disabled:opacity-60"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!value.trim() || submitting}
            className={cn(
              "shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all",
              value.trim() && !submitting ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400"
            )}
          >
            <ArrowUpRight size={15} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const ScoreBadge = ({ score }: { score: number }) => {
  const isHigh = score >= 80;
  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold",
      isHigh ? "bg-emerald-50 text-emerald-700" : score >= 50 ? "bg-amber-50 text-amber-700" : "bg-zinc-100 text-zinc-500"
    )}>
      {isHigh && <Zap size={11} />}
      {score}/100
    </div>
  );
};

const IntakeCard = ({ intake, onClick }: { intake: Intake; onClick: () => void }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -2 }}
    onClick={onClick}
    className="cursor-pointer rounded-2xl border border-zinc-100 bg-white p-5 hover:border-zinc-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all"
  >
    <div className="flex items-start justify-between mb-3">
      <div>
        <p className="text-[14px] font-semibold text-zinc-800">{intake.contactName}</p>
        {intake.company && <p className="text-[12px] text-zinc-400">{intake.company}</p>}
      </div>
      <ScoreBadge score={intake.score} />
    </div>
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-zinc-500 mb-4">
      <span>{intake.projectType}</span>
      {(intake.budgetMin || intake.budgetMax) && (
        <span>${intake.budgetMin ?? "?"}–${intake.budgetMax ?? "?"}</span>
      )}
      {intake.timeline && <span>{intake.timeline}</span>}
    </div>
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-zinc-400">{formatRelativeTime(intake.createdAt)}</span>
      <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600">
        Review <ChevronRight size={12} />
      </span>
    </div>
  </motion.div>
);

const ActivityFeedItem = ({ entry }: { entry: ActivityEntry }) => (
  <div className="flex items-start gap-3 py-3">
    <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-2 shrink-0" />
    <div className="flex-1">
      <p className="text-[13px] text-zinc-700">{entry.description}</p>
      <p className="text-[11px] text-zinc-400 mt-0.5">{formatRelativeTime(entry.createdAt)}</p>
    </div>
  </div>
);

// ─── Lead Detail Drawer ─────────────────────────────────────────────────────
const LeadDetailDrawer = ({
  intake, onClose, onAccepted, onRejected,
}: { intake: Intake; onClose: () => void; onAccepted: () => void; onRejected: () => void }) => {
  const { getToken } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState({
    contactName: intake.contactName,
    company: intake.company ?? "",
    email: intake.email ?? "",
    projectType: intake.projectType,
    timeline: intake.timeline ?? "",
  });
  const [proposal, setProposal] = useState<ProposalDraft | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  const api = async () => createApiClient(await getToken());

  const handleSaveEdit = async () => {
    setActing("save");
    try {
      await (await api()).patch(`/api/ai-intake/${intake.id}`, fields);
      setEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setActing(null);
    }
  };

  const handleAccept = async () => {
    setActing("accept");
    try {
      await (await api()).post(`/api/ai-intake/${intake.id}/accept`, {});
      onAccepted();
    } catch (e) {
      console.error(e);
    } finally {
      setActing(null);
    }
  };

  const handleReject = async () => {
    setActing("reject");
    try {
      await (await api()).post(`/api/ai-intake/${intake.id}/reject`, {});
      onRejected();
    } catch (e) {
      console.error(e);
    } finally {
      setActing(null);
    }
  };

  const handleGenerateProposal = async () => {
    setActing("proposal");
    try {
      const res = await (await api()).post<{ proposalDraft: ProposalDraft }>(
        `/api/ai-intake/${intake.id}/generate-proposal`, {}
      );
      setProposal(res.proposalDraft);
    } catch (e) {
      console.error(e);
    } finally {
      setActing(null);
    }
  };

  const b = intake.scoreBreakdown;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-zinc-900/30 backdrop-blur-sm"
      />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-white shadow-2xl overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 sticky top-0 bg-white z-10">
          <h2 className="font-serif text-xl font-bold text-zinc-900">{intake.contactName}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-zinc-100 transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Lead Score</p>
              <ScoreBadge score={intake.score} />
            </div>
            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden mb-4">
              <div className={cn("h-full rounded-full", intake.score >= 80 ? "bg-emerald-500" : "bg-amber-500")} style={{ width: `${intake.score}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Budget Fit", b.budgetFit], ["Timeline", b.timelineFit],
                ["Scope Clarity", b.scopeClarity], ["Urgency", b.urgency],
              ].map(([label, val]) => (
                <div key={label as string} className="rounded-xl bg-zinc-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
                  <p className="text-lg font-bold text-zinc-800">{val}/25</p>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted fields */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Extracted Information</p>
              <button onClick={() => setEditing((e) => !e)} className="flex items-center gap-1 text-[11px] font-semibold text-blue-600">
                <Pencil size={11} /> {editing ? "Cancel" : "Edit"}
              </button>
            </div>
            <div className="space-y-3">
              {([
                ["contactName", "Name"], ["company", "Company"], ["email", "Email"],
                ["projectType", "Project Type"], ["timeline", "Timeline"],
              ] as const).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between text-[13px]">
                  <span className="text-zinc-400 w-28 shrink-0">{label}</span>
                  {editing ? (
                    <input
                      value={fields[key]}
                      onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
                      className="flex-1 px-2 py-1 rounded-lg border border-zinc-200 text-[13px] outline-none focus:border-zinc-400"
                    />
                  ) : (
                    <span className="flex-1 text-zinc-700">{fields[key] || "—"}</span>
                  )}
                  {intake.confidence?.[key] != null && (
                    <span className="text-[10px] text-zinc-400 ml-2">{Math.round(intake.confidence[key] * 100)}%</span>
                  )}
                </div>
              ))}
              {intake.requirements?.length > 0 && (
                <div className="flex items-start justify-between text-[13px]">
                  <span className="text-zinc-400 w-28 shrink-0">Requirements</span>
                  <div className="flex-1 flex flex-wrap gap-1">
                    {intake.requirements.map((r) => (
                      <span key={r} className="px-2 py-0.5 rounded-full bg-zinc-100 text-[11px] text-zinc-600">{r}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {editing && (
              <button
                onClick={handleSaveEdit}
                disabled={acting === "save"}
                className="mt-4 w-full py-2 rounded-xl bg-zinc-900 text-white text-[13px] font-semibold disabled:opacity-60"
              >
                {acting === "save" ? <Loader2 size={14} className="animate-spin mx-auto" /> : "Save Changes"}
              </button>
            )}
          </div>

          {/* Proposal draft */}
          {intake.status === "ACCEPTED" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Proposal</p>
                {!proposal && (
                  <button
                    onClick={handleGenerateProposal}
                    disabled={acting === "proposal"}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600"
                  >
                    {acting === "proposal" ? <Loader2 size={12} className="animate-spin" /> : <FileText size={12} />}
                    Generate Proposal
                  </button>
                )}
              </div>
              {proposal && (
                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] font-bold text-zinc-400 mb-2">Scope</p>
                    {proposal.scope.map((s, i) => (
                      <div key={i} className="text-[13px] text-zinc-700 mb-1">
                        <span className="font-semibold">{s.phase}</span> — {s.description} ({s.estimatedHours}h)
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-zinc-400 mb-2">Pricing</p>
                    {proposal.pricing.map((p, i) => (
                      <div key={i} className="flex justify-between text-[13px] text-zinc-700">
                        <span>{p.item}</span><span>${p.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-[13px] font-bold text-zinc-900 mt-2 pt-2 border-t border-zinc-100">
                      <span>Total</span><span>${proposal.total?.toLocaleString()}</span>
                    </div>
                  </div>
                  <button className="w-full py-2 rounded-xl bg-zinc-900 text-white text-[13px] font-semibold">
                    Send to Client
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {intake.status !== "ACCEPTED" && intake.status !== "REJECTED" && (
          <div className="sticky bottom-0 bg-white border-t border-zinc-100 p-4 flex gap-3">
            <button
              onClick={handleReject}
              disabled={!!acting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 text-[13px] font-semibold text-zinc-600 disabled:opacity-60"
            >
              {acting === "reject" ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
              Mark Unqualified
            </button>
            <button
              onClick={handleAccept}
              disabled={!!acting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-900 text-white text-[13px] font-semibold disabled:opacity-60"
            >
              {acting === "accept" ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              Accept → Create Project
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Main Page ──────────────────────────────────────────────────────────────
const AiIntake = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [commandValue, setCommandValue] = useState(searchParams.get("q") ?? "");
  const [selectedIntake, setSelectedIntake] = useState<Intake | null>(null);
  const hasAutoTriggered = useRef(false);

  const api = async () => createApiClient(await getToken());

  const { data: intakesData, isLoading: intakesLoading } = useQuery({
    queryKey: ["ai-intakes"],
    queryFn: async () => (await api()).get<{ intakes: Intake[] }>("/api/ai-intake?limit=10"),
    refetchInterval: 20000,
  });

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ["ai-intake-activity"],
    queryFn: async () => (await api()).get<{ activities: ActivityEntry[] }>("/api/dashboard/activity?module=ai-intake&limit=15"),
    refetchInterval: 20000,
  });

  const submitMutation = useMutation({
    mutationFn: async (rawMessage: string) =>
      (await api()).post<Intake>("/api/ai-intake", { rawMessage }),
    onSuccess: (intake) => {
      queryClient.invalidateQueries({ queryKey: ["ai-intakes"] });
      queryClient.invalidateQueries({ queryKey: ["ai-intake-activity"] });
      setCommandValue("");
      setSelectedIntake(intake);
      setSearchParams({}, { replace: true });
    },
  });

  // Auto-trigger from ?q= param passed by the dashboard command bar —
  // fires once on mount only, so re-navigating here doesn't loop.
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !hasAutoTriggered.current) {
      hasAutoTriggered.current = true;
      submitMutation.mutate(q);
    }
  }, [searchParams]);

  const handleAccepted = () => {
    queryClient.invalidateQueries({ queryKey: ["ai-intakes"] });
    setSelectedIntake(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
        .font-serif { font-family: 'DM Serif Display', serif; }
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <motion.main variants={containerVariants} initial="hidden" animate="visible" className="w-full px-6 sm:px-12 pt-16 pb-24 max-w-6xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">AI Intake</p>
          <h1 className="font-serif text-4xl font-bold text-zinc-900 tracking-tight mb-8">
            Intelligent lead processing and proposal generation
          </h1>
          <IntakeCommandBar
            initialValue={commandValue}
            submitting={submitMutation.isPending}
            onSubmit={(msg) => submitMutation.mutate(msg)}
          />
          {submitMutation.isError && (
            <p className="flex items-center justify-center gap-2 mt-3 text-[13px] text-red-600">
              <AlertCircle size={14} /> Couldn't process that lead — try again.
            </p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent intakes */}
          <div className="lg:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-4 px-1">
              Recent Intakes
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {intakesLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-zinc-100 bg-white p-5 h-32 animate-pulse" />
                ))
              ) : intakesData?.intakes && intakesData.intakes.length > 0 ? (
                intakesData.intakes.map((intake) => (
                  <IntakeCard key={intake.id} intake={intake} onClick={() => setSelectedIntake(intake)} />
                ))
              ) : (
                <div className="sm:col-span-2 rounded-2xl border border-zinc-100 bg-white p-10 text-center">
                  <p className="text-sm font-semibold text-zinc-500">No intakes yet</p>
                  <p className="text-xs text-zinc-400 mt-1">Paste a lead message above to get started.</p>
                </div>
              )}
            </div>
          </div>

          {/* Live activity feed */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-4 px-1 flex items-center gap-2">
              <Clock size={12} /> Live Activity
            </p>
            <div className="rounded-2xl border border-zinc-100 bg-white divide-y divide-zinc-50 px-5">
              {activityLoading ? (
                <div className="py-6 text-center text-zinc-400 text-sm">Loading…</div>
              ) : activityData?.activities && activityData.activities.length > 0 ? (
                activityData.activities.map((entry) => <ActivityFeedItem key={entry.id} entry={entry} />)
              ) : (
                <div className="py-10 text-center text-sm text-zinc-400">Nothing yet.</div>
              )}
            </div>
          </div>
        </div>
      </motion.main>

      {selectedIntake && (
        <LeadDetailDrawer
          intake={selectedIntake}
          onClose={() => setSelectedIntake(null)}
          onAccepted={handleAccepted}
          onRejected={() => { queryClient.invalidateQueries({ queryKey: ["ai-intakes"] }); setSelectedIntake(null); }}
        />
      )}
    </div>
  );
};

export default AiIntake;