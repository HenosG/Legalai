import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  FileText,
  FolderKanban,
  MessageSquareText,
  Receipt,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const updates = [
  {
    date: "September 2026",
    version: "Platform update",
    title: "Connected Platform Pages",
    description:
      "Added dedicated public pages for AI Intake, CRM, Proposals, Projects, Invoices & Payments, and Client Portal so visitors can understand the complete RelunoOS client workflow.",
    tags: ["Platform", "Marketing site"],
    icon: Sparkles,
    accent: "blue",
    links: [
      {
        label: "Explore Platform",
        href: "/platform",
      },
    ],
  },
  {
    date: "September 2026",
    version: "Product foundation",
    title: "Invoice Workflow Foundation",
    description:
      "Added invoice list, invoice creation, invoice detail, invoice edit, billing settings, and Stripe integration workflow foundations for connected client payment operations.",
    tags: ["Invoices", "Payments", "Stripe"],
    icon: Receipt,
    accent: "emerald",
    links: [
      {
        label: "Explore Invoices",
        href: "/platform/invoices",
      },
    ],
  },
  {
    date: "September 2026",
    version: "Client operations",
    title: "Client Workflow Pages",
    description:
      "Expanded RelunoOS positioning around the full client journey: inquiry, AI Intake, CRM, proposal, project delivery, invoice, payment, and Client Portal visibility.",
    tags: ["Workflow", "Client operations"],
    icon: FolderKanban,
    accent: "violet",
    links: [
      {
        label: "Read workflow guide",
        href: "/blog/client-workflow-from-inquiry-to-payment",
      },
    ],
  },
  {
    date: "September 2026",
    version: "Trust center",
    title: "Security, Privacy, and Legal Foundation",
    description:
      "Added Security & Privacy, Privacy Policy, Terms of Service, Acceptable Use, Subprocessors, and Status pages to make product information and trust resources easier to find.",
    tags: ["Security", "Privacy", "Trust"],
    icon: ShieldCheck,
    accent: "cyan",
    links: [
      {
        label: "View Security & Privacy",
        href: "/security",
      },
    ],
  },
  {
    date: "September 2026",
    version: "Support",
    title: "Contact Workflow Foundation",
    description:
      "Added a public contact form flow with database storage and private internal message access foundations for product, pricing, support, and security requests.",
    tags: ["Contact", "Support"],
    icon: MessageSquareText,
    accent: "amber",
    links: [
      {
        label: "Contact RelunoOS",
        href: "/contact",
      },
    ],
  },
  {
    date: "September 2026",
    version: "Resources",
    title: "Agency Operations Resource Center",
    description:
      "Added the RelunoOS Blog with practical workflow articles and comparison pages for agencies, freelancers, and client-service teams evaluating client operations tools.",
    tags: ["Blog", "Resources"],
    icon: FileText,
    accent: "blue",
    links: [
      {
        label: "Visit the Blog",
        href: "/blog",
      },
    ],
  },
];

const accentStyles = {
  blue: {
    icon: "bg-blue-50 text-[#063ee2]",
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    dot: "bg-[#063ee2]",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
    badge: "bg-violet-50 text-violet-700 border-violet-100",
    dot: "bg-violet-500",
  },
  cyan: {
    icon: "bg-cyan-50 text-cyan-600",
    badge: "bg-cyan-50 text-cyan-700 border-cyan-100",
    dot: "bg-cyan-500",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    dot: "bg-amber-500",
  },
};

