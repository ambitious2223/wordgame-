import { describe, it, expect } from "vitest";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  loadBestScore,
  saveBestScore,
  loadChampions,
  addChampion,
  loadDock,
  saveDock
} from "../src/js/core/store.js";

class FakeStorage {
  constructor() {
    this.map = new Map();
  }
  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }
  setItem(key, value) {
    this.map.set(key, String(value));
  }
}

describe("store", () => {
  it("returns defaults when storage is empty or absent", () => {
    expect(loadSettings(new FakeStorage())).toEqual(DEFAULT_SETTINGS);
    expect(loadSettings(null)).toEqual(DEFAULT_SETTINGS);
  });

  it("round-trips settings", () => {
    const storage = new FakeStorage();
    saveSettings(storage, { rounds: 20, duration: 30 });
    expect(loadSettings(storage)).toEqual({ ...DEFAULT_SETTINGS, rounds: 20, duration: 30 });
  });

  it("survives corrupt JSON", () => {
    const storage = new FakeStorage();
    storage.setItem("tawg.settings.v1", "{not json");
    expect(loadSettings(storage)).toEqual(DEFAULT_SETTINGS);
  });

  it("tracks the best score without ever lowering it", () => {
    const storage = new FakeStorage();
    expect(loadBestScore(storage)).toBe(0);
    expect(saveBestScore(storage, 40)).toBe(40);
    expect(saveBestScore(storage, 12)).toBe(40);
    expect(saveBestScore(storage, 55)).toBe(55);
    expect(loadBestScore(storage)).toBe(55);
  });

  it("is a safe no-op without storage", () => {
    expect(() => saveSettings(null, { rounds: 5 })).not.toThrow();
    expect(() => saveBestScore(null, 10)).not.toThrow();
    expect(loadChampions(null)).toEqual([]);
  });

  it("records all-time champions sorted by score", () => {
    const storage = new FakeStorage();
    addChampion(storage, { name: "سارة", score: 40, date: "2026-01-01" });
    addChampion(storage, { name: "عمر", score: 90, date: "2026-01-02" });
    const list = addChampion(storage, { name: "خالد", score: 60, date: "2026-01-03" });
    expect(list.map((c) => c.name)).toEqual(["عمر", "خالد", "سارة"]);
    expect(loadChampions(storage)[0].score).toBe(90);
  });

  it("caps the champions list", () => {
    const storage = new FakeStorage();
    for (let i = 0; i < 15; i += 1) {
      addChampion(storage, { name: `p${i}`, score: i }, 5);
    }
    const list = loadChampions(storage);
    expect(list).toHaveLength(5);
    expect(list[0].score).toBe(14);
  });

  it("persists and restores the floating dock state", () => {
    const storage = new FakeStorage();
    expect(loadDock(storage)).toBeNull();
    saveDock(storage, { x: 12.4, y: 80.6, collapsed: true });
    expect(loadDock(storage)).toEqual({ x: 12, y: 81, collapsed: true });
    expect(loadDock(null)).toBeNull();
  });
});