import React from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Clock, ChevronRight, Search } from "lucide-react";

// Stark, professional categories
const categories = ["All Insights", "Computational Law", "Consumer Rights", "Small Business", "Case Studies"];

const blogPosts = [
  {
    id: 1,
    title: "The shift to computational law: Why synthesis matters for small business.",
    excerpt: "Traditional legal discovery is a billion-dollar inefficiency. We explore how Large Language Models are decentralizing legal intelligence and allowing individuals to navigate complex car accident claims without the $400/hr barrier.",
    date: "May 10, 2026",
    readTime: "8 min read",
    category: "Computational Law",
    featured: true,
  },
  {
    id: 2,
    title: "Structural advantages in small claims: A data-driven approach.",
    excerpt: "Statistically, most small claims are lost due to poor evidence organization. Reluno's synthesis engine allows users to organize evidence into court-ready timelines instantly.",
    date: "May 04, 2026",
    readTime: "6 min read",
    category: "Small Claims",
  },
  {
    id: 3,
    title: "Automating the mundane: How freelancers handle contract disputes.",
    excerpt: "Freelance agreements shouldn't require a legal department. We breakdown the automation of demand letters and the impact of rapid document generation on late payments.",
    date: "April 28, 2026",
    readTime: "10 min read",
    category: "Small Business",
  },
  {
    id: 4,
    title: "The future of tenant rights in the age of automation.",
    excerpt: "Housing disputes are often a battle of documentation. Learn how Reluno’s PDF Analysis identifies unfavorable lease clauses before you sign, leveling the playing field against corporate landlords.",
    date: "April 22, 2026",
    readTime: "7 min read",
    category: "Consumer Rights",
  },
  {
    id: 5,
    title: "SOC 2 and the ethics of legal data processing.",
    excerpt: "Security isn't an afterthought in legal tech—it's the product. An in-depth look at Reluno's zero-data-retention policy and AES-256 encryption standards.",
    date: "April 15, 2026",
    readTime: "12 min read",
    category: "Computational Law",
  },
];

export default function Blog() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-body">
      <Navbar />

      {/* ─── Editorial Header ────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="h-px w-8 bg-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-[0.25em]">
              The Reluno Journal
            </span>
          </div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1.1] tracking-tight mb-8">
            Perspectives on the <br />
            <span className="italic">democratization</span> of law.
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-8 border-t border-zinc-100">
            <div className="flex flex-wrap gap-6">
              {categories.map((cat) => (
                <button key={cat} className="text-xs font-medium text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest">
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="bg-zinc-50 border border-zinc-200 rounded-full py-2 pl-9 pr-4 text-xs w-full md:w-64 focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Post ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          {blogPosts.filter(p => p.featured).map(post => (
            <div key={post.id} className="grid md:grid-cols-2 gap-12 items-center group cursor-pointer" onClick={() => navigate(`/blog/${post.id}`)}>
              <div className="aspect-[16/10] bg-zinc-100 rounded-sm overflow-hidden border border-zinc-200">
                {/* Image Placeholder with high-end tint */}
                <div className="w-full h-full bg-zinc-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                   <div className="text-[100px] font-display text-zinc-100 italic">Reluno</div>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em] mb-4 block">Featured Insight</span>
                <h2 className="font-display text-3xl md:text-4xl leading-tight mb-6 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8 font-light italic">
                  "{post.excerpt}"
                </p>
                <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  <span>{post.date}</span>
                  <div className="w-1 h-1 rounded-full bg-zinc-300" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Article Grid ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-100 border border-zinc-100">
            {blogPosts.filter(p => !p.featured).map((post) => (
              <div 
                key={post.id} 
                className="bg-white p-10 flex flex-col justify-between hover:bg-zinc-50 transition-colors group cursor-pointer"
              >
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6 block">
                    {post.category}
                  </span>
                  <h3 className="font-display text-2xl leading-snug mb-4 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-10 line-clamp-3 font-light">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Read Article <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Editorial Newsletter ───────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-zinc-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl mb-6 text-zinc-100">Stay briefed.</h2>
          <p className="text-zinc-400 text-sm mb-10 font-light tracking-wide">
            Weekly synthesis on the intersection of artificial intelligence, legal infrastructure, and consumer rights. No spam. Only intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-0 border border-zinc-700 rounded-sm overflow-hidden">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-zinc-800 flex-1 px-6 py-4 text-sm focus:outline-none focus:bg-zinc-700 transition-colors"
            />
            <button className="bg-white text-zinc-900 px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}