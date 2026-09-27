import { describe, it, expect, beforeEach, vi } from "vitest";
import { GameEngine } from "../src/js/core/engine.js";
import { WORD_SETS } from "../src/js/data/word-sets.js";

const identity = (/** @type {any[]} */ arr) => [...arr];

/** Deterministic dictionary keyed by the joined tile letters (identity shuffle keeps order). */
const STUB_DICTIONARY = {
  "بيتال": ["بيت", "تاب", "ليت"],
  "كتابي": ["كتاب", "كاتب", "كبت"]
};

/** @returns {GameEngine} */
function makeEngine() {
  return new GameEngine({
    shuffleFn: identity,
    findFormableWords: (letters) => STUB_DICTIONARY[letters.join("")] ?? []
  });
}

describe("GameEngine", () => {
  /** @type {GameEngine} */
  let engine;

  beforeEach(() => {
    engine = makeEngine();
  });

  it("starts a round with the first available set", () => {
    const onStart = vi.fn();
    engine.on("roundstart", onStart);
    engine.startGame({ totalRounds: 2, duration: 15 });

    const state = engine.getState();
    expect(state.isRunning).toBe(true);
    expect(state.round).toBe(1);
    expect(state.roundActive).toBe(true);
    expect(state.currentSet?.id).toBe(WORD_SETS[0].id);
    expect(onStart).toHaveBeenCalledOnce();
  });

  it("rejects non-string and out-of-range guesses", () => {
    engine.startGame({ totalRounds: 1, duration: 15 });
    expect(engine.submitGuess("ب").status).toBe("length");
    expect(engine.submitGuess("hello").status).toBe("charset");
    expect(engine.submitGuess("سلام").status).toBe("unformable");
    expect(engine.submitGuess("ززز").status).toBe("unformable");
  });

  it("accepts a formable word and scores per-round multiplier", () => {
    engine.startGame({ totalRounds: 1, duration: 15 });
    const first = engine.submitGuess("بيت");
    expect(first.status).toBe("ok");
    expect(first.base).toBe(4);
    expect(first.roundScore).toBe(4);

    const second = engine.submitGuess("تاب");
    expect(second.roundScore).toBe(12);

    const third = engine.submitGuess("ليت");
    expect(third.multiplier).toBe(2);
    expect(third.roundScore).toBe(22);
    expect(engine.getTotalScore()).toBe(22);
  });

  it("doubles the next word when a multiplier is armed", () => {
    engine.startGame({ totalRounds: 1, duration: 15 });
    expect(engine.armNextWordMultiplier(2)).toBe(2);
    const result = engine.submitGuess("بيت"); // base 4
    expect(result.status).toBe("ok");
    expect(result.base).toBe(4);
    expect(result.bonus).toBe(4); // (2-1) * 4
    expect(engine.getRoundScore()).toBe(8);

    // multiplier is consumed: the next word scores normally
    const next = engine.submitGuess("تاب"); // base 4
    expect(next.bonus).toBe(0);
    expect(engine.getRoundScore()).toBe(18); // (4 + 4 + 4) * 1.5
  });

  it("stacks the next-word multiplier up to x3", () => {
    engine.startGame({ totalRounds: 1, duration: 15 });
    engine.armNextWordMultiplier(2);
    engine.armNextWordMultiplier(3);
    expect(engine.getPendingMultiplier()).toBe(3);
    engine.armNextWordMultiplier(9);
    expect(engine.getPendingMultiplier()).toBe(3);
  });

  it("produces first-letter word shapes for length hints", () => {
    expect(engine.getWordShape("كتاب")).toBe("ك___");
    expect(engine.getWordShape("بيت")).toBe("ب__");
  });

  it("awards bonus points and reshuffles the letters", () => {
    const reverse = (/** @type {any[]} */ arr) => [...arr].reverse();
    const eng = new GameEngine({ shuffleFn: reverse, findFormableWords: () => [] });
    eng.startGame({ totalRounds: 1, duration: 15 });
    eng.addPlayer("sara", "Sara");
    eng.addPoints("sara", 25);
    expect(eng.getTotalScore("sara")).toBe(25);

    const before = eng.getCurrentLetters().join("");
    const events = [];
    eng.on("letterschange", (p) => events.push(p.letters.join("")));
    eng.reshuffleLetters();
    expect(eng.getCurrentLetters().join("")).not.toBe(before);
    expect(events).toHaveLength(1);
  });

  it("tracks words found and avatar per player", () => {
    engine.startGame({ totalRounds: 1, duration: 15 });
    engine.addPlayer("sara", "سارة", "https://example.com/a.png");
    engine.submitGuess("بيت", "sara");
    engine.submitGuess("تاب", "sara");
    const board = engine.getLeaderboard();
    expect(board[0]).toMatchObject({
      id: "sara",
      avatar: "https://example.com/a.png",
      words: 2,
      score: 12
    });
  });

  it("blocks duplicates using normalization", () => {
    engine.startGame({ totalRounds: 1, duration: 15 });
    expect(engine.submitGuess("بيت").status).toBe("ok");
    expect(engine.submitGuess("بيت").status).toBe("duplicate");
    expect(engine.submitGuess("بَيت").status).toBe("duplicate");
  });

  it("emits allfound when every target is discovered", () => {
    engine.startGame({ totalRounds: 1, duration: 15 });
    const onAll = vi.fn();
    engine.on("allfound", onAll);
    engine.submitGuess("بيت");
    engine.submitGuess("تاب");
    engine.submitGuess("ليت");
    expect(onAll).toHaveBeenCalledOnce();
  });

  it("commits round score and resets multiplier on the next round", () => {
    engine.startGame({ totalRounds: 2, duration: 15 });
    engine.submitGuess("بيت");
    engine.submitGuess("تاب");
    engine.submitGuess("ليت");
    const ended = engine.endRound();
    expect(ended?.roundScores.me).toBe(22);
    expect(ended?.missed).toEqual([]);

    engine.startNextRound();
    expect(engine.getState().round).toBe(2);
    expect(engine.getRoundScore()).toBe(0);
    const single = engine.submitGuess("كتاب");
    expect(single.roundScore).toBe(7);
    expect(engine.getTotalScore()).toBe(29);
  });

  it("reports missed words and produces a real leaderboard", () => {
    engine.startGame({ totalRounds: 1, duration: 15 });
    engine.submitGuess("بيت");
    const ended = engine.endRound();
    expect(ended?.missed.sort()).toEqual(["تاب", "ليت"].sort());
    expect(engine.getLeaderboard()).toEqual([
      { id: "me", name: "أنت", avatar: null, words: 1, score: 4 }
    ]);
    expect(engine.getWinner()?.score).toBe(4);
  });

  it("ends the game after the configured rounds", () => {
    const onEnd = vi.fn();
    engine.on("gameend", onEnd);
    engine.startGame({ totalRounds: 1, duration: 15 });
    engine.endRound();
    engine.startNextRound();
    expect(onEnd).toHaveBeenCalledOnce();
    expect(engine.getState().isRunning).toBe(false);
  });

  it("ignores guesses when no round is active", () => {
    expect(engine.submitGuess("بيت").status).toBe("inactive");
  });
});