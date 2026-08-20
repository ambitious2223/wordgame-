// Game Engine for TikTok Arabic Word Guessing Game
// Handles game state, validation, scoring, and round management

class GameEngine {
  constructor() {
    // Game state
    this.state = {
      isRunning: false,
      isPaused: false,
      currentRound: 0,
      totalRounds: 10,
      roundDuration: 15,
      letters: [],
      validWords: [],
      foundWords: [],
      players: {},
      currentPlayer: null,
      scores: {},
      combo: {},
      roundStartTime: null,
      timeRemaining: 15
    };
    
    // Callbacks
    this.onRoundStart = null;
    this.onRoundEnd = null;
    this.onWordFound = null;
    this.onScoreUpdate = null;
    this.onGameEnd = null;
    this.onTimeUpdate = null;
    this.onLetterReveal = null;
    this.onComboUpdate = null;
    
    // Timer reference
    this.timerInterval = null;
    
    // Initialize
    this.init();
  }
  
  init() {
    console.log('🎮 Game Engine initialized');
  }
  
  // ===== Game Control =====
  
  startGame(options = {}) {
    this.state.totalRounds = options.totalRounds || 10;
    this.state.roundDuration = options.roundDuration || 15;
    this.state.currentRound = 0;
    this.state.players = {};
    this.state.scores = {};
    this.state.combo = {};
    this.state.isRunning = true;
    
    console.log(`🎮 Game started: ${this.state.totalRounds} rounds, ${this.state.roundDuration}s each`);
    
    this.startNextRound();
  }
  
  endGame() {
    this.state.isRunning = false;
    this.stopTimer();
    
    const winner = this.getWinner();
    
    console.log('🏆 Game ended!', winner);
    
    if (this.onGameEnd) {
      this.onGameEnd(winner, this.state.scores);
    }
    
    return winner;
  }
  
  pauseGame() {
    this.state.isPaused = true;
    this.stopTimer();
    console.log('⏸️ Game paused');
  }
  
  resumeGame() {
    this.state.isPaused = false;
    this.startTimer();
    console.log('▶️ Game resumed');
  }
  
  // ===== Round Management =====
  
  startNextRound() {
    if (this.state.currentRound >= this.state.totalRounds) {
      return this.endGame();
    }
    
    this.state.currentRound++;
    this.state.foundWords = [];
    this.state.timeRemaining = this.state.roundDuration;
    
    // Generate letter set
    this.state.letters = this.generateLetterSet();
    
    // Find valid words
    this.state.validWords = this.findValidWords(this.state.letters);
    
    // Reset timer
    this.state.roundStartTime = Date.now();
    
    console.log(`📝 Round ${this.state.currentRound}: Letters = ${this.state.letters.join(', ')}`);
    console.log(`   Valid words: ${this.state.validWords.map(w => w.word).join(', ')}`);
    
    // Start timer
    this.startTimer();
    
    // Callback
    if (this.onRoundStart) {
      this.onRoundStart({
        round: this.state.currentRound,
        letters: this.state.letters,
        timeLimit: this.state.roundDuration
      });
    }
    
    return {
      round: this.state.currentRound,
      letters: this.state.letters,
      timeLimit: this.state.roundDuration
    };
  }
  
  endRound() {
    this.stopTimer();
    
    const roundResult = {
      round: this.state.currentRound,
      letters: this.state.letters,
      validWords: this.state.validWords,
      foundWords: this.state.foundWords,
      timeRemaining: this.state.timeRemaining
    };
    
    console.log(`⏰ Round ${this.state.currentRound} ended`);
    console.log(`   Found: ${this.state.foundWords.length}/${this.state.validWords.length} words`);
    
    // Callback
    if (this.onRoundEnd) {
      this.onRoundEnd(roundResult);
    }
    
    return roundResult;
  }
  
  // ===== Letter Management =====
  
