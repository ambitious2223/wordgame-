import { describe, it, expect, vi, afterEach } from "vitest";
import { createPowerUpManager } from "../src/js/core/powerup-manager.js";
import { POWERUP_TYPES } from "../src/js/core/powerups.js";

/**
 * @param {boolean} [active]
 */
function makeHarness({ active = true, remaining = ["كتاب", "بيت"] } = {}) {
  const state = { roundActive: active };
  const engine = {
    getState: () => ({ roundActive: state.roundActive }),
    getRemainingTargets: () => remaining,
    getWordShape: (w) => w[0] + "_".repeat(Math.max(0, w.length - 1)),
    armNextWordMultiplier: vi.fn()
  };
  const timer = { addTime: vi.fn(), pause: vi.fn(), resume: vi.fn() };
  const notify = vi.fn();
  const manager = createPowerUpManager({
    engine,
    timer,
    onNotify: notify,
    randomInt: () => 0
  });
  return { manager, engine, timer, notify, state };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("power-up manager", () => {
  it("queues effects when no round is active and flushes on round start", () => {
    const { manager, engine, timer, state } = makeHarness({ active: false });
    const result = manager.apply({ type: POWERUP_TYPES.ADD_TIME, value: 5, effectKey: "time_bonus" });
    expect(result).toEqual({ ok: true, queued: true });
    expect(manager.getPendingCount()).toBe(1);
    expect(timer.addTime).not.toHaveBeenCalled();

    state.roundActive = true;
    manager.onRoundStart();
    expect(manager.getPendingCount()).toBe(0);
    expect(timer.addTime).toHaveBeenCalledWith(5);
    expect(engine).toBeTruthy();
  });

  it("clamps time bonus per use and per round", () => {
    const { manager, timer } = makeHarness();
    manager.apply({ type: POWERUP_TYPES.ADD_TIME, value: 999, effectKey: "time_bonus" });
    expect(timer.addTime).toHaveBeenLastCalledWith(15);
    manager.apply({ type: POWERUP_TYPES.ADD_TIME, value: 999, effectKey: "time_bonus" });
    expect(timer.addTime).toHaveBeenLastCalledWith(5); // only 20s allowed per round
    const capped = manager.apply({ type: POWERUP_TYPES.ADD_TIME, value: 5, effectKey: "time_bonus" });
    expect(capped).toEqual({ ok: false, reason: "capped" });
  });

  it("pauses and auto-resumes the timer for freeze", () => {
    vi.useFakeTimers();
    const { manager, timer } = makeHarness();
    const result = manager.apply({ type: POWERUP_TYPES.FREEZE_TIMER, value: 3, effectKey: "freeze_timer" });
    expect(result.ok).toBe(true);
    expect(timer.pause).toHaveBeenCalledOnce();
    expect(manager.getActiveFreezeSeconds()).toBe(3);
    vi.advanceTimersByTime(3000);
    expect(timer.resume).toHaveBeenCalledOnce();
  });

  it("caps freeze per round and does not resume after round end", () => {
    vi.useFakeTimers();
    const { manager, timer, state } = makeHarness();
    manager.apply({ type: POWERUP_TYPES.FREEZE_TIMER, value: 5, effectKey: "freeze_timer" });
    manager.apply({ type: POWERUP_TYPES.FREEZE_TIMER, value: 5, effectKey: "freeze_timer" }); // +3 room
    const capped = manager.apply({ type: POWERUP_TYPES.FREEZE_TIMER, value: 3, effectKey: "freeze_timer" });
    expect(capped).toEqual({ ok: false, reason: "capped" });

    state.roundActive = false;
    manager.onRoundEnd();
    vi.advanceTimersByTime(10000);
    expect(timer.resume).not.toHaveBeenCalled();
  });

  it("reveals a random-position hint and caps at two per round", () => {
    const { manager } = makeHarness();
    const first = manager.apply({ type: POWERUP_TYPES.REVEAL_LETTER, value: 1, effectKey: "reveal_letter" });
    expect(first.ok).toBe(true);
    expect(first.value).toMatchObject({ word: "كتاب", index: 0, letter: "ك", shape: "ك___" });
    manager.apply({ type: POWERUP_TYPES.REVEAL_LETTER, value: 1, effectKey: "reveal_letter" });
    const capped = manager.apply({ type: POWERUP_TYPES.REVEAL_LETTER, value: 1, effectKey: "reveal_letter" });
    expect(capped).toEqual({ ok: false, reason: "capped" });
  });

  it("shows word shapes for length hint and caps at one per round", () => {
    const { manager } = makeHarness();
    const result = manager.apply({ type: POWERUP_TYPES.LENGTH_HINT, value: 1, effectKey: "length_hint" });
    expect(result.ok).toBe(true);
    expect(result.value).toEqual(["ك___", "ب__"]);
    const capped = manager.apply({ type: POWERUP_TYPES.LENGTH_HINT, value: 1, effectKey: "length_hint" });
    expect(capped).toEqual({ ok: false, reason: "capped" });
  });

  it("arms the next-word multiplier for double points", () => {
    const { manager, engine } = makeHarness();
    const result = manager.apply({ type: POWERUP_TYPES.SCORE_MULTIPLIER, value: 9, effectKey: "double_points" });
    expect(result.ok).toBe(true);
    expect(engine.armNextWordMultiplier).toHaveBeenCalledWith(3); // clamped to max
  });

  it("credits the gifter in notifications and rejects unknown effects", () => {
    const { manager, notify } = makeHarness();
    manager.apply({ type: POWERUP_TYPES.ADD_TIME, value: 5, effectKey: "time_bonus" }, { username: "sara" });
    expect(notify).toHaveBeenCalledWith(expect.stringContaining("sara"), expect.anything());
    expect(manager.apply({ type: "nope" })).toEqual({ ok: false, reason: "unknown" });
    expect(manager.apply(null)).toEqual({ ok: false, reason: "unmapped" });
  });
});
