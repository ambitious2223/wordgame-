/**
 * Procedural sound effects (Web Audio) for game events — no audio files needed.
 * Safe no-op when Web Audio is unavailable.
 *
 * Each effect is a list of notes: { f: hz, o: offsetSec, d: durationSec, t: wave }.
 */

export const SFX = Object.freeze({
  correct: [
    { f: 659.25, o: 0, d: 0.12, t: "triangle" },
    { f: 987.77, o: 0.1, d: 0.18, t: "triangle" }
  ],
  wrong: [
    { f: 196.0, o: 0, d: 0.18, t: "square" },
    { f: 146.83, o: 0.14, d: 0.26, t: "square" }
  ],
  tick: [{ f: 880.0, o: 0, d: 0.06, t: "sine" }],
  roundStart: [
    { f: 523.25, o: 0, d: 0.12, t: "square" },
    { f: 659.25, o: 0.12, d: 0.12, t: "square" },
    { f: 783.99, o: 0.24, d: 0.2, t: "square" }
  ],
  roundEnd: [
    { f: 783.99, o: 0, d: 0.15, t: "triangle" },
    { f: 523.25, o: 0.15, d: 0.3, t: "triangle" }
  ],
  gameOver: [
    { f: 523.25, o: 0, d: 0.15, t: "triangle" },
    { f: 659.25, o: 0.15, d: 0.15, t: "triangle" },
    { f: 783.99, o: 0.3, d: 0.15, t: "triangle" },
    { f: 1046.5, o: 0.45, d: 0.4, t: "triangle" }
  ],
  powerUp: [
    { f: 880.0, o: 0, d: 0.08, t: "triangle" },
    { f: 1174.66, o: 0.07, d: 0.08, t: "triangle" },
    { f: 1567.98, o: 0.14, d: 0.16, t: "triangle" }
  ],
  join: [
    { f: 440.0, o: 0, d: 0.1, t: "sine" },
    { f: 659.25, o: 0.08, d: 0.12, t: "sine" }
  ]
});

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * @param {{AudioContextCtor?: any, enabled?: boolean, volume?: number}} [options]
 */
export function createSfxManager(options = {}) {
  const globalScope = /** @type {any} */ (globalThis);
  const Ctor =
    options.AudioContextCtor ??
    globalScope.AudioContext ??
    globalScope.webkitAudioContext ??
    null;

  let ctx = null;
  let master = null;
  let enabled = options.enabled ?? true;
  let volume = clamp(options.volume ?? 0.5, 0, 1);

  function ensureContext() {
    if (!Ctor) return false;
    if (!ctx) {
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
    }
    return true;
  }

  /**
   * @param {string} name
   * @returns {boolean} whether a sound was scheduled
   */
  function play(name) {
    if (!enabled) return false;
    const notes = SFX[name];
    if (!notes) return false;
    if (!ensureContext() || !ctx || !master) return false;
    if (typeof ctx.resume === "function") ctx.resume();
    const start = ctx.currentTime + 0.01;
    for (const note of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const at = start + note.o;
      osc.type = note.t;
      osc.frequency.setValueAtTime(note.f, at);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.35, at + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + note.d);
      osc.connect(gain);
      gain.connect(master);
      osc.start(at);
      osc.stop(at + note.d + 0.02);
    }
    return true;
  }

  function setEnabled(value) {
    enabled = Boolean(value);
  }

  function setVolume(value) {
    volume = clamp(value, 0, 1);
    if (master) master.gain.value = volume;
  }

  function dispose() {
    if (ctx && typeof ctx.close === "function") ctx.close();
    ctx = null;
    master = null;
  }

  return {
    play,
    setEnabled,
    setVolume,
    dispose,
    get enabled() {
      return enabled;
    },
    get volume() {
      return volume;
    }
  };
}
