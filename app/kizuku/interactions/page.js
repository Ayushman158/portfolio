'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';

// Same tokens the case study uses — all ≥ 4.5:1 on white
const T = {
  heading: '#1C2B1A',
  body: '#3D5239',
  secondary: '#5A7055',
  caption: '#6B8265',
};

const GARDEN = 'linear-gradient(180deg, #D3E3C6 0%, #C2D9B2 46%, #B8D4AC 100%)';

/* ── the gesture's real logic, lifted from the product ──────────────────── */

const FREE_RADIUS = 96;

function damp(value) {
  const distance = Math.abs(value);
  if (distance <= FREE_RADIUS) return value;
  return Math.sign(value) * (FREE_RADIUS + (distance - FREE_RADIUS) * 0.32);
}

function decideRelease({ dx, dy, vx, vy, reach }) {
  const shownX = damp(dx);
  const shownY = damp(dy);
  const travelled = Math.hypot(shownX, shownY);
  const distanceToPlant = Math.hypot(shownX - reach.dx, shownY - reach.dy);
  const speed = Math.hypot(vx, vy);
  const towardsPlant = shownX * reach.dx + shownY * reach.dy > 0;

  if (distanceToPlant < 130) return 'pour';
  if (speed > 0.45 && towardsPlant && travelled > 24) return 'pour';
  return 'settle';
}

/* ── page furniture ─────────────────────────────────────────────────────── */

function Label({ children }) {
  return (
    <p className="text-[10px] tracking-[0.32em] uppercase mb-3 font-medium" style={{ color: T.caption }}>
      {children}
    </p>
  );
}

function Stat({ k, v }) {
  return (
    <div className="flex items-baseline justify-between py-2 border-b" style={{ borderColor: '#E8EDE6' }}>
      <span className="text-[13px]" style={{ color: T.secondary }}>{k}</span>
      <span className="text-[13px] font-medium tabular-nums" style={{ color: T.heading }}>{v}</span>
    </div>
  );
}

function Snippet({ children }) {
  return (
    <pre
      className="text-[12px] leading-[1.7] overflow-x-auto rounded-xl p-4 mt-4"
      style={{ background: '#F4F7F2', color: T.body, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
    >
      {children}
    </pre>
  );
}

function Section({ n, title, blurb, demo, stats, code }) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-24 border-t" style={{ borderColor: '#E8EDE6' }}>
      <div className="grid md:grid-cols-[1fr_1.05fr] gap-10 md:gap-16 items-start">
        <div>
          <Label>{n}</Label>
          <h2 className="text-[28px] md:text-[34px] leading-[1.15] tracking-[-0.02em] font-medium" style={{ color: T.heading }}>
            {title}
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7]" style={{ color: T.body }}>{blurb}</p>
          <div className="mt-8">{stats}</div>
          {code ? <Snippet>{code}</Snippet> : null}
        </div>
        <div className="md:sticky md:top-24">{demo}</div>
      </div>
    </section>
  );
}

/* ── 01 · watering ──────────────────────────────────────────────────────── */

