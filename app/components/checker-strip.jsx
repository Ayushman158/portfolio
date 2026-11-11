'use client'

import { useEffect, useRef, useState } from 'react'
import PeekDog from './peek-dog'

/*
 * The checkered strip with the Exploration title under it. Hazel lives behind
 * the strip: her box stands on its top edge, lined up over the end of the
 * title, and clips her, so she rises from behind the strip right above the
 * word, nods, and sinks back.
 *
 *   as      'h1' on the Exploration page, 'h2' on the homepage
 *   aside   anything to the right of the title, like a "see everything" link
 */
export default function CheckerStrip({ as: Tag = 'h2', id, aside = null }) {
  const root = useRef(null)
  const title = useRef(null)
  const [summon, setSummon] = useState(0)

  // Line Hazel up with the end of the title, whatever size the title renders at.
  useEffect(() => {
    const set = () => {
      if (title.current && root.current) root.current.style.setProperty('--title-w', `${title.current.offsetWidth}px`)
    }
    set()
    const ro = new ResizeObserver(set)
    ro.observe(title.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={root} className="xh">
      <div className="xh__shelf">
        <span className="xh__peek"><PeekDog summon={summon} /></span>
        <div className="checker-strip__band" aria-hidden="true" />
        {/* Her hiding spot, tappable: the strip under her and the space she rises into. */}
        <button type="button" className="xh__find" aria-label="Find Hazel" onClick={() => setSummon((n) => n + 1)} />
      </div>
      <div className="xh__row">
        <Tag ref={title} id={id} className="display">Exploration</Tag>
        {aside && <span className="xh__aside">{aside}</span>}
      </div>
    </div>
  )
}
