import { describe, it, expect } from "vitest";
import { createMusicManager } from "../src/js/ui/music.js";

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

describe("music manager", () => {
  it("is a safe no-op without Web Audio", () => {
    const music = createMusicManager({ AudioContextCtor: null, enabled: true });
    expect(music.start()).toBe(false);
    expect(music.playing).toBe(false);
    music.setVolume(5);
    expect(music.volume).toBe(1);
    music.setVolume(-3);
    expect(music.volume).toBe(0);
    expect(() => music.dispose()).not.toThrow();
  });

  it("starts and stops with a Web Audio implementation", () => {
    const music = createMusicManager({ AudioContextCtor: FakeContext, enabled: true, volume: 0.5 });
    expect(music.start()).toBe(true);
    expect(music.playing).toBe(true);
    music.stop();
    expect(music.playing).toBe(false);
    music.dispose();
  });

  it("respects enable/disable", () => {
    const music = createMusicManager({ AudioContextCtor: FakeContext, enabled: false });
    expect(music.start()).toBe(false);
    music.setEnabled(true);
    expect(music.playing).toBe(true);
    music.setEnabled(false);
    expect(music.playing).toBe(false);
    music.dispose();
  });

  it("offers multiple tracks and cycles next/prev", () => {
    const music = createMusicManager({ AudioContextCtor: null });
    expect(music.tracks.length).toBeGreaterThanOrEqual(4);
    const first = music.track.id;
    const second = music.next().id;
    expect(second).not.toBe(first);
    expect(music.prev().id).toBe(first);
    expect(music.setTrack("arcade").id).toBe("arcade");
    expect(music.setTrack("nope").id).toBe("arcade");
    music.dispose();
  });

  it("pauses and resumes playback", () => {
    const music = createMusicManager({ AudioContextCtor: FakeContext, enabled: true });
    music.start();
    expect(music.pause()).toBe(true);
    expect(music.paused).toBe(true);
    expect(music.resume()).toBe(true);
    expect(music.paused).toBe(false);
    music.dispose();
  });
});
