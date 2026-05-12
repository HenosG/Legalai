// src/pages/Index.tsx
// Design direction: Enterprise Minimalist — Anthropic/Scale AI DNA
// Palette: Pure white + zinc-900 text + blue-600 accent. Zero gradients, zero glow.
// Typography: DM Serif Display for display headings (loaded via @import), DM Sans for body
// Spacing: Generous. Deliberate. Every section breathes.

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight, MessageSquare, FileText, BarChart3,
  Bell, Calendar, Download, ScanLine, FolderKanban,
  Shield, Zap, Clock, DollarSign, Check,
  Brain, Globe, Lock, ChevronRight,
} from "lucide-react";

// ─── Feature grid data ────────────────────────────────────────────────────────
const features = [
  {
    icon: MessageSquare,
    label: "AI Query Engine",
    desc: "Instant legal research across 40+ practice areas. Contract review, dispute analysis, tenant rights — answered in seconds.",
    tier: "Core",
  },
  {
    icon: ScanLine,
    label: "PDF risk analysis",
    desc: "Upload any contract. Receive clause-level risk scores, party extraction, and plain-English summaries.",
    tier: "Pro",
  },
  {
    icon: FolderKanban,
    label: "Case management",
    desc: "Structured matter tracking with priority queues, status milestones, and case history archiving.",
    tier: "Core",
  },
  {
    icon: FileText,
    label: "Document generation",
    desc: "Produce NDAs, employment agreements, demand letters, and custom contracts from structured inputs.",
    tier: "Core",
  },
  {
    icon: BarChart3,
    label: "Workload intelligence",
    desc: "Resolution velocity metrics, practice-area breakdowns, and predictive caseload modeling.",
    tier: "Pro",
  },
  {
    icon: Download,
    label: "Professional export",
    desc: "Court-ready PDFs and editable Word documents with consistent formatting and signature readiness.",
    tier: "Pro",
  },
  {
    icon: Bell,
    label: "Smart reminders",
    desc: "Deadline tracking and task management tied directly to active matters and calendar events.",
    tier: "Starter",
  },
  {
    icon: Calendar,
    label: "Calendar sync",
    desc: "Bidirectional Google Calendar integration. Hearings, filings, and client meetings — all in one view.",
    tier: "Starter",
  },
];

// ─── Infrastructure pillars ───────────────────────────────────────────────────
const infrastructure = [
  { icon: Shield,      label: "AES-256 encryption",   desc: "All data encrypted at rest and in transit." },
  { icon: Globe,       label: "SOC 2 Type II",         desc: "Independently audited security controls."   },
  { icon: Lock,        label: "Zero data retention",   desc: "Your documents are never used for training." },
  { icon: Zap,         label: "99.9% uptime SLA",      desc: "Guaranteed availability for critical work."  },
];

// ─── Comparison ───────────────────────────────────────────────────────────────
const comparisonRows = [
  { label: "Cost",           traditional: "$300–$500/hr",  reluno: "From $29/mo"        },
  { label: "Response time",  traditional: "Days to weeks",  reluno: "Under 2 seconds"    },
  { label: "Availability",   traditional: "Business hours", reluno: "24/7"               },
  { label: "Document review",traditional: "Billed hourly",  reluno: "Unlimited queries"  },
  { label: "Transparency",   traditional: "Opaque billing", reluno: "Flat subscription"  },
];

