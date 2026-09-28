import { CONFIG } from "./config.js";
import { GameEngine } from "./core/engine.js";
import { RoundTimer } from "./ui/timer.js";
import { el, inputEl, setText, create } from "./ui/dom.js";
import { toast, scorePopup, showRoundResults } from "./ui/feedback.js";
import { loadSettings, saveSettings, loadBestScore, saveBestScore, loadChampions, addChampion, deleteChampion, adjustChampionScore, clearChampions, safeStorage } from "./core/store.js";
import { createConnector } from "./integrations/connector.js";
import { DEFAULT_BRIDGE_URL } from "./integrations/bridge-connector.js";
import { resolveEffect } from "./core/powerups.js";
import { createPowerUpManager } from "./core/powerup-manager.js";
import { createAudioManager } from "./ui/audio.js";
import { createMusicManager } from "./ui/music.js";
import { createSfxManager } from "./ui/sfx.js";
import { initHostDock } from "./ui/host-dock.js";
import { showChampionsOverlay } from "./ui/champions-show.js";
import { t, setLocale, getLocale, applyTranslations } from "./i18n/index.js";

const engine = new GameEngine();

const storage = safeStorage();
const settings = loadSettings(storage);
const audio = createAudioManager({ muted: settings.muted });
const music = createMusicManager({
  enabled: settings.musicEnabled,
  volume: settings.musicVolume,
  track: settings.musicTrack
});
const sfx = createSfxManager({ enabled: settings.sfxEnabled, volume: settings.sfxVolume });

// Hub config: URL params (set by the Tikora launcher) win over saved settings.
const hubParams = typeof location !== "undefined" ? new URLSearchParams(location.search) : new URLSearchParams();
const hubSlug = hubParams.get("game") || settings.hubSlug || "word-challenge";
const hubKey = hubParams.get("key") || settings.hubKey || "";
const hubUrl = settings.hubUrl || "ws://127.0.0.1:27016/";
const bridgeUrl = hubParams.get("bridge") || settings.bridgeUrl || DEFAULT_BRIDGE_URL;
const connectionMode = settings.connectionMode || "both";

const connector = createConnector({
  mode: /** @type {any} */ (connectionMode),
  url: hubUrl,
  gameSlug: hubSlug,
  apiKey: hubKey,
  bridgeUrl
});

const els = {
  roundNum: el("roundNum"),
  totalRounds: el("totalRounds"),
  lettersRow: el("lettersRow"),
  scoreValue: el("scoreValue"),
  multiplierValue: el("multiplierValue"),
  roundScore: el("roundScore"),
  foundList: el("foundList"),
  liveLeaderboard: el("liveLeaderboard"),
  
  champions: el("champions"),
  possibleCount: el("possibleCount"),
  startBtn: el("startBtn"),
  nextBtn: el("nextBtn"),
  endBtn: el("endBtn"),
  roundsInput: inputEl("roundsInput"),
  durationInput: inputEl("durationInput"),
  timerNum: el("timerNum"),
  timerCircle: el("timerCircle"),
  gameModal: el("gameModal"),
  winnerName: el("winnerName"),
  winnerScore: el("winnerScore"),
  playAgainBtn: el("playAgainBtn"),
  musicToggle: el("musicToggle"),
  musicVolume: inputEl("musicVolume"),
  showChampionsBtn: el("showChampionsBtn"),
  gameName: inputEl("gameName"),
  appTitle: el("appTitle"),
  championsTitle: inputEl("championsTitle"),
  championsPanelTitle: el("championsPanelTitle"),
  championsManager: el("championsManager"),
  clearChampionsBtn: el("clearChampionsBtn"),
  rosterManager: el("rosterManager"),
  resetScoresBtn: el("resetScoresBtn"),
  clearRosterBtn: el("clearRosterBtn"),
  langToggle: el("langToggle"),
  hubStatus: el("hubStatus"),
  hubSlug: inputEl("hubSlug"),
  hubKey: inputEl("hubKey"),
  bridgeUrl: inputEl("bridgeUrl"),
  hubUrl: inputEl("hubUrl"),
  connectionMode: /** @type {HTMLSelectElement} */ (el("connectionMode")),
  connectApply: el("connectApply"),
  dockTabs: /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll(".dock-tab")),
  dockPanes: /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll(".dock-pane")),
  pauseBtn: el("pauseBtn"),
  musicPrev: el("musicPrev"),
  musicPlayPause: el("musicPlayPause"),
  musicNext: el("musicNext"),
  musicTrack: /** @type {HTMLSelectElement} */ (el("musicTrack")),
  sfxToggle: el("sfxToggle"),
  sfxVolume: inputEl("sfxVolume")
};

