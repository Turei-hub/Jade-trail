export default function KoraHUD({ status, line }) {
  return (
    <div className="flex items-center gap-4 mx-4 mt-4 rounded-xl px-4 py-3"
      style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(64,180,168,0.2)' }}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-base flex-shrink-0"
        style={{ background: 'radial-gradient(circle, rgba(64,180,168,0.3), transparent)', boxShadow: '0 0 16px rgba(64,180,168,0.4)' }}>
        ✦
      </div>
      <div className="flex-shrink-0">
        <div className="text-xs uppercase tracking-widest" style={{ color: '#72d4c8' }}>KORA — "Sparky"</div>
        <div className="text-xs text-white/40">{status}</div>
      </div>
      {line && (
        <div className="text-sm italic text-white/70 pl-4 flex-1" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}>"{line}"</div>
      )}
    </div>
  )
}
