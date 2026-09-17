import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { Lock, Zap, ArrowRight } from 'lucide-react';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  requiredFeature: string;
  fallbackRoute?: string;
  showLockedUI?: boolean;
}

export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({
  children,
  requiredFeature,
  fallbackRoute = '/dashboard',
  showLockedUI = true,
}) => {
  const { canAccessFeature, isLoading, plan } = useSubscription();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const hasAccess = canAccessFeature(requiredFeature);

  if (!hasAccess) {
    if (showLockedUI) {
      return <LockedFeatureUI feature={requiredFeature} currentPlan={plan} />;
    }
    return <Navigate to={fallbackRoute} replace />;
  }

  return <>{children}</>;
};

interface LockedFeatureUIProps {
  feature: string;
  currentPlan: string;
}

const LockedFeatureUI: React.FC<LockedFeatureUIProps> = ({ feature, currentPlan }) => {
  const featureNames: Record<string, string> = {
    'document-generator': 'Document Generator',
    'pdf-analysis': 'PDF Analysis',
    'export': 'Export Documents',
    'upcoming-reminders': 'Upcoming Reminders',
    'calendar-sync': 'Calendar Sync',
    'integrations': 'Integrations',
    'my-cases-full': 'Full Case Management',
  };

  const featureName = featureNames[feature] || feature;

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-12 text-center">
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Lock size={32} className="text-blue-600" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            {featureName} is Locked
          </h2>

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            You're currently on the <span className="font-semibold capitalize">{currentPlan}</span> plan. Upgrade to Pro to unlock this powerful feature and boost your productivity.
          </p>

          {/* Features List */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Pro Plan Includes:</p>
            <ul className="space-y-2">
              {[
                'Advanced Document Generator',
                'AI-Powered PDF Analysis',
                'Export & Sharing',
                'Priority Support',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-700">
                  <Zap size={14} className="text-blue-600 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <a
              href="/upgrade"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Upgrade to Pro
              <ArrowRight size={16} />
            </a>
            <a
              href="/dashboard"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
            >
              Back to Dashboard
            </a>
          </div>

          {/* Footer */}
          <p className="text-xs text-slate-500 mt-6">
            Questions? <a href="/support" className="text-blue-600 hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
};
