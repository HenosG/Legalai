import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Check, Minus, ArrowRight, Sparkles, BriefcaseBusiness, Building2,
  FileText, FolderKanban, Receipt, Users, ShieldCheck, CircleHelp, ChevronDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Data ────────────────────────────────────────────────────────────────

type FeatureState = true | false | "coming-soon" | string;

interface Plan {
  key: "free" | "starter" | "pro";
  name: string;
  audience: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  cta: string;
  ctaTo: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    key: "free",
    name: "Free",
    audience: "For exploring the RelunoOS workflow",
    description: "Organize the essentials and see how a connected client workflow fits your business.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "AI Intake workspace",
      "Basic CRM and client profiles",
      "Proposal drafting",
      "Basic project workspace",
      "Personal workspace",
      "Core settings",
    ],
    cta: "Start free",
    ctaTo: "/signup",
  },
  {
    key: "starter",
    name: "Starter",
    audience: "For independent operators",
    description: "Run your active client work from lead intake through proposal and project delivery.",
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      "Everything in Free",
      "Higher AI usage allowance",
      "Unlimited clients",
      "Unlimited proposals",
      "Active project workspace",
      "Milestones and tasks",
      "Proposal templates",
      "Workspace branding",
      "Email support",
    ],
    cta: "Join waitlist",
    ctaTo: "/signup?plan=starter",
    popular: true,
  },
  {
    key: "pro",
    name: "Pro",
    audience: "For growing agencies",
    description: "Create more client visibility, operational capacity, and team-ready workflows.",
    monthlyPrice: 79,
    yearlyPrice: 790,
    features: [
      "Everything in Starter",
      "Higher AI usage allowance",
      "Client Portal — Coming soon",
      "Advanced project visibility",
      "Advanced proposal settings",
      "Priority support",
      "Team workflow controls — Coming soon",
      "Priority access to new features",
    ],
    cta: "Contact us",
    ctaTo: "/contact",
  },
];

const progression = [
  { icon: Sparkles, label: "Explore", plan: "Free", copy: "See the connected workflow and organize your essentials." },
  { icon: BriefcaseBusiness, label: "Operate", plan: "Starter", copy: "Run active client work end to end, without switching tools." },
  { icon: Building2, label: "Scale", plan: "Pro", copy: "Add client visibility, team access, and more operating capacity." },
];

type Cell = true | false | "soon" | string;
interface CompareRow { feature: string; free: Cell; starter: Cell; pro: Cell }
interface CompareSection { title: string; rows: CompareRow[] }

const comparison: CompareSection[] = [
  {
    title: "Client workflow",
    rows: [
      { feature: "AI Intake workspace", free: true, starter: true, pro: true },
      { feature: "CRM and client profiles", free: true, starter: true, pro: true },
      { feature: "Proposal creation", free: true, starter: true, pro: true },
      { feature: "Project workspace", free: true, starter: true, pro: true },
      { feature: "Milestones and tasks", free: false, starter: true, pro: true },
      { feature: "Workspace settings", free: true, starter: true, pro: true },
    ],
  },
  {
    title: "Client experience",
    rows: [
      { feature: "Proposal templates", free: false, starter: true, pro: true },
      { feature: "Workspace branding", free: false, starter: true, pro: true },
      { feature: "Client Portal", free: false, starter: false, pro: "soon" },
      { feature: "Client messages", free: false, starter: false, pro: "soon" },
    ],
  },
  {
    title: "Scale and support",
    rows: [
      { feature: "AI usage allowance", free: "Limited", starter: "Higher allowance", pro: "Higher allowance" },
      { feature: "Active project capacity", free: "Basic", starter: "Unlimited", pro: "Unlimited" },
      { feature: "Team access", free: false, starter: false, pro: "soon" },
      { feature: "Advanced workflow settings", free: false, starter: false, pro: "soon" },
      { feature: "Priority support", free: false, starter: false, pro: true },
    ],
  },
  {
    title: "Billing",
    rows: [
      { feature: "Invoice workflow", free: false, starter: true, pro: true },
      { feature: "Payment collection via Stripe", free: false, starter: "soon", pro: "soon" },
    ],
  },
];

