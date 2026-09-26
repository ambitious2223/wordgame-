/**
 * VIP tiers based on total wins.
 */
export const VIP_TIERS = Object.freeze([
  { level: "Bronze", minWins: 5, animation: "subtle" },
  { level: "Silver", minWins: 10, animation: "flash" },
  { level: "Gold", minWins: 25, animation: "full" },
  { level: "Diamond", minWins: 50, animation: "custom" }
]);

/**
 * @param {number} wins
 * @returns {{level:string, minWins:number, animation:string}|null}
 */
export function getVipTier(wins) {
  let tier = null;
  for (const candidate of VIP_TIERS) {
    if (wins >= candidate.minWins) tier = candidate;
  }
  return tier;
}

/**
 * @param {number} wins
 * @returns {boolean}
 */
export function isVip(wins) {
  return getVipTier(wins) !== null;
}
