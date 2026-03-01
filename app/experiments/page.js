'use client';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Experiments() {
    const cursorDot = useRef(null);

    useEffect(() => {
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);

        // Hide default cursor on desktop
        if (window.innerWidth >= 768) {
            document.body.style.cursor = 'none';
        }

        // 1. Custom Cursor Logic
        const xToDot = gsap.quickTo(cursorDot.current, "x", { duration: 0.1, ease: "power3" });
        const yToDot = gsap.quickTo(cursorDot.current, "y", { duration: 0.1, ease: "power3" });

        const moveCursor = (e) => {
            xToDot(e.clientX);
            yToDot(e.clientY);
        };

        window.addEventListener('mousemove', moveCursor);

        const handleMouseEnter = (e) => {
            const el = e.target.closest('.interactive-target');
            if (el && cursorDot.current) {
                gsap.to(cursorDot.current.querySelector('svg'), {
                    scale: 1.5,
                    duration: 0.3,
                    ease: 'power2.out',
                });
            }
        };

        const handleMouseLeave = (e) => {
            const el = e.target.closest('.interactive-target');
            if (el && cursorDot.current) {
                gsap.to(cursorDot.current.querySelector('svg'), {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out',
                });
            }
        };

        document.addEventListener('mouseover', handleMouseEnter);
        document.addEventListener('mouseout', handleMouseLeave);

        // Cleanup
        return () => {
            if (window.innerWidth >= 768) {
                document.body.style.cursor = 'auto';
            }
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseover', handleMouseEnter);
            document.removeEventListener('mouseout', handleMouseLeave);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <main className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans md:py-24 py-16 px-6 sm:px-12 selection:bg-blue-200 overflow-x-hidden relative">

            {/* Custom Cursor Elements */}
            <div className="hidden md:block">
                <div ref={cursorDot} className="fixed top-0 left-0 pointer-events-none z-[9999] flex flex-col items-start drop-shadow-md">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L8 20.5L11 12.5L19 9.5L1 1Z" fill="#0ea5e9" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    <div className="cursor-name-tag bg-[#0ea5e9] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md ml-3 -mt-1 whitespace-nowrap transition-colors duration-300">
                        View
                    </div>
                </div>
            </div>

            {/* Top Navigation Wrapper */}
            <div className="max-w-5xl mx-auto md:mb-16 mb-12 fade-in-up flex items-center justify-between">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors interactive-target">
                    <i className="ph ph-arrow-left"></i> Back
                </Link>
            </div>

            <div className="max-w-5xl mx-auto flex flex-col gap-16">

                {/* Header Section */}
                <header className="fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
                        AI Experiments.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl font-medium">
                        Rapid prototypes, LLM integrations, and experimental front-end engineering built on the weekends.
                    </p>
                </header>

                <div className="flex flex-col border-t border-slate-200 fade-in-up pt-12" style={{ animationDelay: '0.2s' }}>

                    {/* Experiment: FieldNote */}
                    <a href="https://fieldnote-ten.vercel.app/" target="_blank" rel="noopener noreferrer" className="group flex flex-col md:flex-row items-center gap-12 p-8 md:p-12 border border-slate-200 rounded-3xl bg-white hover:border-blue-200 hover:shadow-xl transition-all interactive-target hover:-translate-y-2 relative overflow-hidden">

                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                        <div className="flex-1 relative z-10 w-full">
                            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4 flex items-center gap-3 group-hover:text-blue-600 transition-colors">
                                FieldNote
                                <i className="ph ph-arrow-up-right text-2xl text-blue-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></i>
                            </h3>
                            <p className="text-slate-500 text-lg md:text-xl leading-relaxed mb-6">An AI-powered UX research assistant that automatically transcribes user interviews and synthesizes actionable insights using Gemini 1.5 Pro.</p>

                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">React</span>
                                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">Web Speech API</span>
                                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">Gemini Pro</span>
                            </div>
                        </div>

                        {/* Image Reveal */}
                        <div className="w-full md:w-[45%] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-10 group-hover:shadow-lg transition-transform group-hover:scale-[1.02] aspect-video">
                            <img src="/assets/fieldnote-ss.png" alt="FieldNote App Preview" className="w-full h-full object-cover object-left-top" />
                        </div>
                    </a>

                </div>
            </div>
        </main>
    );
}
