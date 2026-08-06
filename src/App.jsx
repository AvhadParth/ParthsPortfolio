import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import './styles/editorial.css';
import { magazineIssueData } from './data/portfolioData';
import { MagazineMasthead } from './components/MagazineMasthead';
import { CoverSpread } from './components/CoverSpread';
import { TableOfContents } from './components/TableOfContents';
import { EditorsLetter } from './components/EditorsLetter';
import { ProjectFeatureStory } from './components/ProjectFeatureStory';
import { SkillsCatalog } from './components/SkillsCatalog';
import { ChroniclesJournal } from './components/ChroniclesJournal';
import { ColophonBackCover } from './components/ColophonBackCover';
import { ProjectModal } from './components/ProjectModal';
import { EditorialCursor } from './components/EditorialCursor';
import { FlipbookReader } from './components/FlipbookReader';
import { PressroomLoader } from './components/PressroomLoader';
import { AnimatePresence } from 'framer-motion';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [activeMode, setActiveMode] = useState('scroll'); // 'scroll' | 'flip'
  const [selectedProject, setSelectedProject] = useState(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Sync dark class with document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const scrollToChapter = (chapterId) => {
    setActiveMode('scroll');
    setTimeout(() => {
      const element = document.getElementById(`chapter-${chapterId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (chapterId === '01') {
        const letter = document.getElementById('chapter-01');
        if (letter) letter.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-paper-ivory dark:bg-paper-ivory-dark text-graphite dark:text-paper-ivory selection:bg-graphite selection:text-paper-ivory relative font-sans-editorial">
      {/* Mechanical Printing Press Loader */}
      <AnimatePresence>
        {isLoading && <PressroomLoader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Scroll Progress Bar at Very Top */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-accent-champagne z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Real-time Paper Texture Noise Layer */}
      <div className="paper-texture-overlay"></div>

      {/* Dynamic Editorial Cursor */}
      <EditorialCursor />

      {/* Top Sticky Magazine Masthead */}
      <MagazineMasthead 
        isDark={isDark}
        setIsDark={setIsDark}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
      />

      {/* Main Magazine Body View (Spread Scroll or Flipbook Reader) */}
      {activeMode === 'scroll' ? (
        <main className="relative">
          {/* Cover Spread */}
          <CoverSpread onExploreClick={() => scrollToChapter('01')} />

          {/* Table of Contents */}
          <TableOfContents onSelectChapter={scrollToChapter} />

          {/* Chapter 01: Editor's Letter */}
          <EditorsLetter />

          {/* Chapter 02: Chronicles & Experience (MOVED UP FOR RECRUITERS) */}
          <ChroniclesJournal />

          {/* Chapters 03 - 05: Feature Stories (Projects) */}
          {magazineIssueData.projects.map((project, idx) => (
            <ProjectFeatureStory 
              key={project.id}
              project={project}
              index={idx}
              onOpenModal={(p) => setSelectedProject(p)}
            />
          ))}

          {/* Chapter 06: Skills Catalog */}
          <SkillsCatalog />

          {/* Chapter 07 & Back Cover: Colophon */}
          <ColophonBackCover />
        </main>
      ) : (
        <FlipbookReader onSwitchToScroll={() => setActiveMode('scroll')} />
      )}

      {/* Floating Bottom Magazine Reading HUD */}
      {activeMode === 'scroll' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-paper-ivory/90 dark:bg-paper-card/90 border border-paper-border px-5 py-2.5 rounded-full backdrop-blur-md shadow-xl flex items-center gap-6 font-mono-editorial text-[10px] text-editorial-grey">
          <span className="font-bold text-graphite dark:text-paper-ivory">PARTH AVHAD</span>
          <div className="flex gap-3">
            <button 
              onClick={() => scrollToChapter('01')} 
              className="hover:text-accent-champagne cursor-pointer transition-colors"
            >
              LETTER
            </button>
            <span>•</span>
            <button 
              onClick={() => scrollToChapter('02')} 
              className="hover:text-accent-champagne cursor-pointer transition-colors font-bold text-graphite dark:text-paper-ivory"
            >
              EXPERIENCE
            </button>
            <span>•</span>
            <button 
              onClick={() => scrollToChapter('03')} 
              className="hover:text-accent-champagne cursor-pointer transition-colors"
            >
              WORKS
            </button>
            <span>•</span>
            <button 
              onClick={() => scrollToChapter('06')} 
              className="hover:text-accent-champagne cursor-pointer transition-colors"
            >
              CATALOG
            </button>
          </div>
        </div>
      )}

      {/* Interactive Project Deep Dive Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
}
