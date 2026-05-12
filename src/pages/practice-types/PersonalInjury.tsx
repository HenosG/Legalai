// src/pages/practice-types/PersonalInjury.tsx
// Reluno – Personal Injury practice area page
// Design: Enterprise Minimalist — Anthropic/Scale AI DNA
// Sentence-case headers, DM Serif Display + DM Sans, blue-600 accent

import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import DisclaimerBox from "@/components/DisclaimerBox";
import {
  ArrowRight, FileText, BarChart3, Clock, CheckCircle,
  ScanLine, Shield, Zap, ChevronRight, AlertCircle,
} from "lucide-react";

const tools = [
  {
    icon: ScanLine,
    label: "AI query engine",
    desc: "Ask questions in plain language — 'How is pain and suffering calculated?' or 'What is a fair settlement for a rear-end collision?' — and receive structured, jurisdiction-aware answers in seconds.",
  },
  {
    icon: BarChart3,
    label: "Claim tracker",
    desc: "Log every medical bill, missed shift, and piece of evidence. The platform automatically tallies your damages, flags missing documentation, and projects your total claim value in real time.",
  },
  {
    icon: Clock,
    label: "Deadline automation",
    desc: "Statutes of limitations are merciless. Reluno maps every critical deadline — from initial notice requirements to filing windows — and surfaces them as calendar reminders and priority tasks.",
  },
  {
    icon: FileText,
    label: "Document generator",
    desc: "Produce demand letters, medical records release authorizations, settlement proposals, and evidence summaries. Every document uses professional legal language that insurance adjusters take seriously.",
  },
];

const steps = [
  { n: "01", label: "Describe the incident", desc: "Tell Reluno what happened, where, and when. No legal training required — plain language is fine." },
  { n: "02", label: "Build your evidence file", desc: "Upload photos, bills, wage statements, and correspondence. The AI organizes and cross-references everything automatically." },
  { n: "03", label: "Understand your claim value", desc: "Receive an AI-estimated range for economic and non-economic damages, benchmarked against comparable cases in your jurisdiction." },
  { n: "04", label: "Send a professional demand", desc: "Generate a demand letter with accurate totals, policy references, and deadline language — all in one click." },
];

const wins = [
  "Average insurance settlement offers increase after a well-documented demand letter",
  "Never miss a statute of limitations with automated deadline tracking",
  "Reduce back-and-forth with adjusters using organized, timestamped evidence files",
  "Understand bad-faith tactics before an insurer tries to use them on you",
];