export default function Changelog() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fafafa] text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap");

        * {
          font-family: "DM Sans", sans-serif;
        }

        .hero-grid {
          background-color: #063ee2;
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
        {/* Hero */}
        <section className="hero-grid relative isolate overflow-hidden border-b border-blue-700 pb-20 pt-36 text-white sm:pb-24 sm:pt-44">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(3,26,117,0.65)_70%,rgba(1,11,51,0.9)_100%)]" />
          <div className="hero-stripes pointer-events-none absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-[440px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/25 blur-[120px]" />

          <div className="relative mx-auto max-w-5xl px-6 text-center sm:px-10">
            <p className="inline-flex items-center gap-2 rounded-lg border border-blue-400/40 bg-blue-600/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur-md">
              <Bell size={12} />
              Product updates
            </p>

            <h1 className="mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              What’s new in RelunoOS.
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Follow updates to the RelunoOS platform, client workflow tools,
              trust resources, billing foundations, and product experience.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-blue-100/90">
              <span className="inline-flex items-center gap-2">
                <Check size={14} className="text-blue-200" />
                Only real product updates
              </span>

              <span className="inline-flex items-center gap-2">
                <Check size={14} className="text-blue-200" />
                Built in public with clarity
              </span>
            </div>
          </div>
        </section>

        {/* Updates */}
        <section className="bg-white px-6 py-20 sm:px-10 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)]">
              <aside className="hidden lg:block">
                <div className="sticky top-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    Release notes
                  </p>

                  <p className="mt-3 text-xs leading-5 text-zinc-500">
                    Product and platform updates are listed here as RelunoOS
                    evolves.
                  </p>

                  <Link
                    to="/blog"
                    className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#063ee2] hover:text-blue-800"
                  >
                    Read resources
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </aside>

              <div>
                <div className="mb-10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#063ee2]">
                    Latest updates
                  </p>

                  <h2 className="mt-4 text-3xl font-bold tracking-[-0.045em] text-zinc-900 sm:text-4xl">
                    September 2026
                  </h2>
                </div>

                <div className="relative space-y-6 before:absolute before:bottom-0 before:left-[20px] before:top-0 before:w-px before:bg-zinc-200">
                  {updates.map((update) => {
                    const Icon = update.icon;
                    const style =
                      accentStyles[
                        update.accent as keyof typeof accentStyles
                      ];

                    return (
                      <article
                        key={update.title}
                        className="relative pl-14 sm:pl-16"
                      >
                        <div
                          className={`absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-xl ${style.icon}`}
                        >
                          <Icon size={18} />
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_12px_30px_rgba(6,62,226,0.04)] sm:p-6">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                                  {update.date}
                                </span>

                                <span
                                  className={`rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${style.badge}`}
                                >
                                  {update.version}
                                </span>
                              </div>

                              <h3 className="mt-4 text-xl font-bold tracking-[-0.03em] text-zinc-900">
                                {update.title}
                              </h3>
                            </div>

                            <span
                              className={`mt-1 hidden h-2 w-2 rounded-full sm:block ${style.dot}`}
                            />
                          </div>

                          <p className="mt-4 text-sm leading-6 text-zinc-500">
                            {update.description}
                          </p>

                          <div className="mt-5 flex flex-wrap gap-2">
                            {update.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-bold text-zinc-500"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="mt-6 flex flex-wrap gap-4 border-t border-zinc-100 pt-5">
                            {update.links.map((link) => (
                              <Link
                                key={link.href}
                                to={link.href}
                                className="group inline-flex items-center gap-2 text-xs font-bold text-[#063ee2] transition-colors hover:text-blue-800"
                              >
                                {link.label}
                                <ArrowRight
                                  size={13}
                                  className="transition-transform group-hover:translate-x-1"
                                />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-zinc-100 bg-[#f5f7ff] px-6 py-20 sm:px-10 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#063ee2]">
              Explore the product
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-[-0.045em] text-zinc-900 sm:text-5xl">
              See the connected workflow behind each update.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-500">
              RelunoOS connects client inquiry, CRM, proposals, projects,
              invoices, payment visibility, and Client Portal access in one
              workspace.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/platform"
                className="inline-flex items-center gap-2 rounded-xl bg-[#063ee2] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
              >
                Explore the platform
                <ArrowRight size={15} />
              </Link>

              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-800 transition-colors hover:bg-zinc-50"
              >
                Start free
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}