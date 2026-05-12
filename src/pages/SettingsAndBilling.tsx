

import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, CreditCard, LogOut, User, Mail, Calendar, Shield, ArrowRight } from "lucide-react";

export default function SettingsAndBilling() {
  const { user, signOut } = useAuth();
  const { isSubscribed } = useSubscription();

  return (
    
      <div className="flex min-h-screen w-full bg-slate-50/50">
        
        
          <header className="flex h-16 items-center border-b px-8 bg-white sticky top-0 z-40">
            
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Account Control</h2>
          </header>

          <main className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight text-slate-900">Settings & Billing</h1>
              <p className="text-slate-500 font-medium">Manage your subscription, security, and account preferences.</p>
            </div>

            {/* SUBSCRIPTION CARD */}
            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-indigo-100 overflow-hidden bg-white">
              <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <Badge className="bg-indigo-600 mb-2">Current Plan</Badge>
                  <h2 className="text-3xl font-bold flex items-center gap-3 justify-center md:justify-start">
                    {isSubscribed ? "Enterprise Pro" : "Free Tier"}
                    {isSubscribed && <Crown className="text-amber-400 size-6" />}
                  </h2>
                  <p className="text-slate-400 text-sm">Your next billing date is May 1st, 2026.</p>
                </div>
                {!isSubscribed && (
                  <Button onClick={() => window.location.href='/pricing'} size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black px-8">
                    Upgrade to Pro <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                )}
              </div>
              <CardContent className="p-10 grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="size-4 text-indigo-600" /> Payment Method
                  </h4>
                  <div className="p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-medium">•••• •••• •••• 4242</span>
                    <Button variant="link" className="text-indigo-600 font-bold p-0">Update</Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="size-4 text-indigo-600" /> Security
                  </h4>
                  <Button variant="outline" className="w-full rounded-xl border-slate-100 font-bold text-slate-600">Change Password</Button>
                </div>
              </CardContent>
            </Card>

            {/* ACCOUNT DETAILS */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="rounded-[2rem] border-slate-100 shadow-sm p-8 space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2"><User className="size-5 text-slate-400" /> Profile Information</h3>
                <div className="space-y-4">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Address</p>
                      <p className="font-bold text-slate-700">{user?.email}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Member Since</p>
                      <p className="font-bold text-slate-700">April 2026</p>
                   </div>
                </div>
              </Card>

              <Card className="rounded-[2rem] border-slate-100 shadow-sm p-8 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">Danger Zone</h3>
                  <p className="text-sm text-slate-500">Log out of all sessions or deactivate your account.</p>
                </div>
                <div className="space-y-3 pt-6">
                  <Button onClick={signOut} variant="outline" className="w-full rounded-xl border-red-100 text-red-600 hover:bg-red-50 font-bold">
                    <LogOut className="mr-2 size-4" /> Sign Out
                  </Button>
                </div>
              </Card>
            </div>
          </main>
        
      </div>
    
  );
}
