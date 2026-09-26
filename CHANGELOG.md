# Changelog

All notable changes to the TikTok Arabic Word Guessing Game will be documented here.

## [0.10.1] - 2026-09-26

### Changed
- ✅ **No gift names in code.** Removed the hardcoded `DEFAULT_GIFT_MAP` / `resolvePowerUp` and the offline gift fallback. The game reacts only to hub `effect` messages (`effect_key`); all gift→effect mappings are managed in the Tikora hub UI.
- ✅ Removed the hub's hardcoded default effect mappings — the streamer creates mappings in the Hub UI.

## [0.10.0] - 2026-09-26

### Added — 5 working power-ups (hub-ready)
- ✅ `PowerUpManager` (`core/powerup-manager.js`): balance caps, between-round queue, freeze lifecycle, hint generation
- ✅ Real effects: **Time Bonus** (`time_bonus`), **Reveal Letter** (`reveal_letter`, random position), **Double Points** (`double_points`, next word), **Freeze Timer** (`freeze_timer`), **Length Hint** (`length_hint`)
- ✅ Engine next-word multiplier + bonus-aware scoring; `getWordShape()` for hints
- ✅ `POWERUP_DEFAULTS` balance caps in `config.js`
- ✅ Every effect acked to the hub with `ok`/`reason`; off-round gifts queued
- ✅ Tests: `powerup-manager.test.js`, engine multiplier + shape tests, expanded power-up tests (143 total)

### Changed
- ✅ Replaced the previous placeholder effect logic (reveal showed nothing; `double_points` did nothing) with the manager

## [0.9.0] - 2026-09-26

### Added — Tikora hub integration (Phase A)
- ✅ Connector facade `integrations/connector.js` (`auto` / `hub` / `mock`) with offline fallback
- ✅ Hub connector `integrations/hub-connector.js`: loads the hub's `hub-client.js`, maps chat/gift/effect events, auto-reconnects
- ✅ Hub effect keys (`time_bonus`, `reveal_letter`, `double_points`, `freeze_timer`) via `resolveEffect()`
- ✅ `reportState()` to the hub UI on round start / results / game over
- ✅ Host dock: live hub status badge + game slug/API-key fields (persisted)
- ✅ `game.manifest.json`, `start-game.bat` (port 3030), `docs/HUB_INTEGRATION.md`
- ✅ Tests: `hub-connector.test.js` (fake hub), effect-resolution tests

### Notes
- Config is read from `?game=<slug>&key=<apiKey>` (Tikora launcher), `window.TIKORA_GAME_CONFIG`, or the dock fields.
- Keep the game playable offline: `auto` silently falls back to the mock provider.

## [0.8.0] - 2026-09-26

### Changed
- ✅ Leaderboard rows are now minimal and viewer-focused: **profile photo + name + words guessed + score** (no chat feed / no per-word log)
- ✅ Engine tracks per-player `wordsFound` and `avatar` across the match; `getLeaderboard()` returns them
- ✅ Remote correct guesses no longer pop a score overlay for the local player (reduces clutter); shared round word list still updates

### Added
- ✅ Avatar rendering with an initial-based fallback when no photo is available
- ✅ Mock connector supports per-viewer avatars (`pushComment(user, text, avatar)`)

## [0.7.0] - 2026-09-26

### Fixed
- ✅ Host dock now collapses/expands reliably (pointerdown `preventDefault()` was swallowing the click event in real browsers)

### Added
- ✅ Procedural background music via Web Audio (no audio files required) — `ui/music.js`
- ✅ Music controls in the dock: on/off toggle + volume slider (persisted in settings)
- ✅ Full-page "Hall of Fame" champions celebration (`ui/champions-show.js`): top-3 animated high-contrast podium (gold/silver/bronze), confetti, and a ranked list for the rest
- ✅ "Show champions" button in the dock
- ✅ Tests: `music.test.js`, `champions-show.test.js`, dock controls in `dom-smoke.test.js`

## [0.6.0] - 2026-09-26

### Changed
- ✅ Host/debug controls moved into a floating, draggable, collapsible translucent dock (low opacity until hover) — frees the side columns
- ✅ Full-screen layout: fixed 100vh grid, no page scroll on desktop; arena and both side panels stretch to fill the viewport
- ✅ Left column = live leaderboard + match standings; right column = all-time winners (no longer stacked/overlapping)
- ✅ Responsive scaling for letter tiles and timer using `clamp()` so elements are larger and clearer on big screens

