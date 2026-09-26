import { CONFIG } from "./config.js";
import { GameEngine } from "./core/engine.js";
import { RoundTimer } from "./ui/timer.js";
import { el, inputEl, setText, create } from "./ui/dom.js";
import { toast, scorePopup, showRoundResults } from "./ui/feedback.js";
import { loadSettings, saveSettings, loadBestScore, saveBestScore, loadChampions, addChampion, safeStorage } from "./core/store.js";
import { createRateLimiter } from "./core/rate-limit.js";
import { createConnector } from "./integrations/connector.js";
import { resolveEffect } from "./core/powerups.js";
import { createPowerUpManager } from "./core/powerup-manager.js";
import { createAudioManager } from "./ui/audio.js";
import { createMusicManager } from "./ui/music.js";
import { initHostDock } from "./ui/host-dock.js";
import { showChampionsOverlay } from "./ui/champions-show.js";
import { t, setLocale, applyTranslations } from "./i18n/index.js";

const engine = new GameEngine();
engine.addPlayer(CONFIG.localPlayerId, CONFIG.localPlayerName);

const storage = safeStorage();
const settings = loadSettings(storage);
const rateLimiter = createRateLimiter({ minIntervalMs: 150, maxBurst: 8 });
const audio = createAudioManager({ muted: settings.muted });
const music = createMusicManager({ enabled: settings.musicEnabled, volume: settings.musicVolume });

// Hub config: URL params (set by the Tikora launcher) win over saved settings.
const hubParams = typeof location !== "undefined" ? new URLSearchParams(location.search) : new URLSearchParams();
const hubSlug = hubParams.get("game") || settings.hubSlug || "word-challenge";
const hubKey = hubParams.get("key") || settings.hubKey || "";

const connector = createConnector({
  provider: "auto",
  gameSlug: hubSlug,
  apiKey: hubKey
});

/** Register sound file paths here as they become available (src/assets/sounds). */
const SOUNDS = Object.freeze({});
function playSound(name) {
  const src = SOUNDS[name];
  if (src) audio.play(src);
}

const els = {
  roundNum: el("roundNum"),
  totalRounds: el("totalRounds"),
  lettersRow: el("lettersRow"),
  scoreValue: el("scoreValue"),
  multiplierValue: el("multiplierValue"),
  roundScore: el("roundScore"),
  wordDisplay: el("wordDisplay"),
  wordPlaceholder: el("wordPlaceholder"),
  guessInput: inputEl("guessInput"),
  submitBtn: el("submitBtn"),
  foundList: el("foundList"),
  liveLeaderboard: el("liveLeaderboard"),
  matchStandings: el("matchStandings"),
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
  wordArea: el("wordArea"),
  musicToggle: el("musicToggle"),
  musicVolume: inputEl("musicVolume"),
  showChampionsBtn: el("showChampionsBtn"),
  hubStatus: el("hubStatus"),
  hubSlug: inputEl("hubSlug"),
  hubKey: inputEl("hubKey")
};

/** @type {{letter:string, index:number}[]} */
let built = [];

const timer = new RoundTimer({
  onTick: updateTimerUI,
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
    const button = document.createElement("button");
    button.type = "button";
    button.className = "letter-box";
    button.textContent = letter;
    button.dataset.index = String(index);
    button.dataset.letter = letter;
    button.style.animationDelay = `${index * 0.1}s`;
    button.setAttribute("aria-label", `الحرف ${letter}`);
    button.addEventListener("click", () => toggleLetter(index, letter));
    els.lettersRow.appendChild(button);
  });
}

function toggleLetter(index, letter) {
  const existing = built.findIndex((item) => item.index === index);
  const tile = els.lettersRow.querySelector(`[data-index="${index}"]`);
  if (existing !== -1) {
    built.splice(existing, 1);
    tile?.classList.remove("used");
  } else {
    built.push({ letter, index });
    tile?.classList.add("used");
  }
  updateWordDisplay();
}

function updateWordDisplay() {
  const text = built.map((item) => item.letter).join("");
  els.wordDisplay.textContent = text;
  els.wordPlaceholder.style.display = text ? "none" : "inline";
}

function resetBuilder() {
  built = [];
  els.lettersRow.querySelectorAll(".letter-box").forEach((node) => node.classList.remove("used"));
  els.guessInput.value = "";
  updateWordDisplay();
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
    row.appendChild(create("span", "leader-name", `@${player.name}`));
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
  fillLeaderboard(els.matchStandings, leaderboard);
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
    row.appendChild(create("span", "leader-name", `@${champion.name}`));
    row.appendChild(create("span", "leader-score", String(champion.score)));
    els.champions.appendChild(row);
  });
}

function addFoundWord(word) {
  els.foundList.appendChild(create("span", "found-word", word));
}

function updateScores() {
  const state = engine.getState();
  const player = state.players[CONFIG.localPlayerId];
  const wordsFound = player ? player.roundBaseScores.length : 0;
  const multiplier = wordsFound >= 4 ? 3 : wordsFound === 3 ? 2 : wordsFound === 2 ? 1.5 : 1;
  setText(els.scoreValue, engine.getTotalScore());
  setText(els.roundScore, engine.getRoundScore());
  setText(els.multiplierValue, `×${multiplier}`);
  renderLeaderboard(engine.getLeaderboard());
}

// ===== Round flow =====
function finishRound() {
  timer.stop();
  if (engine.getState().roundActive) {
    engine.endRound();
  }
}

