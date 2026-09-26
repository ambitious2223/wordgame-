/**
 * Guarded audio manager. Never throws when the Audio API is unavailable
 * (e.g. in tests or restricted browsers) and respects the mute switch.
 */
export function createAudioManager({ AudioCtor = globalThis.Audio, muted = false, volume = 0.7 } = {}) {
  let isMuted = Boolean(muted);
  const cache = new Map();

  return {
    get muted() {
      return isMuted;
    },
    setMuted(value) {
      isMuted = Boolean(value);
    },
    /**
     * @param {string} src
     * @returns {boolean} whether playback was attempted
     */
    play(src) {
      if (isMuted || !AudioCtor || !src) return false;
      try {
        let audio = cache.get(src);
        if (!audio) {
          audio = new AudioCtor(src);
          audio.volume = volume;
          cache.set(src, audio);
        }
        audio.currentTime = 0;
        const promise = audio.play?.();
        if (promise && typeof promise.catch === "function") promise.catch(() => {});
        return true;
      } catch {
        return false;
      }
    },
    dispose() {
      cache.clear();
    }
  };
}
