# Animation plans

Produced by `improve-animations` against commit `23ec71a`.

The obvious violations were already absent at audit time: no `ease-in`, no
`transition: all`, no `scale(0)`, and `prefers-reduced-motion` is handled in all
14 files that animate. These plans are the layer below that.

| # | Title | Severity | Category | Files | Status |
| --- | --- | --- | --- | --- | --- |
| [001](001-hardware-accelerate-cursor-preview.md) | Hardware-accelerate the cursor-following work preview | HIGH | Performance | 1 | TODO |
| [002](002-make-letter-effects-interruptible.md) | Let the letter effects retrigger instead of blocking | MEDIUM | Interruptibility | 2 | TODO |
| [003](003-consolidate-easing-tokens.md) | Give the JS motion a single easing source | LOW | Cohesion & tokens | 6 | TODO |
| [004](004-animate-theme-toggle-state.md) | Animate the theme toggle's own state change | LOW | Missed opportunity | 2 | TODO |

## Recommended order

**001 → 002 → 004 → 003.**

001 and 002 are the two the visitor can actually feel, and they are the two that
touch the work index — the page's most deliberate interaction. Do them first and
in that order: both edit hover behaviour on the same rows, and landing the
performance fix first means the interruptibility work is judged against smooth
motion rather than against dropped frames.

004 is independent of everything else and can be done at any point.

003 last, deliberately. It is a pure refactor that touches five call sites
including `work-index.jsx`, so running it before 001 would force a rebase of that
file for no benefit. Running it last also means the refactor is verified against
motion that is already final.

## Dependencies

- **003 depends on 001** only by file contact: both edit
  `app/components/work-index.jsx`. If 003 runs first, expect a conflict on the
  `transition` object at line 117.
- 002 and 004 are independent of each other and of the rest.
- No plan depends on 002 or 004 completing.

## Not reported, on purpose

- **The 7s infinite gradient sweep** (`app/globals.css:208`) is constant motion
  above the fold, which the frequency table would normally flag. It was
  requested explicitly and is documented in commit `5475231`. Settled decision.
- **The first-load splash** (`app/components/splash.jsx`) is gated to once per
  session, which puts it in the "rare — can carry delight" band. Justified as
  built.
- **Editorial scroll reveals** at 400–600ms on `/kizuku` exceed the 300ms UI
  budget, but that budget covers operated UI. These are read, not operated.

## Known separate issue

`public/kizuku/tree-animation.mp4` is 4.1 MB at 2880×2880 for a short loop, and
it is fetched on first hover of the Kizuku row. Plan 001 keeps the preview smooth
*while* that download happens, but it does not make the download smaller.
Re-encoding needs ffmpeg, which was not installed on the audited machine; the
project handoff estimates roughly 0.15 MB is achievable. That is an asset task,
not an animation one, so it has no plan here.
