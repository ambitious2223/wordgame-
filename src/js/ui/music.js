/**
 * Real, royalty-free (CC0 / public-domain) background music.
 *
 * Tracks are bundled under `src/assets/sounds/music/` so the game works fully
 * offline. Playback uses HTMLAudioElement (looped) with play/pause/prev/next,
 * a track picker, and volume. Degrades to a safe no-op when the Audio API is
 * unavailable (tests, restricted browsers).
 *
 * Licenses/sources: see `src/assets/sounds/music/CREDITS.md`.
 */

/** @typedef {{id: string, name: string, file: string, mood: string}} MusicTrack */

/** Base path relative to the page (src/index.html). */
const BASE = "./assets/sounds/music/";

/** @type {MusicTrack[]} */
export const MUSIC_TRACKS = [
  { id: "neon", name: "Neon", file: "lofi-vanilla.mp3", mood: "lofi" },
  { id: "chill", name: "Chill", file: "chill-mellow.mp3", mood: "chill" },
  { id: "focus", name: "Focus", file: "chill-keys.mp3", mood: "study" },
  { id: "lofi", name: "Lo-Fi", file: "lofi-loafy.mp3", mood: "lofi" },
  { id: "cinematic", name: "Cinematic", file: "lofi-cinematic.mp3", mood: "cinematic" },
  { id: "forest", name: "Forest", file: "ambient-forest.mp3", mood: "ambient" },
  { id: "space", name: "Space", file: "ambient-space.mp3", mood: "ambient" }
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
 * @param {{AudioElementCtor?: any, enabled?: boolean, volume?: number, track?: string, autoPlayOnSwitch?: boolean}} [options]
 */
export function createMusicManager(options = {}) {
  const globalScope = /** @type {any} */ (globalThis);
  const AudioCtor = options.AudioElementCtor ?? globalScope.Audio ?? null;

  let enabled = options.enabled ?? false;
  let volume = clamp(options.volume ?? 0.3, 0, 1);
  let trackIndex = 0;

  if (options.track) {
    const i = MUSIC_TRACKS.findIndex((t) => t.id === options.track);
    if (i >= 0) trackIndex = i;
  }

  /** @type {any} */
  let audio = null;

  const currentTrack = () => MUSIC_TRACKS[trackIndex];

  function ensureAudio() {
    if (!AudioCtor) return false;
    if (!audio) {
      try {
        audio = new AudioCtor(BASE + currentTrack().file);
        audio.loop = true;
        audio.volume = volume;
        audio.preload = "auto";
      } catch {
        audio = null;
        return false;
      }
    }
    return true;
  }

  function isPlaying() {
    return Boolean(audio && !audio.paused && audio.currentTime > 0);
  }

  function start() {
    if (!enabled) return false;
    if (!ensureAudio() || !audio) return false;
    try {
      const promise = audio.play();
      if (promise && typeof promise.catch === "function") promise.catch(() => {});
      return true;
    } catch {
      return false;
    }
  }

  function stop() {
    if (!audio) return;
    try {
      audio.pause();
    } catch {
      /* ignore */
    }
  }

  function pause() {
    if (!audio) return false;
    try {
      audio.pause();
      return true;
    } catch {
      return false;
    }
  }

  function resume() {
    return start();
  }

  /** @param {string} id */
  function setTrack(id) {
    const i = MUSIC_TRACKS.findIndex((t) => t.id === id);
    if (i < 0) return currentTrack();
    trackIndex = i;
    const wasPlaying = isPlaying();
    if (audio) {
      try {
        audio.pause();
      } catch {
        /* ignore */
      }
      audio = null;
    }
    if (enabled && (wasPlaying || options.autoPlayOnSwitch !== false)) {
      start();
    }
    return currentTrack();
  }

  function next() {
    return setTrack(MUSIC_TRACKS[(trackIndex + 1) % MUSIC_TRACKS.length].id);
  }

  function prev() {
    return setTrack(MUSIC_TRACKS[(trackIndex - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length].id);
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
    if (audio) audio.volume = volume;
  }

  function dispose() {
    stop();
    audio = null;
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
      return Boolean(audio && !audio.paused);
    },
    get paused() {
      return Boolean(audio && audio.paused);
    },
    get volume() {
      return volume;
    },
    get track() {
      return currentTrack();
    },
    get tracks() {
      return MUSIC_TRACKS.map((t) => ({ id: t.id, name: t.name, mood: t.mood }));
    }
  };
}