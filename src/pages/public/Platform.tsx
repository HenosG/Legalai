import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  FileText,
  FolderKanban,
  Globe2,
  LayoutDashboard,
  MessageSquareText,
  Receipt,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const platformModules = [
  {
    eyebrow: "AI INTAKE",
    title: "Turn raw client messages into clear opportunities.",
    description:
      "Bring in a message, form submission, referral, or early client note. RelunoOS organizes requirements, contact context, timing, budget signals, and next-step questions for human review.",
    bullets: [
      "Structure inquiry details before they get lost",
      "Review AI-generated opportunity summaries",
      "Move accepted opportunities into CRM",
    ],
    icon: Sparkles,
    href: "/platform/ai-intake",
    accent: "blue",
  },
  {
    eyebrow: "CRM & CONTACTS",
    title: "Keep every client relationship in one connected record.",
    description:
      "Keep client details, notes, opportunities, proposals, projects, invoices, payments, and activity connected so your team can understand the relationship behind the work.",
    bullets: [
      "Keep client context visible across the workflow",
      "Link opportunities, projects, invoices, and notes",
      "See what needs attention without searching tools",
    ],
    icon: Users,
    href: "/platform/crm",
    accent: "violet",
  },
  {
    eyebrow: "PROPOSALS",
    title: "Turn client context into a clearer decision.",
    description:
      "Build proposals with scope, investment, timeline, responsibilities, and next steps using the relationship context your team already has.",
    bullets: [
      "Start with client and inquiry context",
      "Review scope and investment before sending",
      "Turn approved work into a project starting point",
    ],
    icon: FileText,
    href: "/platform/proposals",
    accent: "indigo",
  },
  {
    eyebrow: "PROJECTS & DELIVERY",
    title: "Move approved work into visible delivery.",
    description:
      "Turn sold work into milestones, tasks, due dates, priorities, progress, and delivery context that remain connected to the client relationship.",
    bullets: [
      "Organize work through milestones and tasks",
      "Track progress, priorities, and delivery health",
      "Keep approved scope connected to execution",
    ],
    icon: FolderKanban,
    href: "/platform/projects",
    accent: "violet",
  },
  {
    eyebrow: "INVOICES & PAYMENTS",
    title: "Turn completed work into clear payment requests.",
    description:
      "Create connected invoices from the client and project work you already manage, then track invoice and payment status in one workspace.",
    bullets: [
      "Create invoices with clear line items and due dates",
      "Connect invoices to clients, projects, and proposals",
      "Collect online payments through Stripe when enabled",
    ],
    icon: Receipt,
    href: "/platform/invoices",
    accent: "cyan",
  },
  {
    eyebrow: "CLIENT PORTAL",
    title: "Give clients one clear place to follow the work.",
    description:
      "Create a focused client-facing view of approved work, project progress, documents, invoices, payments, and important next steps.",
    bullets: [
      "Share approved project progress clearly",
      "Keep documents and invoices easier to find",
      "Control what clients can see from your workspace",
    ],
    icon: Globe2,
    href: "/platform/client-portal",
    accent: "blue",
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "Capture the inquiry",
    description:
      "Bring raw client interest into one reviewable starting point instead of letting details disappear across email, forms, DMs, and notes.",
    icon: MessageSquareText,
  },
  {
    number: "02",
    title: "Keep context connected",
    description:
      "Move useful client information through CRM, proposals, projects, invoices, and client-facing visibility without rebuilding it every time.",
    icon: Workflow,
  },
  {
    number: "03",
    title: "Move work forward clearly",
    description:
      "Give your team and clients a clearer view of scope, delivery, payment, and the next action that matters.",
    icon: CheckCircle2,
  },
];

