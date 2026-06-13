// Mars — Zone 1, Planet 1
// Adding a new planet = adding a new file like this. No code changes needed.
export const mars = {
  id: 'mars',
  name: 'Mars',
  zone: 1,
  number: 1,
  realBody: true,
  gravity: 0.376,
  atmosphere: 'CO₂ (95%), thin',

  kidMode: {
    intro: "The guard let me out. The sky here is orange — like rust. Everything is red.",
    trustGates: [
      { minTrust: 0,  zones: ['landing-zone'] },
      { minTrust: 30, zones: ['landing-zone', 'crater-rim'] },
      { minTrust: 60, zones: ['landing-zone', 'crater-rim', 'canyon-edge'] },
    ],
    zones: [
      { id: 'landing-zone', label: 'Landing Zone',  description: 'The dusty flat near the ship. Ground is deep rusty red.' },
      { id: 'crater-rim',   label: 'Crater Rim',    description: 'Edge of an ancient impact crater. You can see for miles.' },
      { id: 'canyon-edge',  label: 'Canyon Edge',   description: 'A deep canyon cuts through the surface. Wind howls below.' },
    ],
    discoveries: [
      {
        id: 'mars-disc-1',
        zone: 'landing-zone',
        label: 'Rust Soil',
        emoji: '🪨',
        fact: 'The surface is covered in iron oxide — the same thing that makes rust on Earth. The whole planet is rusty iron.',
        scienceNote: 'Iron oxide (Fe₂O₃) gives Mars its distinctive red colour.',
      },
      {
        id: 'mars-disc-2',
        zone: 'crater-rim',
        label: 'Low Gravity',
        emoji: '⬆️',
        fact: "You can jump much higher here. Mars's gravity is only 37.6% of Earth's — your body feels light.",
        scienceNote: 'Mars gravity: 3.72 m/s² vs Earth\'s 9.81 m/s².',
      },
      {
        id: 'mars-disc-3',
        zone: 'canyon-edge',
        label: 'Dust Storm',
        emoji: '🌪️',
        fact: 'A wall of red dust moves across the canyon. These storms can last months and cover the whole planet.',
        scienceNote: 'Global Martian dust storms can reduce solar power by 99%.',
      },
    ],
    clueHideZone: 'canyon-edge',
    clueUnlocksAfter: 'mars-disc-3',
  },

  adultMode: {
    intro: "Kora's scan shows a light-signature in the canyon region. They were here. He was here.",
    harvestNodes: [
      {
        id: 'mars-harv-iron',
        zone: 'crater-rim',
        label: 'Iron Oxide Deposit',
        emoji: '⛏️',
        material: 'iron-oxide',
        amount: 40,
        description: 'Dense surface deposit. High purity — good for hull plating.',
      },
      {
        id: 'mars-harv-co2',
        zone: 'landing-zone',
        label: 'Atmospheric CO₂ Vent',
        emoji: '💨',
        material: 'co2',
        amount: 25,
        description: 'Concentrated CO₂ vent. Kora can convert this to fuel.',
      },
    ],
    upgrades: [
      {
        id: 'hull-plating-mk1',
        label: 'Hull Plating Mk.1',
        emoji: '🛡️',
        requires: { 'iron-oxide': 30 },
        description: 'Iron-oxide composite hull reinforcement. Reduces impact damage.',
        koraLine: 'The iron content is excellent. I can work with this.',
      },
      {
        id: 'co2-fuel-refiner',
        label: 'CO₂ Fuel Refiner',
        emoji: '⚗️',
        requires: { co2: 20 },
        description: 'Converts atmospheric CO₂ into usable fuel. Extends range.',
        koraLine: "Martian atmosphere is 95% CO₂. We're swimming in fuel.",
      },
    ],
    clueSearchZone: 'canyon-edge',
    lightSignatureStrength: 0.7,
  },
}
