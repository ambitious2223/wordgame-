# Quick Reference Cheat Sheet

## Game at a Glance

| Feature | Value |
|---------|-------|
| Language | Arabic |
| Letters | 5 per round |
| Time | 15 seconds |
| Words per round | 3-5 valid |
| Scoring | Letter values (1-10 pts) |
| Multiplier | 1x → 3x based on words found |
| Players | Unlimited |
| Platform | Web browser + TikTok LIVE |

---

## Scoring Quick Reference

### Letter Values
```
1 pt: ا ل ن ي و ت ر
2 pt: ب ه م د
3 pt: ك ع
4 pt: ح ف س
5 pt: ق غ ج خ
6 pt: ص ض
7 pt: ط ظ ث
8 pt: ء ئ ؤ
10 pt: آ ة
```

### Multipliers
```
1 word found = 1x
2 words found = 1.5x
3 words found = 2x
4+ words found = 3x
```

### Bonuses
```
First correct guess: +5 pts
Longest word: +10 pts
All words found: +20 pts
```

---

## Visual Theme

### Colors
```
Background: #0a0a1a
Card: #1a1a2e
Blue: #00d4ff
Pink: #ff0080
Green: #00ff88
Yellow: #ffcc00
Purple: #9d00ff
```

### Fonts
```
Arabic: Noto Sans Arabic
UI: Orbitron / Sans-serif
```

---

## TikTok Gift Power-ups

| Gift | Power-up | Effect |
|------|----------|--------|
| 🌹 Rose | +5 seconds | Extends timer |
| 🦁 Lion | Reveal letter | Shows one letter |
| 🌌 Galaxy | 2x points | Double score |
| 🎤 Mic | Skip round | Skip current |
| 👑 Crown | Immunity | Safe from timeout |
| 💎 Diamond | Master word | Shows answer |
| 🔥 Fire | Freeze timer | 3 sec freeze |
| ⭐ Star | Extra guess | One more try |

---

## File Structure

```
PROJECT ROOT/
├── AGENTS.md          # Project overview
├── CHANGELOG.md       # Version history
├── GAME_SPEC.md       # Full specification
├── README.md          # Project readme
├── CHEAT_SHEET.md     # This file
└── src/               # Source code (TBD)
    ├── index.html
    ├── css/
    ├── js/
    └── assets/
```

---

## Development Checklist

### MVP Core
- [ ] Arabic word database
- [ ] Letter display component
- [ ] 15-second timer
- [ ] Scoring system
- [ ] Chat integration
- [ ] Basic UI

### Visual Polish
- [ ] Neon theme
- [ ] Floating tiles
- [ ] Animations
- [ ] Sound effects
- [ ] Responsive design

### TikTok Integration
- [ ] LIVE API
- [ ] Chat parsing
- [ ] Gift events
- [ ] Leaderboard

### Power-ups
- [ ] Gift dashboard
- [ ] Power-up effects
- [ ] Cooldowns

### VIP
- [ ] Entry animations
- [ ] Profile display
- [ ] Stats tracking

---

## Key Decisions Made

| Decision | Choice | Why |
|----------|--------|-----|
| Language | Arabic | User specified |
| Letters | 5 | Wordle success |
| Time | 15 sec | TikTok pace |
| Theme | Neon cyberpunk | Trendy, eye-catching |
| Monetization | Gift power-ups | Primary revenue |
| No battle pass | Confirmed | User preference |
| No ads | Confirmed | User preference |
| No voiceover | Confirmed | Streamer talks |
| Prototype only | Confirmed | Not for distribution |
