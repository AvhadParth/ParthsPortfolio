import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { magazineIssueData } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';
import { ArrowDown, Sparkles } from 'lucide-react';

export function CoverSpread({ onExploreClick }) {
  const [scanned, setScanned] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  // Scroll parallax transforms
  const mastheadY = useTransform(scrollY, [0, 500], [0, 80]);
  const bgTextX = useTransform(scrollY, [0, 800], [0, -200]);
  const imageScale = useTransform(scrollY, [0, 500], [1, 1.05]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleBarcodeClick = () => {
    soundEngine.playStamp();
    setScanned(!scanned);
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-[95vh] flex flex-col justify-between p-4 sm:p-8 lg:p-12 border-b border-paper-border overflow-hidden select-none"
    >
      {/* Scroll Parallax Watermark Text Layer */}
      <motion.div 
        style={{ x: bgTextX }}
        className="absolute top-1/3 left-0 whitespace-nowrap opacity-[0.03] dark:opacity-[0.05] font-display text-[22vw] font-black uppercase pointer-events-none z-0"
      >
        PARTH AVHAD • CREATIVE ENGINEER
      </motion.div>

      {/* Top Editorial Metadata Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-wrap items-baseline justify-between font-mono-editorial text-xs tracking-widest text-editorial-grey border-b border-paper-border pb-4 gap-2"
      >
        <div className="flex items-center gap-6">
          <span className="font-bold text-graphite dark:text-paper-ivory">{magazineIssueData.issueNumber}</span>
          <span>{magazineIssueData.volume}</span>
          <span>{magazineIssueData.date}</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-accent-champagne font-bold">
            <Sparkles className="w-3 h-3 animate-spin" />
            <span>SPECIAL EDITION: THE CREATIVE ENGINEER</span>
          </span>
        </div>
      </motion.div>

      {/* Main Masthead Typography: PARTH AVHAD */}
      <motion.div 
        style={{ y: mastheadY }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="my-6 lg:my-10 text-center relative z-10"
      >
        <h1 className="font-display text-[13vw] sm:text-[14vw] leading-none tracking-tighter uppercase font-extrabold text-graphite dark:text-paper-ivory transition-transform duration-700 hover:scale-[1.01]">
          PARTH AVHAD
        </h1>
        <p className="font-mono-editorial text-xs sm:text-sm tracking-[0.35em] uppercase text-editorial-grey mt-3">
          CREATIVE ENGINEERING • CYBERSECURITY • DATA SCIENCE
        </p>
      </motion.div>

      {/* Hero Visual & Feature Story Spread Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end my-4 relative z-10">
        {/* Left Side: Story Teasers */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-3 space-y-6 order-2 lg:order-1 font-mono-editorial text-xs"
        >
          <div className="border-l-2 border-accent-champagne pl-4 py-1 space-y-2">
            <span className="text-accent-champagne font-bold block uppercase tracking-widest text-[10px]">
              COVER FEATURE
            </span>
            <h3 className="font-display text-2xl text-graphite dark:text-paper-ivory leading-tight font-bold">
              THE CREATIVE ENGINEER
            </h3>
            <p className="text-editorial-grey leading-relaxed text-[11px]">
              Bridging NLP credibility engines, 94%-accurate ML classifiers, and MERN security layers.
            </p>
          </div>

          <div className="pt-4 border-t border-paper-border text-editorial-grey space-y-1">
            <p><strong className="text-graphite dark:text-paper-ivory">EDITOR:</strong> {magazineIssueData.editor}</p>
            <p><strong className="text-graphite dark:text-paper-ivory">LOCATION:</strong> {magazineIssueData.location}</p>
            <p><strong className="text-graphite dark:text-paper-ivory">STATUS:</strong> AVAILABLE FOR INQUIRIES</p>
          </div>
        </motion.div>

        {/* Center: Interactive 3D Parallax Magazine Cover Visual */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="lg:col-span-6 order-1 lg:order-2 flex justify-center"
        >
          <div 
            className="relative group max-w-md w-full transition-transform duration-300 ease-out"
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg)`
            }}
          >
            <motion.div 
              style={{ scale: imageScale }}
              className="relative overflow-hidden rounded-sm border border-paper-border editorial-shadow bg-paper-ivory-warm"
            >
              <img 
                src="/images/parth_studio_portrait.png" 
                alt="Parth Avhad Cover Feature" 
                className="w-full h-[450px] sm:h-[520px] object-cover object-[center_65%] filter contrast-[1.05] grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white font-mono-editorial text-[10px] flex justify-between items-end">
                <div>
                  <p className="font-bold tracking-wider text-accent-champagne">FIG. 001 — PARTH AVHAD</p>
                  <p className="opacity-80">SHAH & ANCHOR KUTCHHI ENG. COLLEGE</p>
                </div>
                <span className="text-accent-champagne font-bold">VOL 01 / 2026</span>
              </div>
            </motion.div>

            {/* Spinning Circular Editorial Stamp */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border border-graphite/40 dark:border-paper-ivory/40 flex items-center justify-center bg-paper-ivory/80 dark:bg-paper-ivory-dark/80 backdrop-blur-xs animate-[spin_20s_linear_infinite] shadow-lg pointer-events-none">
              <svg className="w-full h-full p-1" viewBox="0 0 100 100">
                <path id="circlePath" fill="none" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                <text className="text-[9.5px] font-mono-editorial fill-graphite dark:fill-paper-ivory uppercase tracking-widest">
                  <textPath href="#circlePath">PARTH AVHAD • ISSUE 001 • CREATIVE ENGINEER • </textPath>
                </text>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Magazine Barcode & Scroll Cue */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-3 space-y-6 order-3 flex flex-col justify-between items-end font-mono-editorial text-xs text-right"
        >
          <div className="space-y-1">
            <span className="text-editorial-grey block text-[10px]">ISSUE CATALOG ID:</span>
            <span className="text-graphite dark:text-paper-ivory font-bold block text-sm">ISBN 978-0-2026-PA</span>
          </div>

          {/* Interactive Barcode */}
          <div 
            onClick={handleBarcodeClick}
            onMouseEnter={() => soundEngine.playHoverClick()}
            className="cursor-pointer group p-3 border border-paper-border bg-paper-ivory-warm rounded-sm hover:border-accent-champagne transition-all text-center w-full max-w-[200px]"
          >
            <div className="flex justify-between items-baseline mb-1 text-[9px] text-editorial-grey">
              <span>{scanned ? 'VERIFIED' : 'TAP TO SCAN'}</span>
              <span>2026-08</span>
            </div>
            <div className="h-12 bg-graphite dark:bg-paper-ivory flex items-center justify-around px-1 relative overflow-hidden">
              <div className="scan-line absolute inset-x-0 h-0.5 bg-accent-champagne opacity-90"></div>
              {[4, 2, 6, 1, 5, 3, 2, 7, 1, 4, 3, 6, 2, 5, 1, 4].map((width, i) => (
                <div 
                  key={i} 
                  className="bg-paper-ivory dark:bg-graphite h-full"
                  style={{ width: `${width}px` }}
                />
              ))}
            </div>
            <span className="text-[10px] text-graphite dark:text-paper-ivory font-bold tracking-widest mt-1 block">
              {scanned ? 'PARTH AVHAD × PORTFOLIO' : '8433591056'}
            </span>
          </div>

          {/* Page Turn / Scroll Prompt */}
          <button 
            onClick={onExploreClick}
            onMouseEnter={() => soundEngine.playHoverClick()}
            className="flex items-center gap-2 text-graphite dark:text-paper-ivory hover:text-accent-champagne transition-colors group cursor-pointer font-bold"
          >
            <span className="tracking-widest">TURN TO PAGE 04</span>
            <ArrowDown className="w-4 h-4 transform group-hover:translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
