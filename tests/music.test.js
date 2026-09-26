import { describe, it, expect } from "vitest";
import { createMusicManager, MUSIC_TRACKS } from "../src/js/ui/music.js";

class FakeAudio {
  constructor(src) {
    this.src = src;
    this.volume = 1;
    this.loop = false;
    this.paused = true;
    this.currentTime = 0;
    this.preload = "";
    FakeAudio.instances.push(this);
  }
  play() {
    this.paused = false;
    this.currentTime = 1;
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
  }
}
FakeAudio.instances = [];

describe("music manager", () => {
  it("ships several real tracks", () => {
    expect(MUSIC_TRACKS.length).toBeGreaterThanOrEqual(6);
    for (const t of MUSIC_TRACKS) {
      expect(t.file).toMatch(/\.mp3$/);
      expect(t.name).toBeTruthy();
    }
  });

  it("is a safe no-op without an Audio implementation", () => {
    const music = createMusicManager({ AudioElementCtor: null, enabled: true });
    expect(music.start()).toBe(false);
    music.setVolume(5);
    expect(music.volume).toBe(1);
    music.setVolume(-3);
    expect(music.volume).toBe(0);
    expect(() => music.dispose()).not.toThrow();
  });

  it("plays the selected track and loops it", () => {
    FakeAudio.instances.length = 0;
    const music = createMusicManager({ AudioElementCtor: FakeAudio, enabled: true, volume: 0.5 });
    expect(music.start()).toBe(true);
    const audio = FakeAudio.instances.at(-1);
    expect(audio.src).toContain("assets/sounds/music/");
    expect(audio.loop).toBe(true);
    expect(audio.volume).toBe(0.5);
    expect(music.playing).toBe(true);
    music.pause();
    expect(music.playing).toBe(false);
    music.dispose();
  });

  it("cycles tracks and switches the audio source", () => {
    FakeAudio.instances.length = 0;
    const music = createMusicManager({ AudioElementCtor: FakeAudio });
    const first = music.track.id;
    const second = music.next().id;
    expect(second).not.toBe(first);
    expect(music.prev().id).toBe(first);
    expect(music.setTrack("forest").id).toBe("forest");
    expect(music.setTrack("nope").id).toBe("forest");
    music.dispose();
  });

  it("respects enable/disable", () => {
    FakeAudio.instances.length = 0;
    const music = createMusicManager({ AudioElementCtor: FakeAudio, enabled: false });
    expect(music.start()).toBe(false);
    music.setEnabled(true);
    expect(music.playing).toBe(true);
    music.setEnabled(false);
    expect(music.playing).toBe(false);
    music.dispose();
  });
});