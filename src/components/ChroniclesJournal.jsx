import React from 'react';
import { motion } from 'framer-motion';
import { magazineIssueData } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';
import { Briefcase, GraduationCap, MapPin, Calendar, CheckCircle2, Award, Download, Sparkles, Building2, Terminal } from 'lucide-react';

export function ChroniclesJournal() {
  const { experienceChronicles, education } = magazineIssueData;

  // Tech stack chips per experience role
  const roleTechStacks = [
    ['Python', 'ETL Data Pipelines', 'Executive Dashboards', 'Data Analytics', 'JSW Enterprise'],
    ['WordPress Architecture', 'PHP', 'Custom Theming', 'Web Performance'],
    ['Business Analytics', 'KPI Audits', 'Market Intelligence', 'Client Reporting']
  ];

  return (
    <section id="chapter-02" className="py-20 px-4 sm:px-8 lg:px-12 border-b border-paper-border bg-paper-ivory dark:bg-paper-ivory-dark relative overflow-hidden select-none">
      {/* Background Watermark */}
      <div className="absolute top-1/3 right-0 opacity-[0.02] dark:opacity-[0.04] font-display text-[25vw] font-black uppercase pointer-events-none">
        CHRONICLES
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Top Bar */}
        <div className="flex justify-between items-center font-mono-editorial text-xs text-editorial-grey border-b border-paper-border pb-4 mb-10">
          <span className="flex items-center gap-1.5 text-accent-champagne font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CHAPTER 02 / CHRONICLES & FIELD DOSSIER</span>
          </span>
          <span>PAGE 38 – 43</span>
          <span className="font-bold text-graphite dark:text-paper-ivory">PARTH AVHAD</span>
        </div>

        {/* Section Header with Recruiter Summary Banner */}
        <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="font-mono-editorial text-xs tracking-widest text-accent-champagne block mb-2 font-bold uppercase">
              RECORDED INDUSTRY POSITIONS & CREDENTIALS
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-graphite dark:text-paper-ivory">
              CAREER CHRONICLES
            </h2>
            <p className="font-editorial-serif italic text-lg text-editorial-grey mt-2 max-w-2xl">
              A comprehensive ledger of industry roles across Data Analytics, Full-Stack Development, and Business Intelligence.
            </p>
          </div>

          {/* Recruiter Quick Fact Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-4 border-2 border-accent-champagne bg-paper-ivory-warm dark:bg-paper-card rounded-sm shadow-xl font-mono-editorial text-xs space-y-2 min-w-[280px]"
          >
            <div className="flex justify-between items-center text-accent-champagne font-bold">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>RECRUITER SNAPSHOT</span>
              </span>
              <span className="text-[10px] bg-accent-champagne/20 px-2 py-0.5 rounded-xs">VERIFIED</span>
            </div>
            <div className="text-graphite dark:text-paper-ivory space-y-1 text-[11px]">
              <p>• <strong>CURRENT ROLE:</strong> Data Analyst @ MuSo (JSW Initiative)</p>
              <p>• <strong>LOCATION:</strong> Mumbai, India</p>
              <p>• <strong>KEY STACK:</strong> Python, Data Pipelines, SQL, MERN, React</p>
            </div>
          </motion.div>
        </div>

        {/* Two Column Layout: Experience & Education */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Work Experience Journal with Continuous Connected Timeline Stream */}
          <div className="lg:col-span-8 space-y-8 relative">
            <h3 className="font-mono-editorial text-xs tracking-widest text-graphite dark:text-paper-ivory uppercase font-bold flex items-center gap-2 border-b-2 border-graphite dark:border-paper-border pb-3">
              <Briefcase className="w-4 h-4 text-accent-champagne" />
              <span>RECORDED INDUSTRY POSITIONS (EXECUTIVE DOSSIER)</span>
            </h3>

            {/* Continuous Vertical Timeline Line */}
            <div className="absolute left-4 top-16 bottom-4 w-0.5 bg-accent-champagne/30 hidden sm:block" />

            <div className="space-y-8">
              {(experienceChronicles || []).map((exp, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="relative sm:pl-10 group"
                >
                  {/* Timeline Dot Indicator */}
                  <div className="absolute left-2.5 top-6 w-3.5 h-3.5 rounded-full border-2 border-accent-champagne bg-paper-ivory dark:bg-paper-ivory-dark group-hover:bg-accent-champagne group-hover:scale-125 transition-all hidden sm:flex items-center justify-center">
                    {idx === 0 && <span className="w-1.5 h-1.5 rounded-full bg-accent-champagne animate-ping" />}
                  </div>

                  {/* Expansive Unfolded Dossier Card */}
                  <div className="p-6 sm:p-8 border border-paper-border bg-paper-ivory-warm dark:bg-paper-card rounded-sm editorial-shadow space-y-5 hover:border-accent-champagne transition-all">
                    {/* Header Row */}
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-paper-border pb-4">
                      <div>
                        <div className="flex items-center gap-3 font-mono-editorial text-xs mb-1.5">
                          <span className="text-accent-champagne font-bold px-2.5 py-1 bg-graphite text-paper-ivory dark:bg-paper-ivory dark:text-graphite rounded-xs uppercase tracking-wider">
                            {exp.period}
                          </span>
                          <span className="text-editorial-grey flex items-center gap-1 font-bold">
                            <MapPin className="w-3.5 h-3.5 text-accent-champagne" />
                            {exp.location}
                          </span>
                        </div>

                        <h4 className="font-display text-2xl font-extrabold text-graphite dark:text-paper-ivory">
                          {exp.role}
                        </h4>
                        <p className="font-editorial-serif text-lg text-editorial-grey italic">
                          @ {exp.company}
                        </p>
                      </div>

                      {/* Status Tag */}
                      {idx === 0 ? (
                        <span className="px-3 py-1 bg-green-900/20 border border-green-700 text-green-700 dark:text-green-400 font-mono-editorial text-[10px] font-bold rounded-xs uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                          <span>ACTIVE POSITION</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-black/5 dark:bg-white/5 border border-paper-border text-editorial-grey font-mono-editorial text-[10px] font-bold rounded-xs uppercase">
                          COMPLETED INTERNSHIP
                        </span>
                      )}
                    </div>

                    {/* Key Accomplishment Bullet Points */}
                    <ul className="space-y-3 font-sans-editorial text-sm sm:text-base text-graphite/90 dark:text-paper-ivory/90">
                      {(exp.details || []).map((detail, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-accent-champagne shrink-0 mt-1" />
                          <span className="leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Technology & Competency Stack Chips */}
                    <div className="pt-4 border-t border-paper-border flex flex-wrap items-center gap-2 font-mono-editorial text-xs">
                      <span className="text-editorial-grey text-[10px] uppercase font-bold mr-1 flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-accent-champagne" />
                        <span>COMPETENCIES:</span>
                      </span>
                      {roleTechStacks[idx % roleTechStacks.length].map((tech, i) => (
                        <span 
                          key={i}
                          className="px-2.5 py-1 border border-paper-border bg-paper-ivory dark:bg-paper-ivory-dark text-graphite dark:text-paper-ivory font-bold text-[10px] rounded-xs shadow-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Academic Foundations Parchments */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="font-mono-editorial text-xs tracking-widest text-graphite dark:text-paper-ivory uppercase font-bold flex items-center gap-2 border-b-2 border-graphite dark:border-paper-border pb-3">
              <GraduationCap className="w-4 h-4 text-accent-champagne" />
              <span>ACADEMIC DEGREES & CREDENTIALS</span>
            </h3>

            <div className="space-y-6 font-mono-editorial text-xs">
              {(education || []).map((edu, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  onMouseEnter={() => soundEngine.playHoverClick()}
                  className="relative p-6 sm:p-7 border-2 border-graphite/30 dark:border-paper-border bg-paper-ivory-warm dark:bg-paper-card rounded-sm editorial-shadow space-y-4 hover:border-accent-champagne transition-all cursor-pointer group"
                >
                  {/* Watermark Circular Stamp Seal in Top-Right Margin (No Overlap) */}
                  {edu.isCompleted ? (
                    <div className="absolute top-4 right-4 w-18 h-18 rounded-full border-2 border-dashed border-green-600/40 bg-green-950/5 flex flex-col items-center justify-center text-[8px] text-green-600 dark:text-green-400 font-bold rotate-[-12deg] pointer-events-none uppercase p-1 group-hover:rotate-0 group-hover:border-green-600/80 transition-all">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mb-0.5" />
                      <span>COMPLETED</span>
                      <span className="text-[6.5px] text-green-700 dark:text-green-500">VERIFIED</span>
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 w-18 h-18 rounded-full border-2 border-dashed border-amber-500/40 bg-amber-950/5 flex flex-col items-center justify-center text-[8px] text-amber-600 dark:text-amber-400 font-bold rotate-[12deg] pointer-events-none uppercase p-1 group-hover:rotate-0 group-hover:border-amber-500/80 transition-all">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping mb-0.5" />
                      <span>FINAL YEAR</span>
                      <span className="text-[6.5px] text-amber-600 dark:text-amber-500">IN PROGRESS</span>
                    </div>
                  )}

                  {/* Header Row */}
                  <div className="flex justify-between items-center text-[10px] text-editorial-grey border-b border-paper-border pb-2 pr-20">
                    <span className="font-bold text-accent-champagne tracking-widest">CREDENTIAL 0{idx + 1}</span>
                    <span className="flex items-center gap-1 font-bold text-graphite dark:text-paper-ivory">
                      <Calendar className="w-3.5 h-3.5 text-accent-champagne" />
                      {edu.period}
                    </span>
                  </div>

                  {/* Degree Title & Institution */}
                  <div className="space-y-1 pr-16">
                    <h4 className="font-display text-xl sm:text-2xl font-extrabold text-graphite dark:text-paper-ivory group-hover:text-accent-champagne transition-colors">
                      {edu.degree}
                    </h4>
                    <p className="font-editorial-serif text-sm text-editorial-grey italic">
                      {edu.institution}
                    </p>
                  </div>

                  {/* Clean Bottom Metadata Row */}
                  <div className="pt-3 border-t border-paper-border text-[10px] flex flex-wrap justify-between items-center gap-2">
                    <span className="text-editorial-grey">LOCATION: {edu.location}</span>
                    {edu.isCompleted ? (
                      <span className="px-3 py-1 bg-green-950/20 border border-green-700/50 text-green-700 dark:text-green-400 font-bold text-[10px] rounded-xs uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        <span>{edu.score}</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-950/20 border border-amber-500/50 text-amber-700 dark:text-amber-300 font-bold text-[10px] rounded-xs uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        <span>{edu.score}</span>
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
