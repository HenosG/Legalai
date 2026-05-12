import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import DisclaimerBox from "@/components/DisclaimerBox";
import { MessageSquare, Users, Heart, TrendingUp, ArrowRight } from "lucide-react";

const forumCategories = [
  {
    icon: Heart,
    title: "Divorce Support Group",
    members: "2.4K members",
    posts: "156 new posts this week",
    description: "Connect with others going through divorce. Share experiences and emotional support."
  },
  {
    icon: TrendingUp,
    title: "Injury Claim Tips",
    members: "3.1K members",
    posts: "89 new posts this week",
    description: "Discuss personal injury claims, share success stories, and learn from others."
  },
  {
    icon: MessageSquare,
    title: "AI Legal Hacks",
    members: "5.2K members",
    posts: "234 new posts this week",
    description: "Tips and tricks for getting the most out of Reluno's AI tools."
  },
  {
    icon: Users,
    title: "Small Business Legal",
    members: "1.8K members",
    posts: "67 new posts this week",
    description: "Contract questions, business disputes, and legal tips for entrepreneurs."
  },
  {
    icon: Heart,
    title: "Tenant Rights Forum",
    members: "2.7K members",
    posts: "112 new posts this week",
    description: "Discuss landlord issues, security deposits, and rental disputes."
  }
];

const popularThreads = [
  {
    title: "How I used Reluno for a tenant dispute—saved $500!",
    author: "Maria T.",
    replies: 47,
    views: "1.2K"
  },
  {
    title: "Tips for tracking medical expenses after an accident",
    author: "James R.",
    replies: 32,
    views: "890"
  },
  {
    title: "Document Generator saved me hours on my divorce paperwork",
    author: "Sarah K.",
    replies: 28,
    views: "756"
  },
  {
    title: "Small claims court experience - what I learned",
    author: "Mike D.",
    replies: 54,
    views: "2.1K"
  }
];

const Community = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Community – Connect with Others on Legal Journeys
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our forum to share experiences, ask questions, and get peer support—moderated for privacy.
            </p>
            <div className="flex items-center justify-center gap-8 text-muted-foreground">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <strong className="text-foreground">10K+</strong> Members
              </span>
              <span className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <strong className="text-foreground">500+</strong> Posts Daily
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Forum Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Forum Categories
            </h2>
            <div className="space-y-4 mb-16">
              {forumCategories.map((category, index) => (
                <div key={index} className="p-4 border border-border rounded-xl hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-foreground">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground hidden md:block">
                      <p>{category.members}</p>
                      <p className="text-primary">{category.posts}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>

            {/* Popular Threads */}
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Popular Threads
            </h2>
            <div className="space-y-3 mb-16">
              {popularThreads.map((thread, index) => (
                <div key={index} className="p-4 border border-border rounded-xl hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground hover:text-primary transition-colors">
                        {thread.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">by {thread.author}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{thread.replies} replies</span>
                      <span>{thread.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <DisclaimerBox className="mb-8">
              Community is peer-to-peer support only; no professional legal advice. Always consult a licensed attorney for your specific situation.
            </DisclaimerBox>

            {/* CTA */}
            <div className="text-center">
              <Link to="/login">
                <Button variant="hero" size="lg">
                  Join the Community Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Community;
