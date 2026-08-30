/**
 * Tool marks for the skills well.
 *
 * Figma is its real logo geometry. Illustrator and After Effects use Adobe's own
 * lettermark convention — "Ai" and "Ae" in the app's brand colours is how Adobe
 * actually ships those icons, so this is the real mark rather than a stand-in.
 *
 * Antigravity has no mark I could source accurately, so it carries a monogram in
 * the site's own ink. Flagged rather than faked: an invented logo for a real
 * product is worse than an honest initial.
 */

const Tile = ({ bg, fg, children }) => (
  <span
    aria-hidden="true"
    className="flex h-7 w-7 items-center justify-center rounded-[5px] text-[11px] font-bold tracking-tight"
    style={{ backgroundColor: bg, color: fg }}
  >
    {children}
  </span>
)

export const FigmaMark = () => (
  <svg width="20" height="30" viewBox="0 0 38 57" aria-hidden="true">
    <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
    <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
    <path d="M19 0h9.5a9.5 9.5 0 1 1 0 19H19V0z" fill="#FF7262" />
    <path d="M0 9.5A9.5 9.5 0 0 1 9.5 0H19v19H9.5A9.5 9.5 0 0 1 0 9.5z" fill="#F24E1E" />
    <path d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5z" fill="#A259FF" />
  </svg>
)

export const IllustratorMark = () => <Tile bg="#330000" fg="#FF9A00">Ai</Tile>
export const AfterEffectsMark = () => <Tile bg="#00005B" fg="#9999FF">Ae</Tile>
export const AntigravityMark = () => (
  <span
    aria-hidden="true"
    className="flex h-7 w-7 items-center justify-center rounded-[5px] border border-rule text-[11px] font-bold tracking-tight text-muted"
  >
    Ag
  </span>
)
