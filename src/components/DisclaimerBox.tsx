import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisclaimerBoxProps {
  children: React.ReactNode;
  className?: string;
}

const DisclaimerBox = ({ children, className }: DisclaimerBoxProps) => {
  return (
    <div className={cn("disclaimer-box mt-12", className)}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-foreground mb-2">Important Disclaimer</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerBox;
