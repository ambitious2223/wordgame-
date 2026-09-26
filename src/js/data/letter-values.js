/**
 * Single source of truth for Arabic letter point values (Scrabble-style).
 * Values follow GAME_SPEC.md.
 * @typedef {Record<string, number>} LetterValueMap
 */

/** @type {LetterValueMap} */
export const LETTER_VALUES = Object.freeze({
  "ا": 1, "ل": 1, "ن": 1, "ي": 1, "و": 1, "ت": 1, "ر": 1,
  "ب": 2, "ه": 2, "م": 2, "د": 2,
  "ك": 3, "ع": 3,
  "ح": 4, "ف": 4, "س": 4,
  "ق": 5, "غ": 5, "ج": 5, "خ": 5,
  "ص": 6, "ض": 6, "ش": 6, "ز": 6,
  "ط": 7, "ظ": 7, "ث": 7, "ذ": 7,
  "ء": 8, "ئ": 8, "ؤ": 8,
  "آ": 10, "ة": 10
});

/**
 * @param {string} letter
 * @returns {number}
 */
export function getLetterValue(letter) {
  return LETTER_VALUES[letter] ?? 1;
}
