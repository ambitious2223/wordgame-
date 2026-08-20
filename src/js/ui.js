// UI Component for TikTok Arabic Word Guessing Game
// Handles all DOM manipulation and visual updates

class GameUI {
  constructor() {
    // DOM Elements
    this.elements = {
      // Header
      currentRound: document.querySelector('#currentRound'),
      totalRounds: document.querySelector('#totalRounds'),
      playerCount: document.querySelector('#playerCount'),
      
      // Score
      playerScore: document.querySelector('#playerScore'),
      comboBox: document.querySelector('#comboBox'),
      comboValue: document.querySelector('#comboValue'),
      
      // Letters
      lettersContainer: document.querySelector('#lettersContainer'),
      
      // Guess
      currentGuess: document.querySelector('#currentGuess'),
      chatInput: document.querySelector('#chatInput'),
      submitBtn: document.querySelector('#submitBtn'),
      
      // Found words
      wordsList: document.querySelector('#wordsList'),
      
      // Leaderboard
      leaderboardList: document.querySelector('#leaderboardList'),
      
      // Controls
      streamerControls: document.querySelector('#streamerControls'),
      startGameBtn: document.querySelector('#startGameBtn'),
      nextRoundBtn: document.querySelector('#nextRoundBtn'),
      endGameBtn: document.querySelector('#endGameBtn'),
      roundsCount: document.querySelector('#roundsCount'),
      roundDuration: document.querySelector('#roundDuration'),
      
      // Modals
      gameOverModal: document.querySelector('#gameOverModal'),
      winnerName: document.querySelector('#winnerName'),
      winnerScore: document.querySelector('#winnerScore'),
      playAgainBtn: document.querySelector('#playAgainBtn'),
      
      // Power-ups
      powerupNotification: document.querySelector('#powerupNotification'),
      powerupIcon: document.querySelector('#powerupIcon'),
      powerupText: document.querySelector('#powerupText'),
      
      // VIP
      vipEntry: document.querySelector('#vipEntry'),
      vipAvatar: document.querySelector('#vipAvatar'),
      vipName: document.querySelector('#vipName'),
      vipStats: document.querySelector('#vipStats')
    };
    
    // State
    this.currentLetters = [];
    this.selectedLetters = [];
    this.guessWord = '';
    
    // Initialize
    this.init();
  }
  
  init() {
    this.bindEvents();
    console.log('🎨 UI initialized');
  }
  
  // ===== Event Binding =====
  