/** Persist a partial settings edit from the host dock. */
function saveSetting(partial) {
  saveSettings(storage, { ...loadSettings(storage), ...partial });
}

let gamePaused = false;
let lastTickSecond = null;

const timer = new RoundTimer({
  onTick: (remaining, total) => {
    updateTimerUI(remaining, total);
    if (remaining <= 5 && remaining > 0 && remaining !== lastTickSecond) {
      lastTickSecond = remaining;
      sfx.play("tick");
    }
  },
  onComplete: finishRound
});

const powerUps = createPowerUpManager({
  engine,
  timer,
  onNotify: (message) => toast(message, "info")
});

// ===== Rendering =====
function renderLetters(letters) {
  els.lettersRow.replaceChildren();
  letters.forEach((letter, index) => {
    const tile = document.createElement("div");
    tile.className = "letter-box";
    tile.textContent = letter;
    tile.dataset.index = String(index);
    tile.style.animationDelay = `${index * 0.1}s`;
    tile.setAttribute("role", "img");
    tile.setAttribute("aria-label", `الحرف ${letter}`);
    els.lettersRow.appendChild(tile);
  });
}

function updateTimerUI(remaining, total) {
  setText(els.timerNum, remaining <= 0 ? 0 : remaining);
  const pct = total > 0 ? Math.max(0, remaining / total) * 100 : 0;
  const color = remaining <= 5 ? "#ff3366" : remaining <= 10 ? "#ffcc00" : "#00ff88";
  els.timerCircle.style.background =
    `conic-gradient(${color} 0%, ${color} ${pct}%, #1a1a2e ${pct}%)`;
}

function avatarNode(player) {
  if (player.avatar) {
    const img = document.createElement("img");
    img.className = "leader-avatar";
    img.src = player.avatar;
    img.alt = "";
    img.loading = "lazy";
    return img;
  }
  const initial = (player.name || "?").trim().charAt(0).toUpperCase() || "?";
  return create("span", "leader-avatar leader-avatar--initial", initial);
}

function fillLeaderboard(container, leaderboard) {
  container.replaceChildren();
  if (leaderboard.length === 0) {
    container.appendChild(create("div", "leader-empty", t("empty.none")));
    return;
  }
  leaderboard.forEach((player, index) => {
    const row = create("div", "leader-item");
    row.appendChild(create("span", "leader-rank", String(index + 1)));
    row.appendChild(avatarNode(player));
    row.appendChild(create("span", "leader-name", player.name));
    const meta = create("span", "leader-meta");
    const words = create("span", "leader-words", `✅ ${player.words ?? 0}`);
    words.title = t("leaderboard.words");
    meta.appendChild(words);
    meta.appendChild(create("span", "leader-score", String(player.score)));
    row.appendChild(meta);
    container.appendChild(row);
  });
}

function renderLeaderboard(leaderboard) {
  fillLeaderboard(els.liveLeaderboard, leaderboard);
}

function renderChampions(champions) {
  els.champions.replaceChildren();
  if (champions.length === 0) {
    els.champions.appendChild(create("div", "leader-empty", t("empty.none")));
    return;
  }
  champions.forEach((champion, index) => {
    const row = create("div", "leader-item");
    row.appendChild(create("span", "leader-rank", String(index + 1)));
    row.appendChild(create("span", "leader-name", champion.name));
    row.appendChild(create("span", "leader-score", String(champion.score)));
    els.champions.appendChild(row);
  });
}

