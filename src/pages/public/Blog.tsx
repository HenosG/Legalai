import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  FileText,
  FolderKanban,
  GitCompareArrows,
  Receipt,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const articles = [
  {
    category: "Comparisons",
    title: "RelunoOS vs HoneyBook: Which Client Workflow Fits Your Agency?",
    description:
      "Compare client context, proposals, projects, invoices, payments, and client visibility for service businesses.",
    readTime: "9 min read",
    href: "/blog/relunoos-vs-honeybook",
    logo: "/HBLOGO.svg",
    accent: "bg-[#f5f7ff] text-[#063ee2]",
  },
  {
    category: "Comparisons",
    title: "RelunoOS vs Dubsado: A Modern Client Operations Comparison",
    description:
      "Understand the differences in workflows, client portals, forms, proposals, project delivery, and payment context.",
    readTime: "10 min read",
    href: "/blog/relunoos-vs-dubsado",
    logo: "/DUBSADO.svg",
    accent: "bg-[#faf5ff] text-violet-700",
  },
  {
    category: "Comparisons",
    title: "RelunoOS vs Bonsai: Client Operations for Agencies and Freelancers",
    description:
      "Compare connected client workflows for CRM, proposals, projects, billing, and client-facing visibility.",
    readTime: "9 min read",
    href: "/blog/relunoos-vs-bonsai",
    logo: "/Bonsai.svg",
    accent: "bg-emerald-50 text-emerald-700",
  },
  {
    category: "Agency operations",
    title: "The Connected Client Workflow: From Inquiry to Payment",
    description:
      "A practical framework for connecting intake, CRM, proposals, projects, invoices, payment, and client visibility.",
    readTime: "8 min read",
    href: "/blog/client-workflow-from-inquiry-to-payment",
    logo: "/1.svg",
    accent: "bg-blue-50 text-[#063ee2]",
  },
  {
    category: "Proposals",
    title: "How to Create a Better Proposal-to-Project Handoff",
    description:
      "Stop losing client context after approval. Keep scope, timelines, responsibilities, and priorities connected.",
    readTime: "7 min read",
    href: "/blog/proposal-to-project-handoff",
    logo: null,
    accent: "bg-indigo-50 text-indigo-700",
  },
  {
    category: "Client experience",
    title: "Why Agencies Need a Clearer Client Portal",
    description:
      "How a focused client workspace can reduce scattered updates and make project progress easier to understand.",
    readTime: "6 min read",
    href: "/blog/client-portal-for-agencies",
    logo: null,
    accent: "bg-cyan-50 text-cyan-700",
  },
];

const categories = [
  "All articles",
  "Comparisons",
  "Agency operations",
  "AI Intake",
  "CRM and clients",
  "Proposals",
  "Projects and delivery",
  "Invoices and payments",
];

