import { useState } from 'react'
import { mars } from '../../data/planets/mars'
import { marsClue1 } from '../../data/clues/marsClue1'
import { getUnlockedZones } from '../../systems/progression'
import PlanetHeader from '../shared/PlanetHeader'
import TrustMeter from '../kid-mode/TrustMeter'
import LightBarrier from '../kid-mode/LightBarrier'
import ClueHider from '../kid-mode/ClueHider'
import PhaserGame from '../../game/PhaserGame'
import ObjectiveHUD from '../shared/ObjectiveHUD'

const PLANETS = { mars }
const CLUES = { mars: marsClue1 }

export default function KidModeScreen({ planetId, onNavigate }) {
  const planet = PLANETS[planetId]
  const clue = CLUES[planetId]
  const [trust, setTrust] = useState(0)
  const [activeZone, setActiveZone] = useState(null)
  const [discoveries, setDiscoveries] = useState([])
  const [clueHidden, setClueHidden] = useState(false)
  const [popup, setPopup] = useState(null)

  const unlockedZones = getUnlockedZones(trust, planet)

  const handleInteract = (objId) => {
    const disc = planet.kidMode.discoveries.find(d => d.id === objId)
    if (disc) setPopup(disc)
  }

  const handleDiscover = (disc) => {
    setPopup(null)
    if (discoveries.includes(disc.id)) return
    setDiscoveries(prev => [...prev, disc.id])
    setTrust(prev => Math.min(100, prev + 22))
  }

  const kidObjectives = [
    { text: 'Find the Rust Soil in the Landing Zone', icon: '🪨', done: discoveries.includes('mars-disc-1') },
    { text: 'Reach the Crater Rim (trust 30) and study Low Gravity', icon: '⬆️', done: discoveries.includes('mars-disc-2') },
    { text: 'Reach the Canyon Edge (trust 60) and find the Dust Storm', icon: '🌪️', done: discoveries.includes('mars-disc-3') },
    { text: 'Hide a clue for Dad in the Canyon Edge', icon: '✦', done: clueHidden },
  ]

  const zoneLabel = activeZone
    ? planet.kidMode.zones.find(z => z.id === activeZone)?.label
    : null

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0e1a' }}>
      <PlanetHeader planet={planet} mode="kid" onBack={() => onNavigate('home')} />

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>

        {/* Left sidebar */}
        <div className="flex flex-col gap-3 p-3 w-48 shrink-0 overflow-y-auto">
          <TrustMeter trust={trust} />
          <LightBarrier trust={trust} inZone={unlockedZones.includes(activeZone)} />
          {(clueHidden || discoveries.length >= 2) && (
            <ClueHider clue={clue} discoveries={discoveries}
              onHide={() => { setClueHidden(true); setTrust(p => Math.min(100, p + 5)) }}
              hidden={clueHidden} />
          )}
          <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-xs uppercase tracking-widest text-white/40 mb-2">Journal</div>
            <p className="text-xs text-white/50 leading-relaxed italic">{planet.kidMode.intro}</p>
          </div>
        </div>

        {/* Game canvas */}
        <div className="flex-1 relative">
          <ObjectiveHUD objectives={kidObjectives} />
          <PhaserGame
            mode="kid"
            unlockedZones={unlockedZones}
            onZoneEnter={setActiveZone}
            onZoneLeave={() => setActiveZone(null)}
            onInteract={handleInteract}
          />

          {/* Zone badge */}
          {zoneLabel && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{ background: 'rgba(0,0,0,0.7)', color: '#6bc48a', border: '1px solid #2d6b47' }}>
              {zoneLabel}
            </div>
          )}

          {/* Controls hint */}
          <div className="absolute bottom-4 right-4 text-xs text-white/25">WASD / ↑↓←→ to move · E to interact</div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-3 p-3 w-44 shrink-0">
          <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
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

          <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-xs uppercase tracking-widest text-white/40 mb-2">Discoveries</div>
            {planet.kidMode.discoveries.map(d => (
              <div key={d.id} className="flex items-center gap-1.5 mb-1.5">
                <span className="text-sm">{d.emoji}</span>
                <span className="text-xs" style={{ color: discoveries.includes(d.id) ? '#6bc48a' : '#ffffff30' }}>
                  {discoveries.includes(d.id) ? d.label : '???'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interaction popup */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={() => setPopup(null)}>
          <div className="rounded-2xl p-6 max-w-sm w-full mx-4"
            style={{ background: '#0f1e2e', border: '1px solid #2d6b47' }}
            onClick={e => e.stopPropagation()}>
            <div className="text-4xl mb-3 text-center">{popup.emoji}</div>
            <h3 className="text-lg font-bold text-center mb-1" style={{ color: '#6bc48a' }}>{popup.label}</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-3">{popup.fact}</p>
            <p className="text-xs italic mb-4" style={{ color: '#6bc48a88' }}>{popup.scienceNote}</p>
            <button
              onClick={() => handleDiscover(popup)}
              className="w-full py-2.5 rounded-lg text-sm font-semibold"
              style={{ background: discoveries.includes(popup.id) ? '#1a1a1a' : '#2d6b47', color: '#6bc48a' }}>
              {discoveries.includes(popup.id) ? 'Already discovered ✓' : 'Investigate →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
