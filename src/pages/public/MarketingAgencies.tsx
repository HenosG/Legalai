import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  FolderKanban,
  Layers3,
  LineChart,
  MessageSquareText,
  Receipt,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const marketingChallenges = [
  {
    icon: MessageSquareText,
    title: "Campaign requests arrive without enough context",
    description:
      "New clients may ask for ads, content, social, email, strategy, or reporting before the objectives, budget, audience, and timeline are clear.",
  },
  {
    icon: Layers3,
    title: "Retainer work becomes hard to see",
    description:
      "Monthly deliverables, campaign priorities, approvals, project work, invoices, and client requests can become scattered across tools and conversations.",
  },
  {
    icon: CalendarDays,
    title: "Deadlines and deliverables move quickly",
    description:
      "Campaign calendars, launch dates, creative approvals, reporting cycles, and client feedback all need visible ownership and next steps.",
  },
  {
    icon: Receipt,
    title: "Billing loses connection to delivered value",
    description:
      "Invoices often live separately from the campaigns, deliverables, and progress that clients are paying for.",
  },
];

const marketingBenefits = [
  {
    icon: Sparkles,
    title: "Structure campaign inquiries",
    description:
      "Turn raw client requests into reviewable opportunities with goals, timing, budget signals, channels, and next-step questions.",
  },
  {
    icon: Users,
    title: "Keep account context connected",
    description:
      "Store client details, campaign goals, notes, opportunities, projects, invoices, and communication history together.",
  },
  {
    icon: FileText,
    title: "Create clearer retainers and scopes",
    description:
      "Define deliverables, channels, reporting cadence, investment, timelines, and client responsibilities before work begins.",
  },
  {
    icon: FolderKanban,
    title: "Manage recurring delivery",
    description:
      "Organize campaign work, content production, approvals, monthly priorities, and team tasks in one connected project workspace.",
  },
  {
    icon: BarChart3,
    title: "Keep progress visible",
    description:
      "Give your team a clearer view of campaign work, client priorities, delivery stages, and account health.",
  },
  {
    icon: Receipt,
    title: "Connect work and payment",
    description:
      "Create invoices from the client and project context your agency is already managing.",
  },
];

const marketingWorkflow = [
  {
    number: "01",
    title: "Capture campaign context",
    description:
      "Bring the client request, goals, channels, timeline, budget signals, and missing questions into a structured starting point.",
    icon: ClipboardCheck,
  },
  {
    number: "02",
    title: "Align the scope and plan",
    description:
      "Create a clear proposal or retainer scope with deliverables, timelines, priorities, and investment expectations.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Run recurring client work with visibility",
    description:
      "Manage monthly delivery, approvals, invoices, and client updates from one connected workspace.",
    icon: TrendingUp,
  },
];

const campaignStages = [
  {
    title: "Strategy and planning",
    detail: "Goals, audience, budget, channels, and launch direction.",
    status: "Complete",
    color: "bg-emerald-500",
  },
  {
    title: "Creative and campaign setup",
    detail: "Content, creative approvals, tracking, and launch assets.",
    status: "In progress",
    color: "bg-blue-500",
  },
  {
    title: "Optimization and reporting",
    detail: "Performance review, priorities, learnings, and next actions.",
    status: "Upcoming",
    color: "bg-zinc-300",
  },
];

function MarketingAgencyDemoPreview() {
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
              RelunoOS marketing workspace
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-blue-950/10">
            <img
              src="/marketing-agencies-demo.svg"
              alt="RelunoOS marketing agency workspace preview"
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
                    <Target size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-zinc-900">
                      Growth campaign retainer
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-500">
                      Northstar Studio · Example workspace
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                  Active
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  {
                    label: "Monthly scope",
                    value: "Active",
                    color: "text-blue-600",
                  },
                  {
                    label: "Campaigns",
                    value: "3",
                    color: "text-violet-600",
                  },
                  {
                    label: "Tasks due",
                    value: "8",
                    color: "text-amber-600",
                  },
                  {
                    label: "Invoice",
                    value: "$4.5k",
                    color: "text-emerald-600",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 p-3"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                      {item.label}
                    </p>

                    <p className={`mt-1.5 text-sm font-bold ${item.color}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Monthly delivery
                  </p>

                  <p className="text-xs font-bold text-zinc-900">61%</p>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200">
                  <div className="h-full w-[61%] rounded-full bg-blue-600" />
                </div>

                <div className="mt-5 space-y-3">
                  {campaignStages.map((stage) => (
                    <div
                      key={stage.title}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${stage.color}`}
                        />

                        <span className="min-w-0">
                          <span className="block truncate text-[11px] font-semibold text-zinc-700">
                            {stage.title}
                          </span>

                          <span className="block truncate text-[10px] text-zinc-400">
                            {stage.detail}
                          </span>
                        </span>
                      </span>

                      <span className="shrink-0 text-[10px] text-zinc-500">
                        {stage.status}
                      </span>
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
          Retainer workflow
        </p>

        <p className="mt-1 text-sm font-bold text-white">
          Scope → delivery
        </p>
      </div>

      <div className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
          Client visibility
        </p>

        <p className="mt-1 text-xs font-semibold text-white">
          Priorities → updates
        </p>
      </div>
    </div>
  );
}

