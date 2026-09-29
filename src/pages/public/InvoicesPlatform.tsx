import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  FileText,
  FolderKanban,
  Receipt,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const invoiceBenefits = [
  {
    icon: FileText,
    title: "Create from real client context",
    description:
      "Build invoices for the right client without re-entering the same business details from scratch.",
  },
  {
    icon: Receipt,
    title: "Keep line items clear",
    description:
      "Add services, deliverables, quantities, rates, due dates, and client-facing notes in one focused workflow.",
  },
  {
    icon: FolderKanban,
    title: "Connect delivery and billing",
    description:
      "Keep invoices connected to clients, proposals, projects, and the work that created the payment request.",
  },
  {
    icon: CreditCard,
    title: "Collect online payments",
    description:
      "When Stripe is connected, send clients to a hosted payment experience and keep status visible in your workspace.",
  },
  {
    icon: WalletCards,
    title: "Track what is due",
    description:
      "See draft, open, paid, overdue, and void invoice states without leaving your operational workflow.",
  },
  {
    icon: Users,
    title: "Keep the client experience clear",
    description:
      "Give clients a professional payment request with the context they need to understand what they are paying for.",
  },
];

const paymentSteps = [
  {
    number: "01",
    title: "Create the invoice",
    description:
      "Choose the client, add services or deliverables, set the due date, and review the total.",
    icon: Receipt,
  },
  {
    number: "02",
    title: "Send a clear payment request",
    description:
      "Finalize the invoice and use your connected payment workflow when online collection is enabled.",
    icon: Send,
  },
  {
    number: "03",
    title: "Track payment status",
    description:
      "Keep invoice, payment, client, and project context visible together as the payment moves forward.",
    icon: CheckCircle2,
  },
];

