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
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const tableOfContents = [
  { id: "purpose", label: "Purpose and scope" },
  { id: "compliance", label: "Compliance with law" },
  { id: "account-misuse", label: "Account and access misuse" },
  { id: "fraud", label: "Fraud and impersonation" },
  { id: "security", label: "Security and technical abuse" },
  { id: "privacy", label: "Privacy and data misuse" },
  { id: "intellectual-property", label: "Intellectual property" },
  { id: "payment", label: "Payment and financial misuse" },
  { id: "ai-misuse", label: "AI feature misuse" },
  { id: "harmful-content", label: "Harmful or unlawful content" },
  { id: "enforcement", label: "Enforcement" },
  { id: "reporting", label: "Reporting violations" },
  { id: "changes", label: "Changes to policy" },
];

export default function AcceptableUse() {
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
              Acceptable Use Policy
            </h1>


            <p className="rise-in rise-in-delay-2 mt-6 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Rules for using RelunoOS responsibly, securely, and lawfully.
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
                This draft should be reviewed and finalized with qualified legal counsel before production use. This template contains placeholders for unconfirmed enforcement procedures and legal terms.
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
              
              {/* 1. Purpose and Scope */}
              <section id="purpose" className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Purpose and scope
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  This Acceptable Use Policy ("Policy") sets forth rules and guidelines for using the RelunoOS service ("Service") responsibly, securely, and in compliance with applicable laws. This Policy is part of our <Link to="/terms" className="text-[#063ee2] font-semibold hover:text-blue-700">Terms of Service</Link> and applies to all users of the Service.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS is designed to help agencies and freelancers manage client workflows, including inquiries, leads, proposals, projects, and payment collection. To maintain a safe, trustworthy platform for all users, we prohibit certain activities and content as described below.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  By using the Service, you agree to comply with this Policy. If you do not agree, you must not use the Service. Violations of this Policy may result in enforcement actions, including suspension or termination of your account.
                </p>
              </section>


              {/* 2. Compliance with Law */}
              <section id="compliance" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Compliance with law
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  You must use the Service in compliance with all applicable laws, regulations, and legal obligations in your jurisdiction. This includes but is not limited to laws governing:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Consumer protection and fair business practices</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Data protection and privacy (such as GDPR, CCPA, or similar regulations where applicable)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Payment processing and financial services regulations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Intellectual property rights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Anti-fraud, anti-money laundering, and anti-corruption laws</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Employment and contractor classification laws</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS does not provide legal advice. If you have questions about your legal obligations, consult with qualified legal counsel in your jurisdiction.
                </p>
              </section>


              {/* 3. Account and Access Misuse */}
              <section id="account-misuse" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Account and access misuse
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  You are responsible for maintaining the security of your RelunoOS account and for all activities that occur under your account. The following activities are prohibited:
                </p>
                
                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Unauthorized access
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Do not access, attempt to access, or interfere with another organization's workspace, data, or account without authorization. This includes:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Attempting to access workspaces or data you are not authorized to view</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Using another user's credentials without permission</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Circumventing access controls, permission settings, or workspace boundaries</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Accessing the Service after your account has been suspended or terminated</span>
                  </li>
                </ul>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Account sharing and resale
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Do not share your account credentials with unauthorized individuals or entities. Specifically prohibited:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Selling, reselling, or sublicensing access to RelunoOS without written permission</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Using a single account to provide service to multiple unrelated organizations in violation of plan terms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Allowing individuals who are not members of your organization to access your workspace in violation of subscription terms</span>
                  </li>
                </ul>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Credential security
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  You must protect your account credentials and promptly notify RelunoOS if you suspect unauthorized access. Do not:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Use weak, easily guessable passwords</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Reuse passwords compromised in other breaches</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Share passwords via insecure channels (email, chat, etc.)</span>
                  </li>
                </ul>
              </section>


              {/* 4. Fraud, Deception, Impersonation */}
              <section id="fraud" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Fraud, deception, impersonation, and phishing
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS must not be used to deceive, defraud, or mislead clients, prospects, or other users. Prohibited activities include:
                </p>
                
                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Impersonation
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Do not impersonate another person, company, or organization. This includes:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Using another business's name, branding, or identity without authorization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Creating proposals, invoices, or communications that appear to be from someone else</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Misrepresenting your relationship with RelunoOS, partners, or other organizations</span>
                  </li>
                </ul>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Deceptive client communications
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Do not use client portals, proposals, invoices, payment links, or messages to deceive or defraud clients. Specifically prohibited:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Sending invoices for work not performed or services not delivered</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Creating fake proposals or quotes to mislead clients about pricing or scope</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Misrepresenting project status, milestones, or deliverables in client portals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Using RelunoOS communications to solicit payments for fraudulent purposes</span>
                  </li>
                </ul>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Phishing and social engineering
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Do not use the Service to conduct phishing attacks, social engineering, or credential harvesting. This includes sending messages or creating pages designed to:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Trick recipients into revealing passwords or sensitive information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Direct users to malicious websites or fake login pages</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Obtain financial information through deception</span>
                  </li>
                </ul>
              </section>


              {/* 5. Security and Technical Abuse */}
              <section id="security" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Security and technical abuse
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  You must not engage in activities that compromise the security, integrity, or availability of the Service. Prohibited activities include:
                </p>
                
                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Unauthorized access attempts
                </h3>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Probing, scanning, or testing for vulnerabilities in the Service without explicit permission</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Attempting to bypass authentication, authorization, or access controls</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Using automated tools to guess passwords or enumerate user accounts</span>
                  </li>
                </ul>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Malicious code and attacks
                </h3>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Uploading, transmitting, or distributing viruses, malware, ransomware, trojans, or other malicious code</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Conducting denial-of-service (DoS) or distributed denial-of-service (DDoS) attacks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Attempting to overload, interfere with, or disrupt Service infrastructure</span>
                  </li>
                </ul>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Scraping and data extraction
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Do not scrape, harvest, or extract data from the Service using automated means without permission. This includes:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Using bots, crawlers, or scrapers to extract user data, workspace content, or Service data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Building competing products or databases using data extracted from RelunoOS</span>
                  </li>
                </ul>


                <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <p className="text-sm font-semibold text-blue-900">
                    Security research
                  </p>
                  <p className="mt-2 text-sm text-blue-800 leading-6">
                    If you discover a security vulnerability, please report it responsibly through our <Link to="/contact" className="font-semibold hover:text-blue-900">Contact page</Link>. Do not attempt to exploit vulnerabilities or access data without authorization. See our "Reporting violations" section for guidance.
                  </p>
                </div>
              </section>


              {/* 6. Privacy and Data Misuse */}
              <section id="privacy" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Privacy and data misuse
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  You must respect privacy rights and handle personal information responsibly when using RelunoOS. Prohibited activities include:
                </p>
                
                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Unauthorized client information
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Do not upload client information without permission or legal authority. You must:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Obtain appropriate consent from clients before storing their personal information in RelunoOS</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Comply with applicable data protection laws (GDPR, CCPA, etc.) when processing client data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Only collect and store client information necessary for your legitimate business purposes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Provide clients with required privacy notices and honor their data rights requests</span>
                  </li>
                </ul>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Sensitive information
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Do not upload or process highly sensitive personal information unless you have explicit legal authority and appropriate safeguards. RelunoOS is not designed for:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Protected health information (PHI) subject to HIPAA or similar regulations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Full payment card numbers, CVV codes, or PCI-DSS regulated data (use payment providers instead)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Government identification numbers (social security numbers, passport numbers) without strong justification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Passwords, authentication credentials, or encryption keys</span>
                  </li>
                </ul>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Data sharing and disclosure
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Do not share, sell, or disclose workspace data or other users' information to third parties without authorization. You must not:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Export client data for unauthorized commercial purposes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Access or use another workspace's data without permission</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Disclose confidential workspace information to unauthorized parties</span>
                  </li>
                </ul>
              </section>


              {/* 7. Intellectual Property */}
              <section id="intellectual-property" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Intellectual-property violations
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  You must respect intellectual property rights when using RelunoOS. Do not upload, share, or transmit content that infringes copyrights, trademarks, patents, trade secrets, or other proprietary rights.
                </p>
                
                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Copyrighted material
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Do not upload or share copyrighted content without authorization. This includes:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Images, logos, or graphics you do not have rights to use</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Text, articles, or written content copied from other sources</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Software code, templates, or proprietary materials without license</span>
                  </li>
                </ul>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Trademarks and branding
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Do not use trademarks, service marks, or branding in ways that infringe others' rights or create confusion. This includes:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Using client logos in proposals without permission</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Misusing RelunoOS trademarks or suggesting false endorsements</span>
                  </li>
                </ul>
              </section>


              {/* 8. Payment and Financial Misuse */}
              <section id="payment" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Payment and financial misuse
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  If you use RelunoOS online payment collection features, you must comply with all applicable financial regulations and payment provider terms. Prohibited activities include:
                </p>
                
                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Fraudulent transactions
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Do not use payment collection features for fraud, money laundering, or deceptive payment requests. Specifically prohibited:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Charging clients for services not rendered or products not delivered</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Processing payments through RelunoOS on behalf of third parties (payment laundering)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Creating fake invoices or payment requests to move money illicitly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Structuring transactions to evade reporting requirements or detection</span>
                  </li>
                </ul>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Prohibited goods and services
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Do not use RelunoOS payment features to collect payments for prohibited goods or services, including but not limited to:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Illegal substances, drugs, or controlled items</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Fraudulent schemes, pyramid schemes, or get-rich-quick programs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Adult content or services where prohibited by law</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Gambling, betting, or games of chance where prohibited</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Weapons, explosives, or dangerous items</span>
                  </li>
                </ul>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Payment provider compliance
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  You must comply with the terms of service of your payment provider (such as Stripe). Violations of payment provider policies may result in suspension of payment features or account termination.
                </p>
              </section>


              {/* 9. AI Feature Misuse */}
              <section id="ai-misuse" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  AI-assisted feature misuse
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS AI features are designed to assist with operational tasks, not to replace human judgment. Misuse of AI features is prohibited:
                </p>
                
                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Professional judgment substitution
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Do not use AI outputs as a substitute for required legal, financial, medical, accounting, or other high-stakes professional judgment. AI-generated content must be reviewed by qualified humans before use in:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Legal documents, contracts, or terms of service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Financial advice, tax guidance, or investment recommendations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Medical, health, or wellness recommendations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Accounting, auditing, or regulatory compliance determinations</span>
                  </li>
                </ul>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Harmful or deceptive AI content
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Do not use AI features to generate content intended to harass, threaten, exploit, or deceive others. Prohibited uses include:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Creating deceptive proposals or quotes designed to mislead clients</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Generating content that harasses, bullies, or threatens individuals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Producing misleading information about products, services, or qualifications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Creating content that discriminates against or demeans protected groups</span>
                  </li>
                </ul>


                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="mt-0.5 text-amber-700" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        AI accountability
                      </p>
                      <p className="mt-2 text-sm text-amber-800 leading-6">
                        You remain fully responsible for all content you send to clients, regardless of whether it was generated or assisted by AI. Always review, edit, and validate AI output before using it in client communications, proposals, or deliverables.
                      </p>
                    </div>
                  </div>
                </div>
              </section>


              {/* 10. Harmful or Unlawful Content */}
              <section id="harmful-content" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Harmful, abusive, or unlawful content
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Do not upload, share, or transmit content through RelunoOS that is harmful, abusive, or unlawful. This includes:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Content that promotes violence, terrorism, or physical harm</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Hate speech, discrimination, or content that attacks protected groups</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Sexually explicit or adult content (RelunoOS is for business use)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Harassment, bullying, threats, or intimidation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Defamatory, libelous, or knowingly false statements about others</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Content that exploits or harms children in any way</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Instructions for illegal activities, self-harm, or dangerous behavior</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS is a professional business tool. All content should be appropriate for a workplace environment and consistent with professional standards.
                </p>
              </section>


              {/* 11. Enforcement */}
              <section id="enforcement" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Enforcement and suspension
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS takes violations of this Acceptable Use Policy seriously. We reserve the right to investigate suspected violations and take appropriate enforcement action.
                </p>
                
                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Investigation
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  When we receive reports of potential violations or detect suspicious activity, we may:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Review relevant workspace content, communications, and activity logs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Contact you or other users for additional information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Consult with legal counsel or law enforcement when appropriate</span>
                  </li>
                </ul>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Enforcement actions
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  Depending on the severity and nature of the violation, RelunoOS may take one or more of the following actions:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Issue a warning and request corrective action</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Restrict access to specific features (such as payment collection or AI features)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Suspend your account temporarily pending investigation or remediation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Terminate your account and these Terms for serious or repeated violations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Report illegal activity to law enforcement or regulatory authorities</span>
                  </li>
                </ul>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS may restrict, suspend, or terminate access as permitted by finalized legal terms. We do not promise exact enforcement timeframes, as appropriate responses depend on the specific circumstances of each case.
                </p>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Immediate suspension
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  In cases involving serious threats to security, safety, or legal compliance, we may suspend or restrict access immediately without prior notice. This includes situations involving:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Ongoing fraud or financial crimes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Active security threats or attacks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Content that poses immediate risk of harm</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Legal requirements or court orders</span>
                  </li>
                </ul>
              </section>


              {/* 12. Reporting Violations */}
              <section id="reporting" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Reporting violations
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  If you become aware of a violation of this Acceptable Use Policy, we encourage you to report it to us. You can report violations through our <Link to="/contact" className="text-[#063ee2] font-semibold hover:text-blue-700">Contact page</Link>.
                </p>
                
                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  What to include in your report
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  When reporting a violation, please provide as much detail as possible, including:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Description of the suspected violation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Relevant usernames, workspace names, or account identifiers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Dates, times, and specific examples of concerning activity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Screenshots or other supporting documentation (if available)</span>
                  </li>
                </ul>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Security vulnerabilities
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  If you discover a security vulnerability in RelunoOS, please report it responsibly through our Contact page. When reporting security issues:
                </p>
                <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <p className="text-sm font-semibold text-blue-900">
                    Important security reporting guidelines
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-blue-800 leading-6">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 items-center justify-center rounded-full bg-blue-600" />
                      <span>Do not include passwords, payment-card data, or unnecessary sensitive information in your report</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 items-center justify-center rounded-full bg-blue-600" />
                      <span>Do not attempt to exploit the vulnerability or access data without authorization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 items-center justify-center rounded-full bg-blue-600" />
                      <span>Provide technical details that help us understand and fix the issue</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 items-center justify-center rounded-full bg-blue-600" />
                      <span>Allow us reasonable time to address the vulnerability before public disclosure</span>
                    </li>
                  </ul>
                </div>


                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  Confidentiality
                </h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  We treat reports seriously and investigate them promptly. While we cannot guarantee complete confidentiality, we will handle your report discreetly and only share information with those who need to know for investigation and remediation purposes.
                </p>
              </section>


              {/* 13. Changes to Policy */}
              <section id="changes" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Changes to this policy
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS may update this Acceptable Use Policy from time to time to reflect changes in our practices, services, legal requirements, or other factors. When we make changes, we will update the "Effective date" at the top of this Policy.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  If we make material changes that restrict your use of the Service or add new prohibited activities, we will provide you with reasonable notice before the changes take effect, such as by posting a prominent notice on our website or sending you an email.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Continued use of the Service after changes become effective constitutes your acceptance of the updated Policy. If you do not agree to the changes, you should discontinue use of the Service and cancel your subscription before the changes take effect.
                </p>
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