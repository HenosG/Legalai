import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MessageSquareText,
  Receipt,
  Send,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const workflowSteps = [
  {
    number: "01",
    title: "Capture the inquiry",
    description:
      "Paste a client message, submit a lead, or bring in an inquiry from your existing workflow.",
    icon: MessageSquareText,
  },
  {
    number: "02",
    title: "Qualify the opportunity",
    description:
      "AI organizes requirements, budget context, timeline, and the next best action for review.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Send the proposal",
    description:
      "Turn qualified information into a professional proposal that you can review, edit, and send.",
    icon: FileText,
  },
  {
    number: "04",
    title: "Deliver with clarity",
    description:
      "Move approved work into projects, milestones, tasks, and client-ready updates.",
    icon: FolderKanban,
  },
];

const featureShowcases = [
  {
    eyebrow: "AI INTAKE",
    title: "Turn scattered client messages into clear opportunities.",
    description:
      "RelunoOS turns unstructured inquiries into organized lead records with contact details, project requirements, budget context, timelines, and qualification signals.",
    bullets: [
      "Capture requirements from raw messages",
      "Review AI-generated lead summaries",
      "Accept qualified leads into your CRM",
    ],
    icon: Sparkles,
    accent: "blue",
    preview: "intake",
  },
  {
    eyebrow: "SMART PROPOSALS",
    title: "Go from qualified lead to polished proposal without starting over.",
    description:
      "Use the context already captured in AI Intake and CRM to create proposals with the right client, scope, budget, timeline, and next steps already in place.",
    bullets: [
      "Build proposal drafts from real client context",
      "Edit scope, investment, and timeline before sending",
      "Keep proposals connected to clients and projects",
    ],
    icon: FileText,
    accent: "indigo",
    preview: "proposal",
  },
  {
    eyebrow: "PROJECT DELIVERY",
    title: "Keep every client engagement moving forward.",
    description:
      "Organize active work through milestones, tasks, progress tracking, project health, and a clear delivery view for your team and clients.",
    bullets: [
      "Move approved work into structured projects",
      "Track milestones, priorities, and due dates",
      "Keep project context connected to the original client",
    ],
    icon: FolderKanban,
    accent: "violet",
    preview: "project",
  },
];

const operatingSystemItems = [
  {
    icon: Sparkles,
    title: "AI Intake",
    description: "Structure leads before they become missed opportunities.",
  },
  {
    icon: Users,
    title: "CRM",
    description: "Keep client relationships, notes, and history in one place.",
  },
  {
    icon: FileText,
    title: "Proposals",
    description: "Create clear scopes and investment decisions faster.",
  },
  {
    icon: FolderKanban,
    title: "Projects",
    description: "Turn sold work into focused milestones and delivery.",
  },
  {
    icon: Receipt,
    title: "Invoices",
    description: "Connect delivery and billing as your finance workflow grows.",
  },
  {
    icon: LayoutDashboard,
    title: "Workspace visibility",
    description: "See the work, clients, and priorities that need attention.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Explore the RelunoOS workflow and organize your essentials.",
    features: [
      "AI Intake workspace",
      "Client CRM essentials",
      "Proposal drafting",
      "Project workspace",
    ],
    cta: "Start free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "Coming soon",
    period: "for solo operators",
    description: "Built for freelancers who want a more connected client workflow.",
    features: [
      "Everything in Free",
      "Higher workspace limits",
      "Advanced proposal workflows",
      "Project delivery tools",
      "Priority product access",
    ],
    cta: "View pricing",
    href: "/pricing",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "Coming soon",
    period: "for growing agencies",
    description: "More control, visibility, and collaboration for client teams.",
    features: [
      "Everything in Starter",
      "Team workflow controls",
      "Client portal access",
      "Advanced workspace settings",
      "Priority support",
    ],
    cta: "View pricing",
    href: "/pricing",
    highlighted: false,
  },
];

