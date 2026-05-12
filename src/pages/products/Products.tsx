import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Workflow, 
  BarChart3,
  ArrowRight 
} from "lucide-react";

const products = [
  {
    icon: MessageSquare,
    title: "Legal Question AI",
    description: "Our flagship feature lets you ask any legal question and get instant, AI-generated responses based on general knowledge. Whether it's 'How do I handle a landlord dispute?' or 'What steps for a personal injury claim?', get clear, step-by-step guidance in seconds.",
    features: ["Natural language input", "Contextual answers", "History tracking"],
    href: "/products/legal-question-ai",
    cta: "Ask Your First Question",
  },
  {
    icon: FileText,
    title: "Document Generator",
    description: "Create professional legal templates with AI. Input your details, and Reluno generates customizable documents like demand letters, basic contracts, or claim forms. Customize with your info, download as PDF/Word.",
    features: ["Built-in placeholders", "Version history", "Secure sharing"],
    href: "/products/document-generator",
    cta: "Generate Documents",
  },
  {
    icon: TrendingUp,
    title: "Claim Tracker",
    description: "Track damages, expenses, and progress for claims like accidents or injuries. Add entries for medical bills, lost wages, or property damage; AI calculates totals and suggests next steps.",
    features: ["Timeline view", "Reminder alerts", "Export reports"],
    href: "/products/claim-tracker",
    cta: "Start Tracking",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Automate your legal processes with AI-driven flows. Set up reminders for deadlines, auto-send emails for follow-ups, or chain tasks like 'query → document → reminder'.",
    features: ["Drag-and-drop builder", "AI-optimized sequences", "Conditional logic"],
    href: "/products/workflow-automation",
    cta: "Automate Now",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Get insights into your legal matters with AI-powered reports. Track progress, estimate outcomes, and see trends. Real-time dashboards with charts and predictive metrics.",
    features: ["Customizable dashboards", "Pie/bar charts", "Exportable PDFs"],
    href: "/products/analytics",
    cta: "View Analytics",
  },
];

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-7xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-glow">
              Our Core Products: AI Tools to{" "}
              <span className="text-gradient-cyan">Simplify Your Legal Challenges</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Reluno Legal AI offers a suite of intuitive tools powered by advanced AI to handle 
              everyday legal tasks—from questions to claims. All features include built-in disclaimers: 
              This is informational only; consult a professional for advice.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-16">
            {products.map((product, index) => (
              <div 
                key={product.title}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center`}
              >
                <div className="flex-1">
                  <div className="glass-card p-8 lg:p-12 card-glow">
                    <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
                      <product.icon className="w-8 h-8 text-accent" />
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 text-foreground">
                      {product.title}
                    </h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.features.map((feature) => (
                        <span 
                          key={feature}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <Link to={product.href}>
                      <Button variant="hero" className="group">
                        {product.cta}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex-1 hidden lg:block">
                  <div className="aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                    <product.icon className="w-32 h-32 text-accent/50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="glass-card p-12 text-center card-glow">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Ready to Try?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start using our AI-powered legal tools today. No credit card required.
            </p>
            <Link to="/login">
              <Button variant="hero" size="lg">
                🚀 Start Free Today
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
