import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Gavel, ChevronRight, FileText, Calendar, Plus } from "lucide-react";

export default function CaseVault() {
  const [vaultItems, setVaultItems] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("reluno_vault") || "[]");
    setVaultItems(data);
  }, []);

  return (
    // 1. TOP LEVEL: Full screen, white background, flex layout
    <div className="flex min-h-screen w-full bg-white text-slate-900 overflow-hidden">
      
      {/* 2. CONTENT AREA: This flexes to fill space next to your sidebar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* 3. STICKY HEADER: Exact Dashboard height and blur */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Reluno System // Intelligence Vault
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200" />
          </div>
        </header>

        {/* 4. MAIN SCROLL AREA: The 7xl centering happens here */}
        <main className="flex-1 p-8 md:p-12 relative">
          {/* Dashboard Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-100/20 blur-[120px] rounded-full -z-10" />

          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Page Title Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <h1 className="text-8xl font-black tracking-tighter text-slate-900 leading-[0.8]">
                  VAULT
                </h1>
                <p className="text-xl text-slate-500 font-medium max-w-md">
                  Secure repository for deconstructed legal assets and neural risk reports.
                </p>
              </div>
              
              <button className="h-16 px-8 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-transform shadow-2xl">
                <Plus className="w-4 h-4" /> New Case Deposit
              </button>
            </div>

            {/* List Section */}
            <div className="grid grid-cols-1 gap-4">
              {vaultItems.length === 0 ? (
                <div className="p-32 border-2 border-dashed border-slate-100 rounded-[3rem] text-center bg-slate-50/20">
                  <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-sm">
                    Vault Empty // System Idle
                  </p>
                </div>
              ) : (
                vaultItems.map((item: any) => (
                  <Card key={item.id} className="group p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer bg-white flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <div className="bg-slate-50 p-6 rounded-2xl group-hover:bg-cyan-50 transition-colors">
                        <Gavel className="size-8 text-slate-400 group-hover:text-cyan-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{item.title}</h3>
                        <div className="flex gap-6 items-center">
                          <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <FileText className="size-3" /> {item.type}
                          </span>
                          <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Calendar className="size-3" /> {item.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-12">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Risk Factor</p>
                        <p className={`text-4xl font-black tracking-tighter ${item.riskScore > 70 ? 'text-red-500' : 'text-cyan-500'}`}>
                          {item.riskScore}%
                        </p>
                      </div>
                      <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <ChevronRight className="size-6" />
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}