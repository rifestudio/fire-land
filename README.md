# effect

A motion-driven personal portfolio for **effect** — a solo Product Engineer.

The idea: a simple, quiet layout carried almost entirely by motion and timing.
Restraint in layout, boldness in movement. A warm-white canvas that breathes,
with **fire** — red → orange → amber — dosed as the energy: an ember field, a
name that ignites, marks that catch (`>>>`), and a cursor that trails heat.

Inspired by the restraint and inertial feel of sites like exoape.com.

## Stack

- **React + Vite** — app shell and build
- **GSAP + ScrollTrigger** — the hero ignition and scroll-driven reveals
- **Framer Motion** — component-level entrance / micro-interactions
- **Lenis** — inertial smooth scroll, wired into GSAP's ticker
- Plain CSS with design tokens in `:root` (see `src/styles/tokens.css`)

## Develop

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Structure

```
src/
  styles/
    tokens.css         design tokens — the "fire" system
    global.css         reset, base, shared primitives, reduced-motion
    app.css            section rhythm + dark/light grounds
  lib/
    motion.js          reduced-motion / touch detection, word splitter
    useSmoothScroll.js Lenis ⇄ GSAP ScrollTrigger integration
  components/
    CursorEmber.jsx    signature: ember that trails the cursor
    EmberField.jsx     canvas of drifting sparks behind the dark grounds
    Nav.jsx            ground-aware nav (legible over dark + light)
    Hero.jsx           the orchestrated ignition — "effect" catches fire
    RevealText.jsx     reusable scroll-driven line-by-line title reveal
    Work.jsx           case cards; screens grayscale → ignite on hover
    About.jsx          short manifesto + stack
    Contact.jsx        the fiery finale + Telegram call
```

## Motion & accessibility

- `prefers-reduced-motion` is respected throughout: Lenis is skipped (native
  scroll), the ember field renders as a single still glow, the cursor ember is
  disabled, and all content is shown at its final state immediately.
- Motion is deliberately sparse — one or two moving elements per view — so the
  stillness makes it land.
- Visible keyboard focus, semantic headings, skip link, and color is never the
  only signal.

## Contact

Telegram — [@effeectt](https://t.me/effeectt)
