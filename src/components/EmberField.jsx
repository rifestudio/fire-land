import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/motion'

/**
 * A canvas of embers drifting upward like sparks off a fire — the warm
 * atmosphere behind the dark grounds. Dosed: few particles, low opacity,
 * additive blending so they read as light, not dots.
 * Reduced motion → a single still warm glow, no animation.
 */
export default function EmberField({ density = 56, className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = prefersReducedMotion()
    let raf
    let w
    let h
    let dpr
    let embers = []
    let running = true

    const COLORS = ['#ff2d0e', '#ff4d1c', '#ff7a18', '#ffb020']

    const seed = () => {
      embers = Array.from({ length: density }, () => spawn(true))
    }
    function spawn(initial) {
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + Math.random() * 60,
        r: 0.6 + Math.random() * 2.2,
        vy: 0.15 + Math.random() * 0.7,
        vx: (Math.random() - 0.5) * 0.35,
        life: 0,
        maxLife: 260 + Math.random() * 360,
        hue: COLORS[(Math.random() * COLORS.length) | 0],
        flick: Math.random() * Math.PI * 2,
      }
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const drawStill = () => {
      ctx.clearRect(0, 0, w, h)
      embers.forEach((e) => paint(e, 0.5))
    }

    function paint(e, alphaScale) {
      const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 4)
      g.addColorStop(0, e.hue)
      g.addColorStop(1, 'rgba(255,77,28,0)')
      ctx.globalAlpha =
        alphaScale *
        (0.5 + 0.5 * Math.sin(e.flick)) *
        (1 - e.life / e.maxLife)
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(e.x, e.y, e.r * 4, 0, Math.PI * 2)
      ctx.fill()
    }

    const tick = () => {
      if (!running) return
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      embers.forEach((e, i) => {
        e.y -= e.vy
        e.x += e.vx
        e.flick += 0.05
        e.life += 1
        paint(e, 1)
        if (e.y < -20 || e.life > e.maxLife) embers[i] = spawn(false)
      })
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)

    if (reduce) {
      drawStill()
    } else {
      // pause when offscreen / tab hidden to save the main thread
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !raf) {
          running = true
          raf = requestAnimationFrame(tick)
        } else {
          running = false
          cancelAnimationFrame(raf)
          raf = null
        }
      })
      io.observe(canvas)
      return () => {
        io.disconnect()
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', resize)
      }
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [density])

  return (
    <canvas ref={canvasRef} className={`ember-field ${className}`} aria-hidden="true" />
  )
}
