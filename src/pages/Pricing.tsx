import { Fragment, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  FolderKanban,
  Minus,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Types ───────────────────────────────────────────────────────────────────

type PlanKey = "free" | "starter" | "pro" | "agency";
type FeatureCell = true | false | string;

interface Plan {
  key: PlanKey;
  name: string;
  audience: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  platformFee: number;
  features: string[];
  cta: string;
  ctaTo: string;
  popular?: boolean;
}

interface CompareRow {
  feature: string;
  free: FeatureCell;
  starter: FeatureCell;
  pro: FeatureCell;
  agency: FeatureCell;
}

interface CompareSection {
  title: string;
  rows: CompareRow[];
}

// ─── Pricing Data ────────────────────────────────────────────────────────────

const plans: Plan[] = [
  {
    key: "free",
    name: "Free",
    audience: "For getting your client workflow organized",
    description:
      "A focused workspace for turning leads into clients, proposals, and projects.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    platformFee: 3,
    features: [
      "AI Intake workspace",
      "CRM and client profiles",
      "Proposal drafting",
      "Project workspace",
      "Client Portal",
      "Personal workspace",
    ],
    cta: "Start free",
    ctaTo: "/signup",
  },
  {
    key: "starter",
    name: "Starter",
    audience: "For independent operators",
    description:
      "Run active client work from inquiry through proposal, delivery, invoicing, and payment.",
    monthlyPrice: 19,
    yearlyPrice: 190,
    platformFee: 2,
    features: [
      "Everything in Free",
      "Higher AI workflow allowance",
      "Unlimited clients and projects",
      "Milestones and tasks",
      "Proposal templates",
      "Workspace branding",
      "Client Portal",
      "Invoice workspace",
    ],
    cta: "Choose Starter",
    ctaTo: "/signup?plan=starter",
    popular: true,
  },
  {
    key: "pro",
    name: "Pro",
    audience: "For small agencies",
    description:
      "More delivery visibility, advanced controls, and lower payment fees as your work grows.",
    monthlyPrice: 49,
    yearlyPrice: 490,
    platformFee: 1,
    features: [
      "Everything in Starter",
      "Highest AI workflow allowance",
      "Advanced project visibility",
      "Advanced proposal settings",
      "Custom Client Portal branding",
      "Priority support",
      "Client messages",
      "Online payment collection",
    ],
    cta: "Choose Pro",
    ctaTo: "/signup?plan=pro",
  },
  {
    key: "agency",
    name: "Agency",
    audience: "For growing client-service teams",
    description:
      "A shared operating system for agencies managing team delivery, clients, invoices, and payments.",
    monthlyPrice: 99,
    yearlyPrice: 990,
    platformFee: 0.5,
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Task assignment and team visibility",
      "Advanced workspace controls",
      "Agency Client Portal branding",
      "Stripe Connect account connection",
      "Online payment collection",
      "Priority support",
    ],
    cta: "Choose Agency",
    ctaTo: "/signup?plan=agency",
  },
];

