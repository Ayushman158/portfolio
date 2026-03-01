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


    // Cleanup
    return () => {
      window.removeEventListener('mousemove', moveCursor);
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
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[90%] max-w-5xl stagger-fade">
        <div className="bg-white/80 backdrop-blur-lg border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl md:rounded-full relative flex flex-row items-center justify-between px-3 md:px-6 py-2 md:py-3">
          {/* Logo Left */}
          <Link href="/" className="flex items-center z-10 group flex-shrink-0">
            <img src="/assets/avatar.png" alt="Ayushman Bharadwaj" className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain object-bottom transition-transform duration-300 group-hover:scale-105" />
          </Link>

          {/* Centered Links */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8 flex-1 px-2 md:px-4 shrink min-w-0">
            <Link href="#work" className="text-[11px] sm:text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors whitespace-nowrap">
              Work
            </Link>
            <Link href="/experiments" className="text-[11px] sm:text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors whitespace-nowrap">
              Experiments
            </Link>
            <Link href="/resume" className="text-[11px] sm:text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors whitespace-nowrap">
              Resume
            </Link>
          </div>

          {/* CTA Right */}
          <div ref={magnetBtn} className="relative inline-block cursor-pointer z-10 flex-shrink-0">
            <Link href="https://www.linkedin.com/in/ayushman-bharadwaj-660759289/" target="_blank" rel="noopener noreferrer" className="px-3 sm:px-4 py-2 md:px-5 md:py-2 text-[11px] sm:text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center whitespace-nowrap">
              <span ref={magnetText} className="block">Connect</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#f8fafc] bg-architectural-grid">
        {/* Main Content Container */}
        <div className="w-full mx-auto px-6 md:px-12 relative z-10 flex flex-col justify-center translate-y-8 md:translate-y-12 mt-12">
          {/* Friendly Typography */}
          <div className="relative mix-blend-multiply w-full max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.3] md:leading-[1.2]">
              <div className="overflow-hidden pb-1">
                <span className="block stagger-fade text-slate-800">
                  Hi, I am Ayushman Bharadwaj. <br className="hidden md:block" />
                  I am an <span className="text-blue-600 font-black">interaction designer</span> <span className="inline-block animate-waving-hand origin-bottom-right">👋</span>
                </span>
              </div>
            </h1>

            {/* Skill Pills */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-6 md:mt-8 stagger-fade">
              <span className="px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
                UX/UI Design
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold bg-purple-50 text-purple-600 border border-purple-100 shadow-sm">
                Design Systems
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
                Vibe Coding
              </span>
            </div>

            <div className="mt-16 flex justify-center stagger-fade w-full mx-auto pb-4">
              <Link
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="interactive-target text-xs font-mono uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors flex flex-col items-center gap-2 group mx-auto cursor-pointer"
              >
                <span>Scroll down</span>
                <i className="ph ph-arrow-down text-lg animate-bounce group-hover:text-blue-600"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Selected Works List */}
      <section id="work" className="py-24 md:py-32 px-6 bg-white border-t border-slate-100 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 card-reveal">
            <h2 className="text-sm font-mono tracking-[0.2em] text-slate-400 uppercase mb-4">Selected Works</h2>
            <p className="text-xl md:text-2xl text-slate-800 tracking-tight leading-[1.4] max-w-2xl font-medium">
              End-to-end engineered products demonstrating design thinking and technical execution.
            </p>
          </div>

          <div className="flex flex-col border-t border-slate-200">
            {/* Project Row 1 */}
            <Link href="/case-study" className="group flex flex-col md:flex-row md:items-center justify-between py-8 md:py-10 border-b border-slate-200 interactive-target">
              <div className="flex-1 mb-4 md:mb-0 pr-4">
                <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors mb-2 flex items-center gap-3">
                  Hoychoy Cafe
                  <i className="ph ph-arrow-up-right text-2xl md:text-3xl opacity-0 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300"></i>
                </h3>
                <p className="text-slate-500 text-lg md:text-xl leading-relaxed">End-to-end hyperlocal delivery web application.</p>
              </div>
              <div className="flex items-center gap-3 md:w-64 md:justify-end shrink-0">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">UX Design</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">2024</span>
              </div>
            </Link>
          </div>
          
          {/* AI Experiments CTA */}
          <div className="mt-24 text-center">
            <Link href="/experiments" className="group inline-flex items-center gap-3 text-sm md:text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors interactive-target px-8 py-4 rounded-full border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50">
              Explore AI Experiments
              <i className="ph ph-arrow-right transition-transform group-hover:translate-x-1"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 overflow-hidden bg-slate-50 border-t border-slate-100">
        {/* Subtle Radial Gradient Background */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center top, rgba(14, 165, 233, 0.08), transparent 70%)' }}></div>

        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center justify-center relative z-10">
          {/* Avatar Logo */}
          <Link href="/" className="mb-6 flex items-center justify-center w-14 h-14 rounded-full border border-slate-200 bg-white shadow-sm overflow-hidden interactive-target hover:scale-[1.05] transition-transform">
            <img src="/assets/avatar.png" alt="Ayushman Bharadwaj" className="w-full h-full object-contain object-bottom" />
          </Link>

          {/* Social Links */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="mailto:ayushman15899@gmail.com" className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-blue-500 hover:border-blue-200 hover:shadow-md transition-all interactive-target">
              <i className="ph-fill ph-envelope-simple text-lg"></i>
            </Link>
            <Link href="https://www.linkedin.com/in/ayushman-bharadwaj-660759289/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-blue-700 hover:border-blue-200 hover:shadow-md transition-all interactive-target">
              <i className="ph-fill ph-linkedin-logo text-lg"></i>
            </Link>
            <Link href="https://x.com/AyushmanBharad" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-sky-500 hover:border-sky-200 hover:shadow-md transition-all interactive-target">
              <i className="ph-fill ph-twitter-logo text-lg"></i>
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-slate-400 text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} Ayushman. All rights reserved.
          </p>
        </div>
      </footer>

    </main>
  );
}
