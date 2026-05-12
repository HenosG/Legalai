// src/pages/practice-types/LandlordTenant.tsx
// Reluno – Landlord-Tenant practice area page
// Balanced: serves both landlords AND tenants

import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import {
  ArrowRight, FileText, DollarSign, Bell, CheckCircle,
  ChevronRight, AlertCircle, Shield, Home, Scale,
} from "lucide-react";

const landlordTools = [
  { label: "Lease addendum generator", desc: "Pet policies, parking amendments, move-out condition clauses" },
  { label: "Non-payment notice", desc: "N4/N5 notices and demand letters formatted for your province or state" },
  { label: "Eviction documentation", desc: "Structured eviction packages with proper notice periods and cause requirements" },
  { label: "Rent increase notice", desc: "Guideline-compliant rent increase letters with proper lead times" },
];

const tenantTools = [
  { label: "Repair demand letter", desc: "Formally document habitability issues with statutory language" },
  { label: "Security deposit claim", desc: "Itemized dispute letter with damage/wear-and-tear breakdown" },
  { label: "Illegal entry complaint", desc: "Document and formally dispute landlord access violations" },
  { label: "Lease review summary", desc: "AI-generated plain-language summary of every clause in your lease" },
];

const tools = [
  {
    icon: FileText,
    label: "Document generator",
    desc: "From eviction notices to repair demand letters, every document is formatted for your jurisdiction, includes proper statutory language, and can be exported as a court-ready PDF.",
  },
  {
    icon: DollarSign,
    label: "Claim tracker",
    desc: "Log unpaid rent, repair costs, security deposit deductions, or unauthorized charges. The AI calculates running totals and maps your documentation to the relevant legal standard.",
  },
  {
    icon: Bell,
    label: "Automated reminders",
    desc: "Never miss a rent payment window, notice response deadline, or rental board filing date. Reluno tracks every time-sensitive obligation in your matter and surfaces them proactively.",
  },
  {
    icon: Scale,
    label: "Rights research engine",
    desc: "Ask 'What are the repair-and-deduct rules in Ontario?' or 'How much notice must my landlord give for entry?' and receive jurisdiction-specific, plain-language answers instantly.",
  },
];

const steps = [
  { n: "01", label: "Describe your situation", desc: "Whether you're a landlord or tenant, describe what's happened in plain language." },
  { n: "02", label: "Get jurisdiction-specific guidance", desc: "Reluno identifies your province or state's relevant statutes and procedures." },
  { n: "03", label: "Build your documentation", desc: "Generate notices, demand letters, and evidence logs in minutes." },
  { n: "04", label: "Track to resolution", desc: "Monitor response deadlines, file dates, and case progress in your Case Vault." },
];

export default function LandlordTenant() {
  return (
    <PageLayout>
      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="h-px w-8 bg-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-[0.25em]">
              Landlord-tenant
            </span>
          </div>

          <h1 className="font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.02] tracking-tight text-zinc-900 mb-7 max-w-7xl">
            Know your rights. Use them effectively.
          </h1>

          <p className="text-lg text-zinc-500 leading-relaxed max-w-2xl mb-10 font-light">
            Whether you're a landlord managing a property or a tenant fighting for what you're owed, rental disputes are stressful, time-consuming, and procedurally unforgiving. The right notice, filed correctly, at the right time, changes the outcome. Reluno makes that easy for both sides.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Start free
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
            {["Landlord & tenant tools", "Jurisdiction-aware guidance", "AES-256 encrypted"].map((t) => (
              <span key={t} className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <Shield size={12} className="text-blue-600" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO-SIDED TOOLS ── */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              Tools for both sides
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              Built for landlords and tenants equally.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Landlord column */}
            <div className="border border-zinc-200 rounded-md overflow-hidden bg-white">
              <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center gap-2">
              <Home size={13} className="text-blue-600" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">For landlords</p>
              </div>
              {landlordTools.map((t, i) => (
                <div key={t.label} className={`px-6 py-4 border-b border-zinc-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}`}>
                  <p className="text-xs font-semibold text-zinc-900 mb-0.5">{t.label}</p>
                  <p className="text-[11px] text-zinc-400">{t.desc}</p>
                </div>
              ))}
            </div>

            {/* Tenant column */}
            <div className="border border-zinc-200 rounded-md overflow-hidden bg-white">
              <div className="px-6 py-4 border-b border-zinc-100 bg-blue-50 flex items-center gap-2">
                <Scale size={13} className="text-blue-600" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">For tenants</p>
              </div>
              {tenantTools.map((t, i) => (
                <div key={t.label} className={`px-6 py-4 border-b border-zinc-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}`}>
                  <p className="text-xs font-semibold text-zinc-900 mb-0.5">{t.label}</p>
                  <p className="text-[11px] text-zinc-400">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATFORM TOOLS ── */}
      <section className="py-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              Platform capabilities
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              From dispute to resolution — fully automated.
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
              Structured guidance from first notice to final resolution.
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
          <div className="border border-zinc-200 rounded-md overflow-hidden bg-white">
            <div className="p-8 border-b border-zinc-100">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 shrink-0">
                  MV
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-900">Maria V.</p>
                  <p className="text-[10px] text-zinc-400">Tenant, Vancouver</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed">
                After moving out of her apartment, Maria's landlord withheld her $2,400 security deposit, citing "excessive damage" without providing an itemized list. She used Reluno to query British Columbia's security deposit rules, which require landlords to provide an itemized claim within 15 days or forfeit the right to claim. The AI-generated demand letter cited this statute specifically, set a 10-day cure deadline, and included a damages schedule for bad-faith withholding. The landlord returned the full $2,400 within a week — plus $240 in statutory interest — without ever going to the Residential Tenancy Branch.
              </p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-zinc-100">
              {[
                { label: "Deposit withheld", val: "$2,400" },
                { label: "Recovered (+ interest)", val: "$2,640" },
                { label: "Time to resolution", val: "7 days" },
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
              Start today
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 mb-5 max-w-xl mx-auto">
              The right notice, filed correctly, changes everything.
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-lg mx-auto mb-9">
              Start for free. Generate your first notice or demand letter, understand your rights, and build a documented case — no experience required.
            </p>
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Get started free
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="flex items-start gap-3 p-5 border border-amber-100 bg-amber-50 rounded-md">
            <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Landlord-tenant law varies significantly by province, state, and municipality. Reluno provides general legal information and document templates that should be reviewed for compliance with your specific jurisdiction before use. For complex eviction proceedings, habitability disputes, or matters involving potential litigation, consult a qualified attorney or your local tenant advocacy organization.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}