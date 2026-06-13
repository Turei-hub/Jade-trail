export default function HomeScreen({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 p-8"
      style={{ background: 'radial-gradient(ellipse at center, #0d1b2e 0%, #0a0e1a 70%)' }}>
      <header className="text-center">
        <div className="text-5xl mb-4 glow-jade">◆</div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-widest uppercase"
          style={{ background: 'linear-gradient(135deg, #6bc48a, #72d4c8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          The Jade Trail
        </h1>
        <p className="mt-3 text-white/40 text-base italic">
          A father follows the clues his son leaves across the galaxy.
        </p>
      </header>

      <section className="flex flex-col sm:flex-row gap-6 items-center w-full max-w-2xl">
        <div className="flex-1 w-full rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1"
          style={{ background: 'linear-gradient(160deg, #1a2e1a, #0f1e2e)', border: '1px solid #2d6b47', boxShadow: '0 4px 24px rgba(74,154,110,0.12)' }}
          onClick={() => onNavigate('kid-mode', { planet: 'mars' })}>
          <h2 className="text-xl font-bold mb-1" style={{ color: '#6bc48a' }}>Play as Matiu</h2>
          <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Kid Mode</p>
          <p className="text-sm text-white/50 leading-relaxed mb-4">
            Explore each planet under guard. Stay curious. Leave clues for your dad. He's coming.
          </p>
          <div className="text-xs text-white/30 px-2 py-1 rounded inline-block mb-4"
            style={{ background: 'rgba(255,255,255,0.04)' }}>Planet 1 — Mars</div>
          <button className="w-full py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: '#2d6b47', color: '#6bc48a' }}>Begin Exploration →</button>
        </div>

        <div className="text-white/20 text-sm">or</div>

        <div className="flex-1 w-full rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1"
          style={{ background: 'linear-gradient(160deg, #0f1e30, #0a1422)', border: '1px solid #1e3a5a', boxShadow: '0 4px 24px rgba(64,180,168,0.08)' }}
          onClick={() => onNavigate('adult-mode', { planet: 'mars' })}>
          <h2 className="text-xl font-bold mb-1" style={{ color: '#72d4c8' }}>Play as David</h2>
          <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Adult Mode</p>
          <p className="text-sm text-white/50 leading-relaxed mb-4">
            Land one step behind. Find the clues. Harvest. Build with Kora. Get closer.
          </p>
          <div className="text-xs text-white/30 px-2 py-1 rounded inline-block mb-4"
            style={{ background: 'rgba(255,255,255,0.04)' }}>Planet 1 — Mars</div>
          <button className="w-full py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: '#1a3a5a', color: '#72d4c8' }}>Begin the Chase →</button>
        </div>
      </section>

      <footer className="text-center text-white/25 text-xs">
        <p>Kaupeka Tech · v0.1 Wireframe · June 2026</p>
        <p className="italic mt-1">"What is passed down saves lives."</p>
      </footer>
    </div>
  )
}
