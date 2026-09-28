# Project Status

## Current Status: All-Viewer Game + Tested Core

**Last Updated:** 2026-09-27
**Phase:** Phases 0–2 complete; Phase 3 scaffolded

---

## What's Built

### Completed
- ES-module architecture (`src/js/{config,core,data,ui}`)
- Dictionary-wide validation: any of 949 common Arabic words (3–5 letters) formable from the tiles is accepted
- Curated, invariant-checked game sets (20) with showcase words
- **All-viewer game** — no manual/local input; only TikTok chat guesses score; the local "me" player is removed
- **Viewer-facing score boxes**: words this round, multiplier, possible-words count
- **Viewer tips** (toasts): round number every round, how-to-participate on start, scoring on round 1 + every 3 rounds
- Leaderboards and all-time winners show **nicknames + score** (no `@` handle prefix)
- Full-screen layout: live leaderboard + arena (center) + all-time winners
- Floating draggable/collapsible translucent host controls dock (position persisted), with tabs (Game / Sound / Connection / Display)
- Music player: 7 bundled royalty-free (CC0) tracks — lo-fi / chill / ambient — with dropdown + play/pause/prev/next and event sound effects with on/off + volume; pause/resume round button
- Dual live sources: Tikora hub **and** a direct bridge (TikFinity) connection, independently, with duplicate de-dup
- Five working power-ups (Time, Reveal, Double Points, Freeze, Length Hint) + Extra Points + Reshuffle, with balance caps and a between-round queue; effect keys auto-declared to the hub
- Tikora hub integration: auto/hub/bridge/both connector, gift/effect handling, live state reporting, hub status badge, per-source connection feedback
- Full-page Hall-of-Fame champions celebration (animated top-3 podium + confetti)
- In-app AR/EN language switch + adjustable Hall title + adjustable game name (browser tab); all host-dock edits persisted
- Arabic normalization (tashkeel, alef/ta-marbuta/alef-maqsura)
- Spec-compliant scoring (per-round multiplier 1x/1.5x/2x/3x, min 3 / max 5 letters)
- Non-blocking feedback (toasts, score popups, timed round-results overlay)
- Deadline-based timer; deterministic Fisher–Yates shuffle
- XSS-safe rendering (textContent, no user data via innerHTML)
- Tooling + gates: `typecheck`, `lint`, `vitest` (170 tests), smoke tests
- Launchers (`guess the words.bat`, `start-game.bat`) + static server (`scripts/serve.mjs`, port 3030, no-cache)

### Phase 2 (Reliability) — Done
- Settings/best-score persistence (Web Storage, safe fallback), CI workflow

### Phase 3 (Features) — Scaffolded
- Tikora hub connector (auto/hub/bridge/both) + mock provider
- Gift → power-up mapping and effects; effect keys declared to the hub
- VIP tier logic; guarded audio manager; i18n with en/ar parity

### Not Started
- Firebase / WebSocket backend
- Real TikTok provider (currently uses bridge/hub)
- Gift mapping dashboard UI (configured in the Tikora hub)

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
├── STREAMING.md
├── docs/HUB_INTEGRATION.md
├── scripts/serve.mjs
└── src/
    ├── index.html
    ├── css/style.css
    └── js/
        ├── config.js
        ├── main.js
        ├── core/         (engine, scoring, normalize, rng, store, powerups, powerup-manager, vip)
        ├── data/         (letter-values, word-sets, dictionary)
        ├── integrations/ (connector, hub-connector, bridge-connector, tiktok mock)
        ├── i18n/         (en/ar)
        └── ui/           (dom, timer, feedback, audio, music, sfx, host-dock, champions-show)
```

---

## Known Limitations

- All-viewer: guesses only count during an active round (chat is the only input)
- No persistence for the match (scores reset on refresh); all-time winners persist
- No real TikTok provider built-in — uses the Tikora hub and/or a local bridge (TikFinity)
- Dictionary is intentionally curated (949 words) rather than an exhaustive corpus

---

## GitHub Repository

**URL:** https://github.com/ambitious2223/wordgame-
**Branch:** main

```bash
git add .; git commit -m "message"; git push
```