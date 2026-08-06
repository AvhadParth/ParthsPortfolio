import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { magazineIssueData } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';
import { Mail, Phone, Send, CheckCircle2, Stamp } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import confetti from 'canvas-confetti';

export function ColophonBackCover() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    soundEngine.playStamp();
    setSubmitted(true);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#C5A059', '#161616', '#b91c1c']
      });
    } catch (err) {
      console.log('Confetti effect fired');
    }
  };

  return (
    <section id="chapter-07" className="min-h-screen py-20 px-4 sm:px-8 lg:px-12 border-b border-paper-border bg-paper-ivory dark:bg-paper-ivory-dark select-none">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Top Bar */}
        <div className="flex justify-between items-center font-mono-editorial text-xs text-editorial-grey border-b border-paper-border pb-4 mb-12">
          <span>CHAPTER 07 / COLOPHON & CORRESPONDENCE</span>
          <span>PAGE 44 – 48</span>
          <span className="font-bold text-graphite dark:text-paper-ivory">BACK COVER</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Realistic Physical Letter to the Editor Envelope */}
          <div className="lg:col-span-7">
            <div className="mb-6">
              <span className="font-mono-editorial text-xs tracking-widest text-accent-champagne block mb-2 font-bold uppercase">
                CORRESPONDENCE & INQUIRIES
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-graphite dark:text-paper-ivory">
                LETTER TO THE EDITOR
              </h2>
            </div>

            {/* Tactile Airmail Stationery Letter Container */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-6 sm:p-10 border-2 border-graphite/30 dark:border-paper-border bg-[#F5F2E9] dark:bg-[#1C1C1C] rounded-sm shadow-2xl overflow-hidden font-mono-editorial"
            >
              {/* Airmail Red & Blue Border Top Stripe */}
              <div 
                className="absolute top-0 inset-x-0 h-2 opacity-80"
                style={{
                  background: 'repeating-linear-gradient(135deg, #b91c1c, #b91c1c 15px, #f5f2e9 15px, #f5f2e9 25px, #1d4ed8 25px, #1d4ed8 40px, #f5f2e9 40px, #f5f2e9 50px)'
                }}
              />

              {/* Vintage Postal Cancellation Seal Stamp */}
              <div className="absolute top-6 right-6 w-24 h-24 rounded-full border-2 border-dashed border-red-800/40 dark:border-accent-champagne/40 flex flex-col items-center justify-center rotate-12 text-[9px] text-red-900/60 dark:text-accent-champagne/60 font-bold pointer-events-none uppercase text-center p-1">
                <span>AIR MAIL</span>
                <span className="text-[7px]">MUMBAI 2026</span>
                <span className="text-[10px]">PARTH AVHAD</span>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-accent-champagne mx-auto animate-bounce" />
                  <h3 className="font-display text-3xl font-extrabold text-graphite dark:text-paper-ivory">
                    LETTER SEALED & TRANSMITTED
                  </h3>
                  <p className="text-xs text-editorial-grey max-w-md mx-auto">
                    Your correspondence has been logged into Parth Avhad's editor inbox. Expect a personal reply shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-2.5 border border-graphite text-xs font-bold text-graphite dark:text-paper-ivory hover:bg-graphite hover:text-paper-ivory transition-colors cursor-pointer"
                  >
                    WRITE ANOTHER LETTER
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 text-xs text-graphite dark:text-paper-ivory">
                  {/* Letter Header Metadata */}
                  <div className="border-b border-paper-border pb-4 space-y-2 text-[11px] text-editorial-grey">
                    <p><strong className="text-graphite dark:text-paper-ivory">TO:</strong> PARTH AVHAD (Editor-in-Chief)</p>
                    <p><strong className="text-graphite dark:text-paper-ivory">LOCATION:</strong> MUMBAI, INDIA</p>
                    <p><strong className="text-graphite dark:text-paper-ivory">DATE:</strong> AUGUST 2026</p>
                  </div>

                  {/* Inputs styled like fill-in-the-blank typewriter fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-editorial-grey uppercase font-bold block text-[10px]">FROM (YOUR NAME / ORG):</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Eleanor Vance (Vogue Labs)"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-3 py-2 bg-transparent border-b-2 border-graphite/40 dark:border-paper-ivory/40 focus:border-accent-champagne outline-none text-graphite dark:text-paper-ivory font-bold transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-editorial-grey uppercase font-bold block text-[10px]">RETURN EMAIL ADDRESS:</label>
                      <input 
                        type="email" 
                        required
                        placeholder="e.g. eleanor@vogue.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-3 py-2 bg-transparent border-b-2 border-graphite/40 dark:border-paper-ivory/40 focus:border-accent-champagne outline-none text-graphite dark:text-paper-ivory font-bold transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-editorial-grey uppercase font-bold block text-[10px]">CORRESPONDENCE SUBJECT:</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Creative Engineering Role / Project Inquiry"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-transparent border-b-2 border-graphite/40 dark:border-paper-ivory/40 focus:border-accent-champagne outline-none text-graphite dark:text-paper-ivory font-bold transition-colors"
                    />
                  </div>

                  {/* Lined Notebook Stationery Textarea */}
                  <div className="space-y-1">
                    <label className="text-editorial-grey uppercase font-bold block text-[10px]">LETTER BODY / MESSAGE:</label>
                    <textarea 
                      rows={6}
                      required
                      placeholder="Dear Editor, I am writing regarding..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full p-4 bg-paper-ivory/60 dark:bg-paper-card/60 border border-paper-border focus:border-accent-champagne outline-none text-graphite dark:text-paper-ivory font-sans-editorial text-sm leading-relaxed transition-colors resize-none rounded-xs"
                    />
                  </div>

                  {/* Red Wax Seal Submit Button */}
                  <div className="pt-4 flex justify-end">
                    <motion.button 
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => soundEngine.playHoverClick()}
                      className="px-8 py-3.5 bg-red-900 text-white font-bold tracking-widest uppercase hover:bg-accent-champagne hover:text-graphite transition-all flex items-center gap-3 cursor-pointer shadow-xl rounded-xs border border-red-700"
                    >
                      <Stamp className="w-4 h-4 text-accent-champagne" />
                      <span>SEAL & TRANSMIT LETTER</span>
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>

          {/* Right Column: Colophon & Social Directory */}
          <div className="lg:col-span-5 space-y-8 font-mono-editorial text-xs">
            <div className="p-6 border border-paper-border bg-paper-ivory-warm dark:bg-paper-card space-y-6">
              <h3 className="font-display text-2xl font-bold text-graphite dark:text-paper-ivory border-b border-paper-border pb-3">
                EDITORIAL COLOPHON
              </h3>

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

                <div className="border-t border-paper-border pt-4 text-[10px]">
                  <p>© 2026 PARTH AVHAD. ALL RIGHTS RESERVED.</p>
                  <p className="mt-1">TYPESET IN BODONI MODA & INTER. PRINTED ON DIGITAL PAPER.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
