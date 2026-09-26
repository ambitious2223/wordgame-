/**
 * Deadline-based countdown timer. Uses wall-clock time to stay accurate even
 * when the tab is throttled. Owns no DOM; reports via callbacks.
 */
export class RoundTimer {
  /**
   * @param {{onTick?: (remaining:number, total:number)=>void, onComplete?: ()=>void}} [options]
   */
  constructor(options = {}) {
    this.onTick = options.onTick ?? null;
    this.onComplete = options.onComplete ?? null;
    this.duration = 0;
    this.deadline = 0;
    this.pausedRemaining = 0;
    this.interval = null;
    this.running = false;
    this.paused = false;
  }

  /**
   * @param {number} seconds
   */
  start(seconds) {
    this.stop();
    this.duration = seconds;
    this.deadline = Date.now() + seconds * 1000;
    this.running = true;
    this.paused = false;
    this.report();
    this.interval = setInterval(() => this.reconcile(), 200);
  }

  reconcile() {
    if (!this.running || this.paused) return;
    this.report();
    if (this.remaining() <= 0) {
      this.stop();
      if (this.onComplete) this.onComplete();
    }
  }

  /**
   * @returns {number}
   */
  remaining() {
    if (this.paused) return this.pausedRemaining;
    return Math.max(0, Math.ceil((this.deadline - Date.now()) / 1000));
  }

  report() {
    if (this.onTick) this.onTick(this.remaining(), this.duration);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.running = false;
    this.paused = false;
  }

  /**
   * Extends the countdown (used by the "+time" power-up).
   * @param {number} seconds
   */
  addTime(seconds) {
    if (!this.running || seconds <= 0) return;
    if (this.paused) {
      this.pausedRemaining += seconds;
    } else {
      this.deadline += seconds * 1000;
    }
    this.report();
  }

  pause() {
    if (!this.running || this.paused) return;
    this.pausedRemaining = this.remaining();
    this.paused = true;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  resume() {
    if (!this.paused) return;
    this.paused = false;
    this.deadline = Date.now() + this.pausedRemaining * 1000;
    this.interval = setInterval(() => this.reconcile(), 200);
  }

  isActive() {
    return this.running && !this.paused;
  }
}