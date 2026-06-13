import { canHideClue } from '../../systems/progression'

export default function ClueHider({ clue, discoveries, onHide, hidden }) {
  const ready = canHideClue(discoveries, clue)
  if (hidden) {
    return (
      <div className="rounded-xl p-4" style={{ border: '1px solid #2d6b47', background: 'rgba(74,154,110,0.07)' }}>
        <div className="flex items-center gap-2 text-sm" style={{ color: '#6bc48a' }}>✅ Clue hidden for Dad</div>
        <p className="text-xs text-white/40 mt-2 italic">"{clue.message.text.slice(0, 70)}…"</p>
      </div>
    )
  }
  return (
    <div className="rounded-xl p-4" style={{ border: '1px solid rgba(74,154,110,0.3)', background: 'rgba(74,154,110,0.05)' }}>
      <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#6bc48a' }}>Leave a Clue</div>
      {ready ? (
        <>
          <p className="text-xs text-white/50 mb-3 leading-relaxed">You know enough. Hide a message for Dad. Make it count.</p>
          <div className="text-xs text-white/40 italic px-3 py-2 rounded-lg mb-3"
            style={{ border: '1px dashed rgba(74,154,110,0.3)' }}>
            Hide spot: <span style={{ color: '#6bc48a' }}>{clue.kidMode.hideSpot}</span>
          </div>
          <button onClick={onHide}
            className="w-full py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: '#2d6b47', color: '#6bc48a' }}>
            ✦ Hide Clue #{clue.number}
          </button>
        </>
      ) : (
        <p className="text-xs text-white/40 italic leading-relaxed">Keep exploring. Learn more before you leave a message.</p>
      )}
    </div>
  )
}
