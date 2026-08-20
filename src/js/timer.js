// Timer Component for TikTok Arabic Word Guessing Game
// Handles circular countdown timer with visual feedback

class Timer {
  constructor(options = {}) {
    // DOM elements
    this.container = options.container || document.querySelector('.timer-container');
    this.svg = options.svg || document.querySelector('.timer-svg');
    this.progress = options.progress || document.querySelector('.timer-progress');
    this.valueDisplay = options.valueDisplay || document.querySelector('#timerValue');
    
    // Timer state
    this.duration = options.duration || 15;
    this.remaining = this.duration;
    this.isRunning = false;
    this.isPaused = false;
    this.interval = null;
    
    // Callbacks
    this.onTick = options.onTick || null;
    this.onWarning = options.onWarning || null;
    this.onDanger = options.onDanger || null;
    this.onComplete = options.onComplete || null;
    
    // SVG circle properties
    this.circumference = 2 * Math.PI * 54; // radius = 54
    
    // Initialize
    this.init();
  }
  
  init() {
    // Set initial state
    this.setProgress(100);
    this.setValue(this.duration);
    
    // Set SVG circle properties
    if (this.progress) {
      this.progress.style.strokeDasharray = this.circumference;
      this.progress.style.strokeDashoffset = 0;
    }
    
    console.log('⏱️ Timer initialized');
  }
  
  // ===== Timer Control =====
  
  start(duration) {
    if (duration) {
      this.duration = duration;
    }
    
    this.remaining = this.duration;
    this.isRunning = true;
    this.isPaused = false;
    
    // Reset visual state
    this.setProgress(100);
    this.setValue(this.remaining);
    this.setColor('green');
    
    // Start interval
    this.interval = setInterval(() => this.tick(), 1000);
    
    console.log(`⏱️ Timer started: ${this.duration}s`);
  }
  
  stop() {
    this.isRunning = false;
    this.isPaused = false;
    
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
    console.log('⏱️ Timer stopped');
  }
  
  pause() {
    if (this.isRunning && !this.isPaused) {
      this.isPaused = true;
      
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      
      console.log('⏱️ Timer paused');
    }
  }
  
  resume() {
    if (this.isRunning && this.isPaused) {
      this.isPaused = false;
      this.interval = setInterval(() => this.tick(), 1000);
      
      console.log('⏱️ Timer resumed');
    }
  }
  
  reset(duration) {
    this.stop();
    
    if (duration) {
      this.duration = duration;
    }
    
    this.remaining = this.duration;
    this.setProgress(100);
    this.setValue(this.remaining);
    this.setColor('green');
    
    console.log(`⏱️ Timer reset: ${this.duration}s`);
  }
  
  // ===== Timer Tick =====
  
  tick() {
    if (!this.isRunning || this.isPaused) return;
    
    this.remaining--;
    
    // Update display
    const percentage = (this.remaining / this.duration) * 100;
    this.setProgress(percentage);
    this.setValue(this.remaining);
    
    // Color changes based on time
    if (this.remaining <= 5) {
      this.setColor('danger');
      if (this.onDanger) this.onDanger(this.remaining);
    } else if (this.remaining <= 10) {
      this.setColor('warning');
      if (this.onWarning) this.onWarning(this.remaining);
    }
    
    // Callback
    if (this.onTick) {
      this.onTick(this.remaining, this.duration);
    }
    
    // Check completion
    if (this.remaining <= 0) {
      this.complete();
    }
  }
  
  complete() {
    this.stop();
    this.setProgress(0);
    this.setValue(0);
    
    console.log('⏱️ Timer complete');
    
    if (this.onComplete) {
      this.onComplete();
    }
  }
  
  // ===== Visual Updates =====
  
  setProgress(percentage) {
    if (!this.progress) return;
    
    const offset = this.circumference - (percentage / 100) * this.circumference;
    this.progress.style.strokeDashoffset = offset;
  }
  
  setValue(value) {
    if (!this.valueDisplay) return;
    
    this.valueDisplay.textContent = Math.max(0, value);
  }
  
  setColor(color) {
    if (!this.progress) return;
    
    // Remove existing color classes
    this.progress.classList.remove('warning', 'danger');
    
    // Add new color class
    switch (color) {
      case 'warning':
        this.progress.classList.add('warning');
        break;
      case 'danger':
        this.progress.classList.add('danger');
        break;
      default: // green
        break;
    }
  }
  
  // ===== Utility =====
  
  addTime(seconds) {
    this.remaining += seconds;
    const percentage = (this.remaining / this.duration) * 100;
    this.setProgress(Math.min(100, percentage));
    this.setValue(this.remaining);
    
    console.log(`⏱️ +${seconds}s added, remaining: ${this.remaining}s`);
  }
  
  getTimeRemaining() {
    return this.remaining;
  }
  
  getPercentage() {
    return (this.remaining / this.duration) * 100;
  }
  
  isActive() {
    return this.isRunning && !this.isPaused;
  }
}

// Create global timer instance
const timer = new Timer({
  duration: 15,
  onTick: (remaining, total) => {
    // Update UI
    const percent = (remaining / total) * 100;
    document.querySelector('.timer-progress').style.strokeDashoffset = 
      2 * Math.PI * 54 * (1 - percent / 100);
  },
  onWarning: (remaining) => {
    console.log(`⚠️ Warning: ${remaining}s remaining`);
  },
  onDanger: (remaining) => {
    console.log(`🚨 Danger: ${remaining}s remaining`);
  },
  onComplete: () => {
    console.log('⏰ Time up!');
    // Trigger round end
    if (game.isRunning()) {
      game.endRound();
    }
  }
});
