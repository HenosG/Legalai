"use client";

import { useQuery } from "@tanstack/react-query";

export interface DashboardMetrics {
  activeClients: number;
  openProposals: number;
  activeProjects: number;
  pendingInvoices: number;
  recentActivity: Array<{
    id: string;
    action: string;
    description: string;
    createdAt: string;
  }>;
}

export function useDashboardMetrics() {
  return useQuery<DashboardMetrics>({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/metrics");
      if (!res.ok) {
        throw new Error("Failed to fetch dashboard metrics");
      }
      return res.json();
    },
    refetchInterval: 30000, // Automatically refreshes every 30 seconds in the background
  });
}