# Craft notes

Where the build differs from the craft plan, and why.

## Built
Section 11, Claude steps 1 to 4: 10.6 buttons, 10.8 voice, 10.3 figures, 10.4 route line, 10.1 palette and strip, 10.2 field notes, 10.5 people treatment, 10.7 lately line.

## Closest option taken
- **The Practice page and MADE do not exist.** Field notes sit at the end of /about. Home cards stay under "selected work".
- **`--accent-rgb`:** the plan's `rgba(var(--accent-rgb), 0.18)` is invalid with a space-separated value, so it is written `rgb(var(--accent-rgb) / 0.18)`.
- **Buttons:** added a 1px `#E9E4DC` outline so the pale face reads on white. Only the primary key has the accent shadow, so the pair keeps its ranking. The face stays light in dark mode.
- **Dark mode stays.** The accent is the same terracotta in both themes. Paper grain is off in light, so the page is pure white, and stays on in dark.
- **Link hover** now goes to ink, because accent text on white is about 4:1.
- **Field notes schema** gains `ratio`, which `next/image` needs to reserve the right space.
- **Hero strip** is centred in its own row at `clamp(96px, 11vw, 170px)` wide, because the hero's text and magnet leave no 25% clear space beside them. It pushes the work down by about 620px at 1440.
- **Figures:** 62% also applies to the Hoychoy and Kizuku screenshot rows, which go from five columns to three. BeforeAfter, annotated screens and page hero images stay full size. Koi, Banyan and /signal/v4 are unchanged.
- **Lowercase voice** covers interface labels: nav, buttons, back links and home and archive section labels. Prose and headings are unchanged.
- **Not on the voice list but built early:** a plain 404 and the away title, so their strings have a home. The away title is inert under Reduce Motion, as section 9 asks.

## Waiting on Ayushman
- `public/brand/sunset-palette.png` and `public/field-notes/sunset.jpg`. The hex values are unchecked until then.
- 6 to 10 photos and their lines in `content/field-notes.ts`.
- Three real entries in `content/lately.ts`.
- No portrait or team photo is on the site yet, so `.photo-people` is unused.

## Not started
Sections 2 to 9 apart from the items above, including the Geist Sans display type.
