import { 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  FolderOpen, 
  Bell, 
  BarChart3,
  Mail,
  Calendar,
  Files,
  ClipboardList
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Legal Question AI",
    description: "Get instant answers to your legal questions with AI-powered guidance on any topic.",
  },
  {
    icon: FileText,
    title: "Template Creation",
    description: "Generate professional legal documents, demand letters, and contracts in seconds.",
  },
  {
    icon: TrendingUp,
    title: "Claim Tracking",
    description: "Monitor your claims progress, estimated values, and key milestones in one place.",
  },
  {
    icon: FolderOpen,
    title: "Document Management",
    description: "Securely store, organize, and access all your legal documents anytime.",
  },
  {
    icon: Bell,
    title: "Reminders & Workflows",
    description: "Never miss a deadline with automated reminders and task workflows.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Visualize your legal matters with comprehensive analytics and insights.",
  },
];

const integrations = [
  { icon: Mail, label: "Email" },
  { icon: Calendar, label: "Calendars" },
  { icon: Files, label: "Documents" },
  { icon: ClipboardList, label: "Forms" },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
            What You Get with <span className="text-gradient-cyan">Reluno</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to handle legal matters confidently, all in one powerful platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-6 hover:glow-purple transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-cyan" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* One Dashboard Section */}
        <div className="glass-card p-8 lg:p-12 text-center max-w-7xl mx-auto">
          <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
            One Dashboard for <span className="text-gradient-cyan">Everything</span>
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Manage all your legal matters from a single, intuitive interface. Connect your email, calendars, documents, and forms.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50"
              >
                <integration.icon className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">{integration.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
