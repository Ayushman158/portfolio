import Link from 'next/link'

export const metadata = {
  title: 'Kizuku — the full creative process',
  description:
    'The two-week process behind Kizuku: the painting that became the brief, the naming, the competitive analysis and all eighteen illustrations.',
}

// The process deck, rasterised from the 37 MB Figma PDF and sliced into nine
// tiles (2.1 MB total). The tiles butt together with no gap, border or radius,
// so they reconstruct the original page pixel-for-pixel; only the first loads
// eagerly, the rest as they are scrolled to. p08 is the short final tile.
const TILES = Array.from({ length: 9 }, (_, i) => ({
  src: `/kizuku/process/p${String(i).padStart(2, '0')}.jpg`,
  h: i === 8 ? 2358 : 3600,
}))

export default function KizukuProcess() {
  return (
    <main className="min-h-screen pb-40 pt-20 sm:pt-28 lg:pt-36">
      <header className="measure space-y-5">
        <Link href="/kizuku" className="prose-link text-[0.95rem]">← Kizuku</Link>
        <h1 style={{ color: 'var(--ink)', fontSize: '2rem', lineHeight: 1.2, fontWeight: 500, letterSpacing: '-0.02em' }}>
          The full process.
        </h1>
        <p>
          Two weeks, from the painting that became the brief to all eighteen illustrations — the
          naming, the competitive analysis, and the four stages that led to the build. It used to be a
          37&nbsp;MB PDF; this is the same deck at a tenth the weight.
        </p>
      </header>

      {/* One continuous document. No gap or border between tiles, so the seams
          are invisible; the column is wider than the reading measure because a
          deck is not prose. */}
      <div className="mx-auto mt-10 w-full max-w-[880px] px-4 sm:px-6">
        {TILES.map((t, i) => (
          <img
            key={t.src}
            src={t.src}
            alt={i === 0 ? 'Kizuku creative process journal' : ''}
            width={1921}
            height={t.h}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="block w-full h-auto"
          />
        ))}
      </div>

      <div className="measure mt-12">
        <p>
          Back to <Link href="/kizuku" className="prose-link">Kizuku</Link>, or{' '}
          <Link href="/#work" className="prose-link">the work index</Link>.
        </p>
      </div>
    </main>
  )
}
