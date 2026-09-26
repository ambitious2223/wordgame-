/**
 * Central configuration for the game. Single source of truth for tunable values.
 * @typedef {Object} GameConfig
 * @property {number} defaultRounds
 * @property {number} defaultDuration
 * @property {number} minWordLength
 * @property {number} maxWordLength
 * @property {string} localPlayerId
 * @property {string} localPlayerName
 */

/** @type {GameConfig} */
export const CONFIG = Object.freeze({
  defaultRounds: 10,
  defaultDuration: 15,
  minWordLength: 3,
  maxWordLength: 5,
  localPlayerId: "me",
  localPlayerName: "أنت"
});

/**
 * Power-up defaults and balance caps. Effect keys match the Tikora hub
 * `effect_key` values (see docs/HUB_INTEGRATION.md).
 * @typedef {Object} PowerUpDefaults
 * @property {{seconds:number, maxPerUse:number, maxPerRound:number}} time_bonus
 * @property {{count:number, maxPerRound:number}} reveal_letter
 * @property {{multiplier:number, maxMultiplier:number}} double_points
 * @property {{seconds:number, maxPerUse:number, maxPerRound:number}} freeze_timer
 * @property {{firstLetters:boolean, maxPerRound:number}} length_hint
 */

/** @type {PowerUpDefaults} */
export const POWERUP_DEFAULTS = Object.freeze({
  time_bonus: { seconds: 5, maxPerUse: 15, maxPerRound: 20 },
  reveal_letter: { count: 1, maxPerRound: 2 },
  double_points: { multiplier: 2, maxMultiplier: 3 },
  freeze_timer: { seconds: 3, maxPerUse: 5, maxPerRound: 8 },
  length_hint: { firstLetters: true, maxPerRound: 1 }
});
