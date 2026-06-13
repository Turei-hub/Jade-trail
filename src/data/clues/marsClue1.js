// Clue #1 — Mars
// Shared data object: Kid Mode hides this, Adult Mode finds it.
// Same object, same words — two sides of the chase.
export const marsClue1 = {
  id: 'mars-clue-1',
  planet: 'mars',
  number: 1,
  message: {
    from: 'Matiu',
    to: 'Dad',
    text: "Dad — the sky here is orange, like rust. The whole planet is rusty iron! The guard let me jump off a big rock and I floated heaps — gravity is small here. I'm okay. They don't hurt me. I don't know what they want. Find me. — Matiu",
  },
  kidMode: {
    zone: 'canyon-edge',
    hideSpot: 'beneath the largest flat rock near the canyon edge',
    unlocksAfter: 'mars-disc-3',
  },
  adultMode: {
    searchZone: 'canyon-edge',
    lightSignatureStrength: 0.7,
    koraLine: "I'm detecting a faint light-signature near the canyon edge — the same crystal resonance as the stone. He was here, David. He left you something.",
  },
}
