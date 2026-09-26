import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PublicPageTemplateProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  children?: ReactNode;
  note?: string;
}

export default function PublicPageTemplate({
  eyebrow = "RELUNOOS",
  title,
  description,
  primaryCtaLabel = "Start free",
  primaryCtaHref = "/signup",
  secondaryCtaLabel = "View pricing",
  secondaryCtaHref = "/pricing",
  children,
  note = "No credit card required. Build your workspace in minutes.",
}: PublicPageTemplateProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <Navbar />

      <main className="overflow-hidden pt-28 sm:pt-36">
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-10 sm:px-10 sm:pb-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
              <Sparkles size={12} />
              {eyebrow}
            </div>

            <h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-500 sm:text-lg">
              {description}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to={primaryCtaHref}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(24,24,27,0.16)] transition-all hover:-translate-y-0.5 hover:bg-zinc-800"
              >
                {primaryCtaLabel}
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to={secondaryCtaHref}
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
              >
                {secondaryCtaLabel}
              </Link>
            </div>

            <p className="mt-5 text-xs text-zinc-400">{note}</p>
          </div>
        </section>

        {children ? (
          children
        ) : (
          <section className="border-y border-zinc-100 bg-white">
            <div className="mx-auto grid max-w-5xl gap-5 px-6 py-16 sm:grid-cols-3 sm:px-10">
              <div className="rounded-2xl border border-zinc-200 bg-[#FAFAFA] p-6">
                <CheckCircle2 size={18} className="mb-4 text-blue-600" />
                <h2 className="text-sm font-bold text-zinc-900">
                  One connected workflow
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Move from first inquiry to active client work without manually
                  copying data between disconnected tools.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-[#FAFAFA] p-6">
                <CheckCircle2 size={18} className="mb-4 text-blue-600" />
                <h2 className="text-sm font-bold text-zinc-900">
                  Human control first
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  AI helps organize and draft work while you control every
                  client-facing decision.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-[#FAFAFA] p-6">
                <CheckCircle2 size={18} className="mb-4 text-blue-600" />
                <h2 className="text-sm font-bold text-zinc-900">
                  Built for client work
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Keep leads, clients, proposals, projects, tasks, and delivery
                  progress organized in one workspace.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}