export default function PersonalInjury() {
  return (
    <PageLayout>
      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="h-px w-8 bg-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-[0.25em]">
              Personal injury
            </span>
          </div>

          <h1 className="font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.02] tracking-tight text-zinc-900 mb-7 max-w-7xl">
            The playing field, leveled.
          </h1>

          <p className="text-lg text-zinc-500 leading-relaxed max-w-2xl mb-10 font-light">
            Insurance companies employ teams of adjusters, attorneys, and data scientists whose sole job is to minimize what they pay you. Reluno gives individuals the same analytical infrastructure — evidence organization, claim valuation, deadline tracking, and professional documentation — without a $400/hr retainer.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Start tracking your claim free
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-zinc-200 text-zinc-700 text-sm font-semibold hover:border-zinc-400 hover:bg-zinc-50 transition-all"
            >
              View pricing <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {["No credit card required", "SOC 2 compliant", "AES-256 encryption"].map((t) => (
              <span key={t} className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <CheckCircle size={12} className="text-blue-600" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              Why this matters
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 mb-6">
              Insurance companies are not on your side.
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed mb-5">
              From car accidents to slip-and-falls to medical malpractice, the process of seeking compensation is deliberately complex. Adjusters are trained to contact you quickly, before you understand your rights, and to obtain recorded statements that minimize your claim.
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Professional documentation changes the dynamic. When your demand letter cites specific statutes, attaches organized evidence, and arrives with accurate damage totals, insurers respond differently. Reluno helps you build that kind of file from day one.
            </p>
          </div>

          <div className="border border-zinc-200 rounded-md overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">What unrepresented claimants miss</p>
            </div>
            {[
              ["Notice deadlines", "Many claims require formal notice within 30–90 days"],
              ["Future damages", "Medical costs, reduced earning capacity, long-term care"],
              ["Non-economic damages", "Pain, suffering, emotional distress — often the largest component"],
              ["Bad-faith indicators", "Unreasonable delays, lowball offers, misleading communications"],
              ["Documentation gaps", "Missing incident reports, surveillance gaps, unsigned authorizations"],
            ].map(([item, note], i) => (
              <div key={item} className={`px-6 py-4 border-b border-zinc-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-zinc-50/60"}`}>
                <p className="text-xs font-semibold text-zinc-900 mb-0.5">{item}</p>
                <p className="text-[11px] text-zinc-400">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOLS ── */}
      <section className="py-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              Platform capabilities
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              Everything your claim needs, in one place.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-100 border border-zinc-100 rounded-md overflow-hidden">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div key={tool.label} className="bg-white p-8 flex flex-col gap-4 hover:bg-zinc-50 transition-colors group">
                  <div className="w-9 h-9 rounded-md border border-zinc-200 flex items-center justify-center group-hover:border-blue-200 transition-colors">
                    <Icon size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 mb-2">{tool.label}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">{tool.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              How it works
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              From incident to settlement, step by step.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.n} className="relative">
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

      {/* ── CASE STUDY ── */}
      <section className="py-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              In practice
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              Real outcomes for real people.
            </h2>
          </div>

          <div className="border border-zinc-200 rounded-md overflow-hidden bg-white">
            <div className="p-8 border-b border-zinc-100">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 shrink-0">
                  SK
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-900">Sarah K.</p>
                  <p className="text-[10px] text-zinc-400">Slip-and-fall claimant, Ontario</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed">
                After a slip-and-fall at a grocery store left her with a fractured wrist and six weeks of missed work, Sarah was offered $3,200 by the store's insurer — a figure they called "full and fair settlement." She used Reluno to document her injuries with dated photographs, log every medical invoice, and calculate her actual damages: $14,800 in medical costs, lost wages, and projected physiotherapy. The demand letter Reluno generated cited the relevant provincial legislation, included a damage schedule, and arrived with a 21-day response deadline. The insurer settled at $13,500 within two weeks — $10,300 more than the original offer. Total Reluno cost: $29.
              </p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-zinc-100">
              {[
                { label: "Original offer", val: "$3,200" },
                { label: "Settlement reached", val: "$13,500" },
                { label: "Reluno plan cost", val: "$29/mo" },
              ].map(({ label, val }) => (
                <div key={label} className="px-6 py-5 text-center">
                  <p className="text-lg font-bold text-zinc-900 mb-1">{val}</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WINS ── */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
            What changes
          </p>
          <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-2xl mb-12">
            The practical advantages of a structured claim.
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {wins.map((win) => (
              <div key={win} className="flex items-start gap-4 bg-white border border-zinc-200 rounded-md p-6">
                <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle size={12} className="text-blue-600" />
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed">{win}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER + CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="border border-zinc-200 rounded-md p-14 text-center bg-zinc-50 mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              Start today — it's free
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 mb-5 max-w-xl mx-auto">
              Your claim deserves the same rigor as theirs.
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-lg mx-auto mb-9">
              Start building your claim file today at no cost. Upgrade to unlock unlimited AI queries, PDF analysis, and professional document export when you're ready to send.
            </p>
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Create your free account
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="flex items-start gap-3 p-5 border border-amber-100 bg-amber-50 rounded-md">
            <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Reluno provides general legal information and AI-assisted document generation. This does not constitute legal advice. For complex litigation or serious injuries, consult a qualified personal injury attorney licensed in your jurisdiction.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}