  generateLetterSet() {
    // Use pre-defined letter sets for now
    const randomIndex = Math.floor(Math.random() * ARABIC_WORDS.letterSets.length);
    const letterSet = ARABIC_WORDS.letterSets[randomIndex];
    return ArabicHelper.scrambleLetters(letterSet.letters);
  }
  
  findValidWords(letters) {
    return ArabicHelper.findValidWords(letters);
  }
  
  // ===== Guess Validation =====
  
  processGuess(playerId, guess) {
    if (!this.state.isRunning) {
      return { valid: false, reason: 'Game not running' };
    }
    
    // Normalize the guess
    const normalizedGuess = this.normalizeArabic(guess);
    
    // Check if already found
    if (this.state.foundWords.some(w => w.word === normalizedGuess)) {
      return { valid: false, reason: 'Already found', word: normalizedGuess };
    }
    
    // Check if word can be formed from letters
    if (!ArabicHelper.canFormWord(normalizedGuess, this.state.letters)) {
      return { valid: false, reason: 'Cannot form word from letters', word: normalizedGuess };
    }
    
    // Check if it's a valid word
    const validWord = this.state.validWords.find(w => w.word === normalizedGuess);
    if (!validWord) {
      return { valid: false, reason: 'Not a valid word', word: normalizedGuess };
    }
    
    // Calculate score
    const baseScore = ArabicHelper.calculateWordScore(normalizedGuess);
    const multiplier = this.getScoreMultiplier(playerId);
    const totalScore = Math.floor(baseScore * multiplier);
    
    // Add to found words
    this.state.foundWords.push({
      word: normalizedGuess,
      meaning: validWord.meaning,
      score: totalScore,
      playerId: playerId
    });
    
    // Update player score
    this.updatePlayerScore(playerId, totalScore);
    
    // Update combo
    this.updateCombo(playerId);
    
    // Callback
    if (this.onWordFound) {
      this.onWordFound({
        word: normalizedGuess,
        meaning: validWord.meaning,
        score: totalScore,
        playerId: playerId,
        combo: this.state.combo[playerId] || 1
      });
    }
    
    console.log(`✅ ${playerId} found "${normalizedGuess}" (+${totalScore} pts)`);
    
    return {
      valid: true,
      word: normalizedGuess,
      meaning: validWord.meaning,
      score: totalScore,
      multiplier: multiplier,
      combo: this.state.combo[playerId] || 1
    };
  }
  
