import { useState, useEffect } from "react";
// ❌ REMOVED: SidebarProvider, SidebarInset, , AppSidebar
import { Card } from "@/components/ui/card";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, BarChart, Bar, CartesianGrid 
} from "recharts";
import { 
  Zap, ShieldAlert, FileStack, TrendingUp, 
  Activity, Target, Lightbulb, ArrowUpRight 
} from "lucide-react";

export default function Analytics() {
  const [stats, setStats] = useState({ 
    total: 0, 
    avgRisk: 0, 
    history: [],
    highRiskCount: 0 
  });

  useEffect(() => {
    // Pulling real data from your Vault
    const data = JSON.parse(localStorage.getItem("reluno_vault") || "[]");
    const total = data.length;
    const highRisk = data.filter((item: any) => item.riskScore > 75).length;
    const avgRisk = total > 0 ? Math.round(data.reduce((acc: number, item: any) => acc + item.riskScore, 0) / total) : 0;
    
    const chartData = [...data].reverse().map((item: any) => ({
      date: item.date,
      score: item.riskScore,
    }));

    setStats({ total, avgRisk, history: chartData, highRiskCount: highRisk });
  }, []);

  return (
    // ✅ Cleaned Container: No SidebarProvider, no SidebarInset
    <div className="flex flex-col min-h-screen bg-[#FBFBFE]">
      {/* Header - Simplified & Professional */}
      <header className="flex h-16 items-center border-b px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex flex-1 justify-between items-center">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Intelligence Command v1.0</h2>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600">
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">System Live</span>
          </div>
        </div>
      </header>

      {/* Main Content Scrollable Area */}
      <main className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
        {/* Your stats cards and charts will go here */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {/* Example Card using your stats state */}
           <Card className="p-6 border-none shadow-sm bg-white">
              <div className="flex items-center gap-3 text-blue-600 mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Cases</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
           </Card>
        </div>

        {/* ... Rest of your Analytics UI ... */}
      </main>
    </div>
  );
}

          <main className="p-12 max-w-7xl mx-auto space-y-10">
            {/* Title Section */}
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-none">Intelligence</h1>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.3em] mt-4">Platform Performance & Risk Metrics</p>
              </div>
              <div className="flex gap-4">
                <Card className="p-4 px-6 rounded-2xl border-none shadow-sm bg-white flex items-center gap-4">
                  <Target className="text-indigo-600 size-5" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Target Precision</p>
                    <p className="text-sm font-black text-slate-900">98.2%</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              <StatCard label="Total Assets" value={stats.total} icon={FileStack} color="indigo" />
              <StatCard label="Avg Risk Index" value={`${stats.avgRisk}%`} icon={ShieldAlert} color={stats.avgRisk > 70 ? "red" : "indigo"} />
              <StatCard label="Critical Alerts" value={stats.highRiskCount} icon={Activity} color={stats.highRiskCount > 0 ? "red" : "slate"} />
              <StatCard label="Forge Uptime" value="100%" icon={Zap} color="cyan" />
            </div>

            {/* Main Visualizations */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Primary Chart */}
              <Card className="lg:col-span-2 p-10 rounded-[3.5rem] border-none shadow-xl bg-white overflow-hidden relative">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Risk Variance Timeline</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Historical Asset Integrity</p>
                  </div>
                  <TrendingUp className="text-indigo-600 size-6" />
                </div>
                
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.history}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="date" hide />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} 
                        labelClassName="font-black text-slate-900"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#4F46E5" 
                        strokeWidth={4} 
                        fill="url(#colorScore)" 
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Insights Sidebar */}
              <div className="space-y-6">
                <Card className="p-8 rounded-[3rem] border-none bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                      <Lightbulb size={120} />
                   </div>
                   <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">AI Optimization</h4>
                   <h3 className="text-2xl font-bold leading-tight mb-4">Focus on evidence gathering to boost success.</h3>
                   <p className="text-slate-400 text-sm leading-relaxed mb-8">System detects 14% variance in document precision over the last 3 forge cycles.</p>
                   <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest cursor-pointer hover:gap-4 transition-all">
                      Review Metrics <ArrowUpRight size={14} />
                   </div>
                </Card>

                <Card className="p-8 rounded-[3rem] border-none bg-indigo-50 shadow-sm">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4">Platform Health</h4>
                   <div className="space-y-4">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Node Sync</span>
                        <span className="text-slate-900">Synchronized</span>
                      </div>
                      <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 w-[94%]" />
                      </div>
                   </div>
                </Card>
              </div>
            </div>
          </main>
        
      </div>
    
  );
}

// Reusable Stat Card Component
function StatCard({ label, value, icon: Icon, color }: any) {
  const colorMap: any = {
    indigo: "text-indigo-600 bg-indigo-50",
    red: "text-red-600 bg-red-50",
    cyan: "text-blue-700 bg-blue-50",
    slate: "text-slate-400 bg-slate-50"
  };

  return (
    <Card className="p-8 rounded-[2.5rem] border-none shadow-sm bg-white hover:shadow-xl transition-all group">
      <div className={`p-4 rounded-2xl w-fit mb-6 transition-colors ${colorMap[color] || colorMap.slate}`}>
        <Icon className="size-6" />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-4xl font-black text-slate-900 mt-1">{value}</p>
    </Card>
  );
}