### Added
- ✅ Dock position/collapsed state persistence (`loadDock`/`saveDock`)
- ✅ jsdom test for dock collapse/expand behavior

## [0.5.0] - 2026-09-26

### Added
- ✅ Dictionary-wide word acceptance: any of 519 common Arabic words (3–5 letters) formable from the round tiles now scores
- ✅ "Possible words" counter per round
- ✅ Full-height three-column arena layout: live leaderboard (left), arena (center), all-time winners + match standings (right)
- ✅ Persistent all-time winners (`loadChampions`/`addChampion`) rendered in the right column
- ✅ jsdom boot test that loads the real `index.html` and wires `main.js`

### Changed
- ✅ Engine computes `validWords` from the dictionary per round (curated sets now seed the tiles only)
- ✅ Round-end missed-word list capped at 24 with a `+N` overflow chip
- ✅ README/STATUS/AGENTS coverage numbers corrected to reality

## [0.4.0] - 2026-09-26

### Added
- ✅ Settings + best-score persistence via Web Storage (`core/store.js`)
- ✅ Token-bucket rate limiter for chat input (`core/rate-limit.js`)
- ✅ TikTok connector abstraction with a safe mock provider (`integrations/tiktok.js`)
- ✅ Gift → power-up mapping and effects (`core/powerups.js`)
- ✅ VIP tier logic (`core/vip.js`)
- ✅ Guarded audio manager (`ui/audio.js`)
- ✅ i18n (`i18n/index.js`) with en/ar parity, wired through `data-i18n`
- ✅ CI workflow running `npm run verify`

### Changed
- ✅ `RoundTimer` gained `addTime()` for the +time power-up
- ✅ Chat/gift events now drive real engine guesses and power-ups

## [0.3.0] - 2026-09-26

### Changed
- ✅ Refactored the single-file prototype into ES modules (`config`, `core`, `data`, `ui`)
- ✅ Deleted all dead/duplicate modules (old engine, UI, timer, 3 overlapping dictionaries)
- ✅ Single source of truth for letter values and word sets
- ✅ Rewrote scoring to match GAME_SPEC (per-round multiplier; min 3 / max 5 letters)
- ✅ Replaced blocking `alert()` UX with toasts and a timed round-results overlay
- ✅ Real leaderboard/winner logic (removed hardcoded fake players)

### Added
- ✅ Arabic normalization for guess matching (tashkeel, alef, ta-marbuta, alef-maqsura)
- ✅ Deadline-based timer (accurate under tab throttling)
- ✅ Deterministic Fisher–Yates shuffle with crypto RNG
- ✅ Dictionary integrity test, scoring/normalization/engine unit tests, smoke tests
- ✅ Tooling: package.json, tsconfig (checkJs), ESLint, Vitest, `scripts/serve.mjs`
- ✅ Accessibility improvements (button tiles, ARIA live regions, focus styles)

### Fixed
- ✅ Invalid "valid words" (`شمسية`, `عيون`) that could never be formed from their letters
- ✅ Dead clear-word handler (missing `#wordArea` id)
- ✅ Destructive `start.bat` that killed all Python processes
- ✅ Malformed duplicate launcher (`guess the words .bat`)

## [0.2.0] - 2026-08-20

### Added
- ✅ Complete Arabic word database (700+ words)
- ✅ 40 verified game letter sets
- ✅ Multiple dictionary sources combined
- ✅ Diacritics support (tashkeel handling)
- ✅ Letter value system (Scrabble-style, 1-10 pts)
- ✅ Game engine with state management
- ✅ Circular countdown timer (green → yellow → red)
- ✅ Floating letter tile animations
- ✅ Score calculation with multipliers
- ✅ Combo system for consecutive correct guesses
- ✅ Leaderboard component
- ✅ Streamer controls (Start, Next, End)
- ✅ Game over modal with winner display
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Keyboard shortcuts
- ✅ start.bat launcher
- ✅ Neon cyberpunk CSS theme
- ✅ Similar games references document

### Dictionary Sources
1. Common Arabic Words (frequency-based)
2. Arabic Textbook Vocabulary
3. Everyday Arabic Words
4. Game-specific Letter Sets
5. Arabic Verbs (all tenses)
6. Arabic Adjectives
7. Categorized Nouns (animals, food, nature, etc.)
8. Common Expressions

