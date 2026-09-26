'use client'

/*
 * A card grows into its case study, and shrinks back into its card.
 *
 * Both directions are one View Transition around a client-side navigation.
 * The element leaving and the element arriving are given the same
 * view-transition-name for the length of the transition only, so the browser
 * morphs one into the other while the rest of the page cross-fades. Nothing
 * carries the name at rest, which keeps these images out of the theme switch's
 * reveal.
 *
 *   open    card media  ──▶  the case study's [data-case-hero]
 *   back    [data-case-hero]  ──▶  the card, at the scroll position it was left at
 *
 * Without View Transitions, with reduced motion, or on a modified click, the
 * links behave as ordinary links.
 */

const NAME = 'case-hero'
const RETURN_KEY = 'case-return'

const canTransition = (e) =>
  typeof document !== 'undefined' &&
  !!document.startViewTransition &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  !(e && (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey))

// Resolve once the new page has rendered what we need, or after a second
// regardless, so a slow page can never hold the old frame on screen. Polled on
// a timer, not animation frames: while a view transition waits on its update,
// the page is not rendering, so frame callbacks may never arrive.
function whenReady(test, done) {
  const start = performance.now()
  const tick = () => {
    const el = test()
    if (el || performance.now() - start > 1000) done(el || null)
    else setTimeout(tick, 16)
  }
  setTimeout(tick, 16)
}

function run(from, navigate, findTarget, after) {
  from.style.viewTransitionName = NAME
  let to = null
  const vt = document.startViewTransition(
    () =>
      new Promise((resolve) => {
        from.style.viewTransitionName = ''
        navigate()
        whenReady(findTarget, (el) => {
          to = el
          after?.()
          if (to) to.style.viewTransitionName = NAME
          resolve()
        })
      }),
  )
  vt.finished.finally(() => { if (to) to.style.viewTransitionName = '' })
}

/** On a card's media link: grow into the case study. */
export function openCase(e, router, href) {
  if (!canTransition(e)) return
  e.preventDefault()
  try { sessionStorage.setItem(RETURN_KEY, JSON.stringify({ href, y: window.scrollY })) } catch {}
  run(
    e.currentTarget,
    () => router.push(href),
    () => (location.pathname === href ? document.querySelector('[data-case-hero]') : null),
  )
}

/** On a case study's back link: shrink back into the card it came from. */
export function backToCard(e, router) {
  let ret = null
  try { ret = JSON.parse(sessionStorage.getItem(RETURN_KEY) || 'null') } catch {}
  const hero = typeof document !== 'undefined' && document.querySelector('[data-case-hero]')
  if (!ret || ret.href !== location.pathname || !hero || !canTransition(e)) return
  e.preventDefault()
  // Home renders already risen, so the card is there to land in.
  window.__caseReturn = true
  run(
    hero,
    () => router.push('/', { scroll: false }),
    () => (location.pathname === '/' ? document.querySelector(`[data-case-card="${ret.href}"]`) : null),
    () => window.scrollTo({ top: ret.y, behavior: 'instant' }),
  )
}
