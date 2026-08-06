import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { magazineIssueData } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';
import { ArrowUpRight, BookOpen } from 'lucide-react';

export function TableOfContents({ onSelectChapter }) {
  const [hoveredChapter, setHoveredChapter] = useState(null);

  const chapterPreviews = {
    "01": { quote: "On Code as an Expressive Medium", tag: "ESSAY & VISION" },
    "02": { quote: "FactMatrix, PhishGuard & SecureNext", tag: "3 FEATURE ARTICLES" },
    "03": { quote: "Languages, Frameworks & Infra", tag: "SPECIMEN SHEET" },
    "04": { quote: "MuSo (JSW), DigiFalx & Hatmedia", tag: "FIELD CHRONICLES" },
    "05": { quote: "Direct Inquiry Line & Colophon", tag: "CORRESPONDENCE" }
  };

  return (
    <section id="contents" className="min-h-screen py-20 px-4 sm:px-8 lg:px-12 border-b border-paper-border relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-[0.02] dark:opacity-[0.04] font-display text-[30vw] font-black pointer-events-none select-none">
        INDEX
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-paper-border pb-6"
        >
          <div>
            <span className="font-mono-editorial text-xs tracking-widest text-accent-champagne block mb-2 font-bold flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>CHAPTER INDEX / TABLE OF CONTENTS</span>
            </span>
            <h2 className="font-display text-5xl sm:text-7xl font-extrabold uppercase tracking-tight text-graphite dark:text-paper-ivory">
              CONTENTS
            </h2>
          </div>
          <p className="font-mono-editorial text-xs text-editorial-grey max-w-sm mt-4 md:mt-0 leading-relaxed">
            PARTH AVHAD — ISSUE 001 COMPRISES FIVE EDITORIAL SPREADS COVERING MACHINE LEARNING, DEFENSIVE ARCHITECTURE, AND DATA ANALYTICS.
          </p>
        </motion.div>

        {/* Contents Grid with Interactive Preview Drawer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {magazineIssueData.toc.map((item, idx) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              onClick={() => {
                soundEngine.playPaperTurn();
                onSelectChapter(item.number);
              }}
              onMouseEnter={() => {
                soundEngine.playHoverClick();
                setHoveredChapter(item.number);
              }}
              onMouseLeave={() => setHoveredChapter(null)}
              className="group p-8 border border-paper-border bg-paper-ivory-warm dark:bg-paper-card rounded-sm cursor-pointer editorial-shadow hover:border-accent-champagne transition-all duration-500 flex flex-col justify-between h-[240px] relative overflow-hidden"
            >
              {/* Animated Corner Fold Effect */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-paper-border/30 transform rotate-45 translate-x-4 -translate-y-4 group-hover:bg-accent-champagne transition-colors duration-300"></div>

              <div className="flex justify-between items-start z-10">
                <span className="font-display text-5xl font-black text-graphite/30 dark:text-paper-ivory/30 group-hover:text-accent-champagne group-hover:scale-110 transition-all duration-300">
                  {item.number}
                </span>
                <span className="font-mono-editorial text-xs text-editorial-grey font-bold px-2 py-0.5 border border-paper-border rounded-xs group-hover:border-graphite dark:group-hover:border-paper-ivory transition-colors">
                  PG. {item.page}
                </span>
              </div>

              <div className="z-10">
                <span className="font-mono-editorial text-[10px] tracking-widest text-editorial-grey uppercase block mb-1 font-bold group-hover:text-accent-champagne transition-colors">
                  {item.label}
                </span>
                <h3 className="font-display text-2xl font-extrabold text-graphite dark:text-paper-ivory group-hover:translate-x-1.5 transition-transform duration-300">
                  {item.title}
                </h3>
              </div>

              {/* Hover Preview Teaser */}
              <AnimatePresence>
                {hoveredChapter === item.number && chapterPreviews[item.number] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute inset-x-0 bottom-0 bg-graphite text-paper-ivory dark:bg-paper-ivory dark:text-graphite p-4 font-mono-editorial text-[10px] space-y-1 z-20"
                  >
                    <span className="text-accent-champagne font-bold block">{chapterPreviews[item.number].tag}</span>
                    <p className="font-serif italic text-xs leading-tight opacity-90">"{chapterPreviews[item.number].quote}"</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between border-t border-paper-border/60 pt-4 mt-2 z-10">
                <span className="font-mono-editorial text-[10px] text-editorial-grey uppercase font-bold tracking-wider">
                  OPEN SPREAD
                </span>
                <ArrowUpRight className="w-4 h-4 text-editorial-grey group-hover:text-accent-champagne group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
