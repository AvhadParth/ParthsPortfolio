import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { magazineIssueData } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';
import { Terminal, Code, Cpu, Database, Palette, CheckCircle2, Sparkles } from 'lucide-react';

export function SkillsCatalog() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const { languages = [], frameworks = [], devTools = [], designTools = [], designingTools = [], dataLibraries = [] } = magazineIssueData.skillsCatalog || {};
  const activeDesignTools = designTools.length ? designTools : designingTools;

  const categories = [
    { id: 'languages', title: "PROGRAMMING LANGUAGES", icon: Code, items: languages, spec: "SPEC 01" },
    { id: 'frameworks', title: "FRAMEWORKS & RUNTIMES", icon: Cpu, items: frameworks, spec: "SPEC 02" },
    { id: 'devTools', title: "DEV INFRASTRUCTURE & TOOLS", icon: Terminal, items: devTools, spec: "SPEC 03" },
    { id: 'design', title: "DESIGN & USER EXPERIENCE", icon: Palette, items: activeDesignTools, spec: "SPEC 04" },
    { id: 'data', title: "DATA SCIENCE & ANALYTICS", icon: Database, items: dataLibraries, spec: "SPEC 05" },
  ];

  const currentCategory = categories[activeCategoryIndex];
  const Icon = currentCategory.icon;

  return (
    <section id="chapter-05" className="py-20 px-4 sm:px-8 lg:px-12 border-b border-paper-border bg-paper-ivory dark:bg-paper-ivory-dark relative overflow-hidden select-none">
      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] dark:opacity-[0.04] font-display text-[25vw] font-black pointer-events-none">
        CATALOG
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Editorial Top Bar */}
        <div className="flex justify-between items-center font-mono-editorial text-xs text-editorial-grey border-b border-paper-border pb-4 mb-10">
          <span className="flex items-center gap-1.5 text-accent-champagne font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CHAPTER 05 / CURATED CATALOG</span>
          </span>
          <span>PAGE 32 – 37</span>
          <span className="font-bold text-graphite dark:text-paper-ivory">PARTH AVHAD</span>
        </div>

        {/* Section Header */}
        <div className="mb-10 text-center">
          <span className="font-mono-editorial text-xs tracking-widest text-accent-champagne block mb-2 font-bold uppercase">
            INVENTORY & SPECIMEN SHEET
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-graphite dark:text-paper-ivory">
            ENGINEERING ARSENAL
          </h2>
        </div>

        {/* Interactive Specimen Category Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 font-mono-editorial text-xs">
          {categories.map((cat, idx) => {
            const CatIcon = cat.icon;
            const isActive = idx === activeCategoryIndex;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundEngine.playPaperTurn();
                  setActiveCategoryIndex(idx);
                }}
                onMouseEnter={() => soundEngine.playHoverClick()}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xs border transition-all cursor-pointer font-bold ${
                  isActive
                    ? 'bg-graphite text-paper-ivory dark:bg-paper-ivory dark:text-graphite border-transparent shadow-lg scale-105'
                    : 'border-paper-border text-editorial-grey hover:border-graphite dark:hover:border-paper-ivory'
                }`}
              >
                <CatIcon className={`w-3.5 h-3.5 ${isActive ? 'text-accent-champagne' : ''}`} />
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Specimen Sheet Display with Fade Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-8 border border-paper-border bg-paper-ivory-warm dark:bg-paper-card rounded-sm editorial-shadow"
          >
            <div className="flex justify-between items-center border-b border-paper-border pb-4 mb-6">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-accent-champagne" />
                <h3 className="font-display text-2xl font-bold text-graphite dark:text-paper-ivory">
                  {currentCategory.title}
                </h3>
              </div>
              <span className="font-mono-editorial text-xs text-accent-champagne font-bold px-2 py-1 border border-accent-champagne/30 rounded-xs">
                {currentCategory.spec} / VERIFIED PROFICIENCY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono-editorial text-xs">
              {(currentCategory.items || []).map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  onMouseEnter={() => soundEngine.playHoverClick()}
                  className="p-4 border border-paper-border/70 bg-paper-ivory dark:bg-paper-ivory-dark rounded-xs flex items-center justify-between group hover:border-accent-champagne transition-all cursor-pointer shadow-xs"
                >
                  <span className="font-bold text-graphite dark:text-paper-ivory group-hover:text-accent-champagne transition-colors">
                    {item}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-accent-champagne opacity-70 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>

            <div className="mt-8 border-t border-paper-border/60 pt-4 flex justify-between items-center text-[10px] font-mono-editorial text-editorial-grey">
              <span>SPECIMEN CATALOGUE • PARTH AVHAD</span>
              <span className="text-accent-champagne font-bold">100% PRODUCTION TESTED</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
