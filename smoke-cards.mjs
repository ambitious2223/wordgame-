// Letter-tile ("cards") smoke test: validates that every set's tiles are usable,
// that shuffling preserves the multiset, and that every tile has a point value.
import assert from "node:assert/strict";
import { WORD_SETS } from "./src/js/data/word-sets.js";
import { LETTER_VALUES } from "./src/js/data/letter-values.js";
import { shuffle } from "./src/js/core/rng.js";
import {
  ARABIC_DICTIONARY,
  findFormableWords,
  isDictionaryWord
} from "./src/js/data/dictionary.js";

let tiles = 0;

for (const set of WORD_SETS) {
  const shuffled = shuffle(set.letters);
  assert.equal(shuffled.length, set.letters.length, `${set.id} keeps letter count`);
  assert.deepEqual([...shuffled].sort(), [...set.letters].sort(), `${set.id} preserves multiset`);

  for (const letter of set.letters) {
    assert.ok(letter in LETTER_VALUES, `${set.id} letter "${letter}" has a point value`);
    tiles += 1;
  }

  for (const word of set.words) {
    assert.ok(isDictionaryWord(word), `${set.id}: "${word}" is in the dictionary`);
  }
  const formable = findFormableWords(set.letters);
  assert.ok(formable.length >= 3, `${set.id} exposes >=3 formable words (got ${formable.length})`);
}

console.log(
  `✅ validated ${WORD_SETS.length} sets / ${tiles} letter tiles / ${ARABIC_DICTIONARY.length} dictionary words`
);
console.log("✅ smoke-cards.mjs passed");
