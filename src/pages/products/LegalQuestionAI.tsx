import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, Sparkles, MessageSquare, Shield, Download, Lock, 
  Scale, CheckCircle, AlertCircle, Database, Zap, FileText,
  FileCheck2, Paperclip, FileCheck, ChevronRight, Activity, Cpu
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

export default function LegalQuestionAI() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("System Ready");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic for the streaming effect
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [result]);

  const securitySteps = [
    { msg: "Establishing Secure Connection...", icon: Lock },
    { msg: "Scanning for Critical Liabilities...", icon: AlertCircle },
    { msg: "Analyzing Relevant Statutes...", icon: Scale },
    { msg: "Reviewing Case Law Precedents...", icon: Search },
    { msg: "Finalizing Intelligence Report...", icon: Cpu },
  ];

  const handleRunAnalysis = async (customQuery?: string) => {
    const finalQuery = customQuery || query;
    if (!finalQuery) return toast.error("Please enter a question first.");

    setLoading(true);
    setResult("");
    let stepIndex = 0;

    // The "Hacker" status rotation you liked
    const interval = setInterval(() => {
      setStatusMessage(securitySteps[stepIndex % securitySteps.length].msg);
      stepIndex++;
    }, 2000);

    try {
      // @ts-ignore - Clerk global auth
      const token = await window.Clerk.session.getToken(); 

      const response = await fetch('http://localhost:5000/api/legal-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: finalQuery }), 
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          setResult((prev) => prev + decoder.decode(value, { stream: true }));
        }
      }
    } catch (err) {
      toast.error("Analysis interrupted. Check backend connection.");
    } finally {
      clearInterval(interval);
      setLoading(false);
      setStatusMessage("Analysis Complete");
    }
  };

  // Logic to determine which "Score Meter" to show based on AI response
  const getVisualConfig = () => {
    if (result.includes("---RISK_DATA---")) {
      const score = parseInt(result.split("Risk Score:")[1]?.match(/\d+/)?.[0] || "0");
      return { label: "Risk Health", icon: AlertCircle, score, color: "text-red-500", bar: "bg-red-600", bg: "bg-red-50/50" };
    }
    if (result.includes("---SEARCH_DATA---")) {
      const score = parseInt(result.split("Confidence Score:")[1]?.match(/\d+/)?.[0] || "0");
      return { label: "Research Confidence", icon: Database, score, color: "text-cyan-500", bar: "bg-cyan-600", bg: "bg-cyan-50/50" };
    }
    if (result.includes("---DRAFT_DATA---")) {
      const score = parseInt(result.split("Draft Precision:")[1]?.match(/\d+/)?.[0] || "0");
      return { label: "Drafting Precision", icon: FileCheck, score, color: "text-emerald-500", bar: "bg-emerald-600", bg: "bg-emerald-50/50" };
    }
    return null;
  };

  const viz = getVisualConfig();

  const formatText = (text: string) => {
    const mainBody = text.split(/---.*?_DATA---/)[0];
    return mainBody.split('\n').map((line, i) => {
      if (line.startsWith('###')) return <h3 key={i} className="text-3xl font-black text-slate-900 mt-10 mb-4 tracking-tighter uppercase">{line.replace('###', '')}</h3>;
      if (line.startsWith('**')) return <p key={i} className="font-bold text-slate-800 my-4 text-xl tracking-tight">{line.replaceAll('**', '')}</p>;
      if (line.trim() === "") return <div key={i} className="h-6" />;
      return <p key={i} className="mb-4 text-slate-600 leading-relaxed font-medium text-lg">{line}</p>;
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const cleanText = result.split("---")[0];
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("RELUNO INTELLIGENCE REPORT", 20, 30);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 38);
    doc.setDrawColor(230, 230, 230);
    doc.line(20, 45, 190, 45);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(cleanText, 170);
    doc.text(splitText, 20, 60);
    doc.save("Reluno_Legal_Brief.pdf");
    toast.success("Intelligence brief exported.");
  };

  return (
    <div className="flex min-h-screen w-full bg-white text-slate-900 overflow-hidden">
      
      {/* THE MAIN CONTENT COLUMN */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* RELUNO NAV-HEADER */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Reluno System // Neural Intelligence Console
            </span>
          </div>
          <div className={`px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-3 ${loading ? 'bg-cyan-50 text-cyan-600 animate-pulse border border-cyan-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
            <Activity className={`size-3 ${loading ? 'animate-spin' : ''}`} />
            {statusMessage}
          </div>
        </header>

        {/* SCROLLABLE MAIN VIEW */}
        <main className="flex-1 overflow-y-auto p-8 md:p-12 relative">
          {/* Background Branding Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-cyan-100/20 blur-[140px] rounded-full -z-10" />

          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Title Block */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <h1 className="text-8xl font-black tracking-tighter text-slate-900 leading-[0.8] uppercase">
                  Intelligence
                </h1>
                <p className="text-xl text-slate-500 font-medium max-w-xl">
                  Deconstruct legal complexities with high-fidelity neural analysis and jurisdictional cross-referencing.
                </p>
              </div>
            </div>

            {/* THE CONSOLE INPUT */}
            <Card className="rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 bg-white p-4">
              <div className="flex flex-col space-y-6 p-4">
                <div className="flex gap-4 items-center">
                  <div className="flex-1 relative">
                    <Paperclip className="absolute left-6 top-1/2 -translate-y-1/2 size-6 text-slate-300" />
                    <Input 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRunAnalysis()}
                      placeholder="Input legal query or upload evidentiary context..." 
                      className="h-24 pl-16 rounded-[2.5rem] border-slate-100 bg-slate-50/50 text-2xl focus:bg-white transition-all shadow-inner border-none focus-visible:ring-2 focus-visible:ring-cyan-100"
                    />
                  </div>
                  <button 
                    onClick={() => handleRunAnalysis()} 
                    disabled={loading} 
                    className="h-24 px-12 bg-slate-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-cyan-600 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-4"
                  >
                    {loading ? <Zap className="animate-pulse size-6" /> : <Sparkles className="size-6" />}
                    {loading ? "Analyzing..." : "Run Neural Analysis"}
                  </button>
                </div>

                {/* Quick Action Chips */}
                <div className="flex flex-wrap gap-4 px-2">
                  {[
                    { l: "Contract Review", q: "Analyze this contract for liabilities: ", i: Shield, c: "text-red-500" },
                    { l: "Statute Search", q: "Find governing statutes for: ", i: Database, c: "text-cyan-500" },
                    { l: "Legal Draft", q: "Generate a professional draft for: ", i: FileText, c: "text-emerald-500" }
                  ].map(b => (
                    <button 
                      key={b.l} 
                      onClick={() => setQuery(b.q)} 
                      className="flex items-center gap-3 px-6 py-3 rounded-full border border-slate-100 bg-white hover:border-cyan-200 hover:shadow-md transition-all group"
                    >
                      <b.i className={`size-4 ${b.c} group-hover:scale-110 transition-transform`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{b.l}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* THE OUTPUT TERMINAL */}
            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
              
              {/* Dynamic Score Header */}
              {viz && (
                <div className={`p-10 border-b border-slate-50 ${viz.bg} flex items-center justify-between animate-in slide-in-from-top-8 duration-1000`}>
                  <div className="flex items-center gap-8">
                    <div className={`p-6 rounded-[2rem] bg-white shadow-xl ${viz.color}`}>
                      <viz.icon className="size-12" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Neural Telemetry</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tighter">{viz.label} Vector</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-6">
                      <div className="w-64 h-3 bg-white rounded-full overflow-hidden border border-slate-100 p-0.5 shadow-inner">
                        <div className={`h-full rounded-full transition-all duration-1000 ${viz.bar}`} style={{ width: `${viz.score}%` }} />
                      </div>
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">{viz.score}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Streaming Content Body */}
              <div ref={scrollRef} className="p-16 md:p-24 flex-1 overflow-y-auto">
                {result ? (
                  <div className="animate-in fade-in duration-1000 max-w-4xl mx-auto">
                    {formatText(result)}
                  </div>
                ) : (
                  <div className="h-full py-40 flex flex-col items-center justify-center opacity-10 text-center">
                    <Cpu className="size-32 mb-10" />
                    <p className="font-black text-xl uppercase tracking-[1em]">Core Offline // Awaiting Instruction</p>
                  </div>
                )}
                {loading && <div className="mt-8 h-12 w-1.5 bg-cyan-500 animate-bounce rounded-full mx-auto" />}
              </div>

              {/* Action Footer */}
              {result && !loading && (
                <div className="p-12 border-t border-slate-50 bg-slate-50/50 flex justify-between items-center px-24">
                  <div className="flex items-center gap-4 text-emerald-600">
                    <div className="p-2 bg-emerald-50 rounded-full"><CheckCircle className="size-6" /></div>
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Neural Synthesis Verified</span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={exportToPDF}
                      className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl hover:bg-black transition-all active:scale-95"
                    >
                      <Download className="size-5" /> Export Intelligence Brief
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}