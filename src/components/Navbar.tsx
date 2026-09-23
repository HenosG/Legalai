import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Menu, X, ChevronDown, LogOut, User, Zap, Shield, BarChart3,
  Workflow, HelpCircle, BookOpen, FileText, Users, Briefcase,
  AlertCircle, Home, Settings, MessageSquare, Lightbulb,
  ArrowRight, Bell, Search, Globe, ShieldCheck, TrendingUp, Scale,
} from "lucide-react";
import { useUser, SignInButton, UserButton } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  // Platform Tools
  const platformTools = [
    {
      name: "Legal Question AI",
      href: "/legalquestionai",
      icon: Lightbulb,
      description: "Ask any legal question, get instant answers",
      color: "text-blue-600",
      bgColor: "bg-blue-50/50",
    },
    {
      name: "Document Generator",
      href: "/documentgenerator",
      icon: FileText,
      description: "Generate professional legal documents",
      color: "text-purple-600",
      bgColor: "bg-purple-50/50",
    },
    {
      name: "Claim Tracker",
      href: "/claimtracker",
      icon: TrendingUp,
      description: "Track and manage your legal claims",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50/50",
    },
    {
      name: "Workflow Automation",
      href: "/workflowautomation",
      icon: Workflow,
      description: "Automate repetitive legal tasks",
      color: "text-orange-600",
      bgColor: "bg-orange-50/50",
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      description: "Insights into your legal matters",
      color: "text-pink-600",
      bgColor: "bg-pink-50/50",
    },
  ];

  // Practice Types
  const practiceTypes = [
    {
      name: "Personal Injury",
      href: "/personalinjury",
      icon: AlertCircle,
      description: "Car accidents, injuries, claims",
      color: "text-red-600",
      bgColor: "bg-red-50/50",
    },
    {
      name: "Family Law",
      href: "/familylaw",
      icon: Users,
      description: "Divorce, custody, agreements",
      color: "text-pink-600",
      bgColor: "bg-pink-50/50",
    },
    {
      name: "Contracts",
      href: "/contracts",
      icon: ShieldCheck,
      description: "Review, draft, negotiate contracts",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50/50",
    },
    {
      name: "Landlord-Tenant",
      href: "/landlordtenant",
      icon: Home,
      description: "Lease disputes, evictions, repairs",
      color: "text-amber-600",
      bgColor: "bg-amber-50/50",
    },
    {
      name: "Small Claims",
      href: "/smallclaims",
      icon: Scale,
      description: "Small disputes, quick resolution",
      color: "text-teal-600",
      bgColor: "bg-teal-50/50",
    },
  ];

  // Resources
  const resources = [
    { name: "Blog", href: "/blog", icon: BookOpen, description: "Latest legal tech insights" },
    { name: "Guides", href: "/guides", icon: HelpCircle, description: "Step-by-step legal help" },
    { name: "Templates", href: "/templates", icon: FileText, description: "Free legal document forms" },
    { name: "Webinars", href: "/webinars", icon: Users, description: "Learn from legal experts" },
    { name: "Community", href: "/community", icon: MessageSquare, description: "Connect with other users" },
  ];

  // Company Links
  const companyLinks = [
    { name: "About Us", href: "/aboutus", icon: Briefcase, description: "Our mission and values" },
    { name: "Contact", href: "/contact", icon: MessageSquare, description: "Get in touch with us" },
    { name: "Careers", href: "/careers", icon: Users, description: "Join our growing team" },
    { name: "Support", href: "/support", icon: HelpCircle, description: "Help and documentation" },
    { name: "Affiliates", href: "/affiliates", icon: Zap, description: "Partner with Reluno AI" },
  ];

  const navLinks = [
    { name: "Platform", dropdown: true, category: "Product Suite", description: "Legal synthesis tools." },
    { name: "Practice Types", dropdown: true, category: "Practice Areas", description: "Specialized solutions." },
    { name: "Pricing", href: "/pricing", dropdown: false },
    { name: "Resources", dropdown: true, category: "Learning Hub", description: "Navigate the law." },
    { name: "Company", dropdown: true, category: "Our Story", description: "Accessible justice." },
  ];

  const MegaMenu = ({ title, description, items, align }: { title: string; description: string; items: any[]; align: "left" | "center" | "right" }) => (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.99 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "absolute top-[calc(100%-5px)] w-screen max-w-4xl bg-white border border-zinc-100 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-8 z-50",
        align === "left" ? "left-0" : align === "right" ? "right-0" : "left-1/2 -translate-x-1/2"
      )}
    >
      <div className="flex gap-12">
        {/* Hero Section */}
        <div className="w-52 shrink-0 border-r border-zinc-50 pr-8">
          <motion.h4 
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.25em] mb-3"
          >
            {title}
          </motion.h4>
          <motion.p 
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg font-serif text-zinc-900 leading-tight mb-5"
          >
            {description}
          </motion.p>
          <Link to="/contact" className="group flex items-center gap-2 text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Explore more <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid Section */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + index * 0.03 }}
              >
                <Link
                  to={item.href}
                  className="group flex items-start gap-4 p-4 rounded-[1.5rem] border border-transparent hover:border-zinc-100 hover:bg-zinc-50/50 transition-all duration-200"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:shadow-md group-hover:shadow-blue-500/5", item.bgColor || "bg-zinc-50")}>
                    <Icon size={18} className={cn("transition-transform duration-300 group-hover:scale-110", item.color || "text-zinc-900")} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-zinc-900 mb-0.5 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      scrolled ? "bg-white/80 backdrop-blur-xl border-b border-zinc-100 py-2.5" : "bg-white border-b border-zinc-50 py-4"
    )}>
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 group">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="flex items-center"
            >
              <span className="font-serif text-2xl lg:text-[28px] font-bold text-zinc-900 tracking-tight">
                Reluno
              </span>
              <span className="font-serif text-2xl lg:text-[28px] font-bold text-blue-600 ml-0.5">
                AI
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => link.dropdown && handleMouseEnter(link.name)}
                onMouseLeave={handleMouseLeave}
              >
                {link.dropdown ? (
                  <button className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold text-zinc-500 hover:text-zinc-900 transition-all rounded-full relative z-10",
                    openDropdown === link.name ? "text-zinc-900" : ""
                  )}>
                    <span>{link.name}</span>
                    <ChevronDown
                      size={12}
                      className={cn("transition-transform duration-300 opacity-40", openDropdown === link.name ? "rotate-180 opacity-100" : "")}
                    />
                    {openDropdown === link.name && (
                      <motion.div 
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-zinc-50 rounded-full -z-10"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                  </button>
                ) : (
                  <Link
                    to={link.href || "/"}
                    className="px-4 py-2 text-[12px] font-bold text-zinc-500 hover:text-zinc-900 transition-all rounded-full hover:bg-zinc-50"
                  >
                    {link.name}
                  </Link>
                )}

                <AnimatePresence>
                  {link.dropdown && openDropdown === link.name && (
                    <MegaMenu 
                      title={link.category!} 
                      description={link.description!} 
                      items={link.name === "Platform" ? platformTools : 
                             link.name === "Practice Types" ? practiceTypes :
                             link.name === "Resources" ? resources : companyLinks} 
                      align={link.name === "Platform" ? "left" : 
                             link.name === "Company" || link.name === "Resources" ? "right" : "center"}
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoaded && user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-[12px] font-bold text-zinc-900 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="w-px h-5 bg-zinc-100 mx-1" />
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 ring-2 ring-zinc-50 hover:ring-blue-100 transition-all duration-300",
                    },
                  }}
                />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-[12px] font-bold text-zinc-500 hover:text-zinc-900 transition-colors">
                    Sign in
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -0.5 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-7 py-3 bg-zinc-900 text-white text-[12px] font-bold rounded-full hover:bg-black transition-all shadow-lg shadow-zinc-200/50 flex items-center gap-2 group"
                  >
                    Get started
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </SignInButton>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-zinc-900 p-2.5 hover:bg-zinc-100 rounded-2xl transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden py-6 border-t border-zinc-100 space-y-5 overflow-hidden bg-white"
            >
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.dropdown ? (
                    <>
                      <button
                        className="w-full flex items-center justify-between py-3.5 px-6 text-[15px] font-bold text-zinc-900 hover:bg-zinc-50 rounded-2xl transition-colors"
                        onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                      >
                        <span>{link.name}</span>
                        <ChevronDown
                          size={18}
                          className={cn("transition-transform duration-300", openDropdown === link.name ? "rotate-180" : "")}
                        />
                      </button>
                      <AnimatePresence>
                        {openDropdown === link.name && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-6 grid gap-3 mt-3 overflow-hidden"
                          >
                            {(link.name === "Platform" ? platformTools : 
                              link.name === "Practice Types" ? practiceTypes :
                              link.name === "Resources" ? resources : companyLinks).map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.name}
                                  to={item.href}
                                  className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 hover:bg-blue-50 transition-colors"
                                  onClick={() => setIsOpen(false)}
                                >
                                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", item.bgColor || "bg-white")}>
                                    <Icon size={16} className={item.color || "text-zinc-900"} />
                                  </div>
                                  <span className="text-[13px] font-bold text-zinc-900">{item.name}</span>
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={link.href || "/"}
                      className="block py-3.5 px-6 text-[15px] font-bold text-zinc-900 hover:bg-zinc-50 rounded-2xl transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile CTA */}
              <div className="pt-6 px-6 border-t border-zinc-100 space-y-3">
                {isLoaded && user ? (
                  <Link
                    to="/dashboard"
                    className="block w-full py-4 text-center text-[14px] font-bold text-zinc-900 bg-zinc-50 rounded-2xl"
                    onClick={() => setIsOpen(false)}
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <button className="w-full py-4 text-center text-[14px] font-bold text-zinc-900 bg-zinc-50 rounded-2xl">
                        Sign in
                      </button>
                    </SignInButton>
                    <SignInButton mode="modal">
                      <button className="w-full py-4 text-center text-[14px] font-bold text-white bg-zinc-900 rounded-2xl shadow-lg shadow-zinc-200">
                        Get started free
                      </button>
                    </SignInButton>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export { Navbar };
export default Navbar;
