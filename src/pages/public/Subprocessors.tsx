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
  ExternalLink,
  AlertTriangle,
  Database,
  Mail,
  Cpu,
  CreditCard,
  Key,
  BarChart3,
  Bug,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const tableOfContents = [
  { id: "what-is", label: "What is a subprocessor?" },
  { id: "evaluation", label: "How we evaluate providers" },
  { id: "current-list", label: "Current subprocessors" },
  { id: "notice", label: "Notice of changes" },
  { id: "contact", label: "Questions and contact" },
];

const subprocessors = [
  {
    provider: "[Authentication provider]",
    icon: Key,
    purpose: "User authentication and account management",
    dataCategories: "Account credentials, email addresses, session tokens",
    location: "[Region to be confirmed]",
    website: "[Provider website URL]",
    dateAdded: "[Date to be confirmed]",
    placeholder: true,
  },
  {
    provider: "[Payment provider]",
    icon: CreditCard,
    purpose: "Payment processing and billing operations",
    dataCategories: "Payment method information, transaction records, billing addresses",
    location: "[Region to be confirmed]",
    website: "[Provider website URL]",
    dateAdded: "[Date to be confirmed]",
    placeholder: true,
  },
  {
    provider: "[Database or hosting provider]",
    icon: Database,
    purpose: "Infrastructure hosting, database operations, and data storage",
    dataCategories: "All workspace data, user content, application data",
    location: "[Region to be confirmed]",
    website: "[Provider website URL]",
    dateAdded: "[Date to be confirmed]",
    placeholder: true,
  },
  {
    provider: "[Transactional email provider]",
    icon: Mail,
    purpose: "Sending service-related emails and notifications",
    dataCategories: "Email addresses, user preferences, notification content",
    location: "[Region to be confirmed]",
    website: "[Provider website URL]",
    dateAdded: "[Date to be confirmed]",
    placeholder: true,
  },
  {
    provider: "[Analytics provider]",
    icon: BarChart3,
    purpose: "Usage analytics and product improvement",
    dataCategories: "Usage patterns, device information, interaction data",
    location: "[Region to be confirmed]",
    website: "[Provider website URL]",
    dateAdded: "[Date to be confirmed]",
    placeholder: true,
  },
  {
    provider: "[Error monitoring provider]",
    icon: Bug,
    purpose: "Application error tracking and debugging",
    dataCategories: "Error logs, stack traces, session information",
    location: "[Region to be confirmed]",
    website: "[Provider website URL]",
    dateAdded: "[Date to be confirmed]",
    placeholder: true,
  },
  {
    provider: "[AI service provider]",
    icon: Sparkles,
    purpose: "AI-assisted features for information structuring and drafting",
    dataCategories: "Workspace content submitted to AI features, prompts, generated output",
    location: "[Region to be confirmed]",
    website: "[Provider website URL]",
    dateAdded: "[Date to be confirmed]",
    placeholder: true,
  },
];

