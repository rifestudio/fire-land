import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { prefersReducedMotion } from '../lib/motion'
import './nav.css'

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  // which ground sits under the nav right now — drives text colour
  const [ground, setGround] = useState('dark')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // detect the section crossing the top band so nav text stays legible
    const sections = document.querySelectorAll('main > section')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setGround(e.target.classList.contains('section--dark') ? 'dark' : 'light')
          }
        })
      },
      { rootMargin: '-6% 0px -94% 0px', threshold: 0 },
    )
    sections.forEach((s) => io.observe(s))

    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  const reduce = prefersReducedMotion()
  const initial = reduce ? false : { y: -28, opacity: 0 }

  return (
    <motion.header
      className={`nav nav--${ground} ${scrolled ? 'is-scrolled' : ''}`}
      initial={initial}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    >
      <div className="nav__inner shell">
        <a href="#top" className="nav__brand" aria-label="effect — home">
          <span className="nav__brand-mark ignite" aria-hidden="true">
            &gt;&gt;&gt;
          </span>
          <span className="nav__brand-name">effect</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav__link">
              <span className="nav__link-text">{l.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  )
}
