# Ayushman Bharadwaj — portfolio

Read this before any design or code change. It records decisions Ayushman has
already made, so they are not re-litigated or rebuilt from scratch.

## What the site is for

- Goal: make a recruiter or hiring manager curious enough to talk to him, in
  about 40 seconds. It does not need to explain everything; the interview deck
  does that.
- Target: a remote UX/UI or design-engineering role. What sets him apart is
  that he actually ships code (and came from security engineering); his own
  point is that what he cares about is the unique part, the background only
  supports it.
- Three selected case studies, in this order: Signal (Delhi Metro wayfinding),
  Kizuku (iOS app), Hoychoy Cafe (shipped client service, real orders).
  Everything else lives in Exploration (`/archive`).
- Before changing any design decision, show him 2–3 options with the trade-off
  and a recommendation. Do not overwrite work with your own pick.

## Stack and workflow

- Next.js 14 App Router (server-rendered), React 18, Tailwind 3, `motion`
  (Framer Motion) for entrances, `matter-js` only where physics is needed.
  Global styles and tokens live in `app/globals.css`.
- Hosted on Vercel. `craft-layer` is the working branch; `main` is production
  (ayushman-bharadwaj.vercel.app). Push to `main` only when he asks to go live.
- Dev server: the `portfolio-dev` entry in `.claude/launch.json`, port 3111.
  Never start a second dev server or run `next build` in this folder while one
  is running: they share `.next` and the other breaks (500s, missing chunks).
- Video tools: there is no system ffmpeg. Use Remotion's bundled binary in
  `~/signal-video/film/node_modules/@remotion/compositor-darwin-arm64/` with
  `DYLD_LIBRARY_PATH` set to that folder.
- Comment every non-obvious block in plain words (what it does and why), so he
  can make small edits himself.

## Storyboard: what a visitor meets, in order

1. **First screen.** A greeting in English, Assamese and Hindi; the display
   line "I'm Ayushman, a designer who likes figuring things out."; two
   sentences about him; his pencil avatar as a magnet you can drag; the lamp
   cord at the top right (pull it to switch light and dark). No loader.
2. **Selected work.** Three rows, one project each: a framed image (dark frame,
   cream mat), the title, one line, Role and Outcome, tags, "read the story".
   A card grows into its case study on click (view transition) and shrinks back.
3. **Exploration.** The checkered strip, then the display title "Exploration"
   with "see everything →"; Hazel peeks over the strip above the title's end.
   Then a pinboard of three taped video prints.
4. **Ending: the listening corner.** "Email me ↗", socials and nav on the left;
   on the right, his room: a record console with plants, a moka pot, a mushroom
   lamp, a guitar, two posters (Koi Wishing Pond, Aipan art) and a rug. Every
   object responds to a tap. The bottom line: copyright, "thanks for rolling
   by", back to top.

- `/archive` (Exploration): strip + title + Hazel, then the full pinboard
  (six pieces), draggable on desktop with "tidy up" and play/pause.
- Case studies: Signal, Kizuku, Hoychoy, Banyan, Koi. A ticked status bar on
  the left edge marks the section you are in.

## Art direction

**Feel.** A warm room at low light: editorial and quiet at rest, crafty in the
details. Bohemian, but minimal: one touch at a time, never layered pattern.
His moodboard (Pinterest "Interior design") is 1970s rooms: cream walls,
walnut, orange mushroom and arc lamps, framed graphic posters, records, plants.

**Colour.** Light theme ground is the cream wall on every page:
`--ground #F6F0E4`, `--raised #EFE7D8`, `--rule #DCD2C0`, ink `#3B2024`,
muted `#3D3934`, faint `#5E5950` (6.1:1 on cream). One UI accent, terracotta
`--accent #B4664F`, for marks and borders only, never body text. The lamp's
orange `--lamp #E8731A` is the one bright colour (underlines, glows). Dark mode
is a warm near-black and stays supported. Choose Assam's standalone page keeps
its own white identity.

