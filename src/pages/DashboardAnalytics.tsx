import { useState, useEffect } from "react";


import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Zap, ShieldAlert, FileStack, TrendingUp, Activity } from "lucide-react";

export default function Analytics() {
  const [stats, setStats] = useState({ total: 0, avgRisk: 0, history: [] });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("reluno_vault") || "[]");
    const total = data.length;
    const avgRisk = total > 0 ? Math.round(data.reduce((acc: number, item: any) => acc + item.riskScore, 0) / total) : 0;
    const chartData = [...data].reverse().map((item: any) => ({
      date: item.date,
      score: item.riskScore,
    }));
    setStats({ total, avgRisk, history: chartData });
  }, []);

  return (
    
      <div className="flex min-h-screen w-full bg-[#FBFBFE]">
        
        
          <main className="p-12 max-w-6xl mx-auto space-y-10">
            <header>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900">Intelligence Analytics</h1>
              <p className="text-slate-400 font-bold text-xs tracking-[0.3em] uppercase mt-2">Platform Performance Metrics</p>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
              <StatCard label="Total Assets Forged" value={stats.total} icon={FileStack} color="text-indigo-600" />
              <StatCard label="Avg Platform Risk" value={`${stats.avgRisk}%`} icon={ShieldAlert} color="text-red-500" />
              <StatCard label="System Integrity" value="Active" icon={Zap} color="text-blue-600" />
            </div>

            <Card className="p-10 rounded-[3rem] border-none shadow-xl bg-white">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-slate-900">Forge Risk Timeline</h3>
                <Activity className="text-slate-200 size-8" />
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer>
                  <AreaChart data={stats.history}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ borderRadius: '15px', border: 'none' }} />
                    <Area type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={4} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </main>
        
      </div>
    
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="p-8 rounded-[2rem] border-none shadow-sm bg-white hover:shadow-md transition-shadow">
      <Icon className={`size-6 ${color} mb-4`} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
    </Card>
  );
}