function addFoundWord(word) {
  els.foundList.appendChild(create("span", "found-word", word));
}

/** Editable list of current-match players for the Display tab. */
function renderRosterManager() {
  const roster = engine.getRoster();
  els.rosterManager.replaceChildren();
  if (roster.length === 0) {
    els.rosterManager.appendChild(create("div", "leader-empty", t("display.noPlayers")));
    return;
  }
  roster
    .slice()
    .sort((a, b) => b.score - a.score)
    .forEach((player) => {
      const row = create("div", "hall-row");
      row.appendChild(create("span", "hall-name", player.name));
      row.appendChild(create("span", "hall-score", String(player.score)));

      const minus = /** @type {HTMLButtonElement} */ (create("button", "hall-btn hall-btn--minus", "−"));
      minus.type = "button";
      minus.title = t("hall.decrease");
      minus.addEventListener("click", () => {
        engine.adjustPlayerTotal(player.id, -5);
        updateScores();
        renderRosterManager();
      });

      const plus = /** @type {HTMLButtonElement} */ (create("button", "hall-btn hall-btn--plus", "+"));
      plus.type = "button";
      plus.title = t("hall.increase");
      plus.addEventListener("click", () => {
        engine.adjustPlayerTotal(player.id, 5);
        updateScores();
        renderRosterManager();
      });

      const del = /** @type {HTMLButtonElement} */ (create("button", "hall-btn hall-btn--delete", "✕"));
      del.type = "button";
      del.title = t("hall.delete");
      del.addEventListener("click", () => {
        engine.removePlayer(player.id);
        updateScores();
        renderRosterManager();
      });

      const actions = create("span", "hall-actions");
      actions.append(minus, plus, del);
      row.appendChild(actions);
      els.rosterManager.appendChild(row);
    });
}

/** Editable list of all-time winners for the Display tab. */
function renderChampionsManager() {
  const champions = loadChampions(storage);
  els.championsManager.replaceChildren();
  if (champions.length === 0) {
    els.championsManager.appendChild(create("div", "leader-empty", t("hall.empty")));
    return;
  }
  champions.forEach((champion, index) => {
    const row = create("div", "hall-row");
    row.appendChild(create("span", "hall-name", champion.name));
    row.appendChild(create("span", "hall-score", String(champion.score)));

    const minus = /** @type {HTMLButtonElement} */ (create("button", "hall-btn hall-btn--minus", "−"));
    minus.type = "button";
    minus.title = t("hall.decrease");
    minus.addEventListener("click", () => {
      adjustChampionScore(storage, index, -5);
      refreshChampions();
    });

    const plus = /** @type {HTMLButtonElement} */ (create("button", "hall-btn hall-btn--plus", "+"));
    plus.type = "button";
    plus.title = t("hall.increase");
    plus.addEventListener("click", () => {
      adjustChampionScore(storage, index, 5);
      refreshChampions();
    });

    const del = /** @type {HTMLButtonElement} */ (create("button", "hall-btn hall-btn--delete", "✕"));
    del.type = "button";
    del.title = t("hall.delete");
    del.addEventListener("click", () => {
      deleteChampion(storage, index);
      refreshChampions();
    });

    const actions = create("span", "hall-actions");
    actions.append(minus, plus, del);
    row.appendChild(actions);
    els.championsManager.appendChild(row);
  });
}

/** Refresh both the standings panel and the Hall manager. */
function refreshChampions() {
  const list = loadChampions(storage);
  renderChampions(list);
  renderChampionsManager();
  renderRosterManager();
}

function updateScores() {
  const wordsFound = engine.getRoundWordCount();
  const multiplier = wordsFound >= 4 ? 3 : wordsFound === 3 ? 2 : wordsFound === 2 ? 1.5 : 1;
  setText(els.scoreValue, wordsFound);
  setText(els.multiplierValue, `×${multiplier}`);
  setText(els.roundScore, engine.getValidWords().length);
  renderLeaderboard(engine.getLeaderboard());
  renderRosterManager();
}

