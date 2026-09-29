import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  FileText,
  FolderKanban,
  MessageSquareText,
  Receipt,
  Sparkles,
  UserRound,
  Workflow,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const freelancerProblems = [
  {
    icon: MessageSquareText,
    title: "Every inquiry starts in a different place",
    description:
      "New client work arrives through emails, referrals, contact forms, chats, and direct messages that are hard to keep organized.",
  },
  {
    icon: ClipboardList,
    title: "Too much time goes to admin",
    description:
      "Client details get copied between notes, documents, proposals, project tools, invoices, and email threads.",
  },
  {
    icon: FileText,
    title: "Proposals start from scratch",
    description:
      "You already know the client context, but still rebuild the same scope, timeline, and project details every time.",
  },
  {
    icon: Receipt,
    title: "Getting paid feels disconnected",
    description:
      "Invoices and payment follow-up become another separate task after the work is already complete.",
  },
];

const freelancerBenefits = [
  {
    icon: Sparkles,
    title: "Turn messages into opportunities",
    description:
      "Use AI Intake to organize new client inquiries into a clearer starting point for review.",
  },
  {
    icon: UserRound,
    title: "Keep every client organized",
    description:
      "Store relationship context, notes, work history, proposals, projects, and payment information in one place.",
  },
  {
    icon: FileText,
    title: "Create proposals faster",
    description:
      "Start with the useful client details you already have instead of rebuilding every proposal from scratch.",
  },
  {
    icon: FolderKanban,
    title: "Deliver with more focus",
    description:
      "Turn approved work into projects, milestones, tasks, priorities, and visible next steps.",
  },
  {
    icon: CircleDollarSign,
    title: "Send clearer invoices",
    description:
      "Create connected invoices and keep payment status visible alongside the client work that created them.",
  },
  {
    icon: Workflow,
    title: "Run one calmer workflow",
    description:
      "Replace a patchwork of disconnected client tools with one workspace that follows the work from inquiry to payment.",
  },
];

const freelancerSteps = [
  {
    number: "01",
    title: "Capture the client request",
    description:
      "Bring a new inquiry into RelunoOS and organize what the client is asking for before it gets lost.",
    icon: MessageSquareText,
  },
  {
    number: "02",
    title: "Turn context into clear work",
    description:
      "Use the client details to create a proposal, plan a project, and keep the scope connected to delivery.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Deliver and collect payment",
    description:
      "Track the work, send an invoice, and give the client a clearer view of progress and next steps.",
    icon: Receipt,
  },
];

function FreelancerDemoPreview() {
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
              RelunoOS workspace
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-blue-950/10">
            <img
              src="/freelancers-demo.svg"
              alt="RelunoOS freelancer client-work workspace preview"
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
                    <UserRound size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-zinc-900">
                      My client workspace
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-500">
                      Example freelancer overview
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                  Focused
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "New leads", value: "3", color: "text-blue-600" },
                  {
                    label: "Proposals",
                    value: "2",
                    color: "text-violet-600",
                  },
                  {
                    label: "Projects",
                    value: "4",
                    color: "text-emerald-600",
                  },
                  {
                    label: "Due",
                    value: "$5.2k",
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
                    Today’s priorities
                  </p>
                  <span className="text-[10px] font-bold text-[#063ee2]">
                    View all
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    {
                      label: "Review website inquiry",
                      detail: "New opportunity · Needs review",
                      color: "bg-blue-500",
                    },
                    {
                      label: "Finish project milestone",
                      detail: "Northstar Studio · Due Friday",
                      color: "bg-violet-500",
                    },
                    {
                      label: "Send invoice reminder",
                      detail: "Apex Logistics · Payment due",
                      color: "bg-amber-500",
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
          Less admin work
        </p>
      </div>

      <div className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
          Client flow
        </p>

        <p className="mt-1 text-xs font-semibold text-white">
          Inquiry → payment
        </p>
      </div>
    </div>
  );
}