const faqs = [
  { q: "Who is RelunoOS built for?", a: "RelunoOS is built for agencies, studios, and freelancers who manage custom client work — typically teams of 1 to 10 people, including web design, development, branding, marketing, and consulting businesses." },
  { q: "Can I start with the Free plan?", a: "Yes. Free includes the core AI Intake, CRM, proposal, and project workspace so you can see how the connected workflow fits your business before upgrading." },
  { q: "Does RelunoOS replace my client relationships?", a: "No. RelunoOS organizes the operational work behind your client relationships — it doesn't replace the judgment or communication that makes those relationships work." },
  { q: "Will AI send proposals or messages automatically?", a: "No. AI helps draft and structure the first pass, but you review, edit, and approve every client-facing action before it goes out." },
  { q: "Can I change or cancel my plan?", a: "Plan changes and cancellation will be available once billing is live. We'll only say 'cancel anytime' once that's actually supported through Stripe's billing portal." },
  { q: "What happens when I need more capacity?", a: "You can move from Free to Starter to Pro as your AI usage, client volume, and team needs grow — each plan is designed to match a different stage of operating capacity." },
  { q: "Is the Client Portal included?", a: "Client Portal is planned for the Pro plan and is rolling out soon — it's not live yet, and we've labeled it clearly rather than implying it's available today." },
  { q: "Do I need to connect Stripe?", a: "Only for billing and payment collection features. The core lead, proposal, and project workflow works without connecting Stripe." },
];

// ─── Small building blocks ──────────────────────────────────────────────

const Eyebrow = ({ children, dark }: { children: React.ReactNode; dark?: boolean }) => (
  <p className={`text-[10px] font-bold uppercase tracking-[0.28em] ${dark ? "text-blue-100" : "text-[#063EE2]"}`}>
    {children}
  </p>
);

const FeatureRow = ({ label }: { label: string }) => {
  const isSoon = label.includes(" — ");
  const [main, tag] = isSoon ? label.split(" — ") : [label, null];
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
        <Check size={10} strokeWidth={3} />
      </span>
      <span className="text-sm leading-6 text-zinc-700">
        {main}
        {tag && (
          <span className="ml-2 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700 border border-amber-200 align-middle">
            {tag}
          </span>
        )}
      </span>
    </li>
  );
};

const CompareCell = ({ value, emphasize }: { value: Cell; emphasize?: boolean }) => {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <span className={`flex h-5 w-5 items-center justify-center rounded-full ${emphasize ? "bg-[#063EE2]" : "bg-zinc-900"}`}>
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
  if (value === "soon") {
    return (
      <div className="flex justify-center">
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700 border border-amber-200 whitespace-nowrap">
          Coming soon
        </span>
      </div>
    );
  }
  return <p className={`text-center text-[11px] font-semibold ${emphasize ? "text-[#063EE2]" : "text-zinc-600"}`}>{value}</p>;
};