// ===== Round flow =====
function finishRound() {
  timer.stop();
  if (engine.getState().roundActive) {
    engine.endRound();
  }
}

// ===== Engine events =====
engine.on("roundstart", (payload) => {
  renderLetters(payload.letters);
  els.foundList.replaceChildren();
  setText(els.roundNum, payload.round);
  setText(els.totalRounds, payload.totalRounds);
  setText(els.roundScore, 0);
  setText(els.possibleCount, t("round.possible", { count: engine.getValidWords().length }));
  updateScores();
  gamePaused = false;
  lastTickSecond = null;
  timer.start(payload.duration);
  powerUps.onRoundStart();
  updatePauseUI();
  sfx.play("roundStart");
  reportHubState("round");
  showRoundTips(payload.round);
});

// ===== Viewer tips (onboarding) =====
function showRoundTips(round) {
  toast(t("tip.round", { n: round }), "info");
  // Scoring tip on round 1, then every 3 rounds.
  if (round === 1 || round % 3 === 0) {
    toast(t("tip.scoring"), "info");
  }
}

engine.on("gamestart", () => {
  toast(t("tip.howTo"), "info");
});

engine.on("wordfound", (result) => {
  addFoundWord(result.word);
  // No local player: any correct word (by a viewer) gives feedback + sound.
  scorePopup({ base: result.base, multiplier: result.multiplier });
  sfx.play("correct");
});

engine.on("scoreupdate", () => {
  updateScores();
});

engine.on("letterschange", (payload) => {
  // Reshuffle power-up: re-render the tiles.
  renderLetters(payload.letters);
});

engine.on("allfound", () => {
  toast(t("toast.allFound"), "success");
  timer.stop();
  setTimeout(() => {
    if (engine.getState().roundActive) engine.endRound();
  }, 700);
});

engine.on("roundend", (payload) => {
  timer.stop();
  powerUps.onRoundEnd();
  sfx.play("roundEnd");
  reportHubState("results");
  const isLast = payload.round >= engine.getState().totalRounds;
  showRoundResults(
    {
      round: payload.round,
      totalRounds: engine.getState().totalRounds,
      found: payload.found,
      missed: payload.missed,
      roundScore: payload.found.length,
      isLast
    },
    () => engine.startNextRound()
  );
});

engine.on("gameend", (payload) => {
  timer.stop();
  sfx.play("gameOver");
  reportHubState("gameover");
  if (payload.winner) {
    saveBestScore(storage, payload.winner.score);
    addChampion(storage, { name: payload.winner.name, score: payload.winner.score });
    refreshChampions();
    setText(els.winnerName, payload.winner.name);
    setText(els.winnerScore, `${payload.winner.score} ${t("points")}`);
  }
  els.gameModal.classList.add("show");
});

// ===== Controls =====
function startConfiguredGame() {
  const totalRounds = parseInt(els.roundsInput.value, 10) || CONFIG.defaultRounds;
  const duration = parseInt(els.durationInput.value, 10) || CONFIG.defaultDuration;
  saveSettings(storage, { ...loadSettings(storage), rounds: totalRounds, duration });
  if (music.enabled) music.start();
  engine.startGame({ totalRounds, duration });
}

els.startBtn.addEventListener("click", startConfiguredGame);

els.nextBtn.addEventListener("click", () => {
  if (engine.getState().roundActive) {
    finishRound();
  } else {
    engine.startNextRound();
  }
});

els.endBtn.addEventListener("click", () => {
  timer.stop();
  engine.endGame();
});

function updateMusicUI() {
  els.musicToggle.textContent = `${music.enabled ? "🔊" : "🔇"} ${t("controls.music")}`;
  els.musicVolume.value = String(Math.round(music.volume * 100));
  els.musicTrack.value = music.track.id;
  els.musicPlayPause.textContent = music.playing && !music.paused ? "⏸" : "▶";
  els.musicPlayPause.setAttribute(
    "aria-label",
    t(music.playing && !music.paused ? "controls.pauseMusic" : "controls.playMusic")
  );
  els.sfxToggle.textContent = `${sfx.enabled ? "🔔" : "🔕"} ${t("controls.sfx")}`;
  els.sfxVolume.value = String(Math.round(sfx.volume * 100));
}