function FreelancerWorkflowPreview() {
  const workflowItems = [
    {
      icon: Sparkles,
      title: "New inquiry",
      subtitle: "Structured with AI Intake",
      status: "Review",
      statusClass: "border-blue-200 bg-blue-50 text-blue-700",
    },
    {
      icon: FileText,
      title: "Proposal draft",
      subtitle: "Scope and investment ready",
      status: "Draft",
      statusClass: "border-zinc-200 bg-zinc-100 text-zinc-600",
    },
    {
      icon: FolderKanban,
      title: "Active project",
      subtitle: "Milestones and tasks visible",
      status: "Active",
      statusClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    {
      icon: Receipt,
      title: "Client invoice",
      subtitle: "Payment request prepared",
      status: "Due",
      statusClass: "border-amber-200 bg-amber-50 text-amber-700",
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
              Connected client workflow
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">
              Example freelancer workflow
            </p>
          </div>
        </div>

        <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#063ee2]">
          Simple
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

export default function Freelancers() {
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
                  <UserRound size={13} />
                  Built for freelancers
                </div>

                <h1 className="rise-in rise-in-delay-1 mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                  Run client work without running six disconnected tools.
                </h1>

                <p className="rise-in rise-in-delay-2 mt-7 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
                  RelunoOS helps freelancers manage inquiries, client details,
                  proposals, projects, invoices, and updates from one connected
                  workspace—so more of your time goes toward meaningful client
                  work.
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
                    No credit card required
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Check size={14} className="text-blue-200" />
                    You stay in control of every client action
                  </span>
                </div>
              </div>

              <div className="rise-in rise-in-delay-2 relative mx-auto w-full max-w-3xl lg:max-w-none">
                <FreelancerDemoPreview />
              </div>
            </div>
          </div>
        </section>

        {/* Workflow strip */}
        <section className="border-b border-zinc-100 bg-white py-7">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 sm:px-10 lg:flex-row lg:justify-between">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 lg:text-left">
              One connected workflow for independent client work
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

        {/* Problems */}
        <section className="border-b border-zinc-100 bg-[#fafafa] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                  Freelancer operations
                </p>

                <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                  Great client work should not require constant tool switching.
                </h2>
              </div>

              <p className="max-w-2xl text-base leading-7 text-zinc-500">
                Independent work often means managing every part of the client
                relationship yourself: inquiries, follow-up, proposals,
                delivery, updates, invoices, and payment collection. When each
                stage lives in a different tool, admin work takes over the time
                you should spend creating, delivering, and building trust.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2">
              {freelancerProblems.map((problem) => {
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
                A calmer operating system
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Keep client work moving without rebuilding context at every stage.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                RelunoOS connects the work you already do: capture the inquiry,
                organize the client, create the proposal, deliver the project,
                send the invoice, and give clients a clearer experience.
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

            <FreelancerWorkflowPreview />
          </div>
        </section>

        {/* Benefits */}
        <section className="border-y border-zinc-100 bg-[#f5f7ff] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Built around independent work
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Spend less time organizing the work and more time doing it.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-500">
                RelunoOS helps freelancers move through the client workflow
                with more structure, clearer client context, and fewer
                disconnected tools.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
              {freelancerBenefits.map((benefit) => {
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
                How freelancers use RelunoOS
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Move from a new inquiry to paid client work with less friction.
              </h2>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {freelancerSteps.map((step) => {
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
                You stay in control
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                AI can help you move faster. You decide what happens next.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                RelunoOS can help organize client context and create useful
                first drafts, but you remain responsible for the relationships,
                scope, pricing, communication, and delivery decisions that make
                your work valuable.
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
                        Your client workflow
                      </p>

                      <p className="mt-1 text-[11px] text-zinc-500">
                        You approve important actions
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
                    "Edit scope and pricing before proposals",
                    "Choose what clients can see",
                    "Control delivery and payment decisions",
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
                    Review inquiry
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-bold text-zinc-700"
                  >
                    View client work
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
              Built for independent client work
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              Run client work with more clarity and less admin.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100">
              Bring inquiries, clients, proposals, projects, invoices, and
              client visibility into one connected RelunoOS workspace.
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