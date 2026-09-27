import { CONFIG } from "../config.js";
import { WORD_SETS } from "../data/word-sets.js";
import { findFormableWords as defaultFindFormableWords } from "../data/dictionary.js";
import { normalizeArabic, isArabicLettersOnly } from "./normalize.js";
import { shuffle } from "./rng.js";
import { wordBaseScore, roundMultiplier, roundScoreFrom } from "./scoring.js";

/**
 * @typedef {Object} PlayerState
 * @property {string} id
 * @property {string} name
 * @property {string|null} avatar
 * @property {number} wordsFound
 * @property {number} pendingMultiplier
 * @property {number} roundBonus
 * @property {number} total
 * @property {number[]} roundBaseScores
 *
 * @typedef {Object} FoundWord
 * @property {string} word
 * @property {string} normalized
 * @property {number} base
 * @property {string} playerId
 *
 * @typedef {Object} GuessResult
 * @property {'ok'|'inactive'|'length'|'charset'|'duplicate'|'unformable'|'invalid'} status
 * @property {string} [word]
 * @property {number} [base]
 * @property {number} [roundScore]
 * @property {number} [total]
 * @property {number} [wordsFound]
 * @property {number} [multiplier]
 */

/**
 * @param {readonly string[]} wordLetters
 * @param {readonly string[]} pool
 * @returns {boolean}
 */
function canFormFrom(wordLetters, pool) {
  const remaining = [...pool];
  for (const letter of wordLetters) {
    const index = remaining.indexOf(letter);
    if (index === -1) return false;
    remaining.splice(index, 1);
  }
  return true;
}

export class GameEngine {
  /**
   * @param {Object} [options]
   * @param {readonly import('../data/word-sets.js').WordSet[]} [options.sets]
   * @param {(input: any[]) => any[]} [options.shuffleFn]
   * @param {(letters: readonly string[]) => string[]} [options.findFormableWords]
   */
  constructor(options = {}) {
    this.sets = options.sets ?? /** @type {any} */ (WORD_SETS);
    this.shuffleFn = options.shuffleFn ?? /** @type {(input: any[]) => any[]} */ (shuffle);
    this.findFormableWords = options.findFormableWords ?? defaultFindFormableWords;

    this.state = {
      isRunning: false,
      isPaused: false,
      roundActive: false,
      round: 0,
      totalRounds: CONFIG.defaultRounds,
      duration: CONFIG.defaultDuration,
      /** @type {import('../data/word-sets.js').WordSet | null} */
      currentSet: null,
      /** @type {string[]} */
      letters: [],
      /** @type {string[]} every dictionary word formable from the current tiles */
      validWords: [],
      /** @type {number[]} */
      usedSetIds: [],
      /** @type {Record<string, PlayerState>} */
      players: {},
      /** @type {FoundWord[]} */
      foundWords: []
    };

    /** @type {Record<string, Array<(payload?: any) => void>>} */
    this.listeners = {};
  }

  // ===== Event emitter =====
  /**
   * @param {string} event
   * @param {(payload?: any) => void} handler
   */
  on(event, handler) {
    (this.listeners[event] ??= []).push(handler);
    return this;
  }

  /**
   * @param {string} event
   * @param {(payload?: any) => void} handler
   */
  off(event, handler) {
    const list = this.listeners[event];
    if (list) this.listeners[event] = list.filter((fn) => fn !== handler);
    return this;
  }

  /**
   * @param {string} event
   * @param {any} [payload]
   */
  emit(event, payload) {
    for (const handler of this.listeners[event] ?? []) handler(payload);
  }

  // ===== Players =====
  /**
   * @param {string} id
   * @param {string} name
   * @param {string|null} [avatar]
   */
  addPlayer(id, name, avatar = null) {
    if (!this.state.players[id]) {
      this.state.players[id] = {
        id,
        name,
        avatar,
        wordsFound: 0,
        pendingMultiplier: 1,
        roundBonus: 0,
        total: 0,
        roundBaseScores: []
      };
    } else if (avatar) {
      this.state.players[id].avatar = avatar;
    }
    return this.state.players[id];
  }

  /** Remove a player from the current match. @param {string} id */
  removePlayer(id) {
    if (!this.state.players[id]) return false;
    delete this.state.players[id];
    this.emit("rosterchange", { id, removed: true });
    this.emit("scoreupdate", { playerId: id, leaderboard: this.getLeaderboard() });
    return true;
  }

  /**
   * Add `delta` (may be negative) to a player's match total, clamped at 0.
   * @param {string} id
   * @param {number} delta
   */
  adjustPlayerTotal(id, delta) {
    const player = this.state.players[id];
    if (!player) return false;
    player.total = Math.max(0, (Math.floor(player.total) || 0) + (Math.floor(delta) || 0));
    this.emit("rosterchange", { id, adjusted: true });
    this.emit("scoreupdate", { playerId: id, leaderboard: this.getLeaderboard() });
    return true;
  }

