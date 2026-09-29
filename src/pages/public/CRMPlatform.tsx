import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardList,
  FileText,
  FolderKanban,
  MessageSquareText,
  Receipt,
  ScanSearch,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const crmBenefits = [
  {
    icon: Users,
    title: "Client profiles",
    description:
      "Keep names, companies, contact details, and relationship information together in one connected record.",
  },
  {
    icon: MessageSquareText,
    title: "Opportunity history",
    description:
      "See inquiry context, qualification notes, proposals, projects, and payment stages connected to the same client.",
  },
  {
    icon: ClipboardList,
    title: "Notes and activity",
    description:
      "Keep internal context, client notes, and recent operational actions visible to the people doing the work.",
  },
  {
    icon: FileText,
    title: "Proposal context",
    description:
      "Move from client record to proposal without rebuilding the same relationship details from scratch.",
  },
  {
    icon: FolderKanban,
    title: "Project visibility",
    description:
      "See active work, milestones, delivery status, and next priorities alongside the relationship.",
  },
  {
    icon: Receipt,
    title: "Invoice history",
    description:
      "Track invoiced, paid, outstanding, and overdue work without opening another disconnected system.",
  },
];

const crmWorkflowSteps = [
  {
    number: "01",
    title: "Capture relationship context",
    description:
      "Bring client details, company information, notes, and inquiry history into one profile.",
    icon: Users,
  },
  {
    number: "02",
    title: "Keep the work connected",
    description:
      "Link proposals, projects, invoices, and client activity back to the same relationship.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "See the next priority",
    description:
      "Give your team the context needed to follow up, deliver work, or manage payment with less searching.",
    icon: ArrowRight,
  },
];

const clientTabs = [
  "Overview",
  "Notes",
  "Proposals",
  "Projects",
  "Invoices",
];

