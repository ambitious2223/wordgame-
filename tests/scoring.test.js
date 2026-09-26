import { describe, it, expect } from "vitest";
import { wordBaseScore, roundMultiplier, roundScoreFrom } from "../src/js/core/scoring.js";

describe("scoring", () => {
  it("sums letter values for the base score", () => {
    expect(wordBaseScore("بيت")).toBe(4);
    expect(wordBaseScore("كتاب")).toBe(7);
    expect(wordBaseScore("سلام")).toBe(8);
  });

  it("maps words-found to the documented multiplier", () => {
    expect(roundMultiplier(0)).toBe(1);
    expect(roundMultiplier(1)).toBe(1);
    expect(roundMultiplier(2)).toBe(1.5);
    expect(roundMultiplier(3)).toBe(2);
    expect(roundMultiplier(4)).toBe(3);
    expect(roundMultiplier(9)).toBe(3);
  });

  it("matches the GAME_SPEC worked example", () => {
    expect(roundScoreFrom([4])).toBe(4);
    expect(roundScoreFrom([4, 5])).toBe(13);
    expect(roundScoreFrom([4, 5, 3])).toBe(24);
    expect(roundScoreFrom([4, 5, 3, 2])).toBe(42);
  });

  it("adds power-up bonus base before applying the multiplier", () => {
    // one word base 4 + double-points bonus base 4 -> (4+4) * 1x
    expect(roundScoreFrom([4], 4)).toBe(8);
    // two words base 4,4 + bonus 4 -> (8+4) * 1.5
    expect(roundScoreFrom([4, 4], 4)).toBe(18);
  });
});