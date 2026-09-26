/**
 * Token-bucket rate limiter for high-volume chat input.
 * Refills continuously; allows a short burst.
 */
export function createRateLimiter({ minIntervalMs = 250, maxBurst = 5 } = {}) {
  let tokens = maxBurst;
  let last = Date.now();

  return {
    /**
     * @param {number} [now]
     * @returns {boolean} whether a request may proceed
     */
    allow(now = Date.now()) {
      const elapsed = Math.max(0, now - last);
      last = now;
      const refill = elapsed / minIntervalMs;
      tokens = Math.min(maxBurst, tokens + refill);
      if (tokens >= 1) {
        tokens -= 1;
        return true;
      }
      return false;
    },
    /** @returns {number} */
    available() {
      return tokens;
    },
    reset() {
      tokens = maxBurst;
      last = Date.now();
    }
  };
}