  bindEvents() {
    // Chat input
    if (this.elements.chatInput) {
      this.elements.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.submitGuess();
        }
      });
    }
    
    // Submit button
    if (this.elements.submitBtn) {
      this.elements.submitBtn.addEventListener('click', () => {
        this.submitGuess();
      });
    }
    
    // Streamer controls
    if (this.elements.startGameBtn) {
      this.elements.startGameBtn.addEventListener('click', () => {
        this.startGame();
      });
    }
    
    if (this.elements.nextRoundBtn) {
      this.elements.nextRoundBtn.addEventListener('click', () => {
        this.nextRound();
      });
    }
    
    if (this.elements.endGameBtn) {
      this.elements.endGameBtn.addEventListener('click', () => {
        this.endGame();
      });
    }
    
    // Play again
    if (this.elements.playAgainBtn) {
      this.elements.playAgainBtn.addEventListener('click', () => {
        this.hideModal();
        this.startGame();
      });
    }
    
    // Letter clicks
    if (this.elements.lettersContainer) {
      this.elements.lettersContainer.addEventListener('click', (e) => {
        const tile = e.target.closest('.letter-tile');
        if (tile) {
          this.handleLetterClick(tile);
        }
      });
    }
  }
  
  // ===== Game Control =====
  
  startGame() {
    const rounds = parseInt(this.elements.roundsCount?.value) || 10;
    const duration = parseInt(this.elements.roundDuration?.value) || 15;
    
    game.startGame({
      totalRounds: rounds,
      roundDuration: duration
    });
  }
  
  nextRound() {
    game.startNextRound();
  }
  
  endGame() {
    game.endGame();
  }
  
  // ===== Letter Display =====
  
  setLetters(letters) {
    this.currentLetters = letters;
    this.selectedLetters = [];
    this.guessWord = '';
    
    if (!this.elements.lettersContainer) return;
    
    // Clear existing
    this.elements.lettersContainer.innerHTML = '';
    
    // Create letter tiles
    letters.forEach((letter, index) => {
      const tile = document.createElement('div');
      tile.className = 'letter-tile';
      tile.dataset.index = index;
      tile.dataset.letter = letter;
      tile.textContent = letter;
      tile.style.animationDelay = `${index * 0.1}s`;
      
      this.elements.lettersContainer.appendChild(tile);
    });
    
    // Update guess display
    this.updateGuessDisplay();
    
    console.log(`🔤 Letters set: ${letters.join(', ')}`);
  }
  
  handleLetterClick(tile) {
    const letter = tile.dataset.letter;
    const index = parseInt(tile.dataset.index);
    
    // Check if already used
    if (tile.classList.contains('used')) {
      // Remove from guess
      const posIndex = this.selectedLetters.findIndex(
        item => item.index === index
      );
      
      if (posIndex !== -1) {
        this.selectedLetters.splice(posIndex, 1);
        tile.classList.remove('used');
        this.updateGuessDisplay();
      }
      return;
    }
    
    // Add to guess
    this.selectedLetters.push({ letter, index });
    tile.classList.add('used');
    
    // Update guess display
    this.updateGuessDisplay();
    
    // Auto-submit if we have enough letters
    if (this.selectedLetters.length >= 3) {
      this.submitGuess();
    }
  }
  
  updateGuessDisplay() {
    if (!this.elements.currentGuess) return;
    
    if (this.selectedLetters.length === 0) {
      this.elements.currentGuess.innerHTML = 
        '<span class="guess-placeholder">اكتب كلمتك هنا...</span>';
      this.guessWord = '';
      return;
    }
    
    this.guessWord = this.selectedLetters.map(item => item.letter).join('');
    this.elements.currentGuess.textContent = this.guessWord;
  }
  
  // ===== Guess Submission =====
  
  submitGuess() {
    const input = this.elements.chatInput;
    let guess = '';
    
    if (input && input.value.trim()) {
      guess = input.value.trim();
      input.value = '';
    } else if (this.guessWord) {
      guess = this.guessWord;
    }
    
    if (!guess) return;
    
    // Process guess
    const result = game.processGuess('player1', guess);
    
    if (result.valid) {
      this.showCorrectFeedback(result);
      this.addFoundWord(result);
    } else {
      this.showWrongFeedback(result);
    }
    
    // Reset selected letters
    this.resetLetterSelection();
  }
  
  resetLetterSelection() {
    this.selectedLetters = [];
    this.guessWord = '';
    
    // Reset all tiles
    const tiles = this.elements.lettersContainer?.querySelectorAll('.letter-tile');
    tiles?.forEach(tile => {
      tile.classList.remove('used');
    });
    
    this.updateGuessDisplay();
  }
  
  // ===== Visual Feedback =====
  
  showCorrectFeedback(result) {
    // Flash letters green
    const tiles = this.elements.lettersContainer?.querySelectorAll('.letter-tile');
    tiles?.forEach(tile => {
      if (this.currentLetters.includes(tile.dataset.letter)) {
        tile.classList.add('correct');
        setTimeout(() => tile.classList.remove('correct'), 500);
      }
    });
    
    // Show score popup
    this.showScorePopup(result.score, result.combo);
    
    console.log(`✅ Correct: ${result.word} (+${result.score})`);
  }
  
  showWrongFeedback(result) {
    // Shake letters red
    const tiles = this.elements.lettersContainer?.querySelectorAll('.letter-tile');
    tiles?.forEach(tile => {
      tile.classList.add('wrong');
      setTimeout(() => tile.classList.remove('wrong'), 500);
    });
    
    console.log(`❌ Wrong: ${result.word} - ${result.reason}`);
  }
  
  showScorePopup(score, combo) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.innerHTML = `
      <span class="popup-score">+${score}</span>
      ${combo > 1 ? `<span class="popup-combo">x${combo}</span>` : ''}
    `;
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 3rem;
      font-weight: bold;
      color: #00ff88;
      text-shadow: 0 0 20px #00ff88;
      pointer-events: none;
      z-index: 1000;
      animation: scorePopup 1s ease-out forwards;
    `;
    
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
  }
  
  // ===== Score Updates =====
  
  updateScore(score) {
    if (this.elements.playerScore) {
      this.elements.playerScore.textContent = score;
      this.elements.playerScore.classList.add('pulse');
      setTimeout(() => this.elements.playerScore.classList.remove('pulse'), 300);
    }
  }
  
  updateCombo(combo) {
    if (this.elements.comboValue) {
      this.elements.comboValue.textContent = `x${combo}`;
      
      if (combo > 1) {
        this.elements.comboBox.style.display = 'block';
        this.elements.comboBox.classList.add('pulse');
        setTimeout(() => this.elements.comboBox.classList.remove('pulse'), 300);
      }
    }
  }
  
  // ===== Found Words =====
  
  addFoundWord(result) {
    if (!this.elements.wordsList) return;
    
    const wordItem = document.createElement('div');
    wordItem.className = 'word-item';
    wordItem.innerHTML = `
      <span class="word-text">${result.word}</span>
      <span class="word-score">+${result.score}</span>
    `;
    
    this.elements.wordsList.appendChild(wordItem);
  }
  
  clearFoundWords() {
    if (this.elements.wordsList) {
      this.elements.wordsList.innerHTML = '';
    }
  }
  
  // ===== Leaderboard =====
  
  updateLeaderboard(leaderboard) {
    if (!this.elements.leaderboardList) return;
    
    this.elements.leaderboardList.innerHTML = leaderboard
      .map((player, index) => `
        <div class="leaderboard-item">
          <span class="rank">${index + 1}</span>
          <span class="player-name">@${player.name}</span>
          <span class="player-score">${player.score}</span>
        </div>
      `)
      .join('');
  }
  
  // ===== Round Info =====
  
  updateRoundInfo(current, total) {
    if (this.elements.currentRound) {
      this.elements.currentRound.textContent = current;
    }
    if (this.elements.totalRounds) {
      this.elements.totalRounds.textContent = total;
    }
  }
  
  updatePlayerCount(count) {
    if (this.elements.playerCount) {
      this.elements.playerCount.textContent = count;
    }
  }
  
  // ===== Modals =====
  
  showGameOverModal(winner) {
    if (!this.elements.gameOverModal) return;
    
    if (this.elements.winnerName) {
      this.elements.winnerName.textContent = `@${winner.name}`;
    }
    if (this.elements.winnerScore) {
      this.elements.winnerScore.textContent = `${winner.score} نقطة`;
    }
    
    this.elements.gameOverModal.classList.add('visible');
  }
  
  hideModal() {
    if (this.elements.gameOverModal) {
      this.elements.gameOverModal.classList.remove('visible');
    }
  }
  
  // ===== Power-ups =====
  
  showPowerUp(icon, text) {
    if (!this.elements.powerupNotification) return;
    
    this.elements.powerupIcon.textContent = icon;
    this.elements.powerupText.textContent = text;
    
    this.elements.powerupNotification.classList.add('visible');
    
    setTimeout(() => {
      this.elements.powerupNotification.classList.remove('visible');
    }, 3000);
  }
  
  // ===== VIP =====
  
  showVIPEntry(name, stats, avatarEmoji = '👑') {
    if (!this.elements.vipEntry) return;
    
    this.elements.vipAvatar.textContent = avatarEmoji;
    this.elements.vipName.textContent = `@${name}`;
    this.elements.vipStats.textContent = stats;
    
    this.elements.vipEntry.classList.add('visible');
    
    setTimeout(() => {
      this.elements.vipEntry.classList.remove('visible');
    }, 5000);
  }
  
  // ===== Controls =====
  
  showStreamerControls() {
    if (this.elements.streamerControls) {
      this.elements.streamerControls.classList.add('visible');
    }
  }
  
  hideStreamerControls() {
    if (this.elements.streamerControls) {
      this.elements.streamerControls.classList.remove('visible');
    }
  }
  
  // ===== Round Transitions =====
  
  showRoundTransition(round, callback) {
    const transition = document.createElement('div');
    transition.className = 'round-transition';
    transition.innerHTML = `
      <div class="transition-content">
        <h2>الجولة ${round}</h2>
        <p>استعد!</p>
      </div>
    `;
    transition.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(10, 10, 26, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(transition);
    
    setTimeout(() => {
      transition.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        transition.remove();
        if (callback) callback();
      }, 300);
    }, 2000);
  }
  
  showRoundEnd(foundWords, validWords, callback) {
    const endScreen = document.createElement('div');
    endScreen.className = 'round-end';
    endScreen.innerHTML = `
      <div class="end-content">
        <h2>انتهت الجولة!</h2>
        <p>اكتشفتم ${foundWords.length} من ${validWords.length} كلمات</p>
        <div class="missed-words">
          <p>الكلمات التي فاتتكم:</p>
          ${validWords
            .filter(w => !foundWords.some(f => f.word === w.word))
            .map(w => `<span class="missed-word">${w.word}</span>`)
            .join('')}
        </div>
      </div>
    `;
    endScreen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(10, 10, 26, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(endScreen);
    
    setTimeout(() => {
      endScreen.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        endScreen.remove();
        if (callback) callback();
      }, 300);
    }, 3000);
  }
}

// Create global UI instance
const ui = new GameUI();
