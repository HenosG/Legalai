// src/pages/Templates.tsx
// Salesforce-inspired dense document template library
// Category badges, Complexity Score bars, Last Updated timestamps

import React, { useState } from "react";


import {
  FileText, Search, Download, Star, Clock, Filter,
  ChevronRight, BookMarked, Shield, Gavel, Users,
  Building2, AlertTriangle, FileCheck, Home, Briefcase,
  SortAsc, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Template data ────────────────────────────────────────────────────────────
type Category = "Contract" | "Court Filing" | "Corporate" | "Real Estate" | "Employment" | "IP" | "Litigation";
type Complexity = 1 | 2 | 3 | 4 | 5;

interface Template {
  id: string;
  title: string;
  description: string;
  category: Category;
  complexity: Complexity;
  lastUpdated: string;
  uses: number;
  starred?: boolean;
  pages: number;
  jurisdiction?: string;
}

const CATEGORY_CONFIG: Record<Category, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  "Contract":     { icon: FileText,      color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200"    },
  "Court Filing": { icon: Gavel,         color: "text-red-600",     bg: "bg-red-50",     border: "border-red-200"     },
  "Corporate":    { icon: Building2,     color: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-200"  },
  "Real Estate":  { icon: Home,          color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  "Employment":   { icon: Users,         color: "text-orange-600",  bg: "bg-orange-50",  border: "border-orange-200"  },
  "IP":           { icon: Shield,        color: "text-blue-700",    bg: "bg-blue-50",    border: "border-cyan-200"    },
  "Litigation":   { icon: AlertTriangle, color: "text-rose-600",    bg: "bg-rose-50",    border: "border-rose-200"    },
};

const TEMPLATES: Template[] = [
  { id: "1",  title: "Non-Disclosure Agreement (Mutual)",        description: "Comprehensive bilateral NDA covering trade secrets, proprietary information, and confidential data for business partnerships.", category: "Contract",     complexity: 2, lastUpdated: "2025-04-15", uses: 4820, starred: true,  pages: 6,  jurisdiction: "US Federal"     },
  { id: "2",  title: "Master Service Agreement (Enterprise)",    description: "Full-scope MSA with SLA provisions, IP ownership clauses, limitation of liability, and dispute resolution frameworks.",       category: "Contract",     complexity: 5, lastUpdated: "2025-04-01", uses: 2310, starred: true,  pages: 24, jurisdiction: "Multi-state"    },
  { id: "3",  title: "Motion to Dismiss — Federal",             description: "12(b)(6) Motion to Dismiss for failure to state a claim upon which relief can be granted. Includes supporting memorandum.",   category: "Court Filing", complexity: 4, lastUpdated: "2025-03-20", uses: 891,  starred: false, pages: 18, jurisdiction: "US Federal"     },
  { id: "4",  title: "Employment Agreement — Executive",        description: "Senior executive employment contract with compensation structure, equity vesting, non-compete, and termination provisions.",   category: "Employment",   complexity: 4, lastUpdated: "2025-04-10", uses: 1560, starred: false, pages: 15, jurisdiction: "Multi-state"    },
  { id: "5",  title: "Articles of Incorporation (C-Corp)",      description: "State-compliant articles of incorporation for C-Corporation formation with standard authorized share structure.",              category: "Corporate",    complexity: 3, lastUpdated: "2025-04-05", uses: 3200, starred: true,  pages: 8,  jurisdiction: "Delaware"       },
  { id: "6",  title: "Commercial Lease Agreement",              description: "Triple-net commercial lease with tenant improvement allowance, rent escalation clauses, and assignment provisions.",          category: "Real Estate",  complexity: 4, lastUpdated: "2025-03-28", uses: 1870, starred: false, pages: 22, jurisdiction: "State-level"    },
  { id: "7",  title: "Patent Assignment Agreement",             description: "Full patent assignment from inventor to corporate entity. Covers all continuations, divisionals, and foreign counterparts.",  category: "IP",           complexity: 3, lastUpdated: "2025-02-14", uses: 640,  starred: false, pages: 7,  jurisdiction: "USPTO"          },
  { id: "8",  title: "Settlement Agreement & Release",          description: "Comprehensive settlement and mutual release covering all known and unknown claims. Includes confidentiality provisions.",     category: "Litigation",   complexity: 3, lastUpdated: "2025-04-18", uses: 2900, starred: true,  pages: 10, jurisdiction: "US Federal"     },
  { id: "9",  title: "Operating Agreement (LLC — Multi-Member)",description: "Multi-member LLC operating agreement with profit/loss allocation, manager provisions, and buy-sell mechanisms.",             category: "Corporate",    complexity: 4, lastUpdated: "2025-04-02", uses: 2100, starred: false, pages: 20, jurisdiction: "Delaware"       },
  { id: "10", title: "Demand Letter — Breach of Contract",      description: "Formal demand letter asserting breach of contract with cure period, liquidated damages reference, and litigation warning.",  category: "Litigation",   complexity: 2, lastUpdated: "2025-04-12", uses: 5100, starred: true,  pages: 3,  jurisdiction: "General"        },
  { id: "11", title: "Independent Contractor Agreement",        description: "IC agreement with IP assignment, non-solicitation, work-for-hire provisions, and misclassification-safe language.",          category: "Employment",   complexity: 2, lastUpdated: "2025-03-15", uses: 6800, starred: false, pages: 8,  jurisdiction: "Multi-state"    },
  { id: "12", title: "Answer to Complaint — Civil",            description: "Federal civil answer template with affirmative defenses, counterclaims section, and jury trial demand.",                     category: "Court Filing", complexity: 3, lastUpdated: "2025-04-08", uses: 1240, starred: false, pages: 12, jurisdiction: "US Federal"     },
  { id: "13", title: "Trademark License Agreement",            description: "Exclusive trademark license with quality control provisions, royalty structure, and termination rights.",                    category: "IP",           complexity: 3, lastUpdated: "2025-01-30", uses: 780,  starred: false, pages: 11, jurisdiction: "US Federal"     },
  { id: "14", title: "Residential Purchase Agreement",         description: "Standard residential real estate purchase agreement with contingencies, inspection rights, and closing conditions.",          category: "Real Estate",  complexity: 3, lastUpdated: "2025-04-14", uses: 4300, starred: true,  pages: 14, jurisdiction: "State-level"    },
  { id: "15", title: "Summary Judgment Motion",               description: "Motion for summary judgment under FRCP 56 with supporting memorandum structure, undisputed facts section, and argument.",     category: "Court Filing", complexity: 5, lastUpdated: "2025-03-01", uses: 560,  starred: false, pages: 30, jurisdiction: "US Federal"     },
];

const CATEGORIES: Array<Category | "All"> = ["All", "Contract", "Court Filing", "Corporate", "Real Estate", "Employment", "IP", "Litigation"];

// ─── Complexity bar ───────────────────────────────────────────────────────────
const ComplexityBar: React.FC<{ score: Complexity }> = ({ score }) => {
  const label = ["", "Basic", "Standard", "Intermediate", "Advanced", "Expert"][score];
  const color = score <= 2 ? "bg-emerald-500" : score === 3 ? "bg-amber-500" : score === 4 ? "bg-orange-500" : "bg-red-500";
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Complexity</span>
        <span className={cn("text-[9px] font-black uppercase tracking-widest",
          score <= 2 ? "text-emerald-600" : score === 3 ? "text-amber-600" : score === 4 ? "text-orange-600" : "text-red-600"
        )}>{label}</span>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className={cn("h-1 flex-1 rounded-full", i < score ? color : "bg-zinc-100")} />
        ))}
      </div>
    </div>
  );
};

