// src/pages/Pricing.tsx
// Design: Linear / Attio Minimalist — dashboard-block pricing, blue/zinc palette only
// Features: File-based SVG logo imports, single-row infinite marquee, layoutId-driven
// billing toggle, staggered scroll reveals, masonry testimonial wall.

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingFAQ from "@/components/ui/PricingFAQ";
import {
  Check, Minus, Loader2, Zap, Shield, HardDrive, Brain,
  FileText, BarChart3, Clock, Mail, Calendar, Download,
  Headphones, ArrowRight, ChevronRight, Lock,
  CheckCircle, Star,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useSubscription, type PlanType as Tier } from "@/contexts/SubscriptionContext";

// ─── SVG Logo Imports (DO NOT TOUCH) ────────────────────────────────────────────
import OpenAILogo from "@/assets/logos/openai.svg";
import SpotifyLogo from "@/assets/logos/spotify.svg";
import GitHubLogo from "@/assets/logos/Github.svg";
import MicrosoftLogo from "@/assets/logos/microsoft.svg";
import GoogleLogo from "@/assets/logos/Google.svg";
import SlackLogo from "@/assets/logos/Slack.svg";
import DropboxLogo from "@/assets/logos/dropbox.svg";
import NotionLogo from "@/assets/logos/notion.svg";
import LinearLogo from "@/assets/logos/linear.svg";
import StripeLogo from "@/assets/logos/Stripe.svg";
import VercelLogo from "@/assets/logos/Vercel.svg";
import CloudflareLogo from "@/assets/logos/Cloudflare.svg";
import AtlassianLogo from "@/assets/logos/Atlassian.svg";
import SupabaseLogo from "@/assets/logos/supabase.svg";
import MongoDBLogo from "@/assets/logos/MongoDB.svg";
import AnthropicLogo from "@/assets/logos/Anthropic.svg";

/// ─── Config ────────────────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── Stripe Price IDs ──────────────────────────────────────────────────────────
const priceIds = {
  starter: {
    monthly: "price_1TJFapFLsEh7x9CM7QjlVMNw",
    yearly: "price_1TJFapFLsEh7x9CM7QjlVMNw",
  },
  pro: {
    monthly: "price_1TJ1IkFRUcxVLpa7rzb4EBMA",
    yearly: "price_1TJ1LVFRUcxVLpa73FeJFCIA",
  },
};

// ─── Plans data ────────────────────────────────────────────────────────────────
const plans = [
  {
    name: "Free",
    key: "free" as Tier,
    tag: "P-00",
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyMonthlyEquivalent: 0,
    description: "Explore AI-powered legal guidance at no cost.",
    features: [
      { label: "5 AI queries / month", locked: false },
      { label: "Basic document templates", locked: false },
      { label: "Basic case tracking", locked: false },
      { label: "Mobile access", locked: false },
      { label: "Community support", locked: false },
      { label: "Unlimited AI queries", locked: true },
      { label: "Smart reminders & tasks", locked: true },
      { label: "AI PDF analysis", locked: true },
    ],
    cta: "Get started free",
    popular: false,
    decoyNote: null,
  },
  {
    name: "Starter",
    key: "starter" as Tier,
    tag: "P-01",
    monthlyPrice: 29,
    yearlyPrice: 290,
    yearlyMonthlyEquivalent: 24,
    description: "Everything an individual needs to manage legal matters.",
    features: [
      { label: "Unlimited AI queries", locked: false },
      { label: "Advanced AI document generator", locked: false },
      { label: "Full case & claim tracking", locked: false },
      { label: "Smart reminders & tasks", locked: false },
      { label: "Calendar & email integrations", locked: false },
      { label: "5 GB secure document vault", locked: false },
      { label: "Priority email support", locked: false },
      { label: "AI PDF analysis & risk reports", locked: true },
      { label: "Professional export suite", locked: true },
    ],
    cta: "Get Starter",
    popular: true,
    decoyNote: "Upgrade to Pro to unlock PDF analysis & exports",
  },
  {
    name: "Pro",
    key: "pro" as Tier,
    tag: "P-02",
    monthlyPrice: 99,
    yearlyPrice: 990,
    yearlyMonthlyEquivalent: 83,
    description: "Maximum power for small firms and power users.",
    features: [
      { label: "Everything in Starter", locked: false },
      { label: "AI PDF analysis & risk reports", locked: false },
      { label: "Unlimited secure storage", locked: false },
      { label: "Professional export suite (PDF/Word)", locked: false },
      { label: "Advanced analytics dashboard", locked: false },
      { label: "Priority AI compute", locked: false },
      { label: "24/7 priority support", locked: false },
    ],
    cta: "Get Pro",
    popular: false,
    decoyNote: null,
  },
];

