// Main Entry Point for TikTok Arabic Word Guessing Game
// Initializes and connects all game components

// ===== Game Configuration =====
const CONFIG = {
  // Default settings
  defaultRounds: 10,
  defaultDuration: 15,
  
  // Scoring
  baseScorePerLetter: 1,
  comboThresholds: {
    2: 1.5,  // 2 words = 1.5x
    3: 2,    // 3 words = 2x
    4: 3     // 4+ words = 3x
  },
  
  // Bonuses
  bonuses: {
    firstGuess: 5,
    longestWord: 10,
    allWords: 20
  },
  
  // Animation durations
  animation: {
    letterReveal: 100,
    scorePopup: 1000,
    roundTransition: 2000,
    roundEnd: 3000,
    powerUpNotification: 3000,
    vipEntry: 5000
  }
};

// ===== Initialize Game =====
function initGame() {
  console.log('🎮 Initializing TikTok Arabic Word Guessing Game...');
  
  // Set up game callbacks
  setupGameCallbacks();
  
  // Set up UI callbacks
  setupUICallbacks();
  
  // Show streamer controls
  ui.showStreamerControls();
  
  // Set initial state
  ui.updateRoundInfo(0, CONFIG.defaultRounds);
  ui.updatePlayerCount(0);
  
  // Add demo players
  addDemoPlayers();
  
  console.log('✅ Game initialized successfully!');
  console.log('📝 Click "بدء اللعبة" to start');
}

// ===== Game Callbacks =====
function setupGameCallbacks() {
  // Round start
  game.onRoundStart = (data) => {
    console.log(`🎯 Round ${data.round} started`);
    
    // Update UI
    ui.updateRoundInfo(data.round, game.getState().totalRounds);
    ui.setLetters(data.letters);
    ui.clearFoundWords();
    
    // Start timer
    timer.start(data.timeLimit);
    
    // Update player count
    const playerCount = Object.keys(game.getState().players).length;
    ui.updatePlayerCount(playerCount);
  };
  
  // Round end
  game.onRoundEnd = (data) => {
    console.log(`⏰ Round ${data.round} ended`);
    
    // Stop timer
    timer.stop();
    
    // Show round end screen
    ui.showRoundEnd(data.foundWords, data.validWords, () => {
      // Check if game should continue
      if (game.isRunning()) {
        game.startNextRound();
      }
    });
  };
  
  // Word found
  game.onWordFound = (data) => {
    console.log(`✅ Word found: ${data.word}`);
    
    // Update score display
    const score = game.getPlayerScore(data.playerId);
    ui.updateScore(score);
    
    // Update combo
    ui.updateCombo(data.combo);
    
    // Update leaderboard
    const leaderboard = game.getLeaderboard();
    ui.updateLeaderboard(leaderboard);
  };
  
  // Score update
  game.onScoreUpdate = (playerId, score) => {
    if (playerId === 'player1') {
      ui.updateScore(score);
    }
    
    // Update leaderboard
    const leaderboard = game.getLeaderboard();
    ui.updateLeaderboard(leaderboard);
  };
  
  // Combo update
  game.onComboUpdate = (playerId, combo) => {
    if (playerId === 'player1') {
      ui.updateCombo(combo);
    }
  };
  
  // Game end
  game.onGameEnd = (winner, scores) => {
    console.log('🏆 Game ended!');
    
    // Stop timer
    timer.stop();
    
    // Show game over modal
    if (winner) {
      ui.showGameOverModal(winner);
    }
  };
  
  // Time update
  game.onTimeUpdate = (remaining, total) => {
    // Timer component handles this
  };
  
  // Letter reveal
  game.onLetterReveal = (letter) => {
    ui.showPowerUp('🔍', `الحرف المكشوف: ${letter}`);
  };
}

// ===== UI Callbacks =====
function setupUICallbacks() {
  // Streamer controls
  ui.elements.startGameBtn?.addEventListener('click', () => {
    const rounds = parseInt(ui.elements.roundsCount?.value) || CONFIG.defaultRounds;
    const duration = parseInt(ui.elements.roundDuration?.value) || CONFIG.defaultDuration;
    
    game.startGame({
      totalRounds: rounds,
      roundDuration: duration
    });
  });
  
  ui.elements.nextRoundBtn?.addEventListener('click', () => {
    game.startNextRound();
  });
  
  ui.elements.endGameBtn?.addEventListener('click', () => {
    game.endGame();
  });
  
  // Chat input
  ui.elements.chatInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      ui.submitGuess();
    }
  });
  
  ui.elements.submitBtn?.addEventListener('click', () => {
    ui.submitGuess();
  });
}

