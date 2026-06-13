# Jade Trail — CLAUDE.md

## What We Are Building

A top-down sci-fi adventure game. A father (David) watches aliens take his 12-year-old son (Matiu). With a jade stone fused with alien tech, he builds a ship and chases them across the galaxy — following clues his son leaves behind on each planet.

**Two playable modes on the same map:**
- **Kid Mode (Matiu)** — explore under guard, earn trust, unlock zones, hide clues for Dad
- **Adult Mode (David)** — land one step behind, scan for signals, harvest materials, craft upgrades with AI companion Kora

**Stack:** React + Vite + Tailwind + Phaser.js (game engine)

**Run locally:**
```bash
npm install
npm run dev
# opens at http://localhost:5173
```

**Repo:** https://github.com/Turei-hub/Jade-trail

---

## What Has Been Built (v0.1)

### Game Engine
- `src/game/MarsScene.js` — Phaser scene with top-down Mars map:
  - Procedural rust-red tiled terrain, crater, canyon chasm, landing pad
  - 3 named zones: Landing Zone, Crater Rim, Canyon Edge
  - Zone barriers (red borders) that unlock based on trust/game state
  - Interactable objects (emoji glows) — walk up + press E
  - WASD / arrow key movement with diagonal normalisation
  - Camera follow with zoom
  - Minimap (top-left corner)
- `src/game/PhaserGame.jsx` — React wrapper that mounts/destroys Phaser, syncs unlocked zones live

### Screens
- `src/components/screens/HomeScreen.jsx` — mode selector (Play as Matiu / Play as David)
- `src/components/screens/KidModeScreen.jsx` — game map + trust meter + discovery popups + clue hider
- `src/components/screens/AdultModeScreen.jsx` — game map + Kora HUD + harvest/clue popups + fabricator

### Shared UI
- `src/components/shared/ObjectiveHUD.jsx` — centred step tracker showing current objective + dot progress indicators
- `src/components/shared/PlanetHeader.jsx` — top nav bar with planet name and back button
- `src/components/shared/ClueCard.jsx` — displays a recovered clue

### Kid Mode Components
- `TrustMeter` — trust bar 0–100 with label (Wary / Warming / Trusted / Bond Formed)
- `LightBarrier` — visual indicator of alien guard watching
- `ExplorationZone` — zone selector (legacy, replaced by Phaser map)
- `ClueHider` — button to hide clue once 2+ discoveries made

### Adult Mode Components
- `KoraHUD` — Kora's status line and dialogue
- `ClueFinder` — scan and recover clue panel (legacy, now triggered via E key on map)
- `HarvestPanel` — harvest nodes list (legacy, now triggered via E key on map)
- `FabricatorPanel` — craft upgrades from inventory

### Data / Systems
- `src/data/planets/mars.js` — all Mars config: zones, discoveries, harvest nodes, upgrades (adding a new planet = new file here, no code changes)
- `src/data/clues/marsClue1.js` — clue object shared between both modes
- `src/systems/progression.js` — trust gates, zone unlock, harvest, craft, deduct logic

### Assets
- `docs/` — 44 images extracted from the game design PDF (`The_Jade_Trail_Painterly_Sci-Fi_Adventure.pdf`)

---

## Roadmap

| Phase | Goal | Status |
|---|---|---|
| P1 | Kid Mode — Mars (UI wireframe) | ✅ Done |
| P2 | Adult Mode — Mars (UI wireframe) | ✅ Done |
| P2.5 | Phaser walkable map + objectives HUD | ✅ Done |
| P3 | Pixel art sprites (replace placeholder graphics) | — |
| P4 | Opening scene — Earth (abduction cutscene) | — |
| P5 | Planet 2 — Europa | — |
| P6 | Unity (C#) migration | — |
| P7+ | Zone 2 worlds, The Turn, endgame | — |

---

## Suggested Next Improvements

### High priority — makes it feel like a real game
1. **Pixel art sprites** — replace the Phaser `graphics()` placeholder character and objects with actual sprite sheets. Use a free tool like [Piskel](https://www.piskelapp.com/) or source from [itch.io free assets](https://itch.io/game-assets/free). Matiu = small figure in orange suit, David = larger figure in blue suit.
2. **Animated tiles** — add subtle animation to the crater and dust storm areas using Phaser tilemaps (Tiled editor exports JSON that Phaser reads directly).
3. **Walking animation** — 4-frame walk cycle for the player sprite (left/right/up/down directions).
4. **Sound** — ambient Mars wind loop + interaction chime using Phaser's audio system. Royalty-free from [freesound.org](https://freesound.org).

### Medium priority — better gameplay feel
5. **Kora dialogue on map** — show Kora's voice lines as floating speech bubbles near the player when entering a zone, instead of only in the sidebar.
6. **Clue hiding animation** — when Matiu hides a clue, play a Phaser particle effect (glowing jade particles) at the canyon edge.
7. **Trust visual feedback** — when trust increases, briefly flash the zone overlay green and show a "+22 Trust" floating text on the map.
8. **Discovery journal** — a toggleable full-screen journal (press J) showing all discovered facts with the real science notes, styled like Matiu's handwriting.

### Lower priority — content expansion
9. **Opening cutscene** (P3) — a simple scroll-based scene on Earth before the abduction. Can be done in React/CSS, no Phaser needed.
10. **Europa map** (P5) — add `src/data/planets/europa.js` and a new `EuropaScene.js`. The architecture already supports this — planets are config, not code.
11. **Shared session mode** — let two people play on the same machine: one as Matiu (keyboard), one as David (gamepad or second keyboard layout). The clue Matiu hides persists to David's session via localStorage.
12. **Mobile touch controls** — Phaser has built-in virtual joystick support. Add a D-pad overlay for touch screens so kids can play on tablet.

### Architecture notes for next session
- To add a new planet: create `src/data/planets/[name].js` + `src/game/[Name]Scene.js`, register in the screen PLANETS map
- The `progression.js` system is clean and tested — keep game logic there, not in components
- Phaser scene and React state communicate via callbacks passed into `PhaserGame.jsx` — keep this pattern, don't mix Phaser state into React directly
- The `docs/` folder holds raw extracted images — consider moving the best hero shots to `public/` if you want them referenced in-game
