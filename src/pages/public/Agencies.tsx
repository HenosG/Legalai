import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MessageSquareText,
  Receipt,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const agencyProblems = [
  {
    icon: MessageSquareText,
    title: "Leads arrive everywhere",
    description:
      "New opportunities come through emails, forms, DMs, referrals, calls, and conversations that do not share one clear path.",
  },
  {
    icon: ClipboardList,
    title: "Context gets copied repeatedly",
    description:
      "Client details move manually from inboxes to CRM, proposals, project tools, invoices, and internal notes.",
  },
  {
    icon: FolderKanban,
    title: "Delivery loses the sales context",
    description:
      "The team starts delivering work without a clear connection to the proposal, client goals, or original scope.",
  },
  {
    icon: Receipt,
    title: "Billing becomes another tool",
    description:
      "Invoices, payment follow-up, and client status live outside the work that created them.",
  },
];

const agencyBenefits = [
  {
    icon: Sparkles,
    title: "AI Intake",
    description:
      "Turn raw inquiries into structured, reviewable opportunities before they become missed follow-ups.",
  },
  {
    icon: Users,
    title: "Connected CRM",
    description:
      "Keep client details, notes, activity, proposals, projects, and payment context together.",
  },
  {
    icon: FileText,
    title: "Proposal workflow",
    description:
      "Build client-ready scopes and investment decisions from the context your team already has.",
  },
  {
    icon: FolderKanban,
    title: "Project delivery",
    description:
      "Move approved work into milestones, tasks, ownership, deadlines, and visible delivery progress.",
  },
  {
    icon: CircleDollarSign,
    title: "Invoices and payments",
    description:
      "Create connected payment requests and track what is draft, due, paid, or overdue.",
  },
  {
    icon: LayoutDashboard,
    title: "Client visibility",
    description:
      "Give clients a clearer view of approved work, progress, documents, invoices, and next steps.",
  },
];

const agencyWorkflow = [
  {
    number: "01",
    title: "Capture the opportunity",
    description:
      "Bring incoming interest into a structured intake process instead of relying on scattered messages and memory.",
    icon: MessageSquareText,
  },
  {
    number: "02",
    title: "Turn context into a decision",
    description:
      "Review the opportunity, build a clear proposal, and keep the client relationship connected through approval.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Deliver and get paid",
    description:
      "Move sold work into projects, milestones, invoices, payment tracking, and a clearer client experience.",
    icon: CircleDollarSign,
  },
];

function AgencyDemoPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-[3rem] bg-blue-300/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/15 to-white/[0.04] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm">
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/20 p-3">
          <div className="mb-3 flex items-center gap-1.5 px-2">
            <span className="h-2 w-2 rounded-full bg-red-300/80" />
            <span className="h-2 w-2 rounded-full bg-amber-200/80" />
            <span className="h-2 w-2 rounded-full bg-emerald-200/80" />
            <span className="ml-2 text-[10px] font-medium text-blue-100/60">
              RelunoOS agency workspace
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-blue-950/10">
            <img
              src="/agencies-demo.svg"
              alt="RelunoOS agency workspace preview"
              className="block w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";

                const fallback = event.currentTarget.nextElementSibling;

                if (fallback instanceof HTMLElement) {
                  fallback.style.display = "block";
                }
              }}
            />

            <div className="hidden p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
                    <LayoutDashboard size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-zinc-900">
                      Agency workspace
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-500">
                      Example operational overview
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                  Active
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "New leads", value: "12", color: "text-blue-600" },
                  {
                    label: "Open proposals",
                    value: "6",
                    color: "text-violet-600",
                  },
                  {
                    label: "Active projects",
                    value: "9",
                    color: "text-emerald-600",
                  },
                  {
                    label: "Outstanding",
                    value: "$18k",
                    color: "text-amber-600",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 p-3"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                      {item.label}
                    </p>
                    <p className={`mt-1.5 text-lg font-bold ${item.color}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Work needing attention
                  </p>
                  <span className="text-[10px] font-bold text-[#063ee2]">
                    View all
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    {
                      label: "Website redesign proposal",
                      detail: "Northstar Studio · Needs review",
                      color: "bg-amber-500",
                    },
                    {
                      label: "Development milestone",
                      detail: "Apex Logistics · Due this week",
                      color: "bg-blue-500",
                    },
                    {
                      label: "Invoice follow-up",
                      detail: "Waverly Creative · Payment due",
                      color: "bg-violet-500",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${item.color}`}
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-[11px] font-semibold text-zinc-700">
                            {item.label}
                          </span>
                          <span className="block truncate text-[10px] text-zinc-400">
                            {item.detail}
                          </span>
                        </span>
                      </span>

                      <ArrowRight size={13} className="shrink-0 text-zinc-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -left-6 top-14 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
          One workspace
        </p>
        <p className="mt-1 text-sm font-bold text-white">
          Lead → payment
        </p>
      </div>

      <div className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
          Team visibility
        </p>
        <p className="mt-1 text-xs font-semibold text-white">
          Work that needs attention
        </p>
      </div>
    </div>
  );
}

