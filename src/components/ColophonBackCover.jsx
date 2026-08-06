import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { magazineIssueData } from '../data/portfolioData';
import { Mail, Phone, CheckCircle, Stamp, FileText, Download } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

export function ColophonBackCover() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#c5a059', '#d93838', '#ffffff', '#2b5db8']
      });
    } catch (err) {
      console.warn('Confetti error:', err);
    }
  };

  return (
    <section id="chapter-07" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t-2 border-graphite dark:border-paper-border font-mono-editorial text-graphite dark:text-paper-ivory transition-colors duration-500">
      <div className="space-y-12">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-paper-border pb-6 gap-4">
          <div>
            <span className="text-xs text-accent-champagne font-bold tracking-widest uppercase block mb-1">
              CHAPTER 07 • BACK COVER & CORRESPONDENCE
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black uppercase text-graphite dark:text-paper-ivory">
              LETTER TO THE EDITOR
            </h2>
          </div>
          <div className="text-xs text-editorial-grey text-right hidden sm:block">
            <span>DIRECT TELEGRAM & RECRUITER INQUIRY LINE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Physical Airmail Envelope Contact Form */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative p-6 sm:p-10 bg-[#FBF9F4] border-2 border-stone-400 rounded-sm shadow-2xl overflow-hidden text-stone-900"
            >
              {/* Red & Blue Vintage Airmail Envelope Border Strip */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-[repeating-linear-gradient(45deg,#d93838,#d93838_15px,#ffffff_15px,#ffffff_25px,#2b5db8_25px,#2b5db8_40px,#ffffff_40px,#ffffff_50px)] opacity-90" />

              {/* Physical Airmail Stamp & Postmark */}
              <div className="absolute top-6 right-6 w-24 h-24 rounded-full border-2 border-dashed border-red-800/60 bg-red-950/5 flex flex-col items-center justify-center rotate-12 text-[8px] text-red-900 font-bold uppercase tracking-widest pointer-events-none p-1">
                <span>AIR MAIL</span>
                <span className="text-[7px]">MUMBAI 2026</span>
                <span className="text-[6px] text-stone-600">PARTH AVHAD</span>
              </div>

              {submitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-stone-900">LETTER TRANSMITTED</h3>
                  <p className="font-editorial-serif text-base text-stone-700 italic max-w-md mx-auto">
                    Thank you for your correspondence. Parth Avhad will review your note and respond promptly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-amber-800 transition-colors"
                  >
                    SEND ANOTHER NOTE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                  <div className="border-b border-stone-300 pb-3 mb-6">
                    <span className="font-display text-xl font-bold text-stone-900 block">PARTH AVHAD EDITORIAL DESK</span>
                    <span className="text-xs text-stone-600 font-mono-editorial">OFFICIAL CORRESPONDENCE FORM</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-stone-700 uppercase font-bold block text-[10px]">FROM (YOUR NAME / ORG):</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Eleanor Vance (Vogue Labs)"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white/80 border-b-2 border-stone-400 focus:border-amber-700 outline-none text-stone-900 placeholder-stone-400 font-bold transition-colors rounded-xs shadow-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-stone-700 uppercase font-bold block text-[10px]">RETURN EMAIL ADDRESS:</label>
                      <input 
                        type="email" 
                        required
                        placeholder="e.g. eleanor@vogue.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-3 py-2 bg-white/80 border-b-2 border-stone-400 focus:border-amber-700 outline-none text-stone-900 placeholder-stone-400 font-bold transition-colors rounded-xs shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-700 uppercase font-bold block text-[10px]">CORRESPONDENCE SUBJECT:</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Creative Engineering Role / Project Inquiry"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-white/80 border-b-2 border-stone-400 focus:border-amber-700 outline-none text-stone-900 placeholder-stone-400 font-bold transition-colors rounded-xs shadow-xs"
                    />
                  </div>

                  {/* Lined Notebook Stationery Textarea */}
                  <div className="space-y-1">
                    <label className="text-stone-700 uppercase font-bold block text-[10px]">LETTER BODY / MESSAGE:</label>
                    <textarea 
                      rows={6}
                      required
                      placeholder="Dear Editor, I am writing regarding..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full p-4 bg-white/90 border border-stone-300 focus:border-amber-700 outline-none text-stone-900 placeholder-stone-400 font-sans-editorial text-sm leading-relaxed transition-colors resize-none rounded-xs shadow-xs"
                    />
                  </div>

                  {/* Red Wax Seal Submit Button */}
                  <div className="pt-4 flex justify-end">
                    <motion.button 
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-8 py-3.5 bg-red-900 text-white font-bold tracking-widest uppercase hover:bg-amber-800 transition-all flex items-center gap-3 cursor-pointer shadow-xl rounded-xs border border-red-800"
                    >
                      <Stamp className="w-4 h-4 text-amber-300" />
                      <span>SEAL & TRANSMIT LETTER</span>
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>

          {/* Right Column: Colophon & Social Directory & Official Resume Download */}
          <div className="lg:col-span-5 space-y-8 font-mono-editorial text-xs">
            <div className="p-6 border border-paper-border bg-paper-ivory-warm dark:bg-paper-card space-y-6 rounded-xs editorial-shadow">
              <h3 className="font-display text-2xl font-bold text-graphite dark:text-paper-ivory border-b border-paper-border pb-3">
                EDITORIAL COLOPHON
              </h3>

              {/* Official Resume Download Box */}
              <div className="p-4 bg-accent-champagne/15 border-2 border-accent-champagne/40 rounded-xs space-y-2">
                <span className="font-bold text-accent-champagne text-[10px] uppercase tracking-wider block">RECRUITER EXECUTIVE DOSSIER</span>
                <p className="text-graphite dark:text-paper-ivory text-xs font-bold">PARTH AVHAD'S OFFICIAL RESUME (PDF)</p>
                <a
                  href="/PARTHRESUME.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download="PARTHRESUME.pdf"
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-graphite text-paper-ivory dark:bg-paper-ivory dark:text-graphite font-bold text-xs uppercase tracking-wider rounded-xs hover:bg-accent-champagne hover:text-graphite transition-all shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4 text-accent-champagne" />
                  <span>DOWNLOAD RESUME (PDF)</span>
                </a>
              </div>

              <div className="space-y-4 text-editorial-grey">
                <div>
                  <strong className="text-graphite dark:text-paper-ivory block mb-1">PUBLICATION</strong>
                  <p>PARTH AVHAD (Issue 001, Vol 1)</p>
                </div>

                <div>
                  <strong className="text-graphite dark:text-paper-ivory block mb-1">CREATIVE ENGINEER & EDITOR</strong>
                  <p>Parth Avhad • Mumbai, India</p>
                </div>

                <div>
                  <strong className="text-graphite dark:text-paper-ivory block mb-1">DIRECT CONTACT DIRECTORY</strong>
                  <div className="space-y-2 mt-2">
                    <a href={`tel:${magazineIssueData.contact.phone}`} className="flex items-center gap-2 text-graphite dark:text-paper-ivory hover:text-accent-champagne transition-colors">
                      <Phone className="w-3.5 h-3.5 text-accent-champagne" />
                      <span>{magazineIssueData.contact.phone}</span>
                    </a>
                    <a href={`mailto:${magazineIssueData.contact.email}`} className="flex items-center gap-2 text-graphite dark:text-paper-ivory hover:text-accent-champagne transition-colors">
                      <Mail className="w-3.5 h-3.5 text-accent-champagne" />
                      <span>{magazineIssueData.contact.email}</span>
                    </a>
                    <a href={magazineIssueData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-graphite dark:text-paper-ivory hover:text-accent-champagne transition-colors">
                      <LinkedinIcon className="w-3.5 h-3.5 text-accent-champagne" />
                      <span>linkedin.com/in/parthavhad</span>
                    </a>
                    <a href={magazineIssueData.contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-graphite dark:text-paper-ivory hover:text-accent-champagne transition-colors">
                      <GithubIcon className="w-3.5 h-3.5 text-accent-champagne" />
                      <span>github.com/AvhadParth</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-paper-border text-[10px] text-editorial-grey space-y-1">
                <p>© 2026 PARTH AVHAD. ALL RIGHTS RESERVED.</p>
                <p>TYPESET IN BODONI MODA & INTER. PRINTED ON DIGITAL PAPER.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