// ─── Logo array for marquee (DO NOT TOUCH) ─────────────────────────────────────
const logoArray = [
  { name: "OpenAI", src: OpenAILogo },
  { name: "Spotify", src: SpotifyLogo },
  { name: "GitHub", src: GitHubLogo },
  { name: "Microsoft", src: MicrosoftLogo },
  { name: "Google", src: GoogleLogo },
  { name: "Slack", src: SlackLogo },
  { name: "Dropbox", src: DropboxLogo },
  { name: "Notion", src: NotionLogo },
  { name: "Linear", src: LinearLogo },
  { name: "Stripe", src: StripeLogo },
  { name: "Vercel", src: VercelLogo },
  { name: "Cloudflare", src: CloudflareLogo },
  { name: "Atlassian", src: AtlassianLogo },
  { name: "Supabase", src: SupabaseLogo },
  { name: "MongoDB", src: MongoDBLogo },
  { name: "Anthropic", src: AnthropicLogo },
];

// ─── Comparison table ──────────────────────────────────────────────────────────
type CellVal = boolean | string;
const comparisonData = [
  {
    title: "AI capabilities",
    rows: [
      { feature: "AI query limit", icon: Brain, free: "5 / month", starter: "Unlimited", pro: "Unlimited" },
      { feature: "Document generation", icon: FileText, free: "Basic", starter: "Advanced AI", pro: "Advanced AI" },
      { feature: "PDF analysis & risk scoring", icon: Shield, free: false, starter: false, pro: true },
      { feature: "Priority AI compute", icon: Zap, free: false, starter: false, pro: true },
    ],
  },
  {
    title: "Case management",
    rows: [
      { feature: "Case & claim tracking", icon: BarChart3, free: "Basic", starter: "Full", pro: "Full" },
      { feature: "Smart reminders & tasks", icon: Clock, free: false, starter: true, pro: true },
      { feature: "Calendar sync", icon: Calendar, free: false, starter: true, pro: true },
      { feature: "Email integrations", icon: Mail, free: false, starter: true, pro: true },
    ],
  },
  {
    title: "Storage & security",
    rows: [
      { feature: "Secure document vault", icon: HardDrive, free: false, starter: "5 GB", pro: "Unlimited" },
      { feature: "AES-256 encryption", icon: Shield, free: true, starter: true, pro: true },
    ],
  },
  {
    title: "Exports & insights",
    rows: [
      { feature: "Export (PDF / Word)", icon: Download, free: false, starter: false, pro: true },
      { feature: "Analytics dashboard", icon: BarChart3, free: false, starter: false, pro: "Advanced" },
      { feature: "Support tier", icon: Headphones, free: "Community", starter: "Priority email", pro: "24/7 priority" },
    ],
  },
];

