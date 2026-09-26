import { Link } from "react-router-dom";
import { Linkedin, Twitter } from "lucide-react";

const footerLinks = {
  platform: {
    title: "Platform",
    links: [
      { name: "AI Intake", href: "/platform/ai-intake" },
      { name: "CRM", href: "/platform/crm" },
      { name: "Proposals", href: "/platform/proposals" },
      { name: "Projects", href: "/platform/projects" },
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
      { name: "Development Agencies", href: "/solutions/development-agencies" },
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

const Footer = () => {
  return (
    <footer className="border-t border-blue-500/40 bg-[#063EE2] pb-10 pt-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to="/" className="mb-5 inline-flex items-center gap-2.5">
              <img
                src="/1-white.svg"
                alt="RelunoOS Logo"
                className="h-6 w-6 object-contain"
              />
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                Reluno
                <span className="text-blue-200">OS</span>
              </span>
            </Link>

            <p className="max-w-[210px] text-xs leading-relaxed text-blue-100">
              The AI operating system for agencies and freelancers.
            </p>
          </div>

          {/* Link Columns */}
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
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-5 border-t border-blue-500/40 pt-8 md:flex-row">
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
          RelunoOS helps agencies and freelancers organize leads, clients, proposals,
          projects, and client operations in one connected workspace.
        </p>
      </div>
    </footer>
  );
};

export default Footer;