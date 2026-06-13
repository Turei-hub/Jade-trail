import Phaser from 'phaser'

const TILE = 32
const MAP_W = 50
const MAP_H = 40

// Zone definitions — pixel rectangles on the map
const ZONES = {
  'landing-zone': { x: 4, y: 24, w: 16, h: 12, color: 0x8b4513, label: 'Landing Zone' },
  'crater-rim':   { x: 24, y: 6,  w: 18, h: 14, color: 0x6b3410, label: 'Crater Rim' },
  'canyon-edge':  { x: 6,  y: 4,  w: 14, h: 12, color: 0x4a2508, label: 'Canyon Edge' },
}

// Discovery/harvest object positions [zone, tileX, tileY]
const OBJECTS = {
  kid: [
    { id: 'mars-disc-1', zone: 'landing-zone', tx: 10, ty: 29, emoji: '🪨', label: 'Rust Soil' },
    { id: 'mars-disc-2', zone: 'crater-rim',   tx: 30, ty: 11, emoji: '⬆️', label: 'Low Gravity' },
    { id: 'mars-disc-3', zone: 'canyon-edge',  tx: 11, ty: 8,  emoji: '🌪️', label: 'Dust Storm' },
  ],
  adult: [
    { id: 'mars-harv-iron', zone: 'crater-rim',   tx: 34, ty: 13, emoji: '⛏️', label: 'Iron Oxide' },
    { id: 'mars-harv-co2',  zone: 'landing-zone', tx: 8,  ty: 32, emoji: '💨', label: 'CO₂ Vent' },
    { id: 'clue-finder',    zone: 'canyon-edge',  tx: 13, ty: 6,  emoji: '✦',  label: 'Clue Signal' },
  ],
}

