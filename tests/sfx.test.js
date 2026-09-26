import { describe, it, expect } from "vitest";
import { createSfxManager, SFX } from "../src/js/ui/sfx.js";

class FakeParam {
  constructor() {
    this.value = 0;
  }
  setValueAtTime() {}
  exponentialRampToValueAtTime() {}
}

class FakeNode {
  constructor() {
    this.gain = new FakeParam();
    this.frequency = new FakeParam();
    this.type = "sine";
  }
  connect() {}
  start() {}
  stop() {}
}

class FakeContext {
  constructor() {
    this.currentTime = 0;
    this.destination = {};
  }
  createGain() {
    return new FakeNode();
  }
  createOscillator() {
    return new FakeNode();
  }
  resume() {}
  close() {}
}

describe("sfx manager", () => {
  it("defines common game-event sounds", () => {
    for (const name of ["correct", "wrong", "tick", "roundStart", "roundEnd", "gameOver", "powerUp"]) {
      expect(SFX[name], name).toBeTruthy();
      expect(SFX[name].length).toBeGreaterThan(0);
    }
  });

  it("is a safe no-op without Web Audio", () => {
    const sfx = createSfxManager({ AudioContextCtor: null });
    expect(sfx.play("correct")).toBe(false);
    expect(() => sfx.dispose()).not.toThrow();
  });

  it("plays known effects and ignores unknown ones", () => {
    const sfx = createSfxManager({ AudioContextCtor: FakeContext });
    expect(sfx.play("correct")).toBe(true);
    expect(sfx.play("nope")).toBe(false);
  });

  it("respects the mute switch and volume clamp", () => {
    const sfx = createSfxManager({ AudioContextCtor: FakeContext, enabled: false });
    expect(sfx.play("correct")).toBe(false);
    sfx.setEnabled(true);
    expect(sfx.play("correct")).toBe(true);
    sfx.setVolume(5);
    expect(sfx.volume).toBe(1);
    sfx.dispose();
  });
});