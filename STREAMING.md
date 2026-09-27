# Streaming Runbook — Word Challenge

A plain-language, repeatable checklist for going live. Two parts:

1. **One-time per-game setup** (do these once, they stick).
2. **Per-stream checklist** (do these every time you go live).

Everything runs on this PC. No public link is needed: viewers interact through the
TikTok live chat, and the game, hub, and bridge are all local.

---

## Ports / URLs (so nothing collides)

| Service | Address |
|---|---|
| Word Challenge (this game) | `http://localhost:3030` |
| Tikora hub relay | `ws://127.0.0.1:27016/` |
| TikFinity / bridge | `ws://127.0.0.1:21213/` |

---

## Part 1 — One-time per-game setup (do once)

These persist, so you don't repeat them every stream.

1. **Activate a license** in the hub (this game is paid). If you don't have a real
   key yet, use the demo key `TIKO-TEST-TEST-TEST-TEST`.
2. **Run the game once** (Game Store → Launch, or double-click
   `start-game.bat`). On connect it **declares its effect keys to the hub**
   automatically — the hub stores them, so you never re-declare them.
   Declared effects: `time_bonus`, `reveal_letter`, `double_points`,
   `freeze_timer`, `length_hint`, `extra_points`, `reshuffle` (plus reserved
   `hint_all`, `slow_motion`, `skip_round`).
3. **Map gifts → effects** once:
   - Hub → **Game Store → Word Challenge → Open Mapper**.
   - Pick a gift, pick a power-up (from the declared list), set delay/cooldown,
     and save. Repeat for each gift you want to map.

---

## Part 2 — Every stream

1. **Start TikFinity** (so live chat/gifts flow). It listens on `127.0.0.1:21213`.
2. **Start the hub**: `npm run dev` in
   `C:\dev\windows app interactive for streams`.
   The relay starts and the **bridge auto-enables**.
3. **Sign in** (if needed) and confirm the license is active.
4. **Go-Live screen**: connect to your TikTok room. Check the live source card —
   Direct and/or TikFinity should show green.
5. **Launch the game** — either the **Go-Live → Launch Word Challenge** button,
   or Game Store → Launch. It opens `http://localhost:3030/?game=...&key=...`.
6. **Verify the game's Connection tab** (dock → Connection): you should see
   `Hub 🟢` and/or `Bridge 🟢`. Press **Start game** in the dock → **Game** tab.
7. **OBS**: add a window/browser capture of `localhost:3030` as your scene.
   (The game window is the visual. The hub's `/overlay/1..10` pages are separate
   gift/follow alert popups — optional.)
8. **Go live on TikTok.** Viewers type words in chat → registered as guesses
   **while a round is active**. Gifts trigger the mapped effects.

---

## Good to know

- **No-cache serving**: the dev server sends `no-store`, so after code changes
  just hard-refresh the browser (Ctrl+Shift+R).
- **Guesses only count during an active round.** Start a round before expecting
  chat to score.
- **Audio needs a user gesture**: music starts when you click **Start game**
  (browsers block autoplay otherwise).
- **Settings persist** in the browser (rounds, music, language, hall title,
  connection config) — that's intentional, not stale.
- If a gift doesn't trigger, check the hub's **Go-Live → Recent effects** log and
  the relay status; the effect should appear as `delivered`.

## Troubleshooting quick hits

| Symptom | Check |
|---|---|
| Game shows old UI | Hard refresh; confirm the server is the latest (`node scripts/serve.mjs`). |
| Comments don't arrive | Connection tab: Hub/Bridge green? Round active? TikFinity running? |
| Gift does nothing | Mapping exists? Effect `delivered` in Go-Live log? |
| Game won't launch | License active? Port 3030 free? (`Get-NetTCPConnection -LocalPort 3030`) |
| No sound | Click Start game first; Music on in Sound tab; volume up. |