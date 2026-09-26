# Tikora Hub Integration — Word Challenge

This game connects to the Tikora hub (the Windows desktop app) so live TikTok
viewers drive it and gifts trigger in-game power-ups.

## Identity

| Field | Value |
|---|---|
| Game slug | `word-challenge` |
| Type | `webapp` |
| Port | `3030` |
| Launch | `start-game.bat` (`npm run serve` with `PORT=3030`) |
| Connection | Tikora relay `ws://127.0.0.1:27016/` via `http://127.0.0.1:27016/hub-client.js` |

## How it connects

On load the game uses `integrations/connector.js` with `provider: "auto"`:

1. Try the hub: dynamically load `/hub-client.js` and `connectHub({ gameSlug, apiKey, ... })`.
2. If the hub is unreachable, fall back to the built-in **mock** connector (the game stays fully playable offline).

## Event sources — the host **Connection** tab

`host dock → Connection` is the one place that controls where viewer events come
from. Pick an **Event source**:

| Option | What it connects to |
|---|---|
| **Tikora hub** | `ws://127.0.0.1:27016/` (routed effects + state) |
| **TikFinity (bridge)** | a direct local bridge, default `ws://127.0.0.1:21213/` |
| **Both (hub + bridge)** | hub **and** bridge at once (duplicates de-duplicated) |
| **Offline (demo)** | no network — the built-in simulator |

The tab also has Hub URL / game slug / API key / Bridge URL and shows each
source's live status. Switching reconnects immediately; the choice is persisted.
`?bridge=<url>` and `?game=&key=` override the saved fields.

Duplicates arriving from both sources (same user + text within 3s) are counted once.

Config is resolved in this order (first wins):

1. URL query params set by the Tikora launcher: `?game=word-challenge&key=gk_...&lang=ar`
2. `window.TIKORA_GAME_CONFIG = { gameSlug, apiKey, locale }`
3. The **Tikora hub** fields in the host controls dock (persisted in localStorage).

Language can also be switched in-app from the header button (AR ⇄ EN); the
choice is persisted and reported back to the hub.

> The hub auto-provisions an API key for every registered game
> (`db.ensureGameIntegration(slug)`); copy it from the hub UI or let the launcher
> inject it via the query string.
>
> **A key is only needed for routed `effect`s.** Without a key the game connects
> anonymously and still receives the broadcast event stream (chat / gifts /
> likes / follows), so live comments register even before the key is configured.
> The hub gets its events from the native TikTok connector **and/or the
> TikFinity/bridge source** (local WebSocket, on by default).

## Events consumed (hub → game)

| Hub event | Handled as |
|---|---|
| `event` `type: chat` | treated as a word guess (`{ user, text, avatar }`) |
| `event` `type: gift` | **ignored** — gifts are translated to effects by the hub; the game never sees gift names as logic |
| `effect` | apply a power-up, then `ackEffect(id)` |
| `follow` / `like` / `share` / `subscribe` / `member` / `roomUser` | reserved for future features |

> **No gift names in code.** The game only understands `effect_key` values. Which
> gift triggers which effect is configured entirely in the Tikora hub UI.

## Effect keys this game understands

You (the streamer) configure gift → effect mappings in the Tikora hub UI
(Actions & Events / Hub). The game ships **no default gift mappings**. Use these
`effect_key` values:

| `effect_key` | Effect | Optional payload | Per-round cap |
|---|---|---|---|
| `time_bonus` | adds seconds to the round timer | `{ "seconds": 5 }` (max 15/use) | +20s |
| `reveal_letter` | reveals one hidden position of an unsolved word (`__ا_`) | `{ "count": 1 }` | 2 uses |
| `double_points` | next found word scores ×N | `{ "multiplier": 2 }` (max ×3) | one word |
| `freeze_timer` | freezes the round timer | `{ "seconds": 3 }` (max 5/use) | 8s total |
| `length_hint` | shows length + first letter of every remaining word (`ب__ · ك___`) | `{ "firstLetters": true }` | 1 use |

Notes:
- Effects are **global for the round** and credited to the sender by name.
- A gift that arrives **between rounds is queued** and applied at the next round start.
- Multipliers (`double_points`) arm the **next word** for the local player; when chat
  players are active this can be scoped to the gifter.
- Unknown keys are ignored safely; every effect is acked with `ok` / `reason`
  (`capped`, `no-target`, `unmapped`, `queued`).

## State reported (game → hub)

On round start, round end and game over the game calls `reportState(...)`:

```js
{
  ready: true,
  phase: "round" | "results" | "gameover",
  provider: "hub" | "mock",
  round, totalRounds, letters,
  players,                                   // connected viewers
  locale,                                    // "ar" | "en"
  powerUps: { queued, freezeSeconds, pendingMultiplier },
  leaderboard: [{ name, score, words }]      // top 5
}
```

The hub UI can display this live.

## Testing without the desktop app

- `npm run verify` includes `tests/hub-connector.test.js`, which uses an injected
  fake `connectHub` to assert event/effect/state mapping.
- Set `globalThis.__TIKORA_NO_HUB__ = true` to force the mock provider (used by
  the jsdom boot test).
- In the browser, the host dock shows a hub status badge (green/red) and lets you
  paste a slug/key manually.

## Packaging (later phase)

Because the game is static files that speak the local hub protocol, Tikora can
later serve it from `/games/word-challenge/` inside the packaged app and/or embed
it in a webview. No game code changes are required — only hosting.
