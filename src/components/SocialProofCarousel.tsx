import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Youtube, Instagram, Music2, PenTool, Globe, Zap, X, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Fixed from the previous version:
//   1. The marquee animated `x: [0, -1000]` — a fixed pixel offset that
//      only loops seamlessly if one full set of PARTNERS happens to
//      render at exactly 1000px wide. It almost certainly doesn't, so the
//      strip visibly jumped backward at the seam every 40s. Since the
//      track is built from two copies of PARTNERS back to back, animating
//      to exactly -50% always lands precisely where the second copy
//      begins, regardless of actual rendered width — guaranteed seamless.
//   2. Removed the outer <section>-style wrapper, its own padding, and
//      its own caption heading. Pricing.tsx already wraps this component
//      in its own <section> with its own heading — keeping both meant a
//      duplicated caption and doubled vertical spacing when embedded.
//      This file now renders only the marquee + modal; the parent page
//      owns the section chrome.
//   3. Removed unused Share2 and Camera imports.

const PARTNERS = [
  {
    name: "YouTube",
    icon: Youtube,
    color: "text-[#FF0000]",
    bgColor: "bg-[#FF0000]/5",
    description: "Automate sponsorship contracts and copyright clearance for your channel.",
    relation: "Reluno AI audits complex brand deals in seconds, protecting your content and revenue."
  },
  {
    name: "TikTok",
    icon: Music2,
    color: "text-[#000000]",
    bgColor: "bg-zinc-100",
    description: "Manage creator fund agreements and music licensing effortlessly.",
    relation: "Our AI simplifies the fine print of social platforms, letting you focus on the trend."
  },
  {
    name: "Instagram",
    icon: Instagram,
    color: "text-[#E4405F]",
    bgColor: "bg-[#E4405F]/5",
    description: "Secure your brand identity and handle influencer partnership legalities.",
    relation: "Protect your aesthetic and your business with automated IP protection tools."
  },
  {
    name: "Canva",
    icon: PenTool,
    color: "text-[#00C4CC]",
    bgColor: "bg-[#00C4CC]/5",
    description: "Ensure your designs and assets are legally compliant for commercial use.",
    relation: "Designers use Reluno to verify licensing terms for assets before they hit publish."
  },
  {
    name: "Fiverr",
    icon: Globe,
    color: "text-[#1DBF73]",
    bgColor: "bg-[#1DBF73]/5",
    description: "Scale your freelance business with iron-clad service agreements.",
    relation: "Top-rated sellers use our templates to close deals faster with professional legal backing."
  },
  {
    name: "Upwork",
    icon: Zap,
    color: "text-[#6FDA44]",
    bgColor: "bg-[#6FDA44]/5",
    description: "Protect your work and ensure timely payments with automated legal review.",
    relation: "Freelancers audit platform contracts to ensure their IP and payments are always safe."
  }
];

export const SocialProofCarousel = () => {
  const [selectedPartner, setSelectedPartner] = useState<typeof PARTNERS[0] | null>(null);

  return (
    <div className="w-full overflow-hidden relative">
      {/* Track is exactly two copies of PARTNERS back to back, so
          animating to -50% always lands on the start of the second
          copy — seamless regardless of actual rendered width. */}
      <div className="relative flex items-center overflow-hidden">
        <motion.div
          className="flex gap-12 lg:gap-24 items-center w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 40,
            ease: "linear",
          }}
        >
          {[...PARTNERS, ...PARTNERS].map((partner, idx) => {
            const Icon = partner.icon;
            return (
              <button
                key={`${partner.name}-${idx}`}
                onClick={() => setSelectedPartner(partner)}
                className="group flex items-center gap-4 transition-all duration-500 hover:scale-110 shrink-0"
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-current/10",
                  partner.bgColor
                )}>
                  <Icon size={32} className={partner.color} />
                </div>
                <span className="text-2xl font-bold tracking-tighter text-zinc-900 opacity-60 group-hover:opacity-100 transition-opacity">
                  {partner.name}
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Modal overlay */}
      <AnimatePresence>
        {selectedPartner && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPartner(null)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md"
            />

            <motion.div
              layoutId={`partner-${selectedPartner.name}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] p-12 shadow-2xl overflow-hidden"
            >
              <div className={cn("absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-10 blur-3xl", selectedPartner.bgColor)} />

              <button
                onClick={() => setSelectedPartner(null)}
                className="absolute top-8 right-8 p-2 hover:bg-zinc-50 rounded-full transition-colors"
              >
                <X size={20} className="text-zinc-400" />
              </button>

              <div className="flex items-center gap-6 mb-8">
                <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center", selectedPartner.bgColor)}>
                  <selectedPartner.icon size={40} className={selectedPartner.color} />
                </div>
                <div>
                  <h3 className="text-3xl font-serif text-zinc-900">{selectedPartner.name}</h3>
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">Platform Partner</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.2em] mb-2">The Challenge</p>
                  <p className="text-lg text-zinc-600 font-light leading-relaxed">
                    {selectedPartner.description}
                  </p>
                </div>

                <div className="p-8 bg-zinc-50 rounded-[2rem] border border-zinc-100">
                  <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.2em] mb-3">Reluno Solution</p>
                  <p className="text-sm text-zinc-900 font-medium leading-relaxed italic">
                    "{selectedPartner.relation}"
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPartner(null)}
                className="mt-10 w-full py-5 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-3 group"
              >
                Continue Exploring <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};