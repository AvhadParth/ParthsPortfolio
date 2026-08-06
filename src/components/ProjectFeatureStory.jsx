import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { soundEngine } from '../utils/soundEngine';
import { ExternalLink, Zap, Shield, Cpu, CheckCircle2, Sparkles } from 'lucide-react';
import { GithubIcon } from './Icons';
import { EditorialPressCollage } from './EditorialPressCollage';

export function ProjectFeatureStory({ project, index, onOpenModal }) {
  const [activeTab, setActiveTab] = useState('overview');
  const isEven = index % 2 === 0;
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <motion.article 
      id={`chapter-0${index + 3}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className="min-h-[85vh] py-16 px-4 sm:px-8 lg:px-12 border-b border-paper-border bg-paper-ivory dark:bg-paper-ivory-dark overflow-hidden flex flex-col justify-center relative select-none"
    >
      {/* Background Watermark Parallax Chapter Number */}
      <motion.div 
        style={{ y: backgroundY }}
        className={`absolute ${isEven ? 'right-4' : 'left-4'} top-1/4 opacity-[0.03] dark:opacity-[0.05] font-display text-[30vw] font-black pointer-events-none z-0`}
      >
        0{index + 1}
      </motion.div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Editorial Top Bar */}
        <div className="flex justify-between items-center font-mono-editorial text-xs text-editorial-grey border-b border-paper-border pb-4 mb-8">
          <span className="flex items-center gap-1.5 text-accent-champagne font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FEATURE STORY {project.featureNumber}</span>
          </span>
          <span className="font-bold text-graphite dark:text-paper-ivory">{project.category}</span>
          <span>PAGE 08 – {8 + (index + 1) * 6}</span>
        </div>

        {/* Headline Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-baseline gap-4 mb-2">
            <span className="font-mono-editorial text-[10px] uppercase px-2.5 py-1 bg-graphite text-paper-ivory dark:bg-paper-ivory dark:text-graphite font-bold rounded-xs">
              ISSUE 001 FEATURE
            </span>
            <span className="font-mono-editorial text-xs text-editorial-grey font-bold">YEAR: {project.year}</span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-graphite dark:text-paper-ivory leading-none">
            {project.title}
          </h2>

          <p className="font-editorial-serif italic text-xl sm:text-2xl text-editorial-grey mt-2 max-w-3xl">
            "{project.subtitle}"
          </p>
        </div>

        {/* Grid Layout */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
          {/* Editorial Press Clipping Collage Column */}
          <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
            <EditorialPressCollage project={project} index={index} />
          </div>

          {/* Editorial Content Column with Interactive Tabs */}
          <div className={`lg:col-span-7 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
            {/* Tab Controls */}
            <div className="flex border-b border-paper-border font-mono-editorial text-xs">
              <button
                onClick={() => { soundEngine.playHoverClick(); setActiveTab('overview'); }}
                className={`pb-2.5 px-4 font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-graphite text-graphite dark:border-paper-ivory dark:text-paper-ivory'
                    : 'border-transparent text-editorial-grey hover:text-graphite dark:hover:text-paper-ivory'
                }`}
              >
                01 / OVERVIEW
              </button>
              <button
                onClick={() => { soundEngine.playHoverClick(); setActiveTab('arch'); }}
                className={`pb-2.5 px-4 font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'arch'
                    ? 'border-graphite text-graphite dark:border-paper-ivory dark:text-paper-ivory'
                    : 'border-transparent text-editorial-grey hover:text-graphite dark:hover:text-paper-ivory'
                }`}
              >
                02 / ARCHITECTURE
              </button>
              <button
                onClick={() => { soundEngine.playHoverClick(); setActiveTab('impact'); }}
                className={`pb-2.5 px-4 font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'impact'
                    ? 'border-graphite text-graphite dark:border-paper-ivory dark:text-paper-ivory'
                    : 'border-transparent text-editorial-grey hover:text-graphite dark:hover:text-paper-ivory'
                }`}
              >
                03 / IMPACT & STACK
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 font-sans-editorial">
                <p className="text-base sm:text-lg leading-relaxed text-graphite/90 dark:text-paper-ivory/90">
                  {project.abstract}
                </p>

                <div className="p-4 border-l-4 border-accent-champagne bg-paper-ivory-warm dark:bg-paper-card">
                  <p className="font-editorial-serif italic text-lg text-graphite dark:text-paper-ivory">
                    "{project.quote}"
                  </p>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Architecture */}
            {activeTab === 'arch' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 font-mono-editorial text-xs">
                <span className="text-editorial-grey font-bold uppercase block">CHALLENGE:</span>
                <p className="text-graphite dark:text-paper-ivory font-sans-editorial text-sm">{project.challenge}</p>

                <span className="text-accent-champagne font-bold uppercase block pt-2">CORE COMPONENTS:</span>
                <ul className="space-y-2">
                  {(project.architecture || []).map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-champagne shrink-0" />
                      <span className="text-graphite dark:text-paper-ivory">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Tab 3: Impact & Stack */}
            {activeTab === 'impact' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 font-mono-editorial text-xs">
                <div className="p-4 border border-paper-border bg-paper-ivory-warm dark:bg-paper-card rounded-sm">
                  <span className="text-editorial-grey uppercase font-bold block mb-1">VERIFIED IMPACT</span>
                  <p className="text-graphite dark:text-paper-ivory font-sans-editorial text-sm font-medium">
                    {project.outcome}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {(project.techStack || []).map((tech, i) => (
                    <span 
                      key={i}
                      className="px-2.5 py-1 border border-paper-border bg-paper-ivory dark:bg-paper-ivory-dark text-editorial-grey font-bold rounded-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 border-t border-paper-border pt-6">
              <button
                onClick={() => {
                  soundEngine.playStamp();
                  onOpenModal(project);
                }}
                onMouseEnter={() => soundEngine.playHoverClick()}
                className="flex items-center gap-2 px-6 py-3 bg-graphite text-paper-ivory dark:bg-paper-ivory dark:text-graphite font-mono-editorial text-xs font-bold rounded-xs hover:bg-accent-champagne hover:text-graphite transition-all cursor-pointer shadow-md"
              >
                <span>INTERACTIVE ARCHITECTURE DEMO</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundEngine.playHoverClick()}
                className="flex items-center gap-2 px-5 py-3 border border-paper-border hover:border-graphite font-mono-editorial text-xs text-graphite dark:text-paper-ivory rounded-xs transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>SOURCE CODE</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
