import { describe, it, expect } from "vitest";
import { getVipTier, isVip, VIP_TIERS } from "../src/js/core/vip.js";

describe("VIP tiers", () => {
  it("has no tier below the first threshold", () => {
    expect(getVipTier(0)).toBeNull();
    expect(getVipTier(4)).toBeNull();
    expect(isVip(4)).toBe(false);
  });

  it("returns the highest achieved tier", () => {
    expect(getVipTier(5)?.level).toBe("Bronze");
    expect(getVipTier(10)?.level).toBe("Silver");
    expect(getVipTier(25)?.level).toBe("Gold");
    expect(getVipTier(80)?.level).toBe("Diamond");
    expect(isVip(50)).toBe(true);
  });

  it("keeps tiers ordered by ascending wins", () => {
    const wins = VIP_TIERS.map((tier) => tier.minWins);
    expect([...wins].sort((a, b) => a - b)).toEqual(wins);
  });
});