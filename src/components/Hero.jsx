import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import EmberField from './EmberField'
import { prefersReducedMotion } from '../lib/motion'
import './hero.css'

const NAME = 'effect'

export default function Hero() {
  const root = useRef(null)
  const glow = useRef(null)

  useLayoutEffect(() => {
    const reduce = prefersReducedMotion()
    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray('.hero__letter-inner')
      const lines = gsap.utils.toArray('.hero__rise')

      if (reduce) {
        gsap.set([letters, lines], { yPercent: 0, opacity: 1 })
        gsap.set(letters, { backgroundPosition: '50% 40%' })
        gsap.set(glow.current, { opacity: 0.6, scale: 1 })
        return
      }

      // explicit start states — GSAP must own the transform up front, or a
      // .to() from a CSS-only transform leaves yPercent unanimated.
      gsap.set(letters, { yPercent: 110, backgroundPosition: '50% 100%' })
      gsap.set(lines, { yPercent: 110, opacity: 0 })

      // --- the orchestrated ignition -----------------------------------
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      tl.fromTo(
        glow.current,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 1.6, ease: 'power2.out' },
        0,
      )
        // letters rise out from under their masks, staggered like titles,
        // while the flame catches and licks upward through each glyph
        .to(
          letters,
          { yPercent: 0, duration: 1.1, stagger: 0.07 },
          0.15,
        )
        .to(
          letters,
          {
            backgroundPosition: '50% 40%',
            duration: 1.2,
            ease: 'power2.inOut',
            stagger: 0.06,
          },
          0.45,
        )
        // slogan + meta rise after the name lands
        .to(lines, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 0.8)
        .from('.hero__cue', { opacity: 0, y: 14, duration: 0.6 }, 1.3)

      // --- parallax: the glow + name drift as you scroll away ----------
      gsap.to(glow.current, {
        yPercent: 30,
        scale: 1.25,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      gsap.to('.hero__name', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section id="top" className="hero section--dark" ref={root}>
      <EmberField className="hero__embers" density={64} />
      <div className="hero__glow" ref={glow} aria-hidden="true" />

      <div className="hero__inner shell">
        <p className="hero__eyebrow mark hero__rise">
          <span className="ignite" aria-hidden="true">
            &gt;&gt;&gt;
          </span>
          frontend developer · solo
        </p>

        <h1 className="hero__name display" aria-label={NAME}>
          {NAME.split('').map((ch, i) => (
            <span className="hero__letter" key={i} aria-hidden="true">
              <span className="hero__letter-inner">{ch}</span>
            </span>
          ))}
        </h1>

        <p className="hero__slogan">
          <span className="line-mask">
            <span className="line-inner hero__rise">I build interfaces with weight,</span>
          </span>
          <span className="line-mask">
            <span className="line-inner hero__rise">
              restraint, and the occasional <em className="firetext">spark</em>.
            </span>
          </span>
        </p>
      </div>

      <a href="#work" className="hero__cue" aria-label="Scroll to work">
        <span className="hero__cue-label mark">scroll</span>
        <span className="hero__cue-line" aria-hidden="true" />
      </a>
    </section>
  )
}
