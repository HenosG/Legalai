import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Check,
  ClipboardCheck,
  FileText,
  FolderKanban,
  Lightbulb,
  MessageSquareText,
  Receipt,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const guides = [
  {
    title: "The Agency Client Workflow Playbook",
    category: "Agency operations",
    description:
      "A practical framework for connecting inquiry, CRM, proposals, projects, invoices, payment, and client visibility.",
    readTime: "12 min read",
    icon: Sparkles,
    href: "/blog/client-workflow-from-inquiry-to-payment",
    accent: "blue",
    steps: ["Capture context", "Make a decision", "Deliver with visibility"],
  },
  {
    title: "How to Turn Inquiries Into Reviewable Opportunities",
    category: "AI Intake",
    description:
      "A practical guide to organizing raw messages, lead forms, referral notes, timing signals, and client requirements before deciding the next action.",
    readTime: "8 min read",
    icon: MessageSquareText,
    href: "/platform/ai-intake",
    accent: "violet",
    steps: ["Capture the inquiry", "Review details", "Choose next action"],
  },
  {
    title: "Proposal-to-Project Handoff Checklist",
    category: "Proposals",
    description:
      "Keep client scope, deliverables, responsibilities, timeline, investment, and approval context connected after a proposal is accepted.",
    readTime: "7 min read",
    icon: FileText,
    href: "/blog/proposal-to-project-handoff",
    accent: "emerald",
    steps: ["Confirm scope", "Create milestones", "Preserve expectations"],
  },
  {
    title: "How to Give Clients Clearer Project Updates",
    category: "Client experience",
    description:
      "Create a focused client communication rhythm around milestones, progress, shared documents, decisions, invoices, and next steps.",
    readTime: "6 min read",
    icon: Users,
    href: "/platform/client-portal",
    accent: "blue",
    steps: ["Show progress", "Share approved work", "Clarify next actions"],
  },
  {
    title: "Invoice and Payment Collection Checklist",
    category: "Invoices",
    description:
      "A practical guide for connecting client work, invoice line items, due dates, payment status, and client-facing payment expectations.",
    readTime: "6 min read",
    icon: Receipt,
    href: "/platform/invoices",
    accent: "amber",
    steps: ["Create invoice", "Confirm terms", "Track payment status"],
  },
  {
    title: "How to Build a Better Client Portal",
    category: "Client Portal",
    description:
      "Decide what clients should see, what remains internal, and how a portal can reduce unnecessary status requests.",
    readTime: "6 min read",
    icon: ClipboardCheck,
    href: "/blog/client-portal-for-agencies",
    accent: "violet",
    steps: ["Choose visibility", "Share approved work", "Keep access clear"],
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

export default function Guides() {
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
              <Lightbulb size={12} />
              Guides
            </p>

            <h1 className="mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Practical guides for calmer client operations.
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Step-by-step frameworks for agencies, freelancers, and
              client-service teams that want clearer workflows from the first
              inquiry through delivery, invoicing, and client visibility.
            </p>

            <div className="mx-auto mt-9 flex max-w-xl items-center rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
              <Search size={17} className="text-blue-100/70" />
              <input
                placeholder="Search guides"
                className="ml-3 w-full bg-transparent text-sm text-white outline-none placeholder:text-blue-100/65"
              />
            </div>
          </div>
        </section>

        {/* Guides */}
        <section className="bg-white px-6 py-20 sm:px-10 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Client operations playbooks
              </p>

              <h2 className="mt-5 text-4xl font-bold tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Build systems around the work your clients actually experience.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-500">
                These guides are designed to help you create more connected,
                reviewable, and client-friendly workflows. Use them as
                practical starting points, then adapt the details to your
                business and services.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {guides.map((guide) => {
                const Icon = guide.icon;
                const style =
                  accentStyles[guide.accent as keyof typeof accentStyles];

                return (
                  <article
                    key={guide.title}
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
                        {guide.category}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-bold tracking-[-0.035em] text-zinc-900">
                      {guide.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                      {guide.description}
                    </p>

                    <div className="mt-5 rounded-xl bg-zinc-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                        Guide flow
                      </p>

                      <ol className="mt-3 space-y-2">
                        {guide.steps.map((step, index) => (
                          <li
                            key={step}
                            className="flex items-center gap-2 text-xs text-zinc-600"
                          >
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[#063ee2] shadow-sm">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-5">
                      <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                        <BookOpen size={13} />
                        {guide.readTime}
                      </span>

                      <Link
                        to={guide.href}
                        className="group/link inline-flex items-center gap-2 text-xs font-bold text-[#063ee2] transition-colors hover:text-blue-800"
                      >
                        Read guide
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover/link:translate-x-1"
                        />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Guide note */}
        <section className="border-y border-zinc-100 bg-[#f5f7ff] px-6 py-20 sm:px-10 sm:py-24">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#063ee2]">
                Use what fits
              </p>

              <h2 className="mt-5 text-4xl font-bold tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                The best workflow is the one your team can actually use.
              </h2>
            </div>

            <div>
              <p className="text-base leading-7 text-zinc-500">
                Start with the point where context is most often lost: the
                inquiry, proposal handoff, project delivery, invoice stage, or
                client update. Improve one connected stage at a time rather
                than trying to redesign everything at once.
              </p>

              <Link
                to="/platform"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#063ee2] hover:text-blue-800"
              >
                Explore the connected workflow
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="hero-grid relative isolate overflow-hidden px-6 py-20 text-white sm:px-10 sm:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.13)_0%,rgba(3,26,117,0.68)_72%,rgba(1,11,51,0.92)_100%)]" />
          <div className="hero-stripes pointer-events-none absolute inset-0 opacity-40" />

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-blue-100">
              Put the workflow into practice
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              Build client operations with more clarity.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-100">
              RelunoOS helps connect inquiry, client context, proposals,
              projects, invoices, payments, and Client Portal visibility in one
              workspace.
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
                to="/templates"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Browse templates
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