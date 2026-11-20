'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * Contact sheets: the Signal detail packed into small frames, so the short
 * page keeps its length. Each frame opens large in a viewer with its full
 * caption, and the viewer pages through the frame's set.
 *
 *   frames   [{ src, w, h, alt, label, note, cap, fit, slides }]
 *              label  bold first line under the thumbnail
 *              note   the second line (a question, or one sentence)
 *              cap    the longer caption, shown only in the viewer
 *              fit    'contain' for very wide or tall artwork, so the whole
 *                     sign shows on a dark mat instead of being cropped
 *              slides optional: the set this frame opens (each slide has
 *                     src, w, h, alt, cap). Without it, the viewer pages
 *                     through every frame on the sheet.
 *   cols     columns on a wide screen (phones always get two)
 *   aspect   the thumbnail shape, e.g. '4 / 3'
 *   justify  true for justified rows: every thumbnail keeps its own shape (no
 *            cropping), the frames in a row share one height and their widths
 *            follow their shapes, so both edges of the row stay straight.
 *            `cols` frames per row; `aspect` is ignored. On a phone the rows
 *            wrap two to a line.
 *
 * The viewer is a native <dialog>: it traps focus, closes on Esc and hands
 * focus back to the frame that opened it. Arrow keys page through the set.
 */
export default function Sheet({ frames, cols = 4, aspect = '4 / 3', justify = false, className = 'mt-12' }) {
  const dialog = useRef(null)
  const [open, setOpen] = useState(null) // { slides, i }

  const slidesFor = (n) => frames[n].slides || frames.map((f) => ({ src: f.src, w: f.w, h: f.h, alt: f.alt, label: f.label, cap: f.cap || f.note }))
  const show = (n) => {
    setOpen({ slides: slidesFor(n), i: frames[n].slides ? 0 : n })
    dialog.current.showModal()
  }
  const close = () => dialog.current.close()
  const go = (d) => setOpen((o) => (o ? { ...o, i: (o.i + d + o.slides.length) % o.slides.length } : o))

  useEffect(() => {
    const el = dialog.current
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    const onClose = () => setOpen(null)
    el.addEventListener('keydown', onKey)
    el.addEventListener('close', onClose)
    return () => { el.removeEventListener('keydown', onKey); el.removeEventListener('close', onClose) }
  }, [])

  // One frame: the thumbnail button with its label and note.
  const frame = (f, n, shape) => (
    <button type="button" className="sheet__frame" onClick={() => show(n)} aria-label={`${f.label}: open large${f.slides ? `, ${f.slides.length} images` : ''}`}>
      <span className="sheet__thumb" data-fit={(!justify && f.fit) || undefined} style={{ aspectRatio: shape }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={f.src} width={f.w} height={f.h} alt={f.alt} loading="lazy" style={!justify && f.pos ? { objectPosition: f.pos } : undefined} />
        {f.slides && f.slides.length > 1 && <span className="sheet__count">{f.slides.length}</span>}
      </span>
      <span className="sheet__label">{f.label}</span>
      {f.note && <span className="sheet__note">{f.note}</span>}
    </button>
  )

  const slide = open && open.slides[open.i]
  const many = open && open.slides.length > 1

  return (
    <>
      {justify ? (
        <div className={`track-wide sheet-rows ${className}`}>
          {Array.from({ length: Math.ceil(frames.length / cols) }, (_, r) => (
            <ul key={r} className="sheet-row">
              {frames.slice(r * cols, r * cols + cols).map((f, k) => {
                const n = r * cols + k
                // A frame's share of the row is its width-to-height ratio.
                return <li key={f.label} style={{ flexGrow: f.w / f.h }}>{frame(f, n, `${f.w} / ${f.h}`)}</li>
              })}
            </ul>
          ))}
        </div>
      ) : (
        <ul className={`track-wide sheet ${className}`} style={{ '--cols': cols }}>
          {frames.map((f, n) => <li key={f.label}>{frame(f, n, aspect)}</li>)}
        </ul>
      )}

      {/* Click on the dark backdrop (the dialog itself, not its content) closes it. */}
      <dialog ref={dialog} className="sheet-view" onClick={(e) => { if (e.target === dialog.current) close() }} aria-label={slide ? slide.label || slide.alt : 'Image viewer'}>
        {slide && (
          <div className="sheet-view__body">
            <figure className="m-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={slide.src} src={slide.src} width={slide.w} height={slide.h} alt={slide.alt} className="sheet-view__img" />
              <figcaption className="sheet-view__cap">
                {slide.label && <span className="block text-[#F3EEE6]">{slide.label}</span>}
                {slide.cap && <span className="block mt-1">{slide.cap}</span>}
              </figcaption>
            </figure>
            <div className="sheet-view__bar">
              {many ? (
                <>
                  <button type="button" onClick={() => go(-1)} aria-label="Previous image">←</button>
                  <span className="tnum" aria-live="polite">{open.i + 1} / {open.slides.length}</span>
                  <button type="button" onClick={() => go(1)} aria-label="Next image">→</button>
                </>
              ) : <span />}
              <button type="button" onClick={close} className="sheet-view__close" aria-label="Close" autoFocus>close</button>
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