export class MarsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MarsScene' })
    this.onZoneEnter = null   // callbacks set by React
    this.onZoneLeave = null
    this.onInteract  = null
    this.mode = 'kid'
    this.unlockedZones = ['landing-zone']
  }

  setCallbacks({ onZoneEnter, onZoneLeave, onInteract }) {
    this.onZoneEnter = onZoneEnter
    this.onZoneLeave = onZoneLeave
    this.onInteract  = onInteract
  }

  setMode(mode) { this.mode = mode }

  setUnlockedZones(zones) {
    this.unlockedZones = zones
    this._updateBarriers()
  }

  create() {
    this._buildTerrain()
    this._buildZoneOverlays()
    this._buildObjects()
    this._buildPlayer()
    this._buildBarriers()
    this._setupCamera()
    this._setupControls()
    this._buildMinimap()

    // Prompt label
    this.promptText = this.add.text(0, 0, '', {
      fontSize: '11px', color: '#ffffff',
      backgroundColor: '#00000088', padding: { x: 6, y: 3 },
    }).setDepth(20).setVisible(false)
  }

  update() {
    this._movePlayer()
    this._checkZones()
    this._checkNearObject()
    this._updateMinimap()
  }

  // ─── terrain ──────────────────────────────────────────────────────────────

  _buildTerrain() {
    const g = this.add.graphics().setDepth(0)

    // Sky
    g.fillStyle(0x1a0a00)
    g.fillRect(0, 0, MAP_W * TILE, MAP_H * TILE)

    // Base ground — rust red tiles with variation
    for (let tx = 0; tx < MAP_W; tx++) {
      for (let ty = 0; ty < MAP_H; ty++) {
        const noise = ((tx * 7 + ty * 13) % 5)
        const colors = [0x8b3a0a, 0x7a3008, 0x9b4010, 0x6b2808, 0xa04515]
        g.fillStyle(colors[noise])
        g.fillRect(tx * TILE, ty * TILE, TILE - 1, TILE - 1)
      }
    }

    // Canyon — dark chasm at top of map
    g.fillStyle(0x1a0800)
    g.fillRect(0, 0, MAP_W * TILE, 6 * TILE)
    // Canyon walls
    g.fillStyle(0x5a2008)
    for (let tx = 0; tx < MAP_W; tx++) {
      g.fillRect(tx * TILE, 5 * TILE, TILE - 1, TILE)
    }

    // Crater — circle in upper right
    g.fillStyle(0x3a1a04)
    g.fillCircle(33 * TILE, 13 * TILE, 6 * TILE)
    g.lineStyle(3, 0xc06020)
    g.strokeCircle(33 * TILE, 13 * TILE, 6 * TILE)

    // Rocks scattered
    const rockPositions = [
      [7,27],[14,30],[10,26],[20,15],[38,9],[42,12],[15,8],[5,35],[44,28]
    ]
    g.fillStyle(0x4a2008)
    rockPositions.forEach(([tx, ty]) => {
      g.fillEllipse(tx * TILE + TILE/2, ty * TILE + TILE/2, TILE * 1.5, TILE)
    })

    // Landing pad for adult mode
    g.fillStyle(0x303030)
    g.fillRect(6 * TILE, 34 * TILE, 6 * TILE, 4 * TILE)
    g.lineStyle(2, 0x606060)
    g.strokeRect(6 * TILE, 34 * TILE, 6 * TILE, 4 * TILE)
    // Ship outline
    g.fillStyle(0x485060)
    g.fillTriangle(9*TILE, 34*TILE, 8*TILE, 37*TILE, 10*TILE, 37*TILE)
  }

  // ─── zone overlays ────────────────────────────────────────────────────────

  _buildZoneOverlays() {
    this.zoneGraphics = {}
    Object.entries(ZONES).forEach(([id, z]) => {
      const g = this.add.graphics().setDepth(1).setAlpha(0.18)
      g.fillStyle(z.color)
      g.fillRect(z.x * TILE, z.y * TILE, z.w * TILE, z.h * TILE)
      g.lineStyle(1, z.color + 0x303030)
      g.strokeRect(z.x * TILE, z.y * TILE, z.w * TILE, z.h * TILE)
      this.zoneGraphics[id] = g

      // Zone label
      this.add.text(
        (z.x + z.w / 2) * TILE,
        (z.y + 0.8) * TILE,
        z.label.toUpperCase(),
        { fontSize: '9px', color: '#ffffff55', letterSpacing: 2 }
      ).setOrigin(0.5, 0).setDepth(2)
    })
  }

  // ─── interactable objects ─────────────────────────────────────────────────

  _buildObjects() {
    this.interactables = []
    const objs = OBJECTS[this.mode] || OBJECTS.kid

    objs.forEach(obj => {
      const x = obj.tx * TILE + TILE / 2
      const y = obj.ty * TILE + TILE / 2

      // Glow circle
      const g = this.add.graphics().setDepth(3)
      g.fillStyle(0xffaa33, 0.25)
      g.fillCircle(x, y, 18)
      g.lineStyle(1.5, 0xffcc55, 0.6)
      g.strokeCircle(x, y, 18)

      // Emoji text
      const txt = this.add.text(x, y - 2, obj.emoji, { fontSize: '20px' })
        .setOrigin(0.5).setDepth(4)

      this.interactables.push({ ...obj, x, y, gfx: g, txt })
    })
  }

  // ─── player ───────────────────────────────────────────────────────────────

  _buildPlayer() {
    const startX = this.mode === 'adult' ? 9 * TILE : 10 * TILE
    const startY = this.mode === 'adult' ? 35 * TILE : 29 * TILE

    // Body
    const g = this.add.graphics().setDepth(10)
    // Suit
    g.fillStyle(this.mode === 'kid' ? 0x4a8a5a : 0x3a5a8a)
    g.fillRoundedRect(-10, -14, 20, 22, 4)
    // Helmet
    g.fillStyle(this.mode === 'kid' ? 0x6bc48a : 0x72d4c8, 0.8)
    g.fillCircle(0, -18, 10)
    // Visor
    g.fillStyle(0x001a2e, 0.9)
    g.fillEllipse(0, -18, 12, 8)
    // Legs
    g.fillStyle(this.mode === 'kid' ? 0x3a6a4a : 0x2a4a6a)
    g.fillRect(-8, 8, 6, 8)
    g.fillRect(2, 8, 6, 8)

    this.player = this.add.container(startX, startY, [g]).setDepth(10)
    this.playerBody = g
    this.playerSpeed = 160
    this.currentZone = null
    this.facing = 'down'
  }

  // ─── zone barriers ────────────────────────────────────────────────────────

  _buildBarriers() {
    this.barriers = {}
    Object.entries(ZONES).forEach(([id, z]) => {
      // Visual barrier line at zone border
      const g = this.add.graphics().setDepth(5)
      this.barriers[id] = g
    })
    this._updateBarriers()
  }

  _updateBarriers() {
    if (!this.barriers) return
    Object.entries(ZONES).forEach(([id, z]) => {
      const g = this.barriers[id]
      g.clear()
      if (!this.unlockedZones.includes(id)) {
        g.lineStyle(3, 0xff3333, 0.7)
        g.strokeRect(z.x * TILE, z.y * TILE, z.w * TILE, z.h * TILE)
        // Dashed effect - draw Xs at border
        g.fillStyle(0xff3333, 0.4)
        for (let i = 0; i < z.w; i++) {
          g.fillRect((z.x + i) * TILE, z.y * TILE, TILE - 2, 3)
          g.fillRect((z.x + i) * TILE, (z.y + z.h) * TILE - 3, TILE - 2, 3)
        }
      } else {
        g.clear()
      }
    })
  }

  // ─── camera ───────────────────────────────────────────────────────────────

  _setupCamera() {
    this.cameras.main.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
    this.cameras.main.setZoom(1.6)
  }

  // ─── controls ─────────────────────────────────────────────────────────────

  _setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    })
    this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this.input.keyboard.on('keydown-E', () => this._tryInteract())
  }

  // ─── minimap ──────────────────────────────────────────────────────────────

  _buildMinimap() {
    const mm = this.add.graphics().setScrollFactor(0).setDepth(100)
    const ox = 10, oy = 10, scale = 3

    mm.fillStyle(0x000000, 0.6)
    mm.fillRect(ox - 2, oy - 2, MAP_W * scale + 4, MAP_H * scale + 4)

    Object.entries(ZONES).forEach(([id, z]) => {
      mm.fillStyle(z.color, 0.5)
      mm.fillRect(ox + z.x * scale, oy + z.y * scale, z.w * scale, z.h * scale)
    })

    this.minimapDot = this.add.graphics().setScrollFactor(0).setDepth(101)
    this._mmOx = ox; this._mmOy = oy; this._mmScale = scale
  }

  _updateMinimap() {
    if (!this.minimapDot || !this.player) return
    this.minimapDot.clear()
    this.minimapDot.fillStyle(0xffffff)
    this.minimapDot.fillCircle(
      this._mmOx + (this.player.x / TILE) * this._mmScale,
      this._mmOy + (this.player.y / TILE) * this._mmScale,
      2.5
    )
  }

  // ─── movement ─────────────────────────────────────────────────────────────

  _movePlayer() {
    const p = this.player
    const speed = this.playerSpeed
    let vx = 0, vy = 0

    if (this.cursors.left.isDown  || this.wasd.left.isDown)  vx = -speed
    if (this.cursors.right.isDown || this.wasd.right.isDown) vx = speed
    if (this.cursors.up.isDown    || this.wasd.up.isDown)    vy = -speed
    if (this.cursors.down.isDown  || this.wasd.down.isDown)  vy = speed

    // Diagonal normalise
    if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707 }

    const dt = this.sys.game.loop.delta / 1000
    const nx = Phaser.Math.Clamp(p.x + vx * dt, 0, MAP_W * TILE)
    const ny = Phaser.Math.Clamp(p.y + vy * dt, 6 * TILE + TILE, MAP_H * TILE)

    // Block locked zones
    let blocked = false
    Object.entries(ZONES).forEach(([id, z]) => {
      if (this.unlockedZones.includes(id)) return
      const inX = nx > z.x * TILE && nx < (z.x + z.w) * TILE
      const inY = ny > z.y * TILE && ny < (z.y + z.h) * TILE
      if (inX && inY) blocked = true
    })

    if (!blocked) { p.x = nx; p.y = ny }

    // Bob animation
    if (vx !== 0 || vy !== 0) {
      p.y += Math.sin(this.time.now / 120) * 0.4
    }
  }

  // ─── zone detection ───────────────────────────────────────────────────────

  _checkZones() {
    let entered = null
    Object.entries(ZONES).forEach(([id, z]) => {
      const inX = this.player.x > z.x * TILE && this.player.x < (z.x + z.w) * TILE
      const inY = this.player.y > z.y * TILE && this.player.y < (z.y + z.h) * TILE
      if (inX && inY) entered = id
    })

    if (entered !== this.currentZone) {
      if (this.currentZone && this.onZoneLeave) this.onZoneLeave(this.currentZone)
      this.currentZone = entered
      if (entered && this.onZoneEnter) this.onZoneEnter(entered)
    }
  }

  // ─── interaction ──────────────────────────────────────────────────────────

  _checkNearObject() {
    let nearest = null
    let nearDist = 60

    this.interactables.forEach(obj => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, obj.x, obj.y)
      if (dist < nearDist) { nearest = obj; nearDist = dist }
    })

    if (nearest) {
      this.promptText
        .setText(`[E] ${nearest.label}`)
        .setPosition(this.player.x - 30, this.player.y - 44)
        .setVisible(true)
      this._nearObject = nearest
    } else {
      this.promptText.setVisible(false)
      this._nearObject = null
    }
  }

  _tryInteract() {
    if (!this._nearObject) return
    if (this.onInteract) this.onInteract(this._nearObject.id)
  }
}