export default function Subprocessors() {
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
              <Building size={14} />
              TRUST CENTER
            </div>


            <h1 className="rise-in rise-in-delay-1 mt-7 text-4xl font-bold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
              Subprocessors
            </h1>


            <p className="rise-in rise-in-delay-2 mt-6 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Service providers that may process personal information to help operate, support, secure, or improve RelunoOS.
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
              <AlertTriangle size={16} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">
                Important: Publish Only Verified Providers
              </p>
              <p className="mt-1 text-sm text-amber-800 leading-6">
                Publish only verified subprocessors that RelunoOS actively uses. Do not list providers unless they are confirmed to be processing data on behalf of RelunoOS. Replace all placeholder rows with verified provider information before public launch.
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
            <main className="max-w-5xl">
              
              {/* 1. What is a Subprocessor? */}
              <section id="what-is" className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  What is a subprocessor?
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  A subprocessor (also called a sub-processor or third-party processor) is a service provider that processes personal information on behalf of RelunoOS to help deliver, operate, support, secure, or improve our Service.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Under data protection laws such as the GDPR and similar regulations, RelunoOS acts as a data controller for certain personal information and as a data processor for Customer Content. When we engage third-party providers to process that information on our behalf, those providers are considered subprocessors.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Subprocessors may have access to personal information only to perform specific tasks on our behalf and are contractually obligated to protect that information and use it only for the purposes we specify.
                </p>
              </section>


              {/* 2. How RelunoOS Evaluates Providers */}
              <section id="evaluation" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  How RelunoOS evaluates providers
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  Before engaging a subprocessor, RelunoOS conducts due diligence to assess the provider's security practices, privacy commitments, and compliance with applicable data protection requirements. Our evaluation process includes:
                </p>
                
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2] mb-3">
                      <Shield size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900">
                      Security assessment
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-zinc-600">
                      Review of security controls, certifications, and technical safeguards
                    </p>
                  </div>


                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2] mb-3">
                      <FileText size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900">
                      Contractual protections
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-zinc-600">
                      Data processing agreements with confidentiality and security obligations
                    </p>
                  </div>


                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2] mb-3">
                      <Layers size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900">
                      Compliance review
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-zinc-600">
                      Assessment of compliance with applicable data protection laws
                    </p>
                  </div>


                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2] mb-3">
                      <Server size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900">
                      Ongoing monitoring
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-zinc-600">
                      Regular review of subprocessor performance and security posture
                    </p>
                  </div>
                </div>


                <p className="mt-6 text-base leading-7 text-zinc-600">
                  All subprocessors are bound by written agreements that require them to:
                </p>
                <ul className="mt-4 space-y-2 text-base leading-7 text-zinc-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Process personal information only on documented instructions from RelunoOS</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Implement appropriate technical and organizational security measures</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Ensure personnel processing data are subject to confidentiality obligations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Assist RelunoOS in responding to data subject requests and security incidents</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#063ee2]" />
                    <span>Delete or return personal information at the end of the service relationship</span>
                  </li>
                </ul>
              </section>


              {/* 3. Current Subprocessors */}
              <section id="current-list" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Current subprocessors
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  The table below lists the categories of subprocessors that may process personal information in connection with the RelunoOS Service. This list is updated as we add or change service providers.
                </p>


                {/* Responsive Table */}
                <div className="mt-8 overflow-x-auto rounded-2xl border border-zinc-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50">
                      <tr>
                        <th className="px-5 py-4 font-bold text-zinc-900">Provider</th>
                        <th className="px-5 py-4 font-bold text-zinc-900">Service purpose</th>
                        <th className="px-5 py-4 font-bold text-zinc-900">Data categories</th>
                        <th className="px-5 py-4 font-bold text-zinc-900">Location</th>
                        <th className="px-5 py-4 font-bold text-zinc-900">Website</th>
                        <th className="px-5 py-4 font-bold text-zinc-900">Last updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white">
                      {subprocessors.map((sub, index) => {
                        const Icon = sub.icon;
                        return (
                          <tr key={index} className={sub.placeholder ? "bg-amber-50/30" : ""}>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600">
                                  <Icon size={16} />
                                </div>
                                <div>
                                  <p className="font-semibold text-zinc-900">{sub.provider}</p>
                                  {sub.placeholder && (
                                    <p className="mt-1 text-[10px] text-amber-700 font-medium">
                                      Replace with verified provider information before public launch.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-zinc-600 max-w-xs">
                              {sub.purpose}
                            </td>
                            <td className="px-5 py-4 text-zinc-600 max-w-xs">
                              {sub.dataCategories}
                            </td>
                            <td className="px-5 py-4 text-zinc-600">
                              {sub.location}
                            </td>
                            <td className="px-5 py-4">
                              {sub.website !== "[Provider website URL]" ? (
                                <a
                                  href={sub.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[#063ee2] font-semibold hover:text-blue-700"
                                >
                                  Visit
                                  <ExternalLink size={12} />
                                </a>
                              ) : (
                                <span className="text-zinc-400">[To be added]</span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-zinc-600">
                              {sub.dateAdded}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>


                {/* Mobile Card View */}
                <div className="mt-8 space-y-4 lg:hidden">
                  {subprocessors.map((sub, index) => {
                    const Icon = sub.icon;
                    return (
                      <div
                        key={index}
                        className={`rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm ${
                          sub.placeholder ? "border-amber-200 bg-amber-50/30" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600">
                            <Icon size={18} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-bold text-zinc-900">{sub.provider}</h3>
                            {sub.placeholder && (
                              <p className="mt-1 text-[10px] text-amber-700 font-medium">
                                Replace with verified provider information before public launch.
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 space-y-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                              Service purpose
                            </p>
                            <p className="mt-1 text-xs text-zinc-700">{sub.purpose}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                              Data categories
                            </p>
                            <p className="mt-1 text-xs text-zinc-700">{sub.dataCategories}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                Location
                              </p>
                              <p className="mt-1 text-xs text-zinc-700">{sub.location}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                Last updated
                              </p>
                              <p className="mt-1 text-xs text-zinc-700">{sub.dateAdded}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                              Website
                            </p>
                            <p className="mt-1 text-xs">
                              {sub.website !== "[Provider website URL]" ? (
                                <a
                                  href={sub.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#063ee2] font-semibold hover:text-blue-700 inline-flex items-center gap-1"
                                >
                                  {sub.website}
                                  <ExternalLink size={12} />
                                </a>
                              ) : (
                                <span className="text-zinc-400">[To be added]</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>


                <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <p className="text-sm text-blue-800 leading-6">
                    RelunoOS may update this list as service providers change. Material updates should be reflected here after internal review.
                  </p>
                </div>
              </section>


              {/* 4. Notice of Changes */}
              <section id="notice" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Notice of changes
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  RelunoOS may add new subprocessors or change existing service providers as our Service evolves. When we make material changes to our subprocessors, we will update this page with the new provider information.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  If you have a signed data processing agreement (DPA) with RelunoOS that requires advance notice of subprocessor changes, we will comply with the notice obligations specified in that agreement.
                </p>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  We encourage you to check this page periodically for the latest information about our subprocessors.
                </p>
              </section>


              {/* 5. Questions and Contact */}
              <section id="contact" className="scroll-mt-24 mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Questions and contact
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600">
                  If you have questions about our subprocessors, data processing practices, or privacy commitments, please contact us:
                </p>
                
                <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                  <p className="text-base font-bold text-zinc-900">
                    [Legal Company Name]
                  </p>
                  <p className="mt-2 text-sm text-zinc-600">
                    Email: <a href="mailto:[Privacy Contact Email]" className="text-[#063ee2] font-semibold hover:text-blue-700">[Privacy Contact Email]</a>
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Address: [Business Address]
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


              {/* Related Trust Center Links */}
              <section className="mt-20 border-t border-zinc-200 pt-12">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                  Related resources
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
                    to="/status"
                    className="group flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-blue-400 hover:bg-blue-50/40"
                  >
                    <Server size={20} className="mt-0.5 text-[#063ee2]" />
                    <div>
                      <p className="text-sm font-bold text-zinc-900 group-hover:text-[#063ee2] transition-colors">
                        Status
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