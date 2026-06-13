import { useState } from 'react'
import { mars } from '../../data/planets/mars'
import { marsClue1 } from '../../data/clues/marsClue1'
import { getUnlockedZones } from '../../systems/progression'
import PlanetHeader from '../shared/PlanetHeader'
import TrustMeter from '../kid-mode/TrustMeter'
import LightBarrier from '../kid-mode/LightBarrier'
import ExplorationZone from '../kid-mode/ExplorationZone'
import ClueHider from '../kid-mode/ClueHider'

const PLANETS = { mars }
const CLUES = { mars: marsClue1 }

export default function KidModeScreen({ planetId, onNavigate }) {
  const planet = PLANETS[planetId]
  const clue = CLUES[planetId]
  const [trust, setTrust] = useState(0)
  const [activeZone, setActiveZone] = useState('landing-zone')
  const [discoveries, setDiscoveries] = useState([])
  const [clueHidden, setClueHidden] = useState(false)

  const unlockedZones = getUnlockedZones(trust, planet)
  const zoneDiscs = planet.kidMode.discoveries.filter(d => d.zone === activeZone)

  const handleDiscover = (disc) => {
    if (discoveries.includes(disc.id)) return
    setDiscoveries(prev => [...prev, disc.id])
    setTrust(prev => Math.min(100, prev + 22))
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #1a2e20 0%, #0a0e1a 100%)' }}>
      <PlanetHeader planet={planet} mode="kid" onBack={() => onNavigate('home')} />
      <div className="flex-1 grid gap-4 p-4" style={{ gridTemplateColumns: '200px 1fr 200px' }}>

        <div className="flex flex-col gap-3">
          <TrustMeter trust={trust} />
          <LightBarrier trust={trust} inZone={unlockedZones.includes(activeZone)} />
          {(clueHidden || discoveries.length >= 2) && (
            <ClueHider clue={clue} discoveries={discoveries}
              onHide={() => { setClueHidden(true); setTrust(p => Math.min(100, p + 5)) }}
              hidden={clueHidden} />
          )}
        </div>

        <div className="flex flex-col gap-3">
          <ExplorationZone zones={planet.kidMode.zones} activeZone={activeZone}
            trust={trust} planet={planet} onSelect={setActiveZone} />
          <div className="rounded-xl p-4 flex-1"
            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-xs uppercase tracking-widest text-white/40 mb-3">
              {activeZone.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} — Discoveries
            </div>
            {zoneDiscs.length === 0 ? (
              <p className="text-sm text-white/30 italic">Nothing to find here yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {zoneDiscs.map(disc => {
                  const found = discoveries.includes(disc.id)
                  return (
                    <div key={disc.id} onClick={() => handleDiscover(disc)}
                      className="flex gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors"
                      style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${found ? 'rgba(74,154,110,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
                      <span className="text-xl">{disc.emoji}</span>
                      <div>
                        <div className="text-sm font-semibold">{disc.label}</div>
                        {found ? (
                          <>
                            <div className="text-xs text-white/60 leading-relaxed mt-0.5">{disc.fact}</div>
                            <div className="text-xs italic mt-1" style={{ color: '#6bc48a' }}>{disc.scienceNote}</div>
                          </>
                        ) : (
                          <div className="text-xs text-white/30">Tap to investigate →</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-xs uppercase tracking-widest text-white/40 mb-2">Matiu's Journal</div>
            <p className="text-xs text-white/50 leading-relaxed italic">{planet.kidMode.intro}</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-xs uppercase tracking-widest text-white/40 mb-2">Progress</div>
            {[
              { label: 'Discoveries', value: `${discoveries.length} / ${planet.kidMode.discoveries.length}` },
              { label: 'Zones open', value: `${unlockedZones.length} / ${planet.kidMode.zones.length}` },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-xs mb-1">
                <span className="text-white/40">{item.label}</span>
                <span style={{ color: '#6bc48a' }}>{item.value}</span>
              </div>
            ))}
            {clueHidden && <div className="text-xs mt-2" style={{ color: '#6bc48a' }}>✦ Clue hidden for Dad</div>}
          </div>
        </div>

      </div>
    </div>
  )
}
