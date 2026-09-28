import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Server,
  Shield,
  Wifi,
  Sparkles,
  FileText,
  FolderKanban,
  Users,
  CreditCard,
  Mail,
  AlertCircle,
  Clock,
  MessageSquare,
  Layers,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const components = [
  {
    name: "RelunoOS application",
    icon: Layers,
    status: "Monitoring setup in progress",
  },
  {
    name: "Authentication",
    icon: Shield,
    status: "Monitoring setup in progress",
  },
  {
    name: "API",
    icon: Server,
    status: "Monitoring setup in progress",
  },
  {
    name: "AI Intake",
    icon: Sparkles,
    status: "Monitoring setup in progress",
  },
  {
    name: "Proposals",
    icon: FileText,
    status: "Monitoring setup in progress",
  },
  {
    name: "Projects",
    icon: FolderKanban,
    status: "Monitoring setup in progress",
  },
  {
    name: "Client Portal",
    icon: Users,
    status: "Monitoring setup in progress",
  },
  {
    name: "Billing and payments",
    icon: CreditCard,
    status: "Monitoring setup in progress",
  },
  {
    name: "Email notifications",
    icon: Mail,
    status: "Monitoring setup in progress",
  },
];

export default function Status() {
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
              <Server size={14} />
              SYSTEM STATUS
            </div>


            <h1 className="rise-in rise-in-delay-1 mt-7 text-4xl font-bold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
              RelunoOS service status
            </h1>


            <p className="rise-in rise-in-delay-2 mt-6 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Current service information, maintenance notices, and incident updates.
            </p>


            <div className="rise-in rise-in-delay-2 mt-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-500/60 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-100 backdrop-blur-md">
                <Clock size={14} />
                Monitoring setup in progress
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* Current State Section */}
      <section className="bg-white px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-7xl">
          
          {/* Main Status Card */}
          <div className="mb-16 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 sm:p-12">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                <Server size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Status monitoring is being configured.
                </h2>
                <p className="mt-3 text-base leading-7 text-zinc-600 max-w-2xl">
                  RelunoOS is preparing public component monitoring. For current support questions, use the Contact page.
                </p>
                <div className="mt-6">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 rounded-xl bg-[#063ee2] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    Contact support
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>


          {/* Component Status List */}
          <div className="mb-16">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              Component status
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {components.map((component) => {
                const Icon = component.icon;
                return (
                  <div
                    key={component.name}
                    className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-zinc-900">
                            {component.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-amber-400" />
                      <span className="text-xs font-medium text-zinc-600">
                        {component.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


          {/* Incident History */}
          <div className="mb-16">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              Incident history
            </h2>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 mb-4">
                <AlertCircle size={24} />
              </div>
              <p className="text-base font-semibold text-zinc-900">
                No public incident history is available yet.
              </p>
              <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
                Incident tracking will be available once monitoring is fully configured.
              </p>
            </div>
          </div>


          {/* Scheduled Maintenance */}
          <div className="mb-16">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-6">
              Scheduled maintenance
            </h2>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 mb-4">
                <Clock size={24} />
              </div>
              <p className="text-base font-semibold text-zinc-900">
                No scheduled maintenance is currently posted.
              </p>
              <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
                Maintenance notices will be posted here when planned.
              </p>
            </div>
          </div>


          {/* Bottom Note */}
          <div className="mb-12 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center">
            <p className="text-sm text-zinc-700">
              Service questions and account support requests can be sent through the RelunoOS Contact page.
            </p>
          </div>


          {/* Final CTA */}
          <div className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-blue-50/40 p-8 sm:p-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Need help with your workspace?
            </h2>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#063ee2] px-7 py-3.5 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
              >
                <MessageSquare size={16} />
                Contact support
              </Link>
              <Link
                to="/security"
                className="group inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-7 py-3.5 text-xs font-bold text-zinc-900 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50/40"
              >
                <Shield size={16} className="text-[#063ee2]" />
                Security & Privacy
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