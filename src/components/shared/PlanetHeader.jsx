export default function PlanetHeader({ planet, mode, onBack }) {
  const modeLabel = mode === 'kid' ? 'Kid Mode — Matiu' : 'Adult Mode — David'
  const modeColor = mode === 'kid' ? '#6bc48a' : '#72d4c8'
  return (
    <div className="flex items-center gap-4 px-5 py-3"
      style={{ background: 'rgba(0,0,0,0.35)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={onBack}
        className="text-sm px-3 py-1.5 rounded-md text-white/50 hover:bg-white/5 transition-colors"
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
      >
        ← Home
      </button>
      <div>
        <div className="font-bold text-lg">{planet.name}</div>
        <div className="text-xs uppercase tracking-widest text-white/40">
          Zone {planet.zone} · Planet {planet.number}
        </div>
      </div>
      <div className="ml-auto text-xs uppercase tracking-widest" style={{ color: modeColor }}>
        {modeLabel}
      </div>
    </div>
  )
}
