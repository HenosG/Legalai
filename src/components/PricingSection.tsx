import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Get started with basic legal guidance",
    features: [
      "5 AI queries per month",
      "Basic document templates",
      "Community support",
      "Mobile access",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "EasyStart",
    price: "$39",
    period: "/month",
    description: "Perfect for individuals with simple legal needs",
    features: [
      "Unlimited AI queries",
      "Basic automation workflows",
      "Email support",
      "Document storage (5GB)",
      "Claim tracking",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Essentials",
    price: "$59",
    period: "/month",
    description: "Complete toolkit for managing legal matters",
    features: [
      "Everything in EasyStart",
      "Advanced document templates",
      "Calendar integrations",
      "Priority support",
      "Document storage (25GB)",
      "Custom workflows",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Advanced",
    price: "$99",
    period: "/month",
    description: "For power users and small businesses",
    features: [
      "Everything in Essentials",
      "AI document analyzer",
      "Unlimited storage",
      "API access",
      "Analytics dashboard",
      "Phone support",
    ],
    cta: "Get Started",
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent <span className="text-gradient-cyan">Pricing</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`glass-card p-6 relative ${
                plan.popular ? "border-accent/50 glow-purple" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline">
                  <span className="font-display text-4xl font-bold text-gradient-cyan">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/login">
                <Button
                  variant={plan.popular ? "hero" : "outline"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Need a custom solution for your enterprise?
          </p>
          <Link to="/contact">
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
