// src/pages/company/Affiliates.tsx
// Reluno – Affiliates page
// Commission: 20% recurring for 12 months (Rewardful integration)
// ─────────────────────────────────────────────────────────────────────────────
// REWARDFUL INTEGRATION:
// 1. Add Rewardful script to index.html:
//    <script>(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');</script>
//    <script async src='https://r.wdfl.co/rw.js' data-rewardful='YOUR_REWARDFUL_ID'></script>
// 2. On signup, pass affiliate tracking:
//    if (window.Rewardful && window.Rewardful.referral) {
//      // Pass Rewardful.referral to your backend checkout session
//    }
// 3. Set VITE_REWARDFUL_ID in your .env file
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import {
  ArrowRight, Heart, DollarSign, Globe, BarChart3,
  CheckCircle, Zap, Link as LinkIcon, TrendingUp,
} from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    label: "20% recurring commission",
    desc: "Earn 20% of every payment your referrals make — for the full 12 months of their subscription. Not a one-time bounty. Recurring, compounding income.",
  },
  {
    icon: TrendingUp,
    label: "Real-time dashboard",
    desc: "See every click, signup, and payout in your Rewardful affiliate dashboard. No mystery, no delays — transparent tracking from link to cheque.",
  },
  {
    icon: Globe,
    label: "No geographic limits",
    desc: "Share your link with anyone, anywhere. Whether you have 500 followers or 500,000, there's no cap on what you can earn.",
  },
  {
    icon: Heart,
    label: "Promote what matters",
    desc: "Reluno helps people who can't afford lawyers. When you share it, you're not pushing a gadget — you're pointing someone toward a tool that could resolve a real legal problem.",
  },
];

const earningsRows = [
  { referrals: "5 Starter referrals", monthly: "5 × $29 × 20%", earn: "$29/mo" },
  { referrals: "10 Starter referrals", monthly: "10 × $29 × 20%", earn: "$58/mo" },
  { referrals: "5 Pro referrals", monthly: "5 × $99 × 20%", earn: "$99/mo" },
  { referrals: "10 Pro referrals", monthly: "10 × $99 × 20%", earn: "$198/mo" },
  { referrals: "20 mixed referrals", monthly: "~$64 avg × 20%", earn: "$256/mo" },
];

const steps = [
  { n: "01", label: "Apply below", desc: "Fill out the short form. We review applications within 2 business days." },
  { n: "02", label: "Get your link", desc: "Receive a unique tracking link via Rewardful. Share it anywhere." },
  { n: "03", label: "Earn on every payment", desc: "Each time a referred user pays, you receive 20% — for 12 months." },
  { n: "04", label: "Get paid monthly", desc: "Payouts via Stripe on the 1st of each month, once you hit the $25 minimum." },
];

