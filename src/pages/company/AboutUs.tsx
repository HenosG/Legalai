// src/pages/company/AboutUs.tsx
// Reluno – About Us page
// Narrative: Making justice affordable. Origin story, mission, values.

import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import {
  ArrowRight, Lightbulb, Users, Shield, TrendingUp,
  Globe, Award, CheckCircle, Heart,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    label: "Access as a right",
    desc: "Legal guidance should not be reserved for those who can afford $400-per-hour attorneys. We build tools that give every individual and small business the same analytical capability as a well-resourced legal team.",
  },
  {
    icon: Lightbulb,
    label: "Radical transparency",
    desc: "We explain our reasoning. Every AI response cites the legal basis for its guidance. We surface our limitations clearly, and we never oversell what the platform can do.",
  },
  {
    icon: Shield,
    label: "Privacy by design",
    desc: "Your legal matters are among the most sensitive information you can share. We use AES-256 encryption, maintain a strict zero-data-retention policy for documents, and never use your data to train AI models.",
  },
  {
    icon: TrendingUp,
    label: "Measured outcomes",
    desc: "We care about resolution, not engagement. Our analytics are designed to help you close matters, not keep you on the platform. Success means your case is over.",
  },
];

const stats = [
  { val: "12,400+", label: "Active users" },
  { val: "40+", label: "Practice areas covered" },
  { val: "< 2s", label: "AI response time" },
  { val: "99.99%", label: "Platform uptime" },
];

const team = [
  { initials: "AK", name: "Arjun K.", title: "Co-founder & CEO", detail: "Former legal tech analyst. Built and sold his first SaaS at 24." },
  { initials: "SM", name: "Sophia M.", title: "Co-founder & CTO", detail: "ex-Google. 10 years building ML systems for document understanding." },
  { initials: "JP", name: "James P.", title: "Head of Legal Content", detail: "Called to the Ontario bar in 2014. Spent 8 years in civil litigation." },
  { initials: "NR", name: "Nadia R.", title: "Head of Product", detail: "Previously led product at two Y Combinator-backed legal startups." },
];

export default function AboutUs() {
  return (
    <PageLayout>
      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="h-px w-8 bg-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-[0.25em]">
              Our story
            </span>
          </div>

          <h1 className="font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.02] tracking-tight text-zinc-900 mb-7 max-w-7xl">
            We built the tool we wished had existed.
          </h1>

          <p className="text-lg text-zinc-500 leading-relaxed max-w-2xl font-light">
            Reluno started with a dispute over $1,800. Our founder's sister — a nurse, not a lawyer — was being chased by her former landlord for damage she didn't cause. She couldn't afford an attorney. She had no idea what her rights were. She eventually paid just to make it stop. We decided that was unacceptable.
          </p>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              The problem
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 mb-6">
              Legal access has always been a privilege.
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed mb-5">
              In North America, access to legal counsel is effectively rationed by income. The average hourly rate for a general practice attorney is $250–$400. A single dispute — eviction, employment termination, contract breach, personal injury — can require 10 to 40 hours of professional time. For most individuals and small businesses, that cost is prohibitive.
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed">
              The result: well-resourced parties consistently outmaneuver those without counsel. Not because their claims are stronger — but because they know the procedures, the language, and the timing. We believe that asymmetry is solvable.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              Our answer
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 mb-6">
              Intelligence infrastructure, democratized.
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed mb-5">
              Reluno provides the same capabilities that well-resourced parties have always taken for granted: instant legal research, structured claim valuation, professional document generation, deadline tracking, and evidence organization. Not as a replacement for attorneys in complex cases — but as the layer beneath that tier, which handles 80% of legal matters and shouldn't require one.
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Our mission is not to disrupt the legal profession. It's to close the gap between those who can afford it and those who can't — with technology that should have existed a decade ago.
            </p>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              How we operate
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              Principles we actually hold ourselves to.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-100 border border-zinc-100 rounded-md overflow-hidden">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.label} className="bg-white p-8 flex flex-col gap-4 hover:bg-zinc-50 transition-colors group">
                  <div className="w-9 h-9 rounded-md border border-zinc-200 flex items-center justify-center group-hover:border-blue-200 transition-colors">
                  <Icon size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 mb-2">{value.label}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-10">
            By the numbers
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ val, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-zinc-900 mb-1">{val}</p>
                <p className="text-xs text-zinc-400 uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              The team
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              Builders and practitioners who understand both sides.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((member) => (
              <div key={member.name} className="border border-zinc-200 rounded-md p-6 bg-white hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 mb-5">
                  {member.initials}
                </div>
                <p className="text-sm font-semibold text-zinc-900 mb-0.5">{member.name}</p>
                <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider mb-3">{member.title}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{member.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="border border-zinc-200 rounded-md p-14 text-center bg-zinc-50">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              Join us
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 mb-5 max-w-xl mx-auto">
              The legal system isn't going to change itself. We're helping.
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-lg mx-auto mb-9">
              Whether you have a matter to resolve or a career to build — we'd love to have you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Try Reluno free
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/careers"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-zinc-200 text-zinc-700 text-sm font-semibold hover:border-zinc-400 hover:bg-white transition-all"
              >
                View open roles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}