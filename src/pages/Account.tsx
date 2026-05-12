import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react"; 


import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, CreditCard, ShieldCheck, 
  Crown, Zap 
} from "lucide-react";
import { toast } from "sonner";

export default function Account() {
  const { isLoaded, user } = useUser(); 
  const [userName, setUserName] = useState("");

  // This ensures the input field updates to your REAL name as soon as Clerk loads
  useEffect(() => {
    if (isLoaded && user) {
      setUserName(user.fullName || "");
    }
  }, [isLoaded, user]);

  const handleSave = async () => {
    // This is the bridge to Neon. For now, it shows the success state.
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Syncing Identity with Neon Vault...',
        success: 'Identity Secured successfully',
        error: 'Vault connection failed',
      }
    );
    
    // Logic to update your Neon DB will go here next
    console.log("Saving new name to DB for Clerk ID:", user?.id, "Name:", userName);
  };

  // Prevent blank screen while Clerk is fetching your session
  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FBFBFE]">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">
          Establishing Secure Session...
        </div>
      </div>
    );
  }

  return (
    
      <div className="flex min-h-screen w-full bg-[#FBFBFE]">
        
        
          <header className="flex h-16 items-center border-b px-8 bg-white/80 backdrop-blur-md sticky top-0 z-40">
            
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Account Command</h2>
          </header>

          <main className="p-12 max-w-7xl mx-auto space-y-12">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">Settings</h1>
                <p className="text-slate-400 font-bold text-xs tracking-[0.3em] uppercase mt-4">Subscription & Identity Management</p>
              </div>
              <Badge className="bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-indigo-100">
                Pro Member
              </Badge>
            </header>

            {/* SUBSCRIPTION CONTROL */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Crown className="size-5 text-indigo-600" />
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-900">Plan Details</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 p-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-[3rem] shadow-xl border-none">
                  <div className="bg-white rounded-[2.8rem] p-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-2xl font-black text-slate-900 uppercase italic">Reluno Pro</h4>
                        <p className="text-slate-400 text-sm font-medium mt-1 italic">Enterprise access active</p>
                      </div>
                      <p className="text-3xl font-black text-slate-900">$49<span className="text-sm">/mo</span></p>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                      <Button variant="outline" className="rounded-2xl border-slate-200 font-black text-[10px] uppercase h-11 px-8">Update Card</Button>
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Auto-renew active</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 rounded-[3rem] border-none bg-slate-900 text-white flex flex-col justify-between shadow-2xl">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6">Forge Power</h4>
                    <p className="text-5xl font-black italic">Unlimited</p>
                  </div>
                  <Zap className="text-indigo-500/20 size-16 self-end" />
                </Card>
              </div>
            </section>

            {/* IDENTITY & SECURITY */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 rounded-[3rem] border-none shadow-sm bg-white space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <User className="size-4 text-indigo-600" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Legal Identity</h4>
                </div>
                <input 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-900 focus:ring-2 ring-indigo-500 transition-all outline-none"
                />
                <Button onClick={handleSave} className="w-full bg-slate-900 text-white rounded-2xl h-12 font-black text-xs uppercase">Save Profile</Button>
              </Card>

              <Card className="p-8 rounded-[3rem] border-none shadow-sm bg-white space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="size-4 text-indigo-600" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vault Security</h4>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                  <span className="text-xs font-bold text-slate-600">AES-256 Encryption</span>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px]">Active</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                  <span className="text-xs font-bold text-slate-600">2FA Node</span>
                  <div className="w-8 h-4 bg-indigo-600 rounded-full flex items-center justify-end px-1 cursor-pointer">
                    <div className="size-2.5 bg-white rounded-full" />
                  </div>
                </div>
              </Card>
            </div>
          </main>
        
      </div>
    
  );
}
