// src/pages/practice-types/FamilyLaw.tsx
// Reluno – Family Law practice area page
// Tone: Warm, empathetic, empowering — the legal process is hard enough

import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import DisclaimerBox from "@/components/DisclaimerBox";
import {
  ArrowRight, FileText, Calendar, Users, CheckCircle,
  Heart, Lock, ChevronRight, AlertCircle, Shield,
} from "lucide-react";

const tools = [
  {
    icon: FileText,
    label: "Document generator",
    desc: "Create divorce petition templates, separation agreements, parenting plans, child support worksheets, and custody modification requests — all formatted to provincial or state court standards.",
  },
  {
    icon: Calendar,
    label: "Deadline & workflow automation",
    desc: "Court dates, mandatory cooling-off periods, financial disclosure deadlines, and co-parenting schedule notifications are automatically tracked and surfaced as reminders.",
  },
  {
    icon: Users,
    label: "AI question helper",
    desc: "Ask 'How is child support calculated in Ontario?' or 'What factors does a court consider for primary custody?' and receive plain-language explanations with jurisdiction-specific context.",
  },
  {
    icon: Lock,
    label: "Secure document vault",
    desc: "Store financial disclosures, property appraisals, custody agreements, and court correspondence in one encrypted, organized location — accessible anywhere, always audit-ready.",
  },
];

const practiceAreas = [
  { area: "Divorce & separation", detail: "Uncontested and contested proceedings, separation agreements, property division" },
  { area: "Child custody", detail: "Parenting plans, primary residence, joint custody structures, relocation requests" },
  { area: "Child support", detail: "Calculation worksheets, deviation arguments, modification filings" },
  { area: "Spousal support", detail: "Duration analysis, amount calculation, SSAG guidelines interpretation" },
  { area: "Property division", detail: "Equalization payment calculations, exempt property identification, valuation dates" },
  { area: "Domestic agreements", detail: "Cohabitation agreements, prenuptial agreements, marriage contracts" },
];

const steps = [
  { n: "01", label: "Describe your situation", desc: "Provide basic details — length of marriage, children, assets, and what outcome you're working toward." },
  { n: "02", label: "Receive a structured plan", desc: "Reluno maps the required steps, documents, and deadlines for your specific jurisdiction and circumstances." },
  { n: "03", label: "Generate documents", desc: "Produce court-ready forms and formal letters from guided inputs — no legal drafting experience required." },
  { n: "04", label: "Track and resolve", desc: "Monitor the matter through to final order, with automated reminders and a complete case history." },
];

export default function FamilyLaw() {
  return (
    <PageLayout>
      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="h-px w-8 bg-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-[0.25em]">
              Family law
            </span>
          </div>

          <h1 className="font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.02] tracking-tight text-zinc-900 mb-7 max-w-7xl">
            Navigate one of life's hardest chapters with clarity.
          </h1>

          <p className="text-lg text-zinc-500 leading-relaxed max-w-2xl mb-10 font-light">
            Family law proceedings are emotionally exhausting. The paperwork, deadlines, and legal terminology shouldn't be an additional burden. Reluno handles the administrative and documentary complexity so you can focus on what actually matters — your family, your finances, and your future.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Get started — it's free
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
            {["Private & encrypted", "No credit card required", "Cancel anytime"].map((t) => (
              <span key={t} className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <Shield size={12} className="text-blue-600" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRACTICE AREAS GRID ── */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              Coverage
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              Every dimension of family law, in one platform.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 rounded-md overflow-hidden">
            {practiceAreas.map(({ area, detail }) => (
              <div key={area} className="bg-white p-7 hover:bg-zinc-50 transition-colors group">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <p className="text-sm font-semibold text-zinc-900">{area}</p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed pl-4">{detail}</p>
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
              Tools that handle the complexity, so you don't have to.
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
              The process
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              Structured support, every step of the way.
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

      {/* ── TESTIMONIAL ── */}
      <section className="py-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="border border-zinc-200 rounded-md p-10 bg-white">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 shrink-0">
                MR
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-900">Michael R.</p>
                <p className="text-[10px] text-zinc-400">Custody matter, British Columbia</p>
              </div>
            </div>
            <p className="text-base text-zinc-600 leading-relaxed max-w-3xl">
              "Going through a custody dispute while working full time and being the primary caregiver felt impossible. Reluno built me a complete parenting plan template in 15 minutes that my ex's lawyer said was 'professionally drafted.' The deadline reminders kept me from missing the financial disclosure window — which would have set me back months. I spent $29 a month instead of the $8,000 retainer my lawyer quoted."
            </p>
            <div className="mt-8 pt-6 border-t border-zinc-100 grid grid-cols-3 gap-6">
              {[
                { label: "Retainer quoted", val: "$8,000" },
                { label: "Total spent on Reluno", val: "$87" },
                { label: "Months to resolution", val: "4 mo." },
              ].map(({ label, val }) => (
                <div key={label}>
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
              Take the first step
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 mb-5 max-w-xl mx-auto">
              You deserve clarity in a complicated process.
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-lg mx-auto mb-9">
              Start free. Generate your first document, map your jurisdiction's requirements, and build a case timeline — all before you pay a cent.
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
              Reluno provides general legal information and AI-generated document templates. This is not legal advice and does not create an attorney-client relationship. Family law matters vary significantly by jurisdiction. For complex custody disputes, domestic violence situations, or contested proceedings involving significant assets, consult a qualified family law attorney.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}