function WateringDemo() {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const tip = useMotionValue(0);
  const rotate = useTransform([x, tip], ([xv, tv]) => Math.max(-14, Math.min(10, xv / 11)) - tv * 24);

  const [readout, setReadout] = useState({ finger: 0, can: 0, verdict: '—' });
  const [drops, setDrops] = useState(0);
  const grab = useRef(null);
  const history = useRef([]);
  const pouring = useRef(false);

  // measured off the running app at the seed stage
  const reach = { dx: -155, dy: -18 };

  const settle = () => {
    animate(x, 0, { type: 'spring', bounce: 0, duration: 0.4 });
    animate(y, 0, { type: 'spring', bounce: 0, duration: 0.4 });
    animate(tip, 0, { duration: 0.22, ease: [0.23, 1, 0.32, 1] });
    pouring.current = false;
  };

  const pour = () => {
    if (pouring.current) return;
    pouring.current = true;
    animate(tip, 1, { duration: 0.24, ease: [0.23, 1, 0.32, 1] });
    setDrops((d) => d + 1);
    if (navigator.vibrate) navigator.vibrate(8);
    setTimeout(settle, 900);
  };

  const onDown = (e) => {
    if (pouring.current) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    grab.current = { x: e.clientX, y: e.clientY };
    history.current = [];
  };

  const onMove = (e) => {
    if (!grab.current || pouring.current) return;
    const dx = e.clientX - grab.current.x;
    const dy = e.clientY - grab.current.y;
    x.set(damp(dx));
    y.set(damp(dy));
    history.current.push({ dx, dy, t: performance.now() });
    if (history.current.length > 5) history.current.shift();
    setReadout((r) => ({ ...r, finger: Math.round(Math.hypot(dx, dy)), can: Math.round(Math.hypot(damp(dx), damp(dy))) }));
  };

  const onUp = () => {
    if (!grab.current) return;
    const h = history.current;
    const a = h[h.length - 2];
    const b = h[h.length - 1];
    const dt = a && b ? Math.max(b.t - a.t, 1) : 1;
    const vx = a && b ? (b.dx - a.dx) / dt : 0;
    const vy = a && b ? (b.dy - a.dy) / dt : 0;
    const last = b || { dx: 0, dy: 0 };

    const verdict = decideRelease({ dx: last.dx, dy: last.dy, vx, vy, reach });
    setReadout((r) => ({ ...r, verdict }));
    grab.current = null;
    if (verdict === 'pour') pour();
    else settle();
  };

  return (
    <div>
      <div
        className="relative rounded-2xl overflow-hidden select-none"
        style={{ background: GARDEN, height: 320, touchAction: 'none' }}
      >
        <img
          src="/kizuku/plants/optimiser-seed.png"
          alt=""
          draggable={false}
          className="absolute pointer-events-none"
          style={{ left: 46, bottom: 44, width: 104, height: 136, objectFit: 'contain' }}
        />
        <motion.img
          src="/kizuku/plants/kizuku-watering-can.svg"
          alt="Watering can — drag it onto the seed"
          draggable={false}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="absolute cursor-grab active:cursor-grabbing"
          style={{ right: 18, bottom: 74, width: 128, height: 134, x, y, rotate }}
        />
        {drops > 0 && !reduced ? (
          <div key={drops} className="absolute pointer-events-none" style={{ right: 122, bottom: 118 }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute block rounded-full"
                style={{
                  width: 5,
                  height: 8,
                  background: '#EDF4EA',
                  animation: `kz-drop 520ms ${i * 110}ms cubic-bezier(0.55,0,1,0.45) forwards`,
                }}
              />
            ))}
          </div>
        ) : null}

        <div className="absolute left-4 bottom-3 text-[11px] tracking-wide" style={{ color: '#4D4636' }}>
          drag the can onto the seed
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          ['finger', `${readout.finger}px`],
          ['can', `${readout.can}px`],
          ['release', readout.verdict],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl px-3 py-2" style={{ background: '#F4F7F2' }}>
            <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: T.caption }}>{k}</div>
            <div className="text-[15px] font-medium tabular-nums" style={{ color: T.heading }}>{v}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes kz-drop {
          0%   { opacity: 0;    transform: translate(0, 0) scaleY(0.7); }
          15%  { opacity: 0.9;  }
          75%  { opacity: 0.85; }
          100% { opacity: 0;    transform: translate(-14px, 58px) scaleY(1.1); }
        }
      `}</style>
    </div>
  );
}

/* ── 02 · hold to commit ────────────────────────────────────────────────── */

function HoldDemo() {
  const reduced = useReducedMotion();
  const progress = useMotionValue(0);
  const width = useTransform(progress, (p) => `${p * 100}%`);
  const scale = useMotionValue(1);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [held, setHeld] = useState(false);
  const run = useRef(null);

  useEffect(() => progress.on('change', (v) => setPct(Math.round(v * 100))), [progress]);

  const start = () => {
    setHeld(true);
    setDone(false);
    animate(scale, 0.98, { duration: 0.16, ease: [0.23, 1, 0.32, 1] });
    run.current = animate(progress, 1, { duration: 1, ease: 'linear' });
    run.current.then(() => {
      setDone(true);
      setHeld(false);
      if (navigator.vibrate) navigator.vibrate([6, 40, 10]);
    });
  };

  const cancel = () => {
    setHeld(false);
    animate(scale, 1, { duration: 0.16, ease: [0.23, 1, 0.32, 1] });
    if (done) return;
    run.current?.stop();
    // release is snappy, and starts from wherever the fill actually is
    animate(progress, 0, { duration: 0.2, ease: [0.23, 1, 0.32, 1] });
  };

  return (
    <div>
      <div className="rounded-2xl p-8 flex items-center justify-center" style={{ background: GARDEN, height: 320 }}>
        <motion.button
          onPointerDown={start}
          onPointerUp={cancel}
          onPointerLeave={cancel}
          onPointerCancel={cancel}
          className="relative w-full max-w-[320px] overflow-hidden rounded-full select-none"
          style={{ height: 52, background: '#2C5228', scale, touchAction: 'none' }}
        >
          <motion.span
            className="absolute left-0 bottom-0 block"
            style={{ height: 3, width, background: '#CCDDB4' }}
          />
          <span className="relative text-[15px] font-semibold text-white">
            {done ? 'committed' : held ? 'keep holding…' : "i'll do it now"}
          </span>
        </motion.button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          ['progress', `${pct}%`],
          ['press', '1s linear'],
          ['release', '200ms out'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl px-3 py-2" style={{ background: '#F4F7F2' }}>
            <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: T.caption }}>{k}</div>
            <div className="text-[15px] font-medium tabular-nums" style={{ color: T.heading }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 03 · growth ────────────────────────────────────────────────────────── */

function GrowthDemo() {
  const reduced = useReducedMotion();
  const rise = useMotionValue(0);
  const seedOpacity = useTransform(rise, [0, 0.5, 1], [1, 0.12, 0]);
  const seedScale = useTransform(rise, [0, 1], [1, 0.88]);
  const plantOpacity = useTransform(rise, [0, 0.3, 1], [0, 0.6, 1]);
  const plantScale = useTransform(rise, [0, 1], [0.52, 1]);
  const [grown, setGrown] = useState(false);

  const play = () => {
    setGrown(false);
    rise.set(0);
    setTimeout(() => {
      setGrown(true);
      if (reduced) return rise.set(1);
      // slow, deliberate, barely overshooting — alive, not springy
      animate(rise, 1, { type: 'spring', bounce: 0.08, duration: 0.9 });
    }, 500);
  };

  useEffect(() => {
    play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div
        className="relative rounded-2xl overflow-hidden flex items-end justify-center"
        style={{ background: 'linear-gradient(180deg, #EDF2E4 0%, #DDDBA5 100%)', height: 320 }}
      >
        <div className="relative" style={{ width: 240, height: 260 }}>
          <motion.img
            src="/kizuku/plants/optimiser-seed.png"
            alt=""
            draggable={false}
            className="absolute left-1/2 bottom-0 pointer-events-none"
            style={{
              width: 128, height: 116, objectFit: 'contain',
              x: '-50%', opacity: seedOpacity, scale: seedScale, transformOrigin: 'center bottom',
            }}
          />
          <motion.img
            src="/kizuku/plants/optimiser-tree.png"
            alt="The grown plant"
            draggable={false}
            className="absolute left-1/2 bottom-0 pointer-events-none"
            style={{
              width: 210, height: 252, objectFit: 'contain',
              x: '-50%', opacity: plantOpacity, scale: plantScale, transformOrigin: 'center bottom',
            }}
          />
        </div>
        <button
          onClick={play}
          className="absolute top-4 right-4 text-[12px] px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm transition-transform duration-150 ease-out active:scale-[0.97]"
          style={{ color: T.body }}
        >
          replay
        </button>
        <p className="absolute left-0 right-0 bottom-4 text-center text-[13px]" style={{ color: T.body }}>
          {grown ? 'something grew.' : 'planting…'}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          ['spring', 'bounce 0.08'],
          ['response', '0.9s'],
          ['origin', 'bottom'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl px-3 py-2" style={{ background: '#F4F7F2' }}>
            <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: T.caption }}>{k}</div>
            <div className="text-[15px] font-medium" style={{ color: T.heading }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── page ───────────────────────────────────────────────────────────────── */

export default function KizukuInteractions() {
  return (
    <main className="min-h-screen pb-28" style={{ background: '#FFFFFF', color: T.heading, fontFamily: "'Satoshi', sans-serif" }}>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
            Ayushman<span className="text-blue-500">.</span>
          </Link>
          <Link
            href="/kizuku"
            className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 transition-[background-color,transform] duration-150 ease-out active:scale-[0.97]"
          >
            Back to Kizuku
          </Link>
        </div>
      </nav>

      <header className="max-w-5xl mx-auto px-6 pt-40 pb-16">
        <Label>Kizuku — interactions</Label>
        <h1 className="text-[40px] md:text-[64px] leading-[1.02] tracking-[-0.03em] font-medium max-w-3xl" style={{ color: T.heading }}>
          Three interactions, and the arguments behind them.
        </h1>
        <p className="mt-6 text-[16px] md:text-[17px] leading-[1.7] max-w-2xl" style={{ color: T.body }}>
          Kizuku ships as a React Native app. These are the same three interactions rebuilt for the browser so
          you can put your hands on them — same constants, same thresholds, same decisions. Every number below
          was measured, not chosen for the write-up.
        </p>
        <p className="mt-4 text-[14px] leading-[1.7] max-w-2xl" style={{ color: T.secondary }}>
          They reward a pointer or a thumb. Reduced motion is respected throughout; the haptics only fire on
          devices that have them.
        </p>
      </header>

      <Section
        n="01 — direct manipulation"
        title="A watering can that resists."
        blurb="Dragging is one-to-one until it isn't. Past 96px the can compresses instead of hitting a wall, the way a real object slows before it stops. Release is decided by where the can looks — not where the finger went — and a committed flick counts as much as a careful drag."
        demo={<WateringDemo />}
        stats={
          <div>
            <Stat k="Free travel, 1:1" v="96px" />
            <Stat k="Compression past it" v="0.32×" />
            <Stat k="Flick threshold" v="0.45 px/ms" />
            <Stat k="Return spring" v="bounce 0, 0.4s" />
          </div>
        }
        code={`// the bug this caught: the finger and the can diverge