const comparison: CompareSection[] = [
  {
    title: "Client workflow",
    rows: [
      {
        feature: "AI Intake workspace",
        free: true,
        starter: true,
        pro: true,
        agency: true,
      },
      {
        feature: "CRM and client profiles",
        free: true,
        starter: true,
        pro: true,
        agency: true,
      },
      {
        feature: "Proposal creation",
        free: true,
        starter: true,
        pro: true,
        agency: true,
      },
      {
        feature: "Project workspace",
        free: true,
        starter: true,
        pro: true,
        agency: true,
      },
      {
        feature: "Milestones and tasks",
        free: false,
        starter: true,
        pro: true,
        agency: true,
      },
      {
        feature: "Workspace settings",
        free: true,
        starter: true,
        pro: true,
        agency: true,
      },
    ],
  },
  {
    title: "Client experience",
    rows: [
      {
        feature: "Client Portal",
        free: true,
        starter: true,
        pro: true,
        agency: true,
      },
      {
        feature: "Portal branding controls",
        free: false,
        starter: false,
        pro: true,
        agency: true,
      },
      {
        feature: "Proposal templates",
        free: false,
        starter: true,
        pro: true,
        agency: true,
      },
      {
        feature: "Workspace branding",
        free: false,
        starter: true,
        pro: true,
        agency: true,
      },
      {
        feature: "Client messages",
        free: false,
        starter: false,
        pro: true,
        agency: true,
      },
    ],
  },
  {
    title: "Capacity and support",
    rows: [
      {
        feature: "AI workflow allowance",
        free: "Core allowance",
        starter: "Higher allowance",
        pro: "Highest allowance",
        agency: "Agency allowance",
      },
      {
        feature: "Clients and projects",
        free: "Core capacity",
        starter: "Unlimited",
        pro: "Unlimited",
        agency: "Unlimited",
      },
      {
        feature: "Internal team members",
        free: "1",
        starter: "1",
        pro: "Up to 2",
        agency: "Up to 5",
      },
      {
        feature: "Task assignment",
        free: false,
        starter: false,
        pro: true,
        agency: true,
      },
      {
        feature: "Advanced workflow settings",
        free: false,
        starter: false,
        pro: true,
        agency: true,
      },
      {
        feature: "Priority support",
        free: false,
        starter: false,
        pro: true,
        agency: true,
      },
    ],
  },
  {
    title: "Invoicing and payments",
    rows: [
      {
        feature: "Invoice workspace",
        free: false,
        starter: true,
        pro: true,
        agency: true,
      },
      {
        feature: "Online payment collection",
        free: true,
        starter: true,
        pro: true,
        agency: true,
      },
      {
        feature: "Stripe Connect account connection",
        free: false,
        starter: false,
        pro: false,
        agency: true,
      },
      {
        feature: "RelunoOS payment platform fee",
        free: "3.0%",
        starter: "2.0%",
        pro: "1.0%",
        agency: "0.5%",
      },
    ],
  },
];

