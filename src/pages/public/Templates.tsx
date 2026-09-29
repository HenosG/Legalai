import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  FileCheck2,
  FileText,
  FolderKanban,
  LayoutTemplate,
  Receipt,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const templateCategories = [
  "All templates",
  "Proposals",
  "Client onboarding",
  "Project delivery",
  "Invoices",
  "Agency operations",
];

const templates = [
  {
    title: "Website Project Proposal",
    category: "Proposals",
    description:
      "A clear structure for discovery, website scope, deliverables, timeline, investment, and next steps.",
    includes: [
      "Project goals and outcomes",
      "Scope and deliverables",
      "Timeline and investment",
    ],
    icon: FileText,
    accent: "blue",
    bestFor: "Web design and development projects",
  },
  {
    title: "Brand Identity Proposal",
    category: "Proposals",
    description:
      "A client-ready proposal structure for brand strategy, identity design, launch assets, and approvals.",
    includes: [
      "Creative direction",
      "Brand deliverables",
      "Revision expectations",
    ],
    icon: Sparkles,
    accent: "violet",
    bestFor: "Branding studios and creative teams",
  },
  {
    title: "Marketing Retainer Scope",
    category: "Agency operations",
    description:
      "A structured starting point for monthly marketing deliverables, channels, reporting, and client responsibilities.",
    includes: [
      "Monthly deliverables",
      "Channel priorities",
      "Reporting cadence",
    ],
    icon: LayoutTemplate,
    accent: "amber",
    bestFor: "Marketing agencies and retainers",
  },
  {
    title: "Client Discovery Questionnaire",
    category: "Client onboarding",
    description:
      "A practical client questionnaire to gather goals, audiences, timelines, constraints, and project requirements.",
    includes: [
      "Business and audience context",
      "Goals and priorities",
      "Budget and timeline questions",
    ],
    icon: ClipboardCheck,
    accent: "blue",
    bestFor: "Early discovery and client intake",
  },
  {
    title: "Client Kickoff Checklist",
    category: "Client onboarding",
    description:
      "A checklist for turning an approved project into a clear kickoff with roles, inputs, dates, and next actions.",
    includes: [
      "Project contacts",
      "Required client inputs",
      "Kickoff milestones",
    ],
    icon: Users,
    accent: "emerald",
    bestFor: "Newly approved client work",
  },
  {
    title: "Project Handoff Checklist",
    category: "Project delivery",
    description:
      "A structured handoff checklist for launch, delivery completion, documents, access, and final client review.",
    includes: [
      "Final deliverables",
      "Access and ownership",
      "Launch and handoff steps",
    ],
    icon: FolderKanban,
    accent: "violet",
    bestFor: "Project completion and launch",
  },
  {
    title: "Invoice Payment Terms",
    category: "Invoices",
    description:
      "A practical payment-terms starting point for client invoices, due dates, payment expectations, and follow-up.",
    includes: [
      "Payment due date language",
      "Invoice context",
      "Client-facing next steps",
    ],
    icon: Receipt,
    accent: "amber",
    bestFor: "Agencies and freelancers collecting payment",
  },
  {
    title: "Client Portal Setup Checklist",
    category: "Project delivery",
    description:
      "A checklist for deciding what clients should see in a portal, including progress, documents, invoices, and access.",
    includes: [
      "Portal access settings",
      "Shared information",
      "Client-facing review points",
    ],
    icon: FileCheck2,
    accent: "emerald",
    bestFor: "Agencies improving client visibility",
  },
];

const accentStyles = {
  blue: {
    icon: "bg-blue-50 text-[#063ee2]",
    pill: "bg-blue-50 text-blue-700 border-blue-100",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
    pill: "bg-violet-50 text-violet-700 border-violet-100",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    pill: "bg-amber-50 text-amber-700 border-amber-100",
  },
};

