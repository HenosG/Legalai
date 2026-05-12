import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface DashboardStats {
  totalQueries: number;
  activeCases: number;
  pendingCases: number;
  estimatedSavings: number;
}

export interface CaseItem {
  id: string;
  title: string;
  case_type: string;
  status: string;
  priority: string;
  progress: number;
  estimated_value: number | null;
  start_date: string | null;
  estimated_end_date: string | null;
  created_at: string;
  description: string | null;
}

export interface ReminderItem {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  is_completed: boolean;
  case_id: string | null;
}

export interface QueryHistoryItem {
  id: string;
  query_text: string;
  query_type: string | null;
  created_at: string;
}

export interface MonthlyQueryData {
  month: string;
  queries: number;
}

export function useDashboardData() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ totalQueries: 0, activeCases: 0, pendingCases: 0, estimatedSavings: 0 });
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [monthlyQueries, setMonthlyQueries] = useState<MonthlyQueryData[]>([]);
  const [caseResolution, setCaseResolution] = useState<{ resolved: number; inProgress: number; pending: number }>({ resolved: 0, inProgress: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await Promise.all([fetchCases(), fetchStats(), fetchReminders(), fetchMonthlyQueries()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    const raw = localStorage.getItem("reluno-cases");
    const data = raw ? (JSON.parse(raw) as CaseItem[]) : [];
    if (data) {
      setCases(data as CaseItem[]);
      const resolved = data.filter((c) => c.status === "resolved" || c.status === "closed").length;
      const inProg = data.filter((c) => c.status === "in_progress" || c.status === "active").length;
      const pending = data.filter((c) => c.status === "open" || c.status === "pending").length;
      setCaseResolution({ resolved, inProgress: inProg, pending });
    }
  };

  const fetchStats = async () => {
    const totalQueries = 0;
    const allCases = cases || [];
    const activeCases = allCases.filter((c) => c.status === "active" || c.status === "in_progress").length;
    const pendingCases = allCases.filter((c) => c.status === "open" || c.status === "pending").length;
    const estimatedSavings = allCases.reduce((sum, c) => sum + (Number(c.estimated_value) || 0), 0);
    setStats({ totalQueries, activeCases, pendingCases, estimatedSavings });
  };

  const fetchReminders = async () => setReminders([]);

  const fetchMonthlyQueries = async () => {
    const months: Record<string, number> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      months[monthNames[d.getMonth()]] = 0;
    }

    setMonthlyQueries(Object.entries(months).map(([month, queries]) => ({ month, queries })));
  };

  return { stats, cases, reminders, monthlyQueries, caseResolution, loading, refetch: fetchAll };
}
