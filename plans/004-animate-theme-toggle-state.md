# 004 — Animate the theme toggle's own state change

- **Status**: TODO
- **Commit**: 23ec71a
- **Severity**: LOW
- **Category**: Missed opportunity
- **Estimated scope**: 1 file, ~10 lines

## Problem

Pressing the theme toggle crossfades the entire page over 250ms:

```css
/* app/globals.css:60-63 — current */
body {
    transition: background-color var(--duration-fast) var(--ease-smooth-out),
        color var(--duration-fast) var(--ease-smooth-out);
}
```

The control that caused it does not move at all. Its filled half-disc jumps
between two opacity values in a single frame:

```jsx
/* app/components/theme.jsx:79-80 — current */
<circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.25" />
<path d="M8 1a7 7 0 010 14z" fill="currentColor" opacity={isDark ? 1 : 0.35} />
```

So the whole page eases and the button teleports. AUDIT §8 calls this out
directly: a state change that teleports, where a brief transition would prevent
a jarring change. It is the clearest seam left in the interface, and it is on a
control whose entire job is to communicate which state you are in.

The button already has press feedback (`active:scale-[0.94]`,
`app/components/theme.jsx:73`), so only the state readout is missing.

## Target

The disc rotates a half-turn as the fill changes, so the icon reads as one
object turning rather than two states swapping. Both properties transition
together on the same curve and duration as the page crossfade, so the control
and the page move as one gesture.

```jsx
/* target — app/components/theme.jsx */
<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
  <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.25" />
  <path
    d="M8 1a7 7 0 010 14z"
    fill="currentColor"
    style={{
      opacity: isDark ? 1 : 0.35,
      transformOrigin: '8px 8px',
      transform: `rotate(${isDark ? 180 : 0}deg)`,
      transition:
        'opacity 250ms cubic-bezier(0.22, 1, 0.36, 1), transform 250ms cubic-bezier(0.22, 1, 0.36, 1)',
    }}
  />
</svg>
```

`transform-origin` must be given in user units (`8px 8px`, the circle's centre),
not `center` — SVG child elements resolve percentage origins against the
viewport box, not their own bounds, so `center` rotates about the wrong point.

Reduced motion drops the rotation and keeps the opacity change, which is the
part that carries the meaning:

```css
/* target — append to the existing reduced-motion block in app/globals.css */
@media (prefers-reduced-motion: reduce) {
    .theme-toggle-disc {
        transition: opacity 150ms linear !important;
        transform: none !important;
    }
}
```

Add `className="theme-toggle-disc"` to the `<path>` so that rule can reach it.

## Repo conventions to follow

- 250ms with `cubic-bezier(0.22, 1, 0.36, 1)` is this repo's surface-transition
  pair — it is `--duration-fast` and `--ease-smooth-out` in
  `app/globals.css:25-35`, used together on `body` at `app/globals.css:60-63`.
  Match it so the button and the page move on the same curve.
- Inline `style` is acceptable here because the values are state-derived; the
  file already does this for the theme-driven attributes.
- The existing reduced-motion block is at the end of `app/globals.css` and
  already lists `.animate-bounce`, `.animate-ping`, `.animate-pulse`. Append the
  new rule inside that same block rather than opening a second one.

## Steps

1. In `app/components/theme.jsx`, locate the `<path>` inside `ThemeToggle`
   (line 80).
2. Add `className="theme-toggle-disc"` to it.
3. Replace its `opacity={isDark ? 1 : 0.35}` attribute with the `style` object
   from Target above, which carries opacity, transform-origin, transform and
   transition.
4. In `app/globals.css`, inside the existing
   `@media (prefers-reduced-motion: reduce)` block at the end of the file, add
   the `.theme-toggle-disc` rule from Target above.

## Boundaries

- Do NOT change the button's `aria-label`, `aria-pressed`, or the
  `active:scale-[0.94]` press feedback — those are correct.
- Do NOT change the toggle's size (`h-11 w-11`); it is at the 44px touch floor
  deliberately.
- Do NOT touch `ThemeProvider`, `themeInitScript`, or the `localStorage` logic.
- Do NOT animate the `<circle>` outline — only the filled disc moves.
- Do NOT introduce Motion here. This is two properties on one element; CSS runs
  it off the main thread and the file currently imports no animation library.
- If the `<path>` markup does not match the excerpt, STOP and report.

## Verification

- **Mechanical**: `npx next build` completes with `✓ Compiled successfully`.
  Do not run it while `npm run dev` is serving the same checkout.
- **Feel check**: run `npm run dev`, open `/` on a desktop-width window, and:
  - Click the toggle in the dock. The disc should turn a half-circle and change
    fill over the same beat as the page's ground and text — one gesture, not a
    button snap followed by a page fade.
  - Click it repeatedly, faster than 250ms. Because these are CSS transitions
    they must retarget from the current angle, never restart from 0deg.
  - In DevTools → Animations, set playback to 10% and confirm the disc rotates
    about the circle's centre. If it swings around a corner, `transform-origin`
    did not take — it must be `8px 8px`, not `center`.
  - In DevTools → Rendering, enable "Emulate prefers-reduced-motion", reload, and
    confirm the fill still changes (the state is still legible) but the disc does
    not rotate.
  - Confirm the toggle is absent on `/kizuku` — that route is pinned light and
    hides it by design.
- **Done when**: the toggle's disc turns and fades on the same 250ms curve as the
  page, retargets on rapid clicks, and rotation is dropped under reduced motion
  while the opacity change survives.
