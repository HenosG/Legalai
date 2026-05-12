import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 lg:py-32 bg-muted/20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent">Start Your Journey Today</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            The future of legal help isn't expensive—it's{" "}
            <span className="text-gradient-cyan">smarter</span>.
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join millions who are already saving time and money with AI-powered legal guidance. 
            Get started for free today.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login">
              <Button variant="hero" size="xl" className="group">
                Start Free Plan
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="xl">
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="mt-12 text-xs text-muted-foreground max-w-xl mx-auto">
            Disclaimer: Reluno Legal AI provides general legal information and guidance. 
            This is not legal advice. For specific legal matters, please consult with a qualified attorney.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
