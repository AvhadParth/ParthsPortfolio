import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Printer, Stamp, CheckCircle2 } from 'lucide-react';

export function PressroomLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [printStage, setPrintStage] = useState('TYPESETTING EDITORIAL HEADLINES...');

  useEffect(() => {
    // Smooth progress counter simulation over ~3.5 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 300);
          return 100;
        }
        const next = prev + 1;
        if (next >= 22 && next < 45) setPrintStage('STAMPING RECRUITER EXECUTIVE DOSSIER...');
        else if (next >= 45 && next < 70) setPrintStage('COMPOSING WIRED & MONOCLE PRESS CLIPPINGS...');
        else if (next >= 70 && next < 92) setPrintStage('CALIBRATING DATA SCIENCE & SECURITY TELEMETRY...');
        else if (next >= 92) setPrintStage('EDITION PRINTED, BOUND & DELIVERED.');
        return next;
      });
    }, 35); // 100 steps * 35ms = 3,500ms

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
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
        <div className="w-full h-3 bg-gradient-to-r from-stone-800 via-stone-500 to-stone-800 rounded-full border border-white/20 shadow-xl relative z-20 flex justify-center items-center overflow-hidden">
          <motion.div 
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
            className="w-1/3 h-full bg-accent-champagne/70 rounded-full blur-[2px]" 
          />
        </div>

        {/* Paper Sheet Emerging Downwards from Press Roller Slit */}
        <motion.div 
          initial={{ y: -80, opacity: 0, scaleY: 0.2 }}
          animate={{ y: 0, opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full bg-[#F6F2E8] border-2 border-stone-400 rounded-sm p-6 sm:p-8 text-stone-900 shadow-2xl space-y-5 origin-top"
        >
          {/* Red Ink Cancellation Stamp Seal on Emerging Paper */}
          <div className="absolute top-4 right-4 w-18 h-18 rounded-full border-2 border-dashed border-red-800/70 bg-red-950/5 flex flex-col items-center justify-center text-[7px] text-red-900 font-bold rotate-[-12deg] uppercase pointer-events-none p-1 shadow-xs">
            <Stamp className="w-3.5 h-3.5 text-red-800 mb-0.5" />
            <span>DAILY PRESS</span>
            <span className="text-[6px] text-red-700">APPROVED</span>
          </div>

          <div className="border-b-2 border-stone-800 pb-3 pr-20">
            <span className="text-[10px] text-amber-800 font-bold tracking-widest block uppercase">
              PRINTING TODAY'S EDITION
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-stone-900 uppercase tracking-tight">
              PARTH AVHAD
            </h1>
          </div>

          {/* Ink Lines Stamped Animation */}
          <div className="space-y-2.5 text-xs font-mono-editorial text-stone-800">
            <div className="flex justify-between border-b border-stone-300 pb-1.5">
              <span className="font-bold text-stone-900">CREATIVE ENGINEER & DATA ANALYST</span>
              <span className="text-amber-900 font-bold">2026 EDITION</span>
            </div>
            <p className="font-editorial-serif text-sm italic text-stone-700 leading-relaxed">
              "Bridging Natural Language Processing, ML Classifiers, and MERN Security Architecture."
            </p>
          </div>

          {/* Progress Bar & Stage Indicator inside Emerging Sheet */}
          <div className="pt-4 border-t border-stone-400 space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-stone-800 uppercase tracking-wider">
              <span className="transition-all duration-300">{printStage}</span>
              <span className="text-amber-900 font-mono-editorial">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-stone-300 rounded-full overflow-hidden border border-stone-400">
              <motion.div 
                className="h-full bg-amber-800 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Pressroom Metadata */}
      <div className="flex justify-between items-center text-[10px] text-editorial-grey border-t border-white/10 pt-4">
        <span>TYPESET IN BODONI MODA & INTER</span>
        <span className="flex items-center gap-1.5 text-accent-champagne font-bold">
          <CheckCircle2 className="w-3.5 h-3.5 text-accent-champagne" />
          <span>PRESS RUN READY</span>
        </span>
      </div>
    </motion.div>
  );
}
