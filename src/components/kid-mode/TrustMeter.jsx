import { getTrustLabel } from '../../systems/progression'

export default function TrustMeter({ trust }) {
  const pct = Math.round(trust)
  const label = getTrustLabel(trust)
  return (
    <div className="rounded-xl p-4"
      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Vaelin's Trust</div>
      <div className="font-semibold mb-3" style={{ color: '#6bc48a' }}>{label}</div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #2d6b47, #6bc48a)' }}
        />
      </div>
      <div className="text-right text-xs text-white/30 mt-1">{pct} / 100</div>
    </div>
  )
}
