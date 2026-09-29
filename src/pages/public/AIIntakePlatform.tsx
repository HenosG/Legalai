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
  ScanSearch,
  Sparkles,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const extractionItems = [
  {
    icon: Users,
    title: "Contact context",
    description:
      "Capture names, email addresses, companies, sources, and other details from the original inquiry.",
  },
  {
    icon: ClipboardList,
    title: "Project requirements",
    description:
      "Organize requested services, deliverables, goals, and requirements into a reviewable summary.",
  },
  {
    icon: CalendarDays,
    title: "Timeline signals",
    description:
      "Surface launch windows, deadlines, urgency, and timing questions that need attention.",
  },
  {
    icon: ScanSearch,
    title: "Qualification context",
    description:
      "Bring together the signals your team needs to decide whether the opportunity is a fit.",
  },
];

const sourceCards = [
  {
    icon: MessageSquareText,
    title: "Paste a client message",
    description:
      "Bring in an email, direct message, chat, or inquiry and start with the context you already have.",
  },
  {
    icon: ClipboardList,
    title: "Capture a website inquiry",
    description:
      "Turn incoming website leads into structured opportunities your team can review.",
  },
  {
    icon: FileText,
    title: "Use discovery notes",
    description:
      "Convert call notes and early conversations into clear next steps.",
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "Capture the inquiry",
    description:
      "Paste a message, submit a lead, or bring in an inquiry from your existing workflow.",
    icon: MessageSquareText,
  },
  {
    number: "02",
    title: "Review the context",
    description:
      "Review extracted requirements, timeline signals, company details, and missing information.",
    icon: ScanSearch,
  },
  {
    number: "03",
    title: "Choose the next step",
    description:
      "Accept the opportunity into CRM, follow up for more information, or begin a proposal draft.",
    icon: ArrowRight,
  },
];

function AiIntakeDemo() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-[3rem] bg-blue-300/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-3 shadow-[0_30px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm">
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/25 p-3">
          <div className="mb-3 flex items-center gap-1.5 px-2">
            <span className="h-2 w-2 rounded-full bg-red-300/80" />
            <span className="h-2 w-2 rounded-full bg-amber-200/80" />
            <span className="h-2 w-2 rounded-full bg-emerald-200/80" />
            <span className="ml-2 text-[10px] font-medium text-blue-100/60">
              RelunoOS AI Intake
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl">
            <img
              src="/3.svg"
              alt="RelunoOS AI Intake workspace showing an organized client opportunity"
              className="block h-auto w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
          Review state
        </p>
        <p className="mt-1 text-sm font-bold text-white">Ready for review</p>
      </div>

      <div className="absolute -right-5 top-10 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
          Next action
        </p>
        <p className="mt-1 text-xs font-semibold text-white">
          Accept into CRM
        </p>
      </div>
    </div>
  );
}

function MiniOpportunityPreview() {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_20px_50px_rgba(6,62,226,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
            <Sparkles size={18} />
          </div>

          <div>
            <p className="text-sm font-bold text-zinc-900">
              Opportunity summary
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">
              Generated for human review
            </p>
          </div>
        </div>

        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700">
          Review
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
          Original inquiry
        </p>

        <p className="mt-2 text-xs leading-5 text-zinc-700">
          “We need help with a new website, lead capture forms, and a client
          dashboard before our fall campaign.”
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-3">
          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            Project type
          </p>
          <p className="mt-1 text-xs font-semibold text-zinc-900">
            Website build
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

      <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3">
        <span className="text-[11px] font-semibold text-emerald-800">
          Lead qualification ready
        </span>
        <CheckCircle2 size={16} className="text-emerald-600" />
      </div>
    </div>
  );
}

