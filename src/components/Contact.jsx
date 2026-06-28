import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import EmberField from './EmberField'
import RevealText from './RevealText'
import { prefersReducedMotion } from '../lib/motion'
import './contact.css'

const TELEGRAM = 'https://t.me/effeectt'

export default function Contact() {
  const root = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.contact__cta', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact__cta', start: 'top 88%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const year = 2026

  return (
    <section id="contact" className="section section--dark contact" ref={root}>
      <EmberField className="contact__embers" density={40} />
      <div className="contact__glow" aria-hidden="true" />

      <div className="shell contact__inner">
        <div className="section-eyebrow mark">
          <span className="ignite" aria-hidden="true">&gt;&gt;&gt;</span>
          <span className="idx">contact</span>
        </div>

        <RevealText
          as="h2"
          className="contact__headline display"
          text="Got something worth lighting up?"
          stagger={0.055}
        />

        <a className="contact__cta" href={TELEGRAM} target="_blank" rel="noreferrer" data-hot>
          <span className="contact__cta-mark ignite" aria-hidden="true">&gt;&gt;&gt;</span>
          <span className="contact__cta-text">Message me on Telegram</span>
          <span className="contact__cta-handle">@effeectt</span>
        </a>
      </div>

      <footer className="contact__footer shell">
        <span className="mark">effect · frontend developer</span>
        <span className="mark contact__footer-tg">
          <a href={TELEGRAM} target="_blank" rel="noreferrer">@effeectt</a>
        </span>
        <span className="mark">© {year}</span>
      </footer>
    </section>
  )
}
