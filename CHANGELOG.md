# Changelog

All notable changes to the TikTok Arabic Word Guessing Game will be documented here.

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