export default function AIIntakePlatform() {
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
                  <Sparkles size={13} />
                  AI Intake
                </div>

                <h1 className="rise-in rise-in-delay-1 mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                  Turn scattered client messages into clear opportunities.
                </h1>

                <p className="rise-in rise-in-delay-2 mt-7 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
                  Paste a client message, bring in an inquiry, or start with a
                  lead form. RelunoOS organizes the details into a structured
                  opportunity so you can review what matters and decide the
                  next step.
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
                    Review before action
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Check size={14} className="text-blue-200" />
                    Context stays connected
                  </span>
                </div>
              </div>

              <div className="rise-in rise-in-delay-2 relative mx-auto w-full max-w-3xl lg:max-w-none">
                <AiIntakeDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Workflow strip */}
        <section className="border-b border-zinc-100 bg-white py-7">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 sm:px-10 lg:flex-row lg:justify-between">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 lg:text-left">
              The first step in a connected client workflow
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-semibold text-zinc-600">
              {[
                "Inquiry",
                "AI Intake",
                "CRM",
                "Proposal",
                "Project",
                "Invoice",
              ].map((step, index, items) => (
                <div key={step} className="flex items-center gap-3">
                  <span className={step === "AI Intake" ? "text-[#063ee2]" : ""}>
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

        {/* Product explanation */}
        <section className="border-b border-zinc-100 bg-[#fafafa] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                From message to momentum
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                The work should begin with context, not copy-and-paste.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                New opportunities rarely arrive in a clean format. They show up
                as emails, contact forms, direct messages, referral notes,
                discovery calls, and conversations with missing details.
              </p>

              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-500">
                AI Intake gives each inquiry a structured starting point. It
                gathers useful context, highlights what needs review, and helps
                your team decide whether to follow up, add the opportunity to
                CRM, or begin a proposal draft.
              </p>
            </div>

            <MiniOpportunityPreview />
          </div>
        </section>

        {/* Extracted information */}
        <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                What AI Intake organizes
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                A clearer starting point for every opportunity.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-500">
                AI Intake helps transform unstructured interest into a
                reviewable opportunity record. It helps your team see useful
                information faster without deciding the final scope, price, or
                client fit for you.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-4">
              {extractionItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="group bg-white p-7 transition-colors hover:bg-blue-50/40"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-[#063ee2]">
                      <Icon size={18} />
                    </div>

                    <h3 className="mt-6 text-base font-bold text-zinc-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Input sources */}
        <section className="border-y border-zinc-100 bg-[#f5f7ff] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Flexible starting points
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                One intake, multiple starting points.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-500">
                Your next opportunity may begin in a website inquiry, an email,
                a social message, a referral, or a conversation. RelunoOS gives
                those different starting points one consistent path into your
                client workflow.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {sourceCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="rounded-3xl border border-zinc-200 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(6,62,226,0.08)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
                      <Icon size={19} />
                    </div>

                    <h3 className="mt-6 text-lg font-bold tracking-tight text-zinc-900">
                      {card.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                      {card.description}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#063ee2]">
                      Review before action
                      <ArrowRight size={14} />
                    </div>
                  </article>
                );
              })}
            </div>

            <p className="mt-6 text-xs text-zinc-400">
              Available input methods depend on your workspace setup and
              connected workflows.
            </p>
          </div>
        </section>

        {/* Human review */}
        <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Review before action
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                AI makes the first pass. Your team makes the call.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                RelunoOS is designed to reduce repetitive admin work, not to
                replace your judgment about clients, scope, pricing, or
                delivery. You can review the extracted information, edit
                anything incomplete, and decide what happens before the
                opportunity moves forward.
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
                      <Sparkles size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-zinc-900">
                        Opportunity review
                      </p>

                      <p className="mt-1 text-[11px] text-zinc-500">
                        Human approval required
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700">
                    Needs review
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    "Review extracted requirements",
                    "Edit missing or incorrect details",
                    "Choose the next workflow action",
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

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#063ee2] px-4 py-3 text-xs font-bold text-white"
                  >
                    Accept into CRM
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-bold text-zinc-700"
                  >
                    Edit details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="border-y border-zinc-100 bg-[#f5f7ff] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Connected workflow
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Context follows the opportunity.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-500">
                Once your team accepts an opportunity, the useful details can
                stay connected as work moves through CRM, proposals, projects,
                invoices, payments, and the Client Portal.
              </p>
            </div>

            <div className="mt-14 grid gap-3 md:grid-cols-7">
              {[
                { label: "Inquiry", href: "/platform" },
                { label: "AI Intake", href: "/platform/ai-intake", active: true },
                { label: "CRM", href: "/platform/crm" },
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
              Start with clarity
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              Give every new opportunity a better starting point.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100">
              Turn raw inquiries into organized, reviewable opportunities and
              move into CRM, proposals, projects, and payment with less
              friction.
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