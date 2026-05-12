import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { Mail, MessageSquare, BookOpen, Users, ArrowRight, HelpCircle } from "lucide-react";

const supportChannels = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us an email and we'll respond within 1-5 business days.",
    action: "support@reluno.com",
    href: "mailto:support@reluno.com"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Get quick answers for AI/feature questions during business hours.",
    action: "Start Chat",
    href: "#chat"
  },
  {
    icon: BookOpen,
    title: "Help Center",
    description: "Search our comprehensive guides and template library.",
    action: "Browse Guides",
    href: "/guides"
  },
  {
    icon: Users,
    title: "Community",
    description: "Join peer discussions and learn from other users.",
    action: "Join Community",
    href: "/community"
  }
];

const faqs = [
  {
    question: "How do I use the Document Generator?",
    answer: "Navigate to the Document Generator from your dashboard, select a template type, enter your details, and let the AI generate a customized document. You can then edit and download it."
  },
  {
    question: "How do I track a claim?",
    answer: "Use the Claim Tracker feature to add expenses, evidence, and notes. The AI will calculate totals and suggest next steps automatically."
  },
  {
    question: "Is my data secure?",
    answer: "Yes! We use enterprise-grade encryption and are GDPR-compliant. Your data is stored securely and never shared with third parties."
  },
  {
    question: "Can I upgrade my plan?",
    answer: "Yes, you can upgrade anytime from your account settings. Changes take effect immediately and you'll be prorated for the remaining billing period."
  }
];

const Support = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Support – Get Help Fast for Your Legal Queries
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              24/5 chat, email, and resources to keep you moving forward.
            </p>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {supportChannels.map((channel, index) => (
                <div key={index} className="p-6 border border-border rounded-xl hover:border-primary/50 transition-colors">
                  <channel.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{channel.title}</h3>
                  <p className="text-muted-foreground mb-4">{channel.description}</p>
                  {channel.href.startsWith("mailto:") ? (
                    <a href={channel.href} className="text-primary hover:underline font-medium">
                      {channel.action}
                    </a>
                  ) : (
                    <Link to={channel.href} className="text-primary hover:underline font-medium">
                      {channel.action} <ArrowRight className="w-4 h-4 inline ml-1" />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Priority Support */}
            <div className="bg-muted/30 border border-border rounded-xl p-6 mb-16">
              <div className="flex items-center gap-4 mb-4">
                <HelpCircle className="w-8 h-8 text-primary" />
                <h3 className="font-display text-xl font-bold text-foreground">Priority Support</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Pro+ plan subscribers receive priority support with faster response times and dedicated assistance. Upgrade your plan to get priority access.
              </p>
              <Link to="/pricing">
                <Button variant="hero">
                  View Plans
                </Button>
              </Link>
            </div>

            {/* FAQs */}
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 mb-16">
              {faqs.map((faq, index) => (
                <div key={index} className="p-4 border border-border rounded-xl">
                  <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for?
              </p>
              <Link to="/contact">
                <Button variant="hero" size="lg">
                Contact Us <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Support;
