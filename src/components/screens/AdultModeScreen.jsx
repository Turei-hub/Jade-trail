import { useState } from 'react'
import { mars } from '../../data/planets/mars'
import { marsClue1 } from '../../data/clues/marsClue1'
import { canCraftUpgrade, deductMaterials } from '../../systems/progression'
import PlanetHeader from '../shared/PlanetHeader'
import KoraHUD from '../adult-mode/KoraHUD'
import ClueFinder from '../adult-mode/ClueFinder'
import HarvestPanel from '../adult-mode/HarvestPanel'
import FabricatorPanel from '../adult-mode/FabricatorPanel'

const PLANETS = { mars }
const CLUES = { mars: marsClue1 }

export default function AdultModeScreen({ planetId, onNavigate }) {
  const planet = PLANETS[planetId]
  const clue = CLUES[planetId]
  const [scanned, setScanned] = useState(false)
  const [clueFound, setClueFound] = useState(false)
  const [inventory, setInventory] = useState({})
  const [built, setBuilt] = useState([])

  const koraStatus = clueFound ? 'Clue recovered — fabricator ready'
    : scanned ? 'Light signature located' : 'Scanning planetary surface'
  const koraLine = clueFound ? "He was here. He's okay. He's leaving us a trail."
    : scanned ? planet.adultMode.intro
    : "We're one planet behind, David. But we're closing in. Let me scan."

  const handleHarvest = (node) =>
    setInventory(prev => ({ ...prev, [node.material]: (prev[node.material] || 0) + node.amount }))

  const handleCraft = (upgrade) => {
    if (!canCraftUpgrade(upgrade, inventory)) return
    setInventory(prev => deductMaterials(upgrade, prev))
    setBuilt(prev => [...prev, upgrade.id])
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #0a1422 0%, #0a0e1a 100%)' }}>
      <PlanetHeader planet={planet} mode="adult" onBack={() => onNavigate('home')} />
      <KoraHUD status={koraStatus} line={koraLine} />
      <div className="flex-1 grid gap-4 p-4" style={{ gridTemplateColumns: '1fr 280px' }}>
        <div className="flex flex-col gap-3">
          <ClueFinder clue={clue} planet={planet} scanned={scanned} found={clueFound}
            onScan={() => setScanned(true)} onFind={() => setClueFound(true)} />
          <HarvestPanel nodes={planet.adultMode.harvestNodes} inventory={inventory} onHarvest={handleHarvest} />
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-xs uppercase tracking-widest text-white/40 mb-2">Ship Status</div>
            {[
              { label: 'Hull Integrity', value: '100%', color: '#6bc48a' },
              { label: 'Fuel Reserves', value: '68%', color: '#e8a030' },
              { label: 'Alien Core', value: 'Active', color: '#72d4c8' },
              { label: 'Upgrades', value: `${built.length} / ${planet.adultMode.upgrades.length}`, color: '#72d4c8' },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-xs mb-1.5">
                <span className="text-white/40">{item.label}</span>
                <span style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
          <FabricatorPanel upgrades={planet.adultMode.upgrades}
            inventory={inventory} built={built} onCraft={handleCraft} />
        </div>
      </div>
    </div>
  )
}
