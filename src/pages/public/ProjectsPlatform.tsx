import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  FolderKanban,
  KanbanSquare,
  ListChecks,
  MessageSquareText,
  Receipt,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const projectBenefits = [
  {
    icon: Target,
    title: "Turn sold work into a plan",
    description:
      "Move approved proposal details into a structured project instead of rebuilding the delivery plan from scratch.",
  },
  {
    icon: ListChecks,
    title: "Organize milestones and tasks",
    description:
      "Break larger client work into focused milestones, owners, priorities, and next actions.",
  },
  {
    icon: CalendarDays,
    title: "Keep timelines visible",
    description:
      "Track start dates, target dates, due dates, and delivery signals in the same place as the client work.",
  },
  {
    icon: KanbanSquare,
    title: "See what needs attention",
    description:
      "Give your team a clearer view of what is planned, in progress, blocked, ready for review, or complete.",
  },
  {
    icon: Users,
    title: "Keep client context connected",
    description:
      "See the client, proposal, invoice, project history, and delivery work without jumping between disconnected tools.",
  },
  {
    icon: MessageSquareText,
    title: "Create clearer updates",
    description:
      "Use visible milestones and progress to prepare client-ready updates without manually recreating project status.",
  },
];

const projectSteps = [
  {
    number: "01",
    title: "Create the project from approved work",
    description:
      "Use the approved proposal, client context, and scope as the starting point for delivery.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Break delivery into milestones",
    description:
      "Organize the major stages, tasks, dates, owners, and priorities needed to move work forward.",
    icon: FolderKanban,
  },
  {
    number: "03",
    title: "Keep progress visible",
    description:
      "Track delivery, review what needs attention, and give clients clearer updates as work moves forward.",
    icon: CheckCircle2,
  },
];

const milestones = [
  {
    title: "Discovery and planning",
    status: "Complete",
    color: "bg-emerald-500",
  },
  {
    title: "Design direction",
    status: "Complete",
    color: "bg-emerald-500",
  },
  {
    title: "Development",
    status: "In progress",
    color: "bg-blue-500",
  },
  {
    title: "Launch and handoff",
    status: "Planned",
    color: "bg-zinc-300",
  },
];

function ProjectDemoPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-[3rem] bg-violet-300/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/15 to-white/[0.04] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm">
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/20 p-3">
          <div className="mb-3 flex items-center gap-1.5 px-2">
            <span className="h-2 w-2 rounded-full bg-red-300/80" />
            <span className="h-2 w-2 rounded-full bg-amber-200/80" />
            <span className="h-2 w-2 rounded-full bg-emerald-200/80" />
            <span className="ml-2 text-[10px] font-medium text-blue-100/60">
              RelunoOS projects
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-blue-950/10">
            <img
              src="/projects-demo.svg"
              alt="RelunoOS project delivery workspace preview"
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <FolderKanban size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-zinc-900">
                      Website Redesign
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-500">
                      Northstar Studio · Example workspace
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                  On track
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Project progress
                  </p>

                  <p className="text-xs font-bold text-zinc-900">68%</p>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200">
                  <div className="h-full w-[68%] rounded-full bg-violet-600" />
                </div>

                <div className="mt-5 space-y-3">
                  {milestones.slice(0, 3).map((milestone) => (
                    <div
                      key={milestone.title}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="flex items-center gap-2 text-[11px] text-zinc-700">
                        <span
                          className={`h-2 w-2 rounded-full ${milestone.color}`}
                        />
                        {milestone.title}
                      </span>

                      <span className="text-[10px] text-zinc-500">
                        {milestone.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-zinc-200 bg-white p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    Open tasks
                  </p>

                  <p className="mt-1 text-lg font-bold text-zinc-900">7</p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    Target date
                  </p>

                  <p className="mt-1 text-xs font-semibold text-zinc-900">
                    Oct 28
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -left-6 top-14 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
          Project health
        </p>

        <p className="mt-1 text-sm font-bold text-white">On track</p>
      </div>

      <div className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
          Delivery flow
        </p>

        <p className="mt-1 text-xs font-semibold text-white">
          Scope → milestones
        </p>
      </div>
    </div>
  );
}

function MilestonePreview() {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_20px_50px_rgba(109,40,217,0.08)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <FolderKanban size={19} />
          </div>

          <div>
            <p className="text-sm font-bold text-zinc-900">
              Delivery plan
            </p>

            <p className="mt-1 text-[11px] text-zinc-500">
              Example project workspace
            </p>
          </div>
        </div>

        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
          Active
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
            Website Redesign
          </p>

          <p className="text-xs font-bold text-zinc-900">68%</p>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200">
          <div className="h-full w-[68%] rounded-full bg-violet-600" />
        </div>

        <div className="mt-5 space-y-3">
          {milestones.map((milestone) => (
            <div
              key={milestone.title}
              className="flex items-center justify-between gap-4"
            >
              <span className="flex items-center gap-2 text-[11px] text-zinc-700">
                <span
                  className={`h-2 w-2 rounded-full ${milestone.color}`}
                />
                {milestone.title}
              </span>

              <span className="text-[10px] text-zinc-500">
                {milestone.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-3">
        <span className="text-xs font-semibold text-violet-700">
          7 tasks still need attention
        </span>

        <ArrowRight size={16} className="text-violet-600" />
      </div>
    </div>
  );
}

export default function ProjectsPlatform() {
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
                  <FolderKanban size={13} />
                  Projects & Delivery
                </div>

                <h1 className="rise-in rise-in-delay-1 mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                  Move approved work into clear delivery.
                </h1>

                <p className="rise-in rise-in-delay-2 mt-7 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
                  Turn approved client work into projects, milestones, tasks,
                  priorities, and visible next steps—so your team can deliver
                  with more focus and clients can see progress with more
                  confidence.
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
                    Scope stays connected to delivery
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Check size={14} className="text-blue-200" />
                    Progress stays visible to your team
                  </span>
                </div>
              </div>

              <div className="rise-in rise-in-delay-2 relative mx-auto w-full max-w-3xl lg:max-w-none">
                <ProjectDemoPreview />
              </div>
            </div>
          </div>
        </section>

        {/* Workflow strip */}
        <section className="border-b border-zinc-100 bg-white py-7">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 sm:px-10 lg:flex-row lg:justify-between">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 lg:text-left">
              The delivery stage of a connected client workflow
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
                  <span
                    className={step === "Project" ? "text-[#063ee2]" : ""}
                  >
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
                From sold work to focused delivery
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                The work should not become unclear after the client says yes.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                Many teams sell a strong scope, then lose the structure inside
                scattered tasks, spreadsheets, chats, and status meetings. The
                connection between what was promised and what is being delivered
                becomes harder to see.
              </p>

              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-500">
                RelunoOS helps turn approved work into a delivery workspace with
                visible milestones, focused tasks, priorities, dates, project
                health, and client context all connected together.
              </p>
            </div>

            <MilestonePreview />
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Project delivery workspace
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Give every project a clearer path forward.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-500">
                Projects & Delivery gives agencies and freelancers one connected
                place to organize work, track progress, manage priorities, and
                keep the client relationship visible throughout delivery.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
              {projectBenefits.map((benefit) => {
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
        <section className="border-y border-zinc-100 bg-[#f5f7ff] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                How delivery works
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Move from approved scope to visible progress.
              </h2>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {projectSteps.map((step) => {
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

        {/* Project control */}
        <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Delivery with visibility
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                A clearer view of what is moving, blocked, and next.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                Strong client delivery depends on knowing where work stands.
                RelunoOS helps make milestones, priorities, tasks, dates, and
                project context visible so your team can focus on the next
                meaningful action.
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <FolderKanban size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-zinc-900">
                        Project overview
                      </p>

                      <p className="mt-1 text-[11px] text-zinc-500">
                        Connected delivery context
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                    On track
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    "Scope and proposal context",
                    "Milestones and delivery stages",
                    "Tasks, priorities, and due dates",
                    "Client updates and billing visibility",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white">
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
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-xs font-bold text-white"
                  >
                    View project
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-bold text-zinc-700"
                  >
                    Add task
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
                The approved proposal becomes a more useful delivery plan.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-500">
                As work moves forward, your client relationship, proposal
                context, project progress, invoice status, and Client Portal
                experience can remain connected in one RelunoOS workspace.
              </p>
            </div>

            <div className="mt-14 grid gap-3 md:grid-cols-7">
              {[
                { label: "Inquiry", href: "/platform" },
                { label: "AI Intake", href: "/platform/ai-intake" },
                { label: "CRM", href: "/platform/crm" },
                { label: "Proposal", href: "/platform/proposals" },
                {
                  label: "Project",
                  href: "/platform/projects",
                  active: true,
                },
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
              Deliver with clarity
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              Give every project a clearer path to completion.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100">
              Turn approved work into visible milestones, tasks, priorities, and
              delivery progress—while keeping the client relationship connected
              to the work.
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