export default function Templates() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fafafa] text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap");

        * {
          font-family: "DM Sans", sans-serif;
        }

        .hero-grid {
          background-color: #063ee2;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .hero-stripes {
          background-image:
            repeating-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.035) 0,
              rgba(255, 255, 255, 0.035) 1px,
              transparent 1px,
              transparent 15px
            );
        }
      `}</style>

      <Navbar />

      <main>
        {/* Hero */}
        <section className="hero-grid relative isolate overflow-hidden border-b border-blue-700 pb-20 pt-36 text-white sm:pb-24 sm:pt-44">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(3,26,117,0.65)_70%,rgba(1,11,51,0.9)_100%)]" />
          <div className="hero-stripes pointer-events-none absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-[440px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/25 blur-[120px]" />

          <div className="relative mx-auto max-w-5xl px-6 text-center sm:px-10">
            <p className="inline-flex items-center gap-2 rounded-lg border border-blue-400/40 bg-blue-600/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur-md">
              <LayoutTemplate size={12} />
              Templates
            </p>

            <h1 className="mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Start client work with a stronger operating system.
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Practical starting points for proposals, client onboarding,
              project delivery, invoices, and clearer client operations.
            </p>

            <div className="mx-auto mt-9 flex max-w-xl items-center rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
              <Search size={17} className="text-blue-100/70" />
              <input
                placeholder="Search templates"
                className="ml-3 w-full bg-transparent text-sm text-white outline-none placeholder:text-blue-100/65"
              />
            </div>
          </div>
        </section>

        {/* Templates */}
        <section className="bg-white px-6 py-20 sm:px-10 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                  Practical starting points
                </p>

                <h2 className="mt-5 text-4xl font-bold tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                  Start with structure. Make it your own.
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-500">
                  These templates are designed as useful starting points for
                  agencies and freelancers. Adapt the language, deliverables,
                  terms, scope, and client experience to match your business.
                </p>
              </div>

              <Link
                to="/signup"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#063ee2] hover:text-blue-800"
              >
                Start a free workspace
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
              {templateCategories.map((category, index) => (
                <button
                  key={category}
                  type="button"
                  className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-bold transition-colors ${
                    index === 0
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-500 hover:border-blue-200 hover:bg-blue-50 hover:text-[#063ee2]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {templates.map((template) => {
                const Icon = template.icon;
                const style =
                  accentStyles[
                    template.accent as keyof typeof accentStyles
                  ];

                return (
                  <article
                    key={template.title}
                    className="group flex flex-col rounded-3xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(6,62,226,0.1)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.icon}`}
                      >
                        <Icon size={20} />
                      </div>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${style.pill}`}
                      >
                        {template.category}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-bold tracking-[-0.035em] text-zinc-900">
                      {template.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                      {template.description}
                    </p>

                    <div className="mt-5 rounded-xl bg-zinc-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                        Includes
                      </p>

                      <ul className="mt-3 space-y-2">
                        {template.includes.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-xs leading-5 text-zinc-600"
                          >
                            <span className="mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#063ee2] text-white">
                              <Check size={9} strokeWidth={3} />
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-5">
                      <span className="text-[11px] text-zinc-400">
                        Best for: {template.bestFor}
                      </span>
                    </div>

                    <Link
                      to="/signup"
                      className="group/link mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#063ee2] transition-colors hover:text-blue-800"
                    >
                      Use in RelunoOS
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover/link:translate-x-1"
                      />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Note */}
        <section className="border-y border-zinc-100 bg-[#f5f7ff] px-6 py-20 sm:px-10 sm:py-24">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#063ee2]">
                Make each template yours
              </p>

              <h2 className="mt-5 text-4xl font-bold tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                A template is a starting point, not a substitute for judgment.
              </h2>
            </div>

            <div>
              <p className="text-base leading-7 text-zinc-500">
                Adapt every proposal, scope, invoice term, client questionnaire,
                and delivery checklist for your own services, clients,
                jurisdiction, business model, and professional obligations.
              </p>

              <p className="mt-5 text-sm leading-6 text-zinc-500">
                RelunoOS templates are designed to help teams create clearer
                operational starting points. They are not legal, accounting,
                tax, or other professional advice.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="hero-grid relative isolate overflow-hidden px-6 py-20 text-white sm:px-10 sm:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.13)_0%,rgba(3,26,117,0.68)_72%,rgba(1,11,51,0.92)_100%)]" />
          <div className="hero-stripes pointer-events-none absolute inset-0 opacity-40" />

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-blue-100">
              Start with a better workflow
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              Build client work from a clearer starting point.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-100">
              Use RelunoOS to bring client context, scopes, projects, invoices,
              and client visibility into one connected workspace.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#063ee2] transition-all hover:bg-blue-50"
              >
                Start free
                <ArrowRight size={15} />
              </Link>

              <Link
                to="/platform"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Explore platform
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}