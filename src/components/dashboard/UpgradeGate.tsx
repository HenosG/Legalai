import { useNavigate } from "react-router-dom";
import { Crown, Lock } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface UpgradeGateProps {
  children: React.ReactNode;
  requiredPlan?: string;
  featureName?: string;
}

const UpgradeGate = ({ children, requiredPlan = "easystart", featureName = "This feature" }: UpgradeGateProps) => {
  const { isPlan } = useSubscription();
  const navigate = useNavigate();
  const hasAccess = isPlan(requiredPlan);

  if (hasAccess) return <>{children}</>;

  const planLabels: Record<string, string> = {
    easystart: "EasyStart",
    essentials: "Essentials",
    advanced: "Advanced",
    expand: "Expand",
  };

  const planLabel = planLabels[requiredPlan] || "a paid plan";

  return (
    <div className="relative min-h-[60vh]">
      {/* Blurred content behind */}
      <div className="filter blur-md opacity-40 pointer-events-none select-none">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl border border-gray-100">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "linear-gradient(135deg, #8B00FF, #0066FF)" }}
          >
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-display text-xl font-bold text-gray-900 mb-3">
            Upgrade to Unlock
          </h3>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            {featureName} is available on <strong>{planLabel}</strong> and above. Upgrade now to unlock unlimited access, advanced tools, and more.
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="w-full py-3 px-6 rounded-xl text-white font-semibold text-sm transition-all hover:scale-[1.02] hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #8B00FF, #0066FF)",
              boxShadow: "0 4px 20px rgba(139,0,255,0.35)",
            }}
          >
            <Crown className="w-4 h-4 inline mr-2" />
            Upgrade to Pro
          </button>
          <p className="text-xs text-gray-400 mt-3">Cancel anytime · No hidden fees</p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeGate;
