import { describe, it, expect } from "vitest";
import { createRateLimiter } from "../src/js/core/rate-limit.js";

describe("createRateLimiter", () => {
  it("allows a burst then throttles", () => {
    const limiter = createRateLimiter({ minIntervalMs: 1000, maxBurst: 2 });
    expect(limiter.allow(0)).toBe(true);
    expect(limiter.allow(0)).toBe(true);
    expect(limiter.allow(0)).toBe(false);
  });

  it("refills over time", () => {
    const limiter = createRateLimiter({ minIntervalMs: 1000, maxBurst: 2 });
    limiter.allow(0);
    limiter.allow(0);
    expect(limiter.allow(500)).toBe(false);
    expect(limiter.allow(1000)).toBe(true);
  });

  it("resets to full burst", () => {
    const limiter = createRateLimiter({ minIntervalMs: 1000, maxBurst: 1 });
    expect(limiter.allow(0)).toBe(true);
    expect(limiter.allow(0)).toBe(false);
    limiter.reset();
    expect(limiter.allow(0)).toBe(true);
  });
});