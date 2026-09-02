'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';

/**
 * The three interactions from the Kizuku app, rebuilt for the browser.
 *
 * Same constants and the same release logic as the React Native source, so
 * this demonstrates the section's claim rather than restating it. Styled from the site's
 * tokens, so they follow the theme rather than pinning their own palette.
 */

// the site's tokens, so these follow the theme instead of pinning a palette
const INK = 'var(--ink)';
const MUTED = 'var(--muted)';
const FAINT = 'var(--faint)';
const CARD = 'var(--raised)';
const EDGE = '1px solid var(--rule)';
const ACCENT = 'var(--ink)';
const GARDEN = 'linear-gradient(180deg, #D3E3C6 0%, #C2D9B2 46%, #B8D4AC 100%)';

/* the gesture's real logic, lifted from the product */
const FREE_RADIUS = 96;

/* Stage geometry. The can used to be pinned to the stage's right edge, which
   meant the distance it had to travel changed with the panel width — and once
   these three sat in the reading measure at 192px each, the can started only
   13px from the seed, so a "drag it onto the seed" demo needed no drag at all.
   Anchoring it to the seed instead puts the gap at REACH.dx, the product's own
   constant, at every width. */
const SEED_LEFT = 34;
const SEED_W = 82;
const CAN_W = 100;
const REACH = { dx: -155, dy: -18 };
const CAN_LEFT = SEED_LEFT + SEED_W / 2 - REACH.dx - CAN_W / 2;

