import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChevronDown, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  const navLinks = [
    {
      name: "Platform",
      dropdown: [
        { name: "Legal Question AI", href: "/legalquestionai" },
        { name: "Document Generator", href: "/documentgenerator" },
        { name: "Claim Tracker", href: "/claimtracker" },
        { name: "Workflow Automation", href: "/workflowautomation" },
        { name: "Analytics", href: "/analytics" },
      ],
    },
    {
      name: "Practice Types",
      dropdown: [
        { name: "Personal Injury", href: "/personalinjury" },
        { name: "Family Law", href: "/familylaw" },
        { name: "Contracts", href: "/contracts" },
        { name: "Landlord-Tenant", href: "/landlordtenant" },
        { name: "Small Claims", href: "/smallclaims" },
      ],
    },
    { name: "Pricing", href: "/pricing" },
    {
      name: "Resources",
      dropdown: [
        { name: "Blog", href: "/blog" },
        { name: "Guides", href: "/guides" },
        { name: "Templates", href: "/templates" },
        { name: "Webinars", href: "/webinars" },
        { name: "Community", href: "/community" },
      ],
    },
    {
      name: "Company",
      dropdown: [
        { name: "About Us", href: "/aboutus" },
        { name: "Contact", href: "/contact" },
        { name: "Careers", href: "/careers" },
        { name: "Support", href: "/support" },
        { name: "Affiliates", href: "/affiliates" },
      ],
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="section-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-display text-xl lg:text-2xl font-bold text-primary">
              RelunoAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                className="relative group"
                onMouseEnter={() => link.dropdown && setOpenDropdown(link.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {link.dropdown ? (
                  <button className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors py-2">
                    <span>{link.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    to={link.href || "/"}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                )}
                {link.dropdown && openDropdown === link.name && (
                  <div className="absolute top-full left-0 mt-0 w-56 py-2 bg-background border border-border rounded-lg shadow-lg">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" className="text-foreground">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" className="text-foreground" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-foreground">
                    Login
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="ghost" className="text-foreground">
                    Contact Sales
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="hero">
                    Start for Free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.dropdown ? (
                    <div>
                      <button 
                        className="w-full flex items-center justify-between py-2 text-foreground"
                        onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                      >
                        <span>{link.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === link.name ? 'rotate-180' : ''}`} />
                      </button>
                      {openDropdown === link.name && (
                        <div className="pl-4 space-y-1">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="block py-2 text-sm text-muted-foreground hover:text-primary"
                              onClick={() => setIsOpen(false)}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link.href || "/"}
                      className="block py-2 text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => { handleSignOut(); setIsOpen(false); }}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Login
                      </Button>
                    </Link>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="hero" className="w-full">
                        Start for Free
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
