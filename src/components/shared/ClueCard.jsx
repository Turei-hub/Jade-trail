export default function ClueCard({ clue, showKoraLine = false }) {
  return (
    <div className="rounded-xl p-4"
      style={{ background: 'linear-gradient(135deg, rgba(74,154,110,0.1), rgba(64,180,168,0.05))', border: '1px solid #2d6b47' }}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs uppercase tracking-wider" style={{ color: '#6bc48a' }}>
          From: {clue.message.from}
        </span>
        <span className="ml-auto text-xs text-white/30">Clue #{clue.number}</span>
      </div>
      <p className="text-sm leading-relaxed italic">"{clue.message.text}"</p>
      {showKoraLine && clue.adultMode?.koraLine && (
        <p className="text-xs italic mt-3 pt-3" style={{ color: '#72d4c8', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          Kora: "{clue.adultMode.koraLine}"
        </p>
      )}
    </div>
  )
}
