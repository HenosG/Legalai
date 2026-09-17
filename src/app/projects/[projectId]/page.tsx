"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Briefcase, Building2, DollarSign, Calendar } from "lucide-react";
import Link from "next/link";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    async function fetchDetails() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        const found = data.find((p: any) => p.id === projectId);
        setProject(found || null);
      } catch (err) {
        console.error("Failed to load project details", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [projectId]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading project...</div>;
  if (!project) return <div className="p-8 text-center text-muted-foreground">Project not found.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </Link>

      <div className="bg-card border rounded-xl p-6 shadow-sm flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">{project.name}</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Client: {project.client?.name} ({project.client?.company || "Independent"})
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          {project.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">Project Budget</span>
            <div className="text-2xl font-bold mt-1">${project.budget?.toLocaleString() || "0"}</div>
          </div>
          <DollarSign className="w-6 h-6 text-primary" />
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">Target Deadline</span>
            <div className="text-lg font-semibold mt-1">{project.deadline ? new Date(project.deadline).toLocaleDateString() : "Not set"}</div>
          </div>
          <Calendar className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}