import { Link } from "react-router-dom";
import { Cpu, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  products: {
    title: "Products",
    links: [
      { name: "Legal Question AI", href: "/legalquestionai" },
      { name: "Document Generator", href: "/documentgenerator" },
      { name: "Claim Tracker", href: "/claimtracker" },
      { name: "Workflow Automation", href: "/workflowautomation" },
      { name: "Analytics", href: "/analytics" },
    ],
  },
  practiceTypes: {
    title: "Practice Types",
    links: [
      { name: "Personal Injury", href: "/personalinjury" },
      { name: "Family Law", href: "/familylaw" },
      { name: "Contracts", href: "/contracts" },
      { name: "Landlord-Tenant", href: "/landlordtenant" },
      { name: "Small Claims", href: "/smallclaims" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "Blog", href: "/blog" },
      { name: "Guides", href: "/guides" },
      { name: "Templates", href: "/templates" },
      { name: "Webinars", href: "/webinars" },
      { name: "Community", href: "/community" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { name: "About Us", href: "/aboutus" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/careers" },
      { name: "Support", href: "/support" },
      { name: "Affiliates", href: "/affiliates" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms-of-service" },
      { name: "GDPR Notice", href: "/gdpr-notice" },
      { name: "CA Privacy", href: "/ca-privacy" },
      { name: "Disclaimers", href: "/disclaimers" },
    ],
  },
};

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-zinc-900 pt-20 pb-10 font-sans selection:bg-blue-600/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand - Span 2 on mobile/tablet to give it room */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg group-hover:border-blue-600/50 transition-all duration-500">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase">Reluno</span>
            </Link>
            <p className="text-[11px] text-zinc-500 leading-relaxed uppercase tracking-tight font-bold">
              High-performance legal synthesis. Accelerating justice for everyday people.
            </p>
            
            {/* System Status - Quick look */}
            <div className="mt-8 flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
              </span>
              <span className="text-[9px] font-black text-blue-600/60 uppercase tracking-[0.2em]">Core Operational</span>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-[12px] font-medium text-zinc-500 hover:text-cyan-400 transition-colors duration-200"
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
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:row items-center justify-between gap-6">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
            © 2026 RELUNO LEGAL AI. ALL SYSTEMS SYNCHRONIZED.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com/relunoai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-white transition-colors"
            >
              <Twitter className="size-4" />
            </a>
            <a
              href="https://linkedin.com/company/reluno"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-white transition-colors"
            >
              <Linkedin className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;