function PlatformDemoPreview() {
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
              src="/platform-demo.svg"
              alt="RelunoOS connected client workflow workspace preview"
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
                      Client operations workspace
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-500">
                      Example RelunoOS overview
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                  Connected
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "New inquiries", value: "8", color: "text-blue-600" },
                  { label: "Open proposals", value: "4", color: "text-violet-600" },
                  { label: "Active projects", value: "7", color: "text-emerald-600" },
                  { label: "Outstanding", value: "$14k", color: "text-amber-600" },
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

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-200 bg-white p-3.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    Current opportunity
                  </p>

                  <p className="mt-1.5 text-xs font-semibold text-zinc-900">
                    Website redesign
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-500">
                    AI Intake ready for review
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-3.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    Project delivery
                  </p>

                  <p className="mt-1.5 text-xs font-semibold text-zinc-900">
                    Launch campaign site
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-500">
                    68% complete · On track
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#063ee2]">
                    Context stays connected across the workflow
                  </span>

                  <CheckCircle2 size={16} className="text-[#063ee2]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -left-6 top-14 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
          One workflow
        </p>

        <p className="mt-1 text-sm font-bold text-white">
          Inquiry → payment
        </p>
      </div>

      <div className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
          Client context
        </p>

        <p className="mt-1 text-xs font-semibold text-white">
          Always connected
        </p>
      </div>
    </div>
  );
}

