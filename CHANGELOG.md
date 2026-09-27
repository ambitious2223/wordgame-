# Changelog

All notable changes to the TikTok Arabic Word Guessing Game will be documented here.

## [0.22.0] - 2026-09-27

### Changed
- ✅ **All-viewer game** — removed all manual/local play (text input, submit, word-builder, clickable letters). Only TikTok chat guesses score. The local "me" player is gone; the leaderboard shows real viewers only.
- ✅ **Viewer-facing score boxes** — the top boxes now show words found this round, the current multiplier, and possible-word count (not the host's score).
- ✅ **Scaled arena + answers** — larger letter tiles, bigger found-words chips and round-end answer words that scale (`clamp()`) to fill the box for clearer text.
- ✅ **Viewer tips** — toasts announce the round number every round, teach "how to participate" on game start, and explain scoring on round 1 and every 3 rounds.

## [0.21.2] - 2026-09-27

### Changed
- ✅ The leaderboard (and match roster) now shows each player's **nickname** (`name`) instead of the raw TikTok **username** (`uniqueId`). The username is still used internally as the player id so identity/dedup keeps working.

## [0.21.1] - 2026-09-27

### Fixed
- ✅ The **Connect** button now gives clear feedback: a toast shows exactly what happened (Hub/Bridge green/yellow/red), and the status line reflects the **bridge (TikFinity)** state — `connected / connecting / error / offline` — instead of a generic dot.
- ✅ The bridge connector now tracks a real state (`off|connecting|connected|error`) and reports it; explicit connection modes no longer silently hide failures.
- ✅ Connect button test added (shows a toast).

## [0.21.0] - 2026-09-27

### Added
- ✅ **Streamlined "Go Live"** (see `STREAMING.md` runbook).
- ✅ Game now **declares its effect keys to the hub on connect** (`capabilities`), so the hub's gift→effect mapper is auto-populated — **one-time per game**, persisted by the hub.
- ✅ Declared 10 keys (5 existing + `extra_points`, `reshuffle` implemented; `hint_all`, `slow_motion`, `skip_round` reserved).
- ✅ New power-ups: **Extra Points** (award +N to the local player) and **Reshuffle** (reshuffle the round tiles).
- ✅ Hub: **Go-Live → Launch Word Challenge** button, and a modern **pop-out Gift↔Effect Mapper** modal in the Game Store.

## [0.20.0] - 2026-09-27

### Changed
- ✅ **Real royalty-free music** replaces the synthesized 8-bit loops. Seven bundled CC0 tracks (Neon, Chill, Focus, Lo-Fi, Cinematic, Forest, Space) under `src/assets/sounds/music/`, played via a looped audio element — actual lo-fi / chill / ambient background music.
- ✅ Music playlist logic is now track-based: prev/next/select reload the source, and the choice + volume persist.
- ✅ Softened the event sound effects (pure sine tones instead of harsh square/saw waves).
- ✅ The dev server serves `audio/mpeg` (and ogg/wav/m4a) so the tracks play locally.
- ✅ Licenses/sources recorded in `src/assets/sounds/music/CREDITS.md` (CC0, no attribution required).

## [0.19.0] - 2026-09-27

### Added
- ✅ **More music tracks** (now 11): Neon, Chill, Arcade, Ambient, Focus, **Sunset, Pulse, Dream, Retro, Happy, Epic**.
- ✅ **Track picker dropdown** in the Sound tab (plus the existing prev/play-pause/next transport).

### Changed / Fixed
- ✅ Removed the duplicate **Match standings** panel (it rendered the same live leaderboard twice). The screen now shows one live leaderboard and the all-time winners, one per side.

## [0.18.0] - 2026-09-26

### Added
- ✅ **Leaderboard controls in the Display tab.** The tab now holds both:
  - **Match standings** — every current player with **+5 / −5** score and **✕ remove**, plus **Reset match scores** (↺) and **Remove all players** (✕).
  - **All-time winners** — the editable hall (+5 / −5 / ✕ per entry, Clear the list).
- ✅ Engine player-management API: `removePlayer`, `adjustPlayerTotal`, `resetMatchScores`, `getRoster`.

### Changed
- ✅ Renamed the **Hall** tab back to **Display** (as originally requested).

## [0.17.0] - 2026-09-26

### Added
- ✅ **Adjustable game name** (host dock → Game tab): the name you set becomes the **browser tab title** and the in-game header. Empty = the localized default ("تحدي الكلمات" / "Word Challenge"). Persisted.

## [0.16.0] - 2026-09-26

### Added
- ✅ **Hall of Winners manager** in the host dock — the **Display** tab is now **Hall**. It lists every all-time winner with **+5 / −5 score** and **delete (✕)** buttons, plus a **Clear the list** button. The standings panel and Hall refresh instantly, and changes persist.

## [0.15.0] - 2026-09-26

### Changed
- ✅ **Host dock reorganized into tabs: Game · Sound · Connection · Display** (last tab remembered). No more long scroll of controls.
- ✅ New **Connection** tab is the single place that controls where viewer events come from — an **Event source** selector with **Tikora hub / TikFinity (bridge) / Both / Offline (demo)**, plus Hub URL, game slug, API key, Bridge URL, a live per-source status, and a Connect button.
- ✅ Connector reworked to a live **source registry** with runtime `setMode(...)`: switching the Event source reconnects immediately, and a failed explicit source shows its error and stays offline (only `Offline` mode uses the simulator).

## [0.14.0] - 2026-09-26

### Added
- ✅ **Direct bridge connection, independent of the hub** (`integrations/bridge-connector.js`): the game can connect straight to TikFinity or any compatible local bridge (`ws://127.0.0.1:21213/`) and receive chat/gifts without the hub.
- ✅ **Dual sources at once** (`connector.js` provider `both`): hub **and** bridge run together; duplicates from both are de-duplicated (same user/text within 3s counted once).
- ✅ Host dock: **Bridge on/off toggle** + **Bridge URL** field (persisted); status shows each source independently (Hub 🟢/🔴 · Bridge 🟢/🔴).
- ✅ Tests: `bridge-connector.test.js`, dual-source de-dup test in `hub-connector.test.js`.

### Changed
- ✅ `auto` connects hub + bridge (when a bridge URL is set); explicit `hub`/`bridge` providers no longer fall back to the mock.

## [0.13.1] - 2026-09-26

### Fixed
- ✅ **Live comments now register.** The game connects to the hub **anonymously when no API key is set** (the relay closes keyless `?game=` sockets that fail auth), so the broadcast chat stream always arrives. A key is now only required for routed effects.
- ✅ Removed a duplicate/malformed chat + gift event that the raw `onEvent` forwarded alongside the normalized mapping.
- ✅ Empty chat messages are ignored.
- 🛠️ Hub side: the bridge source (TikFinity or any compatible local bridge) now **auto-connects by default** (`TIKFINITY_ENABLED=0` to opt out) and accepts `BRIDGE_WS_URL` as an alias for `TIKFINITY_WS_URL`.

## [0.13.0] - 2026-09-26

### Added
- ✅ **5 selectable music tracks** (Neon, Chill, Arcade, Ambient, Focus) with **play/pause, previous, and next** transport controls in the host dock (track choice persisted)
- ✅ **Sound effects on events** (`ui/sfx.js`, procedural — no files): correct word, wrong guess, countdown tick (last 5s), round start, round end, game over, power-up
- ✅ **SFX on/off toggle and effects volume** in the dock (persisted)
- ✅ **Pause/Resume round** button in the host dock (pauses the timer and round)
- ✅ Tests: `sfx.test.js`, music track/transport tests, dock transport + pause checks

## [0.12.0] - 2026-09-26

### Changed
- ✅ Expanded the validation dictionary from 519 to **949 common Modern Standard Arabic words** (3–5 letters), curated to avoid obscure/rare forms so real answers are rarely rejected
- ✅ Integrity test now asserts the dictionary stays ≥ 800 words

## [0.11.0] - 2026-09-26

### Added
- ✅ In-app language switch in the header (AR ⇄ EN) — sets `dir`/`lang`, re-translates the UI, and persists the choice; also accepts `?lang=` / `window.TIKORA_GAME_CONFIG.locale`
- ✅ Adjustable Hall title (host dock) — the champions page/panel title is editable and persisted (default "Hall of Kings" / "قاعة الملوك")
- ✅ Locale reported to the hub in `reportState`

### Changed
- ✅ Every host-dock edit is now **persisted immediately** (rounds, duration, hub slug/key, Hall title, language) instead of only on game start
- ✅ Word-area clear tooltip is now translated

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
