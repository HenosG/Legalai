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
  ShieldCheck,
  Sparkles,
  Users,
  UsersRound,
  WandSparkles,
  Workflow,
  Menu,
  X,
} from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MegaMenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
  color?: string;
  bgColor?: string;
}

const platformItems: MegaMenuItem[] = [
  {
    name: "AI Intake",
    href: "/platform/ai-intake",
    icon: Sparkles,
    description: "Turn raw inquiries into qualified, structured leads.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    name: "CRM",
    href: "/platform/crm",
    icon: Users,
    description: "Keep clients, notes, opportunities, and history organized.",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    name: "Proposals",
    href: "/platform/proposals",
    icon: FileText,
    description: "Create polished scopes, pricing, and client proposals.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    name: "Projects",
    href: "/platform/projects",
    icon: FolderKanban,
    description: "Manage delivery with milestones, tasks, deadlines, and progress.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    name: "Client Portal",
    href: "/platform/client-portal",
    icon: Globe2,
    description: "Give clients a branded view of approved work and updates.",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
];

const solutionItems: MegaMenuItem[] = [
  {
    name: "Agencies",
    href: "/solutions/agencies",
    icon: Building2,
    description: "Bring your leads, proposals, delivery, and clients together.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    name: "Freelancers",
    href: "/solutions/freelancers",
    icon: BriefcaseBusiness,
    description: "Replace scattered admin tools with one focused workspace.",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    name: "Creative Teams",
    href: "/solutions/creative-agencies",
    icon: WandSparkles,
    description: "Organize discovery, proposals, approvals, and delivery.",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    name: "Marketing Agencies",
    href: "/solutions/marketing-agencies",
    icon: Workflow,
    description: "Manage retainers, campaign work, timelines, and reporting.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    name: "Development Agencies",
    href: "/solutions/development-agencies",
    icon: LayoutDashboard,
    description: "Move from client inquiry to delivery milestones with less overhead.",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
];

const resourceItems: MegaMenuItem[] = [
  {
    name: "Blog",
    href: "/blog",
    icon: BookOpen,
    description: "Insights on AI, agency systems, and client operations.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    name: "Guides",
    href: "/guides",
    icon: Lightbulb,
    description: "Practical playbooks for leads, projects, and delivery.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    name: "Templates",
    href: "/templates",
    icon: FileText,
    description: "Proposal, scope, onboarding, and project templates.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    name: "Changelog",
    href: "/changelog",
    icon: Bell,
    description: "Follow product improvements and new releases.",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    name: "Help Center",
    href: "/support",
    icon: HelpCircle,
    description: "Product documentation and support.",
    color: "text-zinc-600",
    bgColor: "bg-zinc-100",
  },
];

const companyItems: MegaMenuItem[] = [
  {
    name: "About RelunoOS",
    href: "/about",
    icon: UsersRound,
    description: "Why we are building better systems for independent work.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    name: "Security & Privacy",
    href: "/security",
    icon: ShieldCheck,
    description: "How RelunoOS approaches data, access, and privacy.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    name: "Contact",
    href: "/contact",
    icon: MessageSquare,
    description: "Talk with the RelunoOS team.",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    name: "Integrations",
    href: "/integrations",
    icon: PlugZap,
    description: "Explore the tools that power agency workflows.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    name: "Support",
    href: "/support",
    icon: HelpCircle,
    description: "Get help with your RelunoOS workspace.",
    color: "text-zinc-600",
    bgColor: "bg-zinc-100",
  },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, isLoaded } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-sm py-3.5"
          : "bg-transparent border-b border-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with Icon + Text */}
<Link to="/" className="flex items-center gap-2 group">
  <img 
    src="/1.svg" 
    alt="RelunoOS Logo" 
    className="h-6 w-6 object-contain" 
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
          {/* Platform */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("platform")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-colors rounded-lg",
                scrolled
                  ? "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                  : "text-white hover:text-white hover:bg-white/15"
              )}
            >
              Platform{" "}
              <ChevronDown
                size={13}
                className={scrolled ? "text-zinc-400" : "text-white/70"}
              />
            </button>
            <AnimatePresence>
              {activeDropdown === "platform" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[560px] rounded-xl bg-white p-6 shadow-2xl border border-zinc-200 grid grid-cols-2 gap-3"
                >
                  {platformItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-zinc-50 transition-colors group"
                      >
                        <div
                          className={cn("p-2 rounded-lg shrink-0", item.bgColor)}
                        >
                          <Icon size={16} className={item.color} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-zinc-500 leading-snug line-clamp-2">
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

          {/* Solutions */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("solutions")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-colors rounded-lg",
                scrolled
                  ? "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                  : "text-white hover:text-white hover:bg-white/15"
              )}
            >
              Solutions{" "}
              <ChevronDown
                size={13}
                className={scrolled ? "text-zinc-400" : "text-white/70"}
              />
            </button>
            <AnimatePresence>
              {activeDropdown === "solutions" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[560px] rounded-xl bg-white p-6 shadow-2xl border border-zinc-200 grid grid-cols-2 gap-3"
                >
                  {solutionItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-zinc-50 transition-colors group"
                      >
                        <div
                          className={cn("p-2 rounded-lg shrink-0", item.bgColor)}
                        >
                          <Icon size={16} className={item.color} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-zinc-500 leading-snug line-clamp-2">
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
              "px-3.5 py-2 text-xs font-semibold transition-colors rounded-lg",
              scrolled
                ? "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                : "text-white hover:text-white hover:bg-white/15"
            )}
          >
            Pricing
          </Link>

          {/* Resources */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("resources")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-colors rounded-lg",
                scrolled
                  ? "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                  : "text-white hover:text-white hover:bg-white/15"
              )}
            >
              Resources{" "}
              <ChevronDown
                size={13}
                className={scrolled ? "text-zinc-400" : "text-white/70"}
              />
            </button>
            <AnimatePresence>
              {activeDropdown === "resources" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-[560px] rounded-xl bg-white p-6 shadow-2xl border border-zinc-200 grid grid-cols-2 gap-3"
                >
                  {resourceItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-zinc-50 transition-colors group"
                      >
                        <div
                          className={cn("p-2 rounded-lg shrink-0", item.bgColor)}
                        >
                          <Icon size={16} className={item.color} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-zinc-500 leading-snug line-clamp-2">
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

          {/* Company */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("company")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-colors rounded-lg",
                scrolled
                  ? "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                  : "text-white hover:text-white hover:bg-white/15"
              )}
            >
              Company{" "}
              <ChevronDown
                size={13}
                className={scrolled ? "text-zinc-400" : "text-white/70"}
              />
            </button>
            <AnimatePresence>
              {activeDropdown === "company" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-[560px] rounded-xl bg-white p-6 shadow-2xl border border-zinc-200 grid grid-cols-2 gap-3"
                >
                  {companyItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-zinc-50 transition-colors group"
                      >
                        <div
                          className={cn("p-2 rounded-lg shrink-0", item.bgColor)}
                        >
                          <Icon size={16} className={item.color} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-zinc-500 leading-snug line-clamp-2">
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
          {isLoaded && user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className={cn(
                  "hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold transition-colors rounded-lg",
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
                    "px-4 py-2 text-xs font-semibold transition-colors rounded-lg",
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
                    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition-all",
                    scrolled
                      ? "bg-zinc-900 text-white hover:bg-zinc-800"
                      : "bg-white text-zinc-950 hover:bg-zinc-100"
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
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-zinc-200 bg-white px-4 py-6 shadow-xl"
          >
            <div className="space-y-4">
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
                Blog
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-zinc-800"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-zinc-800"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;