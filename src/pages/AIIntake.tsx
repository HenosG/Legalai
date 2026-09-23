import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Search, Sparkles, ArrowUpRight, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createApiClient } from "@/lib/api";
import AIIntakeCard, { Intake } from "../components/AIIntakeCard";
import ActivityFeed, { ActivityEntry } from "../components/ActivityFeed";

const springTransition = { type: "spring", stiffness: 300, damping: 28 } as const;
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: springTransition },
};

export default function AIIntake() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  const [inputValue, setInputValue] = useState(searchParams.get("query") ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [actingOn, setActingOn] = useState<Record<string, string>>({}); // intakeId -> action

  const hasAutoSubmitted = useRef(false);

  const api = async () => createApiClient(await getToken());

  const loadIntakes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await (await api()).get<{ intakes: Intake[] }>("/api/ai-intake");
      setIntakes(res.intakes);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load intakes");
    } finally {
      setLoading(false);
    }
  };

  const loadActivity = async () => {
    setActivityLoading(true);
    try {
      const res = await (await api()).get<{ activities: ActivityEntry[] }>("/api/ai-intake/activity");
      setActivity(res.activities);
    } catch (e) {
      console.error("Error loading activity:", e);
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
    loadIntakes();
    loadActivity();
    const poll = setInterval(loadActivity, 20000);
    return () => clearInterval(poll);
  }, []);

  // Auto-submit from ?query= — matches the dashboard command bar's actual
  // redirect (`/ai-intake?query=...&channel=command`), fires once.
  useEffect(() => {
    const query = searchParams.get("query");
    if (query && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      submitIntake(query, searchParams.get("channel") || "command");
    }
  }, [searchParams]);

  const submitIntake = async (rawMessage: string, channel = "manual") => {
    setSubmitting(true);
    setError(null);
    try {
      await (await api()).post("/api/ai-intake", { rawMessage, channel });
      setInputValue("");
      setSearchParams({}, { replace: true });
      await loadIntakes();
      await loadActivity();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit inquiry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAction = async (intake: Intake, action: "proposal" | "accept" | "reject") => {
    console.log(`[AIIntake] handleAction called: ${action} for intake ${intake.id}`);
    
    setActingOn((prev) => ({ ...prev, [intake.id]: action }));
    try {
      if (action === "proposal") {
        console.log(`[AIIntake] Calling POST /api/ai-intake/${intake.id}/proposal`);
        const res = await (await api()).post<any>(`/api/ai-intake/${intake.id}/proposal`, {});
        console.log(`[AIIntake] Proposal generated, response:`, res);
        
        // Extract the created proposal ID and redirect straight to the proposal editor
        const proposalId = res?.proposal?.id || res?.id || res?.proposalId;
        if (proposalId) {
          navigate(`/proposals/${proposalId}`);
        } else {
          navigate("/proposals");
        }
        return;
      }
      if (action === "accept") {
        console.log(`[AIIntake] Calling POST /api/ai-intake/${intake.id}/accept`);
        const res = await (await api()).post<{ client: { id: string } }>(`/api/ai-intake/${intake.id}/accept`, {});
        console.log(`[AIIntake] Client created: ${res.client.id}, navigating to /crm/${res.client.id}`);
        navigate(`/crm/${res.client.id}`);
        return;
      }
      if (action === "reject") {
        console.log(`[AIIntake] Calling POST /api/ai-intake/${intake.id}/reject`);
        await (await api()).post(`/api/ai-intake/${intake.id}/reject`, {});
        console.log(`[AIIntake] Intake rejected, updating state locally`);
        
        // Instantly remove the rejected item from local state so it disappears immediately
        setIntakes((prev) => prev.filter((item) => item.id !== intake.id));
        await loadActivity();
      }
    } catch (e) {
      console.error(`[AIIntake] Error on ${action}:`, e);
      alert(`Failed to ${action}: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setActingOn((prev) => {
        const next = { ...prev };
        delete next[intake.id];
        return next;
      });
    }
  };

  // Filter out any rejected items from being displayed in the list view
  const activeIntakes = intakes.filter((intake) => intake.status !== "REJECTED");

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
        .font-serif { font-family: 'DM Serif Display', serif; }
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <motion.main variants={containerVariants} initial="hidden" animate="visible" className="w-full px-6 sm:px-12 pt-16 pb-24 max-w-6xl mx-auto">
        <motion.div variants={itemVariants} className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-2">AI Intake</p>
          <h1 className="font-serif text-4xl font-bold text-zinc-900 tracking-tight mb-6">
            Intelligent lead processing and proposal generation
          </h1>

          <div className="relative rounded-2xl border border-zinc-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus-within:border-zinc-300 focus-within:shadow-[0_0_0_4px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.06)] transition-all max-w-2xl">
            <div className="flex items-center gap-3 px-5 py-4">
              {submitting ? (
                <Loader2 size={18} className="text-zinc-400 shrink-0 animate-spin" />
              ) : (
                <Search size={18} className="text-zinc-400 shrink-0" />
              )}
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && inputValue.trim() && submitIntake(inputValue.trim())}
                disabled={submitting}
                placeholder="Search or submit an inquiry..."
                className="flex-1 bg-transparent text-[15px] text-zinc-800 placeholder-zinc-400 outline-none disabled:opacity-60"
              />
              <button
                onClick={() => inputValue.trim() && submitIntake(inputValue.trim())}
                disabled={!inputValue.trim() || submitting}
                className={cn(
                  "shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                  inputValue.trim() && !submitting ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400"
                )}
              >
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
          {error && (
            <p className="flex items-center gap-2 mt-2 text-[13px] text-red-600">
              <AlertCircle size={14} /> {error}
            </p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-4 px-1">
              Recent Intakes
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-zinc-100 bg-white p-5 h-36 animate-pulse" />
                ))
              ) : activeIntakes.length === 0 ? (
                <div className="sm:col-span-2 rounded-2xl border border-zinc-100 bg-white p-10 text-center">
                  <Sparkles size={22} className="text-zinc-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-zinc-500">No intakes yet</p>
                  <p className="text-xs text-zinc-400 mt-1">Submit an inquiry above to get started.</p>
                </div>
              ) : (
                activeIntakes.slice(0, 10).map((intake) => (
                  <AIIntakeCard
                    key={intake.id}
                    intake={intake}
                    onReview={() => navigate(`/ai-intake/${intake.id}`)}
                    onProposal={() => handleAction(intake, "proposal")}
                    onAccept={() => handleAction(intake, "accept")}
                    onReject={() => handleAction(intake, "reject")}
                    actingOn={actingOn[intake.id] || null}
                  />
                ))
              )}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-4 px-1">
              Live Activity
            </p>
            <ActivityFeed entries={activity} loading={activityLoading} />
          </div>
        </div>
      </motion.main>
    </div>
  );
}