function ProductPreview({
  type,
}: {
  type: "intake" | "proposal" | "project";
}) {
  if (type === "intake") {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl shadow-blue-950/10">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 p-2 text-blue-600">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900">AI Intake</p>
              <p className="text-[10px] text-zinc-500">New opportunity review</p>
            </div>
          </div>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700 border border-amber-200">
            Review
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
            Incoming inquiry
          </p>
          <p className="mt-2 text-xs leading-5 text-zinc-700">
            “We need help with a new website, lead forms, and a client dashboard.
            Our target launch is this fall.”
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              Project type
            </p>
            <p className="mt-1 text-xs font-semibold text-zinc-900">Website build</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              Timeline
            </p>
            <p className="mt-1 text-xs font-semibold text-zinc-900">This fall</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
          <span className="text-[11px] font-semibold text-emerald-800">
            Lead qualification ready
          </span>
          <CheckCircle2 size={15} className="text-emerald-600" />
        </div>
      </div>
    );
  }

  if (type === "proposal") {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl shadow-indigo-950/10">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <FileText size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900">Project Proposal</p>
              <p className="text-[10px] text-zinc-500">Draft · Apex Studio</p>
            </div>
          </div>
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-600 border border-zinc-200">
            Draft
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
            Scope of work
          </p>
          <div className="mt-3 space-y-2.5">
            {[
              "Discovery and technical planning",
              "Responsive website design",
              "Lead capture and client portal",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[11px] text-zinc-700">
                <Check size={13} className="shrink-0 text-indigo-600" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              Total investment
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-zinc-900">$8,500 CAD</p>
          </div>
          <span className="rounded-lg bg-indigo-600 px-3 py-2 text-[10px] font-bold text-white shadow-sm">
            Review & send
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl shadow-violet-950/10">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-violet-50 p-2 text-violet-600">
            <FolderKanban size={16} />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-900">Website Redesign</p>
            <p className="text-[10px] text-zinc-500">Apex Logistics</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
          On track
        </span>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
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
          {[
            { label: "Discovery", complete: true },
            { label: "Design direction", complete: true },
            { label: "Development", complete: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[11px] text-zinc-700">
                <span
                  className={`h-2 w-2 rounded-full ${
                    item.complete ? "bg-emerald-500" : "bg-violet-400"
                  }`}
                />
                {item.label}
              </span>
              <span className="text-[10px] text-zinc-500">
                {item.complete ? "Complete" : "In progress"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            Open tasks
          </p>
          <p className="mt-1 text-lg font-bold text-zinc-900">7</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            Target date
          </p>
          <p className="mt-1 text-xs font-semibold text-zinc-900">Oct 28</p>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAFAFA] text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap");

        .font-display {
          font-family: "DM Serif Display", serif;
        }

        .font-body {
          font-family: "DM Sans", sans-serif;
        }

        * {
          font-family: "DM Sans", sans-serif;
        }

        .hero-grid {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 42px 42px;
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
        {/* Hero Section */}
<section className="relative isolate overflow-hidden bg-[#063ee2] pb-24 pt-36 text-white sm:pb-32 sm:pt-44 border-b border-blue-700">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
  <div className="absolute left-1/2 top-[-100px] h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl pointer-events-none" />

  <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
    <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
      <div className="max-w-3xl">
        <div className="rise-in inline-flex items-center rounded-lg border border-blue-400/40 bg-blue-600/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur-md">
          Built for agencies and freelancers
        </div>

                <h1 className="rise-in rise-in-delay-1 mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                  Run your client workflow on autopilot.
                </h1>

                <p className="rise-in rise-in-delay-2 mt-7 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
                  RelunoOS turns scattered client work into one connected system—
                  from the first inquiry to qualified lead, proposal, project,
                  delivery, and payment.
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
                    See how it works
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

              <div className="rise-in rise-in-delay-2 relative mx-auto w-full max-w-xl lg:max-w-none">
                <div className="absolute -left-6 top-14 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
                    Lead score
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">High fit</p>
                </div>

                <div className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
                    Workflow
                  </p>
                  <p className="mt-1 text-xs font-semibold text-white">
                    Inquiry → Project
                  </p>
                </div>

                <div className="rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/15 to-white/[0.04] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.25)] backdrop-blur-sm">
                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/20 p-3">
                    <div className="mb-3 flex items-center gap-1.5 px-2">
                      <span className="h-2 w-2 rounded-full bg-red-300/80" />
                      <span className="h-2 w-2 rounded-full bg-amber-200/80" />
                      <span className="h-2 w-2 rounded-full bg-emerald-200/80" />
                      <span className="ml-2 text-[10px] font-medium text-blue-100/60">
                        RelunoOS workspace
                      </span>
                    </div>

                    <ProductPreview type="intake" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Agency operating system strip */}
        <section className="border-b border-zinc-100 bg-white py-7">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 sm:px-10 lg:flex-row lg:justify-between">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 lg:text-left">
              One connected workflow for client work
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-semibold text-zinc-600">
              {["Inquiry", "AI Intake", "CRM", "Proposal", "Project", "Payment"].map(
                (step, index, items) => (
                  <div key={step} className="flex items-center gap-3">
                    <span>{step}</span>
                    {index !== items.length - 1 && (
                      <ArrowRight size={13} className="text-blue-600" />
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Problem / operating system */}
        <section className="border-b border-zinc-100 bg-[#FAFAFA] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                  The operating layer
                </p>

                <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                  Your client workflow should not live across six disconnected tools.
                </h2>
              </div>

              <p className="max-w-2xl text-base leading-7 text-zinc-500">
                RelunoOS brings lead capture, client records, proposals, project
                delivery, and operational visibility into one workspace—so your
                team spends less time copying information and more time doing
                meaningful client work.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
              {operatingSystemItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group bg-white p-7 transition-colors hover:bg-blue-50/40"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-[#063ee2]">
                      <Icon size={18} />
                    </div>

                    <h3 className="mt-6 text-base font-bold text-zinc-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Feature showcases */}
        <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Built around the way agencies work
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                From the first message to finished client work.
              </h2>
            </div>

            <div className="mt-20 space-y-24 sm:space-y-32">
              {featureShowcases.map((feature, index) => {
                const Icon = feature.icon;
                const reverse = index % 2 !== 0;

                const accentClasses =
                  feature.accent === "blue"
                    ? {
                        badge: "bg-blue-50 text-blue-700 border-blue-100",
                        icon: "bg-blue-600",
                        visual: "from-[#063ee2] via-blue-700 to-indigo-900",
                      }
                    : feature.accent === "indigo"
                    ? {
                        badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
                        icon: "bg-indigo-600",
                        visual: "from-indigo-700 via-indigo-800 to-slate-900",
                      }
                    : {
                        badge: "bg-violet-50 text-violet-700 border-violet-100",
                        icon: "bg-violet-600",
                        visual: "from-violet-700 via-violet-800 to-indigo-950",
                      };

                return (
                  <div
                    key={feature.title}
                    className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20"
                  >
                    <div className={reverse ? "lg:order-2" : ""}>
                      <div
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] ${accentClasses.badge}`}
                      >
                        <Icon size={12} />
                        {feature.eyebrow}
                      </div>

                      <h3 className="mt-6 text-3xl font-bold leading-[1.05] tracking-[-0.04em] text-zinc-900 sm:text-4xl">
                        {feature.title}
                      </h3>

                      <p className="mt-5 max-w-xl text-base leading-7 text-zinc-500">
                        {feature.description}
                      </p>

                      <ul className="mt-7 space-y-3">
                        {feature.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-3 text-sm leading-6 text-zinc-700"
                          >
                            <span
                              className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white ${accentClasses.icon}`}
                            >
                              <Check size={11} strokeWidth={3} />
                            </span>
                            {bullet}
                          </li>
                        ))}
                      </ul>

                      <Link
                        to={
                          feature.preview === "intake"
                            ? "/platform/ai-intake"
                            : feature.preview === "proposal"
                            ? "/platform/proposals"
                            : "/platform/projects"
                        }
                        className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#063ee2] transition-colors hover:text-blue-800"
                      >
                        Explore {feature.eyebrow.toLowerCase()}
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </div>

                    <div
                      className={`rounded-[2rem] bg-gradient-to-br p-6 sm:p-9 ${accentClasses.visual} ${
                        reverse ? "lg:order-1" : ""
                      }`}
                    >
                      <ProductPreview type={feature.preview as "intake" | "proposal" | "project"} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Workflow steps */}
        <section className="border-y border-zinc-100 bg-[#F5F7FF] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                How it works
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Move from first inquiry to active project with less friction.
              </h2>
            </div>

            <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {workflowSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="relative rounded-2xl border border-blue-100/80 bg-white p-6 shadow-[0_10px_30px_rgba(6,62,226,0.05)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-[0.18em] text-[#063ee2]">
                        {step.number}
                      </span>

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
                        <Icon size={17} />
                      </div>
                    </div>

                    <h3 className="mt-7 text-base font-bold text-zinc-900">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Human control / comparison */}
        <section className="border-b border-zinc-100 bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Built for trust
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                AI helps with the first draft. You stay in control.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                RelunoOS is not built to replace your client relationships. It
                helps organize the operational work behind them, while you review,
                edit, approve, and control every important client-facing action.
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

            <div className="overflow-hidden rounded-3xl border border-zinc-200">
              <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-zinc-200 bg-zinc-50">
                <div className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                  Workflow
                </div>
                <div className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                  Without RelunoOS
                </div>
                <div className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#063ee2]">
                  With RelunoOS
                </div>
              </div>
              <div className="divide-y divide-zinc-200 bg-white text-xs text-zinc-700">
                <div className="grid grid-cols-[1.1fr_1fr_1fr] px-5 py-3.5">
                  <span className="font-semibold text-zinc-900">Lead Capture</span>
                  <span className="text-zinc-500">Scattered across email, chat, DMs</span>
                  <span className="font-medium text-blue-600">Unified AI intake & CRM</span>
                </div>
                <div className="grid grid-cols-[1.1fr_1fr_1fr] px-5 py-3.5">
                  <span className="font-semibold text-zinc-900">Proposals</span>
                  <span className="text-zinc-500">Starting from scratch every time</span>
                  <span className="font-medium text-blue-600">Pre-filled from lead context</span>
                </div>
                <div className="grid grid-cols-[1.1fr_1fr_1fr] px-5 py-3.5">
                  <span className="font-semibold text-zinc-900">Projects</span>
                  <span className="text-zinc-500">Manual tracking in spreadsheets</span>
                  <span className="font-medium text-blue-600">Structured tasks & milestones</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}