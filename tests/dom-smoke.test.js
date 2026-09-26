// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const html = readFileSync(resolve(process.cwd(), "src/index.html"), "utf8");
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
const bodyHtml = bodyMatch ? bodyMatch[1] : "";

describe("DOM boot wiring", () => {
  beforeAll(() => {
    // Force the mock provider so neither the hub client nor a bridge socket is
    // opened in jsdom.
    globalThis.__TIKORA_NO_HUB__ = true;
    try {
      // Offline simulator only: never open a hub/bridge socket in jsdom.
      localStorage.setItem(
        "tawg.settings.v1",
        JSON.stringify({ bridgeEnabled: false, connectionMode: "mock" })
      );
      localStorage.setItem(
        "tawg.champions.v1",
        JSON.stringify([{ name: "sara", score: 100, date: "2026-01-01" }])
      );
    } catch {
      /* ignore */
    }
    // Strip the module script tag; main.js is imported manually below.
    document.body.innerHTML = bodyHtml.replace(/<script[\s\S]*?<\/script>/gi, "");
  });

  it("boots main.js against index.html without missing elements", async () => {
    const module = await import("../src/js/main.js");
    expect(module.engine).toBeTruthy();
    expect(module.timer).toBeTruthy();
    expect(document.getElementById("lettersRow")).toBeTruthy();
    expect(document.getElementById("liveLeaderboard")).toBeTruthy();
    expect(document.getElementById("champions")).toBeTruthy();
    expect(document.getElementById("hostDock")).toBeTruthy();
    expect(document.getElementById("hostToggle")).toBeTruthy();
    expect(document.getElementById("musicToggle")).toBeTruthy();
    expect(document.getElementById("musicVolume")).toBeTruthy();
    expect(document.getElementById("showChampionsBtn")).toBeTruthy();
    expect(document.getElementById("langToggle")).toBeTruthy();
    expect(document.getElementById("championsTitle")).toBeTruthy();
    expect(document.getElementById("championsPanelTitle")).toBeTruthy();
    expect(document.getElementById("pauseBtn")).toBeTruthy();
    expect(document.getElementById("musicPrev")).toBeTruthy();
    expect(document.getElementById("musicPlayPause")).toBeTruthy();
    expect(document.getElementById("musicNext")).toBeTruthy();
    expect(document.getElementById("musicTrack")).toBeTruthy();
    expect(document.getElementById("sfxToggle")).toBeTruthy();
    expect(document.getElementById("sfxVolume")).toBeTruthy();
    expect(document.getElementById("bridgeUrl")).toBeTruthy();
    expect(document.getElementById("hubUrl")).toBeTruthy();
    expect(document.getElementById("connectionMode")).toBeTruthy();
    expect(document.getElementById("connectApply")).toBeTruthy();
    expect(document.getElementById("gameName")).toBeTruthy();
    expect(document.getElementById("appTitle")).toBeTruthy();
    expect(document.querySelectorAll(".dock-tab").length).toBe(4);
    expect(document.querySelector('.dock-pane[data-pane="connection"]')).toBeTruthy();
    expect(document.querySelector('.dock-pane[data-pane="display"]')).toBeTruthy();
    expect(document.getElementById("rosterManager")).toBeTruthy();
    expect(document.getElementById("resetScoresBtn")).toBeTruthy();
    expect(document.getElementById("clearRosterBtn")).toBeTruthy();
  });

  it("uses the game name for the browser tab and header", async () => {
    await import("../src/js/main.js");
    const input = document.getElementById("gameName");
    input.value = "لعبتي";
    input.dispatchEvent(new Event("input"));
    expect(document.title).toBe("لعبتي");
    expect(document.getElementById("appTitle")?.textContent).toBe("لعبتي");
  });

  it("manages the Hall of Winners (score +/- and delete)", async () => {
    await import("../src/js/main.js");
    const rows = () => document.querySelectorAll("#championsManager .hall-row");
    expect(rows().length).toBeGreaterThanOrEqual(1);

    const before = Number(rows()[0].querySelector(".hall-score").textContent);
    rows()[0].querySelector(".hall-btn--plus").click();
    expect(Number(document.querySelector("#championsManager .hall-score").textContent)).toBe(before + 5);

    rows()[0].querySelector(".hall-btn--minus").click();
    expect(Number(document.querySelector("#championsManager .hall-score").textContent)).toBe(before);

    document.querySelectorAll("#championsManager .hall-btn--delete")[0].click();
    expect(document.querySelectorAll("#championsManager .hall-row").length).toBe(0);

    document.getElementById("clearChampionsBtn").click();
    expect(document.querySelectorAll("#championsManager .hall-row").length).toBe(0);
  });

  it("manages the live match roster (score +/- and remove)", async () => {
    const { engine } = await import("../src/js/main.js");
    engine.addPlayer("sara", "Sara");
    engine.emit("scoreupdate", { playerId: "sara", leaderboard: engine.getLeaderboard() });
    const rows = () => document.querySelectorAll("#rosterManager .hall-row");
    expect(rows().length).toBeGreaterThanOrEqual(1);

    const saraRow = () => [...rows()].find((r) => r.textContent.includes("Sara"));
    const before = Number(saraRow().querySelector(".hall-score").textContent);
    saraRow().querySelector(".hall-btn--plus").click();
    expect(Number(saraRow().querySelector(".hall-score").textContent)).toBe(before + 5);
    saraRow().querySelector(".hall-btn--minus").click();
    expect(Number(saraRow().querySelector(".hall-score").textContent)).toBe(before);

    engine.resetMatchScores();
    expect(Number(saraRow().querySelector(".hall-score").textContent)).toBe(0);

    saraRow().querySelector(".hall-btn--delete").click();
    expect([...rows()].some((r) => r.textContent.includes("Sara"))).toBe(false);
  });

  it("switches dock tabs", async () => {
    await import("../src/js/main.js");
    const connectionTab = document.querySelector('.dock-tab[data-tab="connection"]');
    connectionTab.click();
    expect(connectionTab.classList.contains("is-active")).toBe(true);
    expect(document.querySelector('.dock-pane[data-pane="connection"]').hidden).toBe(false);
    expect(document.querySelector('.dock-pane[data-pane="game"]').hidden).toBe(true);
  });

  it("cycles music tracks with the transport controls", async () => {
    await import("../src/js/main.js");
    const select = document.getElementById("musicTrack");
    expect(select.options.length).toBeGreaterThanOrEqual(8);
    const before = select.value;
    document.getElementById("musicNext").click();
    expect(select.value).not.toBe(before);
    document.getElementById("musicPrev").click();
    expect(select.value).toBe(before);
  });

  it("picks a specific track from the dropdown", async () => {
    const { engine } = await import("../src/js/main.js");
    expect(engine).toBeTruthy();
    const select = document.getElementById("musicTrack");
    const target = select.options[2].value;
    select.value = target;
    select.dispatchEvent(new Event("change"));
    expect(select.value).toBe(target);
  });

  it("switches language and text direction from the header toggle", async () => {
    await import("../src/js/main.js");
    const toggle = document.getElementById("langToggle");
    const before = document.documentElement.dir;
    toggle.click();
    expect(document.documentElement.dir).not.toBe(before);
    expect(["rtl", "ltr"]).toContain(document.documentElement.dir);
  });

  it("applies a custom hall title to the panel", async () => {
    await import("../src/js/main.js");
    const input = document.getElementById("championsTitle");
    input.value = "قاعة الملوك";
    input.dispatchEvent(new Event("input"));
    expect(document.getElementById("championsPanelTitle")?.textContent).toContain("قاعة الملوك");
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
    expect(document.getElementById("possibleCount")?.textContent).toMatch(/Possible words|كلمات ممكنة/);
    expect(document.querySelectorAll("#liveLeaderboard .leader-item").length).toBeGreaterThanOrEqual(1);
    expect(document.getElementById("totalRounds")?.textContent).toBe("1");

    // Pause / resume the round from the dock.
    document.getElementById("pauseBtn").click();
    expect(timer.paused).toBe(true);
    document.getElementById("pauseBtn").click();
    expect(timer.paused).toBe(false);

    timer.stop();
  });
});
