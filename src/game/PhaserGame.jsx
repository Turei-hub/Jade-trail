import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { MarsScene } from './MarsScene'

export default function PhaserGame({ mode, unlockedZones, onZoneEnter, onZoneLeave, onInteract }) {
  const containerRef = useRef(null)
  const gameRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    const scene = new MarsScene()
    sceneRef.current = scene

    const config = {
      type: Phaser.AUTO,
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
      backgroundColor: '#1a0800',
      parent: containerRef.current,
      scene: scene,
    }

    gameRef.current = new Phaser.Game(config)

    // Wait for scene to be ready then set callbacks + mode
    gameRef.current.events.once('ready', () => {
      scene.setMode(mode)
      scene.setCallbacks({ onZoneEnter, onZoneLeave, onInteract })
      scene.setUnlockedZones(unlockedZones)
    })

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, []) // eslint-disable-line

  // Sync unlocked zones live (e.g. trust increases)
  useEffect(() => {
    sceneRef.current?.setUnlockedZones(unlockedZones)
  }, [unlockedZones])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: 400 }}
    />
  )
}