// ─── Process steps ────────────────────────────────────────────────────────────
const steps = [
  { n: "01", label: "Describe your matter",   desc: "Tell Reluno about your legal situation in plain language. No legal training required." },
  { n: "02", label: "Receive analysis",        desc: "The AI returns structured guidance, relevant precedents, and flagged risk areas instantly." },
  { n: "03", label: "Generate documents",      desc: "Produce a court-ready document or formal letter directly from the analysis." },
  { n: "04", label: "Track and resolve",       desc: "Log the matter in Case Vault and monitor progress through to resolution." },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "Reluno replaced our $400/hr document review process. Our team now spends time on strategy, not paperwork.",
    name: "Sarah K.",
    title: "Managing Partner",
    initials: "SK",
  },
  {
    quote: "The PDF analysis caught three unfavorable indemnification clauses our team had missed. It paid for itself on day one.",
    name: "Marcus T.",
    title: "General Counsel",
    initials: "MT",
  },
  {
    quote: "As a solo practitioner, I finally have the same intelligence infrastructure as a full firm. The case tracking alone is transformative.",
    name: "Priya N.",
    title: "Solo Practitioner, Family Law",
    initials: "PN",
  },
];

// ══════════════════════════════════════════════════════════════════════════════
export default function Index() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Google Fonts — DM Serif Display + DM Sans */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        .font-display { font-family: 'DM Serif Display', serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }

        * { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, .display { font-family: 'DM Serif Display', serif; }

        .fade-up {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .hero-animate {
          animation: fadeSlideUp 0.7s ease forwards;
          opacity: 0;
        }
        .hero-animate:nth-child(1) { animation-delay: 0.05s; }
        .hero-animate:nth-child(2) { animation-delay: 0.15s; }
        .hero-animate:nth-child(3) { animation-delay: 0.25s; }
        .hero-animate:nth-child(4) { animation-delay: 0.35s; }
        .hero-animate:nth-child(5) { animation-delay: 0.45s; }
      `}</style>

      <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
        <Navbar />

        {/* ══════════════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════════════ */}
        <section className="pt-32 pb-28 px-6 border-b border-zinc-100">
          <div className="max-w-7xl mx-auto">

            {/* Eyebrow */}
            <div className="hero-animate inline-flex items-center gap-2 mb-10">
              <div className="h-px w-8 bg-blue-600" />
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-[0.25em]">
                Legal AI Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="hero-animate font-display text-[clamp(3rem,7vw,6rem)] leading-[1.02] tracking-tight text-zinc-900 mb-8 max-w-7xl">
              The operating system for modern legal work.
            </h1>

            {/* Sub */}
            <p className="hero-animate text-lg text-zinc-500 leading-relaxed max-w-2xl mb-12 font-light">
              Reluno integrates advanced legal synthesis and document intelligence into a single, secure environment — giving small businesses and individuals the same capabilities as a Fortune 500 legal team.
            </p>

            {/* CTAs */}
            <div className="hero-animate flex flex-col sm:flex-row items-start gap-3 mb-16">
              <button
                onClick={() => navigate("/signup")}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Get started free
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
              <button
                onClick={() => navigate("/pricing")}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md border border-zinc-200 text-zinc-700 text-sm font-semibold hover:border-zinc-400 hover:bg-zinc-50 transition-all duration-200"
              >
                View pricing
                <ChevronRight size={14} className="ml-1" />
              </button>
            </div>

            {/* Trust strip */}
            <div className="hero-animate flex flex-wrap items-center gap-x-8 gap-y-3">
              {[
                "No credit card required",
                "SOC 2 compliant",
                "Cancel anytime",
                "AES-256 encryption",
              ].map((item) => (
                <span key={item} className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                  <Check size={13} className="text-blue-600 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            INFRASTRUCTURE & SECURITY
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-16 px-6 bg-zinc-50 border-b border-zinc-100">
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-10">
              Infrastructure & security
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {infrastructure.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex flex-col gap-3">
                    <div className="w-9 h-9 rounded-md border border-zinc-200 bg-white flex items-center justify-center">
                      <Icon size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 mb-0.5">{item.label}</p>
                      <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            FEATURE GRID
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-28 px-6 border-b border-zinc-100">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
                Platform capabilities
              </p>
              <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-tight tracking-tight text-zinc-900 max-w-2xl">
                Everything your practice needs, unified.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-100 border border-zinc-100 rounded-md overflow-hidden">
              {features.map((feat) => {
                const Icon = feat.icon;
                const tierColor =
                  feat.tier === "Pro"     ? "text-blue-600 bg-blue-50"  :
                  feat.tier === "Starter" ? "text-emerald-600 bg-emerald-50" :
                  "text-zinc-500 bg-zinc-100";

                return (
                  <div
                    key={feat.label}
                    className="bg-white p-7 flex flex-col gap-5 hover:bg-zinc-50 transition-colors duration-150 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-md border border-zinc-200 flex items-center justify-center group-hover:border-blue-200 transition-colors">
                        <Icon size={16} className="text-zinc-500 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${tierColor}`}>
                        {feat.tier}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 mb-1.5">{feat.label}</p>
                      <p className="text-xs text-zinc-400 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-28 px-6 bg-zinc-50 border-b border-zinc-100">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
                How it works
              </p>
              <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
                From question to resolution in minutes.
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <div key={step.n} className="relative">
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-5 left-[calc(100%_-_16px)] w-full h-px bg-zinc-200 z-0" />
                  )}
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-md border border-zinc-200 bg-white flex items-center justify-center mb-5">
                      <span className="text-[11px] font-bold text-blue-600 font-mono">{step.n}</span>
                    </div>
                    <p className="text-sm font-semibold text-zinc-900 mb-2">{step.label}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            COMPARISON TABLE
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-28 px-6 border-b border-zinc-100">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
                  The difference
                </p>
                <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-tight tracking-tight text-zinc-900 mb-6">
                  Same legal power. A fraction of the cost.
                </h2>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Traditional legal counsel is essential for complex litigation. But the vast majority of legal work — contract review, document drafting, basic research — doesn't require a $400/hr attorney. Reluno handles that layer.
                </p>
              </div>

              <div className="border border-zinc-200 rounded-md overflow-hidden">
  {/* The Header Row container */}
  <div className="grid grid-cols-3 bg-zinc-50 border-b border-zinc-200">
    {/* Column 1: Feature */}
    <div className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
      Feature
    </div>
    {/* Column 2: Traditional (MUST be outside the div above) */}
    <div className="px-5 py-3.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-l border-zinc-200">
      Traditional
    </div>
    {/* Column 3: Reluno */}
    <div className="px-5 py-3.5 text-[10px] font-bold text-blue-600 uppercase tracking-widest border-l border-zinc-200">
      Reluno
    </div>
  </div> {/* This closes the header row */}

