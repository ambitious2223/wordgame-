/**
 * Procedural background music using the Web Audio API (no audio files needed).
 * Multiple selectable tracks + play/pause/next/prev transport.
 * Degrades to a safe no-op when Web Audio is unavailable (tests, old browsers).
 */

/**
 * Each track is a small loop: `step` seconds per note, `melody`/`bass` are
 * indices into `scale` (-1 = rest), and `wave` sets the oscillator timbre.
 */
export const MUSIC_TRACKS = [
  {
    id: "neon",
    name: "Neon",
    step: 0.25,
    wave: "triangle",
    bassWave: "sine",
    scale: [220.0, 246.94, 277.18, 329.63, 369.99, 440.0],
    melody: [0, -1, 2, 3, 4, 3, 2, -1, 0, 2, 4, 5, 4, 2, 1, -1],
    bass: [0, -1, -1, -1, 2, -1, -1, -1, 3, -1, -1, -1, 2, -1, -1, -1]
  },
  {
    id: "chill",
    name: "Chill",
    step: 0.4,
    wave: "sine",
    bassWave: "sine",
    scale: [196.0, 220.0, 246.94, 293.66, 329.63, 392.0],
    melody: [0, -1, -1, 2, -1, 3, -1, -1, 2, -1, 1, -1, -1, -1, -1, -1],
    bass: [0, -1, -1, -1, -1, -1, -1, -1, 2, -1, -1, -1, -1, -1, -1, -1]
  },
  {
    id: "arcade",
    name: "Arcade",
    step: 0.15,
    wave: "square",
    bassWave: "square",
    scale: [261.63, 293.66, 329.63, 349.23, 392.0, 440.0],
    melody: [0, 1, 2, 3, 2, 1, 0, -1, 4, 5, 4, 3, 2, 3, 4, -1],
    bass: [0, -1, 0, -1, 2, -1, 2, -1, 3, -1, 3, -1, 2, -1, 2, -1]
  },
  {
    id: "ambient",
    name: "Ambient",
    step: 0.6,
    wave: "sine",
    bassWave: "sine",
    scale: [174.61, 196.0, 220.0, 261.63, 293.66, 349.23],
    melody: [0, -1, -1, -1, -1, -1, 4, -1, 3, -1, -1, -1, -1, -1, 2, -1],
    bass: [0, -1, -1, -1, 2, -1, -1, -1, 1, -1, -1, -1, 3, -1, -1, -1]
  },
  {
    id: "focus",
    name: "Focus",
    step: 0.3,
    wave: "triangle",
    bassWave: "triangle",
    scale: [220.0, 246.94, 277.18, 329.63, 392.0, 440.0],
    melody: [0, -1, 1, -1, 2, -1, 1, -1, 0, -1, 1, -1, 2, -1, 3, -1],
    bass: [0, -1, -1, -1, 0, -1, -1, -1, 2, -1, -1, -1, 2, -1, -1, -1]
  }
];

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * @param {{AudioContextCtor?: any, enabled?: boolean, volume?: number, track?: string}} [options]
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
  /** @type {ReturnType<typeof setInterval>|null} */
  let loop = null;
  let enabled = options.enabled ?? false;
  let volume = clamp(options.volume ?? 0.3, 0, 1);
  let playing = false;
  let paused = false;
  let trackIndex = 0;

  if (options.track) {
    const i = MUSIC_TRACKS.findIndex((t) => t.id === options.track);
    if (i >= 0) trackIndex = i;
  }

  const currentTrack = () => MUSIC_TRACKS[trackIndex];

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
   * @param {string} type
   * @param {number} level
   */
  function playNote(frequency, at, duration, type, level) {
    if (!ctx || !master) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, at);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(level, at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    osc.connect(gain);
    gain.connect(master);
    osc.start(at);
    osc.stop(at + duration + 0.02);
  }

  /** @param {number} startAt */
  function scheduleBar(startAt) {
    const t = currentTrack();
    for (let i = 0; i < t.melody.length; i += 1) {
      const at = startAt + i * t.step;
      if (t.melody[i] >= 0) playNote(t.scale[t.melody[i]], at, t.step * 0.9, t.wave, 0.3);
      if (t.bass[i] >= 0) playNote(t.scale[t.bass[i]] / 2, at, t.step * 1.6, t.bassWave, 0.22);
    }
  }

  function clearLoop() {
    if (loop) {
      clearInterval(loop);
      loop = null;
    }
  }

  function startLoop() {
    const t = currentTrack();
    const barMs = t.melody.length * t.step * 1000;
    loop = setInterval(() => {
      if (playing && !paused && ctx) scheduleBar(ctx.currentTime + 0.1);
    }, barMs);
  }

  function start() {
    if (playing && !paused) return true;
    if (!enabled) return false;
    if (!ensureContext() || !ctx) return false;
    if (typeof ctx.resume === "function") ctx.resume();
    playing = true;
    paused = false;
    scheduleBar(ctx.currentTime + 0.1);
    startLoop();
    return true;
  }

  function stop() {
    playing = false;
    paused = false;
    clearLoop();
  }

  function pause() {
    if (!playing || paused) return false;
    paused = true;
    clearLoop();
    return true;
  }

  function resume() {
    if (!playing || !paused) return false;
    paused = false;
    if (ctx) scheduleBar(ctx.currentTime + 0.1);
    startLoop();
    return true;
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

  /**
   * @param {string} id
   * @returns {{id:string, name:string}}
   */
  function setTrack(id) {
    const i = MUSIC_TRACKS.findIndex((t) => t.id === id);
    if (i < 0) return currentTrack();
    trackIndex = i;
    if (playing && !paused && ctx) {
      clearLoop();
      scheduleBar(ctx.currentTime + 0.1);
      startLoop();
    }
    return currentTrack();
  }

  function next() {
    return setTrack(MUSIC_TRACKS[(trackIndex + 1) % MUSIC_TRACKS.length].id);
  }

  function prev() {
    return setTrack(MUSIC_TRACKS[(trackIndex - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length].id);
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
    pause,
    resume,
    setEnabled,
    setVolume,
    setTrack,
    next,
    prev,
    dispose,
    get enabled() {
      return enabled;
    },
    get playing() {
      return playing;
    },
    get paused() {
      return paused;
    },
    get volume() {
      return volume;
    },
    get track() {
      return currentTrack();
    },
    get tracks() {
      return MUSIC_TRACKS.map((t) => ({ id: t.id, name: t.name }));
    }
  };
}
