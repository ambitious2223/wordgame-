import { describe, it, expect, vi } from "vitest";
import { createAudioManager } from "../src/js/ui/audio.js";

class FakeAudio {
  constructor(src) {
    this.src = src;
    this.volume = 1;
    this.currentTime = 0;
    this.play = vi.fn(() => Promise.resolve());
  }
}

describe("audio manager", () => {
  it("plays and caches sources", () => {
    const manager = createAudioManager({ AudioCtor: FakeAudio });
    expect(manager.play("hit.wav")).toBe(true);
    expect(manager.play("hit.wav")).toBe(true);
    expect(manager.muted).toBe(false);
  });

  it("respects mute", () => {
    const manager = createAudioManager({ AudioCtor: FakeAudio, muted: true });
    expect(manager.play("hit.wav")).toBe(false);
    manager.setMuted(false);
    expect(manager.play("hit.wav")).toBe(true);
  });

  it("is safe without an Audio implementation", () => {
    const manager = createAudioManager({ AudioCtor: null });
    expect(() => manager.play("hit.wav")).not.toThrow();
    expect(manager.play("hit.wav")).toBe(false);
  });

  it("ignores empty sources", () => {
    const manager = createAudioManager({ AudioCtor: FakeAudio });
    expect(manager.play("")).toBe(false);
  });
});