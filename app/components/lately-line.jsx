'use client'

import { useEffect, useState } from 'react'
import { lately } from '../../content/lately'

const MONTH = 30 * 24 * 60 * 60 * 1000

/** Worked out in the browser, so old entries drop off without a redeploy. */
export default function LatelyLine() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const now = Date.now()
    setItems(lately.filter((l) => now - new Date(l.date).getTime() <= MONTH).slice(0, 3))
  }, [])

  if (!items.length) return null
  return <p>Lately · {items.map((l) => l.text).join(' · ')}</p>
}
