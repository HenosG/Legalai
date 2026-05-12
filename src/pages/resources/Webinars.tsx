import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { Play, Calendar, Clock, Users, AlertCircle } from "lucide-react";

const pastWebinars = [
  {
    title: "AI for Personal Injury: Track & Win Claims",
    description: "Live demo of our Claim Tracker and AI Question Helper. Learn how to maximize your injury claim value with AI-powered insights.",
    date: "January 15, 2026",
    time: "2:00 PM EST",
    duration: "1 hour",
    attendees: "250+ attended",
  },
  {
    title: "Divorce Made Simple with AI",
    description: "Walkthrough of Document Generator templates for divorce, parenting plans, and property division. Q&A with legal experts.",
    date: "January 22, 2026",
    time: "1:00 PM EST",
    duration: "45 min",
    attendees: "180+ attended",
  },
  {
    title: "Small Business Contracts: AI Protection",
    description: "Learn how to draft, review, and track contracts using AI. Perfect for freelancers and small business owners.",
    date: "January 29, 2026",
    time: "3:00 PM EST",
    duration: "50 min",
    attendees: "120+ attended",
  },
];

const recordedWebinars = [
  {
    title: "Getting Started with Reluno Legal AI",
    description: "Complete platform walkthrough for new users. Covers all features and best practices.",
    duration: "30 min",
    views: "5.2K views",
  },
  {
    title: "Landlord-Tenant Disputes: AI Solutions",
    description: "Real case studies showing how Reluno helped resolve rental disputes quickly and affordably.",
    duration: "45 min",
    views: "3.8K views",
  },
  {
    title: "Small Claims Court Prep with AI",
    description: "Step-by-step guide to preparing your small claims case using Reluno's AI tools.",
    duration: "40 min",
    views: "4.1K views",
  },
];

const Webinars = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Webinars – Live AI Legal Sessions
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join free webinars on legal topics with AI demos—recorded for on-demand viewing.
            </p>
          </div>
        </div>
      </section>

      {/* New webinars coming soon banner */}
      <section className="pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display text-lg font-bold text-foreground mb-1">New Webinars Coming Soon!</h3>
                <p className="text-muted-foreground">
                  All current sessions are sold out. We're planning exciting new webinars — subscribe below to be the first to know when new dates are announced!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Webinars (Sold Out) */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Past Sessions (Sold Out)
            </h2>
            <div className="space-y-6 mb-16">
              {pastWebinars.map((webinar, index) => (
                <div key={index} className="p-6 border border-border rounded-xl opacity-75">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">
                        {webinar.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{webinar.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {webinar.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {webinar.time} • {webinar.duration}</span>
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {webinar.attendees}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-destructive/10 text-destructive whitespace-nowrap">
                      Sold Out
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recorded Webinars */}
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">Watch On-Demand</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {recordedWebinars.map((webinar, index) => (
                <div key={index} className="p-4 border border-border rounded-xl hover:border-primary/50 transition-colors">
                  <div className="aspect-video bg-muted/50 rounded-lg mb-4 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                      <Play className="w-5 h-5 text-primary-foreground ml-1" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-2">{webinar.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{webinar.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{webinar.duration}</span>
                    <span>{webinar.views}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Registration Form */}
            <div className="p-8 bg-muted/30 border border-border rounded-xl text-center">
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Get Notified About New Webinars</h3>
              <p className="text-muted-foreground mb-6">Subscribe to receive invitations for upcoming live sessions.</p>
              <div className="flex gap-4 max-w-md mx-auto">
                <Input type="email" placeholder="Enter your email" className="flex-1" />
                <Button variant="hero">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Webinars;
