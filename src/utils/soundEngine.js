// No-op Sound Engine Shim (Audio concept completely removed)
class SoundEngine {
  init() {}
  toggleSound() { return false; }
  playPaperTurn() {}
  playScrollRustle() {}
  playHoverClick() {}
  playStamp() {}
}

export const soundEngine = new SoundEngine();
