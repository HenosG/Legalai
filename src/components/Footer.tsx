import { Link } from "react-router-dom";
import { ArrowRight, Linkedin, Twitter } from "lucide-react";

const footerLinks = {
  platform: {
    title: "Platform",
    links: [
      { name: "Platform overview", href: "/platform" },
      { name: "AI Intake", href: "/platform/ai-intake" },
      { name: "CRM & Contacts", href: "/platform/crm" },
      { name: "Proposals", href: "/platform/proposals" },
      { name: "Projects & Delivery", href: "/platform/projects" },
      { name: "Invoices & Payments", href: "/platform/invoices" },
      { name: "Client Portal", href: "/platform/client-portal" },
    ],
  },
  solutions: {
    title: "Solutions",
    links: [
      { name: "Agencies", href: "/solutions/agencies" },
      { name: "Freelancers", href: "/solutions/freelancers" },
      { name: "Creative Teams", href: "/solutions/creative-agencies" },
      { name: "Marketing Agencies", href: "/solutions/marketing-agencies" },
      {
        name: "Development Agencies",
        href: "/solutions/development-agencies",
      },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "Blog", href: "/blog" },
      { name: "Guides", href: "/guides" },
      { name: "Templates", href: "/templates" },
      { name: "Changelog", href: "/changelog" },
      { name: "Help Center", href: "/support" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { name: "About RelunoOS", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Security & Privacy", href: "/security" },
      { name: "Pricing", href: "/pricing" },
      { name: "Sign in", href: "/login" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Acceptable Use", href: "/acceptable-use" },
      { name: "Subprocessors", href: "/subprocessors" },
      { name: "Status", href: "/status" },
    ],
  },
};

const comparisonLinks = [
  {
    name: "RelunoOS vs HoneyBook",
    href: "/blog/relunoos-vs-honeybook",
  },
  {
    name: "RelunoOS vs Dubsado",
    href: "/blog/relunoos-vs-dubsado",
  },
  {
    name: "RelunoOS vs Bonsai",
    href: "/blog/relunoos-vs-bonsai",
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-blue-500/40 bg-[#063ee2] pb-10 pt-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2.9fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="mb-5 inline-flex items-center gap-2.5">
              <img
                src="/1-white.svg"
                alt="RelunoOS logo"
                className="h-6 w-6 object-contain"
              />

              <span className="text-2xl font-bold tracking-tight">
                Reluno
                <span className="text-blue-200">OS</span>
              </span>
            </Link>

            <p className="max-w-[240px] text-xs leading-relaxed text-blue-100">
              The connected operating system for agencies, freelancers, and
              client-service teams.
            </p>

            <div className="mt-7 rounded-2xl border border-white/15 bg-white/10 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
                Built around the workflow
              </p>

              <p className="mt-2 text-sm font-semibold leading-6 text-white">
                Inquiry → client context → proposal → delivery → payment.
              </p>

              <Link
                to="/platform"
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-white transition-colors hover:text-blue-100"
              >
                Explore the platform
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Footer links */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 xl:grid-cols-6">
            {Object.values(footerLinks).map((section) => (
              <div key={section.title}>
                <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                  {section.title}
                </h4>

                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-xs text-blue-100 transition-colors duration-150 hover:text-white"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                Comparisons
              </h4>

              <ul className="space-y-3">
                {comparisonLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-xs text-blue-100 transition-colors duration-150 hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 flex flex-col gap-5 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-white">
              Build a calmer client operation.
            </p>

            <p className="mt-1 text-xs leading-5 text-blue-100">
              Explore RelunoOS resources or start your free workspace.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/blog"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/10"
            >
              Read the blog
              <ArrowRight size={13} />
            </Link>

            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#063ee2] transition-colors hover:bg-blue-50"
            >
              Start free
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-blue-500/40 pt-8 md:flex-row">
          <p className="text-[11px] text-blue-100">
            © {new Date().getFullYear()} RelunoOS. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="https://twitter.com/relunoos"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RelunoOS on X"
              className="text-blue-100 transition-colors hover:text-white"
            >
              <Twitter size={15} />
            </a>

            <a
              href="https://linkedin.com/company/reluno"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RelunoOS on LinkedIn"
              className="text-blue-100 transition-colors hover:text-white"
            >
              <Linkedin size={15} />
            </a>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-[10px] leading-relaxed text-blue-100">
          RelunoOS helps agencies and freelancers organize leads, clients,
          proposals, projects, invoices, payments, and client operations in one
          connected workspace.
        </p>
      </div>
    </footer>
  );
};

export default Footer;