// ─── Testimonials (masonry wall) ───────────────────────────────────────────────
// `highlight` marks the substring that gets the blue emphasis treatment,
// matching the reference layout but restricted to the blue/zinc palette.
const testimonials = [
  {
    quote: "Reluno's contract review caught a liability clause our last attorney missed.",
    highlight: "caught a liability clause our last attorney missed",
    name: "Samantha Lee",
    role: "Founder, NextGen Consulting",
  },
  {
    quote: "As a solo founder, I needed legal cover fast. Our response time on contracts dropped from days to minutes.",
    highlight: "dropped from days to minutes",
    name: "Raj Patel",
    role: "Founder & CEO, StartUp Grid",
  },
  {
    quote: "The case tracking dashboard keeps every claim organized. Nothing falls through the cracks anymore.",
    highlight: "Nothing falls through the cracks anymore",
    name: "Alex Rivera",
    role: "COO, InnovateTech",
  },
  {
    quote: "Document generation alone paid for the subscription in the first week. Lease reviews now take minutes, not hours.",
    highlight: "paid for the subscription in the first week",
    name: "Emily Chen",
    role: "Product Manager, Digital Wave",
  },
  {
    quote: "We swapped a $400/hr retainer for a flat monthly plan. Our legal spend is down 70% this quarter.",
    highlight: "Our legal spend is down 70% this quarter",
    name: "Michael Brown",
    role: "Data Scientist, FinTech Innovations",
  },
  {
    quote: "Risk scoring on every PDF upload means I never sign anything blind. It's become part of our intake process.",
    highlight: "I never sign anything blind",
    name: "Linda Wu",
    role: "VP of Operations, LogiChain",
  },
  {
    quote: "The AI explains clauses in plain English before our team ever talks to outside counsel.",
    highlight: "explains clauses in plain English",
    name: "Tom Chen",
    role: "Director of IT, HealthTech Solutions",
  },
  {
    quote: "Encryption and Security First compliance meant our security review took a single afternoon, not a month.",
    highlight: "took a single afternoon, not a month",
    name: "Jake Morrison",
    role: "CTO, SecureNet Tech",
  },
  {
    quote: "Reluno handles the first pass on every vendor agreement. Our in-house counsel now only sees the exceptions.",
    highlight: "only sees the exceptions",
    name: "Nadia Ali",
    role: "Product Manager, Creative Solutions",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const SectionEyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 mb-5">
    <div className="h-px w-6 bg-blue-600" />
    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em]">
      {children}
    </span>
  </div>
);

const LockedItem = ({ label }: { label: string }) => (
  <li className="flex items-start gap-3 opacity-35">
    <div className="mt-0.5 w-4 h-4 shrink-0 rounded-full bg-zinc-100 flex items-center justify-center">
      <Lock size={7} className="text-zinc-400" />
    </div>
    <span className="text-xs text-zinc-400 leading-relaxed line-through">{label}</span>
  </li>
);

const Cell = ({ value, highlight }: { value: CellVal; highlight?: boolean }) => {
  if (value === true)
    return (
      <div className="flex justify-center">
        <div className={`h-5 w-5 rounded-full flex items-center justify-center ${highlight ? "bg-blue-600" : "bg-zinc-900"}`}>
          <Check size={10} className="text-white" />
        </div>
      </div>
    );
  if (value === false)
    return (
      <div className="flex justify-center">
        <div className="h-5 w-5 rounded-full bg-zinc-100 flex items-center justify-center">
          <Minus size={10} className="text-zinc-300" />
        </div>
      </div>
    );
  return (
    <p className={`text-center text-[11px] font-semibold leading-snug px-1 ${highlight ? "text-blue-600" : "text-zinc-600"}`}>
      {value}
    </p>
  );
};

// ─── Loading skeleton ──────────────────────────────────────────────────────────
const PricingCardsSkeleton = () => (
  <div className="grid md:grid-cols-3 gap-5 animate-pulse">
    {[0, 1, 2].map((i) => (
      <div key={i} className="flex flex-col p-8 bg-white border border-zinc-200 rounded-2xl gap-4">
        <div className="h-2.5 w-10 bg-zinc-100 rounded-sm" />
        <div className="h-7 w-24 bg-zinc-100 rounded-sm" />
        <div className="h-3 w-full bg-zinc-100 rounded-sm" />
        <div className="h-10 w-20 bg-zinc-100 rounded-sm mt-2" />
        <div className="h-px w-full bg-zinc-100 my-2" />
        {[0, 1, 2, 3, 4].map((j) => (
          <div key={j} className="h-3 w-full bg-zinc-100 rounded-sm" />
        ))}
        <div className="h-11 w-full bg-zinc-100 rounded-full mt-auto" />
      </div>
    ))}
  </div>
);

