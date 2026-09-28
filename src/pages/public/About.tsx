import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Compass,
  FileText,
  FolderKanban,
  HeartHandshake,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const principles = [
  {
    icon: Workflow,
    number: "01",
    title: "Connected over complicated",
    description:
      "Client work should move forward without being copied across disconnected tools, inboxes, spreadsheets, and documents.",
  },
  {
    icon: HeartHandshake,
    number: "02",
    title: "Human relationships first",
    description:
      "Software should strengthen the work between you and your clients, not replace the judgment, trust, and care behind it.",
  },
  {
    icon: Sparkles,
    number: "03",
    title: "AI with real control",
    description:
      "AI should help structure information and create a first draft, while people remain responsible for review, decisions, and delivery.",
  },
  {
    icon: ShieldCheck,
    number: "04",
    title: "Clarity creates momentum",
    description:
      "When the next step is clear, teams move faster, clients stay informed, and important work is less likely to fall through the cracks.",
  },
];

const fragmentationPoints = [
  "Inquiries scattered across email, forms, and direct messages",
  "Proposals built from scratch without leveraging prior client context",
  "Projects tracked in isolated tools disconnected from communication",
];

function Eyebrow({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <p
      className={`text-[10px] font-bold uppercase tracking-[0.28em] ${
        dark ? "text-blue-100" : "text-[#063ee2]"
      }`}
    >
      {children}
    </p>
  );
}

