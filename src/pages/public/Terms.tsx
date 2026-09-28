import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  FileText,
  Shield,
  Layers,
  Building,
  Server,
  Menu,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const tableOfContents = [
  { id: "acceptance", label: "Acceptance of terms" },
  { id: "eligibility", label: "Eligibility and authority" },
  { id: "accounts", label: "Accounts and administrators" },
  { id: "responsibilities", label: "Customer responsibilities" },
  { id: "service", label: "The RelunoOS service" },
  { id: "ai-features", label: "AI-assisted features" },
  { id: "customer-content", label: "Customer content" },
  { id: "billing", label: "Subscription and billing" },
  { id: "payments", label: "Online client payments" },
  { id: "fees", label: "Platform and processor fees" },
  { id: "taxes", label: "Taxes" },
  { id: "cancellations", label: "Cancellations and refunds" },
  { id: "acceptable-use", label: "Acceptable use" },
  { id: "third-party", label: "Third-party services" },
  { id: "intellectual-property", label: "Intellectual property" },
  { id: "feedback", label: "Feedback" },
  { id: "confidentiality", label: "Confidentiality" },
  { id: "disclaimers", label: "Disclaimers" },
  { id: "liability", label: "Limitation of liability" },
  { id: "indemnification", label: "Indemnification" },
  { id: "suspension", label: "Suspension and termination" },
  { id: "changes", label: "Changes to terms" },
  { id: "governing-law", label: "Governing law" },
  { id: "contact", label: "Contact information" },
];