const FaqItem = ({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) => (
  <div className="border-b border-zinc-100 last:border-0">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full items-center justify-between py-5 text-left"
    >
      <span className="text-sm font-semibold text-zinc-900 pr-4">{q}</span>
      <ChevronDown size={16} className={`shrink-0 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
    {open && <p className="pb-5 text-sm leading-6 text-zinc-500">{a}</p>}
  </div>
);

// ─── Main ────────────────────────────────────────────────────────────────

export default function Pricing() {
  const [yearly, setYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const priceFor = (plan: Plan) => {
    if (plan.monthlyPrice === 0) return "$0";
    return yearly ? `$${Math.round(plan.yearlyPrice / 12)}` : `$${plan.monthlyPrice}`;
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap");
        * { font-family: "DM Sans", sans-serif; }
        .font-display { font-family: "DM Serif Display", serif; }
      `}</style>

      <Navbar />

      <main>
        {/* ── Hero — blue background, matches homepage ── */}
        <section className="relative isolate overflow-hidden bg-[#063EE2] pb-20 pt-32 text-white sm:pb-28 sm:pt-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="absolute left-1/2 top-[-100px] h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-5xl px-6 text-center sm:px-10">
            <Eyebrow dark>Pricing</Eyebrow>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.045em] sm:text-6xl">
              Simple pricing for calmer client operations.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Start with the core workflow. Upgrade when you need more capacity, client visibility, and agency control.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-blue-200">
              Start free. No long-term contracts.
            </p>

            {/* Billing toggle */}
            <div className="mt-10 inline-flex items-center rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setYearly(false)}
                aria-pressed={!yearly}
                className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                  !yearly ? "bg-white text-[#063EE2]" : "text-blue-100"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                aria-pressed={yearly}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                  yearly ? "bg-white text-[#063EE2]" : "text-blue-100"
                }`}
              >
                Annual
                <span className="rounded-full bg-[#063EE2] px-2 py-0.5 text-[9px] font-bold text-white">Save 17%</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Pricing cards — straddle blue/white, cards sit on white ── */}
        <section className="relative bg-white px-6 pb-24 pt-4 sm:px-10">
          <div className="mx-auto -mt-16 max-w-6xl">
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.key}
                  className={`relative flex flex-col rounded-3xl border bg-white p-8 shadow-xl ${
                    plan.popular ? "border-[#063EE2]/30 ring-1 ring-[#063EE2]/20 shadow-blue-950/10 md:scale-[1.03]" : "border-zinc-200 shadow-zinc-950/5"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-8 rounded-full bg-[#063EE2] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                      Most popular
                    </span>
                  )}

                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{plan.audience}</p>
                  <h3 className="mt-2 text-2xl font-bold text-zinc-900">{plan.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{plan.description}</p>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold tracking-tight text-zinc-900">{priceFor(plan)}</span>
                    {plan.monthlyPrice > 0 && <span className="text-xs font-semibold text-zinc-400">USD / mo</span>}
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    {plan.monthlyPrice === 0 ? "Free forever" : yearly ? `$${plan.yearlyPrice} / year — Save 17%` : "Billed monthly"}
                  </p>

                  <div className="my-6 h-px bg-zinc-100" />

                  <ul className="flex-1 space-y-3">
                    {plan.features.map((f) => <FeatureRow key={f} label={f} />)}
                  </ul>

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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Plan progression ── */}
        <section className="border-y border-zinc-100 bg-[#F5F7FF] px-6 py-20 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Built to grow with your workflow.
            </h2>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {progression.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#063EE2]">
                      <Icon size={18} />
                    </div>
                    <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-[#063EE2]">{step.plan}</p>
                    <h3 className="mt-1 text-lg font-bold text-zinc-900">{step.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">{step.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Comparison table ── */}
        <section className="bg-white px-6 py-24 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Compare plans at a glance.
            </h2>

            <div className="mt-10 overflow-x-auto rounded-2xl border border-zinc-200">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-zinc-400">Feature</th>
                    <th className="px-4 py-4 text-center text-[11px] font-bold uppercase tracking-widest text-zinc-600">Free</th>
                    <th className="px-4 py-4 text-center text-[11px] font-bold uppercase tracking-widest text-[#063EE2] bg-blue-50/60">Starter</th>
                    <th className="px-4 py-4 text-center text-[11px] font-bold uppercase tracking-widest text-zinc-600">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((section) => (
                    <>
                      <tr key={section.title} className="bg-zinc-50/70">
                        <td colSpan={4} className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                          {section.title}
                        </td>
                      </tr>
                      {section.rows.map((row) => (
                        <tr key={row.feature} className="border-b border-zinc-100 last:border-0">
                          <td className="px-6 py-4 text-sm text-zinc-700">{row.feature}</td>
                          <td className="px-4 py-4"><CompareCell value={row.free} /></td>
                          <td className="px-4 py-4 bg-blue-50/30"><CompareCell value={row.starter} emphasize /></td>
                          <td className="px-4 py-4"><CompareCell value={row.pro} /></td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Trust / control ── */}
        <section className="border-y border-zinc-100 bg-white px-6 py-24 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Your workflow stays under your control.
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                { icon: ShieldCheck, title: "Human approval", copy: "Review and approve important client-facing actions." },
                { icon: FolderKanban, title: "Connected context", copy: "Client details follow the workflow from inquiry to delivery." },
                { icon: Building2, title: "Flexible growth", copy: "Start small and expand as your agency needs more." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-zinc-200 p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#063EE2]">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-5 text-base font-bold text-zinc-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">{item.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Team / custom workflow — blue accent section ── */}
        <section className="bg-[#063EE2] px-6 py-20 text-white sm:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Need a setup built for a larger workflow?
            </h2>
            <p className="mt-5 text-base leading-7 text-blue-100">
              RelunoOS is evolving for growing agencies that need more client visibility, collaboration, and operational control.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#063EE2] transition-all hover:bg-blue-50"
            >
              Talk to us <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white px-6 py-24 sm:px-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Frequently asked questions</h2>
            <div className="mt-8 rounded-2xl border border-zinc-200 px-6">
              {faqs.map((faq, i) => (
                <FaqItem
                  key={faq.q}
                  q={faq.q}
                  a={faq.a}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-[#063EE2] px-6 py-20 text-white sm:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Build a calmer client operation.
            </h2>
            <p className="mt-5 text-base leading-7 text-blue-100">
              Turn inquiries into structured opportunities, proposals, and projects from one connected workspace.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#063EE2] transition-all hover:bg-blue-50"
              >
                Start free <ArrowRight size={15} />
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