'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// EOD/POD Handbook — "The Innovators Handbook"
// Bauhaus-inspired palette from the original document
const RED = '#E03028';
const BLUE = '#1A3FAA';
const GOLD = '#F0B429';

export default function EODHandbook() {
    const cursorDot = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const xToDot = gsap.quickTo(cursorDot.current, 'x', { duration: 0.1, ease: 'power3' });
        const yToDot = gsap.quickTo(cursorDot.current, 'y', { duration: 0.1, ease: 'power3' });
        const moveCursor = (e) => { xToDot(e.clientX); yToDot(e.clientY); };
        window.addEventListener('mousemove', moveCursor);

        const interactiveEls = document.querySelectorAll('a, button, .interactive-target');
        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => gsap.to(cursorDot.current, { scale: 1.1, transformOrigin: 'top left', duration: 0.2 }));
            el.addEventListener('mouseleave', () => gsap.to(cursorDot.current, { scale: 1, transformOrigin: 'top left', duration: 0.2 }));
        });

        const handleMouseEnter = () => {
            const colors = [RED, BLUE, GOLD, '#0ea5e9', '#10b981'];
            const c = colors[Math.floor(Math.random() * colors.length)];
            if (cursorDot.current) {
                const path = cursorDot.current.querySelector('path');
                const tag = cursorDot.current.querySelector('.cursor-name-tag');
                if (path) path.setAttribute('fill', c);
                if (tag) tag.style.backgroundColor = c;
            }
        };
        document.addEventListener('mouseenter', handleMouseEnter);

        const fadeSections = document.querySelectorAll('.fade-in-up');
        fadeSections.forEach((section) => {
            gsap.fromTo(section,
                { opacity: 0, y: 30 },
                { scrollTrigger: { trigger: section, start: 'top 88%' }, opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
            );
        });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseenter', handleMouseEnter);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <main className="min-h-screen bg-[#f8fafc] text-slate-900 overflow-x-hidden relative">

            {/* Custom Cursor */}
            <div className="hidden md:block">
                <div ref={cursorDot} className="fixed top-0 left-0 pointer-events-none z-[9999] flex flex-col items-start drop-shadow-md">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L8 20.5L11 12.5L19 9.5L1 1Z" fill={RED} stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    <div className="cursor-name-tag text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md ml-3 -mt-1 whitespace-nowrap transition-colors duration-300" style={{ backgroundColor: RED }}>
                        Read
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl fade-in-up">
                <div className="pill-nav shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 interactive-target">
                        Ayushman<span className="text-blue-500">.</span>
                    </Link>
                    <Link href="/#work" className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 interactive-target">
                        <i className="ph ph-arrow-left"></i> Back to Portfolio
                    </Link>
                </div>
            </nav>

            {/* ── COVER ─────────────────────────────────────────────── */}
            <section className="relative w-full min-h-screen flex items-end overflow-hidden bg-[#f0ece4]">

                {/* Bauhaus grid background */}
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none" aria-hidden>
                    <div className="col-start-1 row-start-1 col-span-1 row-span-2" style={{ backgroundColor: RED }} />
                    <div className="col-start-3 row-start-1 col-span-2 row-span-1" style={{ backgroundColor: BLUE }} />
                    <div className="col-start-4 row-start-2 col-span-1 row-span-2" style={{ backgroundColor: GOLD }} />
                    <div className="col-start-1 row-start-4 col-span-2 row-span-1" style={{ backgroundColor: BLUE }} />
                    {/* Circle */}
                    <div className="absolute top-[14%] left-[10%] w-[12vw] h-[12vw] rounded-full bg-white opacity-20 mix-blend-overlay" />
                    <div className="absolute top-[40%] left-[22%] w-[8vw] h-[8vw] rounded-full" style={{ backgroundColor: BLUE, opacity: 0.25 }} />
                </div>

                {/* Cover text */}
                <div className="relative z-10 w-full px-8 md:px-20 pb-20 pt-48">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-12">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-6">
                                EOD / POD Masterclass Compilation
                            </p>
                            <h1 className="text-[clamp(3.5rem,10vw,9rem)] font-black leading-[0.9] tracking-tighter text-slate-900 mb-8">
                                The<br />Innovators<br />
                                <span style={{ color: RED }}>Handbook</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 max-w-md font-medium leading-relaxed">
                                Tracing the journey from fundamentals to applied design practice — a compilation of work from the Exploration of Design Principles course.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 text-right md:pb-4">
                            <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Ayushman Bharadwaj</p>
                            <div className="flex gap-2 justify-end flex-wrap">
                                {['Assignment 1', 'Assignment 2', 'Assignment 3', 'Assignment 4', 'Activities', 'Exploration'].map(c => (
                                    <span key={c} className="px-2.5 py-1 bg-white/60 border border-slate-300 text-[11px] font-bold uppercase tracking-widest text-slate-600 rounded">
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll cue */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">Scroll</p>
                    <div className="w-px h-10 bg-slate-500" />
                </div>
            </section>

            {/* ── INTRODUCTION ────────────────────────────────────────── */}
            <section className="py-28 px-6 bg-white border-b border-slate-100 fade-in-up">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                    <div className="md:col-span-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 block mb-3">Introduction</span>
                        <div className="w-8 h-0.5 mb-8" style={{ backgroundColor: RED }} />
                        <p className="text-slate-400 text-sm leading-relaxed">
                            "Every design begins with a dot, grows with a line, and finds meaning in composition."
                        </p>
                    </div>
                    <div className="md:col-span-8">
                        <p className="text-2xl md:text-3xl font-medium text-slate-800 leading-[1.4] mb-8">
                            I am Ayushman Bharadwaj, a design student driven by curiosity and exploration. This handbook brings together my assignments, each reflecting experiments with form, colour, and composition.
                        </p>
                        <p className="text-slate-500 text-base leading-relaxed mb-4">
                            The Exploration of Design Principles and Observed Design (EOD POD) course has been central to shaping my foundation as a designer. It began with the simplest visual elements—dots and lines—and gradually expanded into textures, shapes, and colours, each revealing how design is built from the ground up.
                        </p>
                        <p className="text-slate-500 text-base leading-relaxed">
                            Beyond practice, EOD POD encouraged observation and reflection—helping me connect classroom learnings with the design language present in everyday life. It showed me that design is not only about creating but also about making intentional choices that communicate meaning.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── INDEX ───────────────────────────────────────────────── */}
            <section className="py-20 px-6 bg-[#f8fafc] border-b border-slate-100 fade-in-up">
                <div className="max-w-6xl mx-auto">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 block mb-10">Contents</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { num: '01', title: 'Freedom & Discipline', subtitle: 'Assignment 1 — Organic & Geometric Lines' },
                            { num: '02', title: 'The Journey of Colour', subtitle: 'Assignment 2 — Colour Theory' },
                            { num: '03', title: 'Reimagining Tradition', subtitle: 'Assignment 3 — Aipan Art' },
                            { num: '04', title: 'Imagining Futures', subtitle: 'Assignment 4 — Futuristic Poster' },
                            { num: '05', title: 'Activities', subtitle: 'Textures & Campus Observation' },
                            { num: '06', title: 'Explorations', subtitle: 'Free-form Work & Reflection' },
                        ].map(({ num, title, subtitle }) => (
                            <div key={num} className="flex gap-4 p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors interactive-target">
                                <span className="text-3xl font-black text-slate-100">{num}</span>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm mb-1">{title}</p>
                                    <p className="text-xs text-slate-400">{subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ASSIGNMENT 1 ────────────────────────────────────────── */}
            <section className="py-28 px-6 bg-white border-b border-slate-100 fade-in-up">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-start gap-6 mb-16">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-1 w-28 shrink-0">Assignment 01</span>
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1]">
                                Freedom &<br /><span style={{ color: RED }}>Discipline</span>
                            </h2>
                            <p className="text-slate-500 text-base mt-6 max-w-2xl leading-relaxed">
                                Exploring Freedom and Discipline in Design. In the journey of expression, "Freedom is not the license for chaos." Organic lines convey this essence of unrestrained movement. On the other hand, "Discipline creates expression," where geometric lines define order and clarity, offering structure to creativity.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image placeholder — replace src with your exported image */}
                        <figure className="fade-in-up">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                                <img src="/assets/handbook/a1-organic.jpg" alt="Organic lines — leaves, branches and feather studies" className="w-full h-full object-cover" />
                            </div>
                            <figcaption className="mt-4 text-xs text-slate-400 italic pl-1">"Freedom is not the license for chaos"</figcaption>
                        </figure>
                        <figure className="fade-in-up">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                                <img src="/assets/handbook/a1-geometric.jpg" alt="Geometric lines — triangles and circle shapes" className="w-full h-full object-cover" />
                            </div>
                            <figcaption className="mt-4 text-xs text-slate-400 italic pl-1">"Discipline creates expression"</figcaption>
                        </figure>
                    </div>
                </div>
            </section>

            {/* ── ASSIGNMENT 2 ────────────────────────────────────────── */}
            <section className="py-28 px-6 border-b border-slate-100 fade-in-up" style={{ backgroundColor: '#fef9f0' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-start gap-6 mb-16">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-1 w-28 shrink-0">Assignment 02</span>
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1]">
                                The Journey<br /><span style={{ color: GOLD }}>of Colour</span>
                            </h2>
                            <p className="text-slate-500 text-base mt-6 max-w-2xl leading-relaxed">
                                Exploring the creation of secondary and tertiary colours using only primary colours. After selecting a colour, we delved into its history and significance. The journey continued with creating a swatch, interacting with classmates' chosen colours, and capturing its essence in greyscale through xerox prints.
                            </p>
                        </div>
                    </div>

                    {/* Terracotta highlight */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="md:col-span-1 rounded-2xl p-8 flex flex-col justify-between" style={{ backgroundColor: '#E35336' }}>
                            <div>
                                <p className="text-white/70 text-[10px] uppercase tracking-[0.25em] font-bold mb-2">Selected Colour</p>
                                <h3 className="text-white text-4xl font-black tracking-tight">Terracotta</h3>
                                <p className="text-white/60 text-sm font-mono mt-1">#E35336</p>
                            </div>
                            <p className="text-white/70 text-xs mt-8 leading-relaxed">
                                The Versatility of Terra Cotta: Exploring Cross-Class Color Interactions
                            </p>
                        </div>
                        <figure className="md:col-span-1 fade-in-up">
                            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                                {/* Replace with: <img src="/assets/handbook/a2-secondary.jpg" alt="Secondary colour mixing" className="w-full h-full object-cover" /> */}
                                <div className="text-center px-6 text-slate-400">
                                    <p className="text-xs uppercase tracking-widest font-bold mb-2">Image</p>
                                    <p className="text-sm">Secondary colour<br />formation swatches</p>
                                </div>
                            </div>
                            <figcaption className="mt-3 text-xs text-slate-400 italic pl-1">Formation of secondary colour using two primary colours</figcaption>
                        </figure>
                        <figure className="md:col-span-1 fade-in-up">
                            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                                {/* Replace with: <img src="/assets/handbook/a2-tertiary.jpg" alt="Tertiary colour mixing" className="w-full h-full object-cover" /> */}
                                <div className="text-center px-6 text-slate-400">
                                    <p className="text-xs uppercase tracking-widest font-bold mb-2">Image</p>
                                    <p className="text-sm">Tertiary colour<br />formation swatches</p>
                                </div>
                            </div>
                            <figcaption className="mt-3 text-xs text-slate-400 italic pl-1">Formation of tertiary colours mixing a Primary and Secondary colour</figcaption>
                        </figure>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <figure className="fade-in-up">
                            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                                {/* Replace with: <img src="/assets/handbook/a2-cross-class-color.jpg" alt="Cross-class colour interactions" className="w-full h-full object-cover" /> */}
                                <div className="text-center px-6 text-slate-400">
                                    <p className="text-xs uppercase tracking-widest font-bold mb-2">Image</p>
                                    <p className="text-sm">Cross-class colour interactions</p>
                                </div>
                            </div>
                        </figure>
                        <figure className="fade-in-up">
                            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                                {/* Replace with: <img src="/assets/handbook/a2-greyscale.jpg" alt="Greyscale xerox prints" className="w-full h-full object-cover" /> */}
                                <div className="text-center px-6 text-slate-400">
                                    <p className="text-xs uppercase tracking-widest font-bold mb-2">Image</p>
                                    <p className="text-sm">Greyscale xerox prints</p>
                                </div>
                            </div>
                        </figure>
                    </div>
                </div>
            </section>

            {/* ── ASSIGNMENT 3 ────────────────────────────────────────── */}
            <section className="fade-in-up">
                {/* Full-bleed red banner */}
                <div className="w-full py-20 px-6 flex flex-col items-center justify-center" style={{ backgroundColor: RED }}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 block mb-6">Assignment 03</span>
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white text-center leading-[1]">
                        Reimagining<br />Tradition
                    </h2>
                    <p className="text-white/70 text-center mt-6 max-w-xl text-base leading-relaxed">
                        through Aipan
                    </p>
                </div>
                <div className="py-20 px-6 bg-white border-b border-slate-100">
                    <div className="max-w-6xl mx-auto">
                        <p className="text-slate-500 text-base leading-relaxed max-w-3xl mb-16">
                            This assignment explored the fusion of tradition and modernity by creating a contemporary artwork using Aipan elements. The design retained the symbolic motifs and rhythmic patterns of Aipan while presenting them in a fresh, modern composition. It highlights how cultural art forms can be reinterpreted to stay relevant and expressive today.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <figure className="fade-in-up md:row-span-2">
                                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                                    {/* Replace with: <img src="/assets/handbook/a3-aipan-art.jpg" alt="Aipan horse artwork on red" className="w-full h-full object-cover" /> */}
                                    <div className="text-center px-6 text-slate-400">
                                        <p className="text-xs uppercase tracking-widest font-bold mb-2">Image</p>
                                        <p className="text-sm">Aipan horse artwork<br />(red with white motifs)</p>
                                    </div>
                                </div>
                                <figcaption className="mt-4 text-xs text-slate-400 italic pl-1">"Tradition does not fade; it evolves through design."</figcaption>
                            </figure>
                            <figure className="fade-in-up">
                                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                                    {/* Replace with: <img src="/assets/handbook/a3-pillow.jpg" alt="Aipan design on pillow mockup" className="w-full h-full object-cover" /> */}
                                    <div className="text-center px-6 text-slate-400">
                                        <p className="text-xs uppercase tracking-widest font-bold mb-2">Image</p>
                                        <p className="text-sm">Pillow mockup</p>
                                    </div>
                                </div>
                            </figure>
                            <figure className="fade-in-up">
                                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                                    {/* Replace with: <img src="/assets/handbook/a3-tote.jpg" alt="Aipan design on tote bag mockup" className="w-full h-full object-cover" /> */}
                                    <div className="text-center px-6 text-slate-400">
                                        <p className="text-xs uppercase tracking-widest font-bold mb-2">Image</p>
                                        <p className="text-sm">Tote bag mockup</p>
                                    </div>
                                </div>
                            </figure>
                        </div>
                        <figure className="mt-6 fade-in-up">
                            <div className="aspect-[16/6] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                                {/* Replace with: <img src="/assets/handbook/a3-mug.jpg" alt="Aipan design on mug mockup" className="w-full h-full object-cover" /> */}
                                <div className="text-center px-6 text-slate-400">
                                    <p className="text-xs uppercase tracking-widest font-bold mb-2">Image</p>
                                    <p className="text-sm">Mug mockup</p>
                                </div>
                            </div>
                        </figure>
                    </div>
                </div>
            </section>

            {/* ── ASSIGNMENT 4 ────────────────────────────────────────── */}
            <section className="py-28 px-6 bg-[#0a0a12] border-b border-slate-800 fade-in-up">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-start gap-6 mb-16">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mt-1 w-28 shrink-0">Assignment 04</span>
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[1]">
                                Imagining<br /><span style={{ color: BLUE }}>Futures</span>
                            </h2>
                            <p className="text-white/50 text-base mt-6 max-w-2xl leading-relaxed">
                                Exploring the creation of a futuristic poster by combining imagination with design principles. The focus was on innovation, form, and visual storytelling. Through composition, colour, and balance, the poster reflects how design can shape visions of the future.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <figure className="fade-in-up">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
                                {/* Replace with: <img src="/assets/handbook/a4-neo-gothic.jpg" alt="Cortex Neo-Gothic poster" className="w-full h-full object-cover" /> */}
                                <div className="text-center px-6 text-white/30">
                                    <p className="text-xs uppercase tracking-widest font-bold mb-2">Image</p>
                                    <p className="text-sm">Neo-Gothic iteration<br />(CORTEX poster)</p>
                                </div>
                            </div>
                            <figcaption className="mt-3 text-xs text-white/30 italic pl-1">"A dark, intricate fusion of mystique and technology."</figcaption>
                        </figure>
                        <figure className="fade-in-up">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
                                {/* Replace with: <img src="/assets/handbook/a4-minimal.jpg" alt="Cortex Minimal poster" className="w-full h-full object-cover" /> */}
                                <div className="text-center px-6 text-white/30">
                                    <p className="text-xs uppercase tracking-widest font-bold mb-2">Image</p>
                                    <p className="text-sm">Minimal iteration<br />(CORTEX poster)</p>
                                </div>
                            </div>
                            <figcaption className="mt-3 text-xs text-white/30 italic pl-1">"A sleek vision of the future, where your mind powers immersive worlds."</figcaption>
                        </figure>
                        <figure className="fade-in-up">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
                                {/* Replace with: <img src="/assets/handbook/a4-final.jpg" alt="Cortex Final poster" className="w-full h-full object-cover" /> */}
                                <div className="text-center px-6 text-white/30">
                                    <p className="text-xs uppercase tracking-widest font-bold mb-2">Image</p>
                                    <p className="text-sm">Final poster<br />(CORTEX)</p>
                                </div>
                            </div>
                            <figcaption className="mt-3 text-xs text-white/30 italic pl-1">"A striking blend of futuristic energy and sleek minimalism."</figcaption>
                        </figure>
                    </div>
                </div>
            </section>

            {/* ── ACTIVITIES ──────────────────────────────────────────── */}
            <section className="py-28 px-6 bg-white border-b border-slate-100 fade-in-up">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-start gap-6 mb-16">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-1 w-28 shrink-0">Activities</span>
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1]">
                                Seeing the<br /><span style={{ color: BLUE }}>World</span>
                            </h2>
                            <p className="text-slate-500 text-base mt-6 max-w-2xl leading-relaxed">
                                "Unveiling the hidden stories within every surface, where texture meets perception." — Campus explorations observing organic and geometric lines in the built and natural environment.
                            </p>
                        </div>
                    </div>

                    {/* Textures 4-up grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 fade-in-up">
                        {['Foliage texture', 'Gravel / asphalt texture', 'Tree bark texture', 'Houndstooth fabric texture'].map((label, i) => (
                            <figure key={i}>
                                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                                    {/* Replace with: <img src={`/assets/handbook/texture-${i + 1}.jpg`} alt={label} className="w-full h-full object-cover" /> */}
                                    <div className="text-center px-3 text-slate-400">
                                        <p className="text-[10px] uppercase tracking-widest font-bold mb-1">Image</p>
                                        <p className="text-[11px]">{label}</p>
                                    </div>
                                </div>
                            </figure>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in-up">
                        <figure>
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                                <img src="/assets/handbook/activity-organic.jpg" alt="Organic lines — dense plant and leaf study" className="w-full h-full object-cover" />
                            </div>
                            <figcaption className="mt-3 text-xs text-slate-400 italic pl-1">Exploration of Organic lines around the campus</figcaption>
                        </figure>
                        <figure>
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                                {/* Replace with: <img src="/assets/handbook/activity-geometric.jpg" alt="Geometric lines around campus" className="w-full h-full object-cover" /> */}
                                <div className="text-center px-6 text-slate-400">
                                    <p className="text-xs uppercase tracking-widest font-bold mb-2">Image</p>
                                    <p className="text-sm">Geometric lines<br />around the campus</p>
                                </div>
                            </div>
                            <figcaption className="mt-3 text-xs text-slate-400 italic pl-1">Exploration of Geometric lines around the campus</figcaption>
                        </figure>
                    </div>
                </div>
            </section>

            {/* ── PRODUCT SKETCHING ───────────────────────────────────── */}
            <section className="py-28 px-6 bg-white border-b border-slate-100 fade-in-up">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-start gap-6 mb-16">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-1 w-28 shrink-0">Activities</span>
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1]">
                                Product<br /><span style={{ color: GOLD }}>Sketching</span>
                            </h2>
                            <p className="text-slate-500 text-base mt-6 max-w-2xl leading-relaxed">
                                Studying everyday objects to understand product anatomy, ergonomics, and form relationships. Each sketch explores multiple views — orthographic, perspective, and in-hand — to build spatial understanding.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { src: '/assets/handbook/sketch-shaver.jpg', alt: 'Electric shaver — multiple view study' },
                            { src: '/assets/handbook/sketch-spray.jpg', alt: 'Spray bottle trigger — multiple view study' },
                            { src: '/assets/handbook/sketch-stapler.jpg', alt: 'Stapler — multiple view study' },
                            { src: '/assets/handbook/sketch-mixer.jpg', alt: 'Hand mixer — multiple view study' },
                            { src: '/assets/handbook/sketch-cigarette.jpg', alt: 'Cigarette pack — multiple view study' },
                            { src: '/assets/handbook/sketch-moka.jpg', alt: 'Moka pot — multiple view study' },
                            { src: '/assets/handbook/sketch-airpods.jpg', alt: 'AirPods & case — multiple view study' },
                            { src: '/assets/handbook/sketch-charger.jpg', alt: 'Power adapter — multiple view study' },
                            { src: '/assets/handbook/sketch-scissors.jpg', alt: 'Scissors — multiple view study' },
                            { src: '/assets/handbook/sketch-mouse.jpg', alt: 'Computer mouse — multiple view study' },
                        ].map(({ src, alt }) => (
                            <figure key={src} className="fade-in-up">
                                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
                                    <img src={src} alt={alt} className="w-full h-full object-cover" />
                                </div>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FORM & SPACE ─────────────────────────────────────────── */}
            <section className="py-28 px-6 bg-[#f8fafc] border-b border-slate-100 fade-in-up">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-start gap-6 mb-16">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-1 w-28 shrink-0">Activities</span>
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1]">
                                Form &<br /><span style={{ color: BLUE }}>Space</span>
                            </h2>
                            <p className="text-slate-500 text-base mt-6 max-w-2xl leading-relaxed">
                                How does form transform across context? Five studies exploring the relationship between form and space — through the lenses of time, culture, emotion, and visual contrast.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[
                            { src: '/assets/handbook/form-invasion.jpg', label: 'Invasion / Interchange of Form & Space', caption: 'Headphone form iterations I–V' },
                            { src: '/assets/handbook/form-time.jpg', label: 'Transformation in Relation to Time', caption: 'Sundial → Pocket watch → Wrist → Digital → Smart' },
                            { src: '/assets/handbook/form-culture.jpg', label: 'Transformation in Relation to Culture', caption: 'Gandhi cap, Dhaka topi, Taqiyah, Graduation cap, Samurai Kabuto' },
                            { src: '/assets/handbook/form-edge.jpg', label: 'Contrast / Edge Characteristics', caption: 'Five boot forms exploring texture and edge contrast' },
                            { src: '/assets/handbook/form-emotion.jpg', label: 'Transformation in Relation to Mood & Emotion', caption: 'Footballer emotional arc I–V' },
                        ].map(({ src, label, caption }) => (
                            <figure key={src} className="fade-in-up">
                                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                    <img src={src} alt={label} className="w-full h-full object-cover" />
                                </div>
                                <figcaption className="mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">{label}</figcaption>
                                <p className="mt-1 text-[11px] text-slate-400 italic pl-1">{caption}</p>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── EXPLORATIONS ────────────────────────────────────────── */}
            <section className="py-28 px-6 bg-[#f8fafc] border-b border-slate-100 fade-in-up">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-start gap-6 mb-16">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-1 w-28 shrink-0">Explorations</span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[1]">
                            Free-form<br /><span style={{ color: RED }}>Work</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <figure className="fade-in-up">
                            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                                {/* Replace with: <img src="/assets/handbook/explore-spirograph.jpg" alt="Spirograph-style line exploration" className="w-full h-full object-cover" /> */}
                                <div className="text-center px-6 text-slate-400">
                                    <p className="text-xs uppercase tracking-widest font-bold mb-2">Image</p>
                                    <p className="text-sm">Spirograph / infinite<br />line exploration</p>
                                </div>
                            </div>
                            <figcaption className="mt-3 text-xs text-slate-400 italic pl-1">Exploring the infinite dance of lines and forms, where chaos meets geometry in perfect harmony.</figcaption>
                        </figure>
                        <figure className="fade-in-up">
                            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                                {/* Replace with: <img src="/assets/handbook/explore-aipan-warrior.jpg" alt="Aipan warrior exploration" className="w-full h-full object-cover" /> */}
                                <div className="text-center px-6 text-slate-400">
                                    <p className="text-xs uppercase tracking-widest font-bold mb-2">Image</p>
                                    <p className="text-sm">Aipan warrior<br />(red exploration)</p>
                                </div>
                            </div>
                            <figcaption className="mt-3 text-xs text-slate-400 italic pl-1">Fusing tradition with power, where ancient Aipan elements carve the path of a warrior's journey.</figcaption>
                        </figure>
                        <figure className="fade-in-up">
                            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                                {/* Replace with: <img src="/assets/handbook/explore-geometric-maze.jpg" alt="Geometric maze drawing" className="w-full h-full object-cover" /> */}
                                <div className="text-center px-6 text-slate-400">
                                    <p className="text-xs uppercase tracking-widest font-bold mb-2">Image</p>
                                    <p className="text-sm">Geometric maze<br />pen drawing</p>
                                </div>
                            </div>
                            <figcaption className="mt-3 text-xs text-slate-400 italic pl-1">Exploring the infinite dance of lines and forms, where chaos meets geometry in perfect harmony.</figcaption>
                        </figure>
                    </div>
                </div>
            </section>

            {/* ── CONCLUSION & REFLECTION ─────────────────────────────── */}
            <section className="py-28 px-6 bg-white border-b border-slate-100 fade-in-up">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 block mb-6">Conclusion</span>
                        <div className="w-8 h-0.5 mb-8" style={{ backgroundColor: BLUE }} />
                        <p className="text-slate-600 text-base leading-relaxed mb-4">
                            The Elements and Principles of Design course has been pivotal in shaping my design approach. Exploring basic elements like dots, lines, and shapes, alongside concepts like rhythm, balance, and Gestalt principles, has expanded my visual language.
                        </p>
                        <p className="text-slate-600 text-base leading-relaxed mb-4">
                            Working with color theory taught me the psychological impact of hues, while texture studies refined my sensitivity to the environment. The assignments challenged me to translate theory into practical designs, combining cultural relevance, modern interpretation, and forward-thinking creativity.
                        </p>
                        <p className="text-slate-600 text-base leading-relaxed">
                            This course has equipped me with the necessary tools to approach design challenges with clarity, purpose, and innovation, fueling my growth as a designer.
                        </p>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 block mb-6">Reflection</span>
                        <div className="w-8 h-0.5 mb-8" style={{ backgroundColor: RED }} />
                        <p className="text-slate-600 text-base leading-relaxed mb-4">
                            Throughout this course, I've experienced significant growth as a designer, particularly in my approach to sketching and composition. In the beginning, I often found myself stuck when sketching, unsure of how to develop my ideas.
                        </p>
                        <p className="text-slate-600 text-base leading-relaxed mb-4">
                            Through the guidance of my teachers, I've learned the importance of sketching and thinking simultaneously. My teachers emphasized the value of repeated iterations — I now understand that a successful composition often doesn't come in the first attempt, and that's okay.
                        </p>
                        <p className="text-slate-600 text-base leading-relaxed">
                            This course has been a turning point in my design journey. I now know that creativity and critical thinking work together, and persistence is what transforms ideas into meaningful designs.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── CLOSING MARK ────────────────────────────────────────── */}
            <section className="py-28 px-6 flex flex-col items-center text-center fade-in-up" style={{ backgroundColor: RED }}>
                <p className="text-white/60 text-[10px] uppercase tracking-[0.4em] font-bold mb-8">EOD / POD Masterclass Compilation</p>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1] mb-6">
                    The Innovators<br />Handbook
                </h2>
                <p className="text-white/70 text-sm mb-12 max-w-md leading-relaxed">
                    "Every design begins with a dot, grows with a line, and finds meaning in composition."
                </p>
                <Link href="/#work" className="interactive-target inline-flex items-center gap-3 px-7 py-4 bg-white text-slate-900 rounded-full text-sm font-bold hover:bg-white/90 transition-colors">
                    <i className="ph ph-arrow-left"></i> Back to Portfolio
                </Link>
            </section>

        </main>
    );
}
