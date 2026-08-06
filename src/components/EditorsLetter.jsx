import React from 'react';
import { motion } from 'framer-motion';
import { magazineIssueData } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';
import { Quote, Sparkles } from 'lucide-react';

export function EditorsLetter() {
  const { headline, subhead, bodyParagraphs, signature, role } = magazineIssueData.editorsLetter;

  return (
    <section id="chapter-01" className="py-12 px-4 sm:px-8 lg:px-12 border-b border-paper-border bg-paper-ivory dark:bg-paper-ivory-dark relative overflow-hidden select-none">
      {/* Background Watermark */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-[0.02] dark:opacity-[0.04] font-display text-[18vw] font-black uppercase pointer-events-none">
        LETTER
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Page Header Metadata */}
        <div className="flex justify-between items-center font-mono-editorial text-xs text-editorial-grey border-b border-paper-border pb-3 mb-8">
          <span className="flex items-center gap-1.5 text-accent-champagne font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CHAPTER 01 / EDITOR'S NOTE</span>
          </span>
          <span>PAGE 04</span>
          <span className="font-bold text-graphite dark:text-paper-ivory">PARTH AVHAD</span>
        </div>

        {/* Compact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline & Subhead */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-mono-editorial text-[10px] tracking-widest text-accent-champagne font-bold uppercase block">
              FROM THE DESK OF THE CREATIVE ENGINEER
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase leading-tight text-graphite dark:text-paper-ivory">
              {headline}
            </h2>
            <p className="font-editorial-serif italic text-base text-editorial-grey border-l-2 border-accent-champagne pl-3">
              "{subhead}"
            </p>
          </div>

          {/* Right Column: Concise Note & Interactive Monogram Stamp */}
          <div className="lg:col-span-7 space-y-4">
            <p className="drop-cap font-sans-editorial text-sm sm:text-base leading-relaxed text-graphite/90 dark:text-paper-ivory/90">
              {bodyParagraphs[0]}
            </p>

            {/* Signature Block with Interactive Rotating PA Monogram Stamp */}
            <div className="pt-4 border-t border-paper-border flex justify-between items-center">
              <div>
                <span className="font-display text-xl font-bold text-graphite dark:text-paper-ivory block">
                  {signature}
                </span>
                <span className="font-mono-editorial text-[10px] text-editorial-grey uppercase font-bold">
                  {role} • MUMBAI, INDIA
                </span>
              </div>

              {/* Rotating PA Monogram Seal */}
              <motion.div 
                whileHover={{ rotate: 180, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                onMouseEnter={() => soundEngine.playStamp()}
                className="w-14 h-14 rounded-full border-2 border-graphite dark:border-paper-ivory flex items-center justify-center font-display text-base font-bold text-accent-champagne shadow-lg cursor-pointer bg-paper-ivory-warm dark:bg-paper-card hover:border-accent-champagne hover:shadow-accent-champagne/20 transition-all group"
                title="Interactive Editor's Monogram Seal (Hover to Rotate)"
              >
                <span className="group-hover:scale-110 transition-transform">PA</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
