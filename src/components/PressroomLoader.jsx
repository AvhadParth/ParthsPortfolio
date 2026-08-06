import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Stamp, Sparkles, CheckCircle2 } from 'lucide-react';

export function PressroomLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [printStage, setPrintStage] = useState('TYPESETTING HEADLINES...');

  useEffect(() => {
    // Progress counter simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 400);
          return 100;
        }
        const next = prev + 4;
        if (next > 25 && next < 50) setPrintStage('STAMPING RECRUITER EXECUTIVE DOSSIER...');
        else if (next >= 50 && next < 80) setPrintStage('COMPOSING WIRED & MONOCLE PRESS CLIPPINGS...');
        else if (next >= 80) setPrintStage('EDITION PRINTED & BOUND.');
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] bg-[#0C0C0C] text-paper-ivory flex flex-col justify-between p-6 sm:p-12 font-mono-editorial select-none overflow-hidden"
    >
      {/* Top Pressroom Status Header */}
      <div className="flex justify-between items-center text-xs text-editorial-grey border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Printer className="w-4 h-4 text-accent-champagne animate-pulse" />
          <span className="font-bold tracking-widest text-paper-ivory uppercase">
            PARTH AVHAD • DAILY PRESSROOM
          </span>
        </div>
        <span className="text-accent-champagne font-bold tracking-widest hidden sm:inline">
          MUMBAI, INDIA • ISSUE 001
        </span>
      </div>

      {/* Center Printing Press Machinery Animation Area */}
      <div className="relative max-w-xl mx-auto w-full flex flex-col items-center justify-center my-auto space-y-6">
        {/* Mechanical Press Roller Slot */}
        <div className="w-full h-3 bg-gradient-to-r from-stone-800 via-stone-600 to-stone-800 rounded-full border border-white/20 shadow-lg relative z-20 flex justify-center items-center">
          <div className="w-1/3 h-1 bg-accent-champagne/80 rounded-full animate-pulse" />
        </div>

        {/* Paper Sheet Emerging Downwards from Press Roller Slit */}
        <motion.div 
          initial={{ y: -60, opacity: 0.2, scaleY: 0.3 }}
          animate={{ y: 0, opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-full bg-[#F6F2E8] border-2 border-stone-400 rounded-sm p-6 sm:p-8 text-stone-900 shadow-2xl space-y-4 origin-top"
        >
          {/* Stamp Seal on Emerging Paper */}
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-2 border-dashed border-red-800/70 bg-red-950/5 flex flex-col items-center justify-center text-[7px] text-red-900 font-bold rotate-[-12deg] uppercase pointer-events-none">
            <Stamp className="w-3 h-3 text-red-800 mb-0.5" />
            <span>DAILY PRESS</span>
          </div>

          <div className="border-b-2 border-stone-800 pb-3">
            <span className="text-[10px] text-amber-800 font-bold tracking-widest block uppercase">
              PRINTING TODAY'S EDITION
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-stone-900 uppercase">
              PARTH AVHAD
            </h1>
          </div>

          {/* Ink Lines Appearing Animation */}
          <div className="space-y-2 text-xs font-mono-editorial text-stone-800">
            <div className="flex justify-between border-b border-stone-300 pb-1">
              <span className="font-bold">CREATIVE ENGINEER & DATA ANALYST</span>
              <span className="text-amber-900 font-bold">2026 EDITION</span>
            </div>
            <p className="font-editorial-serif text-sm italic text-stone-700">
              "Bridging Natural Language Processing, ML Classifiers, and MERN Security Architecture."
            </p>
          </div>

          {/* Progress Bar & Stage Indicator inside Emerging Sheet */}
          <div className="pt-4 border-t border-stone-400 space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-stone-800 uppercase tracking-wider">
              <span>{printStage}</span>
              <span className="text-amber-900">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-stone-300 rounded-full overflow-hidden border border-stone-400">
              <motion.div 
                className="h-full bg-amber-800 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Pressroom Metadata */}
      <div className="flex justify-between items-center text-[10px] text-editorial-grey border-t border-white/10 pt-4">
        <span>TYPESET IN BODONI MODA & INTER</span>
        <span className="flex items-center gap-1.5 text-accent-champagne font-bold">
          <CheckCircle2 className="w-3 h-3 text-accent-champagne" />
          <span>PRESS RUN READY</span>
        </span>
      </div>
    </motion.div>
  );
}
