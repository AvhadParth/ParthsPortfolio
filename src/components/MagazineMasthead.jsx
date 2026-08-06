import React from 'react';
import { Moon, Sun, BookOpen, Layers } from 'lucide-react';

export function MagazineMasthead({ isDark, setIsDark, activeMode, setActiveMode }) {
  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  const handleModeToggle = () => {
    setActiveMode(activeMode === 'scroll' ? 'flip' : 'scroll');
  };

  return (
    <header className="sticky top-0 z-50 bg-paper-ivory/90 dark:bg-paper-ivory-dark/90 backdrop-blur-md border-b border-paper-border transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between font-mono-editorial text-xs tracking-wider">
        {/* Left: Magazine Logo & Metadata */}
        <div className="flex items-center gap-3 text-editorial-grey">
          <img 
            src="/images/parth_monogram_logo.png" 
            alt="Parth Avhad Monogram Logo" 
            className="w-6 h-6 rounded-full border border-accent-champagne/40 object-cover shadow-xs"
          />
          <span className="font-bold text-graphite dark:text-paper-ivory">PARTH AVHAD</span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">ISSUE 001</span>
          <span className="hidden md:inline">|</span>
          <span className="hidden sm:inline">AUGUST 2026</span>
        </div>

        {/* Center: Issue Subtitle */}
        <div className="hidden lg:block text-center font-editorial-serif italic text-sm text-graphite dark:text-paper-ivory/80">
          "The Creative Engineering & Data Craft of Parth Avhad"
        </div>

        {/* Right: Controls & Toggles */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mode Switcher */}
          <button 
            onClick={handleModeToggle}
            className="flex items-center gap-1.5 px-2.5 py-1 border border-graphite/20 dark:border-paper-ivory/20 rounded hover:bg-graphite hover:text-paper-ivory dark:hover:bg-paper-ivory dark:hover:text-graphite transition-all cursor-pointer text-graphite dark:text-paper-ivory"
            title="Toggle Layout View Mode"
          >
            {activeMode === 'scroll' ? (
              <>
                <BookOpen className="w-3.5 h-3.5" />
                <span>FLIPBOOK</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5" />
                <span>SPREAD SCROLL</span>
              </>
            )}
          </button>

          {/* Theme Switcher */}
          <button 
            onClick={handleThemeToggle}
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-graphite dark:text-paper-ivory"
            title="Toggle Paper Edition (Ivory / Onyx)"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-accent-champagne" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-graphite" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
