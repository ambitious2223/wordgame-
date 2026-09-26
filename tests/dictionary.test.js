import { describe, it, expect } from "vitest";
import { WORD_SETS } from "../src/js/data/word-sets.js";
import {
  ARABIC_DICTIONARY,
  findFormableWords,
  isDictionaryWord
} from "../src/js/data/dictionary.js";
import { normalizeArabic } from "../src/js/core/normalize.js";

/**
 * @param {string} word
 * @param {readonly string[]} letters
 */
function canForm(word, letters) {
  const pool = [...letters].map((letter) => normalizeArabic(letter));
  for (const ch of normalizeArabic(word)) {
    const index = pool.indexOf(ch);
    if (index === -1) return false;
    pool.splice(index, 1);
  }
  return true;
}

describe("dictionary integrity", () => {
  it("ships a healthy number of sets", () => {
    expect(WORD_SETS.length).toBeGreaterThanOrEqual(10);
  });

  it("has unique set ids", () => {
    const ids = WORD_SETS.map((set) => set.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("dictionary is unique, Arabic-only and 3-5 letters", () => {
    expect(ARABIC_DICTIONARY.length).toBeGreaterThan(800);
    const seen = new Set();
    for (const word of ARABIC_DICTIONARY) {
      expect(/^[\u0621-\u064A]{3,5}$/.test(word), `"${word}"`).toBe(true);
      expect(seen.has(word), `duplicate ${word}`).toBe(false);
      seen.add(word);
    }
  });

  it("exposes every curated set word in the dictionary", () => {
    for (const set of WORD_SETS) {
      for (const word of set.words) {
        expect(isDictionaryWord(word), `${word} in dictionary`).toBe(true);
      }
    }
  });

  it("finds every formable dictionary word for each set", () => {
    for (const set of WORD_SETS) {
      const found = findFormableWords(set.letters);
      expect(found.length, `set ${set.id} formable count`).toBeGreaterThanOrEqual(3);
      const seen = new Set();
      for (const word of found) {
        expect(canForm(word, set.letters), `${word} formable from ${set.id}`).toBe(true);
        expect(seen.has(word)).toBe(false);
        seen.add(word);
      }
    }
  });

  for (const set of WORD_SETS) {
    describe(`set "${set.id}"`, () => {
      it("has exactly 5 tiles", () => {
        expect(set.letters).toHaveLength(5);
        for (const letter of set.letters) {
          expect(/^[\u0621-\u064A]$/.test(letter), `"${letter}" is an Arabic letter`).toBe(true);
        }
      });

      it("has at least 3 words", () => {
        expect(set.words.length).toBeGreaterThanOrEqual(3);
      });

      it("all words are 3-5 letters, formable, and unique", () => {
        const seen = new Set();
        for (const word of set.words) {
          expect(word.length, `length of ${word}`).toBeGreaterThanOrEqual(3);
          expect(word.length, `length of ${word}`).toBeLessThanOrEqual(5);
          expect(canForm(word, set.letters), `${word} formable`).toBe(true);
          const normalized = normalizeArabic(word);
          expect(seen.has(normalized), `${word} unique`).toBe(false);
          seen.add(normalized);
        }
      });
    });
  }
});