function updatePauseUI() {
  setText(els.pauseBtn, `${gamePaused ? "▶️" : "⏸️"} ${t(gamePaused ? "controls.resume" : "controls.pause")}`);
}

function pickTrack(move) {
  const track = move === "next" ? music.next() : music.prev();
  saveSetting({ musicTrack: track.id });
  updateMusicUI();
  return track;
}

// Populate the track picker from the music engine.
function renderTrackOptions() {
  els.musicTrack.replaceChildren();
  music.tracks.forEach((track) => {
    const option = document.createElement("option");
    option.value = track.id;
    option.textContent = track.name;
    els.musicTrack.appendChild(option);
  });
}

els.musicTrack.addEventListener("change", () => {
  const track = music.setTrack(els.musicTrack.value);
  saveSetting({ musicTrack: track.id });
  updateMusicUI();
});

els.musicToggle.addEventListener("click", () => {
  const next = !music.enabled;
  music.setEnabled(next);
  saveSetting({ musicEnabled: next });
  updateMusicUI();
});

els.musicVolume.addEventListener("input", () => {
  const value = Number(els.musicVolume.value) / 100;
  music.setVolume(value);
  saveSetting({ musicVolume: value });
});

els.musicPrev.addEventListener("click", () => pickTrack("prev"));
els.musicNext.addEventListener("click", () => pickTrack("next"));
els.musicPlayPause.addEventListener("click", () => {
  if (!music.enabled) {
    music.setEnabled(true);
    saveSetting({ musicEnabled: true });
  } else if (music.playing && !music.paused) {
    music.pause();
  } else {
    music.start();
  }
  updateMusicUI();
});

els.sfxToggle.addEventListener("click", () => {
  const next = !sfx.enabled;
  sfx.setEnabled(next);
  saveSetting({ sfxEnabled: next });
  updateMusicUI();
});
els.sfxVolume.addEventListener("input", () => {
  const value = Number(els.sfxVolume.value) / 100;
  sfx.setVolume(value);
  saveSetting({ sfxVolume: value });
});

els.pauseBtn.addEventListener("click", () => {
  if (!engine.getState().roundActive) return;
  gamePaused = !gamePaused;
  if (gamePaused) {
    timer.pause();
    engine.pause();
  } else {
    timer.resume();
    engine.resume();
  }
  updatePauseUI();
});

els.showChampionsBtn.addEventListener("click", () => {
  showChampionsOverlay(loadChampions(storage), { title: customChampionsTitle() });
});

// Every host-dock edit is persisted immediately.
els.hubSlug.addEventListener("input", () => saveSetting({ hubSlug: els.hubSlug.value.trim() }));
els.hubKey.addEventListener("input", () => saveSetting({ hubKey: els.hubKey.value.trim() }));
els.bridgeUrl.addEventListener("input", () => saveSetting({ bridgeUrl: els.bridgeUrl.value.trim() }));
els.hubUrl.addEventListener("input", () => saveSetting({ hubUrl: els.hubUrl.value.trim() }));

async function applyConnection() {
  const mode = /** @type {any} */ (els.connectionMode.value);
  const hubUrlInput = els.hubUrl.value.trim();
  const bridgeUrlInput = els.bridgeUrl.value.trim();
  saveSetting({
    connectionMode: mode,
    hubUrl: hubUrlInput,
    bridgeUrl: bridgeUrlInput,
    hubSlug: els.hubSlug.value.trim(),
    hubKey: els.hubKey.value.trim()
  });
  const result = await connector.setMode(mode, { hubUrl: hubUrlInput, bridgeUrl: bridgeUrlInput });
  updateHubUI();

  // Give clear feedback about what Connect actually did.
  const summary = connector.sources
    .map((s) => {
      const label = s.name === "hub" ? t("conn.hubLabel") : s.name === "bridge" ? t("conn.bridgeLabel") : "Demo";
      const dot = s.connected ? "🟢" : s.state === "connecting" ? "🟡" : "🔴";
      return `${label} ${dot}`;
    })
    .join(" · ");
  if (result.fellBack) {
    toast(`${t("conn.gameLost")} (${summary})`, "warn");
  } else if (connector.connected) {
    toast(`${t("conn.connected")} · ${summary}`, "success");
  } else {
    toast(`${summary}`, "warn");
  }
}

