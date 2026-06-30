import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './motion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Inertial scroll (Lenis) wired into GSAP's ticker so ScrollTrigger and
 * Lenis share one clock — the "expensive" feel without scroll-jank.
 * When the user prefers reduced motion we skip Lenis entirely and let the
 * browser scroll natively; ScrollTrigger still fires reveals on its own.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const reduce = prefersReducedMotion()

    let lenis = null
    let raf = null
    if (!reduce) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
      })
      lenis.on('scroll', ScrollTrigger.update)
      raf = (time) => lenis.raf(time * 1000)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)
    }

    // anchor links route through Lenis for a smooth glide
    const onClick = (e) => {
      const link = e.target.closest('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')
      if (id.length < 2) return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      // the finale is a fixed section behind the page — it has no scroll
      // position, so route its link to the bottom of the page, which reveals it
      if (getComputedStyle(target).position === 'fixed') {
        const bottom = document.documentElement.scrollHeight
        if (lenis) lenis.scrollTo(bottom, { duration: 1.3 })
        else window.scrollTo({ top: bottom, behavior: 'smooth' })
      } else if (lenis) {
        lenis.scrollTo(target, { offset: 0, duration: 1.3 })
      } else {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
    document.addEventListener('click', onClick)

    // While the tab is hidden, rAF/Lenis pause and the layout can shift in the
    // background (fonts, late media, the fixed finale's height). ScrollTrigger
    // caches each trigger's start/end against the old layout, so on return the
    // scrub parallax lands at a stale value ("too parallaxed"). Recompute when
    // the page becomes visible again.
    const onVisible = () => {
      if (document.visibilityState === 'visible') ScrollTrigger.refresh()
    }
    document.addEventListener('visibilitychange', onVisible)

    ScrollTrigger.refresh()

    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('visibilitychange', onVisible)
      if (raf) gsap.ticker.remove(raf)
      if (lenis) lenis.destroy()
    }
  }, [])
}