const faqs = [
  {
    question: "Who is RelunoOS built for?",
    answer:
      "RelunoOS is built for freelancers, agencies, studios, consultants, and client-service teams that manage custom client work. It is especially useful for web design, development, branding, marketing, creative, and consulting businesses.",
  },
  {
    question: "Can I start with the Free plan?",
    answer:
      "Yes. The Free plan gives you a practical starting point for AI Intake, client records, proposals, projects, and Client Portal access so you can experience the connected workflow before paying for more capacity or lower payment fees.",
  },
  {
    question: "What is included in the Free plan?",
    answer:
      "Free includes the core RelunoOS workflow: AI Intake, CRM and client profiles, proposal drafting, a project workspace, Client Portal access, a personal workspace, and core settings. It is designed to help you see how connected client operations work before you upgrade.",
  },
  {
    question: "Is Client Portal available on every plan?",
    answer:
      "Yes. Every plan includes Client Portal access. Paid plans add more client-facing controls such as workspace branding, Client Portal branding, client messaging, team visibility, and more advanced agency workflow capabilities.",
  },
  {
    question: "What is the difference between Starter, Pro, and Agency?",
    answer:
      "Starter is designed for independent operators running active client work. Pro is for small agencies that need more visibility, advanced project controls, client messaging, and lower payment fees. Agency is for growing teams that need team access, task assignment, deeper workspace controls, Stripe Connect support, and the lowest RelunoOS payment fee.",
  },
  {
    question: "Does RelunoOS replace my client relationships?",
    answer:
      "No. RelunoOS organizes the operational work behind client relationships. You still control pricing, communication, approvals, project decisions, and every important client-facing action.",
  },
  {
    question: "Will AI send proposals or messages automatically?",
    answer:
      "No. AI helps structure information and create a first draft, but you review, edit, and approve client-facing actions before they are sent. RelunoOS is designed to help you move faster without taking control away from you.",
  },
  {
    question: "What does AI Intake do?",
    answer:
      "AI Intake turns raw client inquiries into structured opportunities. It can organize contact details, project requirements, budgets, timelines, and next steps so you can review the opportunity before adding it to CRM or creating a proposal.",
  },
  {
    question: "Can I create proposals from client information?",
    answer:
      "Yes. RelunoOS is designed to keep client and lead context connected to proposal creation. You can use the information already captured during intake and CRM work to create, review, edit, and send proposals without starting from a blank document.",
  },
  {
    question: "Can I manage projects and tasks in RelunoOS?",
    answer:
      "Yes. RelunoOS includes a project workspace for organizing client delivery. Paid plans add milestones, task management, deeper project visibility, and expanded capacity for active client work.",
  },
  {
    question: "What are the RelunoOS payment platform fees?",
    answer:
      "When online payment collection is enabled, RelunoOS charges a platform fee on successful client payments. The fee decreases as you move up plans: 3.0% on Free, 2.0% on Starter, 1.0% on Pro, and 0.5% on Agency.",
  },
  {
    question: "Do Stripe fees come out of the RelunoOS platform fee?",
    answer:
      "No. Stripe processing fees are separate from the RelunoOS platform fee. Stripe fees can vary based on payment method, country, currency, and connected account configuration. The final payment terms are shown before online payment collection is enabled for a workspace.",
  },
  {
    question: "Why is the payment fee higher on the Free plan?",
    answer:
      "The Free plan has no monthly software cost, so its payment platform fee is higher. As your client volume and operating needs grow, paid plans reduce the RelunoOS payment platform fee while adding more workflow capacity, controls, and client-facing features.",
  },
  {
    question: "Do I need to connect Stripe to use RelunoOS?",
    answer:
      "No. You can use the core AI Intake, CRM, proposal, project, and Client Portal workflow without connecting Stripe. Stripe is only needed when you want to accept online client payments or manage paid RelunoOS subscriptions.",
  },
  {
    question: "How do client payments work?",
    answer:
      "RelunoOS is designed to support online client payment collection through Stripe. Agencies can connect a Stripe account, create invoices, share payment links with clients, and track payment status inside their workspace. Stripe processing fees and the applicable RelunoOS platform fee apply to successful online payments.",
  },
  {
    question: "Can I use my own Stripe account?",
    answer:
      "Yes. RelunoOS is designed around allowing agencies to connect their own Stripe account for client payment collection. This helps keep client payments connected to the agency's own payment operations.",
  },
  {
    question: "Can I add team members?",
    answer:
      "Team access is designed for Pro and Agency workflows. Agency includes up to five internal team members, task assignment, team visibility, and more advanced workspace controls. Pro includes a smaller team setup for agencies starting to collaborate.",
  },
  {
    question: "What happens when I need more capacity?",
    answer:
      "You can move from Free to Starter, Pro, and Agency as your client volume, AI usage, project delivery needs, team operations, and payment collection needs grow. Your plan should match the amount of work your business is managing.",
  },
  {
    question: "Can I change or cancel my plan?",
    answer:
      "Yes. Plan management is handled through your workspace billing controls. You can review your plan and change it as your workflow needs evolve. When Stripe subscription billing is active, billing changes will be managed through your secure billing settings.",
  },
  {
    question: "Is there a long-term contract?",
    answer:
      "No. RelunoOS is designed to support flexible monthly or annual subscriptions. You choose the billing cadence that makes sense for your business, and annual plans provide a lower effective monthly price.",
  },
  {
    question: "What does the annual plan save?",
    answer:
      "Annual billing saves approximately 17% compared with paying month to month. For example, Starter is $19 per month or $190 per year, Pro is $49 per month or $490 per year, and Agency is $99 per month or $990 per year.",
  },
  {
    question: "Will I lose my data if I change plans?",
    answer:
      "No. Changing plans should not remove your client, project, proposal, or workspace information. Plan changes affect available capacity and feature access, while your workspace data remains connected to your RelunoOS account.",
  },
  {
    question: "Can I use RelunoOS if I am a freelancer and not an agency?",
    answer:
      "Yes. RelunoOS is built for both freelancers and agencies. Freelancers can use it to organize inquiries, clients, proposals, projects, invoices, and client visibility without stitching together multiple disconnected tools.",
  },
];

// ─── Reusable Components ─────────────────────────────────────────────────────

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
        dark ? "text-blue-100" : "text-[#063EE2]"
      }`}
    >
      {children}
    </p>
  );
}

function FeatureRow({ label }: { label: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
        <Check size={10} strokeWidth={3} />
      </span>

      <span className="text-sm leading-6 text-zinc-700">{label}</span>
    </li>
  );
}

function CompareCell({
  value,
  emphasize = false,
}: {
  value: FeatureCell;
  emphasize?: boolean;
}) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full ${
            emphasize ? "bg-[#063EE2]" : "bg-zinc-900"
          }`}
        >
          <Check size={11} className="text-white" />
        </span>
      </div>
    );
  }

  if (value === false) {
    return (
      <div className="flex justify-center">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100">
          <Minus size={11} className="text-zinc-300" />
        </span>
      </div>
    );
  }

  return (
    <p
      className={`text-center text-[11px] font-semibold ${
        emphasize ? "text-[#063EE2]" : "text-zinc-600"
      }`}
    >
      {value}
    </p>
  );
}

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-zinc-100 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#063EE2] focus-visible:ring-offset-2"
      >
        <span className="pr-4 text-sm font-semibold text-zinc-900">
          {question}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-zinc-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <p className="pb-5 text-sm leading-6 text-zinc-500">{answer}</p>
      )}
    </div>
  );
}

