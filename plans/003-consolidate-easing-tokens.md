# 003 — Give the JS motion a single easing source

- **Status**: TODO
- **Commit**: 23ec71a
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 6 files (1 new), ~12 lines

## Problem

The CSS side has named easing tokens:

```css
/* app/globals.css:25-27 — current */
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-smooth-out: cubic-bezier(0.22, 1, 0.36, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
```

Motion cannot read a CSS custom property as an easing, so every JS animation
hand-types the same arrays. There are five copies across four files:

```jsx
/* app/page.js:53 */               ease: [0.22, 1, 0.36, 1]
/* app/resume/page.js:47 */        ease: [0.22, 1, 0.36, 1]
/* app/experiments/page.js:24 */   ease: [0.22, 1, 0.36, 1]
/* app/components/work-index.jsx:117 */ ease: [0.22, 1, 0.36, 1]
/* app/components/letter-swap.jsx:28 */ ease: [0.23, 1, 0.32, 1]
```

They match the CSS tokens today. Nothing keeps them matching: retuning
`--ease-smooth-out` in `globals.css` silently leaves four JS copies on the old
curve, and the page's entrance motion drifts away from its own CSS transitions
with no error anywhere.

This is a maintainability finding, not a feel finding — the motion is correct as
it stands.

## Target

A tiny module exporting the same curves as arrays, imported everywhere JS
animates, with a comment binding it to the CSS.

```js
/* target — new file: app/components/easing.js */
/**
 * Motion cannot consume a CSS custom property as an easing, so these mirror the
 * tokens in app/globals.css:25-27. Change both together — they are one system.
 *
 *   --ease-out        cubic-bezier(0.23, 1, 0.32, 1)
 *   --ease-smooth-out cubic-bezier(0.22, 1, 0.36, 1)
 *   --ease-in-out     cubic-bezier(0.77, 0, 0.175, 1)
 */
export const EASE_OUT = [0.23, 1, 0.32, 1]
export const EASE_SMOOTH_OUT = [0.22, 1, 0.36, 1]
export const EASE_IN_OUT = [0.77, 0, 0.175, 1]
```

Every call site imports the named constant instead of a literal:

```jsx
/* target — app/page.js */
import { EASE_SMOOTH_OUT } from './components/easing'
// ...
transition: { duration: reduceMotion ? 0.2 : 0.5, delay: reduceMotion ? 0 : delay, ease: EASE_SMOOTH_OUT }
```

## Repo conventions to follow

- Shared components live flat in `app/components/` and are imported with
  relative paths — there is no `@/` alias configured in this project. From
  `app/page.js` the path is `./components/easing`; from
  `app/resume/page.js` and `app/experiments/page.js` it is `../components/easing`;
  from inside `app/components/` it is `./easing`.
- The project is plain JavaScript. Do NOT add TypeScript or a `.ts` file.
- `app/globals.css:25-35` is the exemplar for how this repo names motion tokens —
  mirror those names exactly (`ease-out`, `ease-smooth-out`, `ease-in-out`).

## Steps

1. Create `app/components/easing.js` with exactly the contents in Target above.
2. In `app/page.js`, add `import { EASE_SMOOTH_OUT } from './components/easing'`
   alongside the existing imports, and replace the `[0.22, 1, 0.36, 1]` literal
   on line 53 with `EASE_SMOOTH_OUT`.
3. In `app/resume/page.js`, add `import { EASE_SMOOTH_OUT } from '../components/easing'`
   and replace the literal on line 47.
4. In `app/experiments/page.js`, add `import { EASE_SMOOTH_OUT } from '../components/easing'`
   and replace the literal on line 24.
5. In `app/components/work-index.jsx`, add `import { EASE_SMOOTH_OUT } from './easing'`
   and replace the literal on line 117.
6. In `app/components/letter-swap.jsx`, add `import { EASE_OUT } from './easing'`
   and replace the `[0.23, 1, 0.32, 1]` literal in the default `transition` prop
   on line 28. Note this one is `EASE_OUT`, not `EASE_SMOOTH_OUT` — the values
   differ.
7. Delete the orphaned component `app/components/text-highlighter.jsx`. It was
   superseded by `app/components/gradient-text.jsx` and nothing imports it —
   confirm with `grep -rn "text-highlighter\|TextHighlighter" app/` returning
   only the file itself before deleting.

## Boundaries

- Do NOT change any numeric value. This is a move, not a retune — every curve
  must stay byte-identical.
- Do NOT touch `app/globals.css`.
- Do NOT convert spring configs (`{ type: 'spring', stiffness, damping }`) to
  use these constants — springs take no easing.
- Do NOT add a bundler alias or a `jsconfig.json`; use relative imports.
- Do NOT delete any component other than `text-highlighter.jsx`, and only after
  the grep confirms it is unreferenced.
- If a literal is not at the stated line, search the file for the array before
  giving up; if it is genuinely absent, STOP and report.

## Verification

- **Mechanical**:
  - `grep -rn "0\.22, 1, 0\.36, 1\|0\.23, 1, 0\.32, 1" app/ --include='*.js' --include='*.jsx'`
    returns only `app/components/easing.js`.
  - `grep -rn "TextHighlighter" app/` returns nothing.
  - `npx next build` completes with `✓ Compiled successfully` and all 5 routes
    listed (`/`, `/case-study`, `/experiments`, `/kizuku`, `/resume`). Do not run
    it while `npm run dev` is serving the same checkout.
- **Feel check**: run `npm run dev` and confirm nothing changed — this refactor
  is correct only if it is invisible:
  - `/` entrance: greeting, intro, index and Connect still rise in sequence.
  - Hover an index row: preview still eases in with the same lag.
  - `/resume` and `/experiments` still fade up on load.
- **Done when**: one module holds every curve, all five call sites import from
  it, the orphaned component is gone, and the motion is indistinguishable.
