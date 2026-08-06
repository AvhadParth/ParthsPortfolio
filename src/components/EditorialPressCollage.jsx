import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Stamp, ExternalLink } from 'lucide-react';

export function EditorialPressCollage({ project, index }) {
  const [highlighted, setHighlighted] = useState(false);

  // Press clipping metadata per project
  const pressData = [
    {
      publication: "WIRED TECH REVIEW",
      date: "VOL. 34 • ISSUE 08",
      headline: "FACTMATRIX REDEFINES REAL-TIME CREDIBILITY ENGINES",
      excerpt: "By combining multi-source RSS ingestion with custom BERT NLP classifiers, Parth Avhad achieves full verification in under two seconds.",
      quote: "A monumental leap in automated credibility scoring.",
      stampText: "APPROVED PRESS",
      editionNo: "REF: 978-0-2026-FM"
    },
    {
      publication: "IEEE CYBERSECURITY JOURNAL",
      date: "VOL. 12 • SPECIAL EDITION",
      headline: "PHISHGUARD ACHIEVES 94% ACCURACY ON 50K DATASET",
      excerpt: "Engineered with Flask and React, PhishGuard processes high-entropy URLs through multi-stage ML pipelines to stop spoofed domains.",
      quote: "SIH Finalist architecture setting new benchmarks.",
      stampText: "TOP 10% BENCHMARK",
      editionNo: "REF: 978-0-2026-PG"
    },
    {
      publication: "MONOCLE ENGINEERING QUARTERLY",
      date: "ISSUE 44 • SECURITY",
      headline: "SECURENEXT: DEFENSIVE MERN ARCHITECTURE DEMYSTIFIED",
      excerpt: "Implementing strict RBAC authorization and multi-tier JWT token rotation to safeguard sensitive enterprise transactions.",
      quote: "Zero-trust architecture built with pristine craftsman precision.",
      stampText: "VERIFIED SECURITY",
      editionNo: "REF: 978-0-2026-SN"
    }
  ];

  const currentPress = pressData[index % pressData.length];

  return (
    <motion.div 
      whileHover={{ scale: 1.02, rotate: index % 2 === 0 ? 1 : -1 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setHighlighted(true)}
      onMouseLeave={() => setHighlighted(false)}
      className="relative p-6 sm:p-8 bg-[#F6F2E8] border-2 border-stone-400 rounded-sm shadow-2xl overflow-hidden font-mono-editorial text-stone-900 select-none cursor-pointer group"
    >
      {/* Matte Adhesive Tape Strips on Top Corners */}
      <div className="absolute -top-3 left-8 w-16 h-6 bg-white/60 border border-stone-300 rotate-[-6deg] shadow-xs pointer-events-none z-30" />
      <div className="absolute -top-3 right-8 w-16 h-6 bg-white/60 border border-stone-300 rotate-[8deg] shadow-xs pointer-events-none z-30" />

      {/* Red Press Ink Cancellation Stamp */}
      <div className="absolute top-6 right-6 w-26 h-26 rounded-full border-2 border-dashed border-red-800/70 bg-red-950/5 flex flex-col items-center justify-center rotate-[-14deg] text-[9px] text-red-900 font-bold uppercase tracking-widest pointer-events-none p-1 group-hover:rotate-0 transition-transform duration-500 z-20">
        <Stamp className="w-4 h-4 mb-0.5 text-red-800" />
        <span>{currentPress.stampText}</span>
        <span className="text-[7px] text-red-700">2026 EDITION</span>
      </div>

      {/* Newspaper Top Masthead Bar */}
      <div className="border-b-2 border-stone-800 pb-3 mb-6 flex justify-between items-baseline text-[10px] text-stone-700">
        <div className="flex items-center gap-2 pr-20">
          <Newspaper className="w-4 h-4 text-amber-800" />
          <span className="font-bold tracking-widest text-stone-900 uppercase">
            {currentPress.publication}
          </span>
        </div>
        <span className="font-bold text-stone-700">{currentPress.date}</span>
      </div>

      {/* Main Newspaper Headline */}
      <div className="space-y-2 mb-6">
        <span className="text-[9px] tracking-widest text-amber-800 font-bold block uppercase">
          {currentPress.editionNo}
        </span>
        <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase leading-snug tracking-tight text-stone-900 group-hover:text-amber-900 transition-colors pr-12">
          {currentPress.headline}
        </h3>
      </div>

      {/* News Article Snippet & Animated Yellow Highlighter Quote */}
      <div className="space-y-4 leading-relaxed text-stone-800 mb-6">
        <p className="font-sans-editorial text-sm leading-relaxed text-stone-900 font-medium">
          {currentPress.excerpt}
        </p>

        {/* Animated Yellow Highlighter Marker Box with Deep Dark Text */}
        <div className="relative p-3.5 bg-amber-200/70 border-l-4 border-amber-600 rounded-xs shadow-xs">
          <p className="font-editorial-serif italic text-sm font-extrabold text-stone-950">
            "{currentPress.quote}"
          </p>
        </div>
      </div>

      {/* Metric Badge Pill */}
      <div className="pt-4 border-t border-stone-400 flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping" />
          <span className="font-bold text-stone-900 text-[11px]">
            {project.metricLabel}: <strong className="text-amber-800">{project.metricValue}</strong>
          </span>
        </div>

        <span className="text-[10px] text-stone-700 uppercase font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
          <span>READ PRESS ARTICLE</span>
          <ExternalLink className="w-3 h-3 text-amber-800" />
        </span>
      </div>
    </motion.div>
  );
}
