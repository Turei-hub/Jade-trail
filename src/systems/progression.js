export const TRUST_MAX = 100

export function getUnlockedZones(trust, planet) {
  const gates = [...planet.kidMode.trustGates].reverse()
  const gate = gates.find(g => trust >= g.minTrust)
  return gate ? gate.zones : []
}

export function isZoneUnlocked(zoneId, trust, planet) {
  return getUnlockedZones(trust, planet).includes(zoneId)
}

export function getTrustGateForZone(zoneId, planet) {
  return planet.kidMode.trustGates.find(g => g.zones.includes(zoneId))
}

export function canHideClue(discoveries, clue) {
  return discoveries.includes(clue.kidMode.unlocksAfter)
}

export function canCraftUpgrade(upgrade, inventory) {
  return Object.entries(upgrade.requires).every(
    ([mat, amt]) => (inventory[mat] || 0) >= amt
  )
}

export function deductMaterials(upgrade, inventory) {
  const next = { ...inventory }
  for (const [mat, amt] of Object.entries(upgrade.requires)) {
    next[mat] = (next[mat] || 0) - amt
  }
  return next
}

export function getTrustLabel(trust) {
  if (trust < 20) return 'Wary'
  if (trust < 50) return 'Warming'
  if (trust < 80) return 'Trusted'
  return 'Bond Formed'
}
