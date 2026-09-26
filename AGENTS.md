# Project Agents

## Project Overview
**Name:** TikTok Arabic Word Guessing Game
**Type:** Web-based LIVE interactive game
**Platform:** TikTok LIVE integration (Web Browser)
**Language:** Arabic (العربية)

## Core Concept
Streamer hosts the game, viewers guess Arabic words from scrambled letters by typing in TikTok LIVE chat. Real-time scoring, leaderboards, and TikTok gift-based power-ups.

## Tech Stack
- **Frontend:** HTML5 + CSS3 + JavaScript (Vanilla)
- **Backend:** Node.js / Python (FastAPI)
- **Database:** Firebase (Real-time + Firestore)
- **Real-time:** WebSockets
- **Hosting:** Cloud (AWS/GCP/Vercel)

## Key Features (From User Decisions)
1. Anagram Scramble format (5 Arabic letters)
2. 15-second rounds with circular countdown timer
3. TikTok LIVE chat for guess submission
4. Letter value scoring system (Scrabble-style)
5. Neon Cyberpunk visual theme
6. Floating letter tiles with animations
7. Unlimited players (Royale mode)
8. VIP system for high scorers (special animations)
9. TikTok gift → power-up mapping dashboard
10. No ads, no battle pass, no friend system

## Game Rules
- 5 Arabic letters per round
- Players guess words using those letters
- Each letter used once per word
- Minimum 3 letters per word
- 3-5 valid words per letter set
- 15-second time limit
- No hints, no skipping
- Highest total score wins
- Ties broken by bonus round

## Scoring System
- Each Arabic letter has point value (1-10 pts)
- Word score = sum of letter values
- Multiplier based on words found per round:
  - 1 word = 1x
  - 2 words = 1.5x
  - 3 words = 2x
  - 4+ words = 3x

## Visual Design
- Neon cyberpunk theme (dark bg, glowing letters)
- Individual letter tiles with 3D effects
- Circular countdown timer (green → yellow → red)
- Full animation suite (reveals, celebrations, combos)
- High contrast neon color scheme
- Bold sans-serif fonts + Arabic support (Noto Sans Arabic)

## Audio Design
- Upbeat electronic background music
- Full SFX suite (reveal, correct, wrong, timer, round)
- No voiceover (streamer talks)
- Full victory sounds
- Thematic audio cues
- Full audio customization

## TikTok Integration
- LIVE chat for guess submission
- Gift events trigger power-ups
- Real-time guess visibility
- Spectate mode for viewers
- Follow to play mechanic

## Power-up System (Tikora hub effects)
- All gift → effect mapping lives in the Tikora hub UI — **no gift names in code**
- The game understands effect keys only: `time_bonus`, `reveal_letter`, `double_points`, `freeze_timer`, `length_hint`
- See `docs/HUB_INTEGRATION.md` for payloads and balance caps

## VIP System
- High-scoring players get special entry animations
- Profile photo display
- Stats shown (wins, games played)
- Splash effects when joining stream

## Prototype Scope
- Single streamer mode
- Basic game loop (scramble → guess → score)
- TikTok chat integration
- Firebase real-time sync
- 3-5 gift power-up mappings
- Basic leaderboard
- Arabic word validation

## Not in Prototype
- Multi-streamer support
- Tournament system
- Friend lists
- Private rooms
- Battle pass
- Ads
- Mobile app

---

## Current Status: Modular MVP + Tested Core

**Phase:** Phases 0–2 complete; Phase 3 scaffolded
**Last Updated:** 2026-09-26

### Completed ✅
- [x] ES-module architecture (`src/js/{config,core,data,ui}`)
- [x] Curated, invariant-checked Arabic dictionary (20 sets; every word verified formable)
- [x] Letter value system (Scrabble-style, single source of truth)
- [x] Game engine (state, validation, spec-compliant scoring)
- [x] Per-round multiplier scoring (1x / 1.5x / 2x / 3x)
- [x] Arabic normalization (tashkeel, alef, ta-marbuta, alef-maqsura)
- [x] Real leaderboard + winner logic
- [x] Non-blocking feedback (toasts, score popups, round-results overlay)
- [x] Full-screen layout: live leaderboard + match standings (left), arena (center), all-time winners (right)
- [x] Floating draggable/collapsible host controls dock
- [x] Deadline-based circular timer
- [x] Accessibility (button tiles, ARIA live regions, focus styles)
- [x] Tikora hub integration: `auto`/`hub`/`mock` connector, effect mappings, `reportState`, hub status badge
- [x] Tooling & gates: typecheck, lint, Vitest (128 tests), smoke tests