### Game Sets (40 Verified)
Each set contains 3-5 valid Arabic words:
- بيت (house) set: بيت, تاب, بت, ليت
- كتاب (book) set: كتاب, باكي, كبت, تاك
- سلام (peace) set: سلام, سالم, لام, مال
- And 37 more verified sets...

---

## [0.1.0] - 2026-08-19

### Planning Phase

#### Game Design Decisions (20 Questions Answered)
- Core format: Anagram Scramble
- Letter count: 5 Arabic letters
- Time limit: 15 seconds per round
- Guess submission: TikTok LIVE comments
- Scoring: Letter value system (Scrabble-style)
- Visual theme: Neon Cyberpunk
- Letter display: Individual floating tiles
- Timer: Circular countdown (green → yellow → red)
- Music: Upbeat electronic
- Multiplayer: Unlimited players (Royale mode)
- Word database: Arabic Dictionary API
- Hints: No hints (pure challenge)
- Monetization: TikTok gifts → power-ups
- Tutorial: No tutorial (streamer explains)
- Platform: TikTok LIVE native (web browser)
- Anti-cheat: Server-side validation
- Analytics: Engagement metrics
- Updates: Weekly content updates
- Community: In-game leaderboards
- Success metric: Player retention

#### Additional User Requirements
- Arabic language (not English)
- Streamer hosts, viewers type in chat
- Customizable gift-to-powerup mapping dashboard
- VIP system for high scorers with animations
- Head-to-head rounds with transitions/tips/countdowns
- Customizable rounds count and timing
- No battle pass, no ads
- Prototype only (not for other streamers yet)

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-08-19 | Arabic language | User specified Arabic game |
| 2026-08-19 | 5 letters | Matches Wordle success |
| 2026-08-19 | 15 seconds | TikTok-native pace |
| 2026-08-19 | Neon cyberpunk | Trendy, eye-catching |
| 2026-08-19 | Gift power-ups | Primary monetization |
| 2026-08-19 | No battle pass | User preference |
| 2026-08-19 | No ads | User preference |
| 2026-08-19 | Prototype only | Not for distribution yet |
| 2026-08-20 | 700+ words | Maximum player options |
| 2026-08-20 | 40 game sets | Verified letter combos |
| 2026-08-20 | Diacritics support | Arabic text normalization |

---

## Open Questions (Resolved)

1. ~~Arabic or English?~~ → Arabic
2. ~~Web app or native?~~ → Web browser
3. ~~Tournament system?~~ → No, just leaderboards
4. ~~Battle pass?~~ → No
5. ~~Ads?~~ → No
6. ~~Voiceover?~~ → No (streamer talks)
7. ~~Private rooms?~~ → No
8. ~~Friend system?~~ → No
9. ~~Mobile app?~~ → No (web browser only)
10. ~~Multi-streamer?~~ → No (prototype is single streamer)

---

## Project Timeline

### Phase 1: MVP Core (Weeks 1-2) ✅
- [x] Arabic word database setup (700+ words)
- [x] Basic game loop (scramble → guess → score)
- [x] 5-letter display with tiles
- [x] 15-second circular timer
- [x] Basic scoring system
- [ ] TikTok chat integration

### Phase 2: Visual Polish (Weeks 3-4) ✅
- [x] Neon cyberpunk theme
- [x] Floating letter tile animations
- [x] Circular countdown timer with color changes
- [x] Score animations
- [x] Correct/wrong answer feedback
- [ ] Letter-by-letter reveal animation

### Phase 3: TikTok Integration (Weeks 5-6) ⏳
- [ ] TikTok LIVE API connection
- [ ] Chat message parsing
- [ ] Gift event detection
- [ ] Streamer control panel
- [ ] Real-time leaderboard

### Phase 4: Power-ups & VIP (Weeks 7-8) 📋
- [ ] Gift mapping dashboard
- [ ] Power-up effects (time, reveal, multiplier)
- [ ] Cooldown system
- [ ] VIP entry animations
- [ ] Profile display

### Phase 5: Polish & Launch (Weeks 9-10) 📋
- [ ] Sound effects integration
- [ ] Background music
- [ ] Analytics tracking
- [ ] Performance optimization
- [ ] Bug fixes and testing

---

## Version History

| Version | Date | Status | Description |
|---------|------|--------|-------------|
| 0.1.0 | 2026-08-19 | Planning | Game design decisions |
| 0.2.0 | 2026-08-20 | MVP | Core game prototype |
