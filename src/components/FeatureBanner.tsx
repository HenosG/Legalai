import { Star } from "lucide-react";

const features = [
  "AI Legal Question Helper",
  "Document & Template Generator",
  "Claim & Damage Tracker",
  "Expense & Settlement Tracker",
  "Scheduling",
];

const FeatureBanner = () => {
  return (
    <div className="w-full bg-muted/50 border-y border-border/50 py-3 overflow-hidden">
      <div className="flex animate-scroll-left">
        {/* Duplicate the content for seamless loop */}
        {[...features, ...features].map((feature, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 px-8 whitespace-nowrap"
          >
            <Star className="w-4 h-4 text-cyan fill-cyan" />
            <span className="text-sm text-muted-foreground">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureBanner;