// ─── Template card ────────────────────────────────────────────────────────────
const TemplateCard: React.FC<{ template: Template }> = ({ template }) => {
  const [starred, setStarred] = useState(template.starred);
  const cfg = CATEGORY_CONFIG[template.category];
  const Icon = cfg.icon;

  return (
    <div className="group bg-white border border-zinc-200 rounded-2xl p-5 hover:border-cyan-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-200 flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", cfg.bg)}>
          <Icon className={cn("w-5 h-5", cfg.color)} />
        </div>
        <button
          onClick={() => setStarred((s) => !s)}
          className="flex-shrink-0 mt-0.5"
        >
          <Star className={cn("w-4 h-4 transition-colors", starred ? "fill-amber-400 text-amber-400" : "text-zinc-200 hover:text-amber-300")} />
        </button>
      </div>

      {/* Category badge */}
      <div>
        <span className={cn("text-[8px] font-black uppercase tracking-[0.3em] px-2 py-0.5 rounded border", cfg.bg, cfg.color, cfg.border)}>
          {template.category}
        </span>
      </div>

      {/* Title & description */}
      <div>
        <h3 className="text-sm font-black text-zinc-900 tracking-tight leading-snug mb-1.5">{template.title}</h3>
        <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">{template.description}</p>
      </div>

      {/* Complexity */}
      <ComplexityBar score={template.complexity} />

      {/* Meta */}
      <div className="flex items-center gap-3 text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
        <span className="flex items-center gap-1">
          <FileText className="w-2.5 h-2.5" />
          {template.pages}p
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-2.5 h-2.5" />
          {template.uses.toLocaleString()}
        </span>
        {template.jurisdiction && (
          <span className="ml-auto truncate">{template.jurisdiction}</span>
        )}
      </div>

      {/* Last updated */}
      <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 font-medium">
        <Clock className="w-2.5 h-2.5" />
        Updated {new Date(template.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-zinc-100">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors">
          <FileCheck className="w-3 h-3" /> Use Template
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 hover:border-cyan-300 hover:bg-blue-50 transition-colors">
          <Download className="w-3.5 h-3.5 text-zinc-500" />
        </button>
      </div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Templates() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [sortBy, setSortBy] = useState<"popular" | "recent" | "complexity">("popular");

  const filtered = TEMPLATES
    .filter((t) => {
      const matchCat = activeCategory === "All" || t.category === activeCategory;
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "popular")    return b.uses - a.uses;
      if (sortBy === "recent")     return b.lastUpdated.localeCompare(a.lastUpdated);
      if (sortBy === "complexity") return b.complexity - a.complexity;
      return 0;
    });

  return (
    
      <div className="flex min-h-screen w-full bg-[#F9FAFB] text-zinc-900">
        
        

          <header className="flex h-14 items-center justify-between border-b border-zinc-200 px-6 bg-white sticky top-0 z-40">
            <div className="flex items-center gap-3">
              
              <div className="h-4 w-px bg-zinc-200" />
              <BookMarked className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Template Library</span>
            </div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              {filtered.length} templates
            </span>
          </header>

          <main className="p-6 max-w-7xl mx-auto">
            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tighter text-zinc-900 mb-1">Document Templates</h1>
              <p className="text-sm text-zinc-500">Court-ready, attorney-reviewed legal documents. Use, customize, and export in seconds.</p>
            </div>

            {/* Search & controls */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:border-cyan-300 transition-colors">
              <Search className="w-4 h-4" />
              <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search templates..."
                  className="flex-1 text-sm text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none font-medium"
                />
              </div>

              <div className="flex items-center gap-1.5">
              <SortAsc className="w-3.5 h-3.5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="text-[10px] font-black text-zinc-600 bg-white border border-zinc-200 rounded-xl px-3 py-2 focus:outline-none uppercase tracking-wider cursor-pointer"
                >
                  <option value="popular">Most Used</option>
                  <option value="recent">Recently Updated</option>
                  <option value="complexity">By Complexity</option>
                </select>
              </div>
            </div>

            {/* Category filter tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                const cfg = cat !== "All" ? CATEGORY_CONFIG[cat] : null;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all",
                      isActive
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                    )}
                  >
                    {cfg && <cfg.icon className="w-3 h-3" />}
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Template grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-zinc-200">
                <FileText className="w-10 h-10 text-zinc-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-zinc-400">No templates match your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((t) => <TemplateCard key={t.id} template={t} />)}
              </div>
            )}
          </main>
        
      </div>
    
  );
}