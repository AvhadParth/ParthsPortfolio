import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '../utils/soundEngine';
import { Newspaper, Stamp, ExternalLink, Bookmark, Sparkles } from 'lucide-react';

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
      whileHover={{ scale: 1.025, rotate: index % 2 === 0 ? 1 : -1 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => {
        soundEngine.playHoverClick();
        setHighlighted(true);
      }}
      onMouseLeave={() => setHighlighted(false)}
      className="relative p-6 sm:p-8 bg-[#F4F0E6] dark:bg-[#1A1A1A] border-2 border-graphite/40 dark:border-paper-border rounded-sm shadow-2xl overflow-hidden font-mono-editorial text-graphite dark:text-paper-ivory select-none cursor-pointer group"
    >
      {/* Matte Adhesive Tape Strips on Top Corners */}
      <div className="absolute -top-3 left-8 w-16 h-6 bg-white/40 dark:bg-white/10 backdrop-blur-xs border border-black/10 rotate-[-6deg] shadow-sm pointer-events-none z-30" />
      <div className="absolute -top-3 right-8 w-16 h-6 bg-white/40 dark:bg-white/10 backdrop-blur-xs border border-black/10 rotate-[8deg] shadow-sm pointer-events-none z-30" />

      {/* Red Press Ink Cancellation Stamp */}
      <div className="absolute top-8 right-6 w-28 h-28 rounded-full border-2 border-dashed border-red-800/60 dark:border-accent-champagne/60 flex flex-col items-center justify-center rotate-[-14deg] text-[9px] text-red-900/80 dark:text-accent-champagne/80 font-bold uppercase tracking-widest pointer-events-none p-1 group-hover:rotate-0 transition-transform duration-500 z-20">
        <Stamp className="w-4 h-4 mb-0.5" />
        <span>{currentPress.stampText}</span>
        <span className="text-[7px] text-graphite/60 dark:text-paper-ivory/60">2026 EDITION</span>
      </div>

      {/* Newspaper Top Masthead Bar */}
      <div className="border-b-2 border-graphite dark:border-paper-border pb-3 mb-6 flex justify-between items-baseline text-[10px] text-editorial-grey">
        <div className="flex items-center gap-2">
          <Newspaper className="w-3.5 h-3.5 text-accent-champagne" />
          <span className="font-bold tracking-widest text-graphite dark:text-paper-ivory uppercase">
            {currentPress.publication}
          </span>
        </div>
        <span>{currentPress.date}</span>
      </div>

      {/* Main Newspaper Headline */}
      <div className="space-y-3 mb-6">
        <span className="text-[9px] tracking-widest text-accent-champagne font-bold block uppercase">
          {currentPress.editionNo}
        </span>
        <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase leading-snug tracking-tight text-graphite dark:text-paper-ivory group-hover:text-accent-champagne transition-colors">
          {currentPress.headline}
        </h3>
      </div>

      {/* News Article Snippet & Animated Yellow Highlighter Quote */}
      <div className="space-y-4 font-editorial-serif text-base leading-relaxed text-graphite/90 dark:text-paper-ivory/90 mb-6">
        <p className="font-sans-editorial text-xs leading-relaxed">
          {currentPress.excerpt}
        </p>

        {/* Animated Yellow Highlighter Marker Box */}
        <div className="relative p-3 bg-yellow-200/40 dark:bg-yellow-900/30 border-l-4 border-accent-champagne rounded-xs">
          <p className="italic text-sm font-semibold text-graphite dark:text-paper-ivory">
            "{currentPress.quote}"
          </p>
        </div>
      </div>

      {/* Metric Badge Pill */}
      <div className="pt-4 border-t border-graphite/20 dark:border-paper-border flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-champagne animate-ping" />
          <span className="font-bold text-graphite dark:text-paper-ivory text-[11px]">
            {project.metricLabel}: <strong className="text-accent-champagne">{project.metricValue}</strong>
          </span>
        </div>

        <span className="text-[10px] text-editorial-grey uppercase font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
          <span>READ PRESS ARTICLE</span>
          <ExternalLink className="w-3 h-3 text-accent-champagne" />
        </span>
      </div>
    </motion.div>
  );
}