export default function Affiliates() {
  const [form, setForm] = useState({ name: "", email: "", platform: "", followers: "", why: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST to /api/affiliates/apply
    setSubmitted(true);
  };

  return (
    <PageLayout>
      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="h-px w-8 bg-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-[0.25em]">
              Affiliate program
            </span>
          </div>

          <h1 className="font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.02] tracking-tight text-zinc-900 mb-7 max-w-7xl">
            Earn 20% recurring, every month.
          </h1>

          <p className="text-lg text-zinc-500 leading-relaxed max-w-2xl font-light mb-10">
            Share Reluno. Earn 20% of every payment your referrals make — for 12 full months. No gimmicks, no confusing tiers. Just straightforward recurring commission for sharing something genuinely useful.
          </p>

          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {["20% recurring for 12 months", "Powered by Rewardful", "Monthly Stripe payouts"].map((t) => (
              <span key={t} className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <CheckCircle size={12} className="text-blue-600" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── EARNINGS TABLE ── */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
                What you can earn
              </p>
              <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 mb-6">
                Recurring income that compounds.
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed mb-5">
                Unlike one-time bounties, Reluno pays you 20% of every month's payment — for up to 12 months per referral. Refer 10 people in January and still be earning from them in December.
              </p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                The math works fast. Ten Pro-tier referrals generates $198/month in passive income — from a single batch of shares.
              </p>
            </div>

            <div className="border border-zinc-200 rounded-md overflow-hidden bg-white">
              <div className="grid grid-cols-3 bg-zinc-50 border-b border-zinc-200 px-5 py-3.5">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Scenario</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Calculation</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest text-right">Monthly earn</p>
              </div>
              {earningsRows.map((row, i) => (
                <div key={row.referrals} className={`grid grid-cols-3 px-5 py-4 border-b border-zinc-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}`}>
                  <p className="text-xs font-medium text-zinc-700">{row.referrals}</p>
                  <p className="text-xs text-zinc-400">{row.monthly}</p>
                  <p className="text-xs font-bold text-blue-600 text-right">{row.earn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-24 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              Why affiliates choose Reluno
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              More than a commission rate.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-100 border border-zinc-100 rounded-md overflow-hidden">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="bg-white p-8 flex flex-col gap-4 hover:bg-zinc-50 transition-colors group">
                  <div className="w-9 h-9 rounded-md border border-zinc-200 flex items-center justify-center group-hover:border-blue-200 transition-colors">
                  <Icon size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 mb-2">{b.label}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              How it works
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              Apply, share, earn. That's it.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.n} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[calc(100%_-_16px)] w-full h-px bg-zinc-200 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-md border border-zinc-200 bg-white flex items-center justify-center mb-5">
                    <span className="text-[11px] font-bold text-blue-600 font-mono">{step.n}</span>
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 mb-2">{step.label}</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLICATION FORM ── */}
      <section className="py-24 px-6 border-b border-zinc-100" id="apply">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-5">
              Apply now
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight tracking-tight text-zinc-900 max-w-xl">
              Join the affiliate program.
            </h2>
          </div>

          {submitted ? (
            <div className="border border-emerald-200 bg-emerald-50 rounded-md p-10 text-center max-w-xl">
              <CheckCircle size={32} className="text-emerald-600 mx-auto mb-4" />
              <p className="text-sm font-semibold text-zinc-900 mb-2">Application received</p>
              <p className="text-xs text-zinc-500">We'll review your application and get back to you within 2 business days at the email you provided.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">Full name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-400 transition-colors bg-white"
                  placeholder="Your full name"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">Email address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-400 transition-colors bg-white"
                  placeholder="you@example.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">Platform / website *</label>
                <input
                  required
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-400 transition-colors bg-white"
                  placeholder="https://yoursite.com or @yourusername"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">Approximate audience size</label>
                <input
                  value={form.followers}
                  onChange={(e) => setForm({ ...form, followers: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-400 transition-colors bg-white"
                  placeholder="e.g. 5,000 subscribers"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700">Why do you want to partner with Reluno? *</label>
                <textarea
                  required
                  rows={4}
                  value={form.why}
                  onChange={(e) => setForm({ ...form, why: e.target.value })}
                  className="w-full px-4 py-3 rounded-md border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-400 transition-colors bg-white resize-none"
                  placeholder="Tell us about your audience and how you'd promote Reluno"
                />
              </div>

              <button
                type="submit"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors self-start"
              >
                Submit application
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Influencers with 50K+ followers: email <a href="mailto:partners@relunolegal.ai" className="text-blue-600 hover:underline">partners@relunolegal.ai</a> directly for custom commission rates.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── TERMS SUMMARY ── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-6">
            Program terms summary
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Commission rate", val: "20% of each payment" },
              { label: "Duration", val: "12 months per referral" },
              { label: "Minimum payout", val: "$25 USD" },
              { label: "Payment method", val: "Stripe (monthly)" },
              { label: "Cookie duration", val: "90 days" },
              { label: "Ethical promotion", val: "Required — no spam" },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-center gap-3 border border-zinc-200 rounded-md px-5 py-4 bg-white">
                <CheckCircle size={13} className="text-blue-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{label}</p>
                  <p className="text-xs font-semibold text-zinc-900">{val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}