// ─── Logo marquee (DO NOT TOUCH) ───────────────────────────────────────────────
const TrustedByMarquee: React.FC = () => {
  const topLogos = logoArray.slice(0, 8);
  const bottomLogos = logoArray.slice(8, 16);

  return (
    <div className="relative overflow-hidden flex flex-col gap-8">

      {/* Top row - moves right */}
      <div className="relative overflow-hidden">
        <div
          className="flex w-max items-center gap-20 py-6"
          style={{
            animation: "scroll-right 15s linear infinite",
          }}
        >
          {[...topLogos, ...topLogos].map((logo, i) => (
            <div
              key={`top-${logo.name}-${i}`}
              className="shrink-0 flex items-center justify-center px-8"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>


      {/* Bottom row - moves left */}
      <div className="relative overflow-hidden">
        <div
          className="flex w-max items-center gap-20 py-6"
          style={{
            animation: "scroll-left 15s linear infinite",
          }}
        >
          {[...bottomLogos, ...bottomLogos].map((logo, i) => (
            <div
              key={`bottom-${logo.name}-${i}`}
              className="shrink-0 flex items-center justify-center px-8"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>


      <style>{`
        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>

    </div>
  );
};

// ─── Testimonial wall ──────────────────────────────────────────────────────────
const TestimonialCard = ({ t, index }: { t: typeof testimonials[0]; index: number }) => {
  const parts = t.quote.split(t.highlight);
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="border border-zinc-200 rounded-xl p-6 bg-white hover:border-zinc-300 transition-colors duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
    >
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={11} className="fill-blue-600 text-blue-600" />
        ))}
      </div>
      <p className="text-[13px] leading-relaxed text-zinc-600 mb-5">
        {parts[0]}
        <span className="font-semibold text-zinc-900 bg-blue-50 px-0.5 rounded">{t.highlight}</span>
        {parts[1]}
      </p>
      <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
        <div className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
          {t.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <p className="text-xs font-semibold text-zinc-900 leading-tight">{t.name}</p>
          <p className="text-[10px] text-zinc-400 leading-tight">{t.role}</p>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialWall: React.FC = () => {
  // Distribute into 4 masonry columns
  const columns: (typeof testimonials)[] = [[], [], [], []];
  testimonials.forEach((t, i) => columns[i % 4].push(t));

  return (
    <div className="relative">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-h-[640px] overflow-hidden"
        style={{ maskImage: "linear-gradient(to bottom, transparent, black 8%, black 88%, transparent)" }}
      >
        {columns.map((col, ci) => (
          <div key={ci} className={`flex flex-col gap-5 ${ci % 2 === 1 ? "sm:mt-10" : ""}`}>
            {col.map((t, i) => (
              <TestimonialCard key={t.name} t={t} index={ci + i * 4} />
            ))}
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const { plan: tier, isLoading: planLoading } = useSubscription();

  useEffect(() => {
    if (searchParams.get("checkout") === "canceled") {
      toast({
        title: "Checkout canceled",
        description: "You can try again whenever you're ready.",
        variant: "destructive",
      });
    }
  }, [searchParams]);

  const handleSelectPlan = async (plan: typeof plans[0]) => {
    if (plan.key === "free") {
      navigate("/signup");
      return;
    }
    const email = user?.primaryEmailAddress?.emailAddress || "user@example.com";

    setLoadingPlan(plan.key);
    try {
      const billingCycle = isYearly ? "yearly" : "monthly";
      const priceId = priceIds[plan.key as keyof typeof priceIds]?.[billingCycle];
      if (!priceId) throw new Error("Price ID not found");
      const res = await fetch(`${API_BASE_URL}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          priceId,
          planName: plan.key,
          billingCycle,
          email,
          userId: user?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
      toast({
        title: "Connection error",
        description: `Could not reach the server at ${API_BASE_URL}.`,
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

  // Single source of truth for "is this the user's active plan" — never hardcoded.
  // Returns false whenever subscription data is still loading or tier is unknown,
  // so no card can show a stale/incorrect "Your plan" badge.
  const isCurrent = (key: Tier) =>
    !planLoading && Boolean(tier) && tier === key;

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, .font-serif { font-family: 'DM Serif Display', serif; }
      `}</style>

      <Navbar />

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="pt-32 pb-24 px-6 border-b border-zinc-200">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.5 }}>
            <SectionEyebrow>Pricing</SectionEyebrow>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-serif text-[clamp(3rem,7vw,5.5rem)] leading-[1.02] tracking-tight text-zinc-900 mb-8 max-w-4xl"
          >
            Start free. Scale when you need to.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-zinc-500 leading-relaxed max-w-xl mb-12 font-light"
          >
            No contracts. No hidden fees. Every plan includes AES-256 encryption and full platform access. Cancel any time.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5, delay: 0.15 }}
            className="inline-flex items-center p-1 rounded-full bg-zinc-100 border border-zinc-200 relative"
          >
            <button
              onClick={() => setIsYearly(false)}
              className={`relative z-10 px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-colors duration-200 ${
                !isYearly ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {!isYearly && (
                <motion.span
                  layoutId="billing-pill"
                  className="absolute inset-0 -z-10 bg-white rounded-full shadow-sm border border-zinc-200"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`relative z-10 px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-colors duration-200 ${
                isYearly ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {isYearly && (
                <motion.span
                  layoutId="billing-pill"
                  className="absolute inset-0 -z-10 bg-white rounded-full shadow-sm border border-zinc-200"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              Yearly
              <span className="bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                −17%
              </span>
            </button>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-10"
          >
            {["No credit card required", "Security First compliant", "Cancel anytime", "AES-256 encryption"].map((item) => (
              <span key={item} className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <Check size={12} className="text-blue-600 shrink-0" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PRICING CARDS — dashboard blocks
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 border-b border-zinc-200">
        <div className="max-w-5xl mx-auto">
          {planLoading ? (
            <PricingCardsSkeleton />
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {plans.map((plan, idx) => {
                const current = isCurrent(plan.key);
                const featured = plan.popular;

                return (
                  <motion.div
                    key={plan.key}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    className={`relative flex flex-col p-8 rounded-2xl border bg-white transition-all duration-200 ${
                      featured
                        ? "border-blue-300 bg-blue-50/30 shadow-[0_0_0_1px_rgba(37,99,235,0.08),0_8px_24px_-8px_rgba(37,99,235,0.15)]"
                        : "border-zinc-200 hover:border-zinc-300 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                    }`}
                  >
                    {/* Popular badge */}
                    {featured && (
                      <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-blue-600 text-white text-[9px] font-bold uppercase tracking-[0.25em] whitespace-nowrap">
                        Most popular
                      </div>
                    )}

                    {/* Current plan badge — derives strictly from useSubscription, never hardcoded */}
                    <AnimatePresence>
                      {current && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute -top-3 right-8 px-3 py-1 rounded-full bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-[0.25em] whitespace-nowrap"
                        >
                          Your plan
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Header */}
                    <div className="mb-6">
                      <p className={`text-[10px] font-bold uppercase tracking-[0.4em] mb-2 ${featured ? "text-blue-600" : "text-zinc-400"}`}>
                        {plan.tag}
                      </p>
                      <h3 className="font-serif text-3xl tracking-tight mb-1 text-zinc-900">
                        {plan.name}
                      </h3>
                      <p className="text-xs leading-relaxed text-zinc-500">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-2 flex items-baseline gap-1.5">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={isYearly ? "yearly" : "monthly"}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="text-5xl font-bold tracking-tight leading-none text-zinc-900"
                        >
                          {displayPrice(plan)}
                        </motion.span>
                      </AnimatePresence>
                      {plan.monthlyPrice > 0 && (
                        <div className="pb-1 flex flex-col leading-tight">
                          <span className="text-[10px] font-semibold uppercase text-zinc-400">USD</span>
                          <span className="text-[10px] text-zinc-400">/mo</span>
                        </div>
                      )}
                    </div>

                    <p className="text-[10px] font-medium mb-6 text-zinc-400">
                      {plan.monthlyPrice === 0
                        ? "Free forever"
                        : isYearly
                        ? `Billed $${plan.yearlyPrice} / year`
                        : `or $${plan.yearlyMonthlyEquivalent}/mo billed yearly`}
                    </p>

                    <div className="h-px mb-6 bg-zinc-200" />

                    {/* Features */}
                    <ul className="flex flex-col gap-3 flex-1 mb-5">
                      {plan.features.map((f) =>
                        f.locked ? (
                          <LockedItem key={f.label} label={f.label} />
                        ) : (
                          <li key={f.label} className="flex items-start gap-3">
                            <div className={`mt-0.5 w-4 h-4 shrink-0 rounded-full flex items-center justify-center ${featured ? "bg-blue-600" : "bg-zinc-900"}`}>
                              <Check size={8} className="text-white" />
                            </div>
                            <span className="text-xs leading-relaxed text-zinc-600">
                              {f.label}
                            </span>
                          </li>
                        )
                      )}
                    </ul>

                    {/* Decoy nudge */}
                    {plan.decoyNote && !current && (
                      <p className="text-[10px] text-blue-600 font-medium mb-5 flex items-center gap-1.5">
                        <Zap size={10} /> {plan.decoyNote}
                      </p>
                    )}

                    {/* CTA */}
                    <motion.button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={current || loadingPlan === plan.key}
                      whileHover={{ scale: current ? 1 : 1.02 }}
                      whileTap={{ scale: current ? 1 : 0.98 }}
                      className={`group mt-auto inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-semibold transition-colors duration-200 disabled:opacity-60 ${
                        current
                          ? "bg-zinc-900 text-white cursor-default"
                          : featured
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-zinc-900 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {loadingPlan === plan.key ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Initializing…
                        </>
                      ) : current ? (
                        "Active plan ✓"
                      ) : (
                        <>
                          {plan.cta}
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          )}

          <p className="mt-6 text-center text-xs text-zinc-400">
            All plans billed monthly or yearly (save 17%).{" "}
            <button
              onClick={() => document.getElementById("comparison")?.scrollIntoView({ behavior: "smooth" })}
              className="text-blue-600 hover:underline"
            >
              See full feature breakdown ↓
            </button>
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TRUSTED BY — logo marquee
      ══════════════════════════════════════════════════ */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-24 px-6 bg-white border-b border-zinc-200"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 mb-3">
              Trusted by modern teams
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl mx-auto">
              Join thousands of professionals using Reluno Legal AI every day.
            </p>
          </div>

          <div className="relative">
            <TrustedByMarquee />
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════
          TESTIMONIAL WALL
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <SectionEyebrow>What teams say</SectionEyebrow>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-2xl mx-auto">
              Real results from real legal teams.
            </h2>
          </motion.div>

          <TestimonialWall />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          COMPARISON — "WHY RELUNO"
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 border-b border-zinc-200">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <SectionEyebrow>The difference</SectionEyebrow>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 mb-6">
              Same legal power. A fraction of the cost.
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Traditional legal counsel is essential for complex litigation. But contract review, document drafting, and claim preparation don't require a $400/hr attorney. Reluno handles that layer — instantly, accurately, and at a price accessible to anyone.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-zinc-200 rounded-xl overflow-hidden bg-white"
          >
            <div className="grid grid-cols-3 bg-zinc-50 border-b border-zinc-200">
              <div className="px-5 py-3.5" />
              <div className="px-5 py-3.5 border-l border-zinc-200">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Traditional</p>
              </div>
              <div className="px-5 py-3.5 border-l border-zinc-200">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Reluno</p>
              </div>
            </div>
            {[
              { label: "Cost", traditional: "$300–$500/hr", reluno: "From $29/mo" },
              { label: "Response time", traditional: "Days to weeks", reluno: "Under 2 seconds" },
              { label: "Availability", traditional: "Business hours", reluno: "24/7" },
              { label: "Document review", traditional: "Billed hourly", reluno: "Unlimited queries" },
              { label: "Transparency", traditional: "Opaque billing", reluno: "Flat subscription" },
            ].map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 border-b border-zinc-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-zinc-50/60"}`}
              >
                <div className="px-5 py-4 text-xs font-medium text-zinc-500">{row.label}</div>
                <div className="px-5 py-4 text-xs text-zinc-400 border-l border-zinc-100">{row.traditional}</div>
                <div className="px-5 py-4 text-xs font-semibold text-blue-600 border-l border-zinc-100">{row.reluno}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FULL COMPARISON TABLE
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 border-b border-zinc-200" id="comparison">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <SectionEyebrow>Feature breakdown</SectionEyebrow>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              Everything, side by side.
            </h2>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-zinc-200 rounded-xl overflow-hidden bg-white"
          >
            {/* Header row */}
            <div className="grid grid-cols-[1fr_repeat(3,_140px)] border-b border-zinc-200">
              <div className="px-7 py-5" />
              {plans.map((plan) => (
                <div
                  key={plan.key}
                  className={`py-5 px-4 text-center flex flex-col items-center gap-1 border-l border-zinc-200 ${
                    plan.popular ? "bg-blue-50/60" : ""
                  }`}
                >
                  <span className={`text-xs font-bold uppercase tracking-wider ${plan.popular ? "text-blue-600" : "text-zinc-900"}`}>
                    {plan.name}
                  </span>
                  <span className="text-[10px] font-medium text-zinc-400">
                    {displayPrice(plan)}/mo
                  </span>
                  {isCurrent(plan.key) && (
                    <span className="mt-0.5 text-[9px] bg-zinc-900 text-white px-2 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Sections */}
            {comparisonData.map((section, sIdx) => (
              <React.Fragment key={sIdx}>
                <div className="grid grid-cols-[1fr_repeat(3,_140px)] bg-zinc-50 border-b border-zinc-100">
                  <div className="px-7 py-3 col-span-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">
                      {section.title}
                    </span>
                  </div>
                </div>

                {section.rows.map((row, rIdx) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={rIdx}
                      className="grid grid-cols-[1fr_repeat(3,_140px)] border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors"
                    >
                      <div className="px-7 py-4 flex items-center gap-3">
                        <Icon size={13} className="text-zinc-400 shrink-0" />
                        <span className="text-xs font-medium text-zinc-700">{row.feature}</span>
                      </div>
                      <div className="py-4 px-4 border-l border-zinc-100 flex items-center justify-center">
                        <Cell value={row.free as CellVal} />
                      </div>
                      <div className="py-4 px-4 border-l border-blue-100 bg-blue-50/30 flex items-center justify-center">
                        <Cell value={row.starter as CellVal} highlight />
                      </div>
                      <div className="py-4 px-4 border-l border-zinc-100 flex items-center justify-center">
                        <Cell value={row.pro as CellVal} />
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

            {/* Bottom CTA row */}
            <div className="grid grid-cols-[1fr_repeat(3,_140px)] border-t border-zinc-200 bg-zinc-50">
              <div className="px-7 py-5 flex items-center">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Choose your plan</span>
              </div>
              {plans.map((plan) => (
                <div
                  key={plan.key}
                  className={`py-5 px-4 flex items-center justify-center border-l ${
                    plan.popular ? "border-blue-100 bg-blue-50/50" : "border-zinc-100"
                  }`}
                >
                  <motion.button
                    whileHover={{ scale: isCurrent(plan.key) ? 1 : 1.04 }}
                    whileTap={{ scale: isCurrent(plan.key) ? 1 : 0.96 }}
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isCurrent(plan.key) || loadingPlan === plan.key}
                    className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 disabled:opacity-50 ${
                      isCurrent(plan.key)
                        ? "bg-zinc-900 text-white"
                        : plan.popular
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-zinc-900 text-white hover:bg-blue-600"
                    }`}
                  >
                    {isCurrent(plan.key) ? "Active" : plan.key === "free" ? "Start free" : "Select"}
                  </motion.button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-5">
            {[
              {
                icon: (
                  <div className="h-4 w-4 rounded-full bg-zinc-900 flex items-center justify-center">
                    <Check size={8} className="text-white" />
                  </div>
                ),
                label: "Included",
              },
              {
                icon: (
                  <div className="h-4 w-4 rounded-full bg-zinc-100 flex items-center justify-center">
                    <Minus size={8} className="text-zinc-300" />
                  </div>
                ),
                label: "Not included",
              },
              {
                icon: (
                  <div className="h-4 w-4 rounded-full bg-zinc-100 flex items-center justify-center">
                    <Lock size={8} className="text-zinc-400" />
                  </div>
                ),
                label: "Upgrade to unlock",
              },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                {icon}
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          INFRASTRUCTURE STRIP
      ══════════════════════════════════════════════════ */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="py-16 px-6 bg-zinc-50 border-b border-zinc-200"
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-10">
            Security & infrastructure — all plans
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: "AES-256 encryption", desc: "All data encrypted at rest and in transit" },
              { icon: CheckCircle, label: "Security First Type II", desc: "Independently audited security controls" },
              { icon: Lock, label: "Zero data retention", desc: "Documents never used for training" },
              { icon: Zap, label: "99.9% uptime SLA", desc: "Guaranteed availability for critical work" },
            ].map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex flex-col gap-3"
              >
                <div className="w-9 h-9 rounded-md border border-zinc-200 bg-white flex items-center justify-center">
                  <Icon size={15} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-900 mb-0.5">{label}</p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════
          ENTERPRISE
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 border-b border-zinc-200">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-px bg-zinc-200 border border-zinc-200 rounded-2xl overflow-hidden"
          >
            {/* Left: copy */}
            <div className="bg-zinc-900 p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-7">
                <div className="h-px w-6 bg-blue-400" />
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em]">
                  Enterprise & teams
                </span>
              </div>
              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-tight tracking-tight text-white mb-5">
                Need a custom plan?
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                Built for law firms, legal departments, and growing teams. Custom AI deployments, dedicated onboarding, SSO, advanced compliance controls, and a dedicated account manager.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-10">
                {["Custom AI deployment", "Dedicated account manager", "SSO & compliance controls", "White-glove onboarding"].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                      <Check size={8} className="text-blue-400" />
                    </div>
                    <span className="text-xs text-zinc-400 font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/contact")}
                className="group self-start inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-zinc-900 text-sm font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-200"
              >
                Contact sales
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </div>

            {/* Right: quick stats */}
            <div className="bg-white p-12 flex flex-col justify-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-8">
                Enterprise SLA
              </p>
              <div className="flex flex-col gap-5">
                {[
                  { label: "Security First Type II", val: "Certified" },
                  { label: "AES-256 encryption", val: "All data" },
                  { label: "Uptime guarantee", val: "99.9% SLA" },
                  { label: "Support response", val: "< 4 hours" },
                  { label: "Data residency", val: "CA / US options" },
                  { label: "Sales response", val: "24–48 hours" },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center justify-between border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                    <span className="text-xs text-zinc-500">{label}</span>
                    <span className="text-xs font-semibold text-zinc-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <SectionEyebrow>Common questions</SectionEyebrow>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              Everything you need to know before signing up.
            </h2>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PricingFAQ />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          METRICS STRIP
      ══════════════════════════════════════════════════ */}
      <section className="py-16 px-6 border-b border-zinc-200">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active users", val: "1.2M+" },
              { label: "Uptime", val: "99.99%" },
              { label: "AI response", val: "< 2s" },
              { label: "Encryption", val: "AES-256" },
            ].map(({ label, val }, i) => (
              <motion.div
                key={label}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-1">{label}</p>
                <p className="text-2xl font-bold tracking-tight text-zinc-900">{val}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════════════ */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="border border-zinc-200 rounded-2xl p-16 text-center bg-zinc-50"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-6">
              Get started today
            </p>
            <h2 className="font-serif text-[clamp(2.2rem,5vw,4rem)] leading-tight tracking-tight text-zinc-900 mb-5 max-w-2xl mx-auto">
              Legal intelligence, accessible to everyone.
            </h2>
            <p className="text-sm text-zinc-500 max-w-xl mx-auto leading-relaxed mb-10">
              Join thousands of small business owners, entrepreneurs, and individuals who use Reluno to navigate the legal landscape with confidence — and without a retainer.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/signup")}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Create a free account
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/contact")}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-zinc-200 text-zinc-700 text-sm font-semibold hover:border-zinc-400 hover:bg-white transition-all duration-200"
              >
                Book a demo <ChevronRight size={14} className="text-zinc-400" />
              </motion.button>
            </div>
          </motion.div>

          <p className="mt-10 text-center text-[10px] text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Reluno provides general legal information and AI-assisted document analysis. This does not constitute legal advice. For specific legal matters, consult a qualified attorney licensed in your jurisdiction.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}