'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ─── Data ─────────────────────────────────────────────────────────────────────

// Screens in the loop order (all 393×852 real UI files)
const LOOP_SCREENS = [
  { src: '/kizuku/screens/Loading.png',        label: 'ritual',        desc: 'the loading is the ritual — ma, intentional pause' },
  { src: '/kizuku/screens/Worry Input.png',    label: 'worry',         desc: 'write anything. this stays between you and your tree.' },
  { src: '/kizuku/screens/Today action.png',   label: 'action',        desc: 'one thing. right now. no options.' },
  { src: '/kizuku/screens/Reflection.png',     label: 'reflection',    desc: 'what happened when you actually did it?' },
  { src: '/kizuku/screens/Garden-1.png',        label: 'growth',        desc: 'day 8. something grew.' },
];

const PERSONAS = [
  { type: 'optimizer', tree: 'spiral tree',  color: '#ECD858', bg: '#FEFCE8', textDark: '#1C2B1A', img: '/kizuku/screen-optimiser.png',    treeImg: '/kizuku/optimizer-tree.png', quote: '"is this the most efficient use of my time right now?"' },
  { type: 'seeker',    tree: 'crystal tree', color: '#A8CEDE', bg: '#EFF8FC', textDark: '#1C2B1A', img: '/kizuku/screen-questionnaire.png', treeImg: '/kizuku/crystal-tree.png',   quote: '"what if this is not the life i was supposed to build?"' },
  { type: 'planner',   tree: 'strata tree',  color: '#A8CA9C', bg: '#EFFAF0', textDark: '#1C2B1A', img: '/kizuku/screen-reflection.png',    treeImg: '/kizuku/tree-stage-5.png',   quote: '"i need to make sure i am not making a mistake i cannot undo."' },
];

// Contrast-safe text tokens (all ≥ 4.5:1 on white #FFFFFF)
const T = {
  heading:   '#1C2B1A', // 18:1 on white
  body:      '#3D5239', // 8.2:1 on white
  secondary: '#5A7055', // 4.8:1 on white — just AA
  caption:   '#6B8265', // 4.0:1 — for large text / captions only (AA large)
};

