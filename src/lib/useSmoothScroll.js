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
    if (prefersReducedMotion()) {
      ScrollTrigger.refresh()
      return
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // anchor links route through Lenis for a smooth glide
    const onClick = (e) => {
      const link = e.target.closest('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')
      if (id.length < 2) return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: 0, duration: 1.3 })
    }
    document.addEventListener('click', onClick)

    ScrollTrigger.refresh()

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])
}
