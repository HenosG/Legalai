// src/pages/practice-types/ContractLaw.tsx
// Reluno – Contract Law practice area page
// Target: Freelancers, small businesses, entrepreneurs

import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import {
  ArrowRight, FileText, Bell, BarChart3, CheckCircle,
  ChevronRight, AlertCircle, Shield, Zap, ScanLine,
} from "lucide-react";

const contractTypes = [
  { name: "NDA / Confidentiality agreement", desc: "Mutual and one-way, with carve-outs and remedy clauses" },
  { name: "Service agreement", desc: "Scope of work, deliverables, payment terms, IP ownership" },
  { name: "Freelance / contractor agreement", desc: "Independent contractor status, kill fees, revision limits" },
  { name: "Employment agreement", desc: "At-will provisions, restrictive covenants, termination triggers" },
  { name: "Vendor / supplier agreement", desc: "Lead times, liability caps, force majeure, exclusivity" },
  { name: "Demand letter", desc: "Formal notice of breach, cure periods, damages claimed" },
  { name: "Settlement agreement", desc: "Release of claims, confidentiality, payment schedules" },
  { name: "Letter of intent", desc: "Non-binding framework for deals, acquisitions, partnerships" },
];

const tools = [
  {
    icon: FileText,
    label: "Document generator",
    desc: "Build professional contracts from structured inputs. Every template is jurisdiction-aware, covers standard risk allocations, and is formatted for electronic signature platforms.",
  },
  {
    icon: ScanLine,
    label: "PDF contract analysis",
    desc: "Upload a contract you've received. The AI identifies unfavorable clauses, missing protections, vague terms, and common red flags — clause by clause, in plain language.",
  },
  {
    icon: Bell,
    label: "Renewal & expiration tracking",
    desc: "Never accidentally let a contract auto-renew on unfavorable terms. Reluno tracks expiration dates and sends reminders 30, 14, and 7 days before key deadlines.",
  },
  {
    icon: BarChart3,
    label: "Dispute risk analytics",
    desc: "Reluno analyzes your contract's language and flags provisions statistically associated with disputes — giving you the opportunity to negotiate before you sign.",
  },
];

const redFlags = [
  ["Unlimited liability clause", "Exposes you to damages far exceeding the contract value"],
  ["Unilateral amendment rights", "Allows the other party to change terms without your consent"],
  ["Automatic renewal", "Locks you into another term unless cancelled in a narrow window"],
  ["Broad IP assignment", "Transfers rights to work you've created independently"],
  ["One-sided indemnification", "Requires you to cover the other party's legal costs"],
  ["Missing payment terms", "No late fee, no interest — no leverage when invoices go unpaid"],
];

const steps = [
  { n: "01", label: "Choose your contract type", desc: "Select from 50+ templates or describe your situation in plain language." },
  { n: "02", label: "Provide key details", desc: "Answer guided questions about parties, scope, payment, and risk allocation." },
  { n: "03", label: "Review the AI draft", desc: "Receive a complete contract with plain-language explanations of each clause." },
  { n: "04", label: "Export and execute", desc: "Download a court-ready PDF or Word document, ready for electronic signature." },
];

export default function ContractLaw() {
  return (
    <PageLayout>
      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="h-px w-8 bg-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-[0.25em]">
              Contract law
            </span>
          </div>

          <h1 className="font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.02] tracking-tight text-zinc-900 mb-7 max-w-7xl">
            Contracts that actually protect you.
          </h1>

          <p className="text-lg text-zinc-500 leading-relaxed max-w-2xl mb-10 font-light">
            Most contract disputes aren't about bad intentions — they're about vague language, missing clauses, and provisions that seemed fine until they weren't. Reluno helps freelancers, entrepreneurs, and small businesses draft airtight agreements and analyze contracts before signing, without the $350/hr bill.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Generate your first contract free
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-zinc-200 text-zinc-700 text-sm font-semibold hover:border-zinc-400 hover:bg-zinc-50 transition-all"
            >
              See plans <ChevronRight size={14} className="ml-1" />
              </Link>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {["50+ contract templates", "PDF risk analysis on Pro", "Export to Word & PDF"].map((t) => (
              <span key={t} className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <CheckCircle size={12} className="text-blue-600" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTRACT TYPES ── */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              Template library
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              50+ contract types, all professionally structured.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200 border border-zinc-200 rounded-md overflow-hidden">
            {contractTypes.map(({ name, desc }) => (
              <div key={name} className="bg-white p-6 hover:bg-zinc-50 transition-colors group">
                <div className="flex items-start gap-2.5 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <p className="text-sm font-semibold text-zinc-900">{name}</p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed pl-4">{desc}</p>
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
              Draft, analyze, and track — all in one environment.
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

      {/* ── RED FLAGS ── */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
                What the AI catches
              </p>
              <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 mb-6">
                Red flags most people miss on first read.
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed">
                The clauses that cause the most pain are often buried in boilerplate, written in language that sounds neutral. Reluno's PDF analysis engine flags every provision associated with elevated dispute risk — before you sign.
              </p>
            </div>

            <div className="border border-zinc-200 rounded-md overflow-hidden bg-white">
              {redFlags.map(([flag, explanation], i) => (
                <div key={flag} className={`px-6 py-4 border-b border-zinc-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-zinc-50/60"}`}>
                  <div className="flex items-start gap-3">
                    <Zap size={12} className="text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 mb-0.5">{flag}</p>
                      <p className="text-[11px] text-zinc-400">{explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              How it works
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              From blank page to signed document in minutes.
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
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="border border-zinc-200 rounded-md overflow-hidden bg-white">
            <div className="p-8 border-b border-zinc-100">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 shrink-0">
                  JL
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-900">Jessica L.</p>
                  <p className="text-[10px] text-zinc-400">Freelance graphic designer, Toronto</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed">
                A client refused to pay $4,200 for a completed brand identity project, claiming the scope was "substantially different" from what was agreed. Jessica uploaded the original agreement to Reluno's PDF analysis tool. The AI identified that the contract lacked a written change-order clause — meaning verbal scope expansions weren't captured anywhere. It then generated a demand letter citing the original deliverables list, the client's email approvals, and the relevant provisions of Ontario contract law. The client paid $3,800 within ten days rather than risk small claims court.
              </p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-zinc-100">
              {[
                { label: "Invoice outstanding", val: "$4,200" },
                { label: "Recovered", val: "$3,800" },
                { label: "Lawyer consultation avoided", val: "$0" },
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

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="border border-zinc-200 rounded-md p-14 text-center bg-zinc-50 mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              Protect your work
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 mb-5 max-w-xl mx-auto">
              A good contract is the cheapest insurance you'll ever buy.
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-lg mx-auto mb-9">
              Generate your first contract free. Upgrade to access PDF risk analysis and the full export suite when you're ready to handle everything professionally.
            </p>
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Start for free
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="flex items-start gap-3 p-5 border border-amber-100 bg-amber-50 rounded-md">
            <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Reluno provides AI-generated contract templates for general informational purposes. Templates may require modifications for your specific jurisdiction, industry, or circumstances. For high-value agreements, regulated industries, or complex transactions, have a licensed attorney review the final document before execution.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}