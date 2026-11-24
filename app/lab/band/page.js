'use client'

import { DialRoot, useDialKit } from 'dialkit'
import 'dialkit/styles.css'
import CheckerStrip from '../../components/checker-strip'
import ExplorationBand, { BAND } from '../../components/exploration-band'

/*
 * Tuning page for the Exploration band: the homepage section as it would
 * look, with live dials (DialKit, top right). "Copy values" puts the tuned
 * numbers on the clipboard, ready to paste over BAND in exploration-band.jsx.
 */
export default function BandLab() {
  const tune = useDialKit('Exploration band', {
    speed: [BAND.speed, 0, 120],
    width: [BAND.width, 180, 640],
    gap: [BAND.gap, 0, 120],
    radius: [BAND.radius, 0, 40],
    lens: {
      start: [BAND.lens.start, 0, 0.95],
      curve: [BAND.lens.curve, 0, 1.5],
      stretch: [BAND.lens.stretch, 0, 1.5],
      split: [BAND.lens.split, 0, 0.3],
      smear: [BAND.lens.smear, 0, 40],
      fade: [BAND.lens.fade, 0, 1],
    },
    dissolve: [BAND.dissolve, 0, 40],
    glow: [BAND.glow, 0, 0.5],
    coast: [BAND.coast, 0, 2],
    caption: {
      offset: [BAND.caption.offset, 0, 60],
      follow: [BAND.caption.follow, 0, 0.5],
      text: { type: 'select', options: ['name', 'view'], default: BAND.caption.text },
    },
    copy: { type: 'action', label: 'Copy values' },
  }, {
    onAction: (a) => {
      if (a !== 'copy') return
      const { copy, ...values } = tune
      navigator.clipboard?.writeText(JSON.stringify(values, null, 2))
    },
  })

  return (
    <main className="pt-28 pb-40">
      <div className="track-wide">
        <section aria-labelledby="lab-craft">
          <CheckerStrip id="lab-craft" />
          <ExplorationBand only={['Seat View', 'Koi Wishing Pond', 'Gradient exploration', 'ALBUM//ALIVE', 'Gone or Still Here?', 'Choose Assam', 'Banyan Tree']} tune={tune} />
        </section>
      </div>
      <DialRoot position="top-right" />
    </main>
  )
}