function MarketingWorkflowPreview() {
  const stages = [
    {
      icon: Sparkles,
      title: "Campaign inquiry",
      subtitle: "Goals and context organized",
      status: "Review",
      statusClass: "border-blue-200 bg-blue-50 text-blue-700",
    },
    {
      icon: FileText,
      title: "Retainer scope",
      subtitle: "Deliverables and investment",
      status: "Approved",
      statusClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    {
      icon: LineChart,
      title: "Monthly delivery",
      subtitle: "Campaign priorities visible",
      status: "Active",
      statusClass: "border-violet-200 bg-violet-50 text-violet-700",
    },
    {
      icon: Receipt,
      title: "Client invoice",
      subtitle: "Billing connected to work",
      status: "Due",
      statusClass: "border-amber-200 bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_20px_50px_rgba(6,62,226,0.08)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
            <TrendingUp size={19} />
          </div>

          <div>
            <p className="text-sm font-bold text-zinc-900">
              Connected account workflow
            </p>

            <p className="mt-1 text-[11px] text-zinc-500">
              Example marketing-agency view
            </p>
          </div>
        </div>

        <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#063ee2]">
          Active
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {stages.map((stage) => {
          const Icon = stage.icon;

          return (
            <div
              key={stage.title}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#063ee2] shadow-sm">
                  <Icon size={15} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-800">
                    {stage.title}
                  </p>

                  <p className="mt-0.5 text-[10px] text-zinc-500">
                    {stage.subtitle}
                  </p>
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${stage.statusClass}`}
              >
                {stage.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MarketingAgencies() {
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
                  <TrendingUp size={13} />
                  Built for marketing agencies
                </div>

                <h1 className="rise-in rise-in-delay-1 mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                  Keep every campaign, client, and monthly priority connected.
                </h1>

                <p className="rise-in rise-in-delay-2 mt-7 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
                  RelunoOS helps marketing agencies turn campaign inquiries into
                  clear scopes, manage recurring client delivery, organize
                  priorities, invoices, and client updates, and keep the work
                  visible across the whole account.
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
                    Clearer retainer scope and delivery
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Check size={14} className="text-blue-200" />
                    More visible campaign priorities
                  </span>
                </div>
              </div>

              <div className="rise-in rise-in-delay-2 relative mx-auto w-full max-w-3xl lg:max-w-none">
                <MarketingAgencyDemoPreview />
              </div>
            </div>
          </div>
        </section>

        {/* Workflow strip */}
        <section className="border-b border-zinc-100 bg-white py-7">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 sm:px-10 lg:flex-row lg:justify-between">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 lg:text-left">
              One connected workflow for recurring client work
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-semibold text-zinc-600">
              {[
                "Inquiry",
                "AI Intake",
                "CRM",
                "Scope",
                "Campaign",
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

        {/* Challenges */}
        <section className="border-b border-zinc-100 bg-[#fafafa] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                  Marketing operations
                </p>

                <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                  Client marketing work moves too quickly for disconnected tools.
                </h2>
              </div>

              <p className="max-w-2xl text-base leading-7 text-zinc-500">
                Marketing agencies manage more than campaign tasks. They manage
                client goals, channel priorities, scope, creative approvals,
                reporting cycles, account communication, recurring invoices,
                and the changing work that happens each month. That needs a
                connected operating workflow.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2">
              {marketingChallenges.map((challenge) => {
                const Icon = challenge.icon;

                return (
                  <article
                    key={challenge.title}
                    className="group bg-white p-7 transition-colors hover:bg-blue-50/40 sm:p-8"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-[#063ee2]">
                      <Icon size={19} />
                    </div>

                    <h3 className="mt-7 text-xl font-bold tracking-tight text-zinc-900">
                      {challenge.title}
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
                      {challenge.description}
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
                Connected account management
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Keep monthly client work connected to the account context behind it.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                RelunoOS helps marketing agencies capture the client request,
                define the retainer scope, organize campaign delivery, manage
                project priorities, create invoices, and give clients clearer
                visibility into the work.
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

            <MarketingWorkflowPreview />
          </div>
        </section>

        {/* Benefits */}
        <section className="border-y border-zinc-100 bg-[#f5f7ff] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Built for marketing client work
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Give every account a clearer path from strategy to delivery.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-500">
                RelunoOS helps keep account context, campaign planning,
                recurring delivery, client communication, invoices, and payment
                visibility connected in one operating system.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
              {marketingBenefits.map((benefit) => {
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
                How marketing agencies use RelunoOS
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Move from campaign inquiry to recurring delivery with less friction.
              </h2>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {marketingWorkflow.map((step) => {
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
                Agency strategy stays human
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                AI can organize account context. Your team owns the strategy.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                Client marketing requires judgment about audience, channels,
                creative direction, campaign priorities, investment, and
                performance. RelunoOS can help organize operational context,
                but your team owns the strategic decisions and client-facing
                work.
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
                      <Target size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-zinc-900">
                        Account review workflow
                      </p>

                      <p className="mt-1 text-[11px] text-zinc-500">
                        Important decisions stay with your team
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#063ee2]">
                    Human review
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    "Review campaign goals and client context",
                    "Define scope, channels, and investment",
                    "Approve client-facing proposals and updates",
                    "Keep delivery, reporting, and billing visible",
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
                    Review account
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
              Built for marketing client work
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              Bring every client account into one clearer operating system.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100">
              Connect campaign inquiries, client context, scope, recurring
              delivery, invoices, and client visibility inside one RelunoOS
              workspace.
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