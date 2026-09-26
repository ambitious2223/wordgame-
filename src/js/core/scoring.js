import { getLetterValue } from "../data/letter-values.js";

/**
 * Base score of a word = sum of its letter values.
 * @param {string} word
 * @returns {number}
 */
export function wordBaseScore(word) {
  let total = 0;
  for (const letter of word) {
    total += getLetterValue(letter);
  }
  return total;
}

/**
 * Round multiplier based on how many words the player found this round.
 * 1 -> 1x, 2 -> 1.5x, 3 -> 2x, 4+ -> 3x
 * @param {number} wordsFoundThisRound
 * @returns {number}
 */
export function roundMultiplier(wordsFoundThisRound) {
  if (wordsFoundThisRound >= 4) return 3;
  if (wordsFoundThisRound === 3) return 2;
  if (wordsFoundThisRound === 2) return 1.5;
  return 1;
}

/**
 * Round score = floor((sum of base scores + power-up bonus) * multiplier).
 * `bonusBase` is extra base points from a next-word multiplier power-up.
 * @param {number[]} baseScores
 * @param {number} [bonusBase]
 * @returns {number}
 */
export function roundScoreFrom(baseScores, bonusBase = 0) {
  const sum = baseScores.reduce((acc, value) => acc + value, 0) + (Number(bonusBase) || 0);
  return Math.floor(sum * roundMultiplier(baseScores.length));
}
