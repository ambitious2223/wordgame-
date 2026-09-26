/**
 * Lightweight persistence over Web Storage. Safe to import without a DOM:
 * when no storage is available every operation becomes a no-op.
 */

const SETTINGS_KEY = "tawg.settings.v1";
const BEST_KEY = "tawg.best.v1";
const CHAMPIONS_KEY = "tawg.champions.v1";
const DOCK_KEY = "tawg.dock.v1";

/** @typedef {{name: string, score: number, date: string}} Champion */
/** @typedef {{x: number, y: number, collapsed: boolean}} DockState */

/**
 * @typedef {Object} Settings
 * @property {number} rounds
 * @property {number} duration
 * @property {boolean} muted
 * @property {boolean} musicEnabled
 * @property {number} musicVolume
 * @property {string} locale
 * @property {string} hubSlug
 * @property {string} hubKey
 */

/** @type {Settings} */
export const DEFAULT_SETTINGS = Object.freeze({
  rounds: 10,
  duration: 15,
  muted: false,
  musicEnabled: true,
  musicVolume: 0.3,
  locale: "ar",
  hubSlug: "word-challenge",
  hubKey: ""
});

/**
 * @returns {Storage | null}
 */
export function safeStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/**
 * @param {Storage | null} storage
 * @returns {Settings}
 */
export function loadSettings(storage) {
  if (!storage) return { ...DEFAULT_SETTINGS };
  try {
    const raw = storage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * @param {Storage | null} storage
 * @param {Partial<Settings>} settings
 */
export function saveSettings(storage, settings) {
  if (!storage) return;
  try {
    storage.setItem(SETTINGS_KEY, JSON.stringify({ ...DEFAULT_SETTINGS, ...settings }));
  } catch {
    /* quota or privacy mode: ignore */
  }
}

/**
 * @param {Storage | null} storage
 * @returns {number}
 */
export function loadBestScore(storage) {
  if (!storage) return 0;
  const value = Number(storage.getItem(BEST_KEY));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/**
 * All-time winners, highest score first.
 * @param {Storage | null} storage
 * @returns {Champion[]}
 */
export function loadChampions(storage) {
  if (!storage) return [];
  try {
    const raw = storage.getItem(CHAMPIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry) => entry && typeof entry.name === "string" && Number.isFinite(entry.score))
      .sort((a, b) => b.score - a.score);
  } catch {
    return [];
  }
}

/**
 * Records a game winner, keeping the top `limit` entries.
 * @param {Storage | null} storage
 * @param {{name: string, score: number, date?: string}} champion
 * @param {number} [limit]
 * @returns {Champion[]}
 */
export function addChampion(storage, champion, limit = 10) {
  const entry = {
    name: champion.name,
    score: Math.floor(champion.score) || 0,
    date: champion.date ?? new Date().toISOString()
  };
  const list = [...loadChampions(storage), entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  if (storage) {
    try {
      storage.setItem(CHAMPIONS_KEY, JSON.stringify(list));
    } catch {
      /* ignore */
    }
  }
  return list;
}

/**
 * Position/state of the floating host controls.
 * @param {Storage | null} storage
 * @returns {DockState | null}
 */
export function loadDock(storage) {
  if (!storage) return null;
  try {
    const raw = storage.getItem(DOCK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.x !== "number" || typeof parsed?.y !== "number") return null;
    return { x: parsed.x, y: parsed.y, collapsed: Boolean(parsed.collapsed) };
  } catch {
    return null;
  }
}

/**
 * @param {Storage | null} storage
 * @param {{x: number, y: number, collapsed: boolean}} dock
 */
export function saveDock(storage, dock) {
  if (!storage) return;
  try {
    storage.setItem(
      DOCK_KEY,
      JSON.stringify({ x: Math.round(dock.x), y: Math.round(dock.y), collapsed: Boolean(dock.collapsed) })
    );
  } catch {
    /* ignore */
  }
}

/**
 * @param {Storage | null} storage
 * @param {number} score
 * @returns {number} the (possibly updated) best score
 */
export function saveBestScore(storage, score) {
  const best = Math.max(loadBestScore(storage), Math.floor(score) || 0);
  if (storage) {
    try {
      storage.setItem(BEST_KEY, String(best));
    } catch {
      /* ignore */
    }
  }
  return best;
}
