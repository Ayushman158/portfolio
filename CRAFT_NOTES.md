# Craft notes

Where the build differs from the craft plan, and why.

## Built
10.6 buttons, 10.8 voice, 10.3 figures, the 10.1 palette tokens, and a status bar in place of the 10.4 route line.

## Removed at Ayushman's request (2026-11-06)
The hero gradient strip, the footer lines (`palette from a sunset, Assam` and the lately line) and field notes. The `.photo-people` utility and the TypeScript setup went with them, as nothing else used them.

## Closest option taken
- **The Practice page and MADE do not exist.** Home cards stay under "selected work".
- **`--accent-rgb`:** the plan's `rgba(var(--accent-rgb), 0.18)` is invalid with a space-separated value, so it is written `rgb(var(--accent-rgb) / 0.18)`.
- **Buttons:** added a 1px `#E9E4DC` outline so the pale face reads on white. Only the primary key has the accent shadow, so the pair keeps its ranking. The face stays light in dark mode.
- **Dark mode stays.** The accent is the same terracotta in both themes. Paper grain is off in light, so the page is pure white, and stays on in dark.
- **Link hover** now goes to ink, because accent text on white is about 4:1.
- **Figures:** 62% also applies to the Hoychoy and Kizuku screenshot rows, which go from five columns to three. BeforeAfter, annotated screens and page hero images stay full size. Koi, Banyan and /signal/v4 are unchanged.
- **Lowercase voice** covers interface labels: nav, buttons, back links and home and archive section labels. Prose and headings are unchanged.
- **Not on the voice list but built early:** a plain 404 and the away title, so their strings have a home. The away title is inert under Reduce Motion, as section 9 asks.

- **Status bar replaces the route line.** Ayushman asked for a tuner-style status bar in the nav, inspired by vansita.design. Two position indicators would repeat each other, so 10.4's left-edge line is gone. It uses a passive scroll listener, because a needle has to follow the scroll continuously.

## Waiting on Ayushman
- The sunset palette image. The hex values are unchecked until then.

## Not started
Sections 2 to 9 apart from the items above, including the Geist Sans display type.
