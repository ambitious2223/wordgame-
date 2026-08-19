# Project Agents

## Project Overview
**Name:** TikTok Arabic Word Guessing Game
**Type:** Web-based LIVE interactive game
**Platform:** TikTok LIVE integration (Web Browser)
**Language:** Arabic (العربية)

## Core Concept
Streamer hosts the game, viewers guess Arabic words from scrambled letters by typing in TikTok LIVE chat. Real-time scoring, leaderboards, and TikTok gift-based power-ups.

## Tech Stack
- **Frontend:** HTML5 + CSS3 + JavaScript (Vanilla or React)
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

## Power-up System (TikTok Gifts)
- Customizable gift → power-up mapping dashboard
- Rose = +5 seconds
- Lion = Reveal 1 letter
- Galaxy = 2x points
- Other gifts configurable by streamer

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
