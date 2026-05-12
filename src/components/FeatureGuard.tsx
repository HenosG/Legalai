// src/components/FeatureGuard.tsx
// Reusable feature gate. Wraps any page/panel.
// If the user's plan meets `requiredPlan`, children render normally.
// If not, children render blurred with an upgrade overlay modal.

import React from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription, type PlanKey } from "@/contexts/SubscriptionContext";
import { Lock, ArrowRight, Sparkles, Zap, Crown } from "lucide-react";

// ─── Plan hierarchy ────────────────────────────────────────────────────────────
const PLAN_RANK: Record<PlanKey, number> = { free: 0, starter: 1, pro: 2 };

function meetsRequirement(userPlan: PlanKey, required: PlanKey): boolean {
  return PLAN_RANK[userPlan] >= PLAN_RANK[required];
}

const PLAN_META: Record<PlanKey, { label: string; color: string; accent: string; icon: React.ReactNode }> = {
  free: {
    label: "Free",
    color: "text-slate-500",
    accent: "bg-slate-900",
    icon: <Lock className="w-5 h-5" />,
  },
  starter: {
    label: "Starter",
    color: "text-emerald-600",
    accent: "bg-emerald-600",
    icon: <Zap className="w-5 h-5" />,
  },
  pro: {
    label: "Pro",
    color: "text-blue-700",
    accent: "bg-blue-700",
    icon: <Crown className="w-5 h-5" />,
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface FeatureGuardProps {
  /** Feature display name shown in the upgrade modal */
  featureName: string;
  /** Minimum plan required to access this feature */
  requiredPlan: PlanKey;
  /** The actual feature UI to render (or blur) */
  children: React.ReactNode;
  /** Optional: custom description for the lock overlay */
  description?: string;
  /** Blur intensity — defaults to 8px */
  blurPx?: number;
}

// ─── Upgrade Overlay ──────────────────────────────────────────────────────────
const UpgradeOverlay = ({
  featureName,
  requiredPlan,
  description,
}: {
  featureName: string;
  requiredPlan: PlanKey;
  description?: string;
}) => {
  const navigate = useNavigate();
  const meta = PLAN_META[requiredPlan];

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center">
      {/* Glassmorphic backdrop */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[3px] rounded-[inherit]" />

      {/* Modal card */}
      <div className="relative z-50 max-w-sm w-full mx-6 bg-white border border-slate-100 rounded-3xl shadow-2xl shadow-slate-200/80 p-8 text-center">
        {/* Icon badge */}
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-5">
          <div className={meta.color}>
            {meta.icon}
          </div>
        </div>

        {/* Heading */}
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] mb-1">
          Plan Required
        </p>
        <h3 className="text-lg font-black text-slate-900 tracking-tight mb-1">
          {featureName}
        </h3>
        <p className="text-sm text-slate-500 mb-1">
          requires the{" "}
          <span className={`font-black ${meta.color}`}>{meta.label}</span> Plan
        </p>

        {description && (
          <p className="text-xs text-slate-400 leading-relaxed mb-5">{description}</p>
        )}

        {!description && <div className="mb-5" />}

        {/* Perks teaser */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-5 text-left space-y-2">
          {requiredPlan === "starter" && (
            <>
              <Perk>Unlimited AI queries</Perk>
              <Perk>Smart Reminders & Tasks</Perk>
              <Perk>Calendar & Email sync</Perk>
              <Perk>Advanced document generation</Perk>
            </>
          )}
          {requiredPlan === "pro" && (
            <>
              <Perk>AI PDF risk analysis</Perk>
              <Perk>Workload Intelligence dashboard</Perk>
              <Perk>Professional Export Suite</Perk>
              <Perk>Priority 24/7 support</Perk>
            </>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/pricing")}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-black uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98] shadow-lg ${meta.accent}`}
        >
          <Sparkles className="w-4 h-4" />
          Upgrade to {meta.label}
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-slate-400 mt-3 font-medium">
          Upgrade in seconds — no commitment required
        </p>
      </div>
    </div>
  );
};

const Perk = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
    {children}
  </div>
);

// ─── Main FeatureGuard ─────────────────────────────────────────────────────────
export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  featureName,
  requiredPlan,
  children,
  description,
  blurPx = 8,
}) => {
  const { subscription, loading } = useSubscription();
  const userPlan: PlanKey = subscription?.plan ?? "free";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (meetsRequirement(userPlan, requiredPlan)) {
    return <>{children}</>;
  }

  // Render blurred children with overlay
  return (
    <div className="relative overflow-hidden rounded-[inherit]">
      {/* Blurred content underneath */}
      <div
        style={{ filter: `blur(${blurPx}px)`, pointerEvents: "none", userSelect: "none" }}
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Upgrade overlay on top */}
      <UpgradeOverlay
        featureName={featureName}
        requiredPlan={requiredPlan}
        description={description}
      />
    </div>
  );
};

export default FeatureGuard;