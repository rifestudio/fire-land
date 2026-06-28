import { useSmoothScroll } from './lib/useSmoothScroll'
import CursorEmber from './components/CursorEmber'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Work from './components/Work'
import About from './components/About'
import Contact from './components/Contact'
import './styles/app.css'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <a className="skip-link" href="#work">
        Skip to work
      </a>
      <CursorEmber />
      <Nav />
      <main>
        <Hero />
        <Work />
        <About />
        <Contact />
      </main>
    </>
  )
}
