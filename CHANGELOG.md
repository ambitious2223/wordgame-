# Changelog

All notable changes to the TikTok Arabic Word Guessing Game will be documented here.

## [Unreleased]

### Added
- Project planning phase
- 92-question game design document
- 20 interactive decision cards
- Game specification document
- Project agents documentation

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

## Project Timeline

### Phase 1: MVP Core (Weeks 1-2)
- [ ] Arabic word database setup
- [ ] Basic game loop (scramble → guess → score)
- [ ] 5-letter display with tiles
- [ ] 15-second circular timer
- [ ] Basic scoring system
- [ ] TikTok chat integration

### Phase 2: Visual Polish (Weeks 3-4)
- [ ] Neon cyberpunk theme
- [ ] Floating letter tile animations
- [ ] Circular countdown timer with color changes
- [ ] Score animations
- [ ] Correct/wrong answer feedback
- [ ] Letter-by-letter reveal animation

### Phase 3: TikTok Integration (Weeks 5-6)
- [ ] TikTok LIVE API connection
- [ ] Chat message parsing
- [ ] Gift event detection
- [ ] Streamer control panel
- [ ] Real-time leaderboard

### Phase 4: Power-ups & VIP (Weeks 7-8)
- [ ] Gift mapping dashboard
- [ ] Power-up effects (time, reveal, multiplier)
- [ ] Cooldown system
- [ ] VIP entry animations
- [ ] Profile display

### Phase 5: Polish & Launch (Weeks 9-10)
- [ ] Sound effects integration
- [ ] Background music
- [ ] Analytics tracking
- [ ] Performance optimization
- [ ] Bug fixes and testing

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
