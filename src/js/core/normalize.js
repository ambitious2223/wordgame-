/**
 * Arabic text normalization used for guess matching.
 * Removes tashkeel/tatweel, unifies alef forms, ta-marbuta and alef-maqsura.
 */
const DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u0640]/g;

/**
 * @param {unknown} text
 * @returns {string}
 */
export function normalizeArabic(text) {
  if (typeof text !== "string") return "";
  return text
    .replace(DIACRITICS, "")
    .replace(/[إأآا]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, "")
    .trim();
}

/**
 * @param {string} text
 * @returns {boolean}
 */
export function isArabicLettersOnly(text) {
  return /^[\u0621-\u064A]+$/.test(text);
}
