export default function LightBarrier({ trust, inZone = true }) {
  const strength = inZone ? Math.min(100, 50 + trust * 0.5) : Math.max(0, trust * 0.3)
  const isStrong = strength > 70
  const isWarn = strength > 40 && !isStrong
  const color = isStrong ? '#6bc48a' : isWarn ? '#e8a030' : '#e05050'
  const glow = isStrong ? 'rgba(107,196,138,0.4)' : isWarn ? 'rgba(232,160,48,0.4)' : 'rgba(224,80,80,0.4)'
  const emoji = isStrong ? '💚' : isWarn ? '💛' : '🔴'
  const note = !inZone ? 'Move back — barrier thinning'
    : isStrong ? 'Barrier holding strong' : isWarn ? 'Barrier weakening' : 'Return to safe zone!'
  return (
    <div className="rounded-xl p-4"
      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="text-xs uppercase tracking-widest text-white/40 mb-2">Light Barrier</div>
      <div className="flex justify-center my-3">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
          style={{ background: `radial-gradient(circle, ${glow}, transparent)`, boxShadow: `0 0 20px ${glow}` }}>
          {emoji}
        </div>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold" style={{ color }}>{Math.round(strength)}%</div>
        <div className="text-xs text-white/40 mt-1">{note}</div>
      </div>
    </div>
  )
}
