import { useEffect, useRef, useState, useCallback } from 'react'

// ── Constants ──────────────────────────────────────────────────────────────
const W  = 340, H = 160
const GY = H - 30
const PX = 52
const GW = 32, GH = 44
const GRAVITY    = 0.62
const JUMP_VY    = -14
const BASE_SPEED = 5

// ── Colour palette ─────────────────────────────────────────────────────────
const FUR    = '#161616'
const MUZZLE = '#b07840'   // warm cream-tan matching the logo muzzle/hands
const CAP_C  = '#ff7d00'
const CAP_B  = '#a83200'
const LENS_C = '#ff7700'

// ── Particles ──────────────────────────────────────────────────────────────
function spawnDust(particles, x, y) {
  for (let i = 0; i < 6; i++) {
    particles.push({
      x: x + 4 + Math.random() * (GW - 8),
      y,
      vx: (Math.random() - 0.5) * 2.2,
      vy: -(Math.random() * 2.5 + 0.8),
      life: 1,
      r: 1.5 + Math.random() * 2,
    })
  }
}

function tickParticles(particles) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x    += p.vx
    p.y    += p.vy
    p.vy   += 0.12
    p.life -= 0.055
    if (p.life <= 0) particles.splice(i, 1)
  }
}

function drawParticles(ctx, particles) {
  for (const p of particles) {
    ctx.fillStyle = `rgba(100,75,55,${(p.life * 0.55).toFixed(2)})`
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2)
    ctx.fill()
  }
}

// ── Ground ─────────────────────────────────────────────────────────────────
function drawGround(ctx, offset) {
  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(0, GY, W, 2)
  ctx.fillStyle = '#2a2a2a'
  const o = offset % 30
  for (let x = -o; x < W; x += 30) ctx.fillRect(x, GY + 4, 16, 1)
}