const TOP_DECISIONS = [
  { n: '01', title: 'the only wellness app for future anxiety', body: 'no competitor addresses this user. the market treats anxiety as a spectrum disorder. kizuku is the first product designed specifically for excessive forward simulation.' },
  { n: '02', title: 'three-layer ai action system', body: 'tags assign context → hard rules constrain generation → persona filter shapes output. every layer documented. fully auditable.' },
  { n: '03', title: 'growth tied to emotional labour, not time', body: 'forest grows a tree when you sit still. kizuku grows one when you face something hard. same mechanic. completely different meaning.' },
  { n: '04', title: 'no streaks — explicit ethical reasoning', body: 'streaks create performance anxiety in a user who already has it. missing a day does not shrink the tree. designed out, not overlooked.' },
  { n: '05', title: 'copy decisions at word level', body: '"start quiz" vs "find my tree type →" — one word changes whether the user feels assessed or invited. every line documented with before/after.' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Pill({ children, dark }) {
  return (
    <span className="inline-flex items-center text-[10px] tracking-[0.28em] uppercase px-3 py-1.5 rounded-full font-medium"
      style={dark
        ? { backgroundColor: T.heading, color: '#F2EDE0' }
        : { border: `1px solid ${T.caption}40`, color: T.secondary }
      }>
      {children}
    </span>
  );
}

function SectionLabel({ children, color }) {
  return (
    <p className="text-[10px] tracking-[0.32em] uppercase mb-3 font-medium" style={{ color: color || T.caption }}>
      {children}
    </p>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KizukuPage() {
  const [activePersona, setActivePersona] = useState(0);
  const [videoPlaying, setVideoPlaying]   = useState(false);
  const cursorRef  = useRef(null);
  const videoRef   = useRef(null);


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Cursor
    const cursor = cursorRef.current;
    if (cursor) {
      const xTo = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power3' });
      const yTo = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power3' });
      const mv = (e) => { xTo(e.clientX); yTo(e.clientY); };
      window.addEventListener('mousemove', mv);
    }

    // Reveals
    gsap.utils.toArray('.kz-reveal').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }
      );
    });

    // Image Scale Reveals (Premium Editorial Feel)
    gsap.utils.toArray('.kz-img-scale img').forEach((img) => {
      gsap.fromTo(img,
        { scale: 1.08 },
        { scale: 1, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: img, start: 'top 95%' } }
      );
    });

    // Card staggers
    gsap.utils.toArray('.kz-cards').forEach((group) => {
      gsap.fromTo(group.querySelectorAll('.kz-card'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.07, scrollTrigger: { trigger: group, start: 'top 88%' } }
      );
    });


    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  const toggleVideo = useCallback(() => {
    if (!videoRef.current) return;
    if (videoPlaying) { videoRef.current.pause(); setVideoPlaying(false); }
    else { videoRef.current.play(); setVideoPlaying(true); }
  }, [videoPlaying]);

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#FFFFFF', color: T.heading, fontFamily: "'Satoshi', sans-serif" }}>

      {/* Cursor */}
      <div ref={cursorRef} className="hidden md:block fixed top-0 left-0 pointer-events-none z-[9999] w-3 h-3 rounded-full mix-blend-multiply"
        style={{ backgroundColor: T.heading, transform: 'translate(-50%,-50%)' }} />

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #F5F0E8 0%, #FFFFFF 45%, #F0F5EE 100%)' }}>

        {/* Nav bar */}
        <nav className="flex justify-between items-center px-6 md:px-12 pt-7">
          <Link href="/" className="text-xs tracking-widest uppercase font-medium transition-opacity hover:opacity-60"
            style={{ color: T.secondary }}>
            ← ayushman
          </Link>
          <img src="/kizuku/Home/logo.png" alt="Kizuku" className="h-8 w-auto" />
        </nav>

        {/* Status banner */}
        <div className="flex justify-center mt-5 px-6">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-medium"
            style={{ backgroundColor: '#FEF9C3', border: '1px solid #ECD85860', color: '#7A6218' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] animate-pulse inline-block" />
            in progress · iOS app in development · UI screens being refined
          </div>
        </div>

        {/* Hero body */}
        <div className="flex-1 flex flex-col md:flex-row items-center gap-8 md:gap-12 px-6 md:px-12 pt-10 pb-8 max-w-7xl mx-auto w-full">

          {/* Left */}
          <div className="md:w-[48%] flex flex-col">
            <div className="flex flex-wrap gap-2 mb-6">
              <Pill dark>ux design</Pill>
              <Pill>brand identity</Pill>
              <Pill>ai product</Pill>
              <Pill>wellness</Pill>
            </div>

            {/* Title block */}
            <div className="relative mb-5">
              <span className="absolute -top-2 left-0 font-bold select-none pointer-events-none"
                style={{ fontSize: 'clamp(80px, 15vw, 170px)', color: T.heading, opacity: 0.05, lineHeight: 1, fontFamily: "'Satoshi', sans-serif" }}>
                気づく
              </span>
              <h1 className="relative font-bold tracking-tighter" style={{ fontSize: 'clamp(64px, 12vw, 140px)', color: T.heading, lineHeight: 0.9 }}>
                kizuku
              </h1>
            </div>

            <p className="text-base md:text-lg leading-relaxed max-w-sm mb-8" style={{ color: T.body }}>
              a wellness app for people who overthink the future — designed to turn one worry into one action, every day.
            </p>

            <div className="flex flex-wrap gap-6 pt-4" style={{ borderTop: `1px solid ${T.heading}10` }}>
              {[['2 weeks', 'sprint'], ['ios', 'platform'], ['21', 'illustrations'], ['4 stages', 'process']].map(([v, k]) => (
                <div key={k}>
                  <p className="font-bold text-sm" style={{ color: T.heading }}>{v}</p>
                  <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: T.caption }}>{k}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — 3 phones */}
          <div className="md:w-[52%] flex items-end justify-center gap-3 md:gap-5 mt-4 md:mt-0">
            {[
              { src: '/kizuku/screens/Worry Input.png',   rotate: '-7deg',  y: '28px',  shadow: '0 16px 48px rgba(44,82,40,0.12)', scale: 0.88 },
              { src: '/kizuku/screens/Today action.png',  rotate: '-1deg',  y: '0px',   shadow: '0 28px 64px rgba(44,82,40,0.2)',  scale: 1 },
              { src: '/kizuku/screens/Garden-1.png',       rotate: '6deg',   y: '22px',  shadow: '0 16px 48px rgba(44,82,40,0.12)', scale: 0.88 },
            ].map((s, i) => (
              <div key={i} className="flex-none rounded-xl md:rounded-[1.25rem] overflow-hidden"
                style={{ width: 'clamp(110px, 20vw, 185px)', transform: `rotate(${s.rotate}) translateY(${s.y}) scale(${s.scale})`, boxShadow: s.shadow, border: '1px solid rgba(0,0,0,0.06)' }}>
                <img src={s.src} alt="" className="w-full h-auto block" loading="eager" />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="flex flex-col items-center pb-8 gap-1.5" style={{ color: T.caption, fontSize: '0.6rem', letterSpacing: '0.25em' }}>
          <p className="uppercase">scroll to explore</p>
          <div className="w-px h-7" style={{ backgroundColor: `${T.caption}50` }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          APP SCREENS — full loop
      ══════════════════════════════════════════════════ */}
      <section id="sec-screens" className="py-20 md:py-28 px-6" style={{ backgroundColor: '#F9FAF9' }}>
        <div className="max-w-6xl mx-auto">
          <div className="kz-reveal flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12">
            <div>
              <SectionLabel>the product</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold" style={{ color: T.heading }}>the product.</h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed" style={{ color: T.secondary }}>
              five screens. one closed daily loop.<br />worry → action → reflect → grow.<br />the loop resets every day. there is no replay.
            </p>
          </div>

          {/* Screen grid — all 5 visible, no scroll */}
          <div className="kz-reveal grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-5 mb-12">
            {LOOP_SCREENS.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2.5">
                <div className="w-full rounded-[1.5rem] overflow-hidden"
                  style={{ boxShadow: '0 8px 32px rgba(44,82,40,0.1)', border: '1px solid rgba(44,82,40,0.07)' }}>
                  <img src={s.src} alt={s.label} className="w-full h-auto block" loading="lazy" />
                </div>
                <div className="text-center px-1">
                  <p className="text-xs font-semibold mb-0.5" style={{ color: T.body }}>{s.label}</p>
                  <p className="text-[9px] italic leading-snug hidden md:block" style={{ color: T.caption }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 4-step loop line */}
          <div className="kz-reveal flex items-center justify-center gap-2 flex-wrap mb-14">
            {['worry', 'one action', 'reflect', 'grow'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="text-sm font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: i === 3 ? '#2C5228' : `${T.heading}08`, color: i === 3 ? '#F2EDE0' : T.body }}>
                  {step}
                </span>
                {i < 3 && <span className="text-xs" style={{ color: T.caption }}>→</span>}
              </div>
            ))}
          </div>

          {/* Figma prototype embed */}
          <div className="kz-reveal">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <SectionLabel>interactive prototype</SectionLabel>
                <p className="text-sm" style={{ color: T.secondary }}>tap through the full flow — built in figma.</p>
              </div>
              <a href="https://www.figma.com/proto/80dVRiAfseQp409VZtvZZ6/Kizuku?node-id=160-994&t=xcyzJ9w5g52hdI6V-1"
                target="_blank" rel="noopener noreferrer"
                className="text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5 transition-opacity hover:opacity-70"
                style={{ color: T.body }}>
                open in figma
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(44,82,40,0.1)', boxShadow: '0 4px 24px rgba(44,82,40,0.08)' }}>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  src="https://embed.figma.com/proto/80dVRiAfseQp409VZtvZZ6/Kizuku?node-id=160-994&scaling=scale-down&content-scaling=fixed&embed-host=share&hide-ui=1"
                  allowFullScreen
                  title="Kizuku prototype"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          RESEARCH
      ══════════════════════════════════════════════════ */}
      <section id="sec-research" className="py-20 md:py-28 px-6"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F3F8F2 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="kz-reveal mb-12">
            <SectionLabel>research</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: T.heading }}>
              an unaddressed market.<br />a precisely defined user.
            </h2>
            <p className="text-base max-w-lg" style={{ color: T.secondary, lineHeight: 1.7 }}>
              future anxiety is distinct from clinical anxiety — it's a cognitive pattern, not a disorder. every existing wellness app either treats general stress or gamifies self-care. none address this user.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-12 kz-cards">
            {[
              { stat: '01', text: 'future anxiety is a cognitive pattern, not a clinical disorder — no existing app targets it specifically.' },
              { stat: '02', text: 'disproportionately present in high-achieving urban young adults — india\'s overlooked wellness market.' },
              { stat: '03', text: 'every competitor either treats general stress or gamifies self-care. the specific fear of the future is unaddressed.' },
            ].map((r) => (
              <div key={r.stat} className="kz-card rounded-2xl p-7"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(44,82,40,0.1)', boxShadow: '0 2px 16px rgba(44,82,40,0.05)' }}>
                <p className="text-4xl font-bold mb-4" style={{ color: '#2C5228' }}>{r.stat}</p>
                <p className="text-sm leading-relaxed" style={{ color: T.body }}>{r.text}</p>
              </div>
            ))}
          </div>

          {/* Competitive quadrant + insight */}
          <div className="kz-reveal grid md:grid-cols-2 gap-5 items-start">
            <div className="rounded-2xl p-7" style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(44,82,40,0.1)', boxShadow: '0 2px 16px rgba(44,82,40,0.05)' }}>
              <SectionLabel>competitive position</SectionLabel>
              <div className="relative mx-auto" style={{ width: '100%', maxWidth: 280, aspectRatio: '1' }}>
                <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: 'rgba(44,82,40,0.12)' }} />
                <div className="absolute top-1/2 left-0 right-0 h-px" style={{ backgroundColor: 'rgba(44,82,40,0.12)' }} />
                {['warm','clinical','passive','active'].map((l, i) => {
                  const pos = [
                    { top: '3px', left: '50%', transform: 'translateX(-50%)' },
                    { bottom: '3px', left: '50%', transform: 'translateX(-50%)' },
                    { left: '3px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)' },
                    { right: '3px', top: '50%', transform: 'translateY(-50%) rotate(90deg)' },
                  ][i];
                  return <span key={l} className="absolute text-[8px] uppercase tracking-widest" style={{ ...pos, color: T.caption }}>{l}</span>;
                })}
                {[
                  { name: 'Headspace', x: 47, y: 71 }, { name: 'Calm', x: 40, y: 63 },
                  { name: 'Forest',    x: 56, y: 59 }, { name: 'Finch', x: 43, y: 49 },
                  { name: 'Reflectly', x: 36, y: 54 },
                ].map((d) => (
                  <div key={d.name} className="absolute flex flex-col items-center" style={{ left: `${d.x}%`, top: `${d.y}%`, transform: 'translate(-50%,-50%)' }}>
                    <div className="rounded-full" style={{ width: 6, height: 6, backgroundColor: 'rgba(44,82,40,0.2)' }} />
                    <span className="text-[8px] mt-0.5 whitespace-nowrap" style={{ color: T.caption }}>{d.name}</span>
                  </div>
                ))}
                <div className="absolute flex flex-col items-center" style={{ left: '76%', top: '20%', transform: 'translate(-50%,-50%)' }}>
                  <div className="rounded-full" style={{ width: 11, height: 11, backgroundColor: '#2C5228', boxShadow: '0 0 14px rgba(44,82,40,0.35)' }} />
                  <span className="text-[9px] font-bold mt-1" style={{ color: '#2C5228' }}>Kizuku</span>
                </div>
              </div>
              <p className="text-[10px] text-center mt-3 italic" style={{ color: T.caption }}>
                warm + active quadrant — unoccupied by every competitor
              </p>
            </div>

            <div className="rounded-2xl p-7" style={{ backgroundColor: '#2C5228' }}>
              <SectionLabel color="rgba(242,237,224,0.5)">the core insight</SectionLabel>
              <p className="text-lg font-semibold leading-snug mb-5" style={{ color: '#F2EDE0' }}>
                "the overthinker does not need to be calmed. they need a place to put the worry — and one concrete thing to do about it."
              </p>
              <div className="pt-5" style={{ borderTop: '1px solid rgba(242,237,224,0.12)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(242,237,224,0.65)' }}>
                  forest grows a tree when you sit still.<br />
                  kizuku grows one when you face something hard.<br />
                  same mechanic. completely different meaning.
                </p>
              </div>
            </div>
          </div>

          {/* Three personas */}
          <div className="kz-reveal mt-12">
            <SectionLabel>three user types identified</SectionLabel>
            <div className="flex flex-wrap gap-2 mb-5">
              {PERSONAS.map((p, i) => (
                <button key={p.type} onClick={() => setActivePersona(i)}
                  className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300"
                  style={{
                    backgroundColor: activePersona === i ? p.color : 'transparent',
                    color: activePersona === i ? p.textDark : T.secondary,
                    border: `1px solid ${activePersona === i ? p.color : 'rgba(44,82,40,0.2)'}`,
                  }}>
                  {p.type}
                </button>
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden transition-all duration-400"
              style={{ border: '1px solid rgba(44,82,40,0.1)', backgroundColor: PERSONAS[activePersona].bg }}>
              <div className="grid md:grid-cols-3 gap-0">
                <div className="md:col-span-2 p-8">
                  <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: T.caption }}>{PERSONAS[activePersona].tree}</p>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: T.heading }}>the {PERSONAS[activePersona].type}</h3>
                  <p className="text-lg italic leading-relaxed" style={{ color: T.body, fontFamily: "'Satoshi', sans-serif" }}>
                    {PERSONAS[activePersona].quote}
                  </p>
                </div>
                <div className="flex items-center justify-center p-8 md:border-l" style={{ borderColor: 'rgba(44,82,40,0.1)' }}>
                  <img src={PERSONAS[activePersona].treeImg} alt={PERSONAS[activePersona].tree}
                    className="w-36 h-auto object-contain" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BRANDING
      ══════════════════════════════════════════════════ */}
      <section id="sec-branding" className="py-20 md:py-28 px-6" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-5xl mx-auto">
          <div className="kz-reveal mb-12">
            <SectionLabel>branding</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: T.heading }}>
              the logo was discovered,<br />not designed.
            </h2>
          </div>

          {/* Logo floral painting */}
          <div className="kz-reveal kz-img-scale mb-12 rounded-3xl overflow-hidden"
            style={{ boxShadow: '0 4px 32px rgba(44,82,40,0.08)', border: '1px solid rgba(44,82,40,0.06)' }}>
            <img src="/kizuku/logo-painting.png" alt="Hand-painted logo floral exploration" className="w-full h-auto block" loading="lazy" />
          </div>

          {/* Colour palette */}
          <div className="kz-reveal kz-img-scale mb-12">
            <SectionLabel>colour system — each has a reason</SectionLabel>
            <div className="kz-img-scale rounded-2xl overflow-hidden mb-5" style={{ boxShadow: '0 2px 20px rgba(44,82,40,0.07)', border: '1px solid rgba(44,82,40,0.06)' }}>
              <img src="/kizuku/watercolour-wash.jpg" alt="Watercolour exploration — discovering the colour temperature and emotional palette" className="w-full h-auto block" loading="lazy" />
            </div>
            <p className="text-xs italic mb-5" style={{ color: T.caption }}>the colour temperature was discovered through watercolour, not chosen from a swatch</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: 'parchment', hex: '#F2EDE0', reason: 'every competitor uses white or dark. parchment signals warmth before a word is read.' },
                { name: 'forest',    hex: '#2C5228', reason: 'colour of growth, not of calm. avoided the blue-grey wellness register.' },
                { name: 'amber',     hex: '#ECD858', reason: 'the kizuku moment — visible in the logo leaf tips. warm without aggression.' },
                { name: 'sky',       hex: '#A8CEDE', reason: 'seeker persona. unusual, beautiful — requires observation not control.' },
                { name: 'sage',      hex: '#A8CA9C', reason: 'planner persona. slow, patient, long-lived — rewards consistency.' },
                { name: 'salmon',    hex: '#E0906F', reason: 'the moment something arrives — the 30-day plant, the reward for showing up.' },
              ].map((c) => (
                <div key={c.name} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(44,82,40,0.08)' }}>
                  <div style={{ height: 52, backgroundColor: c.hex }} />
                  <div className="p-3" style={{ backgroundColor: '#FFFFFF' }}>
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: T.heading }}>{c.name}</p>
                      <p className="text-[9px] font-mono" style={{ color: T.caption }}>{c.hex}</p>
                    </div>
                    <p className="text-[10px] leading-relaxed" style={{ color: T.body }}>{c.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="kz-reveal">
            <SectionLabel>typography — satoshi, all weights, all lowercase</SectionLabel>
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1C2B1A' }}>
              <div className="p-8 md:p-10">
                <p className="text-xs uppercase tracking-widest mb-7" style={{ color: '#ECD858' }}>
                  single typeface · unoccupied territory — no competitor uses this register
                </p>
                <div className="space-y-4">
                  {[
                    { w: '300', s: 'emotional moments live here', size: 'clamp(22px, 4vw, 42px)' },
                    { w: '400', s: 'body copy breathes at this weight', size: 'clamp(18px, 3vw, 34px)' },
                    { w: '700', s: 'headings anchor the page', size: 'clamp(16px, 2.5vw, 28px)' },
                  ].map((t) => (
                    <div key={t.w} className="flex items-baseline gap-4">
                      <span className="text-[9px] font-mono w-7 flex-none" style={{ color: 'rgba(242,237,224,0.2)' }}>{t.w}</span>
                      <p style={{ color: '#F2EDE0', fontSize: t.s, fontWeight: t.w, lineHeight: 1.1, fontFamily: "'Satoshi', sans-serif" }}>{t.s}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-7 pt-5 text-xs" style={{ color: 'rgba(242,237,224,0.35)', borderTop: '1px solid rgba(242,237,224,0.08)' }}>
                  all copy lowercase — removes institutional register without losing legibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TREE ILLUSTRATIONS
      ══════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6"
        style={{ background: 'linear-gradient(180deg, #F0F5EE 0%, #FFFFFF 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="kz-reveal mb-10">
            <SectionLabel>illustration system</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: T.heading }}>three trees. 18 illustrations.</h2>
            <p className="text-base" style={{ color: T.secondary }}>each tree type mirrors the user's personality from stage 1. the personality is visible from the seed.</p>
          </div>

          {/* Tree growth sequences */}
          <div className="kz-reveal space-y-4 mb-8">
            {[
              { img: '/kizuku/crystal-tree-growth.png',  caption: 'seeker (crystal) — fractures outward at every growth stage' },
              { img: '/kizuku/spiral-tree-growth.png',   caption: 'optimizer (spiral) — logarithmic coils tighten as the tree matures' },
              { img: '/kizuku/strata-tree-growth.png',   caption: 'planner (strata) — wide, ancient, patient — builds mass before height' },
            ].map((f) => (
              <div key={f.caption} className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(44,82,40,0.08)', boxShadow: '0 2px 16px rgba(44,82,40,0.06)' }}>
                <img src={f.img} alt={f.caption} className="w-full h-auto block" loading="lazy" />
                <div className="px-5 py-3" style={{ backgroundColor: '#FAFAFA', borderTop: '1px solid rgba(44,82,40,0.06)' }}>
                  <p className="text-xs italic" style={{ color: T.caption }}>{f.caption}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ANIMATIONS
      ══════════════════════════════════════════════════ */}
      <section id="sec-animation" className="py-20 md:py-28 px-6" style={{ backgroundColor: '#1C2B1A' }}>
        <div className="max-w-5xl mx-auto">
          <div className="kz-reveal mb-10">
            <SectionLabel color="rgba(242,237,224,0.45)">animations</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#F2EDE0' }}>
              every animation has a reason<br />
              <span style={{ color: 'rgba(242,237,224,0.35)' }}>that can be stated in one sentence.</span>
            </h2>
            <p className="text-base" style={{ color: 'rgba(242,237,224,0.55)' }}>if it can't be explained, it was removed. each animation maps to a japanese principle.</p>
          </div>

          {/* Video player */}
          <div className="kz-reveal mb-10 rounded-3xl overflow-hidden relative cursor-pointer"
            style={{ backgroundColor: '#0F1A0E', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}
            onClick={toggleVideo}>
            <video
              ref={videoRef}
              className="w-full h-auto block"
              src="/kizuku/tree-animation.mp4"
              loop
              playsInline
              preload="metadata"
            />
            {!videoPlaying && (
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'radial-gradient(circle, rgba(44,82,40,0.3) 0%, rgba(15,26,14,0.7) 100%)' }}>
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full"
                    style={{ backgroundColor: '#ECD858', boxShadow: '0 8px 32px rgba(236,216,88,0.4)' }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6 4L16 10L6 16V4Z" fill="#1C2B1A" />
                    </svg>
                  </div>
                  <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(242,237,224,0.7)' }}>play tree animation</p>
                </div>
              </div>
            )}
          </div>
          {videoPlaying && (
            <button onClick={toggleVideo} className="mb-8 text-xs uppercase tracking-widest flex items-center gap-2"
              style={{ color: 'rgba(242,237,224,0.4)' }}>
              <span>⏸</span> pause
            </button>
          )}

          {/* Animation principles table */}
          <div className="kz-reveal grid md:grid-cols-2 gap-4">
            {[
              { anim: 'loading — two breathing circles', spec: '4s duration',           principle: 'Ma', reason: 'intentional pause. the loading is not dead time. it is part of the ritual.' },
              { anim: 'home tree — breathing scale',     spec: '0.98→1.0, 4s loop',    principle: 'Ma', reason: 'the tree is alive. if it breathes, the user cares about it.' },
              { anim: 'quiz — staggered option reveal',  spec: '60ms per option',       principle: 'Mushin', reason: 'user finishes reading before options appear. turns assessment into conversation.' },
              { anim: 'growth — tree first, text after', spec: 'tree + 1.2s delay',    principle: 'Zanshin', reason: 'feeling before naming. the tree grows first. then words confirm what was already felt.' },
            ].map((a) => (
              <div key={a.anim} className="rounded-2xl p-5" style={{ backgroundColor: 'rgba(242,237,224,0.04)', border: '1px solid rgba(242,237,224,0.08)' }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-xs font-semibold" style={{ color: 'rgba(242,237,224,0.8)' }}>{a.anim}</p>
                  <span className="flex-none text-[9px] px-2 py-0.5 rounded-full font-medium uppercase tracking-widest"
                    style={{ backgroundColor: '#ECD85820', color: '#ECD858' }}>{a.principle}</span>
                </div>
                <p className="text-[10px] font-mono mb-2" style={{ color: 'rgba(242,237,224,0.35)' }}>{a.spec}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(242,237,224,0.5)' }}>{a.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          KEY DECISIONS
      ══════════════════════════════════════════════════ */}
      <section id="sec-decisions" className="py-20 md:py-28 px-6"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F0E8 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="kz-reveal mb-12">
            <SectionLabel>what makes it different</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: T.heading }}>
              reasoning over convention.
            </h2>
            <p className="mt-3 text-base max-w-lg" style={{ color: T.secondary, lineHeight: 1.7 }}>
              every decision in kizuku has a one-sentence reason. if it couldn't be explained, it was removed.
            </p>
          </div>

          <div className="kz-cards grid md:grid-cols-2 gap-4 mb-5">
            {TOP_DECISIONS.map((d) => (
              <div key={d.n} className="kz-card rounded-2xl p-7"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(44,82,40,0.09)', boxShadow: '0 2px 16px rgba(44,82,40,0.04)' }}>
                <p className="text-4xl font-bold mb-3" style={{ color: '#2C5228', lineHeight: 1 }}>{d.n}</p>
                <h4 className="font-bold text-sm md:text-base mb-2 leading-snug" style={{ color: T.heading }}>{d.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: T.body }}>{d.body}</p>
              </div>
            ))}
          </div>

          {/* No streaks — highlighted */}
          <div className="kz-reveal rounded-2xl p-8 md:p-10"
            style={{ background: 'linear-gradient(135deg, #E0906F 0%, #D4785A 100%)' }}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>ethical design decision</p>
                <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#FFFFFF' }}>streaks were explicitly designed out.</h3>
                <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  not an oversight — a decision. streaks create performance anxiety in a user who already has it. a broken streak becomes a new thing to overthink. missing a day does not shrink the tree.
                </p>
              </div>
            </div>
            <p className="mt-6 text-base italic font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
              "the app is designed to be put down without consequence. that is a feature, not a bug."
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FULL PROCESS CTA
      ══════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: '#F9FAF9' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="kz-reveal">
            <p className="text-4xl mb-4 select-none" style={{ opacity: 0.18 }}>気づく</p>
            <SectionLabel>the full story</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: T.heading }}>
              four stages. every decision documented.<br />from spirit animal to interface.
            </h2>
            <p className="text-base mb-8 max-w-md mx-auto" style={{ color: T.body, lineHeight: 1.7 }}>
              the full case study covers the complete creative process — the painting that became the design brief, four naming rejections, competitive analysis, and 18 illustrations built hand to AI to digital.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="/kizuku/Kizuku-Creative-Process.pdf" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300"
                style={{ backgroundColor: T.heading, color: '#F2EDE0' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2C5228'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = T.heading; }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                open case study
              </a>
              <span className="text-xs uppercase tracking-widest" style={{ color: T.caption }}>pdf · 30 pages</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="py-12 px-6 md:px-12" style={{ borderTop: `1px solid ${T.heading}0D` }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src="/kizuku/Home/logo.png" alt="Kizuku" className="h-8 w-auto" style={{ opacity: 0.5 }} />
            <div>
              <p className="text-xs font-medium" style={{ color: T.body }}>kizuku · ongoing project</p>
              <p className="text-[10px]" style={{ color: T.caption }}>iOS app in development · UI screens being refined</p>
            </div>
          </div>
          <Link href="/"
            className="text-xs font-medium uppercase tracking-widest transition-colors"
            style={{ color: T.secondary }}
            onMouseEnter={(e) => { e.currentTarget.style.color = T.heading; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = T.secondary; }}>
            ← back to portfolio
          </Link>
        </div>
      </footer>

    </main>
  );
}
