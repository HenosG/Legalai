"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Building2, Mail, Phone, Briefcase, FileText, DollarSign } from "lucide-react";
import Link from "next/link";

export default function ClientProfilePage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    async function fetchClientDetails() {
      try {
        const res = await fetch(`/api/clients/${clientId}`);
        if (res.ok) {
          const data = await res.json();
          setClient(data);
        }
      } catch (error) {
        console.error("Failed to fetch client profile", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClientDetails();
  }, [clientId]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;
  if (!client) return <div className="p-8 text-center text-muted-foreground">Client not found.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <Link href="/clients" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </Link>

      {/* Profile Header Card */}
      <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{client.name}</h1>
          <div className="flex items-center gap-4 text-muted-foreground text-sm mt-1">
            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {client.company || "Independent"}</span>
            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {client.email || "No email"}</span>
            <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {client.phone || "No phone"}</span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600">
          {client.status}
        </span>
      </div>

      {/* Linked Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Proposals */}
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Linked Proposals</h3>
          {client.proposals?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No proposals linked to this client.</p>
          ) : (
            client.proposals.map((p: any) => (
              <div key={p.id} className="border-b pb-2 text-sm flex justify-between items-center">
                <span>{p.title}</span>
                <span className="font-semibold">${p.amount}</span>
              </div>
            ))
          )}
        </div>

        {/* Projects */}
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" /> Active Projects</h3>
          {client.projects?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects linked to this client.</p>
          ) : (
            client.projects.map((proj: any) => (
              <div key={proj.id} className="border-b pb-2 text-sm flex justify-between items-center">
                <span>{proj.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-muted font-medium">{proj.status}</span>
              </div>
            ))
          )}
        </div>

        {/* Invoices */}
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2"><DollarSign className="w-5 h-5 text-primary" /> Invoices & Billing</h3>
          {client.invoices?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invoices generated for this client.</p>
          ) : (
            client.invoices.map((inv: any) => (
              <div key={inv.id} className="border-b pb-2 text-sm flex justify-between items-center">
                <span>Total: ${inv.amount}</span>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${inv.status === "PAID" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                  {inv.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}