function InvoiceDemoPreview() {
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
              RelunoOS invoice workspace
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-blue-950/10">
            <img
              src="/invoices-demo.svg"
              alt="RelunoOS invoices workspace preview"
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
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
                    <Receipt size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-zinc-900">
                      Invoice INV-2026-014
                    </p>
                    <p className="mt-0.5 text-[10px] text-zinc-500">
                      Northstar Studio
                    </p>
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

                  <p className="text-xl font-bold tracking-tight text-zinc-900">
                    $8,500 CAD
                  </p>
                </div>

                <div className="mt-4 space-y-3 border-t border-zinc-200 pt-4">
                  {[
                    "Discovery and technical planning",
                    "Responsive website design",
                    "Lead capture workflow",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center justify-between gap-4 text-[11px]"
                    >
                      <span className="text-zinc-700">{item}</span>
                      <span className="font-semibold text-zinc-900">
                        {index === 0
                          ? "$1,500"
                          : index === 1
                          ? "$4,500"
                          : "$2,500"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-zinc-200 bg-white p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    Due date
                  </p>
                  <p className="mt-1 text-xs font-semibold text-zinc-900">
                    Oct 28, 2026
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                    Payment status
                  </p>
                  <p className="mt-1 text-xs font-semibold text-emerald-800">
                    Ready to collect
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -left-6 top-14 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
          Invoice state
        </p>
        <p className="mt-1 text-sm font-bold text-white">Draft → paid</p>
      </div>

      <div className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
          Payment flow
        </p>
        <p className="mt-1 text-xs font-semibold text-white">
          Stripe connected
        </p>
      </div>
    </div>
  );
}

function InvoiceMiniPreview() {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_20px_50px_rgba(6,62,226,0.08)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
            <Receipt size={18} />
          </div>

          <div>
            <p className="text-sm font-bold text-zinc-900">
              Client invoice
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">
              Connected to project delivery
            </p>
          </div>
        </div>

        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700">
          Draft
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
            Website redesign
          </p>

          <p className="text-sm font-bold text-zinc-900">$8,500 CAD</p>
        </div>

        <div className="mt-4 space-y-3">
          {[
            "Discovery and planning",
            "Website design",
            "Development and launch",
          ].map((item, index) => (
            <div
              key={item}
              className="flex items-center justify-between gap-4 text-[11px]"
            >
              <span className="text-zinc-600">{item}</span>
              <span className="font-semibold text-zinc-900">
                {index === 0 ? "$1,500" : index === 1 ? "$4,500" : "$2,500"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-3">
        <span className="text-xs font-semibold text-[#063ee2]">
          Ready to send payment request
        </span>

        <Send size={16} className="text-[#063ee2]" />
      </div>
    </div>
  );
}

export default function InvoicesPlatform() {
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
                  <Receipt size={13} />
                  Invoices & Payments
                </div>

                <h1 className="rise-in rise-in-delay-1 mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                  Turn completed work into clear payment requests.
                </h1>

                <p className="rise-in rise-in-delay-2 mt-7 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
                  Create connected invoices from the same workspace where client
                  work is delivered. Keep client context, project details,
                  payment status, and billing records visible in one place.
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
                    Keep delivery and billing connected
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Check size={14} className="text-blue-200" />
                    Clear payment status in one workspace
                  </span>
                </div>
              </div>

              <div className="rise-in rise-in-delay-2 relative mx-auto w-full max-w-3xl lg:max-w-none">
                <InvoiceDemoPreview />
              </div>
            </div>
          </div>
        </section>

        {/* Workflow strip */}
        <section className="border-b border-zinc-100 bg-white py-7">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 sm:px-10 lg:flex-row lg:justify-between">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 lg:text-left">
              The payment stage of a connected client workflow
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-semibold text-zinc-600">
              {[
                "Inquiry",
                "AI Intake",
                "CRM",
                "Proposal",
                "Project",
                "Invoice",
                "Payment",
              ].map((step, index, items) => (
                <div key={step} className="flex items-center gap-3">
                  <span className={step === "Invoice" ? "text-[#063ee2]" : ""}>
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
                Billing without disconnects
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Payment should not become a separate disconnected process.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                When an agency finishes work, payment often moves into another
                spreadsheet, invoicing tool, inbox thread, or manual follow-up
                process. The project context gets lost just when the client
                needs a clear next step.
              </p>

              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-500">
                RelunoOS keeps invoices connected to the clients, proposals,
                projects, and deliverables that created them—so the payment
                request has context and your team can see what is still due.
              </p>
            </div>

            <InvoiceMiniPreview />
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Built for client payment workflows
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Give completed work a clear path to payment.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-500">
                Invoices & Payments brings the billing stage into the same
                operating system as client relationships, proposals, projects,
                and delivery.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
              {invoiceBenefits.map((benefit) => {
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

        {/* Payment workflow */}
        <section className="border-y border-zinc-100 bg-[#f5f7ff] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                How it works
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                From finished work to a clear next step.
              </h2>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {paymentSteps.map((step) => {
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

        {/* Stripe */}
        <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Online payment collection
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Connect Stripe when you are ready to collect online.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                When your workspace has a connected Stripe account, RelunoOS
                can support a clearer client payment workflow through hosted
                payment collection and connected invoice status.
              </p>

              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-500">
                Stripe processing fees are separate from RelunoOS subscription
                charges and any applicable RelunoOS platform fees. Your
                workspace should show relevant payment terms before online
                collection is enabled.
              </p>

              <Link
                to="/pricing"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#063ee2] transition-colors hover:text-blue-800"
              >
                Review pricing and fees
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-[#063ee2] via-blue-700 to-indigo-950 p-6 shadow-2xl shadow-blue-950/15 sm:p-9">
              <div className="rounded-3xl border border-white/20 bg-white p-6 shadow-xl sm:p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
                  <CreditCard size={21} />
                </div>

                <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                  Connected payment workflow
                </p>

                <p className="mt-4 text-2xl font-bold leading-[1.12] tracking-[-0.035em] text-zinc-900 sm:text-3xl">
                  Create the invoice, send a clear payment request, and keep
                  the status connected to your client workspace.
                </p>

                <div className="mt-8 space-y-3 border-t border-zinc-100 pt-6">
                  {[
                    "Connected Stripe account",
                    "Hosted client payment experience",
                    "Invoice and payment status in one workspace",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-zinc-700"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check size={11} strokeWidth={3} />
                      </span>

                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow rail */}
        <section className="border-y border-zinc-100 bg-[#f5f7ff] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                Connected workflow
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Payment context should stay with the work.
              </h2>

              <p className="mt-5 text-base leading-7 text-zinc-500">
                Invoices are not an isolated finance task. They are the next
                step after a client accepts a proposal and your team delivers
                the work.
              </p>
            </div>

            <div className="mt-14 grid gap-3 md:grid-cols-7">
              {[
                { label: "Inquiry", href: "/platform" },
                { label: "AI Intake", href: "/platform/ai-intake" },
                { label: "CRM", href: "/platform/crm" },
                { label: "Proposal", href: "/platform/proposals" },
                { label: "Project", href: "/platform/projects" },
                {
                  label: "Invoice",
                  href: "/platform/invoices",
                  active: true,
                },
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
              Invoice with clarity
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              Give completed work a clear path to payment.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100">
              Keep client context, project delivery, invoices, and payment
              status connected in one RelunoOS workspace.
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