function submitGuess() {
  const raw = els.guessInput.value.trim() || built.map((item) => item.letter).join("");
  if (!raw) return;
  if (!rateLimiter.allow()) return;
  const result = engine.submitGuess(raw, CONFIG.localPlayerId);

  switch (result.status) {
    case "ok":
      resetBuilder();
      break;
    case "inactive":
      toast(t("toast.startFirst"), "warn");
      break;
    case "length":
      toast(t("toast.length"), "error");
      resetBuilder();
      break;
    case "charset":
      toast(t("toast.charset"), "error");
      resetBuilder();
      break;
    case "duplicate":
      toast(t("toast.duplicate"), "warn");
      resetBuilder();
      break;
    case "unformable":
      toast(t("toast.unformable"), "error");
      resetBuilder();
      break;
    default:
      toast(t("toast.invalid"), "error");
      resetBuilder();
  }
}

// ===== Engine events =====
engine.on("roundstart", (payload) => {
  renderLetters(payload.letters);
  resetBuilder();
  els.foundList.replaceChildren();
  setText(els.roundNum, payload.round);
  setText(els.totalRounds, payload.totalRounds);
  setText(els.roundScore, 0);
  setText(els.possibleCount, t("round.possible", { count: engine.getValidWords().length }));
  updateScores();
  timer.start(payload.duration);
  powerUps.onRoundStart();
  reportHubState("round");
});

engine.on("wordfound", (result) => {
  addFoundWord(result.word);
  if (result.playerId === CONFIG.localPlayerId) {
    scorePopup({ base: result.base, multiplier: result.multiplier });
    playSound("correct");
  }
});

engine.on("scoreupdate", () => {
  updateScores();
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
  reportHubState("results");
  const isLast = payload.round >= engine.getState().totalRounds;
  showRoundResults(
    {
      round: payload.round,
      totalRounds: engine.getState().totalRounds,
      found: payload.found,
      missed: payload.missed,
      roundScore: payload.roundScores[CONFIG.localPlayerId] ?? 0,
      isLast
    },
    () => engine.startNextRound()
  );
});

engine.on("gameend", (payload) => {
  timer.stop();
  reportHubState("gameover");
  if (payload.winner) {
    saveBestScore(storage, payload.winner.score);
    addChampion(storage, { name: payload.winner.name, score: payload.winner.score });
    renderChampions(loadChampions(storage));
    setText(els.winnerName, `@${payload.winner.name}`);
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
}

els.musicToggle.addEventListener("click", () => {
  const next = !music.enabled;
  music.setEnabled(next);
  saveSettings(storage, { ...loadSettings(storage), musicEnabled: next });
  updateMusicUI();
});

els.musicVolume.addEventListener("input", () => {
  const value = Number(els.musicVolume.value) / 100;
  music.setVolume(value);
  saveSettings(storage, { ...loadSettings(storage), musicVolume: value });
});

els.showChampionsBtn.addEventListener("click", () => {
  showChampionsOverlay(loadChampions(storage));
});

function saveHubConfig() {
  saveSettings(storage, {
    ...loadSettings(storage),
    hubSlug: els.hubSlug.value.trim(),
    hubKey: els.hubKey.value.trim()
  });
}
els.hubSlug.addEventListener("change", saveHubConfig);
els.hubKey.addEventListener("change", saveHubConfig);

els.submitBtn.addEventListener("click", submitGuess);
els.guessInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") submitGuess();
});
els.wordArea.addEventListener("click", resetBuilder);
els.playAgainBtn.addEventListener("click", () => {
  els.gameModal.classList.remove("show");
  startConfiguredGame();
});

document.addEventListener("keydown", (event) => {
  const target = /** @type {HTMLElement} */ (event.target);
  const isTyping = target instanceof HTMLInputElement;
  if (event.key === "Backspace" && !isTyping && built.length > 0) {
    const last = built[built.length - 1];
    const tile = els.lettersRow.querySelector(`[data-index="${last.index}"]`);
    tile?.classList.remove("used");
    built.pop();
    updateWordDisplay();
  }
});

// ===== Hub state reporting =====
function reportHubState(phase) {
  const state = engine.getState();
  connector.reportState({
    ready: true,
    phase,
    provider: connector.provider,
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
  const online = connector.provider === "hub" && connector.connected;
  setText(els.hubStatus, online ? `🟢 ${t("hub.online")}` : `🔴 ${t("hub.offline")}`);
  els.hubStatus.classList.toggle("hub-status--online", online);
}

// ===== Remote input (hub/TikTok chat + gifts + effects) =====
connector.on("chat", ({ user, text, avatar }) => {
  if (!engine.getState().roundActive) return;
  engine.addPlayer(user, user, avatar ?? null);
  engine.submitGuess(text, user);
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
setLocale(settings.locale);
applyTranslations(document);
setText(els.totalRounds, settings.rounds);
els.roundsInput.value = String(settings.rounds);
els.durationInput.value = String(settings.duration);
audio.setMuted(settings.muted);
updateMusicUI();
els.hubSlug.value = hubSlug;
els.hubKey.value = hubKey;
updateHubUI();
updateWordDisplay();
updateScores();
renderChampions(loadChampions(storage));
updateTimerUI(settings.duration, settings.duration);
console.log(`🎮 Word guessing game loaded. Best score: ${loadBestScore(storage)}. Click بدء اللعبة to start.`);

connector.connect().catch(() => {});

/** Debug/integration hook for manual testing and future providers. */
/** @type {any} */ (globalThis).__game = { engine, timer, connector, audio, storage };

export { engine, timer, connector };
