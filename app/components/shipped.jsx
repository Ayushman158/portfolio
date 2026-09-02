'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useReducedMotion } from 'motion/react'
import ScrambleText from './scramble-text'

/**
 * Shipped client work, shown rather than listed.
 *
 * The hairline index below this is still the right way to name work in
 * passing, but it has two limits for the things that are actually live: the
 * image only appears on hover, so a phone visitor never sees one at all, and
 * a row of text cannot say "this is real, go and use it."
 *
 * The card is the agency pattern — a shot of the running site, the name with
 * its live domain opposite, one line of what it is, then the parts of the job
 * that were mine. Two links, not one: the shot and the name open the case
 * study, the domain opens the site. Nesting them would be invalid markup and
 * would also hide the more interesting of the two.
 */
export default function Shipped({ label = 'Shipped', items }) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="mt-16">
      {/* The label rides the track, not the measure: a heading that does not
          share a left edge with the thing it names reads as an accident. */}
      <h2 className="track-wide text-faint text-[0.95rem] mb-4">
        <ScrambleText>{label}</ScrambleText>
      </h2>

      <div className="track-wide grid gap-x-5 gap-y-10 sm:grid-cols-2">
        {items.map((p, i) => (
          /* One card, one hover response, two destinations. The shot and the
             name used to react separately — hovering the shot scaled it while
             the name sat still, hovering the name underlined it while the shot
             sat still — which read as two unrelated controls stacked up. */
          <article key={p.name} className="group">
            <Link
              href={p.href}
              aria-label={`${p.name} — read the case study`}
              className="block overflow-hidden rounded-xl"
              style={{ border: '1px solid var(--rule)', background: 'var(--raised)' }}
            >
              <Image
                src={p.shot}
                alt={p.alt}
                width={1600}
                height={900}
                sizes="(min-width: 60rem) 460px, (min-width: 640px) 50vw, 100vw"
                className={`aspect-video w-full object-cover object-top${
                  reduceMotion ? '' : ' transition-transform duration-500 ease-out group-hover:scale-[1.02]'
                }`}
              />
            </Link>

            <div className="mt-3 flex items-baseline justify-between gap-4">
              <Link
                href={p.href}
                className="text-muted transition-colors duration-150 ease-out group-hover:text-ink focus-visible:text-ink"
              >
                {p.name}
              </Link>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="prose-link shrink-0"
                style={{ fontSize: '0.9rem' }}
              >
                {/* The address is the "go and look" affordance, and a string of
                    characters resolving into a domain is the one place on the
                    page where the effect means something. */}
                <ScrambleText delay={140 + i * 90}>{p.site}</ScrambleText>
              </a>
            </div>

            <p className="text-faint mt-1" style={{ fontSize: '0.95rem' }}>{p.what}</p>

            <ul className="mt-3 flex flex-wrap gap-1.5 p-0">
              {p.tags.map((t) => (
                <li key={t} className="chip">{t}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
