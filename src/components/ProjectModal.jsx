import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { X, ExternalLink, Terminal, CheckCircle2, Shield, Zap } from 'lucide-react';
import { GithubIcon } from './Icons';

export function ProjectModal({ project, onClose }) {
  const [activeTab, setActiveTab] = useState('demo');

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-paper-ivory dark:bg-paper-ivory-dark border border-paper-border w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm editorial-shadow flex flex-col font-mono-editorial text-xs">
        {/* Modal Header */}
        <div className="sticky top-0 bg-paper-ivory-warm dark:bg-paper-card border-b border-paper-border p-4 flex items-center justify-between z-10">
          <div>
            <span className="text-[10px] text-accent-champagne uppercase font-bold block">
              LIVE ARCHITECTURE SPECIMEN
            </span>
            <h3 className="font-display text-xl font-bold text-graphite dark:text-paper-ivory">
              {project.title} — {project.subtitle}
            </h3>
          </div>
          <button 
            onClick={() => {
              soundEngine.playHoverClick();
              onClose();
            }}
            className="p-1.5 border border-paper-border hover:bg-graphite hover:text-paper-ivory rounded-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-paper-border bg-paper-ivory dark:bg-paper-ivory-dark px-4 pt-2">
          <button
            onClick={() => { soundEngine.playHoverClick(); setActiveTab('demo'); }}
            className={`px-4 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
              activeTab === 'demo' 
                ? 'border-graphite text-graphite dark:border-paper-ivory dark:text-paper-ivory' 
                : 'border-transparent text-editorial-grey'
            }`}
          >
            INTERACTIVE BENCHMARK DEMO
          </button>
          <button
            onClick={() => { soundEngine.playHoverClick(); setActiveTab('arch'); }}
            className={`px-4 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
              activeTab === 'arch' 
                ? 'border-graphite text-graphite dark:border-paper-ivory dark:text-paper-ivory' 
                : 'border-transparent text-editorial-grey'
            }`}
          >
            SYSTEM SPECIFICATION & METRICS
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {activeTab === 'demo' ? (
            <div className="space-y-6">
              {/* Simulated Interactive Console */}
              <div className="bg-graphite text-paper-ivory p-6 rounded-sm space-y-4 font-mono-editorial">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 text-editorial-grey text-[10px]">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-accent-champagne" />
                    <span>ENGINEERING CLI — {project.id.toUpperCase()} v1.0.4</span>
                  </div>
                  <span className="text-accent-champagne">STATUS: ONLINE</span>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-accent-champagne">$ initialize_pipeline --target "{project.title}"</p>
                  <p className="text-white/70">› Loading Scikit-Learn / Natural Language Processing models...</p>
                  <p className="text-white/70">› Verifying JWT auth headers & SSL handshake...</p>
                  <p className="text-green-400">✓ Connection established with zero latency bottlenecks.</p>
                </div>

                {/* Benchmark Metric Panel */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center">
                  <div className="p-3 bg-white/5 rounded-xs">
                    <span className="text-[10px] text-editorial-grey block">RESPONSE TIME</span>
                    <span className="text-base font-bold text-accent-champagne">{project.latency || "< 2.0s"}</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xs">
                    <span className="text-[10px] text-editorial-grey block">CLASSIFICATION ACCURACY</span>
                    <span className="text-base font-bold text-accent-champagne">{project.accuracy || "94.0%"}</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xs col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-editorial-grey block">SECURITY STANDARD</span>
                    <span className="text-base font-bold text-accent-champagne">{project.protocol || "JWT / RBAC"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-graphite text-paper-ivory dark:bg-paper-ivory dark:text-graphite text-center font-bold uppercase tracking-widest hover:bg-accent-champagne hover:text-graphite transition-colors flex items-center justify-center gap-2"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>VIEW FULL REPOSITORY ON GITHUB</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-bold text-graphite dark:text-paper-ivory text-sm">DETAILED ARCHITECTURE SPECS:</h4>
                <ul className="space-y-2 text-editorial-grey">
                  {project.architecture.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 border-b border-paper-border pb-2">
                      <CheckCircle2 className="w-4 h-4 text-accent-champagne shrink-0 mt-0.5" />
                      <span className="text-graphite dark:text-paper-ivory">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 border border-paper-border bg-paper-ivory-warm dark:bg-paper-card space-y-1">
                <span className="text-accent-champagne font-bold block">PROJECT SUMMARY & OUTCOME</span>
                <p className="text-graphite dark:text-paper-ivory">{project.outcome}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
