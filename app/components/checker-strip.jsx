'use client'

import { useEffect, useRef } from 'react'
import PeekDog from './peek-dog'

/*
 * The checkered strip with the Exploration title under it. Hazel lives behind
 * the strip: her box stands on its top edge, lined up over the end of the
 * title, and clips her, so she rises from behind the strip right above the
 * word, nods, and sinks back.
 *
 *   as      'h1' on the Exploration page, 'h2' on the homepage
 *   arrive  visit once shortly after the page opens (the Exploration page,
 *           where the title is on the first screen), instead of on scroll
 *   aside   anything to the right of the title, like a "see everything" link
 */
export default function CheckerStrip({ as: Tag = 'h2', id, arrive = false, aside = null }) {
  const root = useRef(null)
  const title = useRef(null)

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
        <span className="xh__peek"><PeekDog strip arrive={arrive} /></span>
        <div className="checker-strip__band" aria-hidden="true" />
      </div>
      <div className="xh__row">
        <Tag ref={title} id={id} className="display">Exploration</Tag>
        {aside && <span className="xh__aside">{aside}</span>}
      </div>
    </div>
  )
}
