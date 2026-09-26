import { POWERUP_DEFAULTS } from "../config.js";
import { POWERUP_TYPES, applyPowerUp } from "./powerups.js";
import { randomInt as defaultRandomInt } from "./rng.js";

/**
 * Owns the stateful side of power-ups: balance caps, the off-round queue,
 * the freeze lifecycle, and hint generation. Stateless effect application is
 * delegated to `applyPowerUp`.
 *
 * @param {Object} [options]
 * @param {import('./engine.js').GameEngine|null} [options.engine]
 * @param {{addTime?: (s:number)=>void, pause?: ()=>void, resume?: ()=>void}} [options.timer]
 * @param {typeof POWERUP_DEFAULTS} [options.config]
 * @param {(message:string, meta:object)=>void} [options.onNotify]
 * @param {(maxExclusive:number)=>number} [options.randomInt]
 */
export function createPowerUpManager(options = {}) {
  const engine = options.engine ?? null;
  const timer = options.timer ?? null;
  const config = options.config ?? POWERUP_DEFAULTS;
  const onNotify = options.onNotify ?? null;
  const randomInt = options.randomInt ?? defaultRandomInt;

  /** @type {Array<{powerUp:any, meta:any}>} */
  let pending = [];
  /** @type {Record<string, number>} */
  let counts = {};
  let secondsAdded = 0;
  let freezeSeconds = 0;
  /** @type {ReturnType<typeof setTimeout>|null} */
  let freezeTimeout = null;

  function isRoundActive() {
    return Boolean(engine && engine.getState && engine.getState().roundActive);
  }

  function notify(message, meta) {
    if (!onNotify) return;
    const who = meta && meta.username ? `${meta.username} ` : "";
    onNotify(`${who}${message}`, meta || {});
  }

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  function revealHint() {
    if (!engine || typeof engine.getRemainingTargets !== "function") return null;
    const remaining = engine.getRemainingTargets();
    if (!remaining.length) return null;
    const word = remaining[randomInt(remaining.length)];
    const index = randomInt(word.length);
    const letter = word[index];
    const shape = word
      .split("")
      .map((ch, i) => (i === index ? ch : "_"))
      .join("");
    return { word, index, letter, shape };
  }

  function lengthShapes() {
    if (!engine || typeof engine.getRemainingTargets !== "function") return [];
    return engine.getRemainingTargets().map((word) =>
      typeof engine.getWordShape === "function" ? engine.getWordShape(word) : word
    );
  }

  function clearFreezeTimeout() {
    if (freezeTimeout) {
      clearTimeout(freezeTimeout);
      freezeTimeout = null;
    }
  }

  /**
   * Apply an effect immediately (a round must be active).
   * @param {any} powerUp
   * @param {any} meta
   */
  function applyNow(powerUp, meta) {
    const key = powerUp.effectKey || powerUp.type;
    const defaults = config[key] || {};
    const passThrough = (message) => notify(message, meta);

    if (powerUp.type === POWERUP_TYPES.ADD_TIME) {
      const requested = clamp(powerUp.value ?? defaults.seconds ?? 5, 1, defaults.maxPerUse ?? 15);
      const room = (defaults.maxPerRound ?? 20) - secondsAdded;
      const seconds = Math.min(requested, Math.max(0, room));
      if (seconds <= 0) return { ok: false, reason: "capped" };
      secondsAdded += seconds;
      const result = applyPowerUp({ ...powerUp, value: seconds }, { timer, engine, notify: passThrough });
      return { ok: true, ...result };
    }

    if (powerUp.type === POWERUP_TYPES.FREEZE_TIMER) {
      const requested = clamp(powerUp.value ?? defaults.seconds ?? 3, 1, defaults.maxPerUse ?? 5);
      const room = (defaults.maxPerRound ?? 8) - freezeSeconds;
      const seconds = Math.min(requested, Math.max(0, room));
      if (seconds <= 0) return { ok: false, reason: "capped" };
      freezeSeconds += seconds;
      clearFreezeTimeout();
      const result = applyPowerUp({ ...powerUp, value: seconds }, { timer, engine, notify: passThrough });
      freezeTimeout = setTimeout(() => {
        freezeTimeout = null;
        if (timer && typeof timer.resume === "function" && isRoundActive()) timer.resume();
      }, seconds * 1000);
      return { ok: true, ...result };
    }

    if (powerUp.type === POWERUP_TYPES.REVEAL_LETTER) {
      if ((counts.reveal_letter || 0) >= (defaults.maxPerRound ?? 2)) return { ok: false, reason: "capped" };
      const hint = revealHint();
      if (!hint) return { ok: false, reason: "no-target" };
      counts.reveal_letter = (counts.reveal_letter || 0) + 1;
      const result = applyPowerUp(powerUp, { timer, engine, notify: passThrough, hint });
      return { ok: true, ...result };
    }

    if (powerUp.type === POWERUP_TYPES.LENGTH_HINT) {
      if ((counts.length_hint || 0) >= (defaults.maxPerRound ?? 1)) return { ok: false, reason: "capped" };
      const shapes = lengthShapes();
      if (!shapes.length) return { ok: false, reason: "no-target" };
      counts.length_hint = (counts.length_hint || 0) + 1;
      const result = applyPowerUp(powerUp, { timer, engine, notify: passThrough, shapes });
      return { ok: true, ...result };
    }

    if (powerUp.type === POWERUP_TYPES.SCORE_MULTIPLIER) {
      const multiplier = clamp(powerUp.value ?? defaults.multiplier ?? 2, 1, defaults.maxMultiplier ?? 3);
      const result = applyPowerUp({ ...powerUp, value: multiplier }, { timer, engine, notify: passThrough });
      return { ok: true, ...result };
    }

    return { ok: false, reason: "unknown" };
  }

  return {
    /**
     * Queue when no round is active, otherwise apply now.
     * @param {any} powerUp
     * @param {any} [meta]
     * @returns {{ok:boolean, reason?:string, queued?:boolean, applied?:boolean, effect?:string, value?:any}}
     */
    apply(powerUp, meta = {}) {
      if (!powerUp || !powerUp.type) return { ok: false, reason: "unmapped" };
      if (!isRoundActive()) {
        pending.push({ powerUp, meta });
        return { ok: true, queued: true };
      }
      return applyNow(powerUp, meta);
    },
    /** Reset caps and flush the queued effects for the new round. */
    onRoundStart() {
      const queued = pending;
      pending = [];
      counts = {};
      secondsAdded = 0;
      freezeSeconds = 0;
      clearFreezeTimeout();
      return queued.map((item) => applyNow(item.powerUp, item.meta));
    },
    /** Clear per-round state without resuming a freeze (round is over). */
    onRoundEnd() {
      counts = {};
      secondsAdded = 0;
      freezeSeconds = 0;
      clearFreezeTimeout();
    },
    getPendingCount() {
      return pending.length;
    },
    getActiveFreezeSeconds() {
      return freezeSeconds;
    },
    getSecondsAdded() {
      return secondsAdded;
    }
  };
}