function CRMDemoPreview() {
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
              RelunoOS CRM
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-blue-950/10">
            <img
              src="/crm-demo.svg"
              alt="RelunoOS CRM client profile and relationship workspace preview"
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
                    <Users size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-zinc-900">
                      Northstar Studio
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-500">
                      Active client · Example workspace
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                  Active
                </span>
              </div>

              <div className="mt-5 flex gap-4 overflow-x-auto border-b border-zinc-100 pb-3">
                {clientTabs.map((tab, index) => (
                  <span
                    key={tab}
                    className={`shrink-0 text-[10px] font-bold ${
                      index === 0 ? "text-[#063ee2]" : "text-zinc-400"
                    }`}
                  >
                    {tab}
                  </span>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    Current opportunity
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-zinc-900">
                    Website redesign
                  </p>
                  <p className="mt-1 text-[10px] text-zinc-500">
                    Proposal under review
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    Open balance
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-zinc-900">
                    $8,500 CAD
                  </p>
                  <p className="mt-1 text-[10px] text-zinc-500">
                    Invoice ready to send
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    Recent activity
                  </p>

                  <span className="text-[10px] font-semibold text-[#063ee2]">
                    View all
                  </span>
                </div>

                <div className="mt-3 space-y-3">
                  {[
                    "Proposal draft created",
                    "Discovery notes added",
                    "Project opportunity reviewed",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center justify-between gap-3 text-[11px]"
                    >
                      <span className="flex items-center gap-2 text-zinc-700">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            index === 0
                              ? "bg-blue-500"
                              : index === 1
                              ? "bg-violet-500"
                              : "bg-emerald-500"
                          }`}
                        />
                        {item}
                      </span>

                      <span className="text-zinc-400">
                        {index === 0 ? "Today" : `${index + 1} days ago`}
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
          Client context
        </p>
        <p className="mt-1 text-sm font-bold text-white">Always connected</p>
      </div>

      <div className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
          Relationship state
        </p>
        <p className="mt-1 text-xs font-semibold text-white">
          Lead → active client
        </p>
      </div>
    </div>
  );
}

function ClientProfilePreview() {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_20px_50px_rgba(6,62,226,0.08)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
            <Users size={19} />
          </div>

          <div>
            <p className="text-sm font-bold text-zinc-900">
              Client relationship
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">
              Example workspace view
            </p>
          </div>
        </div>

        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
          Active
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
          Northstar Studio
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              Proposal
            </p>
            <p className="mt-1 text-xs font-semibold text-zinc-900">
              In review
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              Project
            </p>
            <p className="mt-1 text-xs font-semibold text-zinc-900">
              Planning
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {[
          {
            icon: MessageSquareText,
            label: "Inquiry context",
            value: "Website redesign opportunity",
          },
          {
            icon: FileText,
            label: "Proposal status",
            value: "Draft ready for review",
          },
          {
            icon: Receipt,
            label: "Billing context",
            value: "No invoice sent",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-3.5 py-3"
            >
              <span className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                <Icon size={14} className="text-[#063ee2]" />
                {item.label}
              </span>

              <span className="text-[10px] text-zinc-500">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CRMPlatform() {
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
                  <Users size={13} />
                  CRM & Contacts
                </div>

                <h1 className="rise-in rise-in-delay-1 mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                  Keep every client relationship in one connected record.
                </h1>

                <p className="rise-in rise-in-delay-2 mt-7 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
                  RelunoOS brings contact details, inquiry history, notes,
                  proposals, projects, invoices, and client activity into one
                  workspace—so your team can understand the relationship
                  without searching through disconnected tools.
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
                    to="/platform"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                  >
                    Explore the platform
                    <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="rise-in rise-in-delay-3 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-blue-100/90">
                  <span className="inline-flex items-center gap-2">
                    <Check size={14} className="text-blue-200" />
                    Client history stays visible
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Check size={14} className="text-blue-200" />
                    Context follows the work
                  </span>
                </div>
              </div>

              <div className="rise-in rise-in-delay-2 relative mx-auto w-full max-w-3xl lg:max-w-none">
                <CRMDemoPreview />
              </div>
            </div>
          </div>
        </section>

        {/* Workflow strip */}
        <section className="border-b border-zinc-100 bg-white py-7">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 sm:px-10 lg:flex-row lg:justify-between">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 lg:text-left">
              The relationship layer of your client workflow
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
                  <span className={step === "CRM" ? "text-[#063ee2]" : ""}>
                    {step}
                  </span>

                  {index !== items.length - 1 && (
                    <ArrowRight size={13} className="text-blue-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem and solution */}
        <section className="border-b border-zinc-100 bg-[#fafafa] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Relationship context
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Client context should not disappear after the first conversation.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                Every interaction adds context to a relationship. A client
                inquiry becomes a proposal, the proposal becomes a project,
                the project creates delivery history, and delivery leads to a
                payment request.
              </p>

              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-500">
                RelunoOS helps keep that operational history connected, so your
                team can see what was discussed, what was promised, what is
                being delivered, and what still needs attention.
              </p>
            </div>

            <ClientProfilePreview />
          </div>
        </section>

        {/* CRM feature grid */}
        <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Client relationship workspace
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                One place to understand the relationship behind the work.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-500">
                CRM & Contacts gives your team a clearer view of who the client
                is, what has happened so far, and which next action matters
                most.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
              {crmBenefits.map((benefit) => {
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

        {/* Workflow steps */}
        <section className="border-y border-zinc-100 bg-[#f5f7ff] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                How CRM works
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Keep the relationship connected from first inquiry to final payment.
              </h2>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {crmWorkflowSteps.map((step) => {
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

        {/* Relationship control */}
        <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Built for clarity
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                The right client context should be visible when your team needs it.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                CRM is not just a list of names. It is the operational record
                that helps your team understand the work, relationships,
                decisions, and follow-ups connected to each client.
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
                      <Users size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-zinc-900">
                        Client record
                      </p>

                      <p className="mt-1 text-[11px] text-zinc-500">
                        Connected operational context
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                    Active
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    "Inquiry and opportunity context",
                    "Proposal and scope history",
                    "Project progress and internal notes",
                    "Invoice and payment visibility",
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
                    View client record
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-bold text-zinc-700"
                  >
                    Add a note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Connected workflow */}
        <section className="border-y border-zinc-100 bg-[#f5f7ff] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Connected workflow
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Context follows the client from first message to final payment.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-500">
                The CRM record helps keep useful relationship context connected
                as work moves through proposals, projects, invoices, payment,
                and the Client Portal.
              </p>
            </div>

            <div className="mt-14 grid gap-3 md:grid-cols-7">
              {[
                { label: "Inquiry", href: "/platform" },
                { label: "AI Intake", href: "/platform/ai-intake" },
                { label: "CRM", href: "/platform/crm", active: true },
                { label: "Proposal", href: "/platform/proposals" },
                { label: "Project", href: "/platform/projects" },
                { label: "Invoice", href: "/platform/invoices" },
                { label: "Client Portal", href: "/platform/client-portal" },
              ].map((step, index, items) => (
                <div key={step.label} className="flex items-center gap-3">
                  <Link
                    to={step.href}
                    className={`flex min-h-16 flex-1 items-center justify-center rounded-2xl border px-3 text-center text-xs font-bold transition-all ${
                      step.active
                        ? "border-[#063ee2] bg-[#063ee2] text-white shadow-[0_12px_24px_rgba(6,62,226,0.18)]"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    {step.label}
                  </Link>

                  {index !== items.length - 1 && (
                    <ArrowRight
                      size={15}
                      className="hidden shrink-0 text-[#063ee2] md:block"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="hero-grid relative isolate overflow-hidden px-6 py-24 text-white sm:px-10 sm:py-32">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.13)_0%,rgba(3,26,117,0.68)_72%,rgba(1,11,51,0.92)_100%)]" />

          <div className="hero-stripes pointer-events-none absolute inset-0 opacity-40" />

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-blue-100">
              Build stronger client context
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              Keep every client relationship connected to the work.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100">
              Give your team a clearer place to manage contact details,
              opportunities, proposals, projects, invoices, and client history.
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