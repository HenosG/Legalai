import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileText,
  FolderKanban,
  LockKeyhole,
  MessageSquareText,
  Receipt,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const portalBenefits = [
  {
    icon: UserRound,
    title: "A clear client home",
    description:
      "Give clients one organized place to view the work, instead of searching through scattered email threads and links.",
  },
  {
    icon: FolderKanban,
    title: "Visible project progress",
    description:
      "Share approved milestones, delivery progress, and relevant project information in a clearer client experience.",
  },
  {
    icon: FileText,
    title: "Connected documents",
    description:
      "Keep approved proposals, shared documents, and delivery materials available in the context of the client relationship.",
  },
  {
    icon: Receipt,
    title: "Invoice visibility",
    description:
      "Give clients a clear place to find invoice information and payment status when payment features are enabled.",
  },
  {
    icon: MessageSquareText,
    title: "Clearer client updates",
    description:
      "Use visible project context to make updates easier to prepare and easier for clients to understand.",
  },
  {
    icon: LockKeyhole,
    title: "Controlled access",
    description:
      "Configure client-facing access around your workspace and decide what information should be visible.",
  },
];

const portalSteps = [
  {
    number: "01",
    title: "Invite the client",
    description:
      "Give the right client a clear route into their project information, documents, and relevant next steps.",
    icon: Users,
  },
  {
    number: "02",
    title: "Share the right context",
    description:
      "Make approved project progress, documents, proposals, and invoices easier to find in one place.",
    icon: ClipboardCheck,
  },
  {
    number: "03",
    title: "Keep delivery visible",
    description:
      "Use a clearer client experience to reduce unnecessary status requests and make next actions easier to understand.",
    icon: CheckCircle2,
  },
];

const portalSections = [
  {
    title: "Project progress",
    detail:
      "Show the stages and milestones that matter to the client without exposing internal delivery noise.",
    icon: FolderKanban,
  },
  {
    title: "Documents and approvals",
    detail:
      "Keep shared proposals, documents, and approval-ready items connected to the engagement.",
    icon: FileText,
  },
  {
    title: "Invoices and payments",
    detail:
      "Make invoice status and payment information easier to locate when online payment collection is enabled.",
    icon: Receipt,
  },
];

function ClientPortalDemoPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-[3rem] bg-cyan-300/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/15 to-white/[0.04] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm">
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/20 p-3">
          <div className="mb-3 flex items-center gap-1.5 px-2">
            <span className="h-2 w-2 rounded-full bg-red-300/80" />
            <span className="h-2 w-2 rounded-full bg-amber-200/80" />
            <span className="h-2 w-2 rounded-full bg-emerald-200/80" />
            <span className="ml-2 text-[10px] font-medium text-blue-100/60">
              RelunoOS client portal
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-blue-950/10">
            <img
              src="/client-portal-demo.svg"
              alt="RelunoOS client portal preview"
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <UserRound size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-zinc-900">
                      Northstar Studio Portal
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-500">
                      Website Redesign · Example client view
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                  Active
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    Project
                  </p>

                  <p className="mt-1.5 text-xs font-semibold text-zinc-900">
                    68% complete
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    Documents
                  </p>

                  <p className="mt-1.5 text-xs font-semibold text-zinc-900">
                    4 shared files
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    Invoice
                  </p>

                  <p className="mt-1.5 text-xs font-semibold text-zinc-900">
                    Payment due
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Website Redesign progress
                  </p>

                  <p className="text-xs font-bold text-zinc-900">68%</p>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200">
                  <div className="h-full w-[68%] rounded-full bg-cyan-500" />
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    { label: "Discovery and planning", status: "Complete" },
                    { label: "Design direction", status: "Complete" },
                    { label: "Development", status: "In progress" },
                  ].map((item, index) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="flex items-center gap-2 text-[11px] text-zinc-700">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            index < 2 ? "bg-emerald-500" : "bg-cyan-500"
                          }`}
                        />
                        {item.label}
                      </span>

                      <span className="text-[10px] text-zinc-500">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-cyan-200 bg-cyan-50 px-3.5 py-3">
                <span className="text-xs font-semibold text-cyan-800">
                  New project update available
                </span>

                <Bell size={16} className="text-cyan-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -left-6 top-14 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
          Client view
        </p>

        <p className="mt-1 text-sm font-bold text-white">Clear and branded</p>
      </div>

      <div className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
          Shared context
        </p>

        <p className="mt-1 text-xs font-semibold text-white">
          Progress → payment
        </p>
      </div>
    </div>
  );
}

function PortalWorkspacePreview() {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_20px_50px_rgba(6,62,226,0.08)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
            <UserRound size={19} />
          </div>

          <div>
            <p className="text-sm font-bold text-zinc-900">
              Client workspace
            </p>

            <p className="mt-1 text-[11px] text-zinc-500">
              Example shared experience
            </p>
          </div>
        </div>

        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
          Visible
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
          Website Redesign
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              Project status
            </p>

            <p className="mt-1 text-xs font-semibold text-zinc-900">
              On track
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              Next milestone
            </p>

            <p className="mt-1 text-xs font-semibold text-zinc-900">
              Development
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {[
          {
            icon: FolderKanban,
            label: "Project progress",
            value: "68% complete",
          },
          {
            icon: FileText,
            label: "Shared documents",
            value: "4 available",
          },
          {
            icon: Receipt,
            label: "Invoice status",
            value: "Payment due",
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

export default function ClientPortalPlatform() {
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
                  Client Portal
                </div>

                <h1 className="rise-in rise-in-delay-1 mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                  Give clients one clear place to follow the work.
                </h1>

                <p className="rise-in rise-in-delay-2 mt-7 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
                  Give clients a branded, organized view of approved work,
                  project progress, shared documents, invoices, and important
                  updates—without forcing them to search through scattered
                  messages and links.
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
                    Branded client experience
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Check size={14} className="text-blue-200" />
                    Clear access to approved work
                  </span>
                </div>
              </div>

              <div className="rise-in rise-in-delay-2 relative mx-auto w-full max-w-3xl lg:max-w-none">
                <ClientPortalDemoPreview />
              </div>
            </div>
          </div>
        </section>

        {/* Workflow strip */}
        <section className="border-b border-zinc-100 bg-white py-7">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 sm:px-10 lg:flex-row lg:justify-between">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 lg:text-left">
              The client-facing layer of your connected workflow
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
                    className={
                      step === "Client Portal" ? "text-[#063ee2]" : ""
                    }
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
                Client clarity
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Clients should not have to search through emails to understand the work.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                When project updates, documents, approvals, invoices, and next
                steps are scattered across messages and attachments, clients
                are left guessing where to look. That creates more check-ins,
                more confusion, and more operational friction for everyone.
              </p>

              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-500">
                The Client Portal gives your team a clearer place to share the
                information that matters, while keeping your internal workspace
                focused on the work behind the relationship.
              </p>
            </div>

            <PortalWorkspacePreview />
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Client-facing workspace
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Make it easier for clients to see what matters.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-500">
                Client Portal brings approved work, visible progress, shared
                documents, and payment context into a more organized
                client-facing experience.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
              {portalBenefits.map((benefit) => {
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

        {/* How portal works */}
        <section className="border-y border-zinc-100 bg-[#f5f7ff] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                How the portal works
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Share the right view with the right client.
              </h2>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {portalSteps.map((step) => {
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

        {/* Control and privacy */}
        <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Controlled client access
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Your internal workspace stays yours. The portal is the client view.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                Agencies need a client experience that feels organized without
                exposing every internal note, task, or operational detail. The
                Client Portal is designed around showing clients the information
                that is relevant to their work.
              </p>

              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-500">
                Workspace settings can determine the portal’s branding, access
                approach, visible project information, shared documents,
                proposal visibility, and invoice access.
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                      <ShieldCheck size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-zinc-900">
                        Portal settings
                      </p>

                      <p className="mt-1 text-[11px] text-zinc-500">
                        Client-facing access controls
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                    Enabled
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    "Show approved project progress",
                    "Share selected documents and proposals",
                    "Make invoice information available",
                    "Keep internal notes and tasks private",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-white">
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
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-xs font-bold text-white"
                  >
                    Preview portal
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-bold text-zinc-700"
                  >
                    Adjust access
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
                The client experience should reflect the work your team is already managing.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-500">
                Client Portal becomes the client-facing layer of a connected
                workflow, bringing the relevant proposal, project, document,
                invoice, and payment context together in one clearer view.
              </p>
            </div>

            <div className="mt-14 grid gap-3 md:grid-cols-7">
              {[
                { label: "Inquiry", href: "/platform" },
                { label: "AI Intake", href: "/platform/ai-intake" },
                { label: "CRM", href: "/platform/crm" },
                { label: "Proposal", href: "/platform/proposals" },
                { label: "Project", href: "/platform/projects" },
                { label: "Invoice", href: "/platform/invoices" },
                {
                  label: "Client Portal",
                  href: "/platform/client-portal",
                  active: true,
                },
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
              Create a clearer client experience
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              Give clients a better place to follow the work.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100">
              Bring approved work, progress, documents, invoices, and important
              client information into one organized client-facing workspace.
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