// End-to-end smoke test for the game engine (no DOM required).
// Exercises a full multi-round game and fails the process on any assertion error.
import assert from "node:assert/strict";
import { GameEngine } from "./src/js/core/engine.js";

const STUB_DICTIONARY = {
  "بيتال": ["بيت", "تاب", "ليت"],
  "كتابي": ["كتاب", "كاتب", "كبت"]
};
const engine = new GameEngine({
  shuffleFn: (arr) => [...arr],
  findFormableWords: (letters) => STUB_DICTIONARY[letters.join("")] ?? []
});
const log = [];

engine.on("roundstart", (payload) => log.push(`round ${payload.round} letters=${payload.letters.join("")}`));
engine.on("wordfound", (result) => log.push(`  +${result.base} (x${result.multiplier}) ${result.word}`));
engine.on("roundend", (payload) => log.push(`  round end: missed=${payload.missed.join("،") || "none"}`));
engine.on("gameend", (payload) => log.push(`game end: winner=${payload.winner?.name} score=${payload.winner?.score}`));

engine.startGame({ totalRounds: 2, duration: 15 });

// Round 1 (set: beit -> بيت، تاب، ليت)
assert.equal(engine.submitGuess("بيت").status, "ok");
assert.equal(engine.submitGuess("بَيت").status, "duplicate");
assert.equal(engine.submitGuess("تاب").status, "ok");
assert.equal(engine.submitGuess("ليت").status, "ok");
assert.equal(engine.submitGuess("ززز").status, "unformable");
assert.equal(engine.getTotalScore(), 22);

engine.endRound();
engine.startNextRound();

// Round 2 (set: kitab -> كتاب، كاتب، كبت)
assert.equal(engine.submitGuess("كتاب").status, "ok");
assert.equal(engine.getTotalScore(), 29);
engine.endRound();
engine.startNextRound();

assert.equal(engine.getState().isRunning, false);
assert.equal(engine.getWinner()?.score, 29);

console.log(log.join("\n"));
console.log("\n✅ smoke-test.mjs passed");