// ===== Demo Players =====
function addDemoPlayers() {
  const demoPlayers = [
    { id: 'player1', name: 'أحمد' },
    { id: 'player2', name: 'سارة' },
    { id: 'player3', name: 'عمر' },
    { id: 'player4', name: 'فاطمة' },
    { id: 'player5', name: 'خالد' }
  ];
  
  demoPlayers.forEach(player => {
    game.addPlayer(player.id, player.name);
  });
  
  // Add some demo scores
  game.updatePlayerScore('player2', 120);
  game.updatePlayerScore('player3', 95);
  game.updatePlayerScore('player4', 80);
  game.updatePlayerScore('player5', 65);
  
  // Update leaderboard
  const leaderboard = game.getLeaderboard();
  ui.updateLeaderboard(leaderboard);
  
  // Update player count
  ui.updatePlayerCount(demoPlayers.length);
}

// ===== Test Functions =====
function testGame() {
  console.log('🧪 Running game tests...');
  
  // Test letter generation
  const letters = game.generateLetterSet();
  console.log('Generated letters:', letters);
  
  // Test word validation
  const validWords = game.findValidWords(letters);
  console.log('Valid words:', validWords);
  
  // Test score calculation
  if (validWords.length > 0) {
    const testWord = validWords[0].word;
    const score = ArabicHelper.calculateWordScore(testWord);
    console.log(`Score for "${testWord}":`, score);
  }
  
  console.log('✅ Tests complete');
}

function simulateRound() {
  console.log('🎯 Simulating a round...');
  
  // Start game
  game.startGame({
    totalRounds: 1,
    roundDuration: 10
  });
  
  // Simulate guesses after 2 seconds
  setTimeout(() => {
    const letters = game.getCurrentLetters();
    const validWords = game.getValidWords();
    
    if (validWords.length > 0) {
      // Try to guess the first valid word
      const wordToGuess = validWords[0].word;
      console.log(`Attempting to guess: ${wordToGuess}`);
      
      const result = game.processGuess('player1', wordToGuess);
      console.log('Result:', result);
    }
  }, 2000);
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
  // Ctrl + S: Start game
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    game.startGame({
      totalRounds: parseInt(ui.elements.roundsCount?.value) || 10,
      roundDuration: parseInt(ui.elements.roundDuration?.value) || 15
    });
  }
  
  // Ctrl + N: Next round
  if (e.ctrlKey && e.key === 'n') {
    e.preventDefault();
    game.startNextRound();
  }
  
  // Ctrl + E: End game
  if (e.ctrlKey && e.key === 'e') {
    e.preventDefault();
    game.endGame();
  }
  
  // Ctrl + D: Debug state
  if (e.ctrlKey && e.key === 'd') {
    e.preventDefault();
    game.debugState();
  }
  
  // Ctrl + T: Test game
  if (e.ctrlKey && e.key === 't') {
    e.preventDefault();
    testGame();
  }
  
  // Ctrl + R: Simulate round
  if (e.ctrlKey && e.key === 'r') {
    e.preventDefault();
    simulateRound();
  }
});

// ===== Initialize on DOM Load =====
document.addEventListener('DOMContentLoaded', () => {
  initGame();
  
  // Add CSS animation for score popup
  const style = document.createElement('style');
  style.textContent = `
    @keyframes scorePopup {
      0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(0.5);
      }
      50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.2);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -100%) scale(1);
      }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    .score-popup .popup-combo {
      color: #ffcc00;
      font-size: 2rem;
      margin-left: 10px;
    }
    
    .round-transition h2 {
      font-size: 4rem;
      color: #00d4ff;
      text-shadow: 0 0 30px #00d4ff;
      margin-bottom: 20px;
    }
    
    .round-transition p {
      font-size: 2rem;
      color: #a0a0a0;
    }
    
    .round-end h2 {
      font-size: 3rem;
      color: #ffcc00;
      text-shadow: 0 0 30px #ffcc00;
      margin-bottom: 20px;
    }
    
    .round-end p {
      font-size: 1.5rem;
      color: #a0a0a0;
      margin-bottom: 30px;
    }
    
    .missed-words {
      background: rgba(255, 255, 255, 0.05);
      padding: 20px;
      border-radius: 12px;
    }
    
    .missed-words p {
      font-size: 1rem;
      margin-bottom: 15px;
    }
    
    .missed-word {
      display: inline-block;
      background: rgba(255, 0, 128, 0.2);
      border: 1px solid #ff0080;
      color: #ff0080;
      padding: 5px 15px;
      margin: 5px;
      border-radius: 8px;
      font-size: 1.1rem;
    }
  `;
  document.head.appendChild(style);
});

// ===== Export for debugging =====
window.gameApp = {
  game,
  timer,
  ui,
  CONFIG,
  testGame,
  simulateRound
};
