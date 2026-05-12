import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, Zap, FilePlus2, Sparkles, Download, 
  CheckCircle, FileCheck, AlertTriangle, X 
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

export default function DocumentGenerator() {
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Forge Idle");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [draft]);

  const saveToVault = (title: string, score: number, finalDraft: string) => {
    const existingVault = JSON.parse(localStorage.getItem("reluno_vault") || "[]");
    const newEntry = {
      id: Date.now(),
      title: title,
      type: title.includes("Review") ? "ANALYSIS" : "CONTRACT",
      date: new Date().toISOString().split('T')[0],
      riskScore: score,
      content: finalDraft 
    };
    localStorage.setItem("reluno_vault", JSON.stringify([newEntry, ...existingVault]));
  };

  const generateDoc = async (docType: string) => {
    const finalPrompt = isCustomMode ? customInput : `Draft a professional ${docType} legal document.`;
    if (isCustomMode && !customInput) return toast.error("Please describe the document first.");

    setLoading(true);
    setDraft("");
    setStatus("Forging Document...");
    
    try {
      const response = await fetch('http://localhost:5000/api/legal-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `${finalPrompt} \n\n CRITICAL: At the very end of your response, you MUST include: ---DRAFT_DATA--- Draft Precision: [Number]/100` 
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullStreamedText = "";
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullStreamedText += chunk;
          setDraft((prev) => prev + chunk);
        }
      }

      const precisionMatch = fullStreamedText.match(/(?:Precision|Score):\s*(\d+)/i);
      const finalScore = precisionMatch ? parseInt(precisionMatch[1]) : 95;
      const cleanContent = fullStreamedText.split(/---.*?_DATA---/)[0].replace("---CRITICAL_EMERGENCY---", "").trim();
      
      saveToVault(isCustomMode ? "Custom Asset" : docType, finalScore, cleanContent);
      setIsCustomMode(false);
      setCustomInput("");
      toast.success("Document forged and saved to Vault.");
    } catch (error) {
      toast.error("Forge Connection Offline.");
    } finally {
      setLoading(false);
      setStatus("Drafting Complete");
    }
  };

  const precisionMatch = draft.match(/(?:Precision|Score):\s*(\d+)/i);
  const precisionScore = precisionMatch ? parseInt(precisionMatch[1]) : 0;
  const isEmergency = draft.includes("---CRITICAL_EMERGENCY---");
  const cleanDraft = draft.split(/---.*?_DATA---/)[0].replace("---CRITICAL_EMERGENCY---", "").trim();

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("RELUNO LEGAL DRAFT", 20, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(cleanDraft, 170);
    doc.text(splitText, 20, 35);
    doc.save("Reluno_Draft.pdf");
    toast.success("Exported to PDF.");
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      {/* ── Match Dashboard Nav ── */}
      <header className="flex h-16 items-center justify-between border-b border-slate-100 px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Forge Console v1.0</span>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${loading ? 'bg-blue-50 text-blue-600 animate-pulse' : 'bg-slate-50 text-slate-600'}`}>
          {status}
        </div>
      </header>

      {/* ── Match Dashboard Container ── */}
      <main className="p-8 max-w-7xl mx-auto space-y-8 relative">
        {/* Glow effect matching Dashboard */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-100/30 blur-[120px] rounded-full -z-10" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter text-slate-900">Doc Hub</h1>
            <p className="text-slate-500 font-medium text-xl">Generate enforceable legal assets instantly.</p>
          </div>
          <Button 
            onClick={() => setIsCustomMode(!isCustomMode)}
            className={`${isCustomMode ? 'bg-slate-200 text-slate-900' : 'bg-slate-900 text-white'} rounded-2xl px-8 h-14 font-black text-xs uppercase tracking-widest shadow-xl transition-all`}
          >
            {isCustomMode ? <><X className="mr-2 size-4" /> Cancel</> : <><Plus className="mr-2 size-4" /> Create Custom Asset</>}
          </Button>
        </div>

        {isCustomMode && (
          <Card className="p-8 rounded-[3rem] border-4 border-dashed border-blue-100 bg-blue-50/20 animate-in slide-in-from-top-4 duration-300">
            <div className="flex gap-4">
              <Input 
                placeholder="Describe the document you need..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && generateDoc("Custom")}
                className="h-20 rounded-[1.5rem] border-none shadow-inner bg-white text-xl px-8 focus-visible:ring-blue-500"
              />
              <Button 
                onClick={() => generateDoc("Custom")} 
                disabled={!customInput || loading}
                className="h-20 px-12 bg-blue-600 text-white rounded-[1.5rem] font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex gap-3"
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <><Sparkles className="size-6" /> FORGE</>}
              </Button>
            </div>
          </Card>
        )}

        {!isCustomMode && (
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Non-Disclosure (NDA)", type: "Contract", status: "Verified" },
              { name: "Employment Offer", type: "Onboarding", status: "Enterprise" },
              { name: "Operating Agreement", type: "Corporate", status: "Verified" }
            ].map((doc) => (
              <Card 
                key={doc.name} 
                onClick={() => !loading && generateDoc(doc.name)}
                className="rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-200 hover:scale-[1.02] transition-all cursor-pointer group bg-white p-8"
              >
                <div className="bg-slate-50 p-5 rounded-3xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <FilePlus2 className="size-8" />
                </div>
                <h3 className="font-black text-lg text-slate-900 mb-1">{doc.name}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{doc.type}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest uppercase text-blue-500">{doc.status}</span>
                  <Zap className={`size-5 ${loading ? 'animate-spin text-blue-600' : 'text-slate-200'}`} />
                </div>
              </Card>
            ))}
          </div>
        )}

        {(draft || loading) && (
          <div className={isEmergency ? "animate-pulse" : ""}>
            <Card className={`rounded-[3.5rem] border-4 overflow-hidden shadow-2xl bg-white transition-all duration-500 ${isEmergency ? 'border-red-500 shadow-red-200' : 'border-slate-50 shadow-blue-100/50'}`}>
              <div className={`p-8 flex items-center justify-between ${isEmergency ? 'bg-red-50' : 'bg-blue-50/50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl bg-white shadow-sm ${isEmergency ? 'text-red-600' : 'text-blue-600'}`}>
                    {isEmergency ? <AlertTriangle className="size-6" /> : <FileCheck className="size-6" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Forge Monitor</p>
                    <p className="text-xl font-black text-slate-900 tracking-tight">
                      {isEmergency ? "CRITICAL RISK ALERT" : "AI Drafting Console"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Precision Level</p>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-3 bg-white rounded-full overflow-hidden border border-slate-100 shadow-inner">
                      <div 
                        className={`h-full transition-all duration-1000 ${isEmergency ? 'bg-red-600' : 'bg-blue-600'}`} 
                        style={{ width: `${precisionScore}%` }} 
                      />
                    </div>
                    <span className="text-2xl font-black text-slate-900">{precisionScore}%</span>
                  </div>
                </div>
              </div>

              <div ref={scrollRef} className="p-16 min-h-[600px] max-h-[900px] overflow-y-auto bg-white whitespace-pre-wrap font-sans text-slate-700 leading-relaxed text-xl">
                {cleanDraft}
                {loading && <div className="inline-block w-2 h-7 bg-blue-600 animate-pulse" />}
              </div>

              {!loading && (
                <div className="p-10 border-t bg-slate-50/50 flex justify-between items-center">
                   <div className="flex items-center gap-3 text-emerald-600">
                    <CheckCircle className="size-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Asset Ready for Export</span>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => setDraft("")} className="rounded-2xl font-black text-xs uppercase px-8 hover:bg-red-50 hover:text-red-600 transition-all">Discard</Button>
                    <Button onClick={exportToPDF} className="bg-slate-900 text-white rounded-2xl font-black text-xs uppercase px-10 h-14 flex gap-3 shadow-xl hover:bg-black transition-all">
                      <Download className="size-4" /> Export Intelligence PDF
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}