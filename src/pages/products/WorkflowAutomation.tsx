import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Workflow, Mail, Calendar, Zap, GitBranch, BarChart } from "lucide-react";

const WorkflowAutomation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
                <Workflow className="w-4 h-4" />
                <span className="text-sm font-medium">Process Automation</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-glow">
                Workflow Automation:{" "}
                <span className="text-gradient-cyan">Streamline Legal Tasks</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Automate reminders, emails, and steps for claims or disputes—let AI handle 
                the routine so you focus on results.
              </p>
              <Link to="/login">
                <Button variant="hero" size="lg">
                  Automate Your First Workflow Free
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="glass-card p-8 card-glow">
                <h3 className="font-semibold text-foreground mb-6">Sample Workflow</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-accent">1</span>
                    </div>
                    <div className="flex-1 p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm">Query submitted</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-accent">2</span>
                    </div>
                    <div className="flex-1 p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm">Auto-generate document</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-accent">3</span>
                    </div>
                    <div className="flex-1 p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm">Send reminder in 7 days</span>
                    </div>
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
              Smart Flows for Your Legal Needs
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Reluno's Workflow Automation sets up smart flows for your legal needs. Create rules 
                like "Send reminder 7 days before deadline" or "Auto-generate follow-up email after query."
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Integrates with email/calendar for seamless operation. Features include drag-and-drop 
                builder, AI-optimized sequences, conditional logic (e.g., if claim value greater than $10k, flag for 
                review), and performance tracking.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Perfect for ongoing cases like divorce or landlord issues. Users report 80% reduction 
                in manual follow-ups. Example: For family law, automate document submission reminders 
                and status updates.
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
              { icon: Zap, title: "Drag-and-Drop Builder", description: "Create workflows visually with ease" },
              { icon: GitBranch, title: "Conditional Logic", description: "Set up if-then rules for smart automation" },
              { icon: Mail, title: "Email Integration", description: "Auto-send emails and notifications" },
              { icon: BarChart, title: "Performance Tracking", description: "Monitor workflow effectiveness" },
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

        {/* Integration Icons */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-display text-3xl font-bold mb-12 text-center text-foreground">
            Seamless Integrations
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: Mail, name: "Email" },
              { icon: Calendar, name: "Calendar" },
              { icon: Workflow, name: "Task Manager" },
            ].map((integration) => (
              <div key={integration.name} className="glass-card p-6 text-center min-w-[120px]">
                <integration.icon className="w-8 h-8 text-accent mx-auto mb-2" />
                <span className="text-sm text-muted-foreground">{integration.name}</span>
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
                <h3 className="text-xl font-semibold text-foreground mb-3">Reduce Errors</h3>
                <p className="text-muted-foreground">
                  Automated workflows eliminate human mistakes in repetitive tasks.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Save Time</h3>
                <p className="text-muted-foreground">
                  80% reduction in manual follow-ups and administrative work.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Stay on Track</h3>
                <p className="text-muted-foreground">
                  Never miss deadlines with automated reminders and alerts.
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
              { step: "1", title: "Choose Type", description: "Select a workflow template or start fresh" },
              { step: "2", title: "Set Triggers", description: "Define when the workflow activates" },
              { step: "3", title: "AI Refines", description: "AI optimizes your workflow logic" },
              { step: "4", title: "Run & Monitor", description: "Activate and track performance" },
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
              <strong>Important:</strong> Automations are tools for organization; they do not provide 
              legal counsel. Verify all steps with a professional.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Link to="/login">
              <Button variant="hero" size="lg">
                Automate Your First Workflow Free
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Limited automations free; Essentials unlocks unlimited and integrations.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WorkflowAutomation;