function PaymentFeeChart() {
  const feeRows = [
    { name: "Free", fee: 3, color: "bg-zinc-300", width: "w-full" },
    { name: "Starter", fee: 2, color: "bg-blue-300", width: "w-2/3" },
    { name: "Pro", fee: 1, color: "bg-blue-500", width: "w-1/3" },
    { name: "Agency", fee: 0.5, color: "bg-[#063EE2]", width: "w-[17%]" },
  ];

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_18px_50px_rgba(6,62,226,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#063EE2]">
            Payment pricing
          </p>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-zinc-900">
            Keep more of every client payment as you grow.
          </h3>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#063EE2]">
          <WalletCards size={19} />
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {feeRows.map((row) => (
          <div key={row.name} className="grid grid-cols-[68px_1fr_48px] items-center gap-3">
            <span className="text-xs font-semibold text-zinc-700">{row.name}</span>

            <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100">
              <div
                className={`h-full rounded-full ${row.color} ${row.width}`}
              />
            </div>

            <span className="text-right text-xs font-bold text-zinc-900">
              {row.fee}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-7 rounded-2xl bg-[#F5F7FF] p-4">
        <p className="text-xs leading-5 text-zinc-600">
          <span className="font-semibold text-zinc-900">
            Separate from Stripe:
          </span>{" "}
          Stripe processing fees are charged in addition to the RelunoOS platform
          fee for online client payments.
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Pricing() {
  const [yearly, setYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const priceFor = (plan: Plan) => {
    if (plan.monthlyPrice === 0) {
      return "$0";
    }

    return yearly
      ? `$${Math.round(plan.yearlyPrice / 12)}`
      : `$${plan.monthlyPrice}`;
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap");

        * {
          font-family: "DM Sans", sans-serif;
        }

        .font-display {
          font-family: "DM Serif Display", serif;
        }

        .hero-grid {
          background-color: #063EE2;
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
      `}</style>

      <Navbar />

      <main>
        {/* Hero Section with Blueprint Grid & Vignette Lighting */}
        <section className="hero-grid relative isolate overflow-hidden pb-20 pt-32 text-white sm:pb-28 sm:pt-40 border-b border-blue-700">
          
          {/* Main Vignette Lighting: Lighter Center fading into Darker Edges */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(3,26,117,0.65)_70%,rgba(1,11,51,0.9)_100%)] pointer-events-none" />

          {/* Diagonal Stripe Pattern Overlay */}
          <div className="hero-stripes absolute inset-0 pointer-events-none opacity-40" />
          
          {/* Extra Center Spotlight Glow */}
          <div className="absolute left-1/2 top-1/3 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/25 blur-[120px] pointer-events-none" />

          <div className="relative mx-auto max-w-5xl px-6 text-center sm:px-10">
            <Eyebrow dark>Pricing</Eyebrow>

            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.045em] sm:text-6xl">
              Simple pricing for calmer client operations.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Start with the client workflow you need today. Upgrade for more
              capacity, lower payment fees, and agency-level operations.
            </p>

            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-blue-200">
              Start free. Upgrade when the workflow earns it.
            </p>

            <div className="mt-10 inline-flex items-center rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setYearly(false)}
                aria-pressed={!yearly}
                className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  !yearly ? "bg-white text-[#063EE2]" : "text-blue-100"
                }`}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => setYearly(true)}
                aria-pressed={yearly}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  yearly ? "bg-white text-[#063EE2]" : "text-blue-100"
                }`}
              >
                Annual
                <span className="rounded-full bg-[#063EE2] px-2 py-0.5 text-[9px] font-bold text-white">
                  Save 17%
                </span>
              </button>
            </div>
            </div>
          </section>

        {/* Pricing Cards */}
        <section className="relative bg-white px-6 pb-24 pt-4 sm:px-10">
          <div className="mx-auto -mt-16 max-w-7xl">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {plans.map((plan) => (
                <article
                  key={plan.key}
                  className={`relative flex flex-col rounded-3xl border bg-white p-7 shadow-xl ${
                    plan.popular
                      ? "border-[#063EE2]/30 ring-1 ring-[#063EE2]/20 shadow-blue-950/10 xl:scale-[1.03]"
                      : "border-zinc-200 shadow-zinc-950/5"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-7 rounded-full bg-[#063EE2] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                      Most popular
                    </span>
                  )}

                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {plan.audience}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-zinc-900">
                    {plan.name}
                  </h2>

                  <p className="mt-2 min-h-[96px] text-sm leading-6 text-zinc-500">
                    {plan.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold tracking-tight text-zinc-900">
                      {priceFor(plan)}
                    </span>

                    {plan.monthlyPrice > 0 && (
                      <span className="text-xs font-semibold text-zinc-400">
                        USD / mo
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-[11px] text-zinc-400">
                    {plan.monthlyPrice === 0
                      ? "Free forever"
                      : yearly
                      ? `$${plan.yearlyPrice} / year — Save 17%`
                      : "Billed monthly"}
                  </p>

                  <div className="my-6 h-px bg-zinc-100" />

                  <ul className="flex flex-1 flex-col gap-3">
                    {plan.features.map((feature) => (
                      <FeatureRow key={feature} label={feature} />
                    ))}
                  </ul>

                  <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700">
                      Payment platform fee
                    </p>
                    <p className="mt-1 text-lg font-bold tracking-tight text-zinc-900">
                      {plan.platformFee}%
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-blue-800">
                      Applied to successful online client payments. Stripe processing
                      fees are separate.
                    </p>
                  </div>

                  {plan.note && (
                    <p className="mt-4 text-[11px] leading-5 text-zinc-500">
                      {plan.note}
                    </p>
                  )}

                  <Link
                    to={plan.ctaTo}
                    className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all ${
                      plan.popular
                        ? "bg-[#063EE2] text-white hover:bg-blue-700"
                        : "bg-zinc-900 text-white hover:bg-zinc-700"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight size={15} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Payment fees visualization */}
        <section className="border-y border-zinc-100 bg-[#F5F7FF] px-6 py-24 sm:px-10">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Eyebrow>Built for payment volume</Eyebrow>

              <h2 className="mt-5 text-3xl font-bold leading-[1.05] tracking-[-0.04em] text-zinc-900 sm:text-4xl">
                Pay less in platform fees as your agency grows.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-500">
                Every RelunoOS plan includes a Client Portal. Paid plans reduce the
                RelunoOS payment platform fee as you manage more client work and
                collect more payments through your workspace.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  "Client Portal access is included across all plans.",
                  "Stripe processing fees are always separate from platform fees.",
                  "Your payment fee is visible before you enable online collection.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm leading-6 text-zinc-700">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#063EE2] text-white">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <PaymentFeeChart />
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="bg-white px-6 py-24 sm:px-10">
          <div className="mx-auto max-w-7xl">
            <Eyebrow>Plan comparison</Eyebrow>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Compare what fits your workflow.
            </h2>

            <div className="mt-10 overflow-x-auto rounded-2xl border border-zinc-200">
              <table className="w-full min-w-[930px] border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                      Feature
                    </th>
                    <th className="px-4 py-4 text-center text-[11px] font-bold uppercase tracking-widest text-zinc-600">
                      Free
                    </th>
                    <th className="bg-blue-50/60 px-4 py-4 text-center text-[11px] font-bold uppercase tracking-widest text-[#063EE2]">
                      Starter
                    </th>
                    <th className="px-4 py-4 text-center text-[11px] font-bold uppercase tracking-widest text-zinc-600">
                      Pro
                    </th>
                    <th className="px-4 py-4 text-center text-[11px] font-bold uppercase tracking-widest text-zinc-900">
                      Agency
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {comparison.map((section) => (
                    <Fragment key={section.title}>
                      <tr className="bg-zinc-50/70">
                        <td
                          colSpan={5}
                          className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400"
                        >
                          {section.title}
                        </td>
                      </tr>

                      {section.rows.map((row) => (
                        <tr
                          key={row.feature}
                          className="border-b border-zinc-100 last:border-0"
                        >
                          <td className="px-6 py-4 text-sm text-zinc-700">
                            {row.feature}
                          </td>
                          <td className="px-4 py-4">
                            <CompareCell value={row.free} />
                          </td>
                          <td className="bg-blue-50/30 px-4 py-4">
                            <CompareCell value={row.starter} emphasize />
                          </td>
                          <td className="px-4 py-4">
                            <CompareCell value={row.pro} />
                          </td>
                          <td className="px-4 py-4">
                            <CompareCell value={row.agency} />
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Trust / Built for Control - Alternating 4-part layout */}
<section className="border-y border-zinc-100 bg-white px-6 py-24 sm:px-10 sm:py-32">
  <div className="mx-auto max-w-7xl space-y-24 sm:space-y-32">
    
    {/* Heading Intro */}
    <div className="mx-auto max-w-3xl text-center">
      <Eyebrow>Built for control</Eyebrow>
      <h2 className="mt-5 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
        Your client workflow stays under your strict control.
      </h2>
      <p className="mt-4 text-base text-zinc-500">
        Designed with guardrails so automation helps you move faster without ever compromising accuracy or client trust.
      </p>
    </div>

    {/* Row 1: Text Left, Visual Right */}
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#063EE2] border border-blue-100">
          <ShieldCheck size={14} />
          <span>Control 01</span>
        </div>
        <h3 className="mt-5 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Human approval on every major action.
        </h3>
        <p className="mt-4 text-base leading-7 text-zinc-500">
          AI prepares the draft, organizes your intake details, and formats proposals—but nothing goes out to a client or gets finalized until you review, edit, and click approve.
        </p>
        <div className="mt-6 space-y-3">
          {[
            "Review generated proposals before sending",
            "Verify lead qualification signals instantly",
            "Maintain complete editorial control over all client communications"
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-zinc-700">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#063EE2] text-white">
                <Check size={10} strokeWidth={3} />
              </span>
              {item}
            </div>
          ))}
        </div>
      </div>
      
      {/* Visual Component Box 1 */}
      <div className="rounded-3xl border border-zinc-200 bg-[#FAFAFA] p-6 sm:p-8 shadow-sm">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <span className="text-xs font-bold text-zinc-900">Proposal Approval Queue</span>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">Pending Review</span>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-3">
              <div>
                <p className="text-xs font-bold text-zinc-900">Apex Logistics Web Redesign</p>
                <p className="text-[11px] text-zinc-500">Estimated value: $8,500 CAD</p>
              </div>
              <span className="rounded-lg bg-[#063EE2] px-3 py-1 text-xs font-bold text-white">Approve & Send</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Row 2: Visual Left, Text Right */}
    <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      {/* Visual Component Box 2 */}
      <div className="order-2 lg:order-1 rounded-3xl border border-zinc-200 bg-[#FAFAFA] p-6 sm:p-8 shadow-sm">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <span className="text-xs font-bold text-zinc-900">Connected Client Record</span>
            <span className="text-[10px] font-semibold text-emerald-600">Synced across steps</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-blue-50 p-2.5 text-[#063EE2]">
              <p className="text-[10px] font-bold uppercase">1. Intake</p>
              <p className="mt-1 text-[11px] font-semibold">Captured</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-2.5 text-[#063EE2]">
              <p className="text-[10px] font-bold uppercase">2. Proposal</p>
              <p className="mt-1 text-[11px] font-semibold">Attached</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-2.5 text-[#063EE2]">
              <p className="text-[10px] font-bold uppercase">3. Project</p>
              <p className="mt-1 text-[11px] font-semibold">Active</p>
            </div>
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#063EE2] border border-blue-100">
          <FolderKanban size={14} />
          <span>Control 02</span>
        </div>
        <h3 className="mt-5 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Connected context from inquiry to delivery.
        </h3>
        <p className="mt-4 text-base leading-7 text-zinc-500">
          Client details, requirements, and budget specifications automatically travel through your workspace. Never copy-paste lead notes between different browser tabs again.
        </p>
        <div className="mt-6 space-y-3">
          {[
            "Client history attached directly to active projects",
            "Milestones mapped instantly from approved proposals",
            "Zero data loss during handoffs between team members"
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-zinc-700">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#063EE2] text-white">
                <Check size={10} strokeWidth={3} />
              </span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Row 3: Text Left, Visual Right */}
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#063EE2] border border-blue-100">
          <CreditCard size={14} />
          <span>Control 03</span>
        </div>
        <h3 className="mt-5 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Transparent payment terms and fees.
        </h3>
        <p className="mt-4 text-base leading-7 text-zinc-500">
          Know exactly what platform and processing fees apply before you enable online collection. No hidden charges or unexpected payout deductions.
        </p>
        <div className="mt-6 space-y-3">
          {[
            "Clear fee preview before sending invoices",
            "Direct integration with secure Stripe payouts",
            "Client Portal access included on all plans"
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-zinc-700">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#063EE2] text-white">
                <Check size={10} strokeWidth={3} />
              </span>
              {item}
            </div>
          ))}
        </div>
      </div>
      
      {/* Visual Component Box 3 */}
      <div className="rounded-3xl border border-zinc-200 bg-[#FAFAFA] p-6 sm:p-8 shadow-sm">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <span className="text-xs font-bold text-zinc-900">Payment Breakdown</span>
            <span className="text-[10px] font-semibold text-blue-600">Stripe Connected</span>
          </div>
          <div className="mt-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 text-zinc-600">
              <span>Invoice Subtotal</span>
              <span className="font-semibold text-zinc-900">$2,500.00 CAD</span>
            </div>
            <div className="flex justify-between py-1 text-zinc-600">
              <span>Platform Fee</span>
              <span className="font-semibold text-zinc-900">Transparent Tier</span>
            </div>
            <div className="flex justify-between border-t border-zinc-100 pt-2 font-bold text-zinc-900">
              <span>Client Pays</span>
              <span>$2,500.00 CAD</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Row 4: Visual Left, Text Right */}
    <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      {/* Visual Component Box 4 */}
      <div className="order-2 lg:order-1 rounded-3xl border border-zinc-200 bg-[#FAFAFA] p-6 sm:p-8 shadow-sm">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <span className="text-xs font-bold text-zinc-900">Workspace Security</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">Encrypted</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-zinc-700">
              <Check size={14} className="text-emerald-600" />
              <span>Isolated agency environment</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-700">
              <Check size={14} className="text-emerald-600" />
              <span>Role-based access permissions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#063EE2] border border-blue-100">
          <ShieldCheck size={14} />
          <span>Control 04</span>
        </div>
        <h3 className="mt-5 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Secure, isolated workspace data.
        </h3>
        <p className="mt-4 text-base leading-7 text-zinc-500">
          Your client records and business assets remain private, encrypted, and isolated within your workspace infrastructure.
        </p>
        <div className="mt-6 space-y-3">
          {[
            "Strict data privacy and encryption standards",
            "Full export control over your agency records",
            "Reliable cloud uptime for daily operations"
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-zinc-700">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#063EE2] text-white">
                <Check size={10} strokeWidth={3} />
              </span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>

  </div>
</section>

        {/* Agency CTA */}
        <section className="bg-[#063EE2] px-6 py-20 text-white sm:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow dark>Agency plan</Eyebrow>

            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Build your agency on one connected client operating system.
            </h2>

            <p className="mt-5 text-base leading-7 text-blue-100">
              Bring your team, client delivery, branded portal, invoices, and payment
              workflow into a single RelunoOS workspace.
            </p>

            <Link
              to="/signup?plan=agency"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#063EE2] transition-all hover:bg-blue-50"
            >
              Choose Agency
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white px-6 py-24 sm:px-10">
          <div className="mx-auto max-w-3xl">
            <Eyebrow>Questions</Eyebrow>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Frequently asked questions
            </h2>

            <div className="mt-8 rounded-2xl border border-zinc-200 px-6">
              {faqs.map((faq, index) => (
                <FaqItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  open={openFaq === index}
                  onToggle={() =>
                    setOpenFaq((current) =>
                      current === index ? null : index
                    )
                  }
                />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-[#063EE2] px-6 py-20 text-white sm:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Build a calmer client operation.
            </h2>

            <p className="mt-5 text-base leading-7 text-blue-100">
              Turn inquiries into structured opportunities, proposals, projects, and
              payments from one connected workspace.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#063EE2] transition-all hover:bg-blue-50"
              >
                Start free
                <ArrowRight size={15} />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-blue-400 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700/50"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}