// src/pages/company/Careers.tsx
// Reluno – Careers page
// Modern hiring layout — mission-first, transparent, remote-first

import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import {
  ArrowRight, Code, HeadphonesIcon, Megaphone,
  MapPin, Clock, Globe, CheckCircle, Zap,
} from "lucide-react";

const openRoles = [
  {
    icon: Code,
    title: "Senior full-stack engineer",
    dept: "Engineering",
    type: "Full-time",
    location: "Remote (Canada / US)",
    desc: "Build the infrastructure that makes legal intelligence accessible at scale. You'll own end-to-end features across our React frontend and Node/Python backend, working directly with founders.",
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "AI/LLM APIs"],
    level: "Senior",
  },
  {
    icon: Code,
    title: "AI / ML engineer",
    dept: "Engineering",
    type: "Full-time",
    location: "Remote (Canada / US)",
    desc: "Design and optimize the AI pipelines that power our query engine, document analysis, and PDF risk scoring. Experience with fine-tuning, RAG, or legal NLP is a strong plus.",
    skills: ["Python", "LangChain", "OpenAI / Anthropic APIs", "Vector DBs", "Prompt engineering"],
    level: "Mid–Senior",
  },
  {
    icon: HeadphonesIcon,
    title: "Customer success specialist",
    dept: "Customer Success",
    type: "Full-time",
    location: "Remote",
    desc: "Help individuals and small businesses navigate complex legal situations using Reluno. You'll be the human layer between a stressful situation and a resolved one — communication skills matter most.",
    skills: ["Empathy", "Technical aptitude", "Legal literacy (an asset)", "Intercom / Zendesk"],
    level: "Mid-level",
  },
  {
    icon: Megaphone,
    title: "Growth marketing lead",
    dept: "Marketing",
    type: "Full-time",
    location: "Remote",
    desc: "Own acquisition across SEO, paid channels, and partnerships. This role is the difference between a great product and a product that reaches the people who need it.",
    skills: ["SEO / SEM", "Performance marketing", "Content strategy", "Analytics"],
    level: "Senior",
  },
];

const benefits = [
  { label: "Fully remote — always", detail: "Work from anywhere. We've never had an office and don't plan to." },
  { label: "Equity from day one", detail: "Everyone on the team holds meaningful ownership in what we're building." },
  { label: "Competitive salary", detail: "We benchmark to top-quartile rates for your market and level." },
  { label: "Health & dental", detail: "Full coverage for you and dependents, regardless of jurisdiction." },
  { label: "Learning budget", detail: "$2,000/year for courses, conferences, books, or anything that makes you better." },
  { label: "Home office stipend", detail: "$1,500 one-time setup budget plus annual refresh for equipment." },
  { label: "Unlimited PTO", detail: "With a two-week minimum we actually enforce. Rest is a feature." },
  { label: "Async by default", detail: "We write things down. Meetings exist for decisions, not updates." },
];

export default function Careers() {
  return (
    <PageLayout>
      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="h-px w-8 bg-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-[0.25em]">
              Careers
            </span>
          </div>

          <h1 className="font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.02] tracking-tight text-zinc-900 mb-7 max-w-7xl">
            Build technology that actually helps people.
          </h1>

          <p className="text-lg text-zinc-500 leading-relaxed max-w-2xl font-light mb-10">
            Reluno is a small team working on a large problem: legal access. We're at the point where the product works, users love it, and we need to grow the team that scales it. If you want your work to matter — and you want to see the impact in real time — this is the right place.
          </p>

          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {["Remote-first", "Series A-stage", "12,400+ active users"].map((t) => (
              <span key={t} className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <CheckCircle size={12} className="text-blue-600" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY RELUNO ── */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: Globe, label: "Real-world impact", desc: "Users close real legal disputes — recover money, protect rights, resolve conflicts — using tools you built. We measure success in resolved cases, not MAUs." },
            { icon: Zap, label: "Fast, autonomous work", desc: "We're a small team. There is no approval chain. If you own a feature, you ship it. If you see a problem, you fix it. Bureaucracy is not something we have time for." },
            { icon: CheckCircle, label: "Sustainable pace", desc: "We've been burned by crunch culture at previous companies. We don't do sprints with midnight deadlines. We plan well, ship consistently, and protect our team's time." },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col gap-4">
              <div className="w-9 h-9 rounded-md border border-zinc-200 bg-white flex items-center justify-center">
                <Icon size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 mb-2">{label}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OPEN ROLES ── */}
      <section className="py-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              Open positions
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              Four roles we're hiring for right now.
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {openRoles.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.title}
                  className="border border-zinc-200 rounded-md bg-white hover:border-blue-200 transition-colors p-8 group"
                >
                  <div className="flex items-start justify-between gap-6 flex-wrap">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-9 h-9 rounded-md border border-zinc-200 flex items-center justify-center shrink-0 group-hover:border-blue-200 transition-colors mt-0.5">
                      <Icon size={15} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <p className="text-sm font-semibold text-zinc-900">{role.title}</p>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm">
                            {role.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mb-3 flex-wrap">
                          <span className="text-[10px] text-zinc-400">{role.dept}</span>
                          <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                            <MapPin size={10} /> {role.location}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                            <Clock size={10} /> {role.type}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed mb-4">{role.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {role.skills.map((skill) => (
                            <span key={skill} className="text-[10px] font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <a
                      href="mailto:careers@relunolegal.ai"
                      className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-blue-600 transition-colors shrink-0"
                    >
                      Apply
                      <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              What we offer
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              Compensation and culture, not just perks.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200 border border-zinc-200 rounded-md overflow-hidden">
            {benefits.map(({ label, detail }) => (
              <div key={label} className="bg-white p-7 hover:bg-zinc-50 transition-colors">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <p className="text-sm font-semibold text-zinc-900">{label}</p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed pl-4">{detail}</p>
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
              Don't see the right role?
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 mb-5 max-w-xl mx-auto">
              Send us something anyway.
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-lg mx-auto mb-9">
              We read every application. If you're exceptional and you believe in what we're building, tell us why. We've made hires from cold emails before.
            </p>
            <a
              href="mailto:careers@relunolegal.ai"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Email careers@relunolegal.ai
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}