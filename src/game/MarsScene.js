import Phaser from 'phaser'

const TILE = 32
const MAP_W = 50
const MAP_H = 40

const ZONES = {
  'landing-zone': { x: 4, y: 24, w: 16, h: 12, color: 0x8b4513, label: 'Landing Zone' },
  'crater-rim':   { x: 24, y: 6,  w: 18, h: 14, color: 0x6b3410, label: 'Crater Rim' },
  'canyon-edge':  { x: 6,  y: 4,  w: 14, h: 12, color: 0x4a2508, label: 'Canyon Edge' },
}

const OBJECTS = {
  kid: [
    { id: 'mars-disc-1', zone: 'landing-zone', tx: 10, ty: 29, label: 'Rust Soil' },
    { id: 'mars-disc-2', zone: 'crater-rim',   tx: 30, ty: 11, label: 'Low Gravity' },
    { id: 'mars-disc-3', zone: 'canyon-edge',  tx: 11, ty: 8,  label: 'Dust Storm' },
  ],
  adult: [
    { id: 'mars-harv-iron', zone: 'crater-rim',   tx: 34, ty: 13, label: 'Iron Oxide' },
    { id: 'mars-harv-co2',  zone: 'landing-zone', tx: 8,  ty: 32, label: 'CO₂ Vent' },
    { id: 'clue-finder',    zone: 'canyon-edge',  tx: 13, ty: 6,  label: 'Clue Signal' },
  ],
}

// ─── pixel art data ──────────────────────────────────────────────────────────
// Each frame: 8×12 art pixels rendered at 3× = 24×36 real pixels

const CHAR_PALETTES = {
  kid:   { H: '#6bc48a', h: '#4aaa6a', V: '#001820', S: '#4a8a5a', s: '#2a6a3a', L: '#3a6a4a', b: '#1a4a2a' },
  adult: { H: '#72d4c8', h: '#52b4a8', V: '#001820', S: '#3a5a8a', s: '#1a3a6a', L: '#2a4a6a', b: '#0a2a4a' },
}

// Frame layout: [down-idle, down-walk, up-idle, up-walk, side-idle, side-walk]
const CHAR_FRAMES = [
  // 0 – down idle
  ['..HHHH..', '.HhVVhH.', '.HhVVhH.', '..HHHH..', '.SSSSSS.', '.SsSSsS.', '..SSSS..', '...ss...', '.LL..LL.', '.LL..LL.', '.bb..bb.', '........'],
  // 1 – down walk (legs spread)
  ['..HHHH..', '.HhVVhH.', '.HhVVhH.', '..HHHH..', '.SSSSSS.', '.SsSSsS.', '..SSSS..', '...ss...', 'LL....LL', 'LL....LL', 'bb....bb', '........'],
  // 2 – up idle (back of helmet, no visor)
  ['..hhhh..', '.HhHHhH.', '.HhHHhH.', '..HHHH..', '.SSSSSS.', '.SsSSsS.', '..SSSS..', '...ss...', '.LL..LL.', '.LL..LL.', '.bb..bb.', '........'],
  // 3 – up walk
  ['..hhhh..', '.HhHHhH.', '.HhHHhH.', '..HHHH..', '.SSSSSS.', '.SsSSsS.', '..SSSS..', '...ss...', 'LL....LL', 'LL....LL', 'bb....bb', '........'],
  // 4 – side idle (facing left; flipX for right)
  ['..HHHH..', '.HhHVhH.', '.HhHVhH.', '..HHHH..', '..SSSSS.', '..SsSss.', '...SSS..', '....ss..', '..LL.LL.', '..LL.LL.', '..bb.bb.', '........'],
  // 5 – side walk
  ['..HHHH..', '.HhHVhH.', '.HhHVhH.', '..HHHH..', '..SSSSS.', '..SsSss.', '...SSS..', '....ss..', '.LL...L.', '.LL...L.', '.bb...b.', '........'],
]

// Object sprites: 8×8 art pixels at 2× = 16×16 real pixels
const OBJ_SPRITES = {
  rock: {
    pal: { R: '#8a5030', r: '#6a3820', x: '#4a2810' },
    art: ['..RRR...', '.RrRRr..', 'RrrxRrr.', 'RRrrrRR.', '.RRRRRr.', '..RRRr..', '...RR...', '........'],
  },
  gravity: {
    pal: { G: '#60b0ff', g: '#4090df', w: '#ffffff' },
    art: ['...ww...', '..GGGG..', '.GgGGgG.', '...GG...', '...GG...', '..GggG..', '.GGggGG.', '........'],
  },
  dust: {
    pal: { D: '#c87040', d: '#a05030', E: '#e08050' },
    art: ['.EDDDD..', 'EDD.DD..', '.D.dD...', 'DD.DDD..', '.DDDDDE.', '..dDD.DD', '...DD.D.', '........'],
  },
  iron: {
    pal: { I: '#c04030', i: '#902820', P: '#909090', p: '#606060' },
    art: ['.IIIII..', 'IIIIIII.', 'IiIIIiI.', '.IIIII..', '.....PP.', '....PPp.', '...PPp..', '..PP....'],
  },
  co2: {
    pal: { C: '#70d0c0', c: '#50b0a0', T: '#90e0d0' },
    art: ['.CC.CC..', 'CCCCCCC.', '.CcTCcC.', '..CCCC..', '.ccccc..', '..ccc...', '...c....', '........'],
  },
  clue: {
    pal: { J: '#00ee88', j: '#00aa66', K: '#aaffcc' },
    art: ['...JJ...', '..JjJJ..', '.JjKKjJ.', 'JJjKKjJJ', 'JJjKKjJJ', '.JjJJjJ.', '..JJJJ..', '...JJ...'],
  },
}

