# Project Status

## Current Status: Modular MVP + Tested Core

**Last Updated:** 2026-09-26
**Phase:** Phases 0–2 complete; Phase 3 scaffolded

---

## What's Built

### Completed
- ES-module architecture (`src/js/{config,core,data,ui}`)
- Dictionary-wide validation: any of 949 common Arabic words (3–5 letters) formable from the tiles is accepted
- Curated, invariant-checked game sets (20) with showcase words
- Full-screen layout: live leaderboard + match standings (left), arena (center), all-time winners (right)
- Floating draggable/collapsible translucent host controls dock (position persisted)
- Procedural background music + dock music/volume controls
- Full-page Hall-of-Fame champions celebration (animated top-3 podium + confetti)
- Minimal viewer leaderboard: profile photo + name + words guessed + score
- In-app AR/EN language switch + adjustable Hall title; all host-dock edits persisted immediately
- Music player (11 tracks, dropdown + play/pause/prev/next) and event sound effects with on/off + volume; pause/resume round button
- Dual live sources: Tikora hub **and** a direct bridge (TikFinity) connection, independently, with duplicate de-dup
- Adjustable game name (used as the browser tab title + header)
- Host dock split into tabs (Game / Sound / **Connection** / **Display**); Connection selects the event source, and Display manages the live match standings AND the all-time winners (+/- score, delete, reset, clear)
- Five working power-ups (Time, Reveal, Double Points, Freeze, Length Hint) with balance caps and a between-round queue
- Tikora hub integration (Phase A): auto/hub/mock connector, gift/effect handling, live state reporting, hub status badge
- Persistent all-time winners list
- Arabic normalization (tashkeel, alef/ta-marbuta/alef-maqsura)
- Spec-compliant scoring (per-round multiplier 1x/1.5x/2x/3x, min 3 / max 5 letters)
- Real leaderboard and winner logic (no fake players)
- Non-blocking feedback (toasts, score popups, timed round-results overlay)
- Deadline-based timer (accurate under tab throttling)
- Deterministic Fisher–Yates shuffle (crypto RNG when available)
- Accessibility: letter tiles are buttons, ARIA live regions, keyboard support, focus styles
- XSS-safe rendering (textContent, no user data via innerHTML)
- Tooling + gates: `typecheck`, `lint`, `vitest` (128 tests), smoke tests
- Launchers (`guess the words.bat`, `start-game.bat`) + static server (`scripts/serve.mjs`, port 3030)

### Phase 2 (Reliability) — Done
- Settings/best-score persistence (Web Storage, safe fallback)
- Rate limiter, guarded rendering, CI workflow

### Phase 3 (Features) — Scaffolded
- Tikora hub connector (auto/hub/mock) + mock provider
- Gift → power-up mapping and effects
- VIP tier logic
- Guarded audio manager (awaiting sound assets)
- i18n with en/ar parity

### Not Started
- Real TikTok provider
- Firebase / WebSocket backend
- Gift mapping dashboard UI + VIP entry animations

---

## How to Run

### Quick Start (Double-Click)
```
guess the words.bat
```

### Manual
```bash
npm install
npm run serve   # then open http://localhost:3030
```

### Verify
```bash
npm run verify  # typecheck + lint + vitest + smoke tests
```

---

## File Structure

```
├── package.json
├── tsconfig.json
├── eslint.config.js
├── smoke-test.mjs
├── smoke-cards.mjs
├── start-game.bat
├── guess the words.bat
├── game.manifest.json
├── docs/HUB_INTEGRATION.md
├── scripts/serve.mjs
└── src/
    ├── index.html
    ├── css/style.css
    └── js/
        ├── config.js
        ├── main.js
        ├── core/         (engine, scoring, normalize, rng, store, rate-limit, powerups, vip)
        ├── data/         (letter-values, word-sets, dictionary)
        ├── integrations/ (connector, hub-connector, tiktok mock)
        ├── i18n/         (en/ar)
        └── ui/           (dom, timer, feedback, audio, music, host-dock, champions-show)
```

---

## Known Limitations

- Single local player (multiplayer arrives with TikTok integration)
- No persistence (scores reset on refresh)
- No real TikTok integration yet
- Dictionary is intentionally small and curated (20 sets) rather than 700+ raw tokens

---

## GitHub Repository

**URL:** https://github.com/ambitious2223/wordgame-
**Branch:** main

```bash
git add .; git commit -m "message"; git push
```