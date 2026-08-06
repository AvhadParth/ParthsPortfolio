// Tactile Web Audio Synthesizer for PARTH AVHAD Editorial Magazine
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true; // Enabled by default
    this.unlocked = false;
    this.lastPageTurnTime = 0;

    // Attach global user interaction listener to bypass browser autoplay policies
    if (typeof window !== 'undefined') {
      const unlockEvents = ['pointerdown', 'touchstart', 'scroll', 'wheel', 'keydown', 'click'];
      const unlockHandler = () => {
        this.unlockAudio();
        unlockEvents.forEach(evt => window.removeEventListener(evt, unlockHandler));
      };
      unlockEvents.forEach(evt => window.addEventListener(evt, unlockHandler, { passive: true }));
    }
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  unlockAudio() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.unlocked = true;
      });
    } else if (this.ctx && this.ctx.state === 'running') {
      this.unlocked = true;
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.unlockAudio();
    }
    return this.enabled;
  }

  // Organic, satisfying physical paper page turn sound (Plays ONCE per section flip)
  playPaperTurn() {
    if (!this.enabled) return;
    const now = Date.now();
    if (now - this.lastPageTurnTime < 700) return; // Strict 700ms throttle guard
    this.lastPageTurnTime = now;

    this.unlockAudio();
    if (!this.ctx) return;

    try {
      const duration = 0.18; // 180ms organic page sweep
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Organic filtered noise simulating paper sliding against paper
      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        // Smooth swell & fade envelope
        const envelope = Math.sin(t * Math.PI) * Math.exp(-t * 2);
        data[i] = (Math.random() * 2 - 1) * envelope;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Low pass filter sweep (starts crisp 1400Hz, drops to deep 280Hz)
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + duration);

      // Volume envelope
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.22, this.ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      console.warn('Paper page audio hindered:', e);
    }
  }

  // Soft tactile tick for UI hovers
  playHoverClick() {
    if (!this.enabled) return;
    this.unlockAudio();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch (e) {
      console.warn('Audio click hindered:', e);
    }
  }

  // Shutter / Stamp click
  playStamp() {
    if (!this.enabled) return;
    this.unlockAudio();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio stamp hindered:', e);
    }
  }
}

export const soundEngine = new SoundEngine();
