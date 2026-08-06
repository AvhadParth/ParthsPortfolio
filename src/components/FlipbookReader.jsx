import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { magazineIssueData } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';
import { ChevronLeft, ChevronRight, BookOpen, Layers, ExternalLink, Sparkles } from 'lucide-react';
import { GithubIcon } from './Icons';

export function FlipbookReader({ onSwitchToScroll }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev

  const spreads = [
    { type: 'cover', title: 'COVER SPREAD', subtitle: 'ISSUE 001 / AUGUST 2026' },
    { type: 'toc', title: 'TABLE OF CONTENTS', subtitle: 'CHAPTER INDEX' },
    { type: 'editorsLetter', title: "EDITOR'S NOTE", subtitle: 'BY PARTH AVHAD' },
    { type: 'chronicles', title: 'CHRONICLES', subtitle: 'CHAPTER 02 • FIELD NOTES & EXPERIENCE' },
    { type: 'project', projectIndex: 0, title: 'FACTMATRIX', subtitle: 'ARTICLE 01' },
    { type: 'project', projectIndex: 1, title: 'PHISHGUARD', subtitle: 'ARTICLE 02' },
    { type: 'project', projectIndex: 2, title: 'SECURENEXT', subtitle: 'ARTICLE 03' },
    { type: 'skills', title: 'CURATED CATALOG', subtitle: 'ENGINEERING ARSENAL' },
    { type: 'colophon', title: 'COLOPHON & CORRESPONDENCE', subtitle: 'BACK COVER' }
  ];

  // Keyboard navigation arrow keys listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < spreads.length - 1) {
      soundEngine.playPaperTurn();
      setDirection(1);
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      soundEngine.playPaperTurn();
      setDirection(-1);
      setCurrentPage(prev => prev - 1);
    }
  };

  const activeSpread = spreads[currentPage];

  return (
    <div className="min-h-[90vh] flex flex-col justify-between p-4 sm:p-8 bg-paper-ivory dark:bg-paper-ivory-dark select-none relative overflow-hidden">
      {/* Top Controller Bar */}
      <div className="flex justify-between items-center font-mono-editorial text-xs border-b border-paper-border pb-4 z-10">
        <div className="flex items-center gap-4 text-editorial-grey">
          <BookOpen className="w-4 h-4 text-accent-champagne animate-pulse" />
          <span className="font-bold text-graphite dark:text-paper-ivory">3D PHYSICAL HARDCOVER BOOK READER</span>
          <span className="hidden md:inline text-[10px] text-editorial-grey">(USE LEFT / RIGHT ARROW KEYS TO TURN PAGES)</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-editorial-grey font-bold">SPREAD 0{currentPage + 1} OF 0{spreads.length}</span>
          <button 
            onClick={onSwitchToScroll}
            onMouseEnter={() => soundEngine.playHoverClick()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-graphite text-paper-ivory dark:bg-paper-ivory dark:text-graphite rounded-xs hover:bg-accent-champagne hover:text-graphite transition-all cursor-pointer shadow-md font-bold"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>RETURN TO SPREAD SCROLL</span>
          </button>
        </div>
      </div>

      {/* 3D Physical Magazine Spread Book Container */}
      <div className="my-6 max-w-7xl mx-auto w-full perspective-1000 z-10 flex justify-center items-center">
        {/* Book Outer Page Stack Layering */}
        <div className="relative w-full max-w-5xl bg-[#EBE7DD] dark:bg-[#151515] p-2 sm:p-4 rounded-sm shadow-2xl border border-paper-border">
          {/* Inner Book Spread Surface */}
          <div className="relative bg-paper-ivory-warm dark:bg-paper-card border border-paper-border rounded-xs min-h-[540px] grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-inner">
            {/* Center Book Spine Crease & Shadow */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/15 via-black/5 to-black/15 dark:from-black/50 dark:via-black/20 dark:to-black/50 pointer-events-none z-30 hidden md:block"></div>
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-graphite/30 dark:bg-paper-ivory/20 pointer-events-none z-30 hidden md:block"></div>

            {/* Page Animation Wrapper */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, rotateY: direction > 0 ? 12 : -12, scale: 0.98 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: direction > 0 ? -12 : 12, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="col-span-2 grid grid-cols-1 md:grid-cols-2 w-full h-full p-6 sm:p-10 gap-8 items-center"
              >
                {/* SPREAD TYPE: COVER */}
                {activeSpread.type === 'cover' && (
                  <>
                    <div className="flex justify-center border-r border-paper-border/60 pr-0 md:pr-8">
                      <img 
                        src="/images/parth_studio_portrait.png" 
                        alt="Parth Avhad Portrait"
                        className="w-full max-w-sm h-[380px] object-cover object-[center_65%] rounded-xs border border-paper-border editorial-shadow grayscale"
                      />
                    </div>
                    <div className="space-y-6 text-left pl-0 md:pl-4">
                      <span className="font-mono-editorial text-xs text-accent-champagne font-bold block">
                        ISSUE 001 / AUGUST 2026
                      </span>
                      <h1 className="font-display text-5xl font-black text-graphite dark:text-paper-ivory leading-tight">
                        PARTH AVHAD
                      </h1>
                      <p className="font-editorial-serif text-xl italic text-editorial-grey">
                        "The Creative Engineering & Defensive Architecture Portfolio."
                      </p>
                      <p className="font-mono-editorial text-xs text-editorial-grey leading-relaxed">
                        BRIDGING NATURAL LANGUAGE PROCESSING, ML CLASSIFIERS, AND MERN SECURITY ARCHITECTURE.
                      </p>
                    </div>
                  </>
                )}

                {/* SPREAD TYPE: TOC */}
                {activeSpread.type === 'toc' && (
                  <>
                    <div className="space-y-4 border-r border-paper-border/60 pr-0 md:pr-8 text-left font-mono-editorial">
                      <span className="text-xs text-accent-champagne font-bold block">CHAPTER INDEX</span>
                      <h2 className="font-display text-4xl font-extrabold text-graphite dark:text-paper-ivory">CONTENTS</h2>
                      <p className="text-xs text-editorial-grey leading-relaxed">
                        SELECT ANY CHAPTER TO JUMP DIRECTLY TO THE EDITORIAL SPREAD.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 font-mono-editorial text-xs text-left pl-0 md:pl-4">
                      {magazineIssueData.toc.map((item, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            soundEngine.playPaperTurn();
                            setDirection(idx + 1 > currentPage ? 1 : -1);
                            setCurrentPage(idx + 1);
                          }}
                          className="p-3 border border-paper-border bg-paper-ivory dark:bg-paper-ivory-dark rounded-xs hover:border-accent-champagne cursor-pointer flex justify-between items-center group transition-colors"
                        >
                          <span className="text-accent-champagne font-bold">{item.number}</span>
                          <span className="font-bold text-graphite dark:text-paper-ivory group-hover:text-accent-champagne">{item.title}</span>
                          <span className="text-[10px] text-editorial-grey">PG. {item.page}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* SPREAD TYPE: EDITOR'S LETTER */}
                {activeSpread.type === 'editorsLetter' && (
                  <>
                    <div className="space-y-4 border-r border-paper-border/60 pr-0 md:pr-8 text-left font-mono-editorial">
                      <span className="text-xs text-accent-champagne font-bold block">CHAPTER 01</span>
                      <h2 className="font-display text-4xl font-extrabold text-graphite dark:text-paper-ivory">EDITOR'S LETTER</h2>
                      <p className="font-editorial-serif text-lg italic text-editorial-grey">
                        "{magazineIssueData.editorsLetter.subhead}"
                      </p>
                    </div>
                    <div className="space-y-4 text-left font-sans-editorial text-sm leading-relaxed text-graphite/90 dark:text-paper-ivory/90 pl-0 md:pl-4">
                      {magazineIssueData.editorsLetter.bodyParagraphs.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                      <div className="pt-4 border-t border-paper-border font-mono-editorial text-xs">
                        <span className="font-display text-xl font-bold block text-graphite dark:text-paper-ivory">Parth Avhad</span>
                        <span className="text-editorial-grey text-[10px]">CREATIVE ENGINEER • MUMBAI</span>
                      </div>
                    </div>
                  </>
                )}

                {/* SPREAD TYPE: PROJECTS */}
                {activeSpread.type === 'project' && (
                  <>
                    <div className="space-y-4 border-r border-paper-border/60 pr-0 md:pr-8 text-left font-mono-editorial">
                      <span className="text-xs text-accent-champagne font-bold block">FEATURE ARTICLE 0{activeSpread.projectIndex + 1}</span>
                      <h2 className="font-display text-4xl font-extrabold text-graphite dark:text-paper-ivory">
                        {magazineIssueData.projects[activeSpread.projectIndex].title}
                      </h2>
                      <p className="font-editorial-serif text-base italic text-editorial-grey">
                        "{magazineIssueData.projects[activeSpread.projectIndex].subtitle}"
                      </p>
                      <div className="p-3 bg-graphite text-paper-ivory rounded-xs text-xs font-bold text-center text-accent-champagne">
                        BENCHMARK: {magazineIssueData.projects[activeSpread.projectIndex].metricValue}
                      </div>
                    </div>
                    <div className="space-y-4 text-left font-mono-editorial text-xs pl-0 md:pl-4">
                      <span className="text-accent-champagne font-bold block">ABSTRACT & SYSTEM SPECS</span>
                      <p className="font-sans-editorial text-sm text-graphite/90 dark:text-paper-ivory/90 leading-relaxed">
                        {magazineIssueData.projects[activeSpread.projectIndex].abstract}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {magazineIssueData.projects[activeSpread.projectIndex].techStack.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 border border-paper-border text-[10px] text-editorial-grey">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* SPREAD TYPE: SKILLS */}
                {activeSpread.type === 'skills' && (
                  <>
                    <div className="space-y-4 border-r border-paper-border/60 pr-0 md:pr-8 text-left font-mono-editorial">
                      <span className="text-xs text-accent-champagne font-bold block">CHAPTER 05</span>
                      <h2 className="font-display text-4xl font-extrabold text-graphite dark:text-paper-ivory">CURATED CATALOG</h2>
                      <p className="text-xs text-editorial-grey">FULL SPECIMEN SHEET OF LANGUAGES, FRAMEWORKS, AND DATA LIBRARIES.</p>
                    </div>
                    <div className="space-y-3 font-mono-editorial text-xs text-left pl-0 md:pl-4">
                      <div className="p-3 border border-paper-border bg-paper-ivory dark:bg-paper-ivory-dark rounded-xs">
                        <span className="text-accent-champagne font-bold block">LANGUAGES</span>
                        <p className="text-graphite dark:text-paper-ivory">Java, Python, C/C++, SQL Postgres, JavaScript, HTML/CSS</p>
                      </div>
                      <div className="p-3 border border-paper-border bg-paper-ivory dark:bg-paper-ivory-dark rounded-xs">
                        <span className="text-accent-champagne font-bold block">FRAMEWORKS & INFRA</span>
                        <p className="text-graphite dark:text-paper-ivory">React, Node.js, Express, Flask, FastAPI, Docker, Git, GCP</p>
                      </div>
                    </div>
                  </>
                )}

                {/* SPREAD TYPE: CHRONICLES */}
                {activeSpread.type === 'chronicles' && (
                  <>
                    <div className="space-y-4 border-r border-paper-border/60 pr-0 md:pr-8 text-left font-mono-editorial">
                      <span className="text-xs text-accent-champagne font-bold block">CHAPTER 06</span>
                      <h2 className="font-display text-4xl font-extrabold text-graphite dark:text-paper-ivory">CHRONICLES</h2>
                      <p className="text-xs text-editorial-grey">RECORDED FIELD WORK & ACADEMIC POSITIONS.</p>
                    </div>
                    <div className="space-y-3 font-mono-editorial text-xs text-left pl-0 md:pl-4">
                      {magazineIssueData.experienceChronicles.map((exp, i) => (
                        <div key={i} className="p-3 border border-paper-border bg-paper-ivory dark:bg-paper-ivory-dark rounded-xs">
                          <span className="text-accent-champagne font-bold block text-[10px]">{exp.period}</span>
                          <span className="font-bold text-graphite dark:text-paper-ivory block">{exp.role}</span>
                          <span className="text-editorial-grey text-[11px]">{exp.company}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* SPREAD TYPE: COLOPHON */}
                {activeSpread.type === 'colophon' && (
                  <>
                    <div className="space-y-4 border-r border-paper-border/60 pr-0 md:pr-8 text-left font-mono-editorial">
                      <span className="text-xs text-accent-champagne font-bold block">CHAPTER 07</span>
                      <h2 className="font-display text-4xl font-extrabold text-graphite dark:text-paper-ivory">BACK COVER</h2>
                      <p className="text-xs text-editorial-grey">EDITORIAL COLOPHON & DIRECT CORRESPONDENCE.</p>
                    </div>
                    <div className="space-y-3 font-mono-editorial text-xs text-left pl-0 md:pl-4">
                      <p className="text-graphite dark:text-paper-ivory font-bold">PARTH AVHAD • MUMBAI, INDIA</p>
                      <p className="text-editorial-grey">Phone: +91 8433591056</p>
                      <p className="text-editorial-grey">Email: avhadparth04@gmail.com</p>
                      <div className="pt-2 text-[10px] text-accent-champagne font-bold">
                        © 2026 PARTH AVHAD. ALL RIGHTS RESERVED.
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-6 font-mono-editorial text-xs z-10">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          onMouseEnter={() => soundEngine.playHoverClick()}
          className="flex items-center gap-2 px-5 py-2.5 bg-graphite text-paper-ivory dark:bg-paper-ivory dark:text-graphite disabled:opacity-30 hover:bg-accent-champagne hover:text-graphite rounded-xs cursor-pointer transition-all font-bold shadow-md"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>PREVIOUS SPREAD</span>
        </button>

        <div className="flex gap-2">
          {spreads.map((_, i) => (
            <div 
              key={i}
              onClick={() => {
                soundEngine.playPaperTurn();
                setDirection(i > currentPage ? 1 : -1);
                setCurrentPage(i);
              }}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                i === currentPage ? 'bg-accent-champagne w-8' : 'bg-paper-border hover:bg-graphite'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === spreads.length - 1}
          onMouseEnter={() => soundEngine.playHoverClick()}
          className="flex items-center gap-2 px-5 py-2.5 bg-graphite text-paper-ivory dark:bg-paper-ivory dark:text-graphite disabled:opacity-30 hover:bg-accent-champagne hover:text-graphite rounded-xs cursor-pointer transition-all font-bold shadow-md"
        >
          <span>NEXT SPREAD</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
