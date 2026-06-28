import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { splitWords, prefersReducedMotion } from '../lib/motion'

/**
 * Scroll-driven title reveal: words rise line-by-line out from under a mask
 * as the element enters view — the "titles igniting" motif. Renders as the
 * tag you pass (default h2). Reduced motion → words simply present, no rise.
 */
export default function RevealText({ as: Tag = 'h2', text, className = '', stagger = 0.08 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const inners = splitWords(el)
    const reduce = prefersReducedMotion()

    if (reduce) {
      gsap.set(inners, { yPercent: 0 })
      return
    }

    gsap.set(inners, { yPercent: 110 })
    const tween = gsap.to(inners, {
      yPercent: 0,
      duration: 1,
      ease: 'power4.out',
      stagger,
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [text, stagger])

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  )
}
