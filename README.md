# The Jade Trail

**Studio:** Kaupeka Tech | **Author:** Turei Milner | **Status:** P1/P2 Wireframe

> *"What is passed down saves lives."*

Sci-fi educational adventure. A father watches an alien race take his 12-year-old son. With nothing but the jade stone his boy dropped — fused with alien tech — he builds his own ship and chases them across the galaxy, following the clues his son leaves behind.

## Quick Start

```bash
npm install
npm run dev
```

## What's Here (v0.1)

| Screen | Description |
|---|---|
| **Home** | Mode selector |
| **Kid Mode — Mars** | Matiu explores, earns trust, unlocks zones, hides Clue #1 |
| **Adult Mode — Mars** | David scans, recovers clue, harvests, fabricates upgrades |

## Architecture (GDB §9 — planets are config, not code)

```
src/
  data/planets/mars.js      ← add europa.js here for Planet 2
  data/clues/marsClue1.js   ← shared object read by both modes
  systems/progression.js    ← trust, unlock, harvest, craft logic
  components/
    screens/                ← HomeScreen, KidModeScreen, AdultModeScreen
    kid-mode/               ← TrustMeter, LightBarrier, ExplorationZone, ClueHider
    adult-mode/             ← KoraHUD, ClueFinder, HarvestPanel, FabricatorPanel
    shared/                 ← PlanetHeader, ClueCard
```

## Roadmap

| Phase | Goal | Status |
|---|---|---|
| P1 | Kid Mode — Mars | ✅ Built |
| P2 | Adult Mode — Mars (interlock) | ✅ Built |
| P3 | Opening — Earth (abduction) | — |
| P4 | Planet #2 — Europa | — |
| P5 | Unity (C#) migration | — |
| P6+ | Zone 2 worlds, The Turn, endgame | — |
