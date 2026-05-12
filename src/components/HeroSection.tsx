import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-background pt-20 lg:pt-24 flex items-center">
      <div className="section-container py-12 lg:py-20">
        <div className="max-w-7xl mx-auto text-center space-y-8 animate-fade-up">
          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
            <span className="text-foreground">The </span>
            <span className="text-highlight">#1 AI Legal Helper</span>
            <br />
            <span className="text-foreground">Platform</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground max-w-3xl mx-auto">
            Automate & Launch Legal Tasks Across All Channels
          </p>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span>Trusted by 3.2M+ users worldwide</span>
            <span className="text-xl">🌐</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Replace costly lawyers with Reluno Legal AI. Get instant AI guidance on claims, 
            damages, divorce, disputes, and more — all in one dashboard.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <Button 
              variant="hero" 
              size="xl" 
              onClick={() => navigate("/signup")}
            >
              🚀 Try Reluno Legal AI Free
            </Button>
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <button onClick={() => navigate("/login")} className="text-primary hover:underline">
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