{/* The Data Rows */}
{comparisonRows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-3 border-b border-zinc-100 last:border-0 ${
                i % 2 === 0 ? "bg-white" : "bg-zinc-50/60"
              }`}
            >
              <div className="px-5 py-4 text-xs font-medium text-zinc-500">{row.label}</div>
              <div className="px-5 py-4 text-xs text-zinc-400 border-l border-zinc-100">{row.traditional}</div>
              <div className="px-5 py-4 text-xs font-semibold text-blue-600 border-l border-zinc-100">{row.reluno}</div>
            </div>
          ))}
        </div> {/* 1. Closes the overflow-hidden border box */}
      </div> {/* 2. Closes the max-w-7xl column container */}
    </div> {/* 3. Closes the inner div of the comparison section */}
  </section> {/* 4. Closes the Comparison Section */}

  {/* ══════════════════════════════════════════════════════════════════
      TESTIMONIALS
  ══════════════════════════════════════════════════════════════════ */}
  <section className="py-28 px-6 bg-zinc-50 border-b border-zinc-100">
    <div className="max-w-7xl mx-auto">
      <div className="mb-16">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
          From practitioners
        </p>
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-tight tracking-tight text-zinc-900">
          Used by professionals who demand precision.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-white border border-zinc-200 rounded-md p-8 flex flex-col justify-between gap-8 hover:border-blue-200 transition-colors duration-200"
          >
            <p className="text-sm text-zinc-600 leading-relaxed">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-3 pt-5 border-t border-zinc-100">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 shrink-0">
                {t.initials}
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-900">{t.name}</p>
                <p className="text-[10px] text-zinc-400">{t.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

        {/* ══════════════════════════════════════════════════════════════════
            PRICING TEASER
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-28 px-6 border-b border-zinc-100">
          <div className="max-w-7xl mx-auto">
            <div className="mb-14">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
                Simple pricing
              </p>
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-tight tracking-tight text-zinc-900 mb-4">
                Start free. Scale when you need to.
              </h2>
              <p className="text-sm text-zinc-500 max-w-xl leading-relaxed">
                No contracts. No hidden fees. Cancel any time. Every plan includes AES-256 encryption and full platform access.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  name: "Free",
                  price: "$0",
                  period: "forever",
                  desc: "Explore AI-powered legal guidance at no cost.",
                  features: ["5 AI queries/month", "Basic document templates", "Case tracking", "Community support"],
                  cta: "Get started",
                  highlight: false,
                },
                {
                  name: "Starter",
                  price: "$29",
                  period: "per month",
                  desc: "Everything an individual needs to manage legal matters.",
                  features: ["Unlimited AI queries", "Advanced document generator", "Smart reminders", "Calendar integration", "5 GB document vault"],
                  cta: "Get Starter",
                  highlight: true,
                },
                {
                  name: "Pro",
                  price: "$99",
                  period: "per month",
                  desc: "Maximum power for small firms and serious practitioners.",
                  features: ["Everything in Starter", "PDF risk analysis", "Professional export suite", "Advanced analytics", "24/7 priority support"],
                  cta: "Get Pro",
                  highlight: false,
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-md p-8 flex flex-col gap-7 ${
                    plan.highlight
                      ? "border-2 border-blue-600 bg-blue-50/30"
                      : "border border-zinc-200 bg-white"
                  }`}
                >
                  <div>
                    {plan.highlight && (
                      <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-2 py-0.5 rounded-sm mb-3">
                        Most popular
                      </span>
                    )}
                    <p className="text-sm font-semibold text-zinc-900 mb-1">{plan.name}</p>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-3xl font-bold text-zinc-900 tracking-tight">{plan.price}</span>
                      <span className="text-xs text-zinc-400">{plan.period}</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">{plan.desc}</p>
                  </div>

                  <ul className="flex flex-col gap-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-xs text-zinc-600">
                        <Check size={13} className="text-blue-600 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => navigate("/pricing")}
                    className={`w-full py-3 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                      plan.highlight
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs text-zinc-400 text-center">
              All plans billed monthly or yearly (save 17%).{" "}
              <button onClick={() => navigate("/pricing")} className="text-blue-600 hover:underline">
                See full feature breakdown →
              </button>
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            CTA
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="border border-zinc-200 rounded-md p-16 text-center bg-zinc-50">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-6">
                Get started today
              </p>
              <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-tight tracking-tight text-zinc-900 mb-5 max-w-2xl mx-auto">
                Legal intelligence, accessible to everyone.
              </h2>
              <p className="text-sm text-zinc-500 max-w-xl mx-auto leading-relaxed mb-10">
                Join thousands of small business owners, entrepreneurs, and individuals who use Reluno to navigate the legal landscape with confidence — and without a retainer.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => navigate("/signup")}
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  Create a free account
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md border border-zinc-200 text-zinc-700 text-sm font-semibold hover:border-zinc-400 hover:bg-white transition-all duration-200"
                >
                  Book a demo
                </button>
              </div>
            </div>

            {/* Legal disclaimer */}
            <p className="mt-10 text-center text-[10px] text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Reluno provides general legal information and AI-assisted document analysis. This does not constitute legal advice. For specific legal matters, consult a qualified attorney licensed in your jurisdiction.
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}