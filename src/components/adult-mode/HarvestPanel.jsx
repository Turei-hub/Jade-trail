const MAT_LABELS = { 'iron-oxide': 'Iron Oxide', 'co2': 'CO₂' }

export default function HarvestPanel({ nodes, inventory, onHarvest }) {
  return (
    <div className="rounded-xl p-4"
      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="text-xs uppercase tracking-widest text-white/40 mb-3">Harvest Nodes</div>
      <div className="flex flex-col gap-2 mb-4">
        {nodes.map(node => {
          const done = (inventory[node.material] || 0) > 0
          return (
            <div key={node.id}
              onClick={() => !done && onHarvest(node)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                done ? 'opacity-50 cursor-default' : 'cursor-pointer hover:bg-white/5'
              }`}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-xl">{node.emoji}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{node.label}</div>
                <div className="text-xs text-white/40">{node.description}</div>
              </div>
              <div className="text-xs px-2 py-0.5 rounded flex-shrink-0"
                style={{ color: '#72d4c8', background: 'rgba(64,180,168,0.1)' }}>
                {done ? '✓ Harvested' : `+${node.amount} ${MAT_LABELS[node.material] || node.material}`}
              </div>
            </div>
          )
        })}
      </div>
      <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-xs uppercase tracking-widest text-white/30 mb-2">Inventory</div>
        {Object.keys(inventory).length === 0 ? (
          <p className="text-xs text-white/30 italic">Nothing harvested yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {Object.entries(inventory).map(([mat, amt]) => (
              <span key={mat} className="text-xs px-2 py-0.5 rounded-full"
                style={{ color: '#72d4c8', background: 'rgba(64,180,168,0.12)', border: '1px solid rgba(64,180,168,0.2)' }}>
                {MAT_LABELS[mat] || mat}: {amt}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
