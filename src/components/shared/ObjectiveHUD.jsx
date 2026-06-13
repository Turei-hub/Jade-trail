export default function ObjectiveHUD({ objectives }) {
  const current = objectives.find(o => !o.done)
  if (!current) return null

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 pointer-events-none">
      <div className="px-4 py-2 rounded-xl text-center"
        style={{ background: 'rgba(0,0,0,0.72)', border: '1px solid rgba(255,255,255,0.1)', maxWidth: 340 }}>
        <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#6bc48a66' }}>
          Objective
        </div>
        <div className="text-sm font-semibold text-white leading-snug">
          {current.icon} {current.text}
        </div>
      </div>

      {/* Step dots */}
      <div className="flex gap-1.5 mt-0.5">
        {objectives.map((o, i) => (
          <div key={i} className="rounded-full transition-all duration-300"
            style={{
              width: o.done ? 8 : (o === current ? 10 : 6),
              height: o.done ? 8 : (o === current ? 10 : 6),
              background: o.done ? '#6bc48a' : (o === current ? '#ffffff' : '#ffffff22'),
            }} />
        ))}
      </div>
    </div>
  )
}
