import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, Bell, FileDown, Lightbulb, DollarSign } from "lucide-react";

const ClaimTracker = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Claim Management</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-glow">
                Claim Tracker:{" "}
                <span className="text-gradient-cyan">Monitor Damages & Progress</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Track claims for accidents, injuries, or disputes with AI insights—maximize 
                your recovery without the stress.
              </p>
              <Link to="/login">
                <Button variant="hero" size="lg">
                  Start Tracking Your Claim Free
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="glass-card p-8 card-glow">
                <h3 className="font-semibold text-foreground mb-4">Car Accident Claim</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Medical Bills</span>
                    <span className="font-semibold text-foreground">$8,500</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Lost Wages</span>
                    <span className="font-semibold text-foreground">$3,200</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Property Damage</span>
                    <span className="font-semibold text-foreground">$4,800</span>
                  </div>
                  <div className="border-t border-border/50 pt-4 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Total Estimated</span>
                    <span className="text-xl font-bold text-accent">$16,500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Description */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-3xl font-bold mb-8 text-foreground">
              Organize Your Claims Effortlessly
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Reluno's Claim Tracker is a powerful tool to organize your legal claims. Add expenses 
                (e.g., medical bills, repair costs), track timelines, and get AI-calculated totals 
                with growth estimates.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Features include custom categories (damages, witnesses, evidence), reminder alerts 
                for deadlines, exportable reports for insurers/courts, and AI suggestions like 
                "Add photo evidence for stronger claim."
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Supports practice areas like personal injury or small claims. Users save hours on 
                organization—5x faster than spreadsheets. Example: For a car accident, log bills, 
                estimate lost wages, and see projected settlement value.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-display text-3xl font-bold mb-12 text-center text-foreground">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Calendar, title: "Timeline View", description: "Visualize your claim progress over time" },
              { icon: Bell, title: "Reminder Alerts", description: "Never miss important deadlines" },
              { icon: FileDown, title: "Export Reports", description: "Generate reports for insurers or courts" },
              { icon: Lightbulb, title: "AI Suggestions", description: "Get tips to strengthen your claim" },
            ].map((feature) => (
              <div key={feature.title} className="glass-card p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-display text-3xl font-bold mb-12 text-center text-foreground">
            Track Everything That Matters
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              { icon: DollarSign, title: "Medical Expenses", color: "text-green-400" },
              { icon: DollarSign, title: "Lost Wages", color: "text-blue-400" },
              { icon: DollarSign, title: "Property Damage", color: "text-orange-400" },
              { icon: DollarSign, title: "Other Costs", color: "text-purple-400" },
            ].map((category) => (
              <div key={category.title} className="glass-card p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <category.icon className={`w-6 h-6 ${category.color}`} />
                </div>
                <h3 className="font-semibold text-foreground">{category.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="glass-card p-8 lg:p-12 card-glow">
            <h2 className="font-display text-3xl font-bold mb-8 text-foreground">Benefits</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Stay Organized</h3>
                <p className="text-muted-foreground">
                  All your claim information in one centralized dashboard.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Spot Gaps Early</h3>
                <p className="text-muted-foreground">
                  AI identifies missing documentation before it becomes a problem.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Increase Success</h3>
                <p className="text-muted-foreground">
                  Data-backed insights help maximize your claim value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-display text-3xl font-bold mb-12 text-center text-foreground">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              { step: "1", title: "Create Claim", description: "Start a new claim with basic details" },
              { step: "2", title: "Add Expenses", description: "Log all related costs and evidence" },
              { step: "3", title: "AI Analyzes", description: "Get totals and improvement suggestions" },
              { step: "4", title: "Track Progress", description: "Monitor status in your dashboard" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-background">{item.step}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-muted/30 border border-border/50 rounded-xl p-6 max-w-7xl mx-auto">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Important:</strong> Tracking is for personal use only. Estimates are approximate; 
              consult a lawyer for accurate valuations.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Link to="/login">
              <Button variant="hero" size="lg">
                Start Tracking Your Claim Free
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Basic tracking free; Advanced unlocks AI predictions and unlimited claims.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ClaimTracker;