export default function Terms() {
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-zinc-900">
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


        .blueprint-grid {
          background-color: #063ee2;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 48px 48px;
        }


        .auth-stripes {
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
      `}</style>


      <Navbar />


      {/* Hero Section - Compact */}
      <section className="blueprint-grid auth-stripes relative isolate overflow-hidden pb-16 pt-20 text-white sm:pb-20 sm:pt-24 border-b border-blue-700">
        {/* Main Vignette Lighting - Subtler */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,rgba(3,26,117,0.7)_75%,rgba(1,11,51,0.95)_100%)] pointer-events-none" />
        
        {/* Diagonal Stripe Pattern Overlay */}
        <div className="auth-stripes absolute inset-0 pointer-events-none opacity-35" />


        <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
          <div className="max-w-3xl">
            <div className="rise-in inline-flex items-center gap-2 rounded-lg border border-blue-300/40 bg-blue-600/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur-md">
              <FileText size={14} />
              LEGAL
            </div>


            <h1 className="rise-in rise-in-delay-1 mt-7 text-4xl font-bold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
              Terms of Service
            </h1>


            <p className="rise-in rise-in-delay-2 mt-6 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              The terms that govern access to and use of RelunoOS.
            </p>


            <div className="rise-in rise-in-delay-2 mt-6 flex items-center gap-3 text-sm text-blue-100/80">
              <span className="inline-flex items-center gap-2">
                <Check size={14} className="text-blue-200" />
                Effective date: [Month Day, 2026]
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* Legal Draft Notice */}
      <section className="border-b border-zinc-200 bg-amber-50 px-6 py-6 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Shield size={16} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">
                Legal Review Required
              </p>
              <p className="mt-1 text-sm text-amber-800 leading-6">
                This draft should be reviewed and finalized with qualified legal counsel before production use. This template contains placeholders for unconfirmed business and legal terms.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Main Content with Sticky TOC */}
      <section className="bg-white px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] lg:gap-16">
            
            {/* Sticky Table of Contents - Desktop */}
            <aside className="hidden lg:block">
              <div className="sticky top-10 max-w-xs">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-4">
                  Table of Contents
                </p>
                <nav className="space-y-1">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block rounded-lg px-3 py-2 text-xs font-medium text-zinc-600 transition-colors hover:bg-blue-50 hover:text-[#063ee2]"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>


            {/* Mobile TOC Toggle */}
            <div className="lg:hidden mb-8">
              <button
                onClick={() => setMobileTocOpen(!mobileTocOpen)}
                className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <FileText size={16} className="text-[#063ee2]" />
                  Table of Contents
                </span>
                {mobileTocOpen ? <X size={18} /> : <Menu size={18} />}
              </button>


              {mobileTocOpen && (
                <nav className="mt-4 space-y-1 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setMobileTocOpen(false)}
                      className="block rounded-lg px-3 py-2 text-xs font-medium text-zinc-600 transition-colors hover:bg-blue-50 hover:text-[#063ee2]"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              )}
            </div>


            {/* Main Legal Content */}
            <main className="max-w-3xl">
              
              {/* 1. Acceptance of Terms */}
              <section id="acceptance" className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Acceptance of these terms
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  These Terms of Service ("Terms") constitute a legally binding agreement between you ("Customer," "you," or "your") and [Legal Company Name] ("RelunoOS," "we," "us," or "our") governing your access to and use of the RelunoOS service (the "Service").
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  By accessing, browsing, or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not access or use the Service.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  These Terms may be updated from time to time. See the "Changes to these terms" section below for information about how we notify you of changes.
                </p>
              </section>


              {/* 2. Eligibility and Authority */}
              <section id="eligibility" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Eligibility and authority
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  You must be at least 18 years old (or the age of majority in your jurisdiction) to use the Service. By using the Service, you represent and warrant that you meet this age requirement.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  If you are using the Service on behalf of an organization, entity, or employer (a "Business"), you represent and warrant that you have authority to bind that Business to these Terms, and you agree to these Terms on behalf of that Business. "Customer" includes both individual users and Businesses, as applicable.
                </p>
              </section>


              {/* 3. Accounts and Administrators */}
              <section id="accounts" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Accounts and workspace administrators
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  To access certain features of the Service, you must create an account. When creating your account, you must provide accurate, current, and complete information. You are responsible for maintaining the security of your account credentials and for all activities that occur under your account.
                </p>
                
                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Workspace administrators
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  If you are the owner or administrator of a RelunoOS workspace, you have the ability to invite team members, assign roles, manage permissions, and control access to workspace content. As an administrator, you are responsible for:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Managing access permissions for all workspace members</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Promptly removing access for individuals who no longer need it</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Ensuring workspace members comply with these Terms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Maintaining the security of administrator credentials</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  You may be held responsible for acts and omissions of users you invite to your workspace. We recommend granting the minimum level of access necessary for each team member to perform their role.
                </p>
              </section>


              {/* 4. Customer Responsibilities */}
              <section id="responsibilities" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Customer responsibilities
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  You are solely responsible for your use of the Service and for any content, data, or information you submit, upload, or otherwise make available through the Service ("Customer Content"). This responsibility includes:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Ensuring the accuracy, completeness, and legality of all information you enter into RelunoOS</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Obtaining all necessary permissions, consents, and authorizations to process client information, contact details, and other data you place in the Service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Complying with all applicable laws, regulations, and contractual obligations in your use of the Service and handling of Customer Content</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Maintaining your own backups of important Customer Content</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Using the Service in accordance with our Acceptable Use Policy</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS does not control, endorse, or assume responsibility for any Customer Content. We act solely as a processor of information you provide and do not verify the accuracy or legality of that information.
                </p>
              </section>


              {/* 5. The RelunoOS Service */}
              <section id="service" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  The RelunoOS service
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS is a client workflow operating system designed to help agencies and freelancers manage inquiries, leads, client relationships, proposals, projects, and related operational activities. The Service includes:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>AI-assisted intake and lead qualification features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Client relationship management (CRM) tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Proposal drafting and management features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Project delivery, milestone, and task management tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Invoice and payment tracking capabilities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Workspace visibility and reporting dashboards</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Optional online client payment collection features</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  We reserve the right to modify, suspend, or discontinue any feature or functionality of the Service at any time, with or without notice, subject to the terms of your subscription plan.
                </p>
              </section>


              {/* 6. AI-Assisted Features */}
              <section id="ai-features" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  AI-assisted features and human review
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS integrates artificial intelligence features to assist with structuring information, categorizing inquiries, drafting proposal outlines, and other operational tasks. These AI-assisted features are designed to improve efficiency but come with important limitations and responsibilities:
                </p>
                
                <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <p className="text-sm font-semibold text-blue-900">
                    Human review required
                  </p>
                  <p className="mt-2 text-sm text-blue-800 leading-6">
                    RelunoOS AI features assist with organization and drafting, but users must review all AI-generated outputs and remain fully responsible for client-facing decisions, communications, and deliverables. AI output should never be used without human oversight.
                  </p>
                </div>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Important limitations
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  RelunoOS does not provide legal, financial, medical, accounting, or other regulated professional advice through AI features or any other part of the Service. AI-generated content may contain errors, omissions, or outdated information. You are responsible for:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Reviewing, editing, and validating all AI-generated content before use</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Ensuring AI output meets your quality standards and client requirements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Not relying on AI output for legal, financial, medical, or other high-stakes decisions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Avoiding input of highly sensitive information (passwords, payment details, sensitive personal data) into AI prompts</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS makes no representations or warranties regarding the accuracy, completeness, or suitability of AI-generated output for any particular purpose.
                </p>
              </section>


              {/* 7. Customer Content */}
              <section id="customer-content" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Customer content
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  You retain all ownership rights and intellectual property rights in Customer Content you submit, upload, or create through the Service. These Terms do not transfer any ownership of your Customer Content to RelunoOS.
                </p>
                
                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  License to RelunoOS
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  By submitting Customer Content to RelunoOS, you grant us a limited, non-exclusive, worldwide, royalty-free license to host, store, process, and display that content solely for the purpose of providing and improving the Service. This license allows us to:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Store and process your Customer Content on our servers and through service providers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Display Customer Content within your workspace and to authorized team members</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Process Customer Content through AI features when you use AI-assisted functionality</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Create backups and perform technical operations necessary to maintain the Service</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  This license is limited to providing the Service to you and does not include the right to sell, license, or otherwise commercially exploit your Customer Content independent of the Service.
                </p>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Your representations
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  You represent and warrant that you have all necessary rights, permissions, and consents to submit Customer Content to RelunoOS and to grant the license described above. You are responsible for ensuring that Customer Content does not infringe third-party rights or violate applicable laws.
                </p>
              </section>


              {/* 8. Subscription and Billing */}
              <section id="billing" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Subscription plans and billing
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS offers various subscription plans with different features, limits, and pricing. Current plan options and pricing are available on our <Link to="/pricing" className="text-[#063ee2] font-semibold hover:text-blue-700">Pricing page</Link>.
                </p>
                
                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Subscription fees
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Subscription fees are billed in advance on a monthly or annual basis, depending on your selected plan and billing cycle. By subscribing to a paid plan, you authorize RelunoOS to charge your selected payment method for the applicable subscription fees.
                </p>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Payment method
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  You must provide a valid payment method (credit card, debit card, or other accepted payment method) to maintain a paid subscription. You are responsible for keeping your payment information current and complete.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  If payment fails for any reason, we may suspend or terminate your access to paid features until payment is successfully processed. We may retry charging your payment method or contact you to update your payment information.
                </p>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Plan changes
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  You may upgrade or change your subscription plan at any time through your account settings. When you upgrade, the new pricing will take effect immediately or at the start of your next billing cycle, depending on the type of change. See the "Cancellations, downgrades, and refunds" section for information about downgrades.
                </p>
              </section>


              {/* 9. Online Client Payments */}
              <section id="payments" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Online client payments and payment providers
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS may offer features that allow you to collect payments from your clients online through the Service. If you enable online client payment collection, the following terms apply:
                </p>
                
                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Payment provider
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Online client payments are processed through third-party payment providers, such as Stripe or other configured payment processors. To use online payment collection, you must create an account with the applicable payment provider and comply with their terms of service and acceptable use policies.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS is not a party to the agreement between you and the payment provider. We are not responsible for the payment provider's services, fees, policies, or any disputes that arise between you and the payment provider.
                </p>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Customer responsibility for client payments
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  You are solely responsible for:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Determining the amounts to charge your clients</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Complying with all laws, regulations, and card network rules applicable to your payment collection activities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Handling refunds, disputes, chargebacks, and customer service inquiries related to payments you collect</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Maintaining appropriate records and fulfilling any tax reporting obligations related to payments you collect</span>
                  </li>
                </ul>


                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-sm font-semibold text-amber-900">
                    Important payment notice
                  </p>
                  <p className="mt-2 text-sm text-amber-800 leading-6">
                    RelunoOS subscription fees are separate from online payment collection fees. If a customer enables online client payment collection, RelunoOS may charge a platform fee based on the customer's subscription plan. Payment-provider fees, including Stripe fees where applicable, are separate and may vary by payment method, country, currency, and connected account configuration.
                  </p>
                </div>
              </section>


              {/* 10. Platform and Processor Fees */}
              <section id="fees" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Platform fees and processor fees
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  When you use RelunoOS online payment collection features, you may be subject to multiple types of fees:
                </p>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  RelunoOS platform fees
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  RelunoOS may charge a platform fee on payments you collect through the Service. Platform fee rates depend on your subscription plan and are subject to change with notice. Current platform fee information is available on our <Link to="/pricing" className="text-[#063ee2] font-semibold hover:text-blue-700">Pricing page</Link> or in your account settings.
                </p>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Payment processor fees
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Payment processor fees (such as Stripe fees) are charged by the payment provider and are separate from RelunoOS fees. These fees typically include:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>A percentage of each transaction amount</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>A fixed per-transaction fee</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Additional fees for international transactions, currency conversion, or premium card types</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Payment processor fees vary by payment method, country, currency, and your connected payment provider account configuration. You are responsible for understanding and accounting for these fees in your pricing.
                </p>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Fee disclosure
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  RelunoOS will disclose applicable platform fees before you enable online payment collection. Payment processor fees are disclosed by the payment provider during account setup or in their documentation. Both types of fees will be deducted from payments you collect before funds are transferred to your connected account.
                </p>
              </section>


              {/* 11. Taxes */}
              <section id="taxes" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Taxes
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Subscription fees and platform fees are exclusive of taxes. You are responsible for paying all applicable taxes, including sales tax, VAT, GST, or other similar taxes associated with your use of the Service.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  If we are required to collect taxes, we will add the applicable tax amount to your invoice. Tax rates are based on your billing address and applicable tax laws. If you believe you are exempt from certain taxes, you may provide a valid tax exemption certificate, and we will evaluate your exemption request.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  You are responsible for determining and fulfilling any tax reporting obligations related to payments you collect from your clients through the Service. RelunoOS does not provide tax advice, and we recommend consulting with a qualified tax professional regarding your specific obligations.
                </p>
              </section>


              {/* 12. Cancellations and Refunds */}
              <section id="cancellations" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Cancellations, downgrades, and refunds
                </h2>
                
                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Subscription cancellation
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  You may cancel your RelunoOS subscription at any time through your account settings. When you cancel, your subscription will remain active until the end of your current billing period, after which your account will be downgraded to the free plan (if available) or suspended.
                </p>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Downgrades
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  If you downgrade to a lower-tier plan, the reduced pricing will take effect at the start of your next billing cycle. You will retain access to your current plan features until the end of the billing period. If your downgrade results in exceeding the limits of the new plan (such as workspace limits or feature restrictions), you may need to delete or archive content to comply with the lower plan's terms.
                </p>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Refunds
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  [Refund policy details to be finalized with legal counsel. This section will specify whether RelunoOS offers refunds, under what circumstances, and any applicable time limits or conditions.]
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Refunds for platform fees on client payments are not typically available once payment processing has occurred, as payment processor fees are non-refundable in most cases.
                </p>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Data access after cancellation
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  After cancellation, you may have a limited period to export your Customer Content before it is deleted or archived. We recommend exporting important data before canceling your subscription. See our Privacy Policy for information about data retention practices.
                </p>
              </section>


              {/* 13. Acceptable Use */}
              <section id="acceptable-use" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Acceptable use
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  You agree to use the Service in accordance with our <Link to="/acceptable-use" className="text-[#063ee2] font-semibold hover:text-blue-700">Acceptable Use Policy</Link>, which is incorporated into these Terms by reference.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Without limiting the Acceptable Use Policy, you agree not to:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Use the Service for any illegal purpose or in violation of any applicable laws</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Submit Customer Content that infringes third-party intellectual property rights, privacy rights, or other legal rights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Transmit viruses, malware, malicious code, or harmful content through the Service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Attempt to gain unauthorized access to the Service, other accounts, or computer systems</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Use the Service to send spam, unsolicited communications, or deceptive messages</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Reverse engineer, decompile, or attempt to access the source code of the Service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Interfere with or disrupt the Service or servers hosting the Service</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Violation of the Acceptable Use Policy may result in suspension or termination of your account, as described in the "Suspension and termination" section.
                </p>
              </section>


              {/* 14. Third-Party Services */}
              <section id="third-party" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Third-party services
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  The Service may integrate with or link to third-party services, including payment providers, authentication services, email providers, analytics tools, and AI providers. These third-party services are governed by their own terms and privacy policies, not by these Terms.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS does not control, endorse, or assume responsibility for any third-party services. Your use of third-party services is at your own risk. We encourage you to review the terms and privacy policies of any third-party services you access through the Service.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  For a list of subprocessors and third-party service providers that process data on behalf of RelunoOS, please visit our <Link to="/subprocessors" className="text-[#063ee2] font-semibold hover:text-blue-700">Subprocessors page</Link>.
                </p>
              </section>


              {/* 15. Intellectual Property */}
              <section id="intellectual-property" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Intellectual property
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS and its licensors own all rights, title, and interest in and to the Service, including all intellectual property rights such as copyrights, trademarks, patents, trade secrets, and database rights. These Terms do not grant you any rights to use RelunoOS trademarks, logos, or branding except as expressly authorized.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  The Service is protected by copyright, trademark, and other laws of [Applicable Jurisdiction] and foreign countries. Nothing in these Terms gives you a right to use the RelunoOS name or any of our trademarks, logos, or service marks.
                </p>
              </section>


              {/* 16. Feedback */}
              <section id="feedback" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Feedback
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  If you provide suggestions, ideas, feedback, or other input about the Service ("Feedback"), you agree that RelunoOS may use that Feedback without any obligation to you. You grant RelunoOS a non-exclusive, worldwide, perpetual, irrevocable, royalty-free license to use, modify, create derivative works of, and otherwise exploit your Feedback for any purpose.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  You represent and warrant that you have the right to grant this license and that the Feedback does not infringe third-party rights.
                </p>
              </section>


              {/* 17. Confidentiality */}
              <section id="confidentiality" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Confidentiality
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Each party may have access to confidential information of the other party in connection with these Terms and the Service. "Confidential Information" means non-public information that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and circumstances of disclosure.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS obligations regarding Customer Content are described in the "Customer content" section and our Privacy Policy. Except as expressly stated, neither party will disclose the other party's Confidential Information to third parties without prior written consent, except as required by law.
                </p>
              </section>


              {/* 18. Disclaimers */}
              <section id="disclaimers" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Disclaimers
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, RELUNOOS DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  WITHOUT LIMITING THE FOREGOING, RELUNOOS DOES NOT WARRANT THAT:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>The Service will be uninterrupted, secure, or error-free</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Defects will be corrected</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>The Service or servers hosting the Service are free of viruses or other harmful components</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>AI-generated output will be accurate, complete, or suitable for any particular purpose</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES, SO THE ABOVE EXCLUSIONS MAY NOT APPLY TO YOU.
                </p>
              </section>


              {/* 19. Limitation of Liability */}
              <section id="liability" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Limitation of liability
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, RELUNOOS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITIES, WHETHER INCURRED DIRECTLY OR INDIRECTLY AND WHETHER BASED ON CONTRACT, TORT, OR OTHERWISE, ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE SERVICE.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  [Liability cap details to be finalized with legal counsel. This section will specify any monetary limitation on RelunoOS liability, such as the amount of fees paid by the customer during a specified period.]
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, SO THE ABOVE LIMITATION MAY NOT APPLY TO YOU.
                </p>
              </section>


              {/* 20. Indemnification */}
              <section id="indemnification" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Indemnification
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  You agree to indemnify, defend, and hold harmless RelunoOS, its officers, directors, employees, agents, and service providers from and against any claims, liabilities, damages, losses, expenses, or costs (including reasonable attorneys' fees) arising out of or related to:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Your use of the Service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Your Customer Content</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Your violation of these Terms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Your violation of any third-party rights, including intellectual property or privacy rights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Your use of online payment collection features and any disputes with your clients</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS reserves the right to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you will cooperate with RelunoOS in asserting any available defenses.
                </p>
              </section>


              {/* 21. Suspension and Termination */}
              <section id="suspension" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Suspension and termination
                </h2>
                
                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Suspension
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  RelunoOS may suspend or restrict your access to the Service, with or without notice, for reasons including but not limited to:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Violation of these Terms or the Acceptable Use Policy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Conduct that poses a security risk to the Service or other users</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Suspected illegal or fraudulent activity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Non-payment of subscription fees or other amounts due</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Extended periods of inactivity</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Where practicable and appropriate, we will provide notice and an opportunity to cure before suspension. However, we reserve the right to suspend immediately in cases of serious violations or security threats.
                </p>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Termination
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Either party may terminate these Terms and the Service relationship:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>You may terminate at any time by canceling your subscription and closing your account</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>RelunoOS may terminate with notice as specified in this section, subject to finalized legal terms</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Upon termination, your right to use the Service will immediately cease. Provisions of these Terms that by their nature should survive termination (including intellectual property, disclaimers, limitation of liability, and indemnification) will survive.
                </p>
              </section>


              {/* 22. Changes to Terms */}
              <section id="changes" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Changes to these terms
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS may update these Terms from time to time to reflect changes in our practices, services, legal requirements, or other factors. When we make changes, we will update the "Effective date" at the top of these Terms.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  If we make material changes, we will provide you with reasonable notice before the changes take effect, such as by posting a prominent notice on our website, sending you an email, or displaying an in-app notification. We encourage you to review these Terms periodically for the latest information about our practices.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Continued use of the Service after changes become effective constitutes your acceptance of the updated Terms. If you do not agree to the changes, you should discontinue use of the Service and cancel your subscription before the changes take effect.
                </p>
              </section>


              {/* 23. Governing Law */}
              <section id="governing-law" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Governing law and dispute resolution
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  [Governing law and dispute resolution terms to be finalized with legal counsel. This section will specify:]
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>The governing law and jurisdiction for these Terms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Whether disputes must be resolved through arbitration or in court</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Any class action waiver or jury trial waiver provisions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>The venue for any legal proceedings</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  [Legal Company Name] will finalize these provisions with qualified legal counsel based on the company's jurisdiction, business model, and applicable consumer protection laws.
                </p>
              </section>


              {/* 24. Contact Information */}
              <section id="contact" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Contact information
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  If you have questions, concerns, or notices regarding these Terms of Service, please contact us:
                </p>
                
                <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                  <p className="text-base font-bold text-zinc-900">
                    [Legal Company Name]
                  </p>
                  <p className="mt-2 text-sm text-zinc-600">
                    Address: [Business Address]
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Email: <a href="mailto:[Support Email]" className="text-[#063ee2] font-semibold hover:text-blue-700">[Support Email]</a>
                  </p>
                </div>


                <div className="mt-6">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 rounded-xl bg-[#063ee2] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    Contact us
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </section>


              {/* Related Legal Links */}
              <section className="mt-20 border-t border-zinc-200 pt-12">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                  Related resources
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Link
                    to="/privacy"
                    className="group flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-blue-400 hover:bg-blue-50/40"
                  >
                    <FileText size={20} className="mt-0.5 text-[#063ee2]" />
                    <div>
                      <p className="text-sm font-bold text-zinc-900 group-hover:text-[#063ee2] transition-colors">
                        Privacy Policy
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        View page
                        <ArrowRight size={12} className="ml-1 inline transition-transform group-hover:translate-x-1" />
                      </p>
                    </div>
                  </Link>


                  <Link
                    to="/acceptable-use"
                    className="group flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-blue-400 hover:bg-blue-50/40"
                  >
                    <Shield size={20} className="mt-0.5 text-[#063ee2]" />
                    <div>
                      <p className="text-sm font-bold text-zinc-900 group-hover:text-[#063ee2] transition-colors">
                        Acceptable Use
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        View page
                        <ArrowRight size={12} className="ml-1 inline transition-transform group-hover:translate-x-1" />
                      </p>
                    </div>
                  </Link>


                  <Link
                    to="/security"
                    className="group flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-blue-400 hover:bg-blue-50/40"
                  >
                    <Layers size={20} className="mt-0.5 text-[#063ee2]" />
                    <div>
                      <p className="text-sm font-bold text-zinc-900 group-hover:text-[#063ee2] transition-colors">
                        Security & Privacy
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        View page
                        <ArrowRight size={12} className="ml-1 inline transition-transform group-hover:translate-x-1" />
                      </p>
                    </div>
                  </Link>


                  <Link
                    to="/contact"
                    className="group flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-blue-400 hover:bg-blue-50/40"
                  >
                    <Building size={20} className="mt-0.5 text-[#063ee2]" />
                    <div>
                      <p className="text-sm font-bold text-zinc-900 group-hover:text-[#063ee2] transition-colors">
                        Contact
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        View page
                        <ArrowRight size={12} className="ml-1 inline transition-transform group-hover:translate-x-1" />
                      </p>
                    </div>
                  </Link>
                </div>
              </section>


            </main>
          </div>
        </div>
      </section>


      {/* Footer */}
      <Footer />
    </div>
  );
}