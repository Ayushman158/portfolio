# 002 — Let the letter effects retrigger instead of blocking

- **Status**: TODO
- **Commit**: 23ec71a
- **Severity**: MEDIUM
- **Category**: Interruptibility
- **Estimated scope**: 2 files, ~15 lines

## Problem

Both letter components refuse to start while a previous pass is still running.

```jsx
/* app/components/letter-3d-swap.jsx:121 — current */
const handleHoverStart = useCallback(async () => {
  if (isAnimating || reduceMotion) return
  setIsAnimating(true)
```

```jsx
/* app/components/letter-swap.jsx:40 — current */
const onHover = useCallback(() => {
  if (busy || reduceMotion) return
  setBusy(true)
```

`Letter3DSwap` is mounted on every row of the work index
(`app/components/work-index.jsx:59`) and `LetterSwap` on the name in the intro
(`app/page.js`). Hover is the trigger, and hover on a vertical list is one of the
most rapidly repeated interactions on the page.

The 3D swap takes roughly 380ms to complete for a short word — a spring at
`{ stiffness: 300, damping: 30 }` plus a 30ms per-character stagger. Sweeping the
cursor down Kizuku → Hoychoy Cafe → FieldNote in under that window animates the
first row and silently swallows the second and third. The visitor sees an effect
that works sometimes, which reads worse than no effect at all.

AUDIT §4: anything triggered rapidly or reversible mid-motion must retarget from
its current state rather than block. The blocking flag is inherited from the
upstream fancycomponents source; it is not a decision this repo made.

## Target

Each component tracks its running animation *per element* and restarts that
element's animation from wherever it currently is, instead of dropping the
trigger. Motion's `animate()` already retargets a running animation on the same
element, so the fix is to stop refusing the call.

```jsx
/* target — app/components/letter-3d-swap.jsx */
const handleHoverStart = useCallback(async () => {
  if (reduceMotion) return

  const total = words.reduce((sum, w) => sum + w.characters.length, 0)
  const delays = Array.from({ length: total }, (_, i) => staggerDelay(i, total))

  // Reset instantly, then run. Motion retargets a running animation on the same
  // element, so a hover during a previous pass picks up from the current angle
  // rather than being dropped.
  await animate('.letter-3d-swap-char-box-item', { transform: 'rotateX(0deg) rotateY(0deg)' }, { duration: 0 })
  await animate(
    '.letter-3d-swap-char-box-item',
    { transform: ROTATION[rotateDirection] ?? ROTATION.right },
    { ...transition, delay: (i) => delays[i] }
  )
  await animate('.letter-3d-swap-char-box-item', { transform: 'rotateX(0deg) rotateY(0deg)' }, { duration: 0 })
}, [reduceMotion, words, transition, staggerDelay, rotateDirection, animate])
```

`isAnimating` state and its `useState` are deleted — nothing else reads them.

```jsx
/* target — app/components/letter-swap.jsx */
const onHover = useCallback(() => {
  if (reduceMotion) return

  const delay = stagger(staggerDuration, { from: staggerFrom })
  const out = reverse ? '100%' : '-100%'
  const from = reverse ? '-100%' : '100%'

  Promise.all([
    animate('.ls-primary', { transform: 'translateY(0%)' }, { duration: 0 }),
    animate('.ls-secondary', { transform: `translateY(${from})` }, { duration: 0 }),
  ]).then(() =>
    Promise.all([
      animate('.ls-primary', { transform: `translateY(${out})` }, { ...transition, delay }),
      animate('.ls-secondary', { transform: 'translateY(0%)' }, { ...transition, delay }),
    ]).then(() =>
      Promise.all([
        animate('.ls-primary', { transform: 'translateY(0%)' }, { duration: 0 }),
        animate('.ls-secondary', { transform: `translateY(${from})` }, { duration: 0 }),
      ])
    )
  )
}, [reduceMotion, animate, transition, staggerDuration, staggerFrom, reverse])
```

`busy` state and its `useState` are deleted.

## Repo conventions to follow

- Both files already import from `motion/react` and use `useAnimate()` returning
  `[scope, animate]` — `app/components/letter-swap.jsx:4,32`.
- `reduceMotion` comes from `useReducedMotion()` and gates by early return
  before any animation call — `app/components/letter-swap.jsx:35,40`.
- Both components already render plain text when `reduceMotion` is true, before
  the animated branch — `app/components/letter-swap.jsx:58-60`. Leave that.
- The `underline` in `app/globals.css:158-180` is the exemplar for how this repo
  wants rapidly-triggered hover motion to behave: a CSS transition that retargets
  mid-sweep. These two components should feel the same way.

## Steps

1. In `app/components/letter-3d-swap.jsx`, delete the
   `const [isAnimating, setIsAnimating] = useState(false)` declaration (line 95).
2. In the same file, replace the body of `handleHoverStart` with the target above:
   drop the `isAnimating` guard and the two `setIsAnimating` calls, and prepend
   the instant reset before the staggered rotation.
3. Update the `useCallback` dependency array to remove `isAnimating`.
4. Remove `useState` from the React import on line 3 if nothing else in the file
   uses it.
5. In `app/components/letter-swap.jsx`, delete
   `const [busy, setBusy] = useState(false)` (line 33).
6. Replace the body of `onHover` with the target above: drop the `busy` guard and
   both `setBusy` calls, and prepend the instant reset pair.
7. Update the `useCallback` dependency array to remove `busy`.
8. Remove `useState` from the React import on line 3 if nothing else uses it.

## Boundaries

- Do NOT touch `app/components/work-index.jsx`, `app/page.js`, or any other file.
- Do NOT change the spring configs, the stagger durations (`0.03` in
  work-index's usage, `0.025` default in letter-swap), or the rotation direction.
- Do NOT change the markup, the `sr-only` copies, the `aria-hidden` attributes,
  or the `user-select: none` on the duplicated glyphs — those carry the
  accessibility and copy-paste behaviour.
- Do NOT remove the `reduceMotion` early returns.
- Do NOT convert these to CSS. The per-character stagger needs JS here.
- If the code at these lines does not match the excerpts above, STOP and report.

## Verification

- **Mechanical**: `npx next build` completes with `✓ Compiled successfully`.
  Do not run it while `npm run dev` is serving the same checkout.
- **Feel check**: run `npm run dev`, open `/` on a desktop-width window, and:
  - Sweep the cursor down the three index rows in under half a second. **Every**
    row's letters must animate. Before this change only the first did — that is
    the regression being fixed, and it is the primary check.
  - Re-hover a single row repeatedly, faster than the animation completes. The
    letters must pick up from their current angle, never snap back to flat and
    restart.
  - Hover the name "Ayushman" in the intro repeatedly and confirm the same.
  - In DevTools → Animations, set playback speed to 10%, then hover a row twice
    in quick succession. Confirm the second hover retargets the in-flight
    rotation rather than queueing behind it.
  - In DevTools → Rendering, enable "Emulate prefers-reduced-motion", reload, and
    confirm both components render plain text with no letter boxes at all.
- **Done when**: no `isAnimating` or `busy` state remains in either file, and a
  fast sweep across all three index rows animates all three.
