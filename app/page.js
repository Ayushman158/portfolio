'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Home() {
  // Cursor Refs
  const cursorDot = useRef(null);
  const cursorRing = useRef(null);

  // Magnetic Button Ref
  const magnetBtn = useRef(null);
  const magnetText = useRef(null);

  // Bento Grid Ref for Mouse Glow
  const gridRef = useRef(null);

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // 1. Custom Cursor Logic
    const xToDot = gsap.quickTo(cursorDot.current, "x", { duration: 0.1, ease: "power3" });
    const yToDot = gsap.quickTo(cursorDot.current, "y", { duration: 0.1, ease: "power3" });

    const moveCursor = (e) => {
      xToDot(e.clientX);
      yToDot(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);

    // Interactive Elements Cursor State
    const interactiveEls = document.querySelectorAll('a, button, .interactive-target');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursorDot.current, { scale: 1.1, transformOrigin: 'top left', duration: 0.2 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursorDot.current, { scale: 1, transformOrigin: 'top left', duration: 0.2 });
      });
    });

    // Random Color on Window Enter
    const figmaColors = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f43f5e'];
    const handleMouseEnter = () => {
      const randomColor = figmaColors[Math.floor(Math.random() * figmaColors.length)];
      if (cursorDot.current) {
        const path = cursorDot.current.querySelector('path');
        const tag = cursorDot.current.querySelector('.cursor-name-tag');
        if (path) path.setAttribute('fill', randomColor);
        if (tag) tag.style.backgroundColor = randomColor;
      }
    };
    document.addEventListener('mouseenter', handleMouseEnter);

    // 2. Magnetic Button Logic for the primary CTA
    if (magnetBtn.current) {
      magnetBtn.current.addEventListener('mousemove', (e) => {
        const bound = magnetBtn.current.getBoundingClientRect();
        const centerX = bound.left + bound.width / 2;
        const centerY = bound.top + bound.height / 2;
        // Calculate distance from center (dampened by 0.4 for smooth resistance)
        const distX = (e.clientX - centerX) * 0.4;
        const distY = (e.clientY - centerY) * 0.4;

        gsap.to(magnetBtn.current, { x: distX, y: distY, duration: 0.4, ease: "power2.out" });
        if (magnetText.current) {
          gsap.to(magnetText.current, { x: distX * 0.5, y: distY * 0.5, duration: 0.4, ease: "power2.out" });
        }
      });
      magnetBtn.current.addEventListener('mouseleave', () => {
        gsap.to(magnetBtn.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
        if (magnetText.current) gsap.to(magnetText.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
      });
    }

    // 3. Staggered Fade-in-up animations for Hero
    gsap.fromTo('.stagger-fade',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );

    // 4. Scroll Reveal for Portfolio Cards
    const cards = document.querySelectorAll('.card-reveal');
    cards.forEach(card => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        { scrollTrigger: { trigger: card, start: "top 85%" }, opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    });

    // 5. Text Scramble Effect
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const targets = document.querySelectorAll('.scramble-text');

    targets.forEach(target => {
      let iterations = 0;
      const originalText = target.getAttribute('data-value');

      const interval = setInterval(() => {
        target.innerText = originalText
          .split("")
          .map((letter, index) => {
            if (index < iterations) {
              return originalText[index];
            }
            // Preserve spaces
            if (originalText[index] === " ") return " ";
            return letters[Math.floor(Math.random() * 26)];
          })
          .join("");

        if (iterations >= originalText.length) {
          clearInterval(interval);
        }

        iterations += 1 / 2; // Speed of decode
      }, 30);
    });

    // 6. Mouse Tracking Glow for Bento Cards
    const handleMouseMoveGlow = (e) => {
      const cards = gridRef.current?.querySelectorAll('.bento-card');
      cards?.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };
    window.addEventListener('mousemove', handleMouseMoveGlow);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousemove', handleMouseMoveGlow);
      document.removeEventListener('mouseenter', handleMouseEnter);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-blue-200 overflow-x-hidden relative">

      {/* Custom Cursor Elements */}
      <div className="hidden md:block">
        <div ref={cursorDot} className="fixed top-0 left-0 pointer-events-none z-[9999] flex flex-col items-start drop-shadow-md">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L8 20.5L11 12.5L19 9.5L1 1Z" fill="#0ea5e9" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <div className="cursor-name-tag bg-[#0ea5e9] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md ml-3 -mt-1 whitespace-nowrap transition-colors duration-300">
            You
          </div>
        </div>
      </div>

      {/* Pill Navigation */}
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[90%] max-w-5xl stagger-fade">
        <div className="pill-nav shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative flex items-center justify-between px-6 py-3">
          {/* Logo Left */}
          <Link href="/" className="flex items-center gap-3 z-10 group">
            <img src="/assets/avatar.png" alt="Ayushman Bharadwaj" className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border border-slate-200 shadow-sm transition-transform duration-300 group-hover:scale-105" />
            <span className="text-xl font-bold tracking-tight text-slate-900">Ayushman<span className="text-blue-500">.</span></span>
          </Link>

          {/* Centered Links (Absolute relative to pill) */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
            <Link href="#work" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Work
            </Link>
            <Link href="/resume" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Resume
            </Link>
          </div>

          {/* CTA Right */}
          <div ref={magnetBtn} className="relative inline-block cursor-pointer z-10">
            <Link href="mailto:ayushman15899@gmail.com" className="px-4 py-2 md:px-5 md:py-2 text-sm font-medium text-white bg-blue-500 rounded-full shadow-md flex items-center justify-center pointer-events-none">
              <span ref={magnetText} className="block pointer-events-none">Connect</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#f8fafc] bg-architectural-grid">

        {/* Top-Left Context */}
        <div className="absolute top-28 left-6 md:left-12 z-20 overflow-hidden">
          <span className="block text-xs font-mono font-bold tracking-[0.2em] text-slate-400 uppercase stagger-fade">
            India · IND
          </span>
        </div>

        {/* Main Content Container */}
        <div className="w-full mx-auto px-6 md:px-12 relative z-10 flex flex-col justify-center -translate-y-8">

          {/* Massive Typography */}
          <div className="relative mix-blend-multiply w-full">
            <h1 className="text-[12vw] xl:text-[11vw] leading-[0.85] font-light tracking-tighter text-slate-900 uppercase flex flex-col">
              <div className="overflow-hidden">
                <span className="block stagger-fade">AYUSHMAN</span>
              </div>
              <div className="overflow-hidden flex flex-col md:flex-row md:items-end gap-4 md:gap-8 xl:gap-12">
                <span className="block stagger-fade relative group cursor-default">
                  <span className="relative z-10">BHARADWAJ</span>
                  {/* Glitch Accent on Hover */}
                  <span className="absolute inset-0 text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-[6px] transition-all duration-300 pointer-events-none mix-blend-screen">BHARADWAJ</span>
                  <span className="absolute inset-0 text-orange-500 opacity-0 group-hover:opacity-100 group-hover:-translate-x-[6px] transition-all duration-300 pointer-events-none mix-blend-multiply">BHARADWAJ</span>
                </span>

                {/* Asymmetrical Bio */}
                <div className="pb-2 md:pb-4 md:mb-1 max-w-xs md:max-w-[280px] xl:max-w-sm stagger-fade">
                  <p className="text-base md:text-lg xl:text-xl text-slate-500 font-light leading-snug tracking-normal normal-case">
                    <strong className="font-medium text-slate-800">Interaction Designer.</strong><br /> Bridging human behavior and robust technology.
                  </p>
                </div>
              </div>
            </h1>
          </div>
        </div>

        {/* Bottom CTAs */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 fade-in-up">
          <div className="bg-slate-900 p-1.5 rounded-[2rem] flex flex-wrap md:flex-nowrap justify-center gap-1 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] backdrop-blur-md">
            <Link href="#work" className="interactive-target px-8 py-3 text-sm font-semibold text-white bg-transparent hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 whitespace-nowrap">
              Selected Works
            </Link>
            <div className="w-px h-auto bg-slate-700/50 mx-1 my-2 hidden md:block"></div>
            <Link href="https://www.linkedin.com/in/ayushman-bharadwaj-660759289/" target="_blank" className="interactive-target w-12 h-12 flex items-center justify-center rounded-full bg-transparent hover:bg-white/10 text-white transition-colors">
              <i className="ph-fill ph-linkedin-logo text-xl"></i>
            </Link>
            <Link href="https://x.com/AyushmanBharad" target="_blank" className="interactive-target w-12 h-12 flex items-center justify-center rounded-full bg-transparent hover:bg-white/10 text-white transition-colors">
              <i className="ph-fill ph-twitter-logo text-xl"></i>
            </Link>
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Or scroll down ↓</span>
        </div>
      </section>

      {/* Selected Works Section */}
      <section id="work" className="py-32 px-6 bg-white border-t border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 card-reveal">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Selected Works</h2>
            <p className="text-lg text-slate-500 max-w-2xl">A collection of end-to-end engineered products demonstrating both design thinking and technical execution.</p>
          </div>

          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            {/* Bento Box 1: Hoychoy Card (Spans 2 columns, 2 rows) */}
            <Link href="/case-study" className="md:col-span-2 md:row-span-2 group block card-reveal interactive-target h-full bento-card relative overflow-hidden rounded-[2rem]">
              <div className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-20" style={{ background: 'radial-gradient(800px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(14,165,233,0.08), transparent 40%)' }}></div>
              <div className="bg-white rounded-[2rem] p-6 h-full flex flex-col transition-all duration-500 hover:bg-slate-50 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10">
                {/* Image Container */}
                <div className="flex-grow bg-slate-100 rounded-3xl overflow-hidden relative mb-6 flex items-end justify-center px-8 pt-12 group-hover:bg-blue-50/50 transition-colors duration-500">
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
                  <img src="/assets/hero.png" alt="Hoychoy Cafe Web App" className="relative w-[90%] md:w-[75%] h-auto rounded-t-2xl shadow-[0_0_50px_rgba(0,0,0,0.15)] transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-4 object-cover object-top" />
                </div>
                {/* Content */}
                <div className="px-2 mt-auto">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-500 rounded-full">Frontend</span>
                    <span className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-500 rounded-full">UX Design</span>
                    <span className="px-3 py-1 bg-blue-50 border border-blue-200 flex flex-row items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 rounded-full"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>Live</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    Hoychoy Cafe <i className="ph ph-arrow-up-right opacity-0 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300"></i>
                  </h3>
                  <p className="text-slate-500 text-lg leading-relaxed">End-to-end hyperlocal delivery app.</p>
                </div>
              </div>
            </Link>

            {/* Bento Box 2: Skill Focus */}
            <div className="md:col-span-1 md:row-span-1 bg-white rounded-[2rem] p-8 flex flex-col justify-between border border-slate-200 shadow-sm group card-reveal interactive-target hover:-translate-y-1 transition-transform duration-500 bento-card relative overflow-hidden">
              <div className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-20" style={{ background: 'radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(14,165,233,0.06), transparent 40%)' }}></div>
              <div className="relative z-10 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                <i className="ph ph-lightning text-2xl text-slate-600 group-hover:text-blue-500"></i>
              </div>
              <div className="relative z-10">
                <h4 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Vibe Coding</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Bridging the gap between high-fidelity design logic and rapid, AI-assisted engineering.</p>
              </div>
            </div>

            {/* Bento Box 3: Metric */}
            <div className="md:col-span-1 md:row-span-1 bg-white rounded-[2rem] p-8 flex flex-col justify-between border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group card-reveal interactive-target hover:bg-slate-50 transition-colors duration-500 bento-card relative overflow-hidden">
              <div className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-20" style={{ background: 'radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(239,68,68,0.06), transparent 40%)' }}></div>
              <div className="relative z-10 text-right">
                <i className="ph ph-arrows-in line-through text-3xl text-slate-300 group-hover:text-red-400 transition-colors duration-500"></i>
              </div>
              <div className="relative z-10">
                <h4 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tighter">Zero</h4>
                <p className="text-slate-500 font-medium leading-relaxed uppercase tracking-widest text-sm">Friction UX</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Weekend Builds Section */}
      <section className="py-24 px-6 bg-slate-50 border-t border-slate-100 relative z-10 overflow-hidden">
        {/* Decorative Grid BG */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-12 card-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight flex items-center gap-3">
              <i className="ph-fill ph-flask text-blue-500"></i> Weekend Builds
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl">Quirky projects and mini-experiments built to explore new interactions, AI APIs, and frontend physics outside of regular hours.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Project 1: FieldNote Pipeline */}
            <Link href="https://fieldnote-ten.vercel.app/" target="_blank" className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group card-reveal interactive-target flex flex-col relative overflow-hidden">
              {/* Background Accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors duration-700"></div>

              <div className="relative aspect-video bg-slate-800/80 rounded-2xl mb-6 flex items-center justify-center p-2 border border-slate-700 overflow-hidden group-hover:border-blue-500/30 transition-colors">
                <img src="/assets/fieldnote-ss.png" alt="FieldNote AI Framework" className="w-full h-full object-cover rounded-xl shadow-lg opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              </div>
              <div className="mt-auto relative z-10">
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors flex items-center gap-2">FieldNote AI <i className="ph ph-arrow-up-right opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></i></h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">Connecting Web Speech API to Gemini 1.5 Flash to automatically parse and tag unstructured user interview transcripts.</p>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-300 rounded-md">Next.js</span>
                  <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-300 rounded-md">Gemini API</span>
                </div>
              </div>
            </Link>

            {/* Project 2: Coming Soon */}
            <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-200/50 border-dashed flex flex-col items-center justify-center text-center opacity-60 card-reveal">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <i className="ph-duotone ph-hammer text-2xl text-slate-400"></i>
              </div>
              <h4 className="text-lg font-bold text-slate-700 tracking-widest uppercase mb-2">More Builds Coming Soon</h4>
              <p className="text-sm text-slate-500 font-mono">Currently cooking in the lab.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive About Section */}
      <section id="about" className="py-32 px-6 bg-slate-50 relative z-10 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">

          <div className="space-y-16">
            {/* Primary Intersection Statement */}
            <h2 className="stagger-fade text-4xl md:text-6xl font-extrabold text-slate-900 leading-normal tracking-tight max-w-4xl py-2">
              I design at the intersection of <span className="whitespace-nowrap"><span className="text-gradient pr-1 pb-1">behavior</span>,</span> <span className="whitespace-nowrap"><span className="text-gradient pr-1 pb-1">business</span>,</span> and <span className="text-gradient pr-1 pb-1">technology</span>.
            </h2>

            {/* Secondary Traits/Hobbies */}
            <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-slate-200">

              <div className="stagger-fade space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">The Approach</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  My background spans <span className="font-semibold text-slate-800">product development</span> and <span className="font-semibold text-slate-800">engineering</span>, allowing me to build what I design. I focus on creating systems that are not only viable and feasible, but deeply resonant with human behavior.
                </p>
              </div>

              <div className="stagger-fade space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Off-Screen</h3>
                <p className="text-lg text-slate-500">
                  When I'm not working on digital products, I'm usually thinking about my next idea while...
                </p>

                {/* Interactive Hobby Pills */}
                <div className="flex flex-wrap gap-3">
                  <div className="interactive-target group cursor-none px-5 py-3 rounded-full border border-slate-200 bg-white shadow-sm flex items-center gap-2 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
                    <i className="ph ph-barbell text-xl text-slate-400 group-hover:text-blue-500 transition-colors"></i>
                    <span className="font-medium text-slate-700 group-hover:text-blue-700">In the Gym</span>
                  </div>

                  <div className="interactive-target group cursor-none px-5 py-3 rounded-full border border-slate-200 bg-white shadow-sm flex items-center gap-2 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
                    <i className="ph ph-swimming-pool text-xl text-slate-400 group-hover:text-blue-500 transition-colors"></i>
                    <span className="font-medium text-slate-700 group-hover:text-blue-700">In the Pool</span>
                  </div>

                  <div className="interactive-target group cursor-none px-5 py-3 rounded-full border border-slate-200 bg-white shadow-sm flex items-center gap-2 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
                    <i className="ph ph-guitar text-xl text-slate-400 group-hover:text-blue-500 transition-colors"></i>
                    <span className="font-medium text-slate-700 group-hover:text-blue-700">Playing Guitar</span>
                  </div>

                  <div className="interactive-target group cursor-none px-5 py-3 rounded-full border border-slate-200 bg-white shadow-sm flex items-center gap-2 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
                    <i className="ph ph-coffee text-xl text-slate-400 group-hover:text-blue-500 transition-colors"></i>
                    <span className="font-medium text-slate-700 group-hover:text-blue-700">Having Coffee</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 flex items-center gap-6">
            <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 interactive-target">
              Ayushman<span className="text-blue-500">.</span>
            </Link>
            <div className="flex items-center gap-4 text-slate-400">
              <Link href="https://x.com/AyushmanBharad" target="_blank" className="hover:text-blue-500 transition-colors interactive-target">
                <i className="ph-fill ph-twitter-logo text-xl"></i>
              </Link>
              <Link href="https://www.linkedin.com/in/ayushman-bharadwaj-660759289/" target="_blank" className="hover:text-blue-700 transition-colors interactive-target">
                <i className="ph-fill ph-linkedin-logo text-xl"></i>
              </Link>
            </div>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Ayushman Bharadwaj. All rights reserved.
          </p>
        </div>
      </footer>

    </main>
  );
}
