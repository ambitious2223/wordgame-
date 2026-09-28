# Development TODO List

## Recent — All-Viewer Conversion ✅
- [x] Remove all manual/local input (no text box, submit, word-builder, clickable letters) — chat-only scoring
- [x] Remove the local "me" player; leaderboard shows real viewers only
- [x] Viewer-facing score boxes (words this round, multiplier, possible words)
- [x] Scale letter tiles, found-words, and round-end answers for clearer on-stream text
- [x] Viewer tips (toasts): round number every round, how-to-participate on start, scoring on round 1 + every 3 rounds
- [x] Show nicknames + score (no `@` prefix) on all leaderboards and all-time winners

## Phase 0 — Baseline Cleanup ✅
- [x] Split `index.html` into HTML + `css/style.css` + ES modules
- [x] Single source of truth for letter values (`data/letter-values.js`)
- [x] Curated word sets (`data/word-sets.js`)
- [x] Delete dead modules (arabic-words, arabic-database, massive-dictionary, old engine/ui/timer)
- [x] Add `package.json`, ESLint, TypeScript checkJs, Vitest
- [x] Fix launchers; remove destructive `taskkill`
- [x] Reconcile docs with reality

## Phase 1 — Critical Fixes ✅
- [x] Dictionary integrity test (every word formable, unique, 3–5 letters)
- [x] Spec-compliant scoring (per-round multiplier, no cumulative combo)
- [x] Arabic normalization on guesses
- [x] Real leaderboard + winner
- [x] Replace `alert()` with toast/results overlay
- [x] Fix dead `wordArea` handler
- [x] Input hardening (length, charset) + deterministic shuffle

## Phase 2 — Reliability & Performance ✅
- [x] Persist settings + best score (`core/store.js`, localStorage with safe fallback)
- [x] Engine exposed via event emitter for remote input (`on`/`emit`)
- [x] Rate limiting for high-volume chat (`core/rate-limit.js`)
- [x] Guarded rendering (no user data via innerHTML) + guarded audio
- [x] CI workflow running `npm run verify` (`.github/workflows/verify.yml`)

## Phase 3 — Features (scaffolding)
- [x] TikTok connector abstraction + mock (`integrations/tiktok.js`)
- [x] Gift → power-up mapping + effects (`core/powerups.js`)
- [x] VIP tier logic (`core/vip.js`)
- [x] Guarded audio manager (`ui/audio.js`) — awaiting sound files in `src/assets/sounds`
- [x] i18n layer with en/ar parity + `data-i18n` wiring (`i18n/index.js`)
- [ ] Real TikTok provider behind `createConnector()`
- [ ] VIP entry animations (gift mapping lives in the Tikora hub; see `docs/HUB_INTEGRATION.md`)
- [ ] Wire sound files into `SOUNDS` map in `main.js`

## Phase 4 — Launch
- [ ] Load/user testing with Arabic speakers
- [ ] Performance pass
- [ ] Hosting, domain, SSL, monitoring