import { useSubscription as useSubscriptionContext } from "@/contexts/SubscriptionContext";

/**
 * Unified hook for accessing subscription state.
 * Points to the master SubscriptionContext to ensure a single source of truth.
 */
export const useSubscription = () => {
  const context = useSubscriptionContext();
  
  // Mapping 'can' to 'canAccessFeature' for backward compatibility during migration
  return {
    ...context,
    canAccessFeature: context.can
  };
};
