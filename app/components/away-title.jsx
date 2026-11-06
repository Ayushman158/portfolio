'use client'

import { useEffect } from 'react'

/** While the tab is in the background its title reads "gone swimming". */
export default function AwayTitle() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let title = null
    const onChange = () => {
      if (document.hidden) {
        title = document.title
        document.title = 'gone swimming'
      } else if (title !== null) {
        document.title = title
        title = null
      }
    }
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])
  return null
}