function WorkflowPreview() {
  const steps = [
    { label: "Inquiry", active: true },
    { label: "AI Intake", active: true },
    { label: "Proposal", active: true },
    { label: "Project", active: false },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-4 shadow-[0_30px_70px_rgba(0,0,0,0.28)] backdrop-blur-md">
      <div className="rounded-[1.35rem] border border-white/10 bg-slate-950/25 p-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-300/80" />
          <span className="h-2 w-2 rounded-full bg-amber-200/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-200/80" />
          <span className="ml-2 text-[10px] font-medium text-blue-100/65">
            RelunoOS workspace
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-white/15 bg-white p-4 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
                <Sparkles size={17} />
              </div>

              <div>
                <p className="text-xs font-bold text-zinc-900">
                  New client opportunity
                </p>
                <p className="mt-0.5 text-[10px] text-zinc-500">
                  From first message to a clear next step
                </p>
              </div>
            </div>

            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#063ee2]">
              Active
            </span>
          </div>

          <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-400">
              The connected workflow
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {steps.map((step, index) => (
                <div key={step.label} className="flex items-center gap-2">
                  <span
                    className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold ${
                      step.active
                        ? "bg-[#063ee2] text-white"
                        : "border border-zinc-200 bg-white text-zinc-500"
                    }`}
                  >
                    {step.label}
                  </span>

                  {index < steps.length - 1 && (
                    <ArrowRight size={12} className="text-zinc-300" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                Client context
              </p>
              <p className="mt-1 text-xs font-semibold text-zinc-900">
                Stays connected
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                Next action
              </p>
              <p className="mt-1 text-xs font-semibold text-zinc-900">
                Review proposal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FragmentationCardPreview() {
  return (
    <div className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-[#063ee2] via-blue-700 to-indigo-950 p-6 shadow-2xl shadow-blue-950/20 sm:p-9">
      <div className="rounded-3xl border border-white/20 bg-white p-6 shadow-xl sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
            <Workflow size={22} />
          </div>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
            High Fragmentation
          </span>
        </div>

        <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
          The Old Way
        </p>

        <p className="mt-3 text-2xl font-bold leading-[1.12] tracking-[-0.035em] text-zinc-900 sm:text-3xl">
          Disconnected tools create hidden friction for your team and clients.
        </p>

        <div className="mt-6 space-y-3">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-700">Inboxes & Forms</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Siloed</span>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-700">Spreadsheets & Docs</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Disconnected</span>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-700">Project & Invoicing Tools</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Fragmented</span>
          </div>
        </div>

        <div className="mt-8 h-px bg-zinc-100" />

        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
            <Check size={17} strokeWidth={3} />
          </div>
          <p className="text-sm font-semibold text-zinc-700">
            RelunoOS brings every step into one clear operating system.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const navigate = useNavigate();

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
            <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
              <div className="max-w-3xl">
                <div className="rise-in inline-flex items-center rounded-lg border border-blue-400/40 bg-blue-600/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur-md">
                  About RelunoOS
                </div>

                <h1 className="rise-in rise-in-delay-1 mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                  We believe client work should feel more connected.
                </h1>

                <p className="rise-in rise-in-delay-2 mt-7 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
                  RelunoOS is building a calmer operating system for agencies,
                  freelancers, and client-service teams—from the first inquiry
                  to proposal, delivery, payment, and everything in between.
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
                    Built for client-service businesses
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Check size={14} className="text-blue-200" />
                    AI-assisted, human-controlled
                  </span>
                </div>
              </div>

              <div className="rise-in rise-in-delay-2 relative mx-auto w-full max-w-xl lg:max-w-none">
                <WorkflowPreview />
              </div>
            </div>
          </div>
        </section>

        {/* Intro strip */}
        <section className="border-b border-zinc-100 bg-white py-7">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 sm:px-10 lg:flex-row lg:justify-between">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 lg:text-left">
              Built around the reality of client work
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-semibold text-zinc-600">
              {[
                "Relationships",
                "Context",
                "Clarity",
                "Delivery",
                "Momentum",
              ].map((item, index, items) => (
                <div key={item} className="flex items-center gap-3">
                  <span>{item}</span>
                  {index !== items.length - 1 && (
                    <ArrowRight size={13} className="text-blue-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why we exist */}
        <section className="border-b border-zinc-100 bg-[#fafafa] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <div>
                <Eyebrow>Why we exist</Eyebrow>

                <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                  Great client work gets harder when the workflow is scattered.
                </h2>

                <p className="mt-6 text-base leading-7 text-zinc-500">
                  Agencies and freelancers often manage the same client across
                  email, forms, DMs, spreadsheets, documents, project tools,
                  invoicing tools, and notes. That fragmentation creates more
                  admin work, less visibility, and too many opportunities for
                  important context to disappear.
                </p>

                <div className="mt-8 space-y-4">
                  {fragmentationPoints.map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#063ee2]">
                        <Check size={13} strokeWidth={3} />
                      </div>
                      <p className="text-sm font-medium text-zinc-700">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-8 text-base leading-7 text-zinc-600 font-medium">
                  RelunoOS exists to connect those moments into one operating
                  layer—without taking away the human judgment that good client
                  relationships depend on.
                </p>
              </div>

              <div>
                <FragmentationCardPreview />
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <Eyebrow>Our mission</Eyebrow>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Give client-service teams a better way to operate.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                We are building RelunoOS so the operational side of client work
                feels less repetitive, less fragmented, and more intentional.
                The goal is not to automate relationships away. It is to create
                more room for strong thinking, good communication, and great
                delivery.
              </p>

              <Link
                to="/platform"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#063ee2] transition-colors hover:text-blue-800"
              >
                See the RelunoOS platform
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-[#063ee2] via-blue-700 to-indigo-950 p-6 shadow-2xl shadow-blue-950/15 sm:p-9">
              <div className="rounded-3xl border border-white/20 bg-white p-6 shadow-xl sm:p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
                  <Compass size={21} />
                </div>

                <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                  What we are building toward
                </p>

                <p className="mt-4 text-2xl font-bold leading-[1.12] tracking-[-0.035em] text-zinc-900 sm:text-3xl">
                  One connected workspace where every client interaction has
                  context, every project has direction, and every next step is
                  easier to see.
                </p>

                <div className="mt-8 h-px bg-zinc-100" />

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Check size={17} strokeWidth={3} />
                  </div>

                  <p className="text-sm font-semibold text-zinc-700">
                    Designed to support people—not replace them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="border-y border-zinc-100 bg-[#f5f7ff] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <Eyebrow>How we build</Eyebrow>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Principles behind the product.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-500">
                RelunoOS is guided by a few simple beliefs about how modern
                client operations should work.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2">
              {principles.map((principle) => {
                const Icon = principle.icon;

                return (
                  <article
                    key={principle.number}
                    className="group bg-white p-7 transition-colors hover:bg-blue-50/50 sm:p-8"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-[#063ee2] transition-colors group-hover:border-blue-200 group-hover:bg-blue-50">
                        <Icon size={19} />
                      </div>

                      <span className="text-xs font-bold tracking-widest text-zinc-300">
                        {principle.number}
                      </span>
                    </div>

                    <h3 className="mt-7 text-xl font-bold tracking-tight text-zinc-900">
                      {principle.title}
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
                      {principle.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Human control */}
        <section className="border-b border-zinc-100 bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <Eyebrow>Built for trust</Eyebrow>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                AI helps with the first draft. You stay in control.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                AI can help organize an inquiry, summarize client context, and
                speed up the beginning of a proposal. But client relationships
                need judgment. You review, edit, approve, and control every
                important client-facing action.
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
              <div className="grid grid-cols-[1.05fr_1fr_1fr] border-b border-zinc-200 bg-zinc-50">
                <div className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                  Moment
                </div>

                <div className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                  AI helps
                </div>

                <div className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#063ee2]">
                  You decide
                </div>
              </div>

              <div className="divide-y divide-zinc-200 bg-white text-xs text-zinc-700">
                <div className="grid grid-cols-[1.05fr_1fr_1fr] px-5 py-4">
                  <span className="font-semibold text-zinc-900">
                    Client inquiry
                  </span>
                  <span className="text-zinc-500">
                    Organizes requirements and context
                  </span>
                  <span className="font-medium text-blue-600">
                    Whether the lead is a fit
                  </span>
                </div>

                <div className="grid grid-cols-[1.05fr_1fr_1fr] px-5 py-4">
                  <span className="font-semibold text-zinc-900">
                    Proposal draft
                  </span>
                  <span className="text-zinc-500">
                    Creates a structured starting point
                  </span>
                  <span className="font-medium text-blue-600">
                    Scope, investment, and final message
                  </span>
                </div>

                <div className="grid grid-cols-[1.05fr_1fr_1fr] px-5 py-4">
                  <span className="font-semibold text-zinc-900">
                    Project delivery
                  </span>
                  <span className="text-zinc-500">
                    Keeps milestones and context organized
                  </span>
                  <span className="font-medium text-blue-600">
                    Priorities, delivery, and communication
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#063EE2] px-6 py-24 text-white sm:px-10 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow dark>Start with clarity</Eyebrow>

            <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              Build a calmer way to run client work.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100">
              Bring client inquiries, proposals, projects, delivery, and
              operational visibility into one connected RelunoOS workspace.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/signup")}
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#063EE2] shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-0.5 hover:bg-blue-50 cursor-pointer"
              >
                Start free
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Talk to us
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