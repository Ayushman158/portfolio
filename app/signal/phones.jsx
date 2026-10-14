'use client'

import { ORANGE } from './visuals'

/**
 * The platform display at INA: the same answer as the app, for everyone
 * without it. Drawn in code; a size container, so it scales as one picture.
 */

const GREEN = '#1F8A5B'
const AMBER = '#C27C00'
const SANS = 'var(--font-inter), Inter, system-ui, sans-serif'
const MONO = "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace"

const mono = { fontFamily: MONO, fontSize: '2.9cqw', letterSpacing: '0.14em', textTransform: 'uppercase' }

const TRAINS = [
  ['9:16', [5, 5, 5, 5, 5, 4, 4, 4], 'Full'],
  ['9:19', [5, 4, 4, 3, 3, 2, 2, 2], 'Room at the back'],
]
const tone = (n) => (n >= 5 ? ORANGE : n >= 3 ? AMBER : GREEN)

/** The platform display at INA, for everyone without the app. */
export function PlatformScreen() {
  return (
    <figure className="track-wide">
      <div role="img" aria-label="Platform display at INA: the 9:16 is full; the 9:19 has room in coaches 6 to 8" className="rounded-xl p-[6px]" style={{ background: '#161616' }}>
        <div className="rounded-lg" style={{ background: '#0B0B0B', color: '#F2F2F2', fontFamily: SANS, containerType: 'inline-size', padding: '2.6cqw 3cqw' }}>
          <div className="flex items-baseline justify-between" style={{ ...mono, fontSize: '1.25cqw', color: '#9A9A9A' }}>
            <span>INA · Platform 2 · towards HUDA City Centre</span><span className="tnum">9:14</span>
          </div>
          <div style={{ marginTop: '2cqw' }}>
            {TRAINS.map(([time, coaches, what]) => (
              <div key={time} className="grid items-center" style={{ gridTemplateColumns: '8cqw 1fr 18cqw', gap: '2cqw', padding: '1.4cqw 0', borderTop: '1px solid #2A2A2A' }}>
                <span className="tnum" style={{ fontSize: '3.2cqw', fontWeight: 600 }}>{time}</span>
                <span className="flex" style={{ gap: '0.7cqw' }}>
                  {coaches.map((n, i) => (
                    <span key={i} className="flex flex-1 flex-col justify-end" style={{ height: '5cqw', borderRadius: '0.5cqw', background: '#1E1E1E', overflow: 'hidden' }}>
                      <span style={{ height: `${n * 20}%`, background: tone(n) }} />
                    </span>
                  ))}
                </span>
                <span style={{ fontSize: '2.1cqw', color: '#CFCFCF' }}>{what}</span>
              </div>
            ))}
          </div>
          <div className="flex items-baseline justify-between" style={{ marginTop: '1.6cqw', paddingTop: '1.6cqw', borderTop: '1px solid #2A2A2A' }}>
            <span style={{ fontSize: '3cqw', fontWeight: 700, color: ORANGE, letterSpacing: '-0.02em' }}>Coaches 6–8 have room on the 9:19.</span>
            <span style={{ ...mono, fontSize: '1.15cqw', color: '#9A9A9A' }}>Coach 1 · women</span>
          </div>
        </div>
      </div>
      <figcaption className="text-faint mt-2" style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
        The same answer on the platform display, for everyone without the app. Each bar is one coach, filled by its weight.
      </figcaption>
    </figure>
  )
}
