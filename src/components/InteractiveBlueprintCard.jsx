import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/soundEngine';
import { Shield, Zap, Cpu, Terminal, Play, RefreshCw, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';

export function InteractiveBlueprintCard({ project, index }) {
  const [viewMode, setViewMode] = useState('blueprint'); // 'blueprint' | 'radar' | 'terminal'
  const [simulating, setSimulating] = useState(false);
  const [testUrl, setTestUrl] = useState('https://secure-login.bank-update.com');
  const [scanResult, setScanResult] = useState(null);
  const [nodes, setNodes] = useState([
    { id: 1, label: 'Live News Feed', status: 'verified', x: 20, y: 30 },
    { id: 2, label: 'NLP Credibility Model', status: 'active', x: 50, y: 50 },
    { id: 3, label: 'Vector Graph', status: 'verified', x: 80, y: 30 },
    { id: 4, label: 'Truth Output', status: 'verified', x: 50, y: 80 },
  ]);

  // Run simulation effect for FactMatrix / PhishGuard / SecureNext
  const runSimulation = () => {
    soundEngine.playStamp();
    setSimulating(true);
    setScanResult(null);

    setTimeout(() => {
      setSimulating(false);
      if (project.title.includes('PHISHGUARD')) {
        setScanResult({
          score: 94.2,
          isPhishing: true,
          details: 'Suspicious Domain Entropy & Missing SSL Cert'
        });
      } else if (project.title.includes('FACTMATRIX')) {
        setScanResult({
          score: 98.7,
          credibility: 'HIGH CREDIBILITY',
          latency: '1.42s'
        });
      } else {
        setScanResult({
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          status: 'RBAC PERMISSION GRANTED'
        });
      }
    }, 1200);
  };

  return (
    <div className="relative border border-paper-border rounded-sm editorial-shadow bg-[#161616] text-paper-ivory p-4 sm:p-6 overflow-hidden min-h-[420px] flex flex-col justify-between font-mono-editorial select-none">
      {/* Background Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#C5A059 1px, transparent 1px), repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(197, 160, 89, 0.1) 20px)',
          backgroundSize: '20px 20px, 100% 20px'
        }}
      />

      {/* Blueprint Corner Registration Crosshairs */}
      <div className="absolute top-2 left-2 text-[9px] text-accent-champagne/60 font-bold">+ REG_0{index + 1}</div>
      <div className="absolute top-2 right-2 text-[9px] text-accent-champagne/60 font-bold">+ 2026_PATENT</div>
      <div className="absolute bottom-2 left-2 text-[9px] text-accent-champagne/60 font-bold">LAT: 19.0760° N</div>
      <div className="absolute bottom-2 right-2 text-[9px] text-accent-champagne/60 font-bold">LONG: 72.8777° E</div>

      {/* Card Header Controls */}
      <div className="relative z-10 flex justify-between items-center border-b border-white/10 pb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-champagne animate-pulse" />
          <span className="font-bold tracking-widest text-accent-champagne text-[10px] uppercase">
            TECHNICAL BLUEPRINT TELEMETRY
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xs border border-white/10 text-[10px]">
          <button
            onClick={() => { soundEngine.playHoverClick(); setViewMode('blueprint'); }}
            className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
              viewMode === 'blueprint' ? 'bg-accent-champagne text-graphite font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            PATENT SCHEMATIC
          </button>
          <button
            onClick={() => { soundEngine.playHoverClick(); setViewMode('radar'); }}
            className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
              viewMode === 'radar' ? 'bg-accent-champagne text-graphite font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            LIVE SCANNER
          </button>
        </div>
      </div>

      {/* Interactive Main Body Content per Project */}
      <div className="relative z-10 my-4 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {viewMode === 'blueprint' ? (
            <motion.div 
              key="blueprint"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-4"
            >
              {/* Project 1: FactMatrix NLP Vector Graph Blueprint */}
              {project.title.includes('FACTMATRIX') && (
                <div className="space-y-3">
                  <div className="relative h-44 border border-white/10 rounded-xs bg-black/40 p-4 flex items-center justify-around overflow-hidden">
                    {/* SVG Vector Connections */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                      <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="#C5A059" strokeWidth="2" strokeDasharray="4" />
                      <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="#C5A059" strokeWidth="2" strokeDasharray="4" />
                    </svg>

                    <div className="z-10 p-3 border border-accent-champagne/40 bg-black/80 rounded-xs text-center space-y-1">
                      <Zap className="w-4 h-4 text-accent-champagne mx-auto animate-pulse" />
                      <span className="text-[10px] text-gray-300 block">NEWS INGESTION</span>
                      <span className="text-[9px] text-accent-champagne block">RSS / Twitter</span>
                    </div>

                    <div className="z-10 p-3 border-2 border-accent-champagne bg-accent-champagne/10 rounded-xs text-center space-y-1 shadow-lg">
                      <Cpu className="w-5 h-5 text-accent-champagne mx-auto animate-spin" />
                      <span className="text-[10px] font-bold text-white block">BERT + NLP CLASSIFIER</span>
                      <span className="text-[9px] text-accent-champagne block">Latency &lt; 2.0s</span>
                    </div>

                    <div className="z-10 p-3 border border-accent-champagne/40 bg-black/80 rounded-xs text-center space-y-1">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto" />
                      <span className="text-[10px] text-gray-300 block">CREDIBILITY SCORE</span>
                      <span className="text-[9px] text-green-400 block">Verified Signal</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-gray-400 bg-white/5 p-2 rounded-xs">
                    <span>STATUS: ACTIVE SYSTEM TELEMETRY</span>
                    <button 
                      onClick={runSimulation}
                      disabled={simulating}
                      className="px-3 py-1 bg-accent-champagne text-graphite font-bold rounded-xs hover:bg-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3" />
                      <span>{simulating ? 'RUNNING NLP PIPELINE...' : 'RUN NLP CREDIBILITY SIMULATION'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Project 2: PhishGuard Threat Scanner Blueprint */}
              {project.title.includes('PHISHGUARD') && (
                <div className="space-y-3">
                  <div className="relative h-44 border border-white/10 rounded-xs bg-black/40 p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center text-[10px] text-gray-400">
                      <span>DATASET: 50,000+ TRAINED URLS</span>
                      <span className="text-accent-champagne font-bold">MODEL ACCURACY: 94.0%</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-300 block font-bold">TEST PHISHING DETECTION ENGINE:</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={testUrl}
                          onChange={(e) => setTestUrl(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-black border border-white/20 text-xs text-green-400 font-mono outline-none focus:border-accent-champagne"
                        />
                        <button 
                          onClick={runSimulation}
                          disabled={simulating}
                          className="px-4 py-1.5 bg-red-900 text-white font-bold rounded-xs hover:bg-accent-champagne hover:text-graphite transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>{simulating ? 'SCANNING...' : 'SCAN URL'}</span>
                        </button>
                      </div>
                    </div>

                    {scanResult && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-2 bg-red-950/60 border border-red-800 text-red-300 text-[10px] flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>THREAT CONFIDENCE: {scanResult.score}% — {scanResult.details}</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Project 3: SecureNext JWT & RBAC Blueprint */}
              {project.title.includes('SECURENEXT') && (
                <div className="space-y-3">
                  <div className="relative h-44 border border-white/10 rounded-xs bg-black/40 p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-400">ENCRYPTION: BCRYPT + JWT HANDSHAKE</span>
                      <span className="text-green-400 font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>RBAC SECURED</span>
                      </span>
                    </div>

                    <div className="p-3 bg-black/80 border border-accent-champagne/30 rounded-xs space-y-1 font-mono text-[10px]">
                      <p className="text-accent-champagne font-bold">HEADER: &#123; "alg": "HS256", "typ": "JWT" &#125;</p>
                      <p className="text-gray-300">PAYLOAD: &#123; "user": "Parth Avhad", "role": "SUPER_ADMIN" &#125;</p>
                      <p className="text-green-400">SIGNATURE: 0x9f8a...7b12 [VERIFIED]</p>
                    </div>

                    <button 
                      onClick={runSimulation}
                      disabled={simulating}
                      className="w-full py-1.5 bg-accent-champagne/20 border border-accent-champagne text-accent-champagne font-bold rounded-xs hover:bg-accent-champagne hover:text-graphite transition-colors cursor-pointer text-[10px] uppercase flex items-center justify-center gap-2"
                    >
                      <RefreshCw className={`w-3 h-3 ${simulating ? 'animate-spin' : ''}`} />
                      <span>{simulating ? 'ROTATING CRYPTOGRAPHIC KEYS...' : 'TRIGGER KEY ROTATION & TOKEN VERIFICATION'}</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* Radar View Mode */
            <motion.div 
              key="radar"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative h-48 flex items-center justify-center border border-white/10 rounded-xs bg-black/60 overflow-hidden"
            >
              {/* Circular Sweep Radar Line */}
              <div className="w-40 h-40 rounded-full border border-accent-champagne/40 relative flex items-center justify-center">
                <div className="w-28 h-28 rounded-full border border-dashed border-accent-champagne/20" />
                <div className="w-16 h-16 rounded-full border border-accent-champagne/20" />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-champagne/30 to-transparent rounded-full animate-spin [animation-duration:4s]" />
              </div>

              <div className="absolute bottom-2 inset-x-4 flex justify-between items-center text-[10px] text-gray-400">
                <span>RADAR SWEEP: 360° ACTIVE</span>
                <span className="text-accent-champagne font-bold">{project.metricValue}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Blueprint Footer Metadata */}
      <div className="relative z-10 border-t border-white/10 pt-3 flex justify-between items-center text-[10px] text-gray-400">
        <span>ARCHITECT: PARTH AVHAD</span>
        <span className="text-accent-champagne font-bold">{project.metricLabel}: {project.metricValue}</span>
      </div>
    </div>
  );
}
