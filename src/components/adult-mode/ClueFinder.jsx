import ClueCard from '../shared/ClueCard'

export default function ClueFinder({ clue, planet, onScan, scanned, found, onFind }) {
  return (
    <div className="rounded-xl p-4"
      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="text-xs uppercase tracking-widest text-white/40 mb-3">Light Signature Scan</div>
      {!scanned ? (
        <>
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 mb-3"
            style={{ background: 'rgba(64,180,168,0.08)', border: '1px solid rgba(64,180,168,0.2)' }}>
            <div className="w-2 h-2 rounded-full flex-shrink-0 pulse-dot"
              style={{ background: '#40b4a8', boxShadow: '0 0 6px #40b4a8' }} />
            <div>
              <div className="text-xs text-white/50">Kora scanning from orbit…</div>
              <div className="text-sm font-semibold" style={{ color: '#72d4c8' }}>
                Zone: {planet.adultMode.clueSearchZone.replace(/-/g, ' ')}
              </div>
            </div>
          </div>
          <button onClick={onScan} className="w-full py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: 'rgba(64,180,168,0.15)', color: '#72d4c8', border: '1px solid rgba(64,180,168,0.3)' }}>
            ◎ Run Light Signature Scan
          </button>
        </>
      ) : !found ? (
        <>
          <p className="text-sm text-white/50 mb-3">
            Signal: <span style={{ color: '#72d4c8' }}>{Math.round(clue.adultMode.lightSignatureStrength * 100)}%</span>
            {' '}— Search the {planet.adultMode.clueSearchZone.replace(/-/g, ' ')}
          </p>
          <button onClick={onFind} className="w-full py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: 'rgba(64,180,168,0.15)', color: '#72d4c8', border: '1px solid rgba(64,180,168,0.3)' }}>
            → Search Canyon Edge
          </button>
        </>
      ) : (
        <>
          <p className="text-sm mb-3" style={{ color: '#6bc48a' }}>✦ Clue #{clue.number} recovered</p>
          <ClueCard clue={clue} showKoraLine />
        </>
      )}
    </div>
  )
}
