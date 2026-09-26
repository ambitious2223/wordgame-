/**
 * Procedural background music using the Web Audio API (no audio files needed).
 * Degrades to a safe no-op when Web Audio is unavailable (tests, old browsers).
 */

const SCALE = [220.0, 246.94, 277.18, 329.63, 369.99, 440.0];
const MELODY = [0, -1, 2, 3, 4, 3, 2, -1, 0, 2, 4, 5, 4, 2, 1, -1];
const BASS = [0, -1, -1, -1, 2, -1, -1, -1, 3, -1, -1, -1, 2, -1, -1, -1];
const STEP = 0.25;
const BAR_MS = MELODY.length * STEP * 1000;

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
export function createMusicManager(options = {}) {
  const globalScope = /** @type {any} */ (globalThis);
  const Ctor =
    options.AudioContextCtor ??
    globalScope.AudioContext ??
    globalScope.webkitAudioContext ??
    null;
  let ctx = null;
  let master = null;
  let loop = null;
  let enabled = options.enabled ?? false;
  let volume = clamp(options.volume ?? 0.3, 0, 1);
  let playing = false;

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
   * @param {number} frequency
   * @param {number} at
   * @param {number} duration
   * @param {OscillatorType} type
   */
  function playNote(frequency, at, duration, type) {
    if (!ctx || !master) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, at);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.32, at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    osc.connect(gain);
    gain.connect(master);
    osc.start(at);
    osc.stop(at + duration + 0.02);
  }

  /** @param {number} startAt */
  function scheduleBar(startAt) {
    for (let i = 0; i < MELODY.length; i += 1) {
      const at = startAt + i * STEP;
      if (MELODY[i] >= 0) playNote(SCALE[MELODY[i]], at, STEP * 0.9, "triangle");
      if (BASS[i] >= 0) playNote(SCALE[BASS[i]] / 2, at, STEP * 1.6, "sine");
    }
  }

  function start() {
    if (playing) return true;
    if (!enabled) return false;
    if (!ensureContext() || !ctx) return false;
    if (typeof ctx.resume === "function") ctx.resume();
    playing = true;
    scheduleBar(ctx.currentTime + 0.1);
    loop = setInterval(() => {
      if (playing && ctx) scheduleBar(ctx.currentTime + 0.1);
    }, BAR_MS);
    return true;
  }

  function stop() {
    playing = false;
    if (loop) {
      clearInterval(loop);
      loop = null;
    }
  }

  /** @param {boolean} value */
  function setEnabled(value) {
    enabled = Boolean(value);
    if (enabled) start();
    else stop();
  }

  /** @param {number} value */
  function setVolume(value) {
    volume = clamp(value, 0, 1);
    if (master) master.gain.value = volume;
  }

  function dispose() {
    stop();
    if (ctx && typeof ctx.close === "function") ctx.close();
    ctx = null;
    master = null;
  }

  return {
    start,
    stop,
    setEnabled,
    setVolume,
    dispose,
    get enabled() {
      return enabled;
    },
    get playing() {
      return playing;
    },
    get volume() {
      return volume;
    }
  };
}
