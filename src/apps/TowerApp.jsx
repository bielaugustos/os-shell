import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as THREE from 'three'

const CONFIG = {
  block: {
    base: {
      color: 0x333344,
      scale: { x: 10, y: 2, z: 10 }
    },
    colors: {
      base: { r: 200, g: 200, b: 200 },
      range: { r: 55, g: 55, b: 55 },
      intensity: { r: 0.30, g: 0.34, b: 0.38 }
    }
  },
  gameplay: {
    distance: 12,
    accuracy: 0.2
  },
  camera: {
    near: -100,
    far: 1000,
    viewSize: 30,
    position: { x: 2, y: 2, z: 2 },
    lookAt: { x: 0, y: 0, z: 0 },
    offset: 6
  },
  light: {
    directional: { color: 0xffffff, intensity: 0.5, position: { x: 0, y: 500, z: 0 } },
    ambient: { color: 0xffffff, intensity: 0.4 }
  }
}

const STORAGE_KEY = 'tower_blocks_best_score'

function easeCubicOut(t) {
  const t1 = t - 1
  return t1 * t1 * t1 + 1
}

function tween(target, to, duration, easing, onComplete) {
  const start = {}
  const delta = {}
  const keys = Object.keys(to)
  
  for (const key of keys) {
    start[key] = target[key]
    delta[key] = to[key] - start[key]
  }
  
  let startTime = null
  
  function tick(currentTime) {
    if (!startTime) startTime = currentTime
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedVal = easing(progress)
    
    for (const key of keys) {
      target[key] = start[key] + delta[key] * easedVal
    }
    
    if (progress < 1) {
      requestAnimationFrame(tick)
    } else if (onComplete) {
      onComplete()
    }
  }
  
  requestAnimationFrame(tick)
}

