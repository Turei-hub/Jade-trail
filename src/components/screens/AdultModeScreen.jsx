import { useState } from 'react'
import { mars } from '../../data/planets/mars'
import { marsClue1 } from '../../data/clues/marsClue1'
import { canCraftUpgrade, deductMaterials } from '../../systems/progression'
import PlanetHeader from '../shared/PlanetHeader'
import KoraHUD from '../adult-mode/KoraHUD'
import FabricatorPanel from '../adult-mode/FabricatorPanel'
import PhaserGame from '../../game/PhaserGame'
import ObjectiveHUD from '../shared/ObjectiveHUD'

const PLANETS = { mars }
const CLUES = { mars: marsClue1 }

export default function AdultModeScreen({ planetId, onNavigate }) {
  const planet = PLANETS[planetId]
  const clue = CLUES[planetId]
  const [scanned, setScanned] = useState(false)
  const [clueFound, setClueFound] = useState(false)
  const [inventory, setInventory] = useState({})
  const [built, setBuilt] = useState([])
  const [activeZone, setActiveZone] = useState(null)
  const [popup, setPopup] = useState(null)

  const koraStatus = clueFound ? 'Clue recovered — fabricator ready'
    : scanned ? 'Light signature located' : 'Scanning planetary surface'
  const koraLine = clueFound ? "He was here. He's okay. He's leaving us a trail."
    : scanned ? planet.adultMode.intro
    : "We're one planet behind, David. But we're closing in. Let me scan."

  const handleInteract = (objId) => {
    const node = planet.adultMode.harvestNodes.find(n => n.id === objId)
    if (node) { setPopup({ type: 'harvest', node }); setScanned(true); return }
    if (objId === 'clue-finder') { setPopup({ type: 'clue' }); setScanned(true) }
  }

  const handleHarvest = (node) => {
    setInventory(prev => ({ ...prev, [node.material]: (prev[node.material] || 0) + node.amount }))
    setPopup(null)
  }

  const handleCraft = (upgrade) => {
    if (!canCraftUpgrade(upgrade, inventory)) return
    setInventory(prev => deductMaterials(upgrade, prev))
    setBuilt(prev => [...prev, upgrade.id])
  }

  const adultObjectives = [
    { text: 'Harvest Iron Oxide at the Crater Rim', icon: '⛏️', done: (inventory['iron-oxide'] || 0) > 0 },
    { text: 'Harvest CO₂ at the Landing Zone', icon: '💨', done: (inventory['co2'] || 0) > 0 },
    { text: 'Scan the Canyon Edge — find Matiu\'s signal', icon: '✦', done: scanned },
    { text: 'Recover the clue Matiu left behind', icon: '📡', done: clueFound },
    { text: 'Craft upgrades in the Fabricator', icon: '⚗️', done: built.length > 0 },
  ]

  const zoneLabel = activeZone
    ? planet.kidMode.zones.find(z => z.id === activeZone)?.label
    : null

  // Adult mode: crater-rim and landing-zone always unlocked; canyon-edge after scan
  const unlockedZones = scanned
    ? ['landing-zone', 'crater-rim', 'canyon-edge']
    : ['landing-zone', 'crater-rim']

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0e1a' }}>
      <PlanetHeader planet={planet} mode="adult" onBack={() => onNavigate('home')} />
      <KoraHUD status={koraStatus} line={koraLine} />

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 100px)' }}>

        {/* Left sidebar */}
        <div className="flex flex-col gap-3 p-3 w-48 shrink-0 overflow-y-auto">
          <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-xs uppercase tracking-widest text-white/40 mb-2">Ship Status</div>
            {[
              { label: 'Hull',     value: '100%',                                              color: '#6bc48a' },
              { label: 'Fuel',     value: '68%',                                               color: '#e8a030' },
              { label: 'Alien Core', value: 'Active',                                          color: '#72d4c8' },
              { label: 'Upgrades', value: `${built.length} / ${planet.adultMode.upgrades.length}`, color: '#72d4c8' },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-xs mb-1.5">
                <span className="text-white/40">{item.label}</span>
                <span style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-xs uppercase tracking-widest text-white/40 mb-2">Inventory</div>
            {Object.keys(inventory).length === 0
              ? <p className="text-xs text-white/25 italic">Nothing harvested yet</p>
              : Object.entries(inventory).map(([mat, amt]) => (
                <div key={mat} className="flex justify-between text-xs mb-1">
                  <span className="text-white/50 capitalize">{mat.replace(/-/g, ' ')}</span>
                  <span style={{ color: '#72d4c8' }}>{amt}</span>
                </div>
              ))
            }
          </div>

          <FabricatorPanel upgrades={planet.adultMode.upgrades}
            inventory={inventory} built={built} onCraft={handleCraft} />
        </div>

        {/* Game canvas */}
        <div className="flex-1 relative">
          <ObjectiveHUD objectives={adultObjectives} />
          <PhaserGame
            mode="adult"
            unlockedZones={unlockedZones}
            onZoneEnter={setActiveZone}
            onZoneLeave={() => setActiveZone(null)}
            onInteract={handleInteract}
          />

          {zoneLabel && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{ background: 'rgba(0,0,0,0.7)', color: '#72d4c8', border: '1px solid #1e3a5a' }}>
              {zoneLabel}
            </div>
          )}

          <div className="absolute bottom-4 right-4 text-xs text-white/25">WASD / ↑↓←→ to move · E to interact</div>
        </div>
      </div>

      {/* Harvest popup */}
      {popup?.type === 'harvest' && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={() => setPopup(null)}>
          <div className="rounded-2xl p-6 max-w-sm w-full mx-4"
            style={{ background: '#0a1422', border: '1px solid #1e3a5a' }}
            onClick={e => e.stopPropagation()}>
            <div className="text-4xl mb-3 text-center">{popup.node.emoji}</div>
            <h3 className="text-lg font-bold text-center mb-1" style={{ color: '#72d4c8' }}>{popup.node.label}</h3>
            <p className="text-sm text-white/60 leading-relaxed mb-4">{popup.node.description}</p>
            <div className="flex justify-between text-xs mb-4 px-2">
              <span className="text-white/40">Material</span>
              <span style={{ color: '#72d4c8' }}>{popup.node.material} ×{popup.node.amount}</span>
            </div>
            <button onClick={() => handleHarvest(popup.node)}
              className="w-full py-2.5 rounded-lg text-sm font-semibold"
              style={{ background: '#1a3a5a', color: '#72d4c8' }}>
              Harvest →
            </button>
          </div>
        </div>
      )}

      {/* Clue popup */}
      {popup?.type === 'clue' && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={() => setPopup(null)}>
          <div className="rounded-2xl p-6 max-w-sm w-full mx-4"
            style={{ background: '#0a1422', border: '1px solid #2d6b47' }}
            onClick={e => e.stopPropagation()}>
            <div className="text-4xl mb-3 text-center">✦</div>
            <h3 className="text-lg font-bold text-center mb-1" style={{ color: '#6bc48a' }}>Light Signature Detected</h3>
            <p className="text-sm text-white/60 leading-relaxed mb-4">{planet.adultMode.intro}</p>
            <button onClick={() => { setClueFound(true); setPopup(null) }}
              className="w-full py-2.5 rounded-lg text-sm font-semibold"
              style={{ background: '#2d6b47', color: '#6bc48a' }}>
              Recover Clue →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