function ArticleVisual({
  logo,
  category,
  accent,
}: {
  logo: string | null;
  category: string;
  accent: string;
}) {
  return (
    <div
      className={`relative flex h-48 items-center justify-center overflow-hidden ${accent}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,62,226,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,62,226,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative">
        {logo ? (
          <div className="flex h-20 w-44 items-center justify-center rounded-2xl border border-white/80 bg-white/85 p-5 shadow-[0_12px_30px_rgba(6,62,226,0.1)]">
            <img
              src={logo}
              alt={`${category} article visual`}
              className="max-h-full max-w-full object-contain"
              onError={(event) => {
                event.currentTarget.style.display = "none";

                const fallback = event.currentTarget.nextElementSibling;

                if (fallback instanceof HTMLElement) {
                  fallback.style.display = "flex";
                }
              }}
            />

            <div className="hidden h-full w-full items-center justify-center">
              <GitCompareArrows size={30} />
            </div>
          </div>
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/80 bg-white/85 shadow-[0_12px_30px_rgba(6,62,226,0.1)]">
            {category === "Proposals" ? (
              <FileText size={30} />
            ) : (
              <Users size={30} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Blog() {
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
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/25 blur-[120px]" />

          <div className="relative mx-auto max-w-5xl px-6 text-center sm:px-10">
            <p className="inline-flex items-center gap-2 rounded-lg border border-blue-400/40 bg-blue-600/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur-md">
              <BookOpen size={12} />
              Resources
            </p>

            <h1 className="mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Ideas for calmer client operations.
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Practical workflow guides, product comparisons, and operational
              insights for agencies, freelancers, and client-service teams.
            </p>

            <div className="mx-auto mt-9 flex max-w-xl items-center rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
              <Search size={17} className="text-blue-100/70" />
              <input
                placeholder="Search resources"
                className="ml-3 w-full bg-transparent text-sm text-white outline-none placeholder:text-blue-100/65"
              />
            </div>
          </div>
        </section>

        {/* Featured article */}
        <section className="bg-white px-6 py-20 sm:px-10 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid overflow-hidden rounded-3xl border border-zinc-200 bg-[#f5f7ff] lg:grid-cols-[0.92fr_1.08fr]">
              <div className="relative min-h-[320px] overflow-hidden bg-[#063ee2] p-8 text-white sm:p-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:36px_36px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),rgba(3,26,117,0.6)_65%,rgba(1,11,51,0.85))]" />

                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                    <WorkflowIcon />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100">
                      Featured guide
                    </p>

                    <p className="mt-3 text-2xl font-bold leading-tight tracking-[-0.04em]">
                      Inquiry → AI Intake → CRM → Proposal → Project → Invoice
                      → Client Portal
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center p-8 sm:p-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#063ee2]">
                  Agency operations
                </p>

                <h2 className="mt-4 text-3xl font-bold leading-[1.08] tracking-[-0.045em] text-zinc-900 sm:text-4xl">
                  The Connected Client Workflow: From Inquiry to Payment
                </h2>

                <p className="mt-5 max-w-xl text-base leading-7 text-zinc-500">
                  A practical framework for reducing client-work friction by
                  keeping intake, context, proposals, delivery, invoices,
                  payment visibility, and client experience connected.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 size={14} />
                    8 min read
                  </span>

                  <span>Updated September 2026</span>
                </div>

                <Link
                  to="/blog/client-workflow-from-inquiry-to-payment"
                  className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#063ee2] transition-colors hover:text-blue-800"
                >
                  Read the guide
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories + articles */}
        <section className="border-y border-zinc-100 bg-[#fafafa] px-6 py-20 sm:px-10 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                  Latest resources
                </p>

                <h2 className="mt-5 text-4xl font-bold tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                  Explore the workflow behind better client work.
                </h2>
              </div>

              <Link
                to="/platform"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#063ee2] hover:text-blue-800"
              >
                Explore the platform
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
              {categories.map((category, index) => (
                <button
                  key={category}
                  type="button"
                  className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-bold transition-colors ${
                    index === 0
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-500 hover:border-blue-200 hover:bg-blue-50 hover:text-[#063ee2]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <article
                  key={article.href}
                  className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(6,62,226,0.1)]"
                >
                  <ArticleVisual
                    logo={article.logo}
                    category={article.category}
                    accent={article.accent}
                  />

                  <div className="p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#063ee2]">
                      {article.category}
                    </p>

                    <h3 className="mt-4 text-xl font-bold leading-[1.2] tracking-[-0.035em] text-zinc-900">
                      {article.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                      {article.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-5">
                      <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                        <Clock3 size={13} />
                        {article.readTime}
                      </span>

                      <Link
                        to={article.href}
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#063ee2] transition-colors hover:text-blue-800"
                      >
                        Read article
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison collection */}
        <section className="bg-white px-6 py-20 sm:px-10 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                  Comparison collection
                </p>

                <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                  Compare client workflows with more context.
                </h2>

                <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                  Choosing a client-work platform is not only about a feature
                  checklist. It is about how inquiry capture, client context,
                  proposals, projects, invoices, payments, and client visibility
                  fit your way of working.
                </p>

                <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-500">
                  Our comparison articles use publicly available product
                  information and should be reviewed against each provider’s
                  current website before making a purchase decision.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    logo: "/HBLOGO.svg",
                    title: "HoneyBook comparison",
                    href: "/blog/relunoos-vs-honeybook",
                  },
                  {
                    logo: "/DUBSADO.svg",
                    title: "Dubsado comparison",
                    href: "/blog/relunoos-vs-dubsado",
                  },
                  {
                    logo: "/Bonsai.svg",
                    title: "Bonsai comparison",
                    href: "/blog/relunoos-vs-bonsai",
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="group rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-blue-200 hover:bg-blue-50/40"
                  >
                    <div className="flex h-12 items-center justify-center rounded-xl bg-zinc-50 p-3">
                      <img
                        src={item.logo}
                        alt={item.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <p className="mt-5 text-sm font-bold text-zinc-900">
                      {item.title}
                    </p>

                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#063ee2]">
                      Compare
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="hero-grid relative isolate overflow-hidden px-6 py-20 text-white sm:px-10 sm:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.13)_0%,rgba(3,26,117,0.68)_72%,rgba(1,11,51,0.92)_100%)]" />
          <div className="hero-stripes pointer-events-none absolute inset-0 opacity-40" />

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-blue-100">
              Build a better workflow
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              Bring client work into one connected workspace.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-100">
              RelunoOS connects the stages behind every client relationship,
              from the first inquiry through delivery, invoicing, payment, and
              client visibility.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#063ee2] transition-all hover:bg-blue-50"
              >
                Start free
                <ArrowRight size={15} />
              </Link>

              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                View pricing
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

function WorkflowIcon() {
  return <Sparkles size={25} className="text-white" />;
}