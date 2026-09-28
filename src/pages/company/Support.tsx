import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  HelpCircle,
  LifeBuoy,
  Mail,
  Server,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

// ─── Inline Interactive Hover Button to Prevent Import Errors ────────────────
interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-36 cursor-pointer overflow-hidden rounded-xl border border-blue-200 bg-white p-2.5 text-center font-semibold text-[#063ee2] shadow-sm transition-all hover:border-blue-400",
        className
      )}
      {...props}
    >
      <span className="inline-block translate-x-1 text-xs transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>

      <div className="absolute top-0 z-10 flex h-full w-full -translate-x-12 items-center justify-center gap-2 text-xs font-bold text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span>{text}</span>
        <ChevronRight size={14} className="rotate-180" />
      </div>

      <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-[#063ee2] transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-[#063ee2]" />
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // 20 Comprehensive support FAQs (Shadcn-style accordion items)
  const faqs = [
    {
      q: "How do I connect my Stripe Connect account for client invoicing?",
      a: "Navigate to your Dashboard Settings > Payouts, click 'Connect with Stripe', and complete the secure onboarding process hosted directly by Stripe. Once finished, platform fees and client payouts are managed automatically.",
    },
    {
      q: "Can I invite team members or collaborators to my agency workspace?",
      a: "Yes! RelunoOS allows you to invite unlimited team members with customizable role permissions so everyone stays aligned on client inquiries, proposals, and active milestones.",
    },
    {
      q: "How does the AI intake assistant process client messages and forms?",
      a: "The AI parses incoming emails, form submissions, or client chats, automatically categorizes project scope, budgets, and timelines, and pre-fills your CRM pipeline with structured briefs.",
    },
    {
      q: "Where can I check system uptime and live API operational status?",
      a: "You can view real-time infrastructure status, live API latencies, scheduled maintenance windows, and historical uptimes on our public status page at /status.",
    },
    {
      q: "What payment methods are supported for client invoices?",
      a: "Through Stripe Connect, your clients can pay via major credit cards, Apple Pay, Google Pay, ACH transfers, and localized payment methods depending on your region.",
    },
    {
      q: "How do I set up custom domain aliases for client proposals?",
      a: "Go to Agency Settings > Domains, enter your custom domain (e.g., proposals.youragency.com), and add the provided CNAME records to your DNS provider.",
    },
    {
      q: "Can I export my agency financial records and client audit logs?",
      a: "Yes, you can export full CSV ledgers of all transactions, invoice histories, and client audit trails directly from the Billing and Security tabs.",
    },
    {
      q: "How do automated milestone reminders work for active projects?",
      a: "RelunoOS tracks completed project milestones and automatically triggers notification emails or Slack alerts to clients when sign-offs or deposits are due.",
    },
    {
      q: "What security and encryption standards does RelunoOS adhere to?",
      a: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256. We maintain rigorous SOC2 alignment and secure role-based access controls.",
    },
    {
      q: "How do I upgrade or downgrade my agency subscription tier?",
      a: "You can modify your subscription plan at any time from your Billing & Subscription settings page. Changes take effect immediately with prorated billing.",
    },
    {
      q: "Is there a webhook system for triggering external CRM syncs?",
      a: "Yes, you can configure outbound webhooks for lead creation, proposal acceptance, and invoice payments under Developer Settings > Webhooks.",
    },
    {
      q: "How do I customize the branding and accent colors on client portals?",
      a: "Navigate to Workspace Branding to upload your agency logo, select custom accent colors, and configure your favicon for all client-facing links.",
    },
    {
      q: "What happens if a client payment fails or declines?",
      a: "RelunoOS automatically triggers smart retries via Stripe and sends a secure update-payment link to your client via email to prevent project interruption.",
    },
    {
      q: "Can I set up recurring monthly retainers for retainer clients?",
      a: "Yes! When creating an invoice or proposal, select 'Recurring Billing' and choose your preferred billing frequency (monthly, quarterly, or annual).",
    },
    {
      q: "How do I restore an archived project or lead?",
      a: "Go to your archive tab in Projects or CRM, locate the item, and click 'Restore from Archive' to reactivate it instantly.",
    },
    {
      q: "Are there any limits on storage for shared client files?",
      a: "Storage limits depend on your active plan tier. Agency Pro and Enterprise tiers include generous cloud file storage with high-speed CDN delivery.",
    },
    {
      q: "How do I configure Slack notifications for new inbound leads?",
      a: "Go to Integrations > Slack, connect your workspace, and select which channel should receive instant alerts when the AI intake parser captures a new lead.",
    },
    {
      q: "Can I password-protect individual client proposals?",
      a: "Every proposal generates a secure, unique cryptographic token link, and you can optionally require a 4-digit PIN or client email verification before viewing.",
    },
    {
      q: "How do I contact priority engineering support if something breaks?",
      a: "Enterprise and Pro tier members have access to priority 24/7 live chat support inside the dashboard or via our dedicated support contact page.",
    },
    {
      q: "How do I delete my agency account and purge associated data?",
      a: "You can initiate account closure and data deletion requests from Security Settings. All data is securely purged in compliance with GDPR standards.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-blue-600 selection:text-white">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
        * { font-family: "DM Sans", sans-serif; }

        .blueprint-grid {
          background-color: #063ee2;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .auth-stripes {
          background-image: repeating-linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0.035) 0,
            rgba(255, 255, 255, 0.035) 1px,
            transparent 1px,
            transparent 15px
          );
        }
      `}</style>

      {/* Imported Navbar */}
      <Navbar />

      {/* Hero Section with Blue Grid */}
      <section className="blueprint-grid auth-stripes relative overflow-hidden px-6 py-24 text-white sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(3,26,117,0.7)_70%,rgba(1,11,51,0.95)_100%)]" />
        
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-600/40 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-100 backdrop-blur-md shadow-lg">
            <LifeBuoy size={14} />
            RelunoOS Support Center
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Everything you need to run your agency on autopilot.
          </h1>
          <p className="mt-6 text-base text-blue-100/80 sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about billing, AI intake, security, and workspace configurations below.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact">
              <InteractiveHoverButton text="Contact Support" className="w-36 py-3 text-xs" />
            </Link>
            <Link
              to="/status"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-xs font-bold text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <Server size={14} className="text-emerald-400" />
              System Status
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section with 20 Shadcn-style Accordions */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#063ee2]">Knowledge Base</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-3 text-sm text-zinc-500">Browse our complete directory of answers regarding your agency workspace.</p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white transition-all shadow-sm hover:border-blue-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-6 text-left font-bold text-zinc-900 transition-colors hover:bg-zinc-50/50"
                >
                  <span className="flex items-center gap-3 text-sm sm:text-base">
                    <HelpCircle size={18} className="text-[#063ee2] shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#063ee2]" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-zinc-100 bg-zinc-50/50 px-6 py-5">
                    <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Direct Contact CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-[#063ee2] px-8 py-16 text-white shadow-2xl sm:px-16 text-center">
          <div className="blueprint-grid absolute inset-0 opacity-25" />
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Still have questions or need assistance?</h2>
            <p className="mt-4 text-sm text-blue-100/80 sm:text-base">
              Our support team is always online to help your agency succeed. Reach out and we'll get back to you promptly.
            </p>
            <div className="mt-8 flex items-center justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-xs font-bold text-[#063ee2] shadow-xl transition-transform hover:scale-105"
              >
                <Mail size={16} />
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Imported Footer */}
      <Footer />
    </div>
  );
}