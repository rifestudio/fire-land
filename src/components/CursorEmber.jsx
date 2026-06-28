import { useEffect, useRef } from 'react'
import { prefersReducedMotion, isTouch } from '../lib/motion'
import './cursor-ember.css'

/**
 * Signature element #1 — a soft ember of heat that trails the cursor.
 * Lerped toward the pointer so it lags like real inertia, and it flares
 * (grows + brightens) over anything interactive. Off on touch / reduced-motion.
 *
 * The node is always rendered (so the ref is live before the effect runs);
 * it stays invisible until the first pointer move adds `is-live`.
 */
export default function CursorEmber() {
  const ref = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion() || isTouch()) return

    const el = ref.current
    if (!el) return

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const target = { ...pos }
    let scale = 1
    let targetScale = 1
    let raf
    let live = false

    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!live) {
        live = true
        el.classList.add('is-live')
      }
      const hot = e.target.closest('a, button, [data-hot]')
      targetScale = hot ? 2.1 : 1
    }
    const onDown = () => (targetScale *= 0.7)
    const onUp = () => (targetScale = 1)

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.14
      pos.y += (target.y - pos.y) * 0.14
      scale += (targetScale - scale) * 0.12
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale})`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return <div ref={ref} className="cursor-ember" aria-hidden="true" />
}
