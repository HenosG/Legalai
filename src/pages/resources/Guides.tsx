import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { Download, FileText, BookOpen, Scale } from "lucide-react";

const guides = [
  {
    icon: Scale,
    title: "Ultimate Guide to Personal Injury Claims",
    description: "50-page comprehensive PDF with AI tips on evidence collection, settlement negotiation strategies, and timeline management. Includes checklists, templates, and real case examples.",
    pages: "50 pages",
    format: "PDF"
  },
  {
    icon: BookOpen,
    title: "Family Law Essentials",
    description: "40-page guide covering divorce proceedings, child custody arrangements, alimony calculations, and property division. Features AI-generated checklists and step-by-step timelines.",
    pages: "40 pages",
    format: "PDF"
  },
  {
    icon: FileText,
    title: "Contract Basics for Beginners",
    description: "30-page resource on drafting, reviewing, and understanding contracts. Includes AI suggestions for common clauses, red flags to watch, and negotiation tips.",
    pages: "30 pages",
    format: "PDF"
  },
  {
    icon: Scale,
    title: "Small Claims Court Survival Guide",
    description: "35-page walkthrough of the small claims process from filing to judgment collection. Covers court procedures, evidence presentation, and common pitfalls.",
    pages: "35 pages",
    format: "PDF"
  },
  {
    icon: BookOpen,
    title: "Landlord-Tenant Rights Handbook",
    description: "45-page guide explaining rights and responsibilities for both landlords and tenants. Includes state-by-state variations and dispute resolution strategies.",
    pages: "45 pages",
    format: "PDF"
  }
];

const Guides = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Guides – Step-by-Step Legal Walkthroughs
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Free downloadable guides powered by AI insights for common legal scenarios.
            </p>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6">
              {guides.map((guide, index) => (
                <div key={index} className="p-6 border border-border rounded-xl hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <guide.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">
                        {guide.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {guide.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{guide.pages}</span>
                          <span>•</span>
                          <span>{guide.format}</span>
                        </div>
                        <Button variant="hero" size="sm">
                          <Download className="w-4 h-4 mr-2" /> Download Free
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-4">
                Want more personalized guidance? Try our AI-powered tools.
              </p>
              <Link to="/login">
                <Button variant="hero" size="lg">
                  Start Using Reluno Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Guides;
