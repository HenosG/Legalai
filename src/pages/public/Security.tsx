import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Lock,
  Eye,
  CheckCircle2,
  FileText,
  Users,
  Bot,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  Server,
  Key,
  ShieldCheck,
  UserCheck,
  Building,
  Layers,
  Sparkles,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Security() {
  const [activeTab, setActiveTab] = useState<"tier" | "role" | "client">("tier");

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAFAFA] text-zinc-900">
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


        .rise-in-delay-3 {
          animation-delay: 0.24s;
        }
      `}</style>


      {/* Navbar */}
      <Navbar />


      {/* Hero Section */}
      <section className="blueprint-grid auth-stripes relative isolate overflow-hidden pb-24 pt-36 text-white sm:pb-32 sm:pt-44 border-b border-blue-700">
        {/* Main Vignette Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(3,26,117,0.65)_70%,rgba(1,11,51,0.9)_100%)] pointer-events-none" />
        
        {/* Diagonal Stripe Pattern Overlay */}
        <div className="auth-stripes absolute inset-0 pointer-events-none opacity-40" />
        
        {/* Extra Center Spotlight Glow */}
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/25 blur-[120px] pointer-events-none" />


        <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="max-w-3xl">
              <div className="rise-in inline-flex items-center gap-2 rounded-lg border border-blue-300/40 bg-blue-600/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur-md">
                <Shield size={14} />
                SECURITY & PRIVACY
              </div>


              <h1 className="rise-in rise-in-delay-1 mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                Your client data deserves a careful operating system.
              </h1>


              <p className="rise-in rise-in-delay-2 mt-7 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
                RelunoOS is designed to help client-service teams work with clarity while protecting account, workspace, and client information.
              </p>


              <div className="rise-in rise-in-delay-3 mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/privacy"
                  className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#063ee2] shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  Read privacy policy
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>


                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Contact support
                </Link>
              </div>


              <div className="rise-in rise-in-delay-3 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-blue-100/90">
                <span className="inline-flex items-center gap-2">
                  <Check size={14} className="text-blue-200" />
                  Clear privacy documentation
                </span>
                <span className="inline-flex items-center gap-2">
                  <Check size={14} className="text-blue-200" />
                  Direct support channels
                </span>
              </div>
            </div>


            {/* Hero Preview Card (Homepage Style) */}
            <div className="rise-in rise-in-delay-2 relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -left-6 top-14 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
                <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
                  Authentication
                </p>
                <p className="mt-1 text-lg font-bold text-white">Enabled</p>
              </div>


              <div className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
                <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
                  Data Isolation
                </p>
                <p className="mt-1 text-xs font-semibold text-white">
                  Verified
                </p>
              </div>


              <div className="rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/15 to-white/[0.04] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.25)] backdrop-blur-sm">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/20 p-3">
                  <div className="mb-3 flex items-center gap-1.5 px-2">
                    <span className="h-2 w-2 rounded-full bg-red-300/80" />
                    <span className="h-2 w-2 rounded-full bg-amber-200/80" />
                    <span className="h-2 w-2 rounded-full bg-emerald-200/80" />
                    <span className="ml-2 text-[10px] font-medium text-blue-100/60">
                      RelunoOS Security Dashboard
                    </span>
                  </div>


                  <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl shadow-blue-950/10 text-zinc-900">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 p-2 text-blue-600">
                          <ShieldCheck size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-900">Workspace Security State</p>
                          <p className="text-[10px] text-zinc-500">Protected Environment</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                        Active Guard
                      </span>
                    </div>


                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                        Security Overview
                      </p>
                      <p className="mt-2 text-xs leading-5 text-zinc-700">
                        Secure login systems verifying identity with data isolation and human review controls active.
                      </p>
                    </div>


                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                          Data Isolation
                        </p>
                        <p className="mt-1 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Verified
                        </p>
                      </div>
                      <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                          Human Review
                        </p>
                        <p className="mt-1 text-xs font-semibold text-zinc-900">Required</p>
                      </div>
                    </div>


                    <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5">
                      <span className="text-[11px] font-semibold text-blue-800">
                        Designed for operational clarity
                      </span>
                      <Sparkles size={15} className="text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Section 1: Trust at a glance */}
      <section className="border-b border-zinc-100 bg-[#FAFAFA] px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                OVERVIEW
              </p>


              <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Trust at a glance
              </h2>
            </div>


            <p className="max-w-2xl text-base leading-7 text-zinc-500">
              Four pillars of security and privacy that protect your client workflows while maintaining operational clarity across your entire workspace.
            </p>
          </div>


          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Security-minded product design",
                desc: "Engineered from the ground up to isolate client workspaces and protect operational data.",
                icon: Shield,
              },
              {
                title: "Workspace access controls",
                desc: "Granular permission tiers ensuring only authorized team members view sensitive leads and proposals.",
                icon: Lock,
              },
              {
                title: "Privacy documentation",
                desc: "Clear, straightforward guidelines explaining how data is stored, processed, and managed.",
                icon: FileText,
              },
              {
                title: "Transparent support communication",
                desc: "Direct channels to report security concerns and view live operational status updates.",
                icon: Eye,
              },
            ].map((item, idx) => {
              const Icon = item.icon;


              return (
                <div
                  key={idx}
                  className="group bg-white p-7 transition-colors hover:bg-blue-50/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-[#063ee2]">
                    <Icon size={18} />
                  </div>


                  <h3 className="mt-6 text-base font-bold text-zinc-900">
                    {item.title}
                  </h3>


                  <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Section 2: Security approach */}
      <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
              INFRASTRUCTURE
            </p>


            <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
              Security is part of how we build.
            </h2>


            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-500">
              RelunoOS is designed to use appropriate technical and organizational safeguards to protect the service and the information users place in their workspaces.
            </p>
          </div>


          <div className="mt-20 space-y-24 sm:space-y-32">
            {[
              {
                eyebrow: "AUTHENTICATION",
                title: "Account authentication",
                description: "Secure login systems verifying user identity before granting access to personal and agency workspaces.",
                icon: Key,
                accent: "blue",
              },
              {
                eyebrow: "ACCESS CONTROL",
                title: "Authorized workspace access",
                description: "Strict boundary protocols ensuring workspace records remain accessible only to designated team members.",
                icon: Users,
                accent: "indigo",
              },
              {
                eyebrow: "OPERATIONS",
                title: "Responsible product operations",
                description: "Continuous monitoring and disciplined engineering practices maintaining stable, dependable service reliability.",
                icon: Server,
                accent: "violet",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              const reverse = index % 2 !== 0;


              const accentClasses =
                feature.accent === "blue"
                  ? {
                      badge: "bg-blue-50 text-blue-700 border-blue-100",
                      icon: "bg-blue-600",
                      visual: "from-[#063ee2] via-blue-700 to-indigo-900",
                    }
                  : feature.accent === "indigo"
                  ? {
                      badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
                      icon: "bg-indigo-600",
                      visual: "from-indigo-700 via-indigo-800 to-slate-900",
                    }
                  : {
                      badge: "bg-violet-50 text-violet-700 border-violet-100",
                      icon: "bg-violet-600",
                      visual: "from-violet-700 via-violet-800 to-indigo-950",
                    };


              return (
                <div
                  key={feature.title}
                  className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20"
                >
                  <div className={reverse ? "lg:order-2" : ""}>
                    <div
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] ${accentClasses.badge}`}
                    >
                      <Icon size={12} />
                      {feature.eyebrow}
                    </div>


                    <h3 className="mt-6 text-3xl font-bold leading-[1.05] tracking-[-0.04em] text-zinc-900 sm:text-4xl">
                      {feature.title}
                    </h3>


                    <p className="mt-5 max-w-xl text-base leading-7 text-zinc-500">
                      {feature.description}
                    </p>


                    <ul className="mt-7 space-y-3">
                      {[
                        "Built with industry-standard security practices",
                        "Integrated into your agency workspace workflow",
                        "Human-in-the-loop review guardrails",
                      ].map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-3 text-sm leading-6 text-zinc-700"
                        >
                          <span
                            className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white ${accentClasses.icon}`}
                          >
                            <Check size={11} strokeWidth={3} />
                          </span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>


                  <div
                    className={`rounded-[2rem] bg-gradient-to-br p-6 sm:p-9 ${accentClasses.visual} ${
                      reverse ? "lg:order-1" : ""
                    }`}
                  >
                    <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white p-6 shadow-xl">
                      <div className="mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-zinc-900">{feature.title}</p>
                            <p className="text-[10px] text-zinc-500">Security Protocol Active</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#063ee2] border border-blue-200">
                          Standard
                        </span>
                      </div>


                      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                          System Description
                        </p>
                        <p className="mt-2 text-xs font-medium leading-5 text-zinc-700">
                          {feature.description}
                        </p>
                      </div>


                      <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/50 px-3.5 py-3">
                        <span className="text-xs font-semibold text-[#063ee2]">
                          Protocol enforced
                        </span>
                        <CheckCircle2 size={16} className="text-[#063ee2]" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Section 3: Account access and permissions */}
      <section className="border-y border-zinc-100 bg-[#F5F7FF] px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Text Side */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#063ee2]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#063ee2] text-white text-[10px]">
                  01
                </span>
                ACCESS CONTROL
              </div>


              <h3 className="mt-6 text-3xl font-bold leading-[1.05] tracking-[-0.04em] text-zinc-900 sm:text-4xl">
                Access should stay with the right people.
              </h3>


              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-500">
                RelunoOS enforces strict permission boundaries to ensure workspace information remains accessible only to authorized team members.
              </p>


              <div className="mt-7 space-y-3">
                {[
                  "Account access is tied directly to authenticated users with unique credentials",
                  "Workspace information should be accessible only to authorized workspace members",
                  "Users should protect their credentials and promptly remove access when teammates no longer need it",
                ].map((bullet) => (
                  <div key={bullet} className="flex items-center gap-3 text-sm text-zinc-700">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#063ee2] text-white">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    {bullet}
                  </div>
                ))}
              </div>
            </div>


            {/* Visual Preview Side */}
            <div
              className={`rounded-[2rem] bg-gradient-to-br from-[#063ee2] via-blue-700 to-indigo-950 p-6 sm:p-9 shadow-2xl shadow-blue-950/15`}
            >
              <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Permission Tiers</p>
                      <p className="text-[10px] text-zinc-500">Workspace security hierarchy</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#063ee2] border border-blue-200">
                    Enforced
                  </span>
                </div>


                <div className="space-y-3">
                  {[
                    { role: "Owner", access: "Full administrative control, billing, and member management", badge: "Primary" },
                    { role: "Team member", access: "Collaborative access to CRM pipelines, proposals, and projects", badge: "Active" },
                    { role: "Client portal user", access: "Secure, scoped view of assigned project milestones and invoices", badge: "Restricted" },
                  ].map((tier, idx) => (
                    <div key={idx} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900">{tier.role}</span>
                        <span className="rounded-md bg-white px-2 py-0.5 text-[9px] font-semibold text-blue-600 border border-zinc-200">
                          {tier.badge}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-zinc-500">{tier.access}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Section 4: Privacy and workspace data */}
      <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
              DATA TRANSPARENCY
            </p>


            <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
              Client context stays connected to your workspace.
            </h2>


            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-500">
              RelunoOS organizes and processes specific categories of operational data to power your agency workflows while maintaining clear boundaries and user control.
            </p>
          </div>


          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Account information and profile credentials",
              "Workspace configuration settings and preferences",
              "Client CRM information and lead records",
              "Proposals, active projects, tasks, and uploaded content",
              "Contact-form submissions and client communications",
            ].map((category, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-blue-950/5 hover:border-blue-400 transition-all flex items-start gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 leading-tight">
                    {category}
                  </h3>
                </div>
              </div>
            ))}
          </div>


          <div className="mt-12">
            <Link
              to="/privacy"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#063ee2] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Read full privacy policy
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>


      {/* Section 5: AI-assisted workflows */}
      <section className="border-y border-zinc-100 bg-[#FAFAFA] px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Visual Preview Side */}
            <div className="rounded-[2rem] bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 p-6 sm:p-9 shadow-2xl shadow-indigo-950/15">
              <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Bot size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">AI Workflow Assistant</p>
                      <p className="text-[10px] text-zinc-500">Human oversight required</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-indigo-700 border border-indigo-200">
                    Active
                  </span>
                </div>


                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    AI Integration Status
                  </p>
                  <p className="mt-2 text-xs font-medium leading-5 text-zinc-700">
                    Artificial intelligence streamlines repetitive tasks while maintaining human oversight at every critical decision point.
                  </p>
                </div>


                <div className="mt-4 space-y-2">
                  {[
                    { label: "Information structuring", complete: true },
                    { label: "Human review required", complete: true },
                    { label: "Decision boundaries enforced", complete: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[11px] text-zinc-700">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            item.complete ? "bg-emerald-500" : "bg-indigo-400"
                          }`}
                        />
                        {item.label}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {item.complete ? "Enforced" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>


            {/* Text Side */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-700">
                <Bot size={12} />
                AI WORKFLOWS
              </div>


              <h3 className="mt-6 text-3xl font-bold leading-[1.05] tracking-[-0.04em] text-zinc-900 sm:text-4xl">
                AI helps organize the work. People stay responsible.
              </h3>


              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-500">
                Artificial intelligence is integrated into RelunoOS to streamline repetitive operational tasks, but human oversight remains paramount at every step.
              </p>


              <ul className="mt-7 space-y-3">
                {[
                  {
                    title: "Information structuring & drafting",
                    desc: "AI helps structure incoming information, categorize inquiries, and draft initial proposal outlines.",
                  },
                  {
                    title: "Mandatory human review",
                    desc: "Users review, edit, and approve all important client-facing actions before they are finalized or sent.",
                  },
                  {
                    title: "Minimizing sensitive data input",
                    desc: "Users should avoid placing unnecessary highly sensitive information into prompts or public intake forms.",
                  },
                  {
                    title: "Decision boundaries",
                    desc: "AI output should not replace required professional, legal, financial, medical, or other high-stakes human judgment.",
                  },
                ].map((rule, idx) => (
                  <li
                    key={rule.title}
                    className="flex items-start gap-3 text-sm leading-6 text-zinc-700"
                  >
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <div>
                      <span className="font-semibold text-zinc-900">{rule.title}</span>
                      <span className="text-zinc-500"> — {rule.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* Section 6: Payments */}
      <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700">
              <CreditCard size={12} />
              PAYMENT SECURITY
            </div>


            <h2 className="mt-6 text-3xl font-bold leading-[1.05] tracking-[-0.04em] text-zinc-900 sm:text-4xl">
              Payment collection is designed for clarity.
            </h2>


            <div className="mt-5 space-y-4 text-sm text-zinc-600 leading-relaxed">
              <p>When payment features are enabled, payment processing may involve Stripe or another configured payment provider.</p>
              <p>Subscription charges, payment-processing charges, and RelunoOS platform fees are structured clearly and separately where applicable.</p>
              <p>Payment card data is handled securely through authorized payment gateway infrastructure.</p>
            </div>


            <div className="mt-8">
              <Link
                to="/pricing"
                className="group inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-bold text-zinc-900 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50/40"
              >
                View pricing plans
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Section 7: Reporting a security concern */}
      <section className="border-y border-zinc-100 bg-[#F5F7FF] px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-xl shadow-blue-950/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white mx-auto mb-6 shadow-md">
              <AlertTriangle size={24} />
            </div>


            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              See something that needs attention?
            </h2>


            <p className="mt-4 text-sm text-zinc-600 max-w-xl mx-auto leading-relaxed">
              Use the Contact page to report a suspected security issue or privacy concern. Do not include passwords, payment-card numbers, or other highly sensitive data in a standard contact message.
            </p>


            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[#063ee2] px-7 py-3.5 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
              >
                Report a concern
              </Link>
              <Link
                to="/status"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-7 py-3.5 text-xs font-bold text-zinc-900 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50/40"
              >
                <Server size={14} className="text-emerald-600" />
                View system status
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Section 8: Related resources */}
      <section className="bg-white px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
              DOCUMENTATION
            </p>


            <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
              Related resources
            </h2>
          </div>


          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { title: "Privacy Policy", to: "/privacy", icon: FileText },
              { title: "Terms of Service", to: "/terms", icon: Layers },
              { title: "Acceptable Use", to: "/acceptable-use", icon: Shield },
              { title: "Subprocessors", to: "/subprocessors", icon: Building },
              { title: "System Status", to: "/status", icon: Server },
            ].map((res, idx) => {
              const Icon = res.icon;
              return (
                <Link
                  key={idx}
                  to={res.to}
                  className="group bg-white p-7 transition-colors hover:bg-blue-50/40"
                >
                  <Icon size={20} className="text-[#063ee2] mb-4" />
                  <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[#063ee2] transition-colors">
                    {res.title}
                  </h3>
                  <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#063ee2]">
                    <span>View page</span>
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>


      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <div className="blueprint-grid auth-stripes relative isolate overflow-hidden rounded-3xl bg-[#063ee2] px-8 py-20 text-white shadow-2xl sm:px-16 text-center">
          {/* Main Vignette Lighting */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(3,26,117,0.65)_70%,rgba(1,11,51,0.9)_100%)]" />
          
          {/* Diagonal Stripe Pattern Overlay */}
          <div className="auth-stripes absolute inset-0 pointer-events-none opacity-40" />


          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Build client operations with more clarity.
            </h2>


            <p className="mt-4 text-sm text-blue-100/80 sm:text-base leading-relaxed">
              RelunoOS connects the work behind client relationships while keeping people in control of important decisions.
            </p>


            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-xs font-bold text-[#063ee2] shadow-xl transition-transform hover:scale-105"
              >
                Start free
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-xs font-bold text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <Footer />
    </div>
  );
}