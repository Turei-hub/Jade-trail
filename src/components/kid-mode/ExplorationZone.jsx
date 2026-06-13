import { isZoneUnlocked, getTrustGateForZone } from '../../systems/progression'

export default function ExplorationZone({ zones, activeZone, trust, planet, onSelect }) {
  return (
    <div className="rounded-xl p-4"
      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="text-xs uppercase tracking-widest text-white/40 mb-3">Exploration Zones</div>
      <div className="flex flex-col gap-2">
        {zones.map(zone => {
          const unlocked = isZoneUnlocked(zone.id, trust, planet)
          const active = zone.id === activeZone
          const gate = getTrustGateForZone(zone.id, planet)
          return (
            <div
              key={zone.id}
              onClick={() => unlocked && onSelect(zone.id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                !unlocked ? 'opacity-40 cursor-not-allowed' : active ? 'cursor-pointer' : 'cursor-pointer hover:bg-white/5'
              }`}
              style={active
                ? { background: 'rgba(74,154,110,0.2)', border: '1px solid #4a9a6e' }
                : unlocked ? { border: '1px solid rgba(74,154,110,0.15)' }
                : { border: '1px solid transparent' }}
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: active ? '#6bc48a' : unlocked ? '#4a9a6e' : '#555', boxShadow: active ? '0 0 6px #6bc48a' : 'none' }} />
              <div>
                <div className="text-sm font-medium">{zone.label}</div>
                {!unlocked && gate && (
                  <div className="text-xs text-white/30">Unlock at {gate.minTrust} trust</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