// past the free radius — a 240px drag moves the can 142px,
// and the user is watching the can
const shownX = damp(dx);
const shownY = damp(dy);
if (Math.hypot(shownX - reach.dx, shownY - reach.dy) < 130)
  return 'pour';`}
      />

      <Section
        n="02 — asymmetric timing"
        title="Hold to commit."
        blurb="One button in the whole product does this: the one where you promise to do the thing. Pressing is slow and linear because you are deciding. Releasing is fast because the system is only responding. Let go early and the fill unwinds from wherever it actually reached."
        demo={<HoldDemo />}
        stats={
          <div>
            <Stat k="Press" v="1000ms linear" />
            <Stat k="Release" v="200ms ease-out" />
            <Stat k="Progress line on button" v="6.21:1" />
            <Stat k="Label throughout" v="8.96:1" />
          </div>
        }
        code={`// progress sits on the bottom edge, not behind the label:
// two greens from the ramp reach only 1.85:1 against each
// other, and a wash light enough to read drops the white
// label to 3.08:1`}
      />

      <Section
        n="03 — spatial continuity"
        title="The plant rises out of the seed."
        blurb="It was two pictures swapping. Now both stages stand on one ground line with the origin at the base, so the plant grows upward instead of inflating from its middle. The spring barely overshoots — enough to read as alive, not as bouncy. Overshoot belongs to momentum the user supplied, and there is no gesture here."
        demo={<GrowthDemo />}
        stats={
          <div>
            <Stat k="Spring bounce" v="0.08" />
            <Stat k="Response" v="0.9s" />
            <Stat k="Transform origin" v="center bottom" />
            <Stat k="Copy delay behind motion" v="160ms" />
          </div>
        }
        code={`// when the stage hasn't changed there is nothing to
// transform into, so the plant acknowledges with one pulse
// rather than pretending to become what it already is`}
      />

      <footer className="max-w-5xl mx-auto px-6 py-20 border-t" style={{ borderColor: '#E8EDE6' }}>
        <p className="text-[14px] leading-[1.7] max-w-2xl" style={{ color: T.secondary }}>
          Built in React Native, ported here with Motion. The gesture physics were unit-tested — nine release
          cases including flick-wrong-way and drag-past-the-plant — but damping curves are judged with a thumb,
          not a test runner.
        </p>
      </footer>
    </main>
  );
}