// ── Gorilla sprite ─────────────────────────────────────────────────────────
function drawGorilla(ctx, x, y, frame, airborne) {
  const ls = airborne ? 0      : Math.sin(frame * 0.3) * 6
  const as = airborne ? -7     : Math.cos(frame * 0.3) * 5
  const cx = x + GW / 2

  // Shadow (shrinks when high)
  const sh = Math.max(0, 0.22 - Math.abs(y - (GY - GH)) * 0.003)
  ctx.fillStyle = `rgba(0,0,0,${sh.toFixed(2)})`
  ctx.beginPath()
  ctx.ellipse(cx, GY + 4, 14, 4, 0, 0, Math.PI * 2)
  ctx.fill()

  // Legs
  ctx.strokeStyle = FUR
  ctx.lineWidth = 7
  ctx.lineCap = 'round'
  if (airborne) {
    ctx.beginPath()
    ctx.moveTo(cx - 4, y + GH - 6)
    ctx.lineTo(cx - 7, y + GH + 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx + 4, y + GH - 6)
    ctx.lineTo(cx + 8, y + GH + 2)
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.moveTo(cx - 5, y + GH - 6)
    ctx.lineTo(cx - 5 + ls, y + GH + 5)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx + 5, y + GH - 6)
    ctx.lineTo(cx + 5 - ls, y + GH + 5)
    ctx.stroke()
  }

  // Body + wide shoulders
  ctx.fillStyle = FUR
  ctx.beginPath()
  ctx.ellipse(cx, y + GH - 17, 13, 17, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx, y + GH - 28, 16, 8, 0, 0, Math.PI * 2)
  ctx.fill()

  // Arms
  ctx.lineWidth = 8
  const lax = cx - 9 - as, lay = y + GH - 15
  const rax = cx + 9 + as, ray = y + GH - 15
  ctx.strokeStyle = FUR
  ctx.beginPath()
  ctx.moveTo(cx - 9, y + GH - 28)
  ctx.lineTo(lax, lay)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 9, y + GH - 28)
  ctx.lineTo(rax, ray)
  ctx.stroke()

  // Fists — warm brown
  ctx.fillStyle = MUZZLE
  ctx.beginPath()
  ctx.arc(lax, lay, 5.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(rax, ray, 5.5, 0, Math.PI * 2)
  ctx.fill()

  // Head
  ctx.fillStyle = FUR
  ctx.beginPath()
  ctx.arc(cx, y + 12, 14, 0, Math.PI * 2)
  ctx.fill()

  // Ears
  ctx.beginPath()
  ctx.arc(cx - 13, y + 13, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 13, y + 13, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#2a2a2a'
  ctx.beginPath()
  ctx.arc(cx - 13, y + 13, 3.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 13, y + 13, 3.2, 0, Math.PI * 2)
  ctx.fill()

  // Muzzle — warm brown
  ctx.fillStyle = MUZZLE
  ctx.beginPath()
  ctx.ellipse(cx, y + 18.5, 8.5, 6.5, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#0a0a0a'
  ctx.beginPath()
  ctx.ellipse(cx - 3, y + 18.5, 2.4, 2, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 3, y + 18.5, 2.4, 2, 0, 0, Math.PI * 2)
  ctx.fill()

  // ── Sunglasses (before brow so brow overlaps) ──
  // Left lens
  ctx.fillStyle = LENS_C
  ctx.beginPath()
  ctx.arc(cx - 5.5, y + 11.5, 4.8, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(175,50,0,0.5)'
  ctx.beginPath()
  ctx.arc(cx - 5.5, y + 11.5, 3.8, 0, Math.PI * 2)
  ctx.fill()
  // Right lens
  ctx.fillStyle = LENS_C
  ctx.beginPath()
  ctx.arc(cx + 5.5, y + 11.5, 4.8, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(175,50,0,0.5)'
  ctx.beginPath()
  ctx.arc(cx + 5.5, y + 11.5, 3.8, 0, Math.PI * 2)
  ctx.fill()
  // Shine
  ctx.fillStyle = 'rgba(255,255,255,0.16)'
  ctx.beginPath()
  ctx.ellipse(cx - 7.2, y + 10, 1.6, 1, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 3.8, y + 10, 1.6, 1, 0, 0, Math.PI * 2)
  ctx.fill()
  // Frames
  ctx.strokeStyle = '#090909'
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.arc(cx - 5.5, y + 11.5, 4.8, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx + 5.5, y + 11.5, 4.8, 0, Math.PI * 2)
  ctx.stroke()
  // Bridge
  ctx.lineWidth = 1.1
  ctx.beginPath()
  ctx.moveTo(cx - 0.7, y + 11.5)
  ctx.lineTo(cx + 0.7, y + 11.5)
  ctx.stroke()
  // Temple arms
  ctx.beginPath()
  ctx.moveTo(cx - 10.3, y + 11.5)
  ctx.lineTo(cx - 14, y + 12.5)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 10.3, y + 11.5)
  ctx.lineTo(cx + 14, y + 12.5)
  ctx.stroke()

  // ── Brow ridge over glasses ──
  ctx.fillStyle = '#0c0c0c'
  ctx.beginPath()
  ctx.ellipse(cx, y + 7, 13.5, 5.5, 0, 0, Math.PI * 2)
  ctx.fill()

  // ── Orange snapback cap ──
  ctx.fillStyle = CAP_C
  ctx.beginPath()
  ctx.moveTo(x + 3, y + 5.5)
  ctx.quadraticCurveTo(cx, y - 13, x + GW - 3, y + 5.5)
  ctx.closePath()
  ctx.fill()
  // Front panel shine
  ctx.fillStyle = 'rgba(255,165,0,0.22)'
  ctx.beginPath()
  ctx.ellipse(cx, y - 2, 5.5, 6, 0, 0, Math.PI * 2)
  ctx.fill()
  // Band
  ctx.fillStyle = CAP_B
  ctx.fillRect(x + 3, y + 4, GW - 6, 3)
  // Brim
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(x - 2, y + 6.5, GW + 4, 5)
  // Brim underside shadow
  ctx.fillStyle = 'rgba(0,0,0,0.65)'
  ctx.fillRect(x - 2, y + 9.5, GW + 4, 2)
}

// ── Obstacles ──────────────────────────────────────────────────────────────
function drawObstacle(ctx, ob) {
  ctx.lineCap = 'round'
  if (ob.type === 'bowl') {
    // Bowl
    ctx.fillStyle = '#8b2000'
    ctx.beginPath()
    ctx.moveTo(ob.x, ob.y + 5)
    ctx.quadraticCurveTo(ob.x + ob.w / 2, ob.y + ob.h + 5, ob.x + ob.w, ob.y + 5)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#b03000'
    ctx.beginPath()
    ctx.ellipse(ob.x + ob.w / 2, ob.y + 5, ob.w / 2, 5.5, 0, 0, Math.PI * 2)
    ctx.fill()
    // Noodles
    ctx.strokeStyle = '#f0c060'
    ctx.lineWidth = 2
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.moveTo(ob.x + 4 + i * 7, ob.y - 2)
      ctx.bezierCurveTo(
        ob.x + 4 + i * 7, ob.y - 10,
        ob.x + 9 + i * 7, ob.y - 10,
        ob.x + 10 + i * 7, ob.y - 2)
      ctx.stroke()
    }
    // Steam
    ctx.strokeStyle = 'rgba(200,180,140,0.28)'
    ctx.lineWidth = 1.5
    for (let i = 0; i < 2; i++) {
      ctx.beginPath()
      ctx.moveTo(ob.x + 7 + i * 10, ob.y - 13)
      ctx.quadraticCurveTo(ob.x + 4 + i * 10, ob.y - 19, ob.x + 7 + i * 10, ob.y - 25)
      ctx.stroke()
    }
  } else {
    // Wok
    ctx.fillStyle = '#2d2d2d'
    ctx.beginPath()
    ctx.moveTo(ob.x + 3, ob.y)
    ctx.quadraticCurveTo(ob.x + ob.w / 2, ob.y + ob.h + 2, ob.x + ob.w - 3, ob.y)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#3d3d3d'
    ctx.beginPath()
    ctx.ellipse(ob.x + ob.w / 2, ob.y, ob.w / 2 - 2, 5, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#555'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(ob.x + ob.w - 3, ob.y + 2)
    ctx.lineTo(ob.x + ob.w + 14, ob.y - 8)
    ctx.stroke()
    // Fire
    ctx.fillStyle = 'rgba(255,107,0,0.65)'
    ctx.beginPath()
    ctx.ellipse(ob.x + ob.w / 2, ob.y - 5, 6, 9, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,210,0,0.55)'
    ctx.beginPath()
    ctx.ellipse(ob.x + ob.w / 2, ob.y - 6, 3.5, 6, 0, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawHUD(ctx, score, hiScore) {
  ctx.textAlign = 'right'
  // Current score
  ctx.fillStyle = '#555'
  ctx.font = 'bold 13px "JetBrains Mono", monospace'
  ctx.fillText(String(Math.floor(score)).padStart(5, '0'), W - 12, 20)
  // Hi score (orange when set)
  ctx.fillStyle = hiScore > 0 ? '#ff6b00' : '#333'
  ctx.font = 'bold 10px "JetBrains Mono", monospace'
  ctx.fillText(`HI ${String(hiScore).padStart(5, '0')}`, W - 12, 34)
}

// ── Component ──────────────────────────────────────────────────────────────
export default function DinoGame() {
  const canvasRef = useRef(null)
  const stateRef  = useRef({
    phase:        'idle',
    vy: 0, y: 0,
    grounded:     true,     // single-jump flag
    particles:    [],
    groundOffset: 0,
    obstacles:    [],
    frame:  0,
    score:  0,
    speed:  BASE_SPEED,
    spawnCd: 80,
  })
  const rafRef = useRef(null)
  const [phase,   setPhase]   = useState('idle')
  const [score,   setScore]   = useState(0)
  // hi-score persisted in localStorage
  const [hiScore, setHiScore] = useState(() => {
    try { return parseInt(localStorage.getItem('bk-hiscore') ?? '0', 10) }
    catch { return 0 }
  })

  // ── Jump ─────────────────────────────────────────────────────────────────
  const jump = useCallback(() => {
    const s = stateRef.current
    if (s.phase === 'idle') {
      s.phase    = 'playing'
      s.vy       = JUMP_VY
      s.grounded = false
      spawnDust(s.particles, PX, GY)
      setPhase('playing')
      return
    }
    if (s.phase === 'gameover') {
      Object.assign(s, {
        phase: 'playing', vy: JUMP_VY, y: 0,
        grounded: false, obstacles: [], particles: [],
        frame: 0, score: 0, speed: BASE_SPEED, spawnCd: 80, groundOffset: 0,
      })
      spawnDust(s.particles, PX, GY)
      setPhase('playing')
      setScore(0)
      return
    }
    // Single jump — only when touching the ground
    if (s.phase === 'playing' && s.grounded) {
      s.vy       = JUMP_VY
      s.grounded = false
      spawnDust(s.particles, PX, GY)
    }
  }, [])

  // ── Keyboard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fn = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump() }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [jump])

  // ── Game loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function loop() {
      rafRef.current = requestAnimationFrame(loop)
      const s = stateRef.current
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#080808'
      ctx.fillRect(0, 0, W, H)

      // ── IDLE ──────────────────────────────────────────────────────────────
      if (s.phase === 'idle') {
        drawGround(ctx, 0)
        drawGorilla(ctx, PX, GY - GH, 0, false)
        drawHUD(ctx, 0, hiScore)
        ctx.fillStyle = '#444'
        ctx.font = 'bold 11px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('Toca para jugar', W / 2, H / 2 + 14)
        return
      }

      // ── PLAYING ───────────────────────────────────────────────────────────
      if (s.phase === 'playing') {
        s.vy += GRAVITY
        s.y  += s.vy
        if (s.y > 0) { s.y = 0; s.vy = 0; s.grounded = true }
        else         { s.grounded = false }

        s.groundOffset = (s.groundOffset + s.speed) % 30

        // Spawn obstacle
        s.spawnCd--
        if (s.spawnCd <= 0) {
          const w = 22 + Math.random() * 12
          const h = 20 + Math.random() * 12
          s.obstacles.push({ x: W + 10, y: GY - h, w, h,
                             type: Math.random() > 0.5 ? 'bowl' : 'wok' })
          s.spawnCd = 70 + Math.floor(Math.random() * 65)
        }

        // Move obstacles
        s.obstacles = s.obstacles
          .map((o) => ({ ...o, x: o.x - s.speed }))
          .filter((o) => o.x + o.w > -20)

        tickParticles(s.particles)

        // Collision AABB
        const M = 5
        const px = PX + M, py = GY - GH + s.y + M
        const pw = GW - M * 2, ph = GH - M
        for (const ob of s.obstacles) {
          if (px < ob.x + ob.w - M && px + pw > ob.x + M &&
              py < ob.y + ob.h - M && py + ph > ob.y + M) {
            s.phase = 'gameover'
            setPhase('gameover')
            const fin = Math.floor(s.score)
            if (fin > hiScore) {
              try { localStorage.setItem('bk-hiscore', String(fin)) } catch {}
              setHiScore(fin)
            }
            setScore(fin)
            break
          }
        }

        s.score += 0.1
        s.speed  = BASE_SPEED + Math.floor(s.score / 200) * 0.7
        s.frame++
        if (s.frame % 6 === 0) setScore(Math.floor(s.score))
      }

      // ── Draw everything ───────────────────────────────────────────────────
      drawGround(ctx, s.groundOffset)
      drawParticles(ctx, s.particles)
      s.obstacles.forEach((ob) => drawObstacle(ctx, ob))
      drawGorilla(ctx, PX, GY - GH + s.y, s.frame,
                  s.phase === 'playing' && s.y < -1)
      drawHUD(ctx, s.score, hiScore)

      // ── GAME OVER overlay ─────────────────────────────────────────────────
      if (s.phase === 'gameover') {
        ctx.fillStyle = 'rgba(0,0,0,0.62)'
        ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = '#ff6b00'
        ctx.font = 'bold 15px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', W / 2, H / 2 - 12)
        ctx.fillStyle = '#777'
        ctx.font = '10px Inter, sans-serif'
        ctx.fillText('Toca para volver a jugar', W / 2, H / 2 + 6)
        ctx.fillStyle = '#ff6b00'
        ctx.font = 'bold 10px "JetBrains Mono", monospace'
        ctx.fillText(
          `SCORE  ${String(Math.floor(s.score)).padStart(5, '0')}`,
          W / 2, H / 2 + 22,
        )
      }
    }

    loop()
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [hiScore])

  return (
    <div className="rounded-2xl overflow-hidden border border-bk-border bg-bk-bg">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full cursor-pointer select-none touch-none"
        onClick={jump}
        onTouchStart={(e) => { e.preventDefault(); jump() }}
      />
      <div className="px-3 py-2 bg-bk-card border-t border-bk-border
                      flex items-center justify-between">
        <span className="text-[10px] text-bk-muted">Tap · Espacio · ↑ para saltar</span>
        <span className="text-[11px] font-mono font-bold text-bk-primary">
          {String(score).padStart(5, '0')}
        </span>
      </div>
    </div>
  )
}
