import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  FileText,
  FolderKanban,
  Globe2,
  HelpCircle,
  LayoutDashboard,
  Lightbulb,
  MessageSquare,
  PlugZap,
  Receipt,
  ShieldCheck,
  Sparkles,
  Users,
  UsersRound,
  WandSparkles,
  Workflow,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MegaMenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
  color?: string;
}

const platformItems: MegaMenuItem[] = [
  {
    name: "AI Intake",
    href: "/platform/ai-intake",
    icon: Sparkles,
    description: "Turn raw inquiries into qualified, structured leads instantly.",
    badge: "AI-Powered",
    color: "text-blue-600",
  },
  {
    name: "CRM & Contacts",
    href: "/platform/crm",
    icon: Users,
    description: "Keep clients, notes, opportunities, and history organized.",
    color: "text-violet-600",
  },
  {
    name: "Proposals",
    href: "/platform/proposals",
    icon: FileText,
    description: "Create polished scopes, pricing, and sign-off agreements.",
    color: "text-emerald-600",
  },
  {
    name: "Invoices & Billing",
    href: "/platform/invoices",
    icon: Receipt,
    description: "Bill clients, track payments, and automate Stripe receipts.",
    color: "text-cyan-600",
  },
  {
    name: "Projects & Delivery",
    href: "/platform/projects",
    icon: FolderKanban,
    description: "Manage delivery with milestones, tasks, and deadlines.",
    color: "text-amber-600",
  },
  {
    name: "Client Portal",
    href: "/platform/client-portal",
    icon: Globe2,
    description: "Give clients a secure, branded view of approved work.",
    badge: "Popular",
    color: "text-rose-600",
  },
];

const solutionItems: MegaMenuItem[] = [
  {
    name: "Agencies",
    href: "/solutions/agencies",
    icon: Building2,
    description: "Bring leads, proposals, delivery, and billing together.",
    color: "text-blue-600",
  },
  {
    name: "Freelancers",
    href: "/solutions/freelancers",
    icon: BriefcaseBusiness,
    description: "Replace scattered admin tools with one focused workspace.",
    color: "text-violet-600",
  },
  {
    name: "Creative Teams",
    href: "/solutions/creative-agencies",
    icon: WandSparkles,
    description: "Organize discovery, client approvals, and asset delivery.",
    color: "text-pink-600",
  },
  {
    name: "Marketing Agencies",
    href: "/solutions/marketing-agencies",
    icon: Workflow,
    description: "Manage retainers, campaign work, timelines, and reporting.",
    color: "text-orange-600",
  },
  {
    name: "Development Agencies",
    href: "/solutions/development-agencies",
    icon: LayoutDashboard,
    description: "Move from client inquiry to deployment milestones cleanly.",
    color: "text-teal-600",
  },
];

const resourceItems: MegaMenuItem[] = [
  {
    name: "Blog & GEO Insights",
    href: "/blog",
    icon: BookOpen,
    description: "Deep dives on modern agency operations and AI workflows.",
    color: "text-blue-600",
  },
  {
    name: "Guides",
    href: "/guides",
    icon: Lightbulb,
    description: "Practical playbooks for scaling client communication.",
    color: "text-amber-600",
  },
  {
    name: "Templates",
    href: "/templates",
    icon: FileText,
    description: "Ready-to-use proposal, scope, and onboarding templates.",
    color: "text-emerald-600",
  },
  {
    name: "Changelog",
    href: "/changelog",
    icon: Bell,
    description: "Track the latest platform updates and feature releases.",
    badge: "v2.0",
    color: "text-violet-600",
  },
  {
    name: "Help Center",
    href: "/support",
    icon: HelpCircle,
    description: "Documentation and setup assistance for your workspace.",
    color: "text-zinc-600",
  },
];

