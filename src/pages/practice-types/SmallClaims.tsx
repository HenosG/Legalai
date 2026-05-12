// src/pages/practice-types/SmallClaims.tsx
// Reluno – Small Claims practice area page
// Tone: Empowering, practical — "You can do this"

import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import {
  ArrowRight, FileText, Scale, Bell, CheckCircle,
  ChevronRight, AlertCircle, Shield, BarChart3, Clock,
} from "lucide-react";

const jurisdictionLimits = [
  { place: "Ontario", limit: "$35,000" },
  { place: "British Columbia", limit: "$35,000" },
  { place: "California", limit: "$12,500" },
  { place: "New York", limit: "$10,000" },
  { place: "Texas", limit: "$20,000" },
  { place: "Alberta", limit: "$50,000" },
];

const tools = [
  {
    icon: FileText,
    label: "Document generator",
    desc: "Create properly formatted small claims complaints, defendant responses, evidence summaries, and judgment enforcement letters — all structured for your court's specific requirements.",
  },
  {
    icon: Scale,
    label: "Claim tracker",
    desc: "Log every loss with documentation: invoices, contracts, photos, communications. The AI calculates your total damages, separates recoverable from non-recoverable losses, and organizes evidence for presentation.",
  },
  {
    icon: BarChart3,
    label: "Win probability analysis",
    desc: "Reluno analyzes your evidence strength, claim type, and jurisdiction to provide an honest assessment of your case — including what documentation would strengthen your position before filing.",
  },
  {
    icon: Bell,
    label: "Deadline automation",
    desc: "Filing windows, service requirements, response periods, and hearing preparation reminders are automatically tracked and surfaced before they become a problem.",
  },
];

const commonClaims = [
  { type: "Unpaid invoices", example: "Client owes $3,800 for completed website" },
  { type: "Property damage", example: "Neighbour's tree fell on your fence" },
  { type: "Security deposit", example: "Landlord won't return $1,500 deposit" },
  { type: "Defective goods", example: "Laptop arrived non-functional, seller unresponsive" },
  { type: "Contractor dispute", example: "Renovation left unfinished after full payment" },
  { type: "Vehicle damage", example: "Parking lot collision, other driver won't cooperate" },
];

const filingSteps = [
  { n: "01", label: "Establish jurisdiction", desc: "Reluno confirms the correct court based on where the defendant lives or where the dispute arose." },
  { n: "02", label: "Draft the complaint", desc: "Answer guided questions about what happened, who's responsible, and how much you're claiming." },
  { n: "03", label: "Prepare your evidence", desc: "Organize photos, invoices, contracts, and communications into a structured evidence package." },
  { n: "04", label: "File and serve", desc: "Submit your claim, confirm service requirements, and receive hearing preparation guidance." },
];

export default function SmallClaims() {
  return (
    <PageLayout>
      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="h-px w-8 bg-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-[0.25em]">
              Small claims
            </span>
          </div>

          <h1 className="font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.02] tracking-tight text-zinc-900 mb-7 max-w-7xl">
            You don't need a lawyer to win in court.
          </h1>

          <p className="text-lg text-zinc-500 leading-relaxed max-w-2xl mb-10 font-light">
            Small claims court is specifically designed for self-represented individuals. The rules are simplified, the limits are substantial, and the process is accessible — if you know what to file, what to say, and what to bring. Reluno handles all of that, from complaint to hearing day.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Start your claim free
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
            {["Court-ready documents", "Win probability analysis", "Evidence organizer"].map((t) => (
              <span key={t} className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <CheckCircle size={12} className="text-blue-600" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── JURISDICTION LIMITS ── */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
                What you can recover
              </p>
              <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 mb-6">
                Small claims limits by jurisdiction.
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Small claims courts handle disputes ranging from a few thousand dollars to $50,000 in some jurisdictions. The filing fee is typically $75–$250. Reluno automatically applies the correct rules, forms, and procedures for your jurisdiction.
              </p>
            </div>

            <div className="border border-zinc-200 rounded-md overflow-hidden bg-white">
              <div className="px-6 py-3.5 border-b border-zinc-100 bg-zinc-50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Claim limits (approximate)</p>
              </div>
              {jurisdictionLimits.map(({ place, limit }, i) => (
                <div key={place} className={`grid grid-cols-2 px-6 py-3.5 border-b border-zinc-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}`}>
                  <p className="text-xs font-medium text-zinc-600">{place}</p>
                  <p className="text-xs font-semibold text-blue-600">{limit}</p>
                </div>
              ))}
              <div className="px-6 py-3.5 bg-zinc-50 border-t border-zinc-100">
                <p className="text-[10px] text-zinc-400">Reluno covers 35+ North American jurisdictions. Limits change — the AI checks current rules.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMON CLAIMS ── */}
      <section className="py-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              What you can claim
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              Disputes small claims courts handle every day.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-100 border border-zinc-100 rounded-md overflow-hidden">
            {commonClaims.map(({ type, example }) => (
              <div key={type} className="bg-white p-7 hover:bg-zinc-50 transition-colors group">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <p className="text-sm font-semibold text-zinc-900">{type}</p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed pl-4">{example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOLS ── */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              Platform capabilities
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              From first complaint to final judgment.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-200 border border-zinc-200 rounded-md overflow-hidden">
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
      <section className="py-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              Filing process
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              From dispute to filing — without a lawyer.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {filingSteps.map((step, i) => (
              <div key={step.n} className="relative">
                {i < filingSteps.length - 1 && (
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
                  DR
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-900">David R.</p>
                  <p className="text-[10px] text-zinc-400">Small claims plaintiff, California</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed">
                David paid a contractor $6,500 upfront to renovate his basement. The contractor completed about 40% of the work, demanded an additional $3,000 mid-project for "unforeseen materials," and disappeared when David refused. He used Reluno to document every element — original contract, payment receipts, text messages, and 47 photos of the incomplete work. The AI calculated his recoverable damages at $4,800 (based on work not completed minus material costs), drafted a California small claims complaint, and helped him prepare a one-page evidence summary. The judge awarded $4,200. Total time from filing to judgment: 6 weeks.
              </p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-zinc-100">
              {[
                { label: "Paid to contractor", val: "$6,500" },
                { label: "Court judgment", val: "$4,200" },
                { label: "Filing fee", val: "$75" },
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
              You have a strong case — now prove it
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 mb-5 max-w-xl mx-auto">
              Courts reward preparation. Reluno provides it.
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-lg mx-auto mb-9">
              Start building your claim file for free. The free plan includes 5 AI queries and basic case tracking — enough to understand whether you have a case and how to file.
            </p>
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Start your claim
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="flex items-start gap-3 p-5 border border-amber-100 bg-amber-50 rounded-md">
            <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Small claims procedures, limits, and forms vary by jurisdiction. Reluno provides general guidance and document templates. Win probability estimates are based on general patterns and are not guarantees of any specific outcome. Always verify current court requirements directly with your local courthouse before filing.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}