/**
 * Randomized helpers. Uses the Web Crypto RNG when available, else Math.random.
 */

/**
 * @param {number} maxExclusive
 * @returns {number}
 */
export function randomInt(maxExclusive) {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && typeof cryptoObj.getRandomValues === "function") {
    const buffer = new Uint32Array(1);
    cryptoObj.getRandomValues(buffer);
    return buffer[0] % maxExclusive;
  }
  return Math.floor(Math.random() * maxExclusive);
}

/**
 * Unbiased-enough Fisher-Yates shuffle (returns a new array).
 * @template T
 * @param {readonly T[]} input
 * @returns {T[]}
 */
export function shuffle(input) {
  const array = [...input];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