export default function TowerApp() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const scoreRef = useRef(0)
  const highScoreRef = useRef(0)
  const gameRef = useRef(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameState, setGameState] = useState('ready')
  const [showReady, setShowReady] = useState(true)
    const handleAction = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const now = Date.now()
    if (now - lastActionRef.current < 300) return
    lastActionRef.current = now
    if (gameRef.current) {
      gameRef.current.action()
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    class Block {
      constructor(scale) {
        this.material = new THREE.MeshToonMaterial()
        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), this.material)
        if (scale) {
          this.mesh.scale.set(scale.x, scale.y, scale.z)
        }
      }

      get position() { return this.mesh.position }
      get rotation() { return this.mesh.rotation }
      get scale() { return this.mesh.scale }
      get x() { return this.mesh.position.x }
      get y() { return this.mesh.position.y }
      get z() { return this.mesh.position.z }
      set x(v) { this.mesh.position.x = v }
      set y(v) { this.mesh.position.y = v }
      set z(v) { this.mesh.position.z = v }
      get width() { return this.scale.x }
      get height() { return this.scale.y }
      get depth() { return this.scale.z }
      get color() { return this.material.color.getHex() }
      set color(v) { this.material.color.set(v) }

      getMesh() { return this.mesh }

      moveScalar(scalar) {
        this.position.x += this.direction.x * scalar
        this.position.y += this.direction.y * scalar
        this.position.z += this.direction.z * scalar
      }

      cut(targetBlock) {
        const position = this.position.clone()
        const scale = this.scale.clone()

        if (Math.abs(this.direction.x) > Number.EPSILON) {
          const overlap = targetBlock.width - Math.abs(this.x - targetBlock.x)
          if (overlap < 0) return { state: 'missed' }

          if (this.scale.x - overlap < CONFIG.gameplay.accuracy) {
            this.x = targetBlock.x
            return { state: 'perfect' }
          }

          this.scale.x = overlap
          this.x = (targetBlock.x + this.x) * 0.5
          scale.x -= overlap
          position.x = this.x + (scale.x + this.width) * (this.x < targetBlock.x ? -0.5 : 0.5)
        } else {
          const overlap = targetBlock.depth - Math.abs(this.z - targetBlock.z)
          if (overlap < 0) return { state: 'missed' }

          if (this.scale.z - overlap < CONFIG.gameplay.accuracy) {
            this.z = targetBlock.z
            return { state: 'perfect' }
          }

          this.scale.z = overlap
          this.z = (targetBlock.z + this.z) * 0.5
          scale.z -= overlap
          position.z = this.z + (scale.z + this.depth) * (this.z < targetBlock.z ? -0.5 : 0.5)
        }

        return { state: 'chopped', position, scale }
      }
    }

    class Stage {
      constructor(container, devicePixelRatio) {
        this.container = container
        this.scene = new THREE.Scene()
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setPixelRatio(devicePixelRatio || 1)
        this.renderer.setClearColor(0x000000, 0)
        this.renderer.setSize(container.clientWidth, container.clientHeight)
        this.container.appendChild(this.renderer.domElement)

        this.setupCamera()
        this.setupLights()
        this.resize(container.clientWidth, container.clientHeight)
      }

      setupCamera() {
        const { near, far, position, lookAt } = CONFIG.camera
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, near, far)
        this.camera.position.set(position.x, position.y, position.z)
        this.camera.lookAt(lookAt.x, lookAt.y, lookAt.z)
        this.camera.updateProjectionMatrix()
      }

      setupLights() {
        const { color, intensity, position } = CONFIG.light.directional
        const directionalLight = new THREE.DirectionalLight(color, intensity)
        directionalLight.position.set(position.x, position.y, position.z)
        this.scene.add(directionalLight)

        const { color: ambientColor, intensity: ambientIntensity } = CONFIG.light.ambient
        const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity)
        this.scene.add(ambientLight)
      }

      resize(width, height) {
        const aspect = width / height || 1
        const { viewSize } = CONFIG.camera
        this.camera.left = -viewSize * aspect
        this.camera.right = viewSize * aspect
        this.camera.top = viewSize
        this.camera.bottom = -viewSize
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
      }

      render() { this.renderer.render(this.scene, this.camera) }
      add(object) { this.scene.add(object) }
      remove(object) { this.scene.remove(object) }

      setCamera(y) {
        tween(this.camera.position, { y: y + CONFIG.camera.offset }, 300, easeCubicOut)
      }

      resetCamera(duration) {
        const { position, offset } = CONFIG.camera
        tween(this.camera.position, { y: position.y + offset }, duration, easeCubicOut)
      }
    }

    class Game {
      constructor(container, onScoreUpdate, onGameStateChange) {
        this.onScoreUpdate = onScoreUpdate
        this.onGameStateChange = onGameStateChange
        this.container = container
        
        this.stage = new Stage(container, window.devicePixelRatio || 1)
        this.blocks = []
        this.state = 'loading'
        this.colorOffset = Math.round(Math.random() * 100)
        
        this.addBaseBlock()
        this.updateState('ready')
        
        this.tick()
      }

      getBestScore() {
        try {
          return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10)
        } catch (e) { return 0 }
      }

      saveBestScore(score) {
        try {
          const current = this.getBestScore()
          if (score > current) {
            localStorage.setItem(STORAGE_KEY, String(score))
          }
        } catch (e) {}
      }

      updateState(newState) {
        this.state = newState
        this.onGameStateChange(newState)
      }

      action() {
        switch (this.state) {
          case 'ready': this.startGame(); break
          case 'playing': this.placeBlock(); break
          case 'ended': this.restartGame(); break
        }
      }

      startGame() {
        if (this.state === 'playing') return
        this.colorOffset = Math.round(Math.random() * 100)
        this.onScoreUpdate(0)
        this.updateState('playing')
        this.addBlock(this.blocks[0])
      }

      addBaseBlock() {
        const { scale, color } = CONFIG.block.base
        const block = new Block(scale)
        this.stage.add(block.getMesh())
        this.blocks.push(block)
        block.color = color
      }

      addBlock(targetBlock) {
        const block = new Block()
        block.rotation.set(0, 0, 0)
        block.scale.set(targetBlock.scale.x, targetBlock.scale.y, targetBlock.scale.z)
        block.position.set(targetBlock.x, targetBlock.y + targetBlock.height, targetBlock.z)
        block.direction = new THREE.Vector3(0, 0, 0)
        block.color = this.getNextBlockColor()

        this.stage.add(block.getMesh())
        this.blocks.push(block)

        const length = this.blocks.length
        if (length % 2 === 0) {
          block.direction.x = 1
        } else {
          block.direction.z = 1
        }

        block.moveScalar(CONFIG.gameplay.distance)
        this.stage.setCamera(block.y)
        this.onScoreUpdate(length - 1)
      }

      getNextBlockColor() {
        const { base, range, intensity } = CONFIG.block.colors
        const offset = this.blocks.length + this.colorOffset
        const r = Math.floor(base.r + range.r * Math.sin(intensity.r * offset))
        const g = Math.floor(base.g + range.g * Math.sin(intensity.g * offset + 2))
        const b = Math.floor(base.b + range.b * Math.sin(intensity.b * offset + 4))
        return (r << 16) + (g << 8) + b
      }

      placeBlock() {
        const length = this.blocks.length
        const targetBlock = this.blocks[length - 2]
        const currentBlock = this.blocks[length - 1]

        const result = currentBlock.cut(targetBlock)

        if (result.state === 'missed') {
          this.stage.remove(currentBlock.getMesh())
          this.endGame()
          return
        }

        this.onScoreUpdate(length - 1)
        this.addBlock(currentBlock)

        if (result.state === 'chopped') {
          this.addChoppedBlock(result.position, result.scale, currentBlock)
        }
      }

      addChoppedBlock(position, scale, sourceBlock) {
        const block = new Block()
        block.rotation.set(0, 0, 0)
        block.scale.set(scale.x, scale.y, scale.z)
        block.position.copy(position)
        block.color = sourceBlock.color

        this.stage.add(block.getMesh())

        const dirX = Math.sign(block.x - sourceBlock.x) || 1
        const dirZ = Math.sign(block.z - sourceBlock.z) || 1
        
        tween(block.position, {
          x: block.x + dirX * 10,
          y: block.y - 30,
          z: block.z + dirZ * 10
        }, 1000, easeCubicOut, () => {
          this.stage.remove(block.getMesh())
        })

        tween(block.rotation, { x: dirZ * 5, z: dirX * -5 }, 900, easeCubicOut)
      }

      endGame() {
        this.saveBestScore(this.blocks.length - 1)
        this.updateState('ended')
      }

      restartGame() {
        this.updateState('resetting')

        const length = this.blocks.length
        const duration = 200
        const delay = 20

        for (let i = length - 1; i > 0; i--) {
          const block = this.blocks[i]
          tween(block.scale, { x: 0, y: 0, z: 0 }, duration, easeCubicOut, () => {
            this.stage.remove(block.getMesh())
          })
          tween(block.rotation, { y: 0.5 }, duration, easeCubicOut)
        }

        const cameraMoveSpeed = duration * 2 + length * delay
        this.stage.resetCamera(cameraMoveSpeed)

        setTimeout(() => {
          this.blocks = this.blocks.slice(0, 1)
          this.startGame()
        }, cameraMoveSpeed)
      }

      moveCurrentBlock() {
        if (this.state !== 'playing') return
        const length = this.blocks.length
        if (length < 2) return

        const speed = 0.16 + Math.min(0.0008 * length, 0.08)
        this.blocks[length - 1].moveScalar(speed)
        this.reverseDirection()
      }

      reverseDirection() {
        const length = this.blocks.length
        if (length < 2) return

        const targetBlock = this.blocks[length - 2]
        const currentBlock = this.blocks[length - 1]
        const { distance } = CONFIG.gameplay

        const diffX = currentBlock.x - targetBlock.x
        if ((currentBlock.direction.x === 1 && diffX > distance) ||
            (currentBlock.direction.x === -1 && diffX < -distance)) {
          currentBlock.direction.x *= -1
          return
        }

        const diffZ = currentBlock.z - targetBlock.z
        if ((currentBlock.direction.z === 1 && diffZ > distance) ||
            (currentBlock.direction.z === -1 && diffZ < -distance)) {
          currentBlock.direction.z *= -1
          return
        }
      }

      tick() {
        this.moveCurrentBlock()
        this.stage.render()
        this.animationId = requestAnimationFrame(() => this.tick())
      }

      resize() {
        this.stage.resize(this.container.clientWidth, this.container.clientHeight)
      }

      dispose() {
        if (this.animationId) cancelAnimationFrame(this.animationId)
        if (this.stage && this.stage.renderer) this.stage.renderer.dispose()
      }
    }

    const handleScoreUpdate = (newScore) => {
      const finalScore = Math.max(0, newScore)
      scoreRef.current = finalScore
      setScore(finalScore)
      if (finalScore > highScoreRef.current) {
        highScoreRef.current = finalScore
        setHighScore(finalScore)
      }
    }

    const handleGameStateChange = (newState) => {
      setGameState(newState)
      setShowReady(newState === 'ready')
      setShowGameOver(newState === 'ended')
    }

    const game = new Game(container, handleScoreUpdate, handleGameStateChange)
    gameRef.current = game

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        game.action()
      }
    }

    const handleResize = () => {
      game.resize()
    }

    const initResizeObserver = () => {
      if (typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect
            console.log('[Tower] Resize:', width, height)
            if (width > 0 && height > 0) {
              game.resize()
            }
          }
        })
        observer.observe(container)
        return () => observer.disconnect()
      }
      return () => {}
    }

    const cleanupObserver = initResizeObserver()
    window.addEventListener('touchstart', handleAction, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)

    return () => {
      cleanupObserver()
      window.removeEventListener('touchstart', handleAction)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
      if (gameRef.current) {
        gameRef.current.dispose()
      }
    }
  }, [])

  return (
    <div style={{ 
      display:'flex', 
      flexDirection:'column', 
      alignItems:'center', 
      justifyContent:'center', 
      height:'100%', 
      padding:20,
      position:'relative',
      fontFamily:'var(--font-body)',
      background: 'transparent'
    }}>
      <div style={{ position:'absolute', top: 30, left: 20, zIndex: 10 }}>
        <div>
          <div style={{ fontSize:10, color:'var(--text-ter)', textTransform:'uppercase', letterSpacing:1, fontFamily:'var(--font-mono)' }}>{t('tower.score') || 'Score'}</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:700, color:'var(--text-pri)' }}>{score}</div>
        </div>
      </div>
      <div style={{ position:'absolute', top: 30, right: 20, zIndex: 10 }}>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:10, color:'var(--text-ter)', textTransform:'uppercase', letterSpacing:1, fontFamily:'var(--font-mono)' }}>{t('tower.best') || 'Best'}</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:700, color:'var(--text-pri)' }}>{highScore}</div>
        </div>
      </div>

      <div 
        ref={containerRef}
        style={{
          width:'100%',
          height:'100%',
          position:'absolute',
          top: 0,
          left: 0,
          cursor:'pointer',
          background:'transparent',
          touchAction: 'manipulation'
        }}
      />

      {showReady && (
        <div onClick={handleAction} onTouchStart={(e) => { e.stopPropagation(); handleAction(e); }} style={{ position:'absolute', bottom:20, left:0, right:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'transparent', zIndex: 5, cursor:'pointer' }}>
          <div style={{ border:'3px solid var(--accent)', padding:'10px 20px', background:'transparent', color:'var(--accent)', fontSize:18, fontFamily:'var(--font-body)', cursor:'pointer', borderRadius:8 }}>
            {t('tower.tapToStart') || 'Tap to start'}
          </div>
        </div>
      )}

      {showGameOver && (
        <div onClick={handleAction} onTouchStart={(e) => { e.stopPropagation(); handleAction(e); }} style={{ position:'absolute', top:0, left:0, right:0, height:'85%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'transparent', zIndex: 5, cursor:'pointer' }}>
          <h2 style={{ margin:0, padding:0, fontSize:40, color:'var(--text-pri)', fontFamily:'var(--font-display)' }}>Game Over</h2>
          <p style={{ color:'var(--text-sec)', fontSize:16, fontFamily:'var(--font-body)', marginTop:10 }}>
            {t('tower.gameOver') || 'You did great, you\'re best.'}
          </p>
        </div>
      )}

      {showGameOver && (
        <div onClick={handleAction} onTouchStart={(e) => { e.stopPropagation(); handleAction(e); }} style={{ position:'absolute', bottom:20, left:0, right:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'transparent', zIndex: 6, cursor:'pointer' }}>
          <div style={{ border:'3px solid var(--accent)', padding:'10px 20px', background:'transparent', color:'var(--accent)', fontSize:18, fontFamily:'var(--font-body)', cursor:'pointer', borderRadius:8 }}>
            {t('tower.tapToStart') || 'Tap to start'}
          </div>
        </div>
      )}

      <div style={{ position:'absolute', bottom:20, width:'100%', textAlign:'center', fontSize:12, color:'var(--text-sec)', fontFamily:'var(--font-mono)', opacity: gameState === 'playing' ? 1 : 0, transition:'opacity 0.5s ease' }}>
        {t('tower.instruction') || 'Tap or press Space to drop blocks'}
      </div>
    </div>
  )
}