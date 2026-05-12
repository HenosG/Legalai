import { TrendingUp, Zap, Clock, DollarSign, Scale, FileText } from "lucide-react";

const stats = [
  {
    icon: DollarSign,
    value: "80%+",
    label: "Saved vs Traditional Lawyers",
    description: "Significant cost reduction on legal guidance",
  },
  {
    icon: Scale,
    value: "8+",
    label: "Legal Areas Automated",
    description: "From personal injury to contracts",
  },
  {
    icon: Zap,
    value: "5x",
    label: "Faster Query Resolution",
    description: "Get answers in minutes, not days",
  },
];

const whyChoose = [
  {
    icon: DollarSign,
    title: "80%+ Savings",
    description: "Compared to traditional legal fees",
  },
  {
    icon: Zap,
    title: "AI Zero Manual Work",
    description: "Automated document generation and tracking",
  },
  {
    icon: Clock,
    title: "5x Faster Guidance",
    description: "Instant AI-powered legal assistance",
  },
];

const StatsSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass-card p-8 text-center hover:glow-purple transition-all duration-300 group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6 group-hover:bg-accent/20 transition-colors">
                <stat.icon className="w-8 h-8 text-accent" />
              </div>
              <div className="font-display text-4xl lg:text-5xl font-bold text-gradient-cyan mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-foreground mb-2">
                {stat.label}
              </div>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Why Choose Section */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Why Choose <span className="text-gradient-cyan">Reluno Legal AI</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the future of legal assistance with AI-powered guidance that saves you time and money.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {whyChoose.map((item, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-6 rounded-xl bg-muted/30 border border-border/50 hover:border-accent/30 transition-all duration-300"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <div className="mt-20 text-center">
          <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-8">
            Traditional Lawyers vs <span className="text-gradient-cyan">Reluno</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="glass-card p-8 border-destructive/30">
              <div className="text-destructive text-sm font-medium mb-2">Traditional</div>
              <div className="font-display text-3xl font-bold text-foreground mb-2">$200+/hr</div>
              <p className="text-muted-foreground text-sm">Hours waiting, hidden fees, complex processes</p>
            </div>
            <div className="glass-card p-8 border-success/30 glow-purple">
              <div className="text-success text-sm font-medium mb-2">Reluno Legal AI</div>
              <div className="font-display text-3xl font-bold text-gradient-cyan mb-2">$49/mo</div>
              <p className="text-muted-foreground text-sm">$588/year • 99%+ savings • Instant access</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