const companyItems: MegaMenuItem[] = [
  {
    name: "About RelunoOS",
    href: "/about",
    icon: UsersRound,
    description: "Our mission to build calmer operating systems for independents.",
    color: "text-blue-600",
  },
  {
    name: "Security & Trust",
    href: "/security",
    icon: ShieldCheck,
    description: "Data encryption, Clerk auth, and Stripe payment safety.",
    color: "text-emerald-600",
  },
  {
    name: "Integrations",
    href: "/integrations",
    icon: PlugZap,
    description: "Explore Neon database, Resend, and Stripe connectivity.",
    color: "text-amber-600",
  },
  {
    name: "Contact Support",
    href: "/contact",
    icon: MessageSquare,
    description: "Get in touch directly with our engineering team.",
    color: "text-violet-600",
  },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-xs"
          : "bg-transparent border-b border-transparent"
      )}
    >
      {/* Notification Banner */}
      <AnimatePresence>
        {isBannerVisible && (
          <motion.div
            initial={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative isolate flex items-center justify-center gap-x-4 overflow-hidden bg-blue-600 px-4 pr-10 py-2 text-center text-xs font-medium text-white shadow-xs"
          >
            <span className="hidden sm:flex items-center rounded-full bg-blue-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-100 border border-blue-400/30">
              v2.0 Live
            </span>
            <p className="truncate">
              RelunoOS is live! Build a calmer operation for your client work.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1 font-bold text-white underline decoration-white/50 underline-offset-4 transition-colors hover:text-blue-100 hover:decoration-white shrink-0"
            >
              Get started free <ArrowRight size={12} />
            </Link>
            <button
              type="button"
              onClick={() => setIsBannerVisible(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blue-200 hover:text-white transition-colors rounded-md hover:bg-blue-700/50"
              aria-label="Dismiss banner"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Nav Bar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src={scrolled ? "/1.svg" : "/1-white.svg"} 
            alt="RelunoOS Logo" 
            className="h-6 w-6 object-contain transition-all" 
          />
          <span
            className={cn(
              "font-sans text-xl font-bold tracking-[-0.055em] transition-colors",
              scrolled ? "text-zinc-900" : "text-white"
            )}
          >
            RELUNOOS<span className="text-blue-500">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {/* Platform Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("platform")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-all rounded-lg",
                scrolled
                  ? "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80"
                  : "text-white hover:text-white hover:bg-white/15"
              )}
            >
              Platform{" "}
              <ChevronDown
                size={13}
                className={cn("transition-transform duration-200", activeDropdown === "platform" ? "rotate-180" : "", scrolled ? "text-zinc-400" : "text-white/70")}
              />
            </button>
            <AnimatePresence>
              {activeDropdown === "platform" && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[600px] rounded-2xl bg-white p-5 shadow-2xl border border-zinc-200/80 grid grid-cols-2 gap-2.5 ring-1 ring-black/5"
                >
                  {platformItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50/80 transition-all border border-transparent hover:border-zinc-200/60 group"
                      >
                        <div className="shrink-0 pt-0.5">
                          <Icon size={18} strokeWidth={2.5} className={item.color} />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                              {item.name}
                            </p>
                            {item.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/50">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Solutions Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("solutions")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-all rounded-lg",
                scrolled
                  ? "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80"
                  : "text-white hover:text-white hover:bg-white/15"
              )}
            >
              Solutions{" "}
              <ChevronDown
                size={13}
                className={cn("transition-transform duration-200", activeDropdown === "solutions" ? "rotate-180" : "", scrolled ? "text-zinc-400" : "text-white/70")}
              />
            </button>
            <AnimatePresence>
              {activeDropdown === "solutions" && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[600px] rounded-2xl bg-white p-5 shadow-2xl border border-zinc-200/80 grid grid-cols-2 gap-2.5 ring-1 ring-black/5"
                >
                  {solutionItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50/80 transition-all border border-transparent hover:border-zinc-200/60 group"
                      >
                        <div className="shrink-0 pt-0.5">
                          <Icon size={18} strokeWidth={2.5} className={item.color} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/pricing"
            className={cn(
              "px-3.5 py-2 text-xs font-semibold transition-all rounded-lg",
              scrolled
                ? "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80"
                : "text-white hover:text-white hover:bg-white/15"
            )}
          >
            Pricing
          </Link>

          {/* Resources Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("resources")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-all rounded-lg",
                scrolled
                  ? "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80"
                  : "text-white hover:text-white hover:bg-white/15"
              )}
            >
              Resources{" "}
              <ChevronDown
                size={13}
                className={cn("transition-transform duration-200", activeDropdown === "resources" ? "rotate-180" : "", scrolled ? "text-zinc-400" : "text-white/70")}
              />
            </button>
            <AnimatePresence>
              {activeDropdown === "resources" && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-[600px] rounded-2xl bg-white p-5 shadow-2xl border border-zinc-200/80 grid grid-cols-2 gap-2.5 ring-1 ring-black/5"
                >
                  {resourceItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50/80 transition-all border border-transparent hover:border-zinc-200/60 group"
                      >
                        <div className="shrink-0 pt-0.5">
                          <Icon size={18} strokeWidth={2.5} className={item.color} />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                              {item.name}
                            </p>
                            {item.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-200/50">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Company Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("company")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-all rounded-lg",
                scrolled
                  ? "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80"
                  : "text-white hover:text-white hover:bg-white/15"
              )}
            >
              Company{" "}
              <ChevronDown
                size={13}
                className={cn("transition-transform duration-200", activeDropdown === "company" ? "rotate-180" : "", scrolled ? "text-zinc-400" : "text-white/70")}
              />
            </button>
            <AnimatePresence>
              {activeDropdown === "company" && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-[520px] rounded-2xl bg-white p-5 shadow-2xl border border-zinc-200/80 grid grid-cols-2 gap-2.5 ring-1 ring-black/5"
                >
                  {companyItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50/80 transition-all border border-transparent hover:border-zinc-200/60 group"
                      >
                        <div className="shrink-0 pt-0.5">
                          <Icon size={18} strokeWidth={2.5} className={item.color} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Actions / Clerk Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className={cn(
                  "hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold transition-all rounded-lg",
                  scrolled
                    ? "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                    : "text-white hover:text-white hover:bg-white/15"
                )}
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className={cn(
                    "px-4 py-2 text-xs font-semibold transition-all rounded-lg",
                    scrolled
                      ? "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                      : "text-white hover:text-white hover:bg-white/15"
                  )}
                >
                  Log in
                </button>
              </SignInButton>

              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className={cn(
                    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-xs font-semibold shadow-xs transition-all",
                    scrolled
                      ? "bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm"
                      : "bg-white text-zinc-950 hover:bg-zinc-100 shadow-md"
                  )}
                >
                  Get started for free
                </motion.button>
              </Link>
            </>
          )}

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            className={cn(
              "md:hidden p-2 rounded-lg",
              scrolled
                ? "text-zinc-800 hover:bg-zinc-100"
                : "text-white hover:bg-white/15"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-zinc-200 bg-white px-6 py-6 shadow-2xl"
          >
            <div className="space-y-4">
              <Link
                to="/platform/client-portal"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-zinc-800"
              >
                Platform Overview
              </Link>
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-zinc-800"
              >
                Pricing
              </Link>
              <Link
                to="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-zinc-800"
              >
                Blog & GEO Insights
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-zinc-800"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-zinc-800"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;