import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { ArrowLeft, Pencil, XCircle, Loader2, AlertCircle, FileText } from "lucide-react";
import { createApiClient } from "@/lib/api";
import LeadScoreBadge from "../components/LeadScoreBadge";
import ConfidenceBar from "../components/ConfidenceBar";
import { Intake } from "../components/AIIntakeCard";

interface IntakeDetail extends Intake {
  metadata?: { confidence?: Record<string, number> } | null;
}

const FIELD_LABELS: Record<string, string> = {
  projectType: "Project Type",
  budget: "Budget",
  timeline: "Timeline",
  requirements: "Requirements",
};

export default function AIIntakeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [intake, setIntake] = useState<IntakeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [acting, setActing] = useState<"accept" | "reject" | null>(null);

  const api = async () => createApiClient(await getToken());

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await (await api()).get<IntakeDetail>(`/api/ai-intake/${id}`);
      setIntake(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load intake");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const startEdit = (field: string) => {
    if (!intake) return;
    const val = (intake as any)[field];
    if (field === "budget") {
      setEditValues((prev) => ({ ...prev, [field]: typeof val === "string" ? val : "" }));
    } else if (Array.isArray(val)) {
      setEditValues((prev) => ({ ...prev, [field]: val.join(", ") }));
    } else {
      setEditValues((prev) => ({ ...prev, [field]: val ?? "" }));
    }
    setEditingField(field);
  };

  const saveEdit = async (field: string) => {
    if (!id) return;
    setSaving(true);
    try {
      let payload: Record<string, any> = {};
      let payloadValue = editValues[field];

      if (field === "requirements" && typeof payloadValue === "string") {
        payload = {
          requirements: payloadValue.split(",").map((s: string) => s.trim()).filter(Boolean),
        };
      } else {
        payload = { [field]: payloadValue };
      }
      
      const updated = await (await api()).patch<IntakeDetail>(`/api/ai-intake/${id}`, payload);
      setIntake(updated);
      setEditingField(null);
    } catch (e) {
      console.error("Error saving field:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleAcceptAndGenerateProposal = async () => {
    if (!id || !intake) return;
    setActing("accept");
    try {
      const apiClient = await api();

      // 1. Accept the intake (converts to client & project)
      await apiClient.post(`/api/ai-intake/${id}/accept`, {});

      // 2. Generate proposal using the backend route that handles proper budget parsing
      const proposalRes = await apiClient.post<any>(`/api/ai-intake/${id}/proposal`, {});

      const proposalId = 
        proposalRes?.proposal?.id || 
        proposalRes?.id || 
        proposalRes?.proposalId;

      if (proposalId) {
        navigate(`/proposals/${proposalId}`);
      } else {
        navigate("/proposals");
      }
    } catch (e: any) {
      console.error("Error accepting lead and generating proposal:", e);
      const errorMessage = e?.response?.data?.error || e?.message || "Unknown error";
      alert(`Failed to generate proposal: ${errorMessage}`);
      setActing(null);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    setActing("reject");
    try {
      await (await api()).post(`/api/ai-intake/${id}/reject`, {});
      navigate("/ai-intake");
    } catch (e: any) {
      console.error("Error rejecting intake:", e);
      alert(`Failed to reject: ${e?.message || "Route not found"}`);
      setActing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 size={20} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error || !intake) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-3 text-center px-6">
        <AlertCircle size={22} className="text-red-400" />
        <p className="text-sm text-zinc-500">{error || "Intake not found."}</p>
        <button onClick={() => navigate("/ai-intake")} className="text-[13px] font-semibold text-blue-600">
          ← Back to Intakes
        </button>
      </div>
    );
  }

  const confidence = intake.metadata?.confidence || {};
  const statusUpper = intake.status?.toUpperCase() || "";
  const isFinal = statusUpper === "ACCEPTED" || statusUpper === "REJECTED";

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
        .font-serif { font-family: 'DM Serif Display', serif; }
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full px-6 sm:px-12 pt-16 pb-24 max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/ai-intake")}
          className="flex items-center gap-2 text-[13px] font-semibold text-zinc-400 hover:text-zinc-700 transition-colors mb-8"
        >
          <ArrowLeft size={15} /> Back to Intakes
        </button>

        <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
          <div>
            <h1 className="font-serif text-4xl font-bold text-zinc-900 tracking-tight mb-1">
              {intake.projectType || "Unspecified project"}
            </h1>
            <p className="text-sm text-zinc-500 capitalize">{intake.channel} inquiry · {intake.status}</p>
          </div>
          <div className="flex items-center gap-3">
            <LeadScoreBadge score={intake.leadScore} />
          </div>
        </div>

        {intake.leadScore != null && (
          <div className="mb-10">
            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${intake.leadScore >= 80 ? "bg-emerald-500" : intake.leadScore >= 60 ? "bg-amber-500" : "bg-red-400"}`}
                style={{ width: `${intake.leadScore}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* AI-Extracted Information */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6">
              AI-Extracted Information
            </p>

            {(["projectType", "budget", "timeline", "requirements"] as const).map((field) => (
              <div key={field} className="mb-6 last:mb-0 border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-zinc-400">{FIELD_LABELS[field]}</span>
                  <button onClick={() => startEdit(field)} className="text-zinc-400 hover:text-zinc-900 transition-colors p-1">
                    <Pencil size={13} />
                  </button>
                </div>
                {editingField === field ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      value={editValues[field] ?? ""}
                      onChange={(e) => setEditValues((prev) => ({ ...prev, [field]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === "Enter") saveEdit(field); }}
                      autoFocus
                      className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 text-[13px] outline-none focus:border-zinc-400 bg-white"
                    />
                    <button
                      onClick={() => saveEdit(field)}
                      disabled={saving}
                      className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-[12px] font-semibold disabled:opacity-60 hover:bg-zinc-800"
                    >
                      {saving ? <Loader2 size={12} className="animate-spin" /> : "Save"}
                    </button>
                  </div>
                ) : field === "requirements" ? (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {Array.isArray(intake.requirements) && intake.requirements.length > 0 ? (
                      intake.requirements.map((r, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-zinc-100 text-[12px] text-zinc-700 font-medium">{r}</span>
                      ))
                    ) : (
                      <span className="text-[13px] text-zinc-400">None extracted</span>
                    )}
                  </div>
                ) : (
                  <p className="text-[14px] font-medium text-zinc-800 mt-1">{(intake as any)[field] || "—"}</p>
                )}
                {confidence[field] != null && editingField !== field && (
                  <div className="mt-2.5">
                    <ConfidenceBar label="AI confidence" value={confidence[field]} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Original Message */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6">
              Original Message
            </p>
            <p className="text-[13px] text-zinc-700 leading-relaxed whitespace-pre-wrap">
              {intake.rawMessage}
            </p>
          </div>
        </div>

        {/* Actions */}
        {!isFinal && (
          <div className="flex gap-4">
            <button
              onClick={handleReject}
              disabled={!!acting}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-zinc-200 bg-white text-[13px] font-semibold text-zinc-700 disabled:opacity-60 hover:bg-zinc-50 shadow-sm transition-colors"
            >
              {acting === "reject" ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} className="text-zinc-400" />}
              Mark as Unqualified
            </button>
            <button
              onClick={handleAcceptAndGenerateProposal}
              disabled={!!acting}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-zinc-900 text-white text-[13px] font-semibold disabled:opacity-60 hover:bg-zinc-800 shadow-sm transition-colors"
            >
              {acting === "accept" ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <FileText size={15} />
              )}
              Accept Lead → Generate Proposal
            </button>
          </div>
        )}
      </motion.main>
    </div>
  );
}