// Newest first. The footer shows the newest three from the last 30 days as one
// line, and nothing at all if none qualify. Edit by hand.
//
// { kind: 'swim', text: 'swim 800m', date: '2026-11-12' }
export type Lately = {
  kind: 'swim' | 'ride' | 'sunset' | 'read'
  text: string
  date: string // YYYY-MM-DD
}

export const lately: Lately[] = []
