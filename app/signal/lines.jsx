'use client'

import { motion, useReducedMotion } from 'motion/react'

/*
 * Delhi Metro's line colours as the case study's graphic language. The
 * network is drawn as strands that leave one bundle and fan out, and the
 * example trip is drawn on the Yellow Line it really runs on.
 */

export const LINE = {
  red: 'var(--line-red)', yellow: 'var(--line-yellow)', blue: 'var(--line-blue)', green: 'var(--line-green)',
  violet: 'var(--line-violet)', magenta: 'var(--line-magenta)', pink: 'var(--line-pink)', grey: 'var(--line-grey)',
  orange: 'var(--line-orange)', aqua: 'var(--line-aqua)',
}
const ORDER = ['red', 'yellow', 'blue', 'green', 'violet', 'magenta', 'pink', 'grey', 'orange', 'aqua']
const EASE = [0.22, 1, 0.36, 1]

/* A short pill in a line's colour, above each section title. */
export const Pill = ({ line }) => (
  <span aria-hidden="true" className="mb-5 block h-[5px] w-10 rounded-full" style={{ background: LINE[line] }} />
)

/* Ten strands, bundled on the left, fanning out like a map of the network. */
export function Network({ className = '' }) {
  const reduce = useReducedMotion()
  return (
    <div className={className}>
      <svg viewBox="0 0 960 84" className="block h-auto w-full" aria-hidden="true" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {ORDER.map((name, i) => {
          const y0 = 22 + i * 4.5
          const y1 = 4 + i * 8.4
          const x1 = 300 + i * 30
          const d = `M2 ${y0} H${x1} L${x1 + Math.abs(y1 - y0)} ${y1} H958`
          return (
            <motion.path
              key={name}
              d={d}
              stroke={LINE[name]}
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 1.6, delay: i * 0.06, ease: EASE }}
            />
          )
        })}
      </svg>
    </div>
  )
}

/*
 * The example trip on the Yellow Line, Malviya Nagar to Rajiv Chowk. The fault
 * (Hauz Khas to Central Secretariat, DMRC 9:04, no time given) fades the line;
 * the backups leave from where the rider is and reach work on their own.
 */
const STOPS = [
  [40, 'Malviya Nagar'], [170, 'Hauz Khas', 'magenta'], [215], [260], [305, 'INA', 'pink'], [350], [395], [440],
  [500, 'Central Secretariat', 'violet'], [560], [640, 'Rajiv Chowk', 'blue'],
]
export function YellowLine() {
  const reduce = useReducedMotion()
  const draw = (delay) => ({
    initial: reduce ? false : { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: '-15% 0px' },
    transition: { duration: 1.2, delay, ease: EASE },
  })
  const y = 96
  return (
    <figure className="track-wide mt-10 overflow-x-auto pb-2">
      <svg viewBox="0 0 760 290" className="block w-full min-w-[620px]" role="img" aria-label="The example trip on the Yellow Line from Malviya Nagar to Rajiv Chowk. The stretch from Hauz Khas to Central Secretariat is delayed with no time given. Backups by road leave from Malviya Nagar and work until 9:31.">
        <g fill="none" strokeWidth="6" strokeLinecap="round">
          {STOPS.filter((s) => s[2]).map(([x, , c]) => (
            <path key={c} d={`M${x} ${y - 52} V${y + 52}`} stroke={LINE[c]} strokeOpacity="0.55" />
          ))}
          <motion.path d={`M40 ${y} H170`} stroke={LINE.yellow} {...draw(0)} />
          <motion.path d={`M170 ${y} H500`} stroke={LINE.yellow} strokeOpacity="0.3" strokeDasharray="2 12" {...draw(0.2)} />
          <motion.path d={`M500 ${y} H640`} stroke={LINE.yellow} {...draw(0.4)} />
          <path d={`M640 ${y} V${y + 100}`} stroke="var(--faint)" strokeWidth="3" strokeDasharray="1 8" />
          <motion.path d={`M40 ${y} V${y + 70} L110 ${y + 140} H600 L640 ${y + 100}`} stroke="var(--sig)" strokeWidth="5" strokeLinejoin="round" {...draw(0.7)} />
        </g>
        {STOPS.map(([x, name, c]) => (c || x === 40
          ? <circle key={x} cx={x} cy={y} r="8" fill="var(--ground)" stroke="var(--ink)" strokeWidth="3" />
          : <circle key={x} cx={x} cy={y} r="3.5" fill="var(--ground)" />))}
        <circle cx="640" cy={y + 100} r="8" fill="var(--ink)" />
        <g fill="var(--ink)" style={{ fontSize: 14 }}>
          {STOPS.filter((s) => s[1] && s[0] !== 40).map(([x, name]) => (
            <text key={name} x={x + 12} y={y - 14}>{name}</text>
          ))}
          <text x="54" y={y + 28} style={{ fontWeight: 600 }}>You</text>
          <text x="54" y={y + 46} fill="var(--faint)">Malviya Nagar</text>
        </g>
        <g style={{ fontSize: 14 }}>
          <text x="402" y={y + 30} textAnchor="middle" fill="var(--sig-late)">Delayed 9:04, no time given</text>
          <text x="355" y={y + 128} textAnchor="middle" fill="var(--sig)" style={{ fontWeight: 600 }}>Bike taxi or auto · works until 9:31*</text>
          <text x="656" y={y + 98} fill="var(--ink)" style={{ fontWeight: 600 }}>Work</text>
          <text x="656" y={y + 116} fill="var(--faint)">by 10:30</text>
        </g>
      </svg>
    </figure>
  )
}
