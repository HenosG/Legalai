import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export type BlogTocItem = {
  id: string;
  label: string;
};

type BlogArticleLayoutProps = {
  category: string;
  title: string;
  description: string;
  readTime: string;
  publishedDate: string;
  updatedDate: string;
  toc: BlogTocItem[];
  children: React.ReactNode;
};

export default function BlogArticleLayout({
  category,
  title,
  description,
  readTime,
  publishedDate,
  updatedDate,
  toc,
  children,
}: BlogArticleLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fafafa] text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap");

        * {
          font-family: "DM Sans", sans-serif;
        }

        .font-display {
          font-family: "DM Serif Display", serif;
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

        .article-content h2 {
          scroll-margin-top: 7rem;
          margin-top: 3.5rem;
          color: #18181b;
          font-size: 1.875rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.08;
        }

        .article-content h3 {
          scroll-margin-top: 7rem;
          margin-top: 2.25rem;
          color: #18181b;
          font-size: 1.125rem;
          font-weight: 700;
          line-height: 1.4;
        }

        .article-content p {
          margin-top: 1.15rem;
          color: #52525b;
          font-size: 1rem;
          line-height: 1.8;
        }

        .article-content ul {
          margin-top: 1.25rem;
          display: grid;
          gap: 0.85rem;
          color: #52525b;
          font-size: 1rem;
          line-height: 1.7;
        }

        .article-content li {
          position: relative;
          padding-left: 1.5rem;
        }

        .article-content li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.65rem;
          width: 0.45rem;
          height: 0.45rem;
          border-radius: 9999px;
          background: #063ee2;
        }

        .article-content a {
          color: #063ee2;
          font-weight: 700;
          text-decoration: none;
        }

        .article-content a:hover {
          text-decoration: underline;
        }

        .article-content table {
          width: 100%;
          min-width: 720px;
          border-collapse: collapse;
          overflow: hidden;
          border-radius: 1rem;
          border: 1px solid #e4e4e7;
          background: white;
          font-size: 0.875rem;
        }

        .article-content th {
          background: #f4f4f5;
          color: #71717a;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-align: left;
          text-transform: uppercase;
        }

        .article-content th,
        .article-content td {
          border-bottom: 1px solid #f4f4f5;
          padding: 1rem;
          vertical-align: top;
        }

        .article-content td {
          color: #52525b;
          line-height: 1.55;
        }

        .article-content tr:last-child td {
          border-bottom: 0;
        }
      `}</style>

      <Navbar />

      <main>
        <section className="hero-grid relative isolate overflow-hidden border-b border-blue-700 pb-16 pt-32 text-white sm:pb-20 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(3,26,117,0.65)_70%,rgba(1,11,51,0.9)_100%)]" />
          <div className="hero-stripes pointer-events-none absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/25 blur-[120px]" />

          <div className="relative mx-auto max-w-5xl px-6 sm:px-10">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-100 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to resources
            </Link>

            <div className="mt-10">
              <p className="inline-flex items-center gap-2 rounded-lg border border-blue-400/40 bg-blue-600/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur-md">
                <Sparkles size={12} />
                {category}
              </p>

              <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                {title}
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-7 text-blue-100 sm:text-lg">
                {description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-blue-100/90">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={14} className="text-blue-200" />
                  Published {publishedDate}
                </span>

                <span className="inline-flex items-center gap-2">
                  <Clock3 size={14} className="text-blue-200" />
                  {readTime}
                </span>

                <span>Updated {updatedDate}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16 sm:px-10 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  In this article
                </p>

                <nav className="mt-4 space-y-1">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block rounded-lg px-2 py-2 text-xs font-semibold leading-5 text-zinc-500 transition-colors hover:bg-white hover:text-[#063ee2]"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <article className="article-content min-w-0 max-w-3xl">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                <p className="text-sm font-bold text-zinc-900">
                  Practical note
                </p>

                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  RelunoOS publishes these resources to help agencies,
                  freelancers, and client-service teams build clearer workflows.
                  Product features, pricing, and availability can change—always
                  verify current details directly with the relevant provider.
                </p>
              </div>

              {children}

              {/* Callout Card */}
              <div className="mt-14 w-full rounded-3xl bg-[#063EE2] px-6 py-8 text-center shadow-xl ring-1 ring-white/10 sm:px-12 sm:py-10">
                <div className="mx-auto max-w-4xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] !text-white">
                    Build a calmer workflow
                  </p>

                  <h2 className="!mt-3 text-3xl font-bold tracking-tight !text-white sm:text-4xl">
                    Bring client work into one connected workspace.
                  </h2>

                  <p className="mx-auto !mt-3 max-w-3xl text-base leading-7 !text-white/90">
                    RelunoOS connects inquiries, client context, proposals,
                    projects, invoices, payment visibility, and client-facing
                    progress in one operating system.
                  </p>

                  <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                      to="/signup"
                      className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold !text-[#063EE2] !no-underline shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-50 active:translate-y-0"
                    >
                      Start free
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>

                    <Link
                      to="/platform"
                      className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold !text-[#063EE2] !no-underline shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-50 active:translate-y-0"
                    >
                      Explore platform
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}