els.connectApply.addEventListener("click", applyConnection);
els.connectionMode.addEventListener("change", applyConnection);

// ===== Dock tabs =====
function setDockTab(name) {
  els.dockTabs.forEach((tab) => {
    const active = tab.dataset.tab === name;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  els.dockPanes.forEach((pane) => {
    pane.hidden = pane.dataset.pane !== name;
  });
  saveSetting({ dockTab: name });
}

els.dockTabs.forEach((tab) => {
  tab.addEventListener("click", () => setDockTab(tab.dataset.tab || "game"));
});
els.roundsInput.addEventListener("input", () => {
  saveSetting({ rounds: parseInt(els.roundsInput.value, 10) || CONFIG.defaultRounds });
});
els.durationInput.addEventListener("input", () => {
  saveSetting({ duration: parseInt(els.durationInput.value, 10) || CONFIG.defaultDuration });
});
els.gameName.addEventListener("input", () => {
  saveSetting({ gameName: els.gameName.value });
  applyGameName();
});
els.championsTitle.addEventListener("input", () => {
  saveSetting({ championsTitle: els.championsTitle.value });
  applyChampionsTitle();
});
els.clearChampionsBtn.addEventListener("click", () => {
  clearChampions(storage);
  refreshChampions();
});
els.resetScoresBtn.addEventListener("click", () => {
  engine.resetMatchScores();
  updateScores();
  renderRosterManager();
});
els.clearRosterBtn.addEventListener("click", () => {
  for (const player of engine.getRoster()) engine.removePlayer(player.id);
  updateScores();
  renderRosterManager();
});
els.langToggle.addEventListener("click", () => {
  const next = getLocale() === "ar" ? "en" : "ar";
  saveSetting({ locale: next });
  applyLocale(next);
});

els.playAgainBtn.addEventListener("click", () => {
  els.gameModal.classList.remove("show");
  startConfiguredGame();
});

// ===== Hub state reporting =====
function reportHubState(phase) {
  const state = engine.getState();
  connector.reportState({
    ready: true,
    phase,
    provider: connector.provider,
    locale: getLocale(),
    round: state.round,
    totalRounds: state.totalRounds,
    letters: state.letters,
    players: Object.keys(state.players).length,
    powerUps: {
      queued: powerUps.getPendingCount(),
      freezeSeconds: powerUps.getActiveFreezeSeconds(),
      pendingMultiplier: engine.getPendingMultiplier()
    },
    leaderboard: engine
      .getLeaderboard()
      .slice(0, 5)
      .map((player) => ({ name: player.name, score: player.score, words: player.words }))
  });
}

function updateHubUI() {
  const sources = connector.sources;
  const hub = sources.find((s) => s.name === "hub");
  const bridge = sources.find((s) => s.name === "bridge");
  const mock = sources.find((s) => s.name === "mock");
  const parts = [];

  const sourceLabel = (s) => {
    const name = s.name === "hub" ? t("conn.hubLabel") : s.name === "bridge" ? t("conn.bridgeLabel") : "Demo";
    if (s.connected) return `${name} 🟢`;
    if (s.state === "connecting") return `${name} 🟡`;
    if (s.state === "error") return `${name} 🔴 ${t("conn.offline")}`;
    return `${name} 🔴`;
  };

  if (hub) parts.push(sourceLabel(hub));
  if (bridge) parts.push(sourceLabel(bridge));
  if (mock) parts.push(`Demo 🟡`);
  const anyOnline = Boolean((hub && hub.connected) || (bridge && bridge.connected) || mock);
  setText(els.hubStatus, parts.length ? parts.join("  ·  ") : `🔴 ${t("hub.offline")}`);
  els.hubStatus.classList.toggle("conn-status--online", anyOnline);
}

// ===== Language + Hall title =====
function customChampionsTitle() {
  const custom = loadSettings(storage).championsTitle;
  return custom && custom.trim() ? custom.trim() : t("champions.title");
}

function applyChampionsTitle() {
  setText(els.championsPanelTitle, `🏆 ${customChampionsTitle()}`);
}

/** The game name (custom or localized default) drives the browser tab + header. */
function applyGameName() {
  const custom = loadSettings(storage).gameName;
  const name = custom && custom.trim() ? custom.trim() : t("app.title");
  document.title = name;
  setText(els.appTitle, name);
  return name;
}

/**
 * Switch locale and refresh every translated string + direction.
 * @param {string} locale
 */
function applyLocale(locale) {
  const resolved = setLocale(locale);
  document.documentElement.lang = resolved;
  document.documentElement.dir = resolved === "ar" ? "rtl" : "ltr";
  applyTranslations(document);
  els.langToggle.textContent = resolved === "ar" ? "English" : "العربية";
  updateMusicUI();
  updateHubUI();
  updatePauseUI();
  applyGameName();
  applyChampionsTitle();
  return resolved;
}

// ===== Remote input (hub/TikTok chat + gifts + effects) =====
connector.on("chat", ({ user, username, text, avatar }) => {
  if (!engine.getState().roundActive) return;
  const id = username || user || "viewer";
  const name = user || id;
  engine.addPlayer(id, name, avatar ?? null);
  engine.submitGuess(text, id);
});

// Gifts are mapped to effects entirely in the Tikora hub; the game only reacts
// to the resulting `effect` messages (so no gift names ever live in this code).
connector.on("effect", (effect) => {
  const powerUp = resolveEffect(effect.effect, effect.payload);
  const meta = {
    username: effect.event?.username || effect.event?.name || "",
    giftName: effect.event?.giftName || ""
  };
  const result = powerUp ? powerUps.apply(powerUp, meta) : { ok: false, reason: "unmapped" };
  if (result.ok) sfx.play("powerUp");
  connector.ackEffect(effect.id, {
    ok: Boolean(result.ok),
    reason: result.reason,
    queued: Boolean(result.queued),
    effect: effect.effect
  });
});

connector.on("status", updateHubUI);
connector.on("connected", updateHubUI);
connector.on("disconnected", updateHubUI);
connector.on("error", () => updateHubUI());

// ===== Init =====
initHostDock({ storage });
const hubGameConfig = /** @type {any} */ (globalThis).TIKORA_GAME_CONFIG;
const initialLocale =
  hubParams.get("lang") || (hubGameConfig && hubGameConfig.locale) || settings.locale || "ar";
applyLocale(initialLocale);
setText(els.totalRounds, settings.rounds);
els.roundsInput.value = String(settings.rounds);
els.durationInput.value = String(settings.duration);
els.championsTitle.value = settings.championsTitle || "";
els.gameName.value = settings.gameName || "";
audio.setMuted(settings.muted);
renderTrackOptions();
updateMusicUI();
updatePauseUI();
els.hubSlug.value = hubSlug;
els.hubKey.value = hubKey;
els.hubUrl.value = hubUrl;
els.bridgeUrl.value = bridgeUrl;
els.connectionMode.value = connectionMode;
setDockTab(settings.dockTab || "game");
updateHubUI();
applyChampionsTitle();
applyGameName();
updateScores();
refreshChampions();
updateTimerUI(settings.duration, settings.duration);
console.log(`🎮 Word guessing game loaded. Best score: ${loadBestScore(storage)}. Click بدء اللعبة to start.`);

connector.connect().catch(() => {});

/** Debug/integration hook for manual testing and future providers. */
/** @type {any} */ (globalThis).__game = { engine, timer, connector, audio, storage };

export { engine, timer, connector };
