# 001 — Hardware-accelerate the cursor-following work preview

- **Status**: TODO
- **Commit**: 23ec71a
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file, ~10 lines

## Problem

`app/components/work-index.jsx` renders the preview card that follows the cursor
while the visitor scans the work index. It is the one authored motion moment on
the home page, and it drives position and scale through Motion's shorthand
props.

```jsx
/* app/components/work-index.jsx:107-118 — current */
{showPreview && (
  <motion.div
    aria-hidden="true"
    className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
    style={{ x: sx, y: sy }}
    initial={false}
    animate={{
      opacity: activeItem?.media ? 1 : 0,
      scale: activeItem?.media ? 1 : 0.97,
    }}
    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
  >
```

Motion's `x`, `y` and `scale` shorthands are not hardware-accelerated. They are
applied from `requestAnimationFrame` on the main thread, so they drop frames
whenever the main thread is busy.

That is not hypothetical here. Hovering the Kizuku row mounts a `<video>` whose
source is `public/kizuku/tree-animation.mp4` at 4.1 MB with `preload="none"`, so
the fetch and decode begin at the same instant the preview starts moving. The
stutter lands on the first hover of the page's most deliberate interaction.

## Target

Position and scale both expressed as a full transform string, which Motion
passes to the compositor.

```jsx
/* target — app/components/work-index.jsx */
import { motion, useMotionValue, useSpring, useReducedMotion, useTransform } from 'motion/react'

// inside the component, after sx / sy are defined:
const previewScale = useMotionValue(0.97)
const transform = useTransform(
  [sx, sy, previewScale],
  ([x, y, s]) => `translate3d(${x}px, ${y}px, 0) scale(${s})`
)

// in the JSX:
<motion.div
  aria-hidden="true"
  className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
  style={{ transform }}
  initial={false}
  animate={{ opacity: activeItem?.media ? 1 : 0 }}
  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
>
```

`previewScale` is animated with a spring rather than through `animate`, so the
transform string stays the single source of truth for the element's transform:

```jsx
useEffect(() => {
  previewScale.set(activeItem?.media ? 1 : 0.97)
}, [activeItem, previewScale])
```

Wrap `previewScale` in `useSpring` with the same config already used for
position so the scale settles with the same physics:

```jsx
const previewScale = useSpring(0.97, { stiffness: 180, damping: 30, mass: 0.5 })
```

`opacity` stays in `animate` — it is a compositor property and is already
correct.

## Repo conventions to follow

- Motion is imported from `motion/react` (never `framer-motion`). See
  `app/components/work-index.jsx:5`.
- Spring configs in this file are `{ stiffness: 180, damping: 30, mass: 0.5 }`
  — `app/components/work-index.jsx:24-25`. Reuse those numbers exactly.
- Motion values are declared immediately after the `useReducedMotion()` call and
  before the `useEffect` block — `app/components/work-index.jsx:21-25`.
- `translate3d` with an explicit `0` z is the form to use; it forces a
  compositor layer.

## Steps

1. In `app/components/work-index.jsx`, add `useTransform` to the existing
   `motion/react` import on line 5.
2. After the existing `sx` / `sy` spring declarations (lines 24-25), add
   `const previewScale = useSpring(0.97, { stiffness: 180, damping: 30, mass: 0.5 })`.
3. Below the existing `useEffect` that watches the hover media query, add a
   `useEffect` that calls `previewScale.set(activeItem?.media ? 1 : 0.97)`,
   with `[activeItem, previewScale]` as its dependency array. `activeItem` is
   defined further down the component — move the `previewScale` effect below the
   `activeItem` declaration so it is in scope.
4. Add `const transform = useTransform([sx, sy, previewScale], ([x, y, s]) =>
   \`translate3d(${x}px, ${y}px, 0) scale(${s})\`)` after that effect.
5. Replace `style={{ x: sx, y: sy }}` on the `motion.div` with `style={{ transform }}`.
6. Remove `scale` from the `animate` object, leaving only `opacity`.

## Boundaries

- Do NOT touch any other file.
- Do NOT change the spring numbers, the 0.25s opacity duration, or the
  `[0.22, 1, 0.36, 1]` curve.
- Do NOT change the preview card's markup, size, aspect ratio or the `<video>`
  element.
- Do NOT re-encode or swap the video.
- Do NOT remove the `showPreview` gate — it is what keeps the preview off touch
  devices and off reduced-motion.
- If the code at these lines does not match the excerpt above, STOP and report.

## Verification

- **Mechanical**: `npx next build` from the repo root completes with
  `✓ Compiled successfully` and the `/` route still listed. Do not run this
  while `npm run dev` is running on the same checkout — a production build
  overwrites `.next/` under the dev server and makes routes return 500.
- **Feel check**: run `npm run dev`, open `/` on a desktop-width window, and:
  - Sweep the cursor across the Projects rows. The card should trail the pointer
    with the same easing lag as before this change — the fix is invisible when
    correct.
  - Hover the **Kizuku** row first, on a cold load, while the 4.1 MB video is
    still downloading. The card's travel must stay smooth during the fetch. This
    is the case the change exists for.
  - Open DevTools → Performance, record while sweeping the rows, and confirm the
    preview's transform appears on the compositor rather than as main-thread
    layout/paint work.
  - In DevTools → Rendering, enable "Emulate prefers-reduced-motion", reload,
    and confirm the preview does not render at all.
- **Done when**: no `x:`, `y:` or `scale:` shorthand remains on the preview
  `motion.div`, the transform is one `translate3d(...) scale(...)` string, and
  the card behaves identically to the eye.
