"use client";

import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      person_profiles: "identified",
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") {
          // Optional: disable in local dev if you don't want test noise
          // posthog.opt_out_capturing();
        }
      },
    });
  }
}

export { posthog };