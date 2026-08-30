/**
 * Tool marks for the skills well.
 *
 * Figma is its real logo geometry. Illustrator and After Effects use Adobe's own
 * lettermark convention — "Ai" and "Ae" in the app's brand colours is how Adobe
 * actually ships those icons, so this is the real mark rather than a stand-in.
 *
 * Claude, Codex, Framer and Antigravity carry lettermarks in their brand colour
 * rather than reconstructed logos. Each of those marks is distinctive enough
 * that an approximation reads as wrong rather than as shorthand, and a wrong
 * logo on a portfolio is worse than an honest initial. Every tile carries the
 * full tool name in an sr-only label at the call site.
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
export const ClaudeMark = () => <Tile bg="#D97757" fg="#FFFFFF">C</Tile>
export const CodexMark = () => <Tile bg="#0D0D0D" fg="#FFFFFF">Cx</Tile>
export const FramerMark = () => <Tile bg="#0055FF" fg="#FFFFFF">F</Tile>
export const AntigravityMark = () => (
  <span
    aria-hidden="true"
    className="flex h-7 w-7 items-center justify-center rounded-[5px] border border-rule text-[11px] font-bold tracking-tight text-muted"
  >
    Ag
  </span>
)