  /**
   * Award bonus points to a player (Extra Points power-up).
   * @param {string} id
   * @param {number} amount
   * @returns {boolean}
   */
  addPoints(id, amount) {
    return this.adjustPlayerTotal(id, amount);
  }

  /** Reshuffle the current round's letter tiles (cosmetic, doesn't change valid words). */
  reshuffleLetters() {
    if (!this.state.letters.length) return false;
    this.state.letters = this.shuffleFn(this.state.letters);
    this.emit("letterschange", { letters: [...this.state.letters] });
    return true;
  }

  /** Clear every player's match score (keeps them on the board). */
  resetMatchScores() {
    for (const player of Object.values(this.state.players)) {
      player.total = 0;
      player.wordsFound = 0;
      player.roundBonus = 0;
      player.roundBaseScores = [];
    }
    this.emit("rosterchange", { reset: true });
    this.emit("scoreupdate", { playerId: null, leaderboard: this.getLeaderboard() });
  }

  /** @returns {Array<{id:string, name:string, words:number, roundScore:number, score:number}>} */
  getRoster() {
    return Object.values(this.state.players).map((player) => ({
      id: player.id,
      name: player.name,
      words: player.wordsFound,
      roundScore: roundScoreFrom(player.roundBaseScores, player.roundBonus),
      score: player.total + roundScoreFrom(player.roundBaseScores, player.roundBonus)
    }));
  }

  // ===== Game control =====
  /**
   * @param {Object} [options]
   * @param {number} [options.totalRounds]
   * @param {number} [options.duration]
   */
  startGame(options = {}) {
    this.state.totalRounds = options.totalRounds ?? CONFIG.defaultRounds;
    this.state.duration = options.duration ?? CONFIG.defaultDuration;
    this.state.round = 0;
    this.state.usedSetIds = [];
    this.state.foundWords = [];
    this.state.isRunning = true;
    this.state.isPaused = false;
    this.state.roundActive = false;
    for (const player of Object.values(this.state.players)) {
      player.total = 0;
      player.wordsFound = 0;
      player.roundBonus = 0;
      player.pendingMultiplier = 1;
      player.roundBaseScores = [];
    }
    this.emit("gamestart", { totalRounds: this.state.totalRounds, duration: this.state.duration });
    return this.startNextRound();
  }

  startNextRound() {
    if (!this.state.isRunning) return null;
    if (this.state.round >= this.state.totalRounds) return this.endGame();

    this.state.round += 1;
    this.state.foundWords = [];
    for (const player of Object.values(this.state.players)) {
      player.roundBaseScores = [];
      player.roundBonus = 0;
      player.pendingMultiplier = 1;
    }

    let available = this.sets.filter((_, index) => !this.state.usedSetIds.includes(index));
    if (available.length === 0) {
      this.state.usedSetIds = [];
      available = [...this.sets];
    }
    const chosen = this.shuffleFn(available)[0];
    this.state.usedSetIds.push(this.sets.indexOf(chosen));

    this.state.currentSet = chosen;
    this.state.letters = this.shuffleFn(chosen.letters);
    const formable = this.findFormableWords(this.state.letters);
    this.state.validWords = formable.length > 0 ? formable : [...chosen.words];
    this.state.roundActive = true;

    const payload = {
      round: this.state.round,
      totalRounds: this.state.totalRounds,
      letters: [...this.state.letters],
      set: chosen,
      duration: this.state.duration
    };
    this.emit("roundstart", payload);
    return payload;
  }

  /**
   * @returns {{round:number, letters:string[], found:FoundWord[], missed:string[], roundScores:Record<string,number>}|null}
   */
  endRound() {
    if (!this.state.roundActive || !this.state.currentSet) return null;
    this.state.roundActive = false;

    /** @type {Record<string, number>} */
    const roundScores = {};
    for (const player of Object.values(this.state.players)) {
      const roundScore = roundScoreFrom(player.roundBaseScores, player.roundBonus);
      roundScores[player.id] = roundScore;
      player.total += roundScore;
      player.roundBaseScores = [];
      player.roundBonus = 0;
      player.pendingMultiplier = 1;
    }

    const missed = this.state.validWords.filter(
      (word) => !this.state.foundWords.some((found) => found.normalized === normalizeArabic(word))
    );

    const payload = {
      round: this.state.round,
      letters: [...this.state.letters],
      found: [...this.state.foundWords],
      missed,
      roundScores
    };
    this.emit("roundend", payload);
    return payload;
  }

  endGame() {
    this.state.isRunning = false;
    this.state.roundActive = false;
    const leaderboard = this.getLeaderboard();
    const payload = { winner: leaderboard[0] ?? null, leaderboard };
    this.emit("gameend", payload);
    return payload;
  }

  pause() {
    this.state.isPaused = true;
    this.emit("pause");
  }

  resume() {
    this.state.isPaused = false;
    this.emit("resume");
  }