**Type.** Instrument Serif for display lines, titles and big numbers
(`.display`, `.headline`). Instrument Sans for everything read. Reenie Beanie is
the only handwriting face (notes, labels on prints, the plant tag, the
sign-off). Geist Mono for data and small typed notes. Inter appears only inside
Signal's prototype screens; Kizuku's own faces stay on the Kizuku page.
17px root, 18px body.

**Layout.** One left edge for the whole page; text narrows to a reading
measure (`.measure`), figures and work use the wide track (`.track-wide`).

**Objects, not widgets.** Replace default UI with something from a real
object: framed prints, taped polaroids on a dotted board, a paper tag, a pull
cord, a pinned note. No stock sliders, carousels, gradient washes or generic
cards.

**Motion.**
- One scroll motion site-wide (`app/components/page-reveal.jsx`): figures and
  headings below the fold rise 28px once, 0.8s. Native scrolling everywhere;
  no smooth-scroll library.
- Hover never moves a copy of an illustration off itself. On the footer art,
  hover brightens the object in place; anything that moves (a door, the rug's
  dust, a poster) is its own layer.
- Ease out on arrival, quicker on the way out; springs only for small playful
  moments (Hazel's rise).
- Every animation has a Reduced Motion state: finished, static, or absent.

**The motif: Hazel.** His golden retriever, as a small textured illustration
(`public/exploration/hazel-peek.png`), 42–54px. She peeks over the Exploration
strip next to the title, nods with a tiny brick heart, and goes back down.
Tapping her spot brings her up again. She is a small delight for a reviewer:
keep her small, rare and contained. Never page-wide.

**Footer interactions** (`app/components/listening-corner.jsx`): turntable
plays (record spins, notes rise), lamp switches the room's light, plant gets
watered (its tag says "water me", then "thank you!"), guitar and moka pot
respond, doors slide ajar, a light runs over the records, the rug puffs dust,
the posters straighten as the footer scrolls in. No captions for these; the
plant tag and the sign-off are the only words in the room.

## Writing

- His voice: plain first person, short complete sentences, specific. No
  aphorisms, no "passionate about", no clipped poetic lines.
- Interface labels are lowercase ("selected work", "read the story →").
- Case studies follow the senior reviewers' rules: plain section titles ("The
  problem", "What I found"), situation and problem in the first screen,
  outcomes high up, before and after near the top, constraints and trade-offs,
  visuals before text.
- Never invent metrics. Unshipped work says "not yet tested with users".
  Signal is labelled "a concept for DMRC, not affiliated".

## Tried and rejected: do not rebuild unless he asks

- A white page, or cream on the homepage only.
- The home gradient strip, extra footer lines, field notes on About.
- Layered bohemian treatments (arches plus woven bands plus patterned frames).
- An orange mushroom-lamp shade on the top lamp cord.
- Per-object captions in the footer, and the rug lifting to show sketches with
  an "under the rug" line.
- The strip placed under the Exploration title (unbalanced).
- Smooth scrolling (Lenis) on Signal or anywhere else.

## References he likes

devyanism.framer.website/works and melissachanyc.framer.website ("clean and
minimal yet crafty"); manyaa.me/works/scam-prevention and jeevanshunarang.com
(from a Blinkit lead's review: one specific problem and outcome per project);
his Pinterest board in.pinterest.com/ayushman15899/interior-design/.

## Checklist status (November 2026)

- Done: Signal cut to its story (about 13 screens) at `/signal`; the full
  system stays at `/signal/detail` (noindex) for interviews. Both render from
  `app/signal/content.jsx`, where `detail &&` marks full-version-only parts.
- Done: `/resume` opens `public/Ayushman_Bharadwaj_Resume.pdf`, a copy without
  the phone number (built from `~/Downloads/resume-v2/variants/resume-public.html`;
  referral, hiring-manager and cold-application versions sit beside it).
- Started: short clips instead of stills. Signal's "One visual system" opens
  with `public/signal/clips/sign-in-place.mp4`, drawn frame by frame in Python
  (the bundled ffmpeg has no overlay or fade filters) and encoded with ffmpeg.
- Open: clips for Kizuku and Hoychoy; a slide deck built from
  `/signal/detail`.
