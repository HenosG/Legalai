// src/contexts/SubscriptionContext.tsx
// Fetches the user's real plan from Neon via the backend.
// Provides plan data to Dashboard and any other component that needs it.

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export type PlanKey = "free" | "starter" | "pro";

interface SubscriptionData {
  plan: PlanKey;
  status: string; // "active" | "canceled" | "past_due"
  currentPeriodEnd?: string;
  stripePriceId?: string;
}

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  loading: boolean;
  refetch: () => void;
  // Convenience flags
  isFree: boolean;
  isStarter: boolean;
  isPro: boolean;
  isPaid: boolean; // starter or pro
  // Feature gate helper — use this everywhere
  can: (feature: FeatureKey) => boolean;
  queriesUsed: number;
  queriesLimit: number;
}

// ─── Plan feature definitions ─────────────────────────────────────────────────
export const PLAN_FEATURES = {
  free: {
    aiQueries: 5,
    documentGeneration: "basic",
    pdfAnalysis: false,
    priorityCompute: false,
    caseTracking: "basic",
    smartReminders: false,
    calendarSync: false,
    emailIntegrations: false,
    secureStorage: false,
    exportSuite: false,
    analyticsLevel: false,
    supportLevel: "community",
  },
  starter: {
    aiQueries: Infinity,
    documentGeneration: "advanced",
    pdfAnalysis: false,
    priorityCompute: false,
    caseTracking: "full",
    smartReminders: true,
    calendarSync: true,
    emailIntegrations: true,
    secureStorage: "5gb",
    exportSuite: false,
    analyticsLevel: false,
    supportLevel: "priority_email",
  },
  pro: {
    aiQueries: Infinity,
    documentGeneration: "advanced",
    pdfAnalysis: true,
    priorityCompute: true,
    caseTracking: "full",
    smartReminders: true,
    calendarSync: true,
    emailIntegrations: true,
    secureStorage: "unlimited",
    exportSuite: true,
    analyticsLevel: "advanced",
    supportLevel: "priority_247",
  },
} as const;

export type FeatureKey = keyof typeof PLAN_FEATURES.pro;

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [queriesUsed, setQueriesUsed] = useState(0);

  const fetchSubscription = async () => {
    const email = user?.email;
    if (!email) { setLoading(false); return; }

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/${encodeURIComponent(email)}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch plan");
      const data = await res.json();

      setSubscription({
        plan: (data.plan as PlanKey) || "free",
        status: data.status || "active",
        currentPeriodEnd: data.subscription?.currentPeriodEnd,
        stripePriceId: data.subscription?.stripePriceId,
      });
    } catch {
      // Default to free on any error — fail safe, never block the user
      setSubscription({ plan: "free", status: "active" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubscription(); }, [user?.email]);

  const plan = subscription?.plan ?? "free";
  const features = PLAN_FEATURES[plan];

  const can = (feature: FeatureKey): boolean => Boolean(features[feature]);

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      loading,
      refetch: fetchSubscription,
      isFree:    plan === "free",
      isStarter: plan === "starter",
      isPro:     plan === "pro",
      isPaid:    plan === "starter" || plan === "pro",
      can,
      queriesUsed,
      queriesLimit: features.aiQueries === Infinity ? Infinity : features.aiQueries,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error("useSubscription must be used within SubscriptionProvider");
  return context;
};
