// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const html = readFileSync(resolve(process.cwd(), "src/index.html"), "utf8");
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
const bodyHtml = bodyMatch ? bodyMatch[1] : "";

describe("DOM boot wiring", () => {
  beforeAll(() => {
    // Force the mock provider so the real hub client is never fetched in jsdom.
    globalThis.__TIKORA_NO_HUB__ = true;
    // Strip the module script tag; main.js is imported manually below.
    document.body.innerHTML = bodyHtml.replace(/<script[\s\S]*?<\/script>/gi, "");
  });

  it("boots main.js against index.html without missing elements", async () => {
    const module = await import("../src/js/main.js");
    expect(module.engine).toBeTruthy();
    expect(module.timer).toBeTruthy();
    expect(document.getElementById("lettersRow")).toBeTruthy();
    expect(document.getElementById("liveLeaderboard")).toBeTruthy();
    expect(document.getElementById("matchStandings")).toBeTruthy();
    expect(document.getElementById("champions")).toBeTruthy();
    expect(document.getElementById("hostDock")).toBeTruthy();
    expect(document.getElementById("hostToggle")).toBeTruthy();
    expect(document.getElementById("musicToggle")).toBeTruthy();
    expect(document.getElementById("musicVolume")).toBeTruthy();
    expect(document.getElementById("showChampionsBtn")).toBeTruthy();
  });

  it("opens the champions page from the dock button", async () => {
    await import("../src/js/main.js");
    document.getElementById("showChampionsBtn").click();
    expect(document.getElementById("championsOverlay")).toBeTruthy();
    document.getElementById("championsOverlay").remove();
  });

  it("collapses and expands the floating host dock", async () => {
    await import("../src/js/main.js");
    const dock = document.getElementById("hostDock");
    const toggle = document.getElementById("hostToggle");
    toggle.click();
    expect(dock.classList.contains("is-collapsed")).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    toggle.click();
    expect(dock.classList.contains("is-collapsed")).toBe(false);
  });

  it("starts a game and renders letter tiles + live leaderboard", async () => {
    const { engine, timer } = await import("../src/js/main.js");
    document.getElementById("roundsInput").value = "1";
    document.getElementById("durationInput").value = "15";
    engine.startGame({ totalRounds: 1, duration: 15 });

    const tiles = document.querySelectorAll("#lettersRow .letter-box");
    expect(tiles.length).toBe(5);
    expect(document.getElementById("possibleCount")?.textContent).toMatch(/كلمات ممكنة/);
    expect(document.querySelectorAll("#liveLeaderboard .leader-item").length).toBeGreaterThanOrEqual(1);
    expect(document.getElementById("totalRounds")?.textContent).toBe("1");

    timer.stop();
  });
});