function damp(value) {
  const d = Math.abs(value);
  if (d <= FREE_RADIUS) return value;
  return Math.sign(value) * (FREE_RADIUS + (d - FREE_RADIUS) * 0.32);
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

function Panel({ principle, title, reason, children, readouts }) {
  return (
    <div className="rounded-2xl p-5 md:p-6 lg:p-7 flex flex-col" style={{ backgroundColor: CARD, border: EDGE }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-sm font-semibold" style={{ color: INK }}>{title}</p>
        <span
          className="flex-none text-[9px] px-2 py-0.5 rounded-full font-medium uppercase tracking-widest"
          style={{ backgroundColor: 'var(--ground)', color: FAINT, border: EDGE }}
        >
          {principle}
        </span>
      </div>
      <p className="text-xs lg:text-[13px] leading-relaxed mb-5" style={{ color: MUTED }}>{reason}</p>
      {children}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {readouts.map(([k, v]) => (
          <div key={k} className="rounded-lg px-2.5 py-1.5 lg:px-3 lg:py-2" style={{ backgroundColor: 'var(--ground)' }}>
            <div className="text-[9px] lg:text-[10px] uppercase tracking-[0.18em]" style={{ color: FAINT }}>{k}</div>
            <div className="text-[13px] lg:text-[14px] font-medium tabular-nums" style={{ color: INK }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── watering ───────────────────────────────────────────────────────────── */

function Watering() {
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
  const reach = REACH;

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
    <Panel
      principle="Ma"
      title="watering — drag it onto the seed"
      reason="one-to-one until 96px, then it compresses instead of hitting a wall. release is judged on where the can looks, not where the finger went — watch the two numbers diverge."
      readouts={[['finger', `${readout.finger}px`], ['can', `${readout.can}px`], ['release', readout.verdict]]}
    >
      <div className="relative rounded-xl overflow-hidden select-none h-[230px] lg:h-[264px]" style={{ background: GARDEN, touchAction: 'none' }}>
        <img
          src="/kizuku/plants/optimiser-seed.png"
          alt=""
          draggable={false}
          className="absolute pointer-events-none"
          style={{ left: SEED_LEFT, bottom: 30, width: SEED_W, height: 108, objectFit: 'contain' }}
        />
        <motion.img
          src="/kizuku/plants/kizuku-watering-can.svg"
          alt="Watering can"
          draggable={false}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="absolute cursor-grab active:cursor-grabbing"
          style={{ left: CAN_LEFT, bottom: 52, width: CAN_W, height: 105, x, y, rotate }}
        />
        {drops > 0 && !reduced ? (
          /* the drops ride the can, so they leave the spout wherever it was let go */
          <motion.div
            key={drops}
            className="absolute pointer-events-none"
            style={{ left: CAN_LEFT + 18, bottom: 96, x, y }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute block rounded-full"
                style={{ width: 5, height: 8, background: '#EDF4EA', animation: `kz-drop 520ms ${i * 110}ms cubic-bezier(0.55,0,1,0.45) forwards` }}
              />
            ))}
          </motion.div>
        ) : null}
      </div>
    </Panel>
  );
}

/* ── hold to commit ─────────────────────────────────────────────────────── */

function Hold() {
  const progress = useMotionValue(0);
  const width = useTransform(progress, (p) => `${p * 100}%`);
  const scale = useMotionValue(1);
  const [pct, setPct] = useState(0);
  const [state, setState] = useState('idle');
  const run = useRef(null);

  useEffect(() => progress.on('change', (v) => setPct(Math.round(v * 100))), [progress]);

  const start = () => {
    setState('held');
    animate(scale, 0.98, { duration: 0.16, ease: [0.23, 1, 0.32, 1] });
    run.current = animate(progress, 1, { duration: 1, ease: 'linear' });
    run.current.then(() => {
      setState('done');
      if (navigator.vibrate) navigator.vibrate([6, 40, 10]);
    });
  };

  const cancel = () => {
    animate(scale, 1, { duration: 0.16, ease: [0.23, 1, 0.32, 1] });
    if (state === 'done') return;
    setState('idle');
    run.current?.stop();
    animate(progress, 0, { duration: 0.2, ease: [0.23, 1, 0.32, 1] });
  };

  return (
    <Panel
      principle="Zanshin"
      title="hold to commit — press and keep holding"
      reason="the one button in the product where you promise to do the thing. pressing is slow because you are deciding; releasing is fast because the system is only responding. let go early and it unwinds from wherever it reached."
      readouts={[['progress', `${pct}%`], ['press', '1s linear'], ['release', '200ms']]}
    >
      <div className="rounded-xl flex items-center justify-center px-6 h-[230px] lg:h-[264px]" style={{ background: GARDEN }}>
        <motion.button
          onPointerDown={start}
          onPointerUp={cancel}
          onPointerLeave={cancel}
          onPointerCancel={cancel}
          className="relative w-full max-w-[260px] overflow-hidden rounded-full select-none"
          style={{ height: 52, background: '#2C5228', scale, touchAction: 'none' }}
        >
          <motion.span className="absolute left-0 bottom-0 block" style={{ height: 3, width, background: '#CCDDB4' }} />
          <span className="relative text-[15px] font-semibold text-white">
            {state === 'done' ? 'committed' : state === 'held' ? 'keep holding…' : "i'll do it now"}
          </span>
        </motion.button>
      </div>
    </Panel>
  );
}

/* ── growth ─────────────────────────────────────────────────────────────── */

function Growth() {
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
      animate(rise, 1, { type: 'spring', bounce: 0.08, duration: 0.9 });
    }, 400);
  };

  useEffect(() => { play(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  return (
    <Panel
      principle="Zanshin"
      title="growth — the plant rises out of the seed"
      reason="both stages stand on one ground line with the origin at the base, so it grows upward instead of inflating from the middle. the spring barely overshoots: overshoot belongs to momentum the user supplied, and there is no gesture here."
      readouts={[['spring', 'bounce .08'], ['response', '0.9s'], ['origin', 'bottom']]}
    >
      <div className="relative rounded-xl overflow-hidden flex items-end justify-center h-[230px] lg:h-[264px]" style={{ background: 'linear-gradient(180deg, #EDF2E4 0%, #DDDBA5 100%)' }}>
        <div className="relative" style={{ width: 180, height: 196 }}>
          <motion.img
            src="/kizuku/plants/optimiser-seed.png"
            alt=""
            draggable={false}
            className="absolute left-1/2 bottom-0 pointer-events-none"
            style={{ width: 96, height: 88, objectFit: 'contain', x: '-50%', opacity: seedOpacity, scale: seedScale, transformOrigin: 'center bottom' }}
          />
          <motion.img
            src="/kizuku/plants/optimiser-tree.png"
            alt="The grown plant"
            draggable={false}
            className="absolute left-1/2 bottom-0 pointer-events-none"
            style={{ width: 158, height: 190, objectFit: 'contain', x: '-50%', opacity: plantOpacity, scale: plantScale, transformOrigin: 'center bottom' }}
          />
        </div>
        <button
          onClick={play}
          className="absolute top-3 right-3 text-[11px] px-2.5 py-1 rounded-full bg-white/80 transition-transform duration-150 ease-out active:scale-[0.97]"
          style={{ color: '#3D5239' }}
        >
          replay
        </button>
        <p className="absolute left-0 right-0 bottom-3 text-center text-[12px]" style={{ color: '#3D5239' }}>
          {grown ? 'something grew.' : 'planting…'}
        </p>
      </div>
    </Panel>
  );
}

export default function KizukuInteractions() {
  return (
    <div className="track-full grid md:grid-cols-3 gap-4 lg:gap-5">
      <Watering />
      <Hold />
      <Growth />
    </div>
  );
}