const OBJ_SPRITE_MAP = {
  'mars-disc-1':    'rock',
  'mars-disc-2':    'gravity',
  'mars-disc-3':    'dust',
  'mars-harv-iron': 'iron',
  'mars-harv-co2':  'co2',
  'clue-finder':    'clue',
}

// ─── scene ────────────────────────────────────────────────────────────────────

export class MarsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MarsScene' })
    this.onZoneEnter = null
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

  // ─── preload: generate pixel art textures ────────────────────────────────

  preload() {
    this._generateCharacterSprites()
    this._generateObjectSprites()
  }

  _generateCharacterSprites() {
    const SCALE = 3
    const AW = 8, AH = 12
    const FW = AW * SCALE   // 24
    const FH = AH * SCALE   // 36
    const NUM_FRAMES = CHAR_FRAMES.length  // 6

    Object.entries(CHAR_PALETTES).forEach(([type, pal]) => {
      const tex = this.textures.createCanvas(`player-${type}`, NUM_FRAMES * FW, FH)
      const ctx = tex.getContext()
      ctx.clearRect(0, 0, NUM_FRAMES * FW, FH)

      CHAR_FRAMES.forEach((frame, fi) => {
        const ox = fi * FW
        frame.forEach((row, ry) => {
          ;[...row].forEach((ch, rx) => {
            if (ch === '.' || !pal[ch]) return
            ctx.fillStyle = pal[ch]
            ctx.fillRect(ox + rx * SCALE, ry * SCALE, SCALE, SCALE)
          })
        })
        tex.add(fi, 0, fi * FW, 0, FW, FH)
      })

      tex.refresh()

      // Animations
      const k = `player-${type}`
      const f = (a, b) => [{ key: k, frame: a }, { key: k, frame: b }]
      this.anims.create({ key: `${type}-walk-down`,  frames: f(0,1), frameRate: 6, repeat: -1 })
      this.anims.create({ key: `${type}-walk-up`,    frames: f(2,3), frameRate: 6, repeat: -1 })
      this.anims.create({ key: `${type}-walk-left`,  frames: f(4,5), frameRate: 6, repeat: -1 })
      this.anims.create({ key: `${type}-walk-right`, frames: f(4,5), frameRate: 6, repeat: -1 })
      this.anims.create({ key: `${type}-idle`, frames: [{ key: k, frame: 0 }], frameRate: 1, repeat: -1 })
    })
  }

  _generateObjectSprites() {
    const SCALE = 2
    Object.entries(OBJ_SPRITES).forEach(([name, { pal, art }]) => {
      const W = art[0].length * SCALE
      const H = art.length * SCALE
      const tex = this.textures.createCanvas(`obj-${name}`, W, H)
      const ctx = tex.getContext()
      ctx.clearRect(0, 0, W, H)
      art.forEach((row, ry) => {
        ;[...row].forEach((ch, rx) => {
          if (ch === '.' || !pal[ch]) return
          ctx.fillStyle = pal[ch]
          ctx.fillRect(rx * SCALE, ry * SCALE, SCALE, SCALE)
        })
      })
      tex.refresh()
    })
  }

  // ─── create ───────────────────────────────────────────────────────────────

  create() {
    this._buildTerrain()
    this._buildZoneOverlays()
    this._buildObjects()
    this._buildPlayer()
    this._buildBarriers()
    this._setupCamera()
    this._setupControls()
    this._buildMinimap()

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

    g.fillStyle(0x1a0a00)
    g.fillRect(0, 0, MAP_W * TILE, MAP_H * TILE)

    for (let tx = 0; tx < MAP_W; tx++) {
      for (let ty = 0; ty < MAP_H; ty++) {
        const noise = ((tx * 7 + ty * 13) % 5)
        const colors = [0x8b3a0a, 0x7a3008, 0x9b4010, 0x6b2808, 0xa04515]
        g.fillStyle(colors[noise])
        g.fillRect(tx * TILE, ty * TILE, TILE - 1, TILE - 1)
      }
    }

    g.fillStyle(0x1a0800)
    g.fillRect(0, 0, MAP_W * TILE, 6 * TILE)
    g.fillStyle(0x5a2008)
    for (let tx = 0; tx < MAP_W; tx++) {
      g.fillRect(tx * TILE, 5 * TILE, TILE - 1, TILE)
    }

    g.fillStyle(0x3a1a04)
    g.fillCircle(33 * TILE, 13 * TILE, 6 * TILE)
    g.lineStyle(3, 0xc06020)
    g.strokeCircle(33 * TILE, 13 * TILE, 6 * TILE)

    const rockPositions = [[7,27],[14,30],[10,26],[20,15],[38,9],[42,12],[15,8],[5,35],[44,28]]
    g.fillStyle(0x4a2008)
    rockPositions.forEach(([tx, ty]) => {
      g.fillEllipse(tx * TILE + TILE/2, ty * TILE + TILE/2, TILE * 1.5, TILE)
    })

    g.fillStyle(0x303030)
    g.fillRect(6 * TILE, 34 * TILE, 6 * TILE, 4 * TILE)
    g.lineStyle(2, 0x606060)
    g.strokeRect(6 * TILE, 34 * TILE, 6 * TILE, 4 * TILE)
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

      // Glow ring
      const g = this.add.graphics().setDepth(3)
      g.fillStyle(0xffaa33, 0.18)
      g.fillCircle(x, y, 20)
      g.lineStyle(1.5, 0xffcc55, 0.55)
      g.strokeCircle(x, y, 20)

      // Pixel art sprite
      const spriteKey = `obj-${OBJ_SPRITE_MAP[obj.id] || 'rock'}`
      const sprite = this.add.image(x, y, spriteKey).setDepth(4).setScale(1.4)

      // Floating idle tween
      this.tweens.add({
        targets: sprite,
        y: y - 4,
        duration: 1100 + Math.random() * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })

      this.interactables.push({ ...obj, x, y, gfx: g, txt: sprite })
    })
  }

  // ─── player ───────────────────────────────────────────────────────────────

  _buildPlayer() {
    const startX = this.mode === 'adult' ? 9 * TILE : 10 * TILE
    const startY = this.mode === 'adult' ? 35 * TILE : 29 * TILE

    // Drop shadow
    this._shadowGfx = this.add.graphics().setDepth(9)

    this.player = this.add.sprite(startX, startY, `player-${this.mode}`, 0)
      .setDepth(10)
      .setOrigin(0.5, 1)  // anchor at feet

    this.player.play(`${this.mode}-idle`)
    this.playerSpeed = 160
    this.currentZone = null
    this.facing = 'down'
    this._isMoving = false
    this._lastFacing = 'down'
  }

  // ─── zone barriers ────────────────────────────────────────────────────────

  _buildBarriers() {
    this.barriers = {}
    Object.entries(ZONES).forEach(([id, z]) => {
      this.barriers[id] = this.add.graphics().setDepth(5)
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
        g.fillStyle(0xff3333, 0.4)
        for (let i = 0; i < z.w; i++) {
          g.fillRect((z.x + i) * TILE, z.y * TILE, TILE - 2, 3)
          g.fillRect((z.x + i) * TILE, (z.y + z.h) * TILE - 3, TILE - 2, 3)
        }
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

  // ─── movement + animation ─────────────────────────────────────────────────

  _movePlayer() {
    const p = this.player
    const speed = this.playerSpeed
    let vx = 0, vy = 0

    if (this.cursors.left.isDown  || this.wasd.left.isDown)  vx = -speed
    if (this.cursors.right.isDown || this.wasd.right.isDown) vx = speed
    if (this.cursors.up.isDown    || this.wasd.up.isDown)    vy = -speed
    if (this.cursors.down.isDown  || this.wasd.down.isDown)  vy = speed

    if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707 }

    const dt = this.sys.game.loop.delta / 1000
    // Use feet position for collision (origin is bottom-centre)
    const nx = Phaser.Math.Clamp(p.x + vx * dt, 0, MAP_W * TILE)
    const ny = Phaser.Math.Clamp(p.y + vy * dt, 6 * TILE + TILE, MAP_H * TILE)

    let blocked = false
    Object.entries(ZONES).forEach(([id, z]) => {
      if (this.unlockedZones.includes(id)) return
      const inX = nx > z.x * TILE && nx < (z.x + z.w) * TILE
      const inY = ny > z.y * TILE && ny < (z.y + z.h) * TILE
      if (inX && inY) blocked = true
    })

    if (!blocked) { p.x = nx; p.y = ny }

    const moving = vx !== 0 || vy !== 0

    if (vx < 0)      this.facing = 'left'
    else if (vx > 0) this.facing = 'right'
    else if (vy < 0) this.facing = 'up'
    else if (vy > 0) this.facing = 'down'

    // Flip sprite horizontally for rightward movement
    p.setFlipX(this.facing === 'right')

    // Switch animation only when state changes
    if (moving !== this._isMoving || (moving && this._lastFacing !== this.facing)) {
      this._isMoving = moving
      this._lastFacing = this.facing
      const type = this.mode
      p.play(moving ? `${type}-walk-${this.facing}` : `${type}-idle`, true)
    }

    // Drop shadow at feet
    this._shadowGfx.clear()
    this._shadowGfx.fillStyle(0x000000, 0.25)
    this._shadowGfx.fillEllipse(p.x, p.y + 2, 18, 7)
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
        .setPosition(this.player.x - 30, this.player.y - 52)
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
