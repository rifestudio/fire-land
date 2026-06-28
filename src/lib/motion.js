// Shared motion helpers — one source of truth for "should we move?"

/** True when the user (or their OS) asks for reduced motion. */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Coarse pointer / no hover — used to disable the cursor ember on touch. */
export function isTouch() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(hover: none), (pointer: coarse)').matches
}

/**
 * Split a string into word spans wrapped in line-masks so each can rise
 * out from under a clip. Avoids the paid GSAP SplitText plugin.
 * Returns the array of `.line-inner` nodes to animate.
 */
export function splitWords(el) {
  const text = el.textContent
  el.textContent = ''
  const inners = []
  text.split(/(\s+)/).forEach((token) => {
    if (token.trim() === '') {
      el.appendChild(document.createTextNode(token))
      return
    }
    const mask = document.createElement('span')
    mask.className = 'line-mask'
    mask.style.display = 'inline-block'
    const inner = document.createElement('span')
    inner.className = 'line-inner'
    inner.style.display = 'inline-block'
    inner.textContent = token
    mask.appendChild(inner)
    el.appendChild(mask)
    inners.push(inner)
  })
  return inners
}
