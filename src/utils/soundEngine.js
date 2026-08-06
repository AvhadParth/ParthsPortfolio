// Tactile Web Audio Synthesizer for PARTH AVHAD Editorial Magazine
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true; // Enabled by default
    this.unlocked = false;
    this.lastScrollTime = 0;

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

  // Mimics physical paper turn / rustle (Audible & Rich)
  playPaperTurn() {
    if (!this.enabled) return;
    this.unlockAudio();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.15; // 150ms
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink/filtered noise for crisp paper friction
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.15);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      console.warn('Audio playback hindered:', e);
    }
  }

  // Soft tactile paper slide sound for scrolling between sections (Audible & Throttled)
  playScrollRustle() {
    if (!this.enabled) return;
    const now = Date.now();
    if (now - this.lastScrollTime < 200) return; // Throttle to max once every 200ms
    this.lastScrollTime = now;

    this.unlockAudio();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.1; // 100ms rustle
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      console.warn('Scroll audio hindered:', e);
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
      osc.frequency.exponentialRampToValueAtTime(250, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
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
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.warn('Audio stamp hindered:', e);
    }
  }
}

export const soundEngine = new SoundEngine();
