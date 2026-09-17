"use client";

import React, { useEffect, useState } from "react";
import { Plus, Briefcase, Building2, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Delivery</h1>
          <p className="text-muted-foreground text-sm">Track milestones, deliverables, and budgets for agency clients.</p>
        </div>
        <Link 
          href="/projects/new" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium shadow hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      {/* Projects Table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground text-xs font-semibold uppercase">
              <th className="p-4">Project Name</th>
              <th className="p-4">Client</th>
              <th className="p-4">Budget</th>
              <th className="p-4">Deadline</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">Loading projects...</td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">No projects found. Click "New Project" to start one.</td>
              </tr>
            ) : (
              projects.map((proj: any) => (
                <tr key={proj.id} className="hover:bg-muted/30 transition">
                  <td className="p-4 font-semibold text-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" /> {proj.name}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {proj.client?.name || "Unassigned"}
                    </div>
                  </td>
                  <td className="p-4 font-medium">
                    ${proj.budget?.toLocaleString() || "N/A"}
                  </td>
                  <td className="p-4 text-muted-foreground text-xs flex items-center gap-1 mt-3">
                    <Calendar className="w-3 h-3" /> {proj.deadline ? new Date(proj.deadline).toLocaleDateString() : "No deadline"}
                  </td>
                  <td className="p-4">
                    <span className="inline-px px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      {proj.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/projects/${proj.id}`} 
                      className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                    >
                      View Details <ExternalLink className="w-3 h-3" />
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