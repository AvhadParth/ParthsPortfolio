import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { magazineIssueData } from '../data/portfolioData';
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
      setDirection(1);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const activeSpread = spreads[currentPage];

  return (
    <div className="min-h-screen bg-paper-ivory dark:bg-[#121212] text-graphite dark:text-paper-ivory py-8 px-4 flex flex-col justify-between transition-colors duration-500">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center font-mono-editorial text-xs border-b border-paper-border pb-4">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 bg-accent-champagne/20 text-accent-champagne font-bold rounded-xs">
            3D DIGITAL EDITION
          </span>
          <span className="font-bold tracking-widest text-graphite dark:text-paper-ivory">
            SPREAD {currentPage + 1} OF {spreads.length}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onSwitchToScroll}
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
        <div className="relative w-full max-w-5xl bg-[#EBE7DD] dark:bg-[#1c1a17] p-2 sm:p-4 rounded-sm shadow-2xl border border-stone-300 dark:border-stone-700">
          {/* Inner Book Spread Surface - Forced Authentic Parchment Paper Background with Dark Ink Typography */}
          <div className="relative bg-[#F7F4EA] border border-stone-300 rounded-xs min-h-[540px] grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-inner text-stone-900">
            {/* Center Book Spine Crease & Shadow */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/15 via-black/5 to-black/15 pointer-events-none z-30 hidden md:block"></div>
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-stone-400 pointer-events-none z-30 hidden md:block"></div>

            {/* Page Animation Wrapper */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, rotateY: direction > 0 ? 12 : -12, scale: 0.98 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: direction > 0 ? -12 : 12, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="col-span-2 grid grid-cols-1 md:grid-cols-2 w-full h-full p-6 sm:p-10 gap-8 items-center text-stone-900"
              >
                {/* SPREAD TYPE: COVER */}
                {activeSpread.type === 'cover' && (
                  <>
                    <div className="flex justify-center border-r border-stone-300 pr-0 md:pr-8">
                      <img 
                        src="/images/parth_studio_portrait.png" 
                        alt="Parth Avhad Portrait"
                        className="w-full max-w-sm h-[380px] object-cover object-[center_65%] rounded-xs border border-stone-300 shadow-md grayscale"
                      />
                    </div>
                    <div className="space-y-6 text-left pl-0 md:pl-4">
                      <span className="font-mono-editorial text-xs text-amber-800 font-bold block">
                        ISSUE 001 / AUGUST 2026
                      </span>
                      <h1 className="font-display text-5xl font-black text-stone-900 leading-tight">
                        PARTH AVHAD
                      </h1>
                      <p className="font-editorial-serif text-xl italic text-stone-700">
                        "The Creative Engineering & Defensive Architecture Portfolio."
                      </p>
                      <p className="font-mono-editorial text-xs text-stone-800 leading-relaxed font-medium">
                        BRIDGING NATURAL LANGUAGE PROCESSING, ML CLASSIFIERS, AND MERN SECURITY ARCHITECTURE.
                      </p>
                    </div>
                  </>
                )}

                {/* SPREAD TYPE: TOC */}
                {activeSpread.type === 'toc' && (
                  <>
                    <div className="space-y-4 border-r border-stone-300 pr-0 md:pr-8 text-left font-mono-editorial">
                      <span className="text-xs text-amber-800 font-bold block">CHAPTER INDEX</span>
                      <h2 className="font-display text-4xl font-extrabold text-stone-900">CONTENTS</h2>
                      <p className="text-xs text-stone-700 leading-relaxed">
                        SELECT ANY CHAPTER TO JUMP DIRECTLY TO THE EDITORIAL SPREAD.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 font-mono-editorial text-xs text-left pl-0 md:pl-4">
                      {magazineIssueData.toc.map((item, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            setDirection(idx + 1 > currentPage ? 1 : -1);
                            setCurrentPage(idx + 1);
                          }}
                          className="p-3 border border-stone-300 bg-white/80 rounded-xs hover:border-amber-700 cursor-pointer flex justify-between items-center group transition-colors shadow-xs"
                        >
                          <span className="text-amber-800 font-bold">{item.number}</span>
                          <span className="font-bold text-stone-900 group-hover:text-amber-900">{item.title}</span>
                          <span className="text-[10px] text-stone-600">PG. {item.page}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* SPREAD TYPE: EDITOR'S LETTER */}
                {activeSpread.type === 'editorsLetter' && (
                  <>
                    <div className="space-y-4 border-r border-stone-300 pr-0 md:pr-8 text-left font-mono-editorial">
                      <span className="text-xs text-amber-800 font-bold block">CHAPTER 01</span>
                      <h2 className="font-display text-4xl font-extrabold text-stone-900">EDITOR'S NOTE</h2>
                      <p className="font-editorial-serif text-lg italic text-stone-700">
                        "{magazineIssueData.editorsLetter.subhead}"
                      </p>
                    </div>
                    <div className="space-y-4 text-left font-sans-editorial text-sm leading-relaxed text-stone-800 pl-0 md:pl-4">
                      {magazineIssueData.editorsLetter.bodyParagraphs.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                      <div className="pt-4 border-t border-stone-300 font-mono-editorial text-xs">
                        <span className="font-display text-xl font-bold block text-stone-900">Parth Avhad</span>
                        <span className="text-stone-600 text-[10px]">CREATIVE ENGINEER • MUMBAI</span>
                      </div>
                    </div>
                  </>
                )}

                {/* SPREAD TYPE: CHRONICLES */}
                {activeSpread.type === 'chronicles' && (
                  <>
                    <div className="space-y-4 border-r border-stone-300 pr-0 md:pr-8 text-left font-mono-editorial">
                      <span className="text-xs text-amber-800 font-bold block">CHAPTER 02</span>
                      <h2 className="font-display text-4xl font-extrabold text-stone-900">CHRONICLES</h2>
                      <p className="text-xs text-stone-700">RECORDED FIELD WORK & ACADEMIC POSITIONS.</p>
                    </div>
                    <div className="space-y-3 font-mono-editorial text-xs text-left pl-0 md:pl-4">
                      {magazineIssueData.experienceChronicles.map((exp, i) => (
                        <div key={i} className="p-3 border border-stone-300 bg-white/80 rounded-xs shadow-xs">
                          <span className="text-amber-800 font-bold block text-[10px]">{exp.period}</span>
                          <span className="font-bold text-stone-900 block">{exp.role}</span>
                          <span className="text-stone-600 text-[11px]">{exp.company}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* SPREAD TYPE: PROJECTS */}
                {activeSpread.type === 'project' && (
                  <>
                    <div className="space-y-4 border-r border-stone-300 pr-0 md:pr-8 text-left font-mono-editorial">
                      <span className="text-xs text-amber-800 font-bold block">FEATURE ARTICLE 0{activeSpread.projectIndex + 1}</span>
                      <h2 className="font-display text-4xl font-extrabold text-stone-900">
                        {magazineIssueData.projects[activeSpread.projectIndex].title}
                      </h2>
                      <p className="font-editorial-serif text-base italic text-stone-700">
                        "{magazineIssueData.projects[activeSpread.projectIndex].subtitle}"
                      </p>
                      <div className="p-3 bg-stone-900 text-amber-400 rounded-xs text-xs font-bold text-center">
                        BENCHMARK: {magazineIssueData.projects[activeSpread.projectIndex].metricValue}
                      </div>
                    </div>
                    <div className="space-y-4 text-left font-mono-editorial text-xs pl-0 md:pl-4">
                      <span className="text-amber-800 font-bold block">ABSTRACT & SYSTEM SPECS</span>
                      <p className="font-sans-editorial text-sm text-stone-800 leading-relaxed">
                        {magazineIssueData.projects[activeSpread.projectIndex].abstract}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {magazineIssueData.projects[activeSpread.projectIndex].techStack.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 border border-stone-300 bg-white/60 text-[10px] text-stone-800 font-medium">
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
                    <div className="space-y-4 border-r border-stone-300 pr-0 md:pr-8 text-left font-mono-editorial">
                      <span className="text-xs text-amber-800 font-bold block">CHAPTER 06</span>
                      <h2 className="font-display text-4xl font-extrabold text-stone-900">CURATED CATALOG</h2>
                      <p className="text-xs text-stone-700">FULL SPECIMEN SHEET OF LANGUAGES, FRAMEWORKS, AND DATA LIBRARIES.</p>
                    </div>
                    <div className="space-y-3 font-mono-editorial text-xs text-left pl-0 md:pl-4">
                      <div className="p-3 border border-stone-300 bg-white/80 rounded-xs shadow-xs">
                        <span className="text-amber-800 font-bold block">LANGUAGES</span>
                        <p className="text-stone-900 font-medium">Java, Python, C/C++, SQL Postgres, JavaScript, HTML/CSS</p>
                      </div>
                      <div className="p-3 border border-stone-300 bg-white/80 rounded-xs shadow-xs">
                        <span className="text-amber-800 font-bold block">FRAMEWORKS & INFRA</span>
                        <p className="text-stone-900 font-medium">React, Node.js, Express, Flask, FastAPI, Docker, Git, GCP</p>
                      </div>
                    </div>
                  </>
                )}

                {/* SPREAD TYPE: COLOPHON */}
                {activeSpread.type === 'colophon' && (
                  <>
                    <div className="space-y-4 border-r border-stone-300 pr-0 md:pr-8 text-left font-mono-editorial">
                      <span className="text-xs text-amber-800 font-bold block">CHAPTER 07</span>
                      <h2 className="font-display text-4xl font-extrabold text-stone-900">BACK COVER</h2>
                      <p className="text-xs text-stone-700">EDITORIAL COLOPHON & DIRECT CORRESPONDENCE.</p>
                    </div>
                    <div className="space-y-3 font-mono-editorial text-xs text-left pl-0 md:pl-4">
                      <p className="text-stone-900 font-bold text-sm">PARTH AVHAD • MUMBAI, INDIA</p>
                      <p className="text-stone-700">Phone: +91 8433591056</p>
                      <p className="text-stone-700">Email: avhadparth04@gmail.com</p>
                      <div className="pt-2 text-[10px] text-amber-800 font-bold">
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
      <div className="max-w-xl mx-auto w-full flex justify-between items-center font-mono-editorial text-xs z-10 pt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="flex items-center gap-2 px-4 py-2 border border-paper-border rounded-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-graphite hover:text-paper-ivory dark:hover:bg-paper-ivory dark:hover:text-graphite transition-all cursor-pointer text-graphite dark:text-paper-ivory"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>PREVIOUS SPREAD</span>
        </button>

        <div className="flex gap-1.5">
          {spreads.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentPage ? 1 : -1);
                setCurrentPage(idx);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                currentPage === idx 
                  ? 'bg-accent-champagne scale-125' 
                  : 'bg-editorial-grey/40 hover:bg-editorial-grey'
              }`}
              title={`Jump to ${spreads[idx].title}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === spreads.length - 1}
          className="flex items-center gap-2 px-4 py-2 border border-paper-border rounded-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-graphite hover:text-paper-ivory dark:hover:bg-paper-ivory dark:hover:text-graphite transition-all cursor-pointer font-bold text-graphite dark:text-paper-ivory"
        >
          <span>NEXT SPREAD</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