  // ===== Guess handling =====
  /**
   * @param {string} raw
   * @param {string} [playerId]
   * @returns {GuessResult}
   */
  submitGuess(raw, playerId = CONFIG.localPlayerId) {
    if (!this.state.isRunning || !this.state.roundActive || !this.state.currentSet) {
      return { status: "inactive" };
    }
    const player = this.state.players[playerId];
    if (!player) return { status: "inactive" };

    const normalized = normalizeArabic(raw);
    if (normalized.length < CONFIG.minWordLength || normalized.length > CONFIG.maxWordLength) {
      return { status: "length" };
    }
    if (!isArabicLettersOnly(normalized)) {
      return { status: "charset" };
    }
    if (this.state.foundWords.some((found) => found.normalized === normalized)) {
      return { status: "duplicate" };
    }

    const pool = this.state.letters.map((letter) => normalizeArabic(letter));
    if (!canFormFrom([...normalized], pool)) {
      return { status: "unformable" };
    }

    const target = this.state.validWords.find((word) => normalizeArabic(word) === normalized);
    if (!target) {
      return { status: "invalid" };
    }

    const base = wordBaseScore(target);
    // Consume a "next word" multiplier power-up, if armed.
    const wordBonus = Math.round(base * (player.pendingMultiplier - 1));
    player.pendingMultiplier = 1;

    /** @type {FoundWord} */
    const record = { word: target, normalized, base, playerId };
    this.state.foundWords.push(record);
    player.roundBaseScores.push(base);
    player.roundBonus += wordBonus;
    player.wordsFound += 1;

    const roundScore = roundScoreFrom(player.roundBaseScores, player.roundBonus);
    const total = player.total + roundScore;
    const result = {
      status: /** @type {const} */ ("ok"),
      word: target,
      playerId,
      base,
      bonus: wordBonus,
      roundScore,
      total,
      wordsFound: player.roundBaseScores.length,
      multiplier: roundMultiplier(player.roundBaseScores.length)
    };
    this.emit("wordfound", result);
    this.emit("scoreupdate", { playerId, roundScore, total, leaderboard: this.getLeaderboard() });

    if (this.state.foundWords.length === this.state.validWords.length) {
      this.emit("allfound", { round: this.state.round });
    }
    return result;
  }

  // ===== Getters =====
  getState() {
    return { ...this.state, letters: [...this.state.letters] };
  }

  /**
   * @returns {Array<{id:string, name:string, avatar:string|null, words:number, score:number}>}
   */
  getLeaderboard() {
    return Object.values(this.state.players)
      .map((player) => ({
        id: player.id,
        name: player.name,
        avatar: player.avatar,
        words: player.wordsFound,
        score: player.total + roundScoreFrom(player.roundBaseScores, player.roundBonus)
      }))
      .sort((a, b) => b.score - a.score || b.words - a.words);
  }

  getWinner() {
    return this.getLeaderboard()[0] ?? null;
  }

  getRoundScore(playerId = CONFIG.localPlayerId) {
    const player = this.state.players[playerId];
    return player ? roundScoreFrom(player.roundBaseScores, player.roundBonus) : 0;
  }

  getTotalScore(playerId = CONFIG.localPlayerId) {
    const player = this.state.players[playerId];
    return player ? player.total + roundScoreFrom(player.roundBaseScores, player.roundBonus) : 0;
  }

  /**
   * Arm a bonus multiplier for this player's next found word (Double Points).
   * Stacks up to x3.
   * @param {number} multiplier
   * @param {string} [playerId]
   * @returns {number} the armed multiplier
   */
  armNextWordMultiplier(multiplier, playerId = CONFIG.localPlayerId) {
    const player = this.state.players[playerId];
    if (!player) return 1;
    const clamped = Math.min(3, Math.max(1, Math.round(Number(multiplier) || 1)));
    player.pendingMultiplier = Math.max(player.pendingMultiplier || 1, clamped);
    return player.pendingMultiplier;
  }

  /**
   * @param {string} [playerId]
   * @returns {number}
   */
  getPendingMultiplier(playerId = CONFIG.localPlayerId) {
    return this.state.players[playerId]?.pendingMultiplier ?? 1;
  }

  /**
   * Word shape used by the Length Hint power-up: first letter + blanks, e.g. "ب__".
   * @param {string} word
   * @returns {string}
   */
  getWordShape(word) {
    const normalized = normalizeArabic(word);
    if (!normalized) return "";
    return normalized[0] + "_".repeat(Math.max(0, normalized.length - 1));
  }

  getRemainingTargets() {
    return this.state.validWords.filter(
      (word) => !this.state.foundWords.some((found) => found.normalized === normalizeArabic(word))
    );
  }

  getValidWords() {
    return [...this.state.validWords];
  }

  /** @returns {number} words found by all viewers this round (no local player). */
  getRoundWordCount() {
    return this.state.foundWords.length;
  }

  getCurrentLetters() {
    return [...this.state.letters];
  }
}
