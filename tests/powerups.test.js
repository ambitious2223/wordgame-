import { describe, it, expect, vi } from "vitest";
import {
  POWERUP_TYPES,
  resolveEffect,
  applyPowerUp
} from "../src/js/core/powerups.js";

const ADD_TIME = { type: POWERUP_TYPES.ADD_TIME, value: 5, effectKey: "time_bonus" };
const REVEAL = { type: POWERUP_TYPES.REVEAL_LETTER, value: 1, effectKey: "reveal_letter" };
const FREEZE = { type: POWERUP_TYPES.FREEZE_TIMER, value: 3, effectKey: "freeze_timer" };

describe("power-ups (gift-agnostic)", () => {
  it("adds time to the timer", () => {
    const timer = { addTime: vi.fn() };
    const notify = vi.fn();
    const result = applyPowerUp(ADD_TIME, { timer, notify });
    expect(result.applied).toBe(true);
    expect(timer.addTime).toHaveBeenCalledWith(5);
    expect(notify).toHaveBeenCalledOnce();
  });

  it("reveals a letter from a remaining target", () => {
    const engine = { getRemainingTargets: () => ["تاب", "ليت"] };
    const result = applyPowerUp(REVEAL, { engine });
    expect(result.effect).toBe("reveal");
    expect(result.value).toMatchObject({ letter: "ت" });
  });

  it("reveals a manager-provided hint (random position)", () => {
    const notify = vi.fn();
    const hint = { word: "كتاب", index: 2, letter: "ا", shape: "__ا_" };
    const result = applyPowerUp(REVEAL, { hint, notify });
    expect(result.value).toEqual(hint);
    expect(notify).toHaveBeenCalledWith("🔍 __ا_", REVEAL);
  });

  it("freezes the timer", () => {
    const timer = { pause: vi.fn() };
    const result = applyPowerUp(FREEZE, { timer });
    expect(result.effect).toBe("freeze");
    expect(timer.pause).toHaveBeenCalledOnce();
  });

  it("arms the next-word multiplier for double points", () => {
    const engine = { armNextWordMultiplier: vi.fn() };
    const result = applyPowerUp({ type: POWERUP_TYPES.SCORE_MULTIPLIER, value: 2 }, { engine });
    expect(result.effect).toBe("multiplier");
    expect(engine.armNextWordMultiplier).toHaveBeenCalledWith(2);
  });

  it("reports word shapes for length hint", () => {
    const engine = { getRemainingTargets: () => ["بيت", "كتاب"], getWordShape: (w) => `${w[0]}__` };
    const result = applyPowerUp({ type: POWERUP_TYPES.LENGTH_HINT, value: 1 }, { engine });
    expect(result.applied).toBe(true);
    expect(result.value).toEqual(["ب__", "ك__"]);
  });

  it("awards extra points to the local player", () => {
    const engine = { localPlayerId: "me", addPoints: vi.fn(() => true) };
    const result = applyPowerUp({ type: POWERUP_TYPES.EXTRA_POINTS, value: 10 }, { engine });
    expect(result.applied).toBe(true);
    expect(engine.addPoints).toHaveBeenCalledWith("me", 10);
  });

  it("reshuffles the tiles", () => {
    const engine = { reshuffleLetters: vi.fn(() => true) };
    const result = applyPowerUp({ type: POWERUP_TYPES.RESHUFFLE, value: 1 }, { engine });
    expect(result.applied).toBe(true);
    expect(engine.reshuffleLetters).toHaveBeenCalledOnce();
  });

  it("handles missing context without throwing", () => {
    expect(() => applyPowerUp(ADD_TIME, {})).not.toThrow();
    expect(applyPowerUp(null).applied).toBe(false);
  });

  it("resolves hub effect keys with payload overrides", () => {
    expect(resolveEffect("time_bonus")).toEqual({ type: POWERUP_TYPES.ADD_TIME, value: 5, effectKey: "time_bonus" });
    expect(resolveEffect("time_bonus", { seconds: 12 })?.value).toBe(12);
    expect(resolveEffect("double_points")?.type).toBe(POWERUP_TYPES.SCORE_MULTIPLIER);
    expect(resolveEffect("length_hint")?.type).toBe(POWERUP_TYPES.LENGTH_HINT);
    expect(resolveEffect("unknown_effect")).toBeNull();
  });
});