> Hub integration contract: see `docs/HUB_INTEGRATION.md` (slug `word-challenge`, port 3030, effect keys).

### In Progress ⏳
- [ ] TikTok LIVE chat integration
- [ ] Real-time WebSocket sync

### Not Started 📋
- [ ] Sound effects
- [ ] Background music
- [ ] Gift power-up dashboard
- [ ] Firebase backend
- [ ] Analytics tracking

---

## Arabic Word Database

### Sources Combined
1. **Common Arabic Words** - Frequency-based list
2. **Arabic Textbook Vocabulary** - Academic words
3. **Everyday Arabic** - Daily conversation words
4. **Game-specific Sets** - Pre-validated letter combos

### Coverage (current, honest)
| Category | Count |
|----------|-------|
| Curated game letter sets | 20 |
| Validation dictionary (3–5 letters) | 519 |
| Showcase words per set | 3–5 |
| Letter tiles | 100 |

> Validation is dictionary-wide: **any** word in `data/dictionary.js` that can be formed from the round tiles is accepted, not just the showcase words. Expansion must pass the integrity test in `tests/dictionary.test.js`.

### Letter Values
| Points | Letters |
|--------|---------|
| 1 | ا ل ن ي و ت ر |
| 2 | ب ه م د |
| 3 | ك ع |
| 4 | ح ف س |
| 5 | ق غ ج خ |
| 6 | ص ض ش ز |
| 7 | ط ظ ث ذ |
| 8 | ء ئ ؤ |
| 10 | آ ة |

---

## GitHub Repository

**URL:** https://github.com/ambitious2223/wordgame-.git
**Branch:** main
**Owner:** ambitious2223

## Git Commands (Use These)

### Quick Save & Push (Use This Often)
```bash
git add .; git commit -m "message"; git push
```

### Check Status
```bash
git status
```

### View Recent Commits
```bash
git log --oneline -10
```

### Pull Latest Changes
```bash
git pull
```

### Create Feature Branch
```bash
git checkout -b feature-name
```

### Merge Feature to Main
```bash
git checkout main; git merge feature-name; git push
```

## Automation Workflow

After making changes:
1. Run: `git add .`
2. Run: `git commit -m "description of changes"`
3. Run: `git push`

Or use the one-liner:
```bash
git add .; git commit -m "message"; git push
```

## Project File Structure
```
├── AGENTS.md              # Project overview & git commands
├── CHANGELOG.md           # Version history
├── GAME_SPEC.md           # Complete specification
├── README.md              # Project readme
├── STATUS.md              # Current status
├── TODO.md                # Development checklist
├── package.json           # Scripts (serve/lint/typecheck/test/smoke/verify)
├── tsconfig.json          # checkJs type checking
├── eslint.config.js       # Lint config
├── smoke-test.mjs         # Engine end-to-end smoke test
├── smoke-cards.mjs        # Letter-tile integrity smoke test
├── start.bat              # Launch game (safe)
├── scripts/serve.mjs      # Static dev server
├── .github/workflows/     # CI running npm run verify
├── tests/                 # Vitest unit tests
└── src/
    ├── index.html         # Markup only (data-i18n tagged)
    ├── css/style.css      # Neon cyberpunk theme
    └── js/
        ├── config.js            # Tunable defaults
        ├── main.js              # Bootstrap & event wiring
        ├── core/                # engine, scoring, normalize, rng, store, rate-limit, powerups, powerup-manager, vip
        ├── data/                # letter-values.js, word-sets.js
        ├── integrations/        # connector.js (auto/hub/mock facade), hub-connector.js, tiktok.js (mock)
        ├── i18n/                # index.js (en/ar locale maps)
        └── ui/                  # dom, timer, feedback, audio, music, host-dock, champions-show
```

## Verification Gates (run after changes)

```bash
npm run typecheck
npm run lint
npx vitest run
node smoke-test.mjs
node smoke-cards.mjs
# or all at once:
npm run verify
```
