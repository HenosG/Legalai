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
  { id: "introduction", label: "Introduction and scope" },
  { id: "information-collect", label: "Information we collect" },
  { id: "contact-forms", label: "Contact forms" },
  { id: "workspace-data", label: "Workspace information" },
  { id: "automatic-collection", label: "Automatic collection" },
  { id: "how-we-use", label: "How we use information" },
  { id: "how-we-share", label: "How we share information" },
  { id: "payments", label: "Payments" },
  { id: "ai-features", label: "AI-assisted features" },
  { id: "cookies", label: "Cookies and analytics" },
  { id: "retention", label: "Data retention" },
  { id: "security", label: "Security" },
  { id: "your-choices", label: "Your privacy choices" },
  { id: "international", label: "International transfers" },
  { id: "children", label: "Children's privacy" },
  { id: "changes", label: "Changes to this policy" },
  { id: "contact", label: "Contact us" },
];

export default function Privacy() {
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


      {/* Hero Section - Shorter and Calmer */}
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
              Privacy Policy
            </h1>


            <p className="rise-in rise-in-delay-2 mt-6 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              How RelunoOS collects, uses, stores, and shares information in connection with the service.
            </p>


            <div className="rise-in rise-in-delay-2 mt-6 flex items-center gap-3 text-sm text-blue-100/80">
              <span className="inline-flex items-center gap-2">
                <Check size={14} className="text-blue-200" />
                Last updated: [Month Day, 2026]
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
                This draft must be reviewed and finalized with qualified legal counsel before production use. This template contains placeholders for unconfirmed legal and business facts.
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
              
              {/* 1. Introduction and Scope */}
              <section id="introduction" className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Introduction and scope
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  This Privacy Policy explains how [Legal Company Name] ("RelunoOS," "we," "us," or "our") collects, uses, stores, and shares information in connection with the RelunoOS service (the "Service").
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  This policy applies to information collected through our website at [website URL], when you use the RelunoOS application, when you contact us through our Contact page, and when you otherwise interact with us.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  By using the Service, you agree to the collection, use, and sharing of your information as described in this policy. If you do not agree with the practices described in this policy, you should not use the Service.
                </p>
              </section>


              {/* 2. Information We Collect */}
              <section id="information-collect" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Information we collect
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  We collect different types of information depending on how you interact with RelunoOS. This includes information you provide directly to us, information collected automatically when you use our Service, and information from third-party sources.
                </p>
              </section>


              {/* 3. Contact Forms */}
              <section id="contact-forms" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Information collected through contact forms
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  When you use our Contact page to reach out to us, we may collect the following information:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>First name and last name</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Email address</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Selected topic or subject</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Message content</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Contact submissions are stored so RelunoOS can review, route, and respond to your requests. We retain this information for [Data Retention Period] or as needed to address your inquiry.
                </p>
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-sm font-semibold text-amber-900">
                    Important security notice
                  </p>
                  <p className="mt-2 text-sm text-amber-800 leading-6">
                    Do not include passwords, payment-card numbers, or other highly sensitive information in contact form messages. Contact forms are not encrypted for sensitive data transmission.
                  </p>
                </div>
              </section>


              {/* 4. Workspace Information */}
              <section id="workspace-data" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Information created in RelunoOS workspaces
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  When you sign in to RelunoOS and use our Service, you may provide and we may store the following types of operational information:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Workspace configuration settings and preferences</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Client information and contact details</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Lead records and inquiry information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Proposals, scopes of work, and investment information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Project information, tasks, milestones, and progress tracking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Payment-related information and billing details</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Uploaded files, documents, and other content</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Notes, comments, and team communications within the workspace</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  This information is stored to provide you with the RelunoOS Service and to enable your team to manage client workflows, proposals, projects, and related operational activities.
                </p>
              </section>


              {/* 5. Automatic Collection */}
              <section id="automatic-collection" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Information collected automatically
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  When you access or use the RelunoOS Service, we and our service providers may automatically collect certain information about your device and usage. This may include:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Device information (browser type, operating system, device identifiers)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>IP address and approximate location information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Pages viewed, features used, and time spent on the Service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Referring website addresses and exit pages</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Clicks, scrolls, and other interaction data</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  This information is collected using technologies such as cookies, web beacons, pixels, and similar tracking technologies. See our "Cookies and analytics" section below for more information.
                </p>
              </section>


              {/* 6. How We Use Information */}
              <section id="how-we-use" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  How we use information
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>To provide, maintain, and improve the RelunoOS Service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>To create and manage your user account and workspace</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>To process your requests and respond to inquiries</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>To send you service-related communications, including updates, security alerts, and administrative messages</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>To enable AI-assisted features that help structure information, categorize inquiries, and draft proposal outlines</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>To monitor and analyze usage patterns, trends, and Service performance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>To detect, prevent, and address technical issues, security incidents, and fraudulent activity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>To comply with applicable legal obligations and enforce our Terms of Service</span>
                  </li>
                </ul>
              </section>


              {/* 7. How We Share Information */}
              <section id="how-we-share" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  How we share information
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  We do not sell your personal information. We may share information in the following circumstances:
                </p>
                
                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Service providers
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  We work with third-party service providers who help us operate the Service. These providers may have access to your information to perform tasks on our behalf. This may include providers for:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>[Authentication Provider] — User authentication and account management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>[Hosting Provider] — Hosting, database operations, and infrastructure</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>[Payment Provider] — Payment processing and billing operations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Transactional email providers — Sending service-related communications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>[Analytics Provider] — Analytics and usage measurement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Error monitoring and debugging tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>[AI Provider] — AI-assisted features and information processing</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  For a current list of subprocessors and their roles, please visit our <Link to="/subprocessors" className="text-[#063ee2] font-semibold hover:text-blue-700">Subprocessors page</Link>.
                </p>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Legal requirements
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  We may disclose information if required by law, regulation, legal process, or governmental request, or to protect the rights, property, or safety of RelunoOS, our users, or others.
                </p>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Business transfers
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  In connection with a merger, acquisition, sale of assets, bankruptcy, or other business transaction, information may be transferred as part of the transaction. We will provide notice before your information becomes subject to a different privacy policy.
                </p>
              </section>


              {/* 8. Payments */}
              <section id="payments" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Payments and third-party payment providers
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  When payment features are enabled, payment processing may involve [Payment Provider] (such as Stripe) or another configured payment provider.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Payment card data is handled securely through authorized payment gateway infrastructure. We do not store full payment card numbers on our servers. Payment information is subject to the payment provider's own privacy policy and terms.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Subscription charges, payment-processing charges, and RelunoOS platform fees are structured clearly and separately where applicable. See our <Link to="/pricing" className="text-[#063ee2] font-semibold hover:text-blue-700">Pricing page</Link> for current fee information.
                </p>
              </section>


              {/* 9. AI Features */}
              <section id="ai-features" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  AI-assisted features and AI providers
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS integrates AI-assisted features to help structure incoming information, categorize inquiries, and draft initial proposal outlines. These features are provided through [AI Provider] or similar AI service providers.
                </p>
                
                <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <p className="text-sm font-semibold text-blue-900">
                    AI output review required
                  </p>
                  <p className="mt-2 text-sm text-blue-800 leading-6">
                    AI-generated output should be reviewed by users before client-facing use. RelunoOS AI features are designed to assist with operational tasks, but users remain responsible for all final content, decisions, and client communications.
                  </p>
                </div>


                <p className="mt-6 text-base leading-7 text-zinc-600">
                  When you use AI-assisted features, relevant workspace information may be processed by the AI provider to generate structured output, summaries, or draft content. This processing is subject to the AI provider's own privacy practices and terms.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Users should avoid placing unnecessary highly sensitive information (such as passwords, payment details, or sensitive personal data) into AI prompts or public intake forms.
                </p>
              </section>


              {/* 10. Cookies */}
              <section id="cookies" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Cookies and analytics
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  We and our service providers use cookies, web beacons, pixels, and similar tracking technologies to collect information about your browsing activities. These technologies help us:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Remember your preferences and settings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Understand how you use the Service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Improve and optimize the Service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Deliver relevant content and features</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  You may be able to manage cookie preferences through your browser settings. However, disabling certain cookies may limit your ability to use some features of the Service.
                </p>
              </section>


              {/* 11. Data Retention */}
              <section id="retention" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Data retention
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  We retain information for [Data Retention Period] or as long as necessary to provide the Service, comply with legal obligations, resolve disputes, and enforce our agreements.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  When you delete your account or workspace, we will delete or anonymize your information within a reasonable timeframe, except where we are required to retain it for legal or regulatory purposes.
                </p>
              </section>


              {/* 12. Security */}
              <section id="security" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Security
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  We implement technical and organizational measures designed to protect the information we collect and process. These measures include authentication systems, access controls, encryption, and monitoring for unauthorized activity.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security, but we strive to use commercially acceptable means to protect your information.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  For more information about our security practices, please visit our <Link to="/security" className="text-[#063ee2] font-semibold hover:text-blue-700">Security & Privacy page</Link>.
                </p>
              </section>


              {/* 13. Your Privacy Choices */}
              <section id="your-choices" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Your privacy choices and rights
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Depending on your location, you may have certain rights regarding your personal information, which may include:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Accessing the personal information we hold about you</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Correcting inaccurate or incomplete information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Deleting your personal information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Restricting or objecting to certain processing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Receiving a copy of your information in a portable format</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Withdrawing consent where processing is based on consent</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  To exercise these rights, please contact us using the information in the "Contact us" section below. We will respond to your request in accordance with applicable law.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  [Applicable Jurisdiction-specific rights and disclosures will be added here based on legal review.]
                </p>
              </section>


              {/* 14. International Transfers */}
              <section id="international" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  International transfers
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS may transfer, process, and store your information in countries other than your country of residence. These countries may have data protection laws that differ from the laws of your country.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  When we transfer information internationally, we use appropriate safeguards as required by applicable law. [Legal Company Name] will add specific transfer mechanisms (such as Standard Contractual Clauses) as needed based on legal review.]
                </p>
              </section>


              {/* 15. Children's Privacy */}
              <section id="children" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Children's privacy
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  The RelunoOS Service is not directed to individuals under the age of 13 (or the applicable minimum age in your jurisdiction). We do not knowingly collect personal information from children.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  If you believe we have collected information from a child, please contact us immediately at [Privacy Contact Email], and we will take steps to delete such information.
                </p>
              </section>


              {/* 16. Changes to This Policy */}
              <section id="changes" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Changes to this policy
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make changes, we will update the "Last updated" date at the top of this policy.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  If we make material changes, we will provide you with notice before the changes take effect, such as by posting a prominent notice on our website or sending you an email. We encourage you to review this policy periodically for the latest information about our privacy practices.
                </p>
              </section>


              {/* 17. Contact Us */}
              <section id="contact" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Contact us
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
                </p>
                
                <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                  <p className="text-base font-bold text-zinc-900">
                    [Legal Company Name]
                  </p>
                  <p className="mt-2 text-sm text-zinc-600">
                    Address: [Business Address]
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Email: <a href="mailto:[Privacy Contact Email]" className="text-[#063ee2] font-semibold hover:text-blue-700">[Privacy Contact Email]</a>
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
                    to="/terms"
                    className="group flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-blue-400 hover:bg-blue-50/40"
                  >
                    <FileText size={20} className="mt-0.5 text-[#063ee2]" />
                    <div>
                      <p className="text-sm font-bold text-zinc-900 group-hover:text-[#063ee2] transition-colors">
                        Terms of Service
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
                    to="/subprocessors"
                    className="group flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-blue-400 hover:bg-blue-50/40"
                  >
                    <Building size={20} className="mt-0.5 text-[#063ee2]" />
                    <div>
                      <p className="text-sm font-bold text-zinc-900 group-hover:text-[#063ee2] transition-colors">
                        Subprocessors
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