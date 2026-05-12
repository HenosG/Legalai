import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingFAQ from "@/components/ui/PricingFAQ";
import {
  Check, Minus, Loader2, Zap, Shield, HardDrive, Brain,
  FileText, BarChart3, Clock, Mail, Calendar, Download,
  Headphones, ArrowRight, Sparkles, Building2, Lock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// ─── Config ───────────────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── Stripe Price IDs ─────────────────────────────────────────────────────────
const priceIds = {
  starter: {
    monthly: "price_1TJFapFLsEh7x9CM7QjlVMNw",
    yearly:  "price_1TJFapFLsEh7x9CM7QjlVMNw",
  },
  pro: {
    monthly: "price_1TJ1IkFRUcxVLpa7rzb4EBMA",
    yearly:  "price_1TJ1LVFRUcxVLpa73FeJFCIA",
  },
};

// ─── Feature gate definitions per plan ───────────────────────────────────────
// This is the source of truth for conditional rendering across the whole app.
// Import PLAN_FEATURES anywhere you need to gate a feature.
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

export type PlanKey = keyof typeof PLAN_FEATURES;

// ─── Hook: use anywhere in app to gate features ───────────────────────────────
// Usage: const { can } = usePlanGate(userPlan);
//        if (!can("pdfAnalysis")) return <LockedFeature />;
export function usePlanGate(plan: PlanKey) {
  const features = PLAN_FEATURES[plan] ?? PLAN_FEATURES.free;
  const can = (feature: keyof typeof PLAN_FEATURES.pro) =>
    Boolean(features[feature as keyof typeof features]);
  return { features, can };
}

// ─── Plans — Decoy Effect applied ────────────────────────────────────────────
// Psychology: Pro at $99 anchors the price. Starter at $29 feels like a steal
// by comparison. Free shows what's missing. Starter is "Most Popular" which
// triggers social proof. Pro features are VISIBLE but locked on lower tiers
// to create aspiration and upgrade pull.
const plans = [
  {
    name: "Free",
    key: "free" as PlanKey,
    tag: "P-00",
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyMonthlyEquivalent: 0,
    description: "Explore AI-powered legal guidance at no cost.",
    features: [
      { label: "5 AI queries / month",       locked: false },
      { label: "Basic document templates",    locked: false },
      { label: "Basic case tracking",         locked: false },
      { label: "Mobile access",               locked: false },
      { label: "Community support",           locked: false },
      // Visible locked features create upgrade pull (decoy principle)
      { label: "Unlimited AI queries",        locked: true  },
      { label: "Smart reminders & tasks",     locked: true  },
      { label: "AI PDF analysis",             locked: true  },
    ],
    cta: "Get Started Free",
    popular: false,
    // Decoy: no badge, no highlight — makes Starter look better by contrast
    decoyNote: null,
  },
  {
    name: "Starter",
    key: "starter" as PlanKey,
    tag: "P-01",
    monthlyPrice: 29,
    yearlyPrice: 290,
    yearlyMonthlyEquivalent: 24,
    description: "Everything an individual needs to manage legal matters.",
    features: [
      { label: "Unlimited AI queries",               locked: false },
      { label: "Advanced AI document generator",     locked: false },
      { label: "Full case & claim tracking",         locked: false },
      { label: "Smart reminders & tasks",            locked: false },
      { label: "Calendar & email integrations",      locked: false },
      { label: "5 GB secure document vault",         locked: false },
      { label: "Priority email support",             locked: false },
      // Locked Pro features visible — creates aspiration
      { label: "AI PDF analysis & risk reports",     locked: true  },
      { label: "Professional export suite",          locked: true  },
    ],
    cta: "Get Starter",
    popular: true,
    // Decoy note nudges toward Pro without being pushy
    decoyNote: "Upgrade to Pro to unlock PDF analysis & exports",
  },
  {
    name: "Pro",
    key: "pro" as PlanKey,
    tag: "P-02",
    monthlyPrice: 99,
    yearlyPrice: 990,
    yearlyMonthlyEquivalent: 83,
    description: "Maximum power for small firms and power users.",
    features: [
      { label: "Everything in Starter",                    locked: false },
      { label: "AI PDF analysis & risk reports",           locked: false },
      { label: "Unlimited secure storage",                 locked: false },
      { label: "Professional export suite (PDF/Word)",     locked: false },
      { label: "Advanced analytics dashboard",             locked: false },
      { label: "Priority AI compute",                      locked: false },
      { label: "24 / 7 priority support",                  locked: false },
    ],
    cta: "Get Pro",
    popular: false,
    decoyNote: null,
  },
];

// ─── Comparison table ─────────────────────────────────────────────────────────
type CellVal = boolean | string;
const comparisonData = [
  {
    title: "AI Power",
    rows: [
      { feature: "AI Query Limit",             icon: Brain,      free: "5 / month",  starter: "Unlimited",   pro: "Unlimited" },
      { feature: "Document Generation",         icon: FileText,   free: "Basic",      starter: "Advanced AI", pro: "Advanced AI" },
      { feature: "PDF Analysis & Risk Reports", icon: Shield,     free: false,        starter: false,         pro: true },
      { feature: "Priority AI Compute",         icon: Zap,        free: false,        starter: false,         pro: true },
    ],
  },
  {
    title: "Case Management",
    rows: [
      { feature: "Case Tracking",               icon: BarChart3,  free: "Basic",      starter: "Full",        pro: "Full" },
      { feature: "Smart Reminders & Tasks",     icon: Clock,      free: false,        starter: true,          pro: true },
      { feature: "Calendar Sync",               icon: Calendar,   free: false,        starter: true,          pro: true },
      { feature: "Email Integrations",          icon: Mail,       free: false,        starter: true,          pro: true },
    ],
  },
  {
    title: "Storage & Security",
    rows: [
      { feature: "Secure Storage",              icon: HardDrive,  free: false,        starter: "5 GB",        pro: "Unlimited" },
      { feature: "End-to-End Encryption",       icon: Shield,     free: true,         starter: true,          pro: true },
    ],
  },
  {
    title: "Exports & Insights",
    rows: [
      { feature: "Export (PDF / Word)",         icon: Download,   free: false,        starter: false,         pro: true },
      { feature: "Analytics Dashboard",         icon: BarChart3,  free: false,        starter: false,         pro: "Advanced" },
      { feature: "Support",                     icon: Headphones, free: "Community",  starter: "Priority email", pro: "24/7 Priority" },
    ],
  },
];

// ─── LockedFeatureItem — shows padlock + muted text for gated features ────────
const LockedFeatureItem = ({ label, featured }: { label: string; featured: boolean }) => (
  <li className="flex items-start gap-3 opacity-40">
    <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${featured ? "bg-white/10" : "bg-slate-100"}`}>
      <Lock size={8} className={featured ? "text-white" : "text-slate-400"} />
    </div>
    <span className={`text-xs leading-relaxed line-through ${featured ? "text-slate-500" : "text-slate-400"}`}>
      {label}
    </span>
  </li>
);

// ─── Table Cell ───────────────────────────────────────────────────────────────
const Cell = ({ value, highlight }: { value: CellVal; highlight?: boolean }) => {
  if (value === true)
    return (
      <div className="flex justify-center">
        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${highlight ? "bg-blue-600" : "bg-slate-900"}`}>
          <Check size={11} className="text-white" />
        </div>
      </div>
    );
  if (value === false)
    return (
      <div className="flex justify-center">
        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
          <Minus size={11} className="text-slate-300" />
        </div>
      </div>
    );
  return (
    <p className={`text-center text-[11px] font-semibold leading-snug px-1 ${highlight ? "text-blue-700" : "text-slate-600"}`}>
      {value}
    </p>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
const Pricing = () => {
  const [isYearly, setIsYearly]       = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [dbPlan, setDbPlan]           = useState<PlanKey>("free");
  const [mousePos, setMousePos]       = useState({ x: 0, y: 0 });
  const [searchParams]                = useSearchParams();
  const { user }                      = useAuth() as any;
  const navigate                      = useNavigate();
  const { toast }                     = useToast();

  // Mouse glow
  useEffect(() => {
    const mv = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", mv);
    return () => window.removeEventListener("mousemove", mv);
  }, []);

  // Fetch user's current plan from Neon via backend
  useEffect(() => {
    const fetchPlan = async () => {
      const email = user?.primaryEmailAddress?.emailAddress || user?.email;
      if (!email) return;
      try {
        const res  = await fetch(`${API_BASE_URL}/api/user/${email}`, {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.plan && data.plan in PLAN_FEATURES) {
          setDbPlan(data.plan as PlanKey);
        }
      } catch {
        // silent — user stays on free display
      }
    };
    fetchPlan();
  }, [user]);

  // Checkout canceled toast
  useEffect(() => {
    if (searchParams.get("checkout") === "canceled") {
      toast({
        title: "Checkout canceled",
        description: "You can try again whenever you're ready.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  // ─── Checkout handler ───────────────────────────────────────────────────────
  const handleSelectPlan = async (plan: typeof plans[0]) => {
    if (plan.key === "free") { navigate("/signup"); return; }

    const email =
      user?.primaryEmailAddress?.emailAddress ||
      user?.email ||
      "admin@relunolegal.ai";

    setLoadingPlan(plan.key);
    try {
      const billingCycle = isYearly ? "yearly" : "monthly";
      const priceId = priceIds[plan.key as keyof typeof priceIds]?.[billingCycle];
      if (!priceId) throw new Error("Price ID not found");

      const res = await fetch(`${API_BASE_URL}/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ priceId, planName: plan.key, billingCycle, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data?.url) window.location.href = data.url;
    } catch {
      toast({
        title: "Connection Error",
        description: `Could not reach the server at ${API_BASE_URL}. Make sure the backend is running on port 5000.`,
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const displayPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return "$0";
    return isYearly ? `$${plan.yearlyMonthlyEquivalent}` : `$${plan.monthlyPrice}`;
  };

  const isCurrent = (key: string) => dbPlan === key;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-[#f7f7f5] text-slate-900 overflow-x-hidden selection:bg-blue-600 selection:text-white">

      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.022]"
        style={{
          backgroundImage:
            "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Mouse glow */}
      <div
        className="fixed pointer-events-none w-[900px] h-[900px] rounded-full bg-blue-500/[0.035] blur-[160px] z-0 transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mousePos.x - 450}px, ${mousePos.y - 450}px)` }}
      />

      <Navbar />

      {/* ── HERO ── */}
      <section className="relative z-10 pt-36 pb-24 px-6 text-center">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-10">
          <Sparkles size={13} className="text-blue-600" />
          <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">
            AI-Powered Legal Intelligence
          </span>
        </div>

        <h1 className="text-[clamp(3.5rem,10vw,7.5rem)] font-black italic uppercase tracking-tighter leading-[0.82] text-slate-900 mb-8">
          Plans Built<br />
          <span className="text-blue-600">For Every<br />Case.</span>
        </h1>

        <p className="max-w-lg mx-auto text-slate-500 text-sm font-medium leading-relaxed mb-12">
          Start free. Scale when you need more. No annual lock-ins —
          <br className="hidden md:block" />
          cancel any time, no questions asked.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-7 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
              !isYearly ? "bg-slate-900 text-white shadow" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-7 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 transition-all duration-200 ${
              isYearly ? "bg-slate-900 text-white shadow" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Yearly
            <span className="bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase">
              −17%
            </span>
          </button>
        </div>
      </section>

      {/* ── PRICING CARDS ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-28">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const current  = isCurrent(plan.key);
            const featured = plan.popular;

            return (
              <div
                key={plan.key}
                className={`group relative flex flex-col rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 ${
                  featured
                    ? "bg-slate-900 text-white shadow-[0_40px_80px_-20px_rgba(15,23,42,0.3)]"
                    : "bg-white border border-slate-200/80 shadow-sm hover:shadow-xl"
                }`}
              >
                {/* Most Popular badge */}
                {featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.3em] shadow-lg shadow-blue-600/30 whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                {/* Current plan badge */}
                {current && (
                  <div className="absolute -top-4 right-6 px-4 py-1.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-[0.3em] shadow-lg whitespace-nowrap">
                    Your Plan
                  </div>
                )}

                <div className="p-10 flex flex-col flex-1">
                  {/* Tag + Name */}
                  <div className="mb-8">
                    <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${featured ? "text-blue-400" : "text-slate-400"}`}>
                      {plan.tag}
                    </span>
                    <h3 className={`mt-1 text-4xl font-black italic uppercase tracking-tighter ${featured ? "text-white" : "text-slate-900"}`}>
                      {plan.name}
                    </h3>
                    <p className={`mt-2 text-xs leading-relaxed ${featured ? "text-slate-400" : "text-slate-500"}`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-2 flex items-end gap-1.5">
                    <span className={`text-6xl font-black tracking-tighter leading-none transition-transform duration-500 group-hover:scale-105 origin-left ${featured ? "text-white" : "text-slate-900"}`}>
                      {displayPrice(plan)}
                    </span>
                    <div className="pb-1 flex flex-col leading-tight">
                      <span className="text-xs font-bold uppercase text-slate-400">USD</span>
                      <span className="text-[10px] font-medium text-slate-400">/mo</span>
                    </div>
                  </div>

                  <p className={`text-[10px] font-medium mb-8 ${featured ? "text-slate-500" : "text-slate-400"}`}>
                    {plan.monthlyPrice === 0
                      ? "Free forever"
                      : isYearly
                      ? `Billed $${plan.yearlyPrice} / year`
                      : `or $${plan.yearlyMonthlyEquivalent}/mo billed yearly`}
                  </p>

                  <div className={`h-px mb-8 ${featured ? "bg-white/10" : "bg-slate-100"}`} />

                  {/* Feature list — unlocked + locked items */}
                  <ul className="space-y-3 flex-1 mb-4">
                    {plan.features.map((f) =>
                      f.locked ? (
                        <LockedFeatureItem key={f.label} label={f.label} featured={featured} />
                      ) : (
                        <li key={f.label} className="flex items-start gap-3">
                          <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${featured ? "bg-blue-600" : "bg-slate-100"}`}>
                            <Check size={9} className={featured ? "text-white" : "text-slate-700"} />
                          </div>
                          <span className={`text-xs leading-relaxed ${featured ? "text-slate-300" : "text-slate-600"}`}>
                            {f.label}
                          </span>
                        </li>
                      )
                    )}
                  </ul>

                  {/* Decoy nudge — only on Starter */}
                  {plan.decoyNote && !current && (
                    <p className="text-[10px] text-blue-400 font-medium mb-6 flex items-center gap-1.5">
                      <Zap size={10} />
                      {plan.decoyNote}
                    </p>
                  )}

                  {/* CTA */}
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={current || loadingPlan === plan.key}
                    className={`group/btn mt-auto flex items-center justify-center gap-2 w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-60 ${
                      featured
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25"
                        : "bg-slate-900 hover:bg-blue-600 text-white"
                    } ${current ? "!bg-emerald-500 cursor-default" : ""}`}
                  >
                    {loadingPlan === plan.key ? (
                      <><Loader2 size={15} className="animate-spin" /> Initializing…</>
                    ) : current ? (
                      "Active Plan ✓"
                    ) : (
                      <>
                        {plan.cta}
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Decoy callout — anchors Pro as the "smart" choice */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 font-medium">
            💡 <span className="text-slate-600 font-semibold">Most power users upgrade to Pro</span> — PDF analysis alone saves 3+ hours per case.
          </p>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-3">
            Feature Breakdown
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black italic uppercase tracking-tighter text-slate-900 leading-[0.88]">
            Everything,<br />
            <span className="text-blue-600">Side by Side.</span>
          </h2>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_repeat(3,_148px)] border-b-2 border-slate-100">
            <div className="px-8 py-7" />
            {plans.map((plan) => (
              <div
                key={plan.key}
                className={`py-7 px-4 text-center flex flex-col items-center justify-center gap-1 border-l ${
                  plan.popular ? "bg-blue-600 border-blue-600" : "border-slate-100"
                }`}
              >
                <span className={`text-xs font-black uppercase tracking-wider ${plan.popular ? "text-white" : "text-slate-900"}`}>
                  {plan.name}
                </span>
                <span className={`text-[10px] font-medium ${plan.popular ? "text-blue-200" : "text-slate-400"}`}>
                  {displayPrice(plan)}/mo
                </span>
                {isCurrent(plan.key) && (
                  <span className="mt-1 text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black">
                    ACTIVE
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Sections */}
          {comparisonData.map((section, sIdx) => (
            <React.Fragment key={sIdx}>
              <div className="grid grid-cols-[1fr_repeat(3,_148px)] bg-slate-50/80 border-b border-slate-100">
                <div className="px-8 py-3.5 col-span-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.45em] text-slate-400">
                    {section.title}
                  </span>
                </div>
              </div>
              {section.rows.map((row, rIdx) => {
                const Icon = row.icon;
                return (
                  <div
                    key={rIdx}
                    className="grid grid-cols-[1fr_repeat(3,_148px)] border-b border-slate-100/60 hover:bg-blue-50/20 transition-colors"
                  >
                    <div className="px-8 py-5 flex items-center gap-3">
                      <Icon size={14} className="text-slate-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-700">{row.feature}</span>
                    </div>
                    <div className="py-5 px-4 border-l border-slate-100 flex items-center justify-center">
                      <Cell value={row.free as CellVal} />
                    </div>
                    <div className="py-5 px-4 border-l border-blue-100 bg-blue-50/40 flex items-center justify-center">
                      <Cell value={row.starter as CellVal} highlight />
                    </div>
                    <div className="py-5 px-4 border-l border-slate-100 flex items-center justify-center">
                      <Cell value={row.pro as CellVal} />
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}

          {/* Bottom CTA row */}
          <div className="grid grid-cols-[1fr_repeat(3,_148px)] border-t-2 border-slate-100 bg-slate-50/50">
            <div className="px-8 py-6 flex items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ready to start?</span>
            </div>
            {plans.map((plan) => (
              <div
                key={plan.key}
                className={`py-6 px-4 flex items-center justify-center border-l ${
                  plan.popular ? "border-blue-100 bg-blue-50/60" : "border-slate-100"
                }`}
              >
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrent(plan.key) || loadingPlan === plan.key}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 disabled:opacity-50 ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20"
                      : "bg-slate-900 text-white hover:bg-blue-600"
                  }`}
                >
                  {isCurrent(plan.key) ? "Active" : plan.key === "free" ? "Start Free" : "Select"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-5">
          {[
            {
              icon: <div className="h-4 w-4 rounded-full bg-slate-900 flex items-center justify-center"><Check size={9} className="text-white" /></div>,
              label: "Included",
            },
            {
              icon: <div className="h-4 w-4 rounded-full bg-slate-100 flex items-center justify-center"><Minus size={9} className="text-slate-300" /></div>,
              label: "Not available",
            },
            {
              icon: <div className="h-4 w-4 rounded-full bg-slate-100 flex items-center justify-center"><Lock size={9} className="text-slate-400" /></div>,
              label: "Upgrade to unlock",
            },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              {icon}
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── ENTERPRISE ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <div className="relative overflow-hidden rounded-[3rem] bg-slate-900">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.055]"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />
          <div className="relative z-10 grid lg:grid-cols-[1fr_420px]">
            <div className="p-14 lg:p-20 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-10 w-fit">
                <Building2 size={12} />
                Enterprise & Teams
              </div>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black italic uppercase tracking-tighter leading-[0.88] text-white mb-6">
                Need a<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-400">
                  Custom Plan?
                </span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-md">
                Built for law firms, legal departments, and growing teams. Custom AI deployments, dedicated onboarding, SSO, advanced compliance controls, and a dedicated account manager.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {["Custom AI deployment", "Dedicated account manager", "SSO & compliance controls", "White-glove onboarding"].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                      <Check size={10} className="text-blue-400" />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center p-14 lg:p-16 border-l border-white/[0.06]">
              <div className="w-full bg-white/[0.045] border border-white/10 rounded-[2rem] p-10 backdrop-blur-sm">
                <div className="flex justify-center mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                    <Building2 size={28} className="text-blue-400" />
                  </div>
                </div>
                <h4 className="text-center text-2xl font-black italic uppercase tracking-tighter text-white mb-2">
                  Let's Talk
                </h4>
                <p className="text-center text-slate-500 text-xs leading-relaxed mb-8">
                  Describe your team's needs and we'll build a plan around you.
                </p>
                <button
                  onClick={() => navigate("/contact")}
                  className="group/btn w-full h-14 rounded-xl bg-white text-slate-900 text-sm font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                >
                  Contact Sales
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
                <p className="mt-4 text-center text-[10px] text-slate-600 font-medium uppercase tracking-widest">
                  Response within 24–48 hours
                </p>
                <div className="mt-8 pt-8 border-t border-white/[0.06] grid grid-cols-3 gap-3 text-center">
                  {[
                    { val: "SOC 2",   label: "Compliant"  },
                    { val: "AES-256", label: "Encryption" },
                    { val: "99.9%",   label: "Uptime"     },
                  ].map(({ val, label }) => (
                    <div key={label}>
                      <p className="text-white text-sm font-black">{val}</p>
                      <p className="text-slate-600 text-[9px] uppercase tracking-widest mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="text-center mb-14">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-3">
            Common Questions
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black italic uppercase tracking-tighter text-slate-900 leading-[0.88]">
            Got<br />
            <span className="text-blue-600">Questions?</span>
          </h2>
        </div>
        <PricingFAQ />
      </section>

      {/* ── METRICS STRIP ── */}
      <div className="relative z-10 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Active Users", val: "12,400+" },
            { label: "Uptime",       val: "99.99%"  },
            { label: "AI Response",  val: "< 2s"    },
            { label: "Encryption",   val: "AES-256" },
          ].map(({ label, val }) => (
            <div key={label} className="text-center md:text-left">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1">{label}</p>
              <p className="text-xl font-black italic uppercase tracking-tight text-slate-900">{val}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;