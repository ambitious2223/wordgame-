# TikTok Arabic Word Guessing Game

An interactive word guessing game for TikTok LIVE where viewers compete by guessing Arabic words from scrambled letters.

## Game Overview

Streamer hosts the game, viewers guess Arabic words by typing in TikTok LIVE chat. Real-time scoring, leaderboards, and (planned) TikTok gift-based power-ups.

## Features

- **Arabic Word Puzzles** – 5 scrambled letters per round
- **Scoring** – letter values with a per-round multiplier (1x / 1.5x / 2x / 3x)
- **Neon Cyberpunk Theme** – dark background, glowing tiles
- **Accessible UI** – keyboard/button tiles, ARIA live regions
- **Neon Leaderboard** – updates from real scores
- **Tikora hub integration** – connects to the Windows hub for live TikTok chat, gifts → power-ups, and state reporting

> The VIP system and gift-mapping dashboard are on the roadmap (see `TODO.md`).

## How to Play

1. Streamer starts the game
2. 5 Arabic letters appear on screen
3. Type a word (3–5 letters) or click tiles to build one
4. 15-second time limit per round (configurable)
5. Highest total score wins

## Getting Started

```bash
npm install
npm run serve      # open http://localhost:3030
```

On Windows you can also double-click `guess the words.bat` (or `start-game.bat`,
used by the Tikora hub).

## Verification

```bash
npm run verify     # typecheck + lint + vitest + smoke tests
```

## Project Structure

```
├── package.json
├── tsconfig.json
├── eslint.config.js
├── smoke-test.mjs
├── smoke-cards.mjs
├── start-game.bat          # Tikora hub launcher (port 3030)
├── guess the words.bat     # local launcher
├── game.manifest.json      # hub registration metadata
├── docs/HUB_INTEGRATION.md # hub contract (events/effects/state)
├── scripts/serve.mjs
├── tests/
└── src/
    ├── index.html
    ├── css/style.css
    └── js/
        ├── config.js
        ├── main.js
        ├── core/         (engine, scoring, normalize, rng, store, rate-limit, powerups, vip)
        ├── data/         (letter-values, word-sets, dictionary)
        ├── integrations/ (connector facade, hub-connector, tiktok mock)
        ├── i18n/         (en/ar locale maps)
        └── ui/           (dom, timer, feedback, audio, music, sfx, host-dock, champions-show)
```

## Tech Stack

- **Frontend:** HTML5 + CSS3 + vanilla ES modules
- **Tooling:** TypeScript (`checkJs`), ESLint, Vitest
- **Backend (planned):** Node.js / Python + Firebase + WebSockets

## Documentation

- [AGENTS.md](AGENTS.md) – project overview
- [STATUS.md](STATUS.md) – current progress
- [TODO.md](TODO.md) – roadmap
- [GAME_SPEC.md](GAME_SPEC.md) – full specification

## License

Private project – not for distribution.