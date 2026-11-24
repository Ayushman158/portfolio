'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * The introduction under the homepage headline, edited in front of you. It shows in full, then a
 * pencil strikes through the supporting details, phrase by phrase, and a coloured marker
 * picks out the key points, as if he were editing his own bio. What's left
 * reads in a few seconds; hover (or tap) and the full text comes back.
 *
 * Each piece of text is one of:
 *   k  key phrase: gets the marker in colour c
 *   x  supporting detail: softens in blur mode
 *   (plain string) stays as it is
 * Pieces animate in reading order, one after another (STEP_MS apart).
 * The whole text stays in the page, so screen readers read all of it.
 * Reduced Motion: the edited state, without the strokes being drawn.
 */
const PARAS = [
  [
    'I’m pretty calm, and I get a little obsessive about ',
    { k: 'figuring out where people get stuck', c: 'blue' }, '.',
  ],
  [
    'Outside work, I ', { x: 'swim and ' }, 'still dream of playing ',
    { k: 'guitar in a rock band', c: 'yellow' }, '.',
  ],
]
const START_MS = 1600
const STEP_MS = 160

/*
 * mode: how the filler steps back once the edit runs.
 *   mark    it doesn't: the whole intro stays readable and only the key
 *           points get their coloured marker (in use since Nov 2026)
 *   strike  a pencil line through it, faded (the first version)
 *   blur    it softens out of focus, like Apple's focus effects; the key
 *           points stay sharp
 *   fold    it shrinks away to nothing and the key points close up into one
 *           short line; hover and the sentence unfolds again
 *   lens    it stays blurred, and a small clear lens follows the pointer and
 *           sharpens whatever it passes over: the "design lens", literally.
 *           (Phones: a tap brings everything into focus.)
 */
export default function EditedIntro({ skip = false, mode = 'strike', replay = 0, className = 'mt-6' }) {
  const [edited, setEdited] = useState(skip)
  const [reading, setReading] = useState(false)
  const box = useRef(null)

  useEffect(() => {
    if (skip) return undefined
    setEdited(false)
    const t = setTimeout(() => setEdited(true), START_MS)
    return () => clearTimeout(t)
  }, [skip, replay])

  // Lens: track the pointer inside the intro as --mx / --my for the mask.
  const onMove = mode === 'lens' ? (e) => {
    const r = box.current.getBoundingClientRect()
    box.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    box.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  } : undefined

  const render = (sharp) => {
    let n = 0
    return PARAS.map((para, p) => (
      <p key={p} className={p ? 'mt-3' : undefined}>
        {para.map((piece, i) => {
          if (typeof piece === 'string') return piece
          const style = { '--d': `${(n++) * STEP_MS}ms` }
          return piece.k
            ? <mark key={i} className="ed-key" data-c={piece.c} style={style}>{piece.k}</mark>
            : <span key={i} className={sharp ? undefined : 'ed-cut'} style={style}>{piece.x}</span>
        })}
      </p>
    ))
  }

  return (
    <div
      ref={box}
      className={`ed relative max-w-[34rem] ${className}`}
      data-mode={mode}
      data-edited={edited || undefined}
      data-reading={reading || undefined}
      onClick={() => setReading((r) => !r)}
      // Keyboard: tabbing onto the intro brings it all into focus too.
      tabIndex={0}
      onPointerMove={onMove}
    >
      {render(false)}
      {/* Lens: a sharp copy on top, shown only inside a circle at the pointer. */}
      {mode === 'lens' && <div className="ed-lens" aria-hidden="true">{render(true)}</div>}
    </div>
  )
}
