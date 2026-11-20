'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * The intro under the name, edited in front of you. It shows in full, then a
 * pencil strikes through the filler, phrase by phrase, and a coloured marker
 * picks out the key points, as if he were editing his own bio. What's left
 * reads in a few seconds; hover (or tap) and the full text comes back.
 *
 * Each piece of text is one of:
 *   k  key point: gets the marker, in colour c (one colour per idea, after
 *      bimanshu.com: blue for curiosity, green for the design lens, pink for
 *      sport, yellow for music)
 *   x  filler: struck through and faded
 *   (plain string) stays as it is
 * Pieces animate in reading order, one after another (STEP_MS apart).
 * The whole text stays in the page, so screen readers read all of it.
 * Reduced Motion: the edited state, without the strokes being drawn.
 */
const PARAS = [
  [
    'A designer who likes ', { k: 'figuring things out', c: 'blue' }, '. ',
    { x: 'I’m ' }, { k: 'always learning', c: 'blue' }, { x: ', and I keep my ' },
    { k: 'design specs on everywhere I go', c: 'green' }, { x: ', so the real world keeps handing me ' },
    { k: 'problems worth solving', c: 'green' }, { x: ', like metro signs or how a café takes its orders' }, '.',
  ],
  [
    { x: 'Off work, I ' }, { k: 'work out', c: 'pink' }, ', ', { k: 'swim', c: 'pink' },
    { x: ' and pick up ' }, { k: 'things I can’t do yet', c: 'blue' }, '. ',
    { x: 'I’ve always dreamt of being an ' }, { k: 'athlete', c: 'pink' },
    { x: ' and the ' }, { k: 'guitarist in a rock band', c: 'yellow' }, '. ',
    { x: 'Still working on both.' },
  ],
]
const START_MS = 1600 // after the name and photo have settled
const STEP_MS = 160

/*
 * mode: how the filler steps back once the edit runs.
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
      onPointerMove={onMove}
    >
      {render(false)}
      {/* Lens: a sharp copy on top, shown only inside a circle at the pointer. */}
      {mode === 'lens' && <div className="ed-lens" aria-hidden="true">{render(true)}</div>}
    </div>
  )
}
