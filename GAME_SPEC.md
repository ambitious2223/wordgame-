# Game Specification

## TikTok Arabic Word Guessing Game

### Quick Reference

| Category | Decision |
|----------|----------|
| Language | Arabic (العربية) |
| Format | Anagram Scramble |
| Letters | 5 per round |
| Time | 15 seconds |
| Scoring | Letter values (1-10 pts) |
| Theme | Neon Cyberpunk |
| Platform | Web Browser (TikTok LIVE) |
| Monetization | TikTok Gifts → Power-ups |
| Players | Unlimited (Royale mode) |
| Prototype | Single streamer only |

---

## Game Loop

```
1. Streamer starts game
2. 5 Arabic letters appear (scrambled)
3. 15-second countdown begins
4. Players guess words in TikTok chat
5. Correct guesses score points
6. Round ends, all answers revealed
7. Repeat for X rounds (customizable)
8. Final scores + winner announced
```

---

## Letter System

### Arabic Letter Values (Scrabble-style)

| Points | Letters |
|--------|---------|
| 1 pt | ا، ل، ن، ي، و، ت، ر |
| 2 pts | ب، ه، م، د |
| 3 pts | ك، ع |
| 4 pts | ح، ف، س |
| 5 pts | ق، غ، ج، خ |
| 6 pts | ص، ض |
| 7 pts | ط، ظ، ث |
| 8 pts | ء، ئ، ؤ |
| 10 pts | آ، ة |

### Letter Rules
- 5 letters per round
- No letter reuse across rounds
- Progressive difficulty (easy → hard letters)
- Minimum 3 letters per word
- Maximum 5 letters per word

---

## Scoring Formula

```
Word Score = Sum of letter values × Round multiplier

Round multiplier (based on words found):
- 1 word = 1x
- 2 words = 1.5x
- 3 words = 2x
- 4+ words = 3x

Bonus points:
- First correct guess: +5 pts
- Longest word: +10 pts
- All words found: +20 pts
```

### Example Round

Letters: ا، ل، ب، ي، ت

| Word | Letter Values | Base Score |
|------|---------------|------------|
| بيت (house) | 2+1+1 | 4 pts |
| تائب (repentant) | 1+1+2+1 | 5 pts |
| بت (statue) | 2+1 | 3 pts |

If player finds 2 words: 4 × 1.5 = 6 pts
If player finds 3 words: (4+5+3) × 2 = 24 pts

---

## Visual Design

### Color Palette (Neon Cyberpunk)

```css
--bg-dark: #0a0a1a;
--bg-card: #1a1a2e;
--neon-blue: #00d4ff;
--neon-pink: #ff0080;
--neon-green: #00ff88;
--neon-yellow: #ffcc00;
--neon-purple: #9d00ff;
--text-primary: #ffffff;
--text-secondary: #a0a0a0;
```

### Typography
- **Arabic:** Noto Sans Arabic (Bold)
- **UI:** Orbitron or similar bold sans-serif
- **Direction:** RTL for Arabic, LTR for UI

### UI Elements
1. **Letter Tiles** - Individual rounded rectangles, floating animation, neon glow
2. **Timer** - Circular progress, color changes (green → yellow → red)
3. **Score** - Top corner, persistent, animated on change
4. **Leaderboard** - Side panel, top 10 players
5. **Combo Counter** - Streak display with fire effects

---

## Audio Design

### Music
- Upbeat electronic (TikTok-native)
- Loopable background track
- Volume customizable

### Sound Effects
| Event | Sound |
|-------|-------|
| Letter reveal | Whoosh/pop |
| Correct guess | Ding + celebration |
| Wrong guess | Buzz |
| Timer warning | Beep (last 5 sec) |
| Round start | Fanfare |
| Round end | Victory jingle |
| Combo streak | Rising pitch |
| Gift received | Special chime |

### No Voiceover
- Streamer provides commentary
- Game is visual + audio only

---

## TikTok Integration

### Chat Integration
- Read LIVE chat messages
- Parse player guesses
- Display game state in chat
- Real-time leaderboard updates

### Gift Events
- Detect gift sends
- Map to power-ups
- Trigger effects
- Cooldown management

### Power-up Dashboard
```
┌─────────────────────────────────────────┐
│  TIKTOK GIFT    │    POWER-UP ACTION    │
├─────────────────────────────────────────┤
│  🌹 Rose        │  +5 seconds           │
│  🦁 Lion        │  Reveal 1 letter      │
│  🌌 Galaxy      │  2x points            │
│  🎤 Microphone  │  Skip round           │
│  👑 Crown       │  Immunity             │
│  💎 Diamond     │  Show master word     │
│  🔥 Fire        │  Freeze timer 3 sec   │
│  ⭐ Star        │  Extra guess          │
└─────────────────────────────────────────┘
```

### Follow to Play
- Must follow streamer to join
- Grows follower count
- Simple gate mechanic

---

## VIP System

### High Scorer Recognition
- Special entry animation when joining
- Profile photo display
- Stats shown (wins, games played)
- Splash effects
- Neon glow border

### VIP Thresholds
| Level | Wins Required | Animation |
|-------|---------------|-----------|
| Bronze | 5 wins | Subtle glow |
| Silver | 10 wins | Entry flash |
| Gold | 25 wins | Full animation |
| Diamond | 50 wins | Custom effects |

---

## Streamer Controls

### Host Panel Features
- Start/stop game
- Customizable rounds count
- Customizable time limits
- Letter difficulty selector
- Gift-powerup mapping
- Leaderboard management
- Round transitions with tips

### Round Transitions
- Tips/trivia between rounds
- Countdown to next round
- Score recap
- "Get ready" animation

---

## Technical Architecture

### Frontend
```
- HTML5 Canvas / DOM
- CSS3 with neon effects
- JavaScript (Vanilla or React)
- WebSocket client
- Mobile-first responsive
```

### Backend
```
- Node.js or Python (FastAPI)
- WebSocket server
- Firebase Real-time Database
- Firebase Firestore
- Arabic dictionary API
```

### Database Schema
```sql
-- Players
players (id, tiktok_username, total_score, games_played)

-- Game Sessions
game_sessions (id, streamer_id, status, rounds_count)

-- Rounds
rounds (id, session_id, letters, valid_words, time_limit)

-- Player Rounds
player_rounds (id, player_id, round_id, words_found, score)

-- Gift Mappings
gift_powerup_mappings (id, streamer_id, gift_name, powerup_type)
```

---

## Prototype Scope

### In Scope
- [ ] Single streamer mode
- [ ] 5-letter Arabic words
- [ ] 15-second rounds
- [ ] TikTok chat integration
- [ ] Basic scoring
- [ ] Neon visual theme
- [ ] Letter animations
- [ ] Circular timer
- [ ] Basic leaderboard
- [ ] 3-5 gift power-ups
- [ ] VIP entry animations

### Out of Scope
- Multi-streamer support
- Tournament system
- Friend lists
- Private rooms
- Battle pass
- Ads
- Mobile app
- Cross-platform
- Voice chat

---

## Success Metrics

### Primary
- Player retention (return rate)
- Session length
- Rounds played per session

### Secondary
- Gift conversion rate
- Follower growth
- Social shares
