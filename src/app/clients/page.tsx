"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, Building2, Mail, Phone, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClients() {
      try {
        const url = filter ? `/api/clients?status=${filter}` : "/api/clients";
        const res = await fetch(url);
        const data = await res.json();
        setClients(data);
      } catch (error) {
        console.error("Failed to fetch clients", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, [filter]);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Directory</h1>
          <p className="text-muted-foreground text-sm">Manage your agency relationships, accounts, and contact statuses.</p>
        </div>
        <Link 
          href="/clients/new" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium shadow hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Client
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b pb-4">
        <button 
          onClick={() => setFilter("")} 
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === "" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
        >
          All Clients
        </button>
        <button 
          onClick={() => setFilter("ACTIVE")} 
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === "ACTIVE" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
        >
          Active
        </button>
        <button 
          onClick={() => setFilter("INACTIVE")} 
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === "INACTIVE" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
        >
          Inactive
        </button>
      </div>

      {/* Client Table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground text-xs font-semibold uppercase">
              <th className="p-4">Name / Company</th>
              <th className="p-4">Contact Info</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted-foreground">Loading clients...</td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted-foreground">No clients found. Click "Add Client" to create one.</td>
              </tr>
            ) : (
              clients.map((client: any) => (
                <tr key={client.id} className="hover:bg-muted/30 transition">
                  <td className="p-4">
                    <div className="font-semibold text-foreground">{client.name}</div>
                    <div className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3" /> {client.company || "Independent"}
                    </div>
                  </td>
                  <td className="p-4 space-y-1">
                    <div className="text-muted-foreground text-xs flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {client.email || "No email"}
                    </div>
                    <div className="text-muted-foreground text-xs flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {client.phone || "No phone"}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-px px-2.5 py-1 rounded-full text-xs font-semibold ${
                      client.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-600" : "bg-gray-500/10 text-gray-600"
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/clients/${client.id}`} 
                      className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                    >
                      View Profile <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}