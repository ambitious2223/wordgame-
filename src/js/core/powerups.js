/**
 * Gift -> power-up mapping and effect application.
 * Effects are applied through an injected context so they stay testable.
 */

export const POWERUP_TYPES = Object.freeze({
  ADD_TIME: "add_time",
  REVEAL_LETTER: "reveal_letter",
  SCORE_MULTIPLIER: "score_multiplier",
  FREEZE_TIMER: "freeze_timer",
  LENGTH_HINT: "length_hint"
});

/**
 * Effect keys this game understands. The streamer maps gifts -> these keys in
 * the Tikora hub UI; the game never knows gift names.
 * Documented in docs/HUB_INTEGRATION.md.
 * @type {Record<string, {type:string, value:number}>}
 */
export const EFFECT_POWERUP_MAP = Object.freeze({
  time_bonus: { type: POWERUP_TYPES.ADD_TIME, value: 5 },
  reveal_letter: { type: POWERUP_TYPES.REVEAL_LETTER, value: 1 },
  double_points: { type: POWERUP_TYPES.SCORE_MULTIPLIER, value: 2 },
  freeze_timer: { type: POWERUP_TYPES.FREEZE_TIMER, value: 3 },
  length_hint: { type: POWERUP_TYPES.LENGTH_HINT, value: 1 }
});

/**
 * Resolve a hub effect key (+ optional payload overrides) into a power-up.
 * @param {string} effectKey
 * @param {Record<string, any>} [payload]
 * @returns {{type:string, value:number, effectKey:string}|null}
 */
export function resolveEffect(effectKey, payload = {}) {
  const base = EFFECT_POWERUP_MAP[effectKey];
  if (!base) return null;
  const candidate = Number(
    payload?.seconds ?? payload?.amount ?? payload?.multiplier ?? payload?.value ?? payload?.count
  );
  const value = Number.isFinite(candidate) && candidate > 0 ? candidate : base.value;
  return { type: base.type, value, effectKey };
}

/**
 * @typedef {Object} PowerUpContext
 * @property {{addTime?: (s:number)=>void, pause?: ()=>void, resume?: ()=>void}} [timer]
 * @property {{getRemainingTargets?: ()=>string[], getWordShape?: (w:string)=>string, armNextWordMultiplier?: (m:number)=>void, applyScoreMultiplier?: (m:number)=>void}} [engine]
 * @property {(message:string, powerUp:object)=>void} [notify]
 * @property {{shape:string, letter:string, word:string, index:number}|null} [hint]
 * @property {string[]} [shapes]
 */

/**
 * @param {{type:string, value:number}} powerUp
 * @param {PowerUpContext} [context]
 * @returns {{applied:boolean, effect?:string, value?:any, reason?:string}}
 */
export function applyPowerUp(powerUp, context = {}) {
  if (!powerUp) return { applied: false, reason: "unmapped" };
  const { timer, engine, notify, hint, shapes } = context;

  switch (powerUp.type) {
    case POWERUP_TYPES.ADD_TIME:
      timer?.addTime?.(powerUp.value);
      notify?.(`+${powerUp.value}s`, powerUp);
      return { applied: true, effect: "time", value: powerUp.value };

    case POWERUP_TYPES.REVEAL_LETTER: {
      // `hint` is provided by the manager (random hidden position); fall back to
      // the first letter of a remaining word when used standalone.
      const fallbackLetter = (engine?.getRemainingTargets?.() ?? [])[0]?.[0] ?? null;
      const resolved = hint ?? (fallbackLetter ? { letter: fallbackLetter, shape: fallbackLetter } : null);
      if (!resolved) {
        notify?.("🔍", powerUp);
        return { applied: false, reason: "no-target", effect: "reveal", value: null };
      }
      notify?.(`🔍 ${resolved.shape}`, powerUp);
      return { applied: true, effect: "reveal", value: resolved };
    }

    case POWERUP_TYPES.SCORE_MULTIPLIER:
      if (typeof engine?.armNextWordMultiplier === "function") {
        engine.armNextWordMultiplier(powerUp.value);
      } else {
        engine?.applyScoreMultiplier?.(powerUp.value);
      }
      notify?.(`✨ ×${powerUp.value}`, powerUp);
      return { applied: true, effect: "multiplier", value: powerUp.value };

    case POWERUP_TYPES.FREEZE_TIMER:
      timer?.pause?.();
      notify?.(`❄️ ${powerUp.value}s`, powerUp);
      return { applied: true, effect: "freeze", value: powerUp.value };

    case POWERUP_TYPES.LENGTH_HINT: {
      const resolvedShapes =
        shapes ??
        (engine?.getRemainingTargets?.() ?? []).map((word) =>
          typeof engine?.getWordShape === "function" ? engine.getWordShape(word) : word
        );
      if (!resolvedShapes.length) {
        return { applied: false, reason: "no-target", effect: "length_hint", value: [] };
      }
      notify?.(`📏 ${resolvedShapes.join(" · ")}`, powerUp);
      return { applied: true, effect: "length_hint", value: resolvedShapes };
    }

    default:
      return { applied: false, reason: "unknown" };
  }
}
