import { canCraftUpgrade } from '../../systems/progression'

export default function FabricatorPanel({ upgrades, inventory, built, onCraft }) {
  return (
    <div className="rounded-xl p-4"
      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="text-xs uppercase tracking-widest text-white/40 mb-3">Kora's Fabricator</div>
      <div className="flex flex-col gap-3">
        {upgrades.map(upgrade => {
          const isBuilt = built.includes(upgrade.id)
          const available = !isBuilt && canCraftUpgrade(upgrade, inventory)
          return (
            <div key={upgrade.id} className="rounded-lg p-3" style={{
              background: isBuilt ? 'rgba(255,255,255,0.02)' : available ? 'rgba(64,180,168,0.07)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isBuilt ? 'rgba(255,255,255,0.05)' : available ? 'rgba(64,180,168,0.3)' : 'rgba(255,255,255,0.06)'}`,
              opacity: isBuilt ? 0.6 : 1,
            }}>
              <div className="flex items-center gap-2 mb-1">
                <span>{upgrade.emoji}</span>
                <span className="text-sm font-semibold">{upgrade.label}</span>
                {isBuilt && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded"
                    style={{ color: '#6bc48a', background: 'rgba(74,154,110,0.15)' }}>Built ✓</span>
                )}
              </div>
              <p className="text-xs text-white/50 leading-relaxed mb-1">{upgrade.description}</p>
              {upgrade.koraLine && (
                <p className="text-xs italic mb-2" style={{ color: '#72d4c8' }}>Kora: "{upgrade.koraLine}"</p>
              )}
              {!isBuilt && (
                <>
                  <p className="text-xs text-white/30 mb-2">
                    Requires: {Object.entries(upgrade.requires).map(([m, a]) => `${a} ${m}`).join(', ')}
                  </p>
                  <button disabled={!available} onClick={() => onCraft(upgrade)}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: available ? 'rgba(64,180,168,0.2)' : 'rgba(255,255,255,0.05)',
                      color: available ? '#72d4c8' : '#555',
                      border: available ? '1px solid rgba(64,180,168,0.35)' : '1px solid rgba(255,255,255,0.07)',
                    }}>
                    {available ? '⚙ Fabricate' : 'Needs materials'}
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