function ModulePreview({
  type,
}: {
  type: "intake" | "crm" | "proposal" | "project" | "invoice" | "portal";
}) {
  if (type === "intake") {
    return (
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl shadow-blue-950/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#063ee2]">
              <Sparkles size={16} />
            </div>

            <div>
              <p className="text-xs font-semibold text-zinc-900">AI Intake</p>
              <p className="text-[10px] text-zinc-500">
                New opportunity review
              </p>
            </div>
          </div>

          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700">
            Review
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
            Incoming inquiry
          </p>

          <p className="mt-2 text-xs leading-5 text-zinc-700">
            “We need help with a website refresh, lead capture forms, and a
            client dashboard before our fall campaign.”
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              Project type
            </p>
            <p className="mt-1 text-xs font-semibold text-zinc-900">
              Website redesign
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              Timeline
            </p>
            <p className="mt-1 text-xs font-semibold text-zinc-900">
              Fall campaign
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
          <span className="text-[11px] font-semibold text-emerald-800">
            Ready for human review
          </span>
          <CheckCircle2 size={15} className="text-emerald-600" />
        </div>
      </div>
    );
  }

  if (type === "crm") {
    return (
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl shadow-violet-950/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <Users size={16} />
            </div>

            <div>
              <p className="text-xs font-semibold text-zinc-900">
                Northstar Studio
              </p>
              <p className="text-[10px] text-zinc-500">
                Active client · Example workspace
              </p>
            </div>
          </div>

          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
            Active
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              Open proposal
            </p>
            <p className="mt-1 text-xs font-semibold text-zinc-900">
              Website redesign
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              Invoice status
            </p>
            <p className="mt-1 text-xs font-semibold text-zinc-900">
              $8,500 due
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-3">
          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            Recent activity
          </p>

          <div className="mt-3 space-y-2.5">
            {[
              "Proposal draft created",
              "Discovery notes added",
              "Project opportunity reviewed",
            ].map((item, index) => (
              <div key={item} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[11px] text-zinc-700">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      index === 0
                        ? "bg-violet-500"
                        : index === 1
                        ? "bg-blue-500"
                        : "bg-emerald-500"
                    }`}
                  />
                  {item}
                </span>

                <span className="text-[10px] text-zinc-400">
                  {index === 0 ? "Today" : `${index + 1}d ago`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "proposal") {
    return (
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl shadow-indigo-950/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <FileText size={16} />
            </div>

            <div>
              <p className="text-xs font-semibold text-zinc-900">
                Website Redesign Proposal
              </p>
              <p className="text-[10px] text-zinc-500">
                Northstar Studio · Draft
              </p>
            </div>
          </div>

          <span className="rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-600">
            Draft
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
            Scope of work
          </p>

          <div className="mt-3 space-y-2.5">
            {[
              "Discovery and technical planning",
              "Responsive website design",
              "Lead capture workflow",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[11px] text-zinc-700">
                <Check size={13} className="shrink-0 text-indigo-600" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between rounded-xl border border-zinc-200 bg-white p-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              Total investment
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-zinc-900">
              $8,500 CAD
            </p>
          </div>

          <span className="rounded-lg bg-indigo-600 px-3 py-2 text-[10px] font-bold text-white">
            Review & send
          </span>
        </div>
      </div>
    );
  }

  if (type === "project") {
    return (
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl shadow-violet-950/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <FolderKanban size={16} />
            </div>

            <div>
              <p className="text-xs font-semibold text-zinc-900">
                Website Redesign
              </p>
              <p className="text-[10px] text-zinc-500">Northstar Studio</p>
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
      </div>
    );
  }

  if (type === "invoice") {
    return (
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl shadow-cyan-950/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
              <Receipt size={16} />
            </div>

            <div>
              <p className="text-xs font-semibold text-zinc-900">
                Invoice INV-2026-014
              </p>
              <p className="text-[10px] text-zinc-500">Northstar Studio</p>
            </div>
          </div>

          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-700">
            Open
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
              Amount due
            </p>
            <p className="text-lg font-bold tracking-tight text-zinc-900">
              $8,500 CAD
            </p>
          </div>

          <div className="mt-4 space-y-2.5 border-t border-zinc-200 pt-4">
            {[
              "Discovery and planning",
              "Website design",
              "Development and launch",
            ].map((item) => (
              <div key={item} className="flex justify-between gap-4 text-[11px]">
                <span className="text-zinc-700">{item}</span>
                <span className="font-semibold text-zinc-900">Included</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
          <span className="text-[11px] font-semibold text-emerald-800">
            Ready for payment collection
          </span>
          <CircleDollarSign size={15} className="text-emerald-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl shadow-blue-950/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
            <Globe2 size={16} />
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-900">
              Northstar Studio Portal
            </p>
            <p className="text-[10px] text-zinc-500">
              Example client view
            </p>
          </div>
        </div>

        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
          Active
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            Project
          </p>
          <p className="mt-1 text-xs font-semibold text-zinc-900">
            68% complete
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            Documents
          </p>
          <p className="mt-1 text-xs font-semibold text-zinc-900">
            4 shared
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            Invoice
          </p>
          <p className="mt-1 text-xs font-semibold text-zinc-900">
            Payment due
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2.5">
        <span className="text-[11px] font-semibold text-cyan-800">
          New project update available
        </span>
      </div>
    </div>
  );
}

export default function Platform() {
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
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/25 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
            <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
              <div className="max-w-2xl">
                <div className="rise-in inline-flex items-center gap-2 rounded-lg border border-blue-400/40 bg-blue-600/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur-md">
                  <Workflow size={13} />
                  The RelunoOS platform
                </div>

                <h1 className="rise-in rise-in-delay-1 mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                  One connected operating system for client work.
                </h1>

                <p className="rise-in rise-in-delay-2 mt-7 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
                  RelunoOS connects every stage of the client workflow—from the
                  first inquiry through structured intake, client context,
                  proposals, delivery, invoices, payment, and client visibility.
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
                    Built for agencies and freelancers
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Check size={14} className="text-blue-200" />
                    AI-assisted, human-controlled
                  </span>
                </div>
              </div>

              <div className="rise-in rise-in-delay-2 relative mx-auto w-full max-w-3xl lg:max-w-none">
                <PlatformDemoPreview />
              </div>
            </div>
          </div>
        </section>

        {/* Connected workflow strip */}
        <section className="border-b border-zinc-100 bg-white py-7">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 sm:px-10 lg:flex-row lg:justify-between">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 lg:text-left">
              One connected workflow for client work
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

        {/* Problem */}
        <section className="border-b border-zinc-100 bg-[#fafafa] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                  The operating layer
                </p>

                <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                  Client work should not live across six disconnected tools.
                </h2>
              </div>

              <div>
                <p className="max-w-2xl text-base leading-7 text-zinc-500">
                  Agencies and freelancers often manage the same client across
                  inboxes, forms, spreadsheets, notes, proposal documents,
                  project tools, invoicing software, and shared links. The
                  client relationship becomes fragmented and teams spend time
                  copying information instead of doing meaningful work.
                </p>

                <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-500">
                  RelunoOS brings the operational stages behind client work
                  into one connected workspace—so useful context remains
                  visible as the relationship moves from inquiry to delivery,
                  payment, and client visibility.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow stages */}
        <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Every stage connected
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                From the first message to finished client work.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-500">
                Each module has a distinct purpose, but they work together as
                one connected client operating system.
              </p>
            </div>

            <div className="mt-20 space-y-24 sm:space-y-32">
              {platformModules.map((module, index) => {
                const Icon = module.icon;
                const reverse = index % 2 !== 0;

                const accentClasses =
                  module.accent === "blue"
                    ? {
                        badge:
                          "border-blue-100 bg-blue-50 text-blue-700",
                        icon: "bg-[#063ee2]",
                        visual:
                          "from-[#063ee2] via-blue-700 to-indigo-900",
                      }
                    : module.accent === "violet"
                    ? {
                        badge:
                          "border-violet-100 bg-violet-50 text-violet-700",
                        icon: "bg-violet-600",
                        visual:
                          "from-violet-700 via-violet-800 to-indigo-950",
                      }
                    : module.accent === "indigo"
                    ? {
                        badge:
                          "border-indigo-100 bg-indigo-50 text-indigo-700",
                        icon: "bg-indigo-600",
                        visual:
                          "from-indigo-700 via-indigo-800 to-slate-900",
                      }
                    : module.accent === "cyan"
                    ? {
                        badge:
                          "border-cyan-100 bg-cyan-50 text-cyan-700",
                        icon: "bg-cyan-600",
                        visual:
                          "from-cyan-700 via-blue-800 to-indigo-950",
                      }
                    : {
                        badge:
                          "border-blue-100 bg-blue-50 text-blue-700",
                        icon: "bg-[#063ee2]",
                        visual:
                          "from-[#063ee2] via-blue-700 to-indigo-900",
                      };

                const previewType =
                  module.eyebrow === "AI INTAKE"
                    ? "intake"
                    : module.eyebrow === "CRM & CONTACTS"
                    ? "crm"
                    : module.eyebrow === "PROPOSALS"
                    ? "proposal"
                    : module.eyebrow === "PROJECTS & DELIVERY"
                    ? "project"
                    : module.eyebrow === "INVOICES & PAYMENTS"
                    ? "invoice"
                    : "portal";

                return (
                  <div
                    key={module.title}
                    className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20"
                  >
                    <div className={reverse ? "lg:order-2" : ""}>
                      <div
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] ${accentClasses.badge}`}
                      >
                        <Icon size={12} />
                        {module.eyebrow}
                      </div>

                      <h3 className="mt-6 text-3xl font-bold leading-[1.05] tracking-[-0.04em] text-zinc-900 sm:text-4xl">
                        {module.title}
                      </h3>

                      <p className="mt-5 max-w-xl text-base leading-7 text-zinc-500">
                        {module.description}
                      </p>

                      <ul className="mt-7 space-y-3">
                        {module.bullets.map((bullet) => (
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
                        to={module.href}
                        className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#063ee2] transition-colors hover:text-blue-800"
                      >
                        Explore {module.eyebrow.toLowerCase()}
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </div>

                    <div
                      className={`rounded-[2rem] bg-gradient-to-br p-6 shadow-2xl shadow-blue-950/15 sm:p-9 ${accentClasses.visual} ${
                        reverse ? "lg:order-1" : ""
                      }`}
                    >
                      <ModulePreview
                        type={
                          previewType as
                            | "intake"
                            | "crm"
                            | "proposal"
                            | "project"
                            | "invoice"
                            | "portal"
                        }
                      />
                    </div>
                  </div>
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
                How it works
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Move client work forward with less friction.
              </h2>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {workflowSteps.map((step) => {
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
        <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Built for control
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                AI helps create the starting point. Your team makes the decisions.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                RelunoOS can help organize incoming information and reduce
                repeated administrative work, but your team remains responsible
                for client qualification, scope, pricing, approvals,
                communication, delivery, and payment decisions.
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
                        Human approval workflow
                      </p>

                      <p className="mt-1 text-[11px] text-zinc-500">
                        Important client actions remain reviewable
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#063ee2]">
                    You decide
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    "Review inquiries before adding them to CRM",
                    "Edit scope, pricing, and timeline before proposals",
                    "Control delivery priorities and client visibility",
                    "Choose when invoices and payment collection are enabled",
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
                    View client workflow
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
              Start with clarity
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              Bring every stage of client work into one connected workspace.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100">
              From raw inquiries to client context, proposals, delivery,
              invoices, payment, and client visibility—RelunoOS helps your team
              run the workflow with less friction.
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