  normalizeArabic(text) {
    // Remove diacritics and normalize
    return text
      .replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '') // Remove diacritics
      .replace(/[إأآا]/g, 'ا') // Normalize alef
      .replace(/ة/g, 'ه') // Normalize ta marbuta
      .replace(/ى/g, 'ي') // Normalize alef maqsura
      .trim();
  }
  
  // ===== Scoring =====
  
  getScoreMultiplier(playerId) {
    const combo = this.state.combo[playerId] || 0;
    
    if (combo >= 4) return 3;
    if (combo >= 3) return 2;
    if (combo >= 2) return 1.5;
    return 1;
  }
  
  updatePlayerScore(playerId, points) {
    if (!this.state.scores[playerId]) {
      this.state.scores[playerId] = 0;
    }
    
    this.state.scores[playerId] += points;
    
    // Callback
    if (this.onScoreUpdate) {
      this.onScoreUpdate(playerId, this.state.scores[playerId]);
    }
  }
  
  updateCombo(playerId) {
    if (!this.state.combo[playerId]) {
      this.state.combo[playerId] = 0;
    }
    
    this.state.combo[playerId]++;
    
    // Callback
    if (this.onComboUpdate) {
      this.onComboUpdate(playerId, this.state.combo[playerId]);
    }
  }
  
  resetCombo(playerId) {
    this.state.combo[playerId] = 0;
  }
  
  // ===== Timer =====
  
  startTimer() {
    this.stopTimer();
    
    this.timerInterval = setInterval(() => {
      if (this.state.isPaused) return;
      
      this.state.timeRemaining--;
      
      // Callback
      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.state.timeRemaining, this.state.roundDuration);
      }
      
      if (this.state.timeRemaining <= 0) {
        this.endRound();
      }
    }, 1000);
  }
  
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
  
  // ===== Power-ups =====
  
  applyPowerUp(powerUp) {
    switch (powerUp.type) {
      case 'add_time':
        this.state.timeRemaining += powerUp.value;
        console.log(`⏰ +${powerUp.value} seconds added`);
        break;
        
      case 'reveal_letter':
        this.revealRandomLetter();
        break;
        
      case 'score_multiplier':
        // Applied to next word
        console.log(`✨ 2x score multiplier activated`);
        break;
        
      case 'freeze_timer':
        this.pauseGame();
        setTimeout(() => this.resumeGame(), powerUp.value * 1000);
        console.log(`❄️ Timer frozen for ${powerUp.value} seconds`);
        break;
        
      default:
        console.log(`🎁 Unknown power-up: ${powerUp.type}`);
    }
  }
  
  revealRandomLetter() {
    // Find unrevealed letters
    const unrevealed = this.state.validWords[0]?.letters || [];
    if (unrevealed.length > 0) {
      const randomLetter = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      console.log(`🔍 Revealed letter: ${randomLetter}`);
      
      if (this.onLetterReveal) {
        this.onLetterReveal(randomLetter);
      }
    }
  }
  
  // ===== Player Management =====
  
  addPlayer(playerId, playerName) {
    if (!this.state.players[playerId]) {
      this.state.players[playerId] = {
        id: playerId,
        name: playerName,
        joinTime: Date.now(),
        wordsFound: 0
      };
      
      this.state.scores[playerId] = 0;
      this.state.combo[playerId] = 0;
      
      console.log(`👤 Player joined: ${playerName}`);
    }
  }
  
  removePlayer(playerId) {
    if (this.state.players[playerId]) {
      console.log(`👤 Player left: ${this.state.players[playerId].name}`);
      delete this.state.players[playerId];
      delete this.state.scores[playerId];
      delete this.state.combo[playerId];
    }
  }
  
  // ===== Leaderboard =====
  
  getLeaderboard() {
    const leaderboard = Object.entries(this.state.scores)
      .map(([playerId, score]) => ({
        playerId,
        name: this.state.players[playerId]?.name || playerId,
        score,
        wordsFound: this.state.foundWords.filter(w => w.playerId === playerId).length
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    return leaderboard;
  }
  
  getWinner() {
    const leaderboard = this.getLeaderboard();
    return leaderboard[0] || null;
  }
  
  // ===== State Getters =====
  
  getState() {
    return { ...this.state };
  }
  
  getCurrentLetters() {
    return [...this.state.letters];
  }
  
  getValidWords() {
    return [...this.state.validWords];
  }
  
  getFoundWords() {
    return [...this.state.foundWords];
  }
  
  getPlayerScore(playerId) {
    return this.state.scores[playerId] || 0;
  }
  
  getPlayerCombo(playerId) {
    return this.state.combo[playerId] || 0;
  }
  
  getTimeRemaining() {
    return this.state.timeRemaining;
  }
  
  getRound() {
    return {
      current: this.state.currentRound,
      total: this.state.totalRounds
    };
  }
  
  isRunning() {
    return this.state.isRunning;
  }
  
  // ===== Debug =====
  
  debugState() {
    console.log('=== Game State ===');
    console.log(`Running: ${this.state.isRunning}`);
    console.log(`Round: ${this.state.currentRound}/${this.state.totalRounds}`);
    console.log(`Letters: ${this.state.letters.join(', ')}`);
    console.log(`Valid words: ${this.state.validWords.length}`);
    console.log(`Found words: ${this.state.foundWords.length}`);
    console.log(`Time remaining: ${this.state.timeRemaining}s`);
    console.log(`Players: ${Object.keys(this.state.players).length}`);
    console.log('==================');
  }
}

// Create global game instance
const game = new GameEngine();