function AgencyWorkflowPreview() {
  const workflowItems = [
    {
      icon: Sparkles,
      title: "AI Intake",
      subtitle: "New opportunity review",
      status: "Ready",
      statusClass:
        "border-blue-200 bg-blue-50 text-blue-700",
    },
    {
      icon: FileText,
      title: "Proposal",
      subtitle: "Scope and investment",
      status: "Draft",
      statusClass:
        "border-zinc-200 bg-zinc-100 text-zinc-600",
    },
    {
      icon: FolderKanban,
      title: "Project",
      subtitle: "Delivery workspace",
      status: "Active",
      statusClass:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    {
      icon: Receipt,
      title: "Invoice",
      subtitle: "Payment request",
      status: "Due",
      statusClass:
        "border-amber-200 bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_20px_50px_rgba(6,62,226,0.08)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
            <Workflow size={19} />
          </div>

          <div>
            <p className="text-sm font-bold text-zinc-900">
              Connected agency workflow
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">
              Example workspace view
            </p>
          </div>
        </div>

        <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#063ee2]">
          Connected
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {workflowItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#063ee2] shadow-sm">
                  <Icon size={15} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-800">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-zinc-500">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${item.statusClass}`}
              >
                {item.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Agencies() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fafafa] text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap");

        * {
          font-family: "DM Sans", sans-serif;
        }

        .font-display {
          font-family: "DM Serif Display", serif;
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

        @keyframes rise-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .rise-in {
          animation: rise-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .rise-in-delay-1 {
          animation-delay: 0.08s;
        }

        .rise-in-delay-2 {
          animation-delay: 0.16s;
        }

        .rise-in-delay-3 {
          animation-delay: 0.24s;
        }
      `}</style>

      <Navbar />

      <main>
        {/* Hero */}
        <section className="hero-grid relative isolate overflow-hidden border-b border-blue-700 pb-24 pt-36 text-white sm:pb-32 sm:pt-44">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(3,26,117,0.65)_70%,rgba(1,11,51,0.9)_100%)]" />
          <div className="hero-stripes pointer-events-none absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/25 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
            <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
              <div className="max-w-2xl">
                <div className="rise-in inline-flex items-center gap-2 rounded-lg border border-blue-400/40 bg-blue-600/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur-md">
                  <BriefcaseIcon />
                  Built for agencies
                </div>

                <h1 className="rise-in rise-in-delay-1 mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                  One operating system for client-service agencies.
                </h1>

                <p className="rise-in rise-in-delay-2 mt-7 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
                  Bring inquiries, client relationships, proposals, delivery,
                  invoices, payments, and client visibility into one connected
                  workspace built for the way agencies actually operate.
                </p>

                <div className="rise-in rise-in-delay-3 mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <Link
                    to="/signup"
                    className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#063ee2] shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-0.5 hover:bg-blue-50"
                  >
                    Start free
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    to="/pricing"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                  >
                    View pricing
                    <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="rise-in rise-in-delay-3 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-blue-100/90">
                  <span className="inline-flex items-center gap-2">
                    <Check size={14} className="text-blue-200" />
                    Built for client-service workflows
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Check size={14} className="text-blue-200" />
                    AI-assisted, human-controlled
                  </span>
                </div>
              </div>

              <div className="rise-in rise-in-delay-2 relative mx-auto w-full max-w-3xl lg:max-w-none">
                <AgencyDemoPreview />
              </div>
            </div>
          </div>
        </section>

        {/* Workflow strip */}
        <section className="border-b border-zinc-100 bg-white py-7">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 sm:px-10 lg:flex-row lg:justify-between">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 lg:text-left">
              One connected workflow for agency client work
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-semibold text-zinc-600">
              {[
                "Inquiry",
                "AI Intake",
                "CRM",
                "Proposal",
                "Project",
                "Invoice",
                "Client Portal",
              ].map((step, index, items) => (
                <div key={step} className="flex items-center gap-3">
                  <span>{step}</span>

                  {index !== items.length - 1 && (
                    <ArrowRight size={13} className="text-blue-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Agency pain points */}
        <section className="border-b border-zinc-100 bg-[#fafafa] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                  Agency operations
                </p>

                <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                  Your agency should not run on disconnected client context.
                </h2>
              </div>

              <p className="max-w-2xl text-base leading-7 text-zinc-500">
                Agencies do not just manage tasks. They manage relationships,
                expectations, sales conversations, delivery work, approvals,
                invoices, and client communication—often across too many tools
                that do not share the context behind the work.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2">
              {agencyProblems.map((problem) => {
                const Icon = problem.icon;

                return (
                  <article
                    key={problem.title}
                    className="group bg-white p-7 transition-colors hover:bg-blue-50/40 sm:p-8"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-[#063ee2]">
                      <Icon size={19} />
                    </div>

                    <h3 className="mt-7 text-xl font-bold tracking-tight text-zinc-900">
                      {problem.title}
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
                      {problem.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Operating system */}
        <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                The operating layer
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                One workspace for the work behind every client relationship.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                RelunoOS is designed to connect the stages that agencies
                already manage: intake, CRM, proposals, delivery, invoices,
                payment visibility, and the client experience.
              </p>

              <Link
                to="/platform"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#063ee2] transition-colors hover:text-blue-800"
              >
                Explore the RelunoOS platform
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <AgencyWorkflowPreview />
          </div>
        </section>

        {/* Agency benefits */}
        <section className="border-y border-zinc-100 bg-[#f5f7ff] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Built around agency work
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Keep the client workflow connected from first inquiry to final payment.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-500">
                RelunoOS gives agencies a clearer system for moving client work
                forward without forcing teams to rebuild context at every stage.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
              {agencyBenefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <article
                    key={benefit.title}
                    className="group bg-white p-7 transition-colors hover:bg-blue-50/40"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-[#063ee2]">
                      <Icon size={18} />
                    </div>

                    <h3 className="mt-6 text-base font-bold text-zinc-900">
                      {benefit.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      {benefit.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                How agencies use RelunoOS
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Move from incoming interest to completed client work with less friction.
              </h2>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {agencyWorkflow.map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.number}
                    className="relative rounded-3xl border border-zinc-200 bg-white p-7 shadow-[0_12px_30px_rgba(6,62,226,0.04)]"
                  >
                    <span className="text-5xl font-bold tracking-[-0.06em] text-blue-100">
                      {step.number}
                    </span>

                    <div className="mt-8 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
                      <Icon size={18} />
                    </div>

                    <h3 className="mt-6 text-xl font-bold tracking-tight text-zinc-900">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                      {step.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Human control */}
        <section className="border-y border-zinc-100 bg-[#f5f7ff] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Built for agency control
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                AI can reduce admin work. Your agency keeps control of the relationship.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                RelunoOS can help organize inquiry details and create structured
                starting points, but your team remains responsible for
                qualification, scope, pricing, approvals, communication, and
                delivery.
              </p>

              <Link
                to="/security"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#063ee2] transition-colors hover:text-blue-800"
              >
                Learn about security and privacy
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-[#063ee2] via-blue-700 to-indigo-950 p-6 shadow-2xl shadow-blue-950/15 sm:p-9">
              <div className="rounded-3xl border border-white/20 bg-white p-6 shadow-xl sm:p-8">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
                      <CheckCircle2 size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-zinc-900">
                        Agency approval workflow
                      </p>

                      <p className="mt-1 text-[11px] text-zinc-500">
                        People remain responsible
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#063ee2]">
                    Human review
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    "Review new opportunities before CRM",
                    "Edit scope and investment before proposals",
                    "Control client-facing communication",
                    "Keep delivery and payment decisions visible",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#063ee2] text-white">
                        <Check size={11} strokeWidth={3} />
                      </span>

                      <span className="text-xs font-semibold text-zinc-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#063ee2] px-4 py-3 text-xs font-bold text-white"
                  >
                    Review opportunity
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-bold text-zinc-700"
                  >
                    View client context
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="hero-grid relative isolate overflow-hidden px-6 py-24 text-white sm:px-10 sm:py-32">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.13)_0%,rgba(3,26,117,0.68)_72%,rgba(1,11,51,0.92)_100%)]" />
          <div className="hero-stripes pointer-events-none absolute inset-0 opacity-40" />

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-blue-100">
              Built for client-service agencies
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              Build a calmer way to run agency client work.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100">
              Bring the work behind every client relationship into one connected
              operating system—from the first inquiry through delivery,
              invoicing, payment, and the client experience.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#063ee2] shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Start free
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                See pricing
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function BriefcaseIcon() {
  return <Workflow size={13} />;
}