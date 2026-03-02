'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CaseStudy() {
    const cursorDot = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const xToDot = gsap.quickTo(cursorDot.current, "x", { duration: 0.1, ease: "power3" });
        const yToDot = gsap.quickTo(cursorDot.current, "y", { duration: 0.1, ease: "power3" });

        const moveCursor = (e) => {
            xToDot(e.clientX);
            yToDot(e.clientY);
        };

        window.addEventListener('mousemove', moveCursor);

        const interactiveEls = document.querySelectorAll('a, button, .interactive-target');
        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursorDot.current, { scale: 1.1, transformOrigin: 'top left', duration: 0.2 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursorDot.current, { scale: 1, transformOrigin: 'top left', duration: 0.2 });
            });
        });

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

        const fadeSections = document.querySelectorAll('.fade-in-up');
        fadeSections.forEach((section) => {
            gsap.fromTo(section,
                { opacity: 0, y: 30 },
                { scrollTrigger: { trigger: section, start: "top 85%" }, opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
            );
        });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseenter', handleMouseEnter);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <main className="min-h-screen bg-[#f8fafc] text-slate-800 overflow-x-hidden relative pb-32">

            {/* Custom Cursor */}
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
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl fade-in-up">
                <div className="pill-nav shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 interactive-target">
                        Ayushman<span className="text-blue-500">.</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/#work" className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 interactive-target">
                            <i className="ph ph-arrow-left"></i> Back to Portfolio
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-48 pb-16 px-6 fade-in-up bg-[#f8fafc] w-full min-h-[85vh] flex flex-col justify-center border-b border-slate-200">
                <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-8">
                            <span className="px-3 py-1 bg-blue-50 border border-blue-100 text-xs font-bold uppercase tracking-widest text-blue-600 rounded">UX Case Study</span>
                            <span className="px-3 py-1 bg-purple-50 border border-purple-100 text-xs font-bold uppercase tracking-widest text-purple-600 rounded">UX Lead & Product Owner</span>
                            <span className="px-3 py-1 bg-slate-200 border border-slate-300 text-xs font-bold uppercase tracking-widest text-slate-600 rounded">6 Weeks</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[1]">
                            Structured<br /><span className="text-slate-400">Ordering.</span>
                        </h1>
                        <p className="text-2xl md:text-3xl text-slate-500 font-medium leading-tight max-w-2xl mb-12">
                            Transforming conversational, manual WhatsApp ordering into a structured, low-friction system for a hyperlocal café in Golaghat, Assam.
                        </p>
                        <Link href="https://www.hoychoycafe.com/" target="_blank" rel="noopener noreferrer" className="interactive-target group relative inline-flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-full text-lg font-bold hover:bg-blue-600 transition-colors">
                            View Live Project
                            <i className="ph ph-arrow-up-right text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                        </Link>
                    </div>
                    <div className="flex-1 w-full flex justify-center md:justify-end relative">
                        <div className="w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 rotate-2 hover:rotate-0 transition-transform duration-500 interactive-target">
                            <img src="/assets/hoychoy-thumb.png" alt="Hoychoy Cafe Splash Screen" className="w-full h-auto object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Context & Role */}
            <section className="bg-white py-20 px-6 w-full border-b border-slate-200 fade-in-up">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#fcfbf9] rounded-3xl p-8 md:p-10 border border-[#e5e5e5]">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-4">Project Constraints</span>
                        <p className="text-lg text-slate-700 leading-relaxed font-medium">
                            This was a 6-week client project with no direct access to end customers. All insights came from analyzing 50+ real WhatsApp order threads and working closely with the owner through structured sessions. The product had to ship fast, run on low-end Android devices, and require zero end-user onboarding.
                        </p>
                    </div>
                    <div className="bg-blue-50 rounded-3xl p-8 md:p-10 border border-blue-100">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-4">My Role</span>
                        <p className="text-lg text-slate-700 leading-relaxed font-medium">
                            I owned the full lifecycle—problem framing, UX architecture, visual design, and end-to-end development using AI-assisted (vibe coding) rapid build methodology. I managed the client relationship, ran the 2-week pilot with the owner, and shipped the product to production.
                        </p>
                    </div>
                </div>
            </section>

            {/* 1. The Problem — merged: Workflow Issue + Critical Insight + Service Blueprint */}
            <section className="bg-slate-900 text-white py-32 px-6 w-full fade-in-up">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-16">1. The Problem</h2>

                    {/* Problem Framing */}
                    <div className="bg-slate-800/80 rounded-3xl p-8 md:p-10 border border-slate-700/50 mb-16 max-w-4xl">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Problem Framing</h3>
                        <p className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed mb-6">
                            Hoychoy Café ran all orders through WhatsApp. Customers browsed a PDF, typed their address, and sent a UPI screenshot. The owner then manually decoded, clarified, verified, and relayed each order to the kitchen—solo, during rush hour, with a dozen threads open simultaneously.
                        </p>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                            <span className="text-blue-400 font-bold uppercase tracking-widest text-xs block mb-2">Core Insight</span>
                            <p className="text-lg text-blue-100 font-medium">
                                The problem wasn&apos;t WhatsApp. It was the absence of any structured system behind it. Fix the system, not the channel.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-24">
                        <div className="space-y-8">
                            <p className="text-xl text-slate-300 leading-relaxed font-medium">
                                The system worked until peak hours exposed its fragility. The owner manually clarified missing details, verified payments, and relayed orders to the kitchen. <strong>This wasn&apos;t a UI issue. It was a workflow issue.</strong>
                            </p>

                            {/* Real User Signals */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Real Signals — from 50+ WhatsApp threads</h3>
                                <div className="flex flex-col gap-3">
                                    <div className="bg-emerald-900/30 border border-emerald-800/40 p-4 rounded-2xl rounded-tl-sm self-start max-w-sm shadow-sm">
                                        <p className="text-slate-300 font-medium font-mono text-sm">&quot;Bro payment sent check once&quot;</p>
                                    </div>
                                    <div className="bg-emerald-900/30 border border-emerald-800/40 p-4 rounded-2xl rounded-tl-sm self-start max-w-sm shadow-sm">
                                        <p className="text-slate-300 font-medium font-mono text-sm">&quot;Address same as last time&quot;</p>
                                    </div>
                                    <div className="bg-emerald-900/30 border border-emerald-800/40 p-4 rounded-2xl rounded-tl-sm self-start max-w-sm shadow-sm">
                                        <p className="text-slate-300 font-medium font-mono text-sm">&quot;Add extra gravy pls&quot;</p>
                                    </div>
                                    <div className="bg-slate-700/50 border border-slate-600/50 p-4 rounded-2xl rounded-tr-sm self-end max-w-sm shadow-sm mt-2">
                                        <p className="text-slate-400 font-medium text-sm">Owner: <span className="italic text-slate-500">Scrambling to match screenshots to addresses while 6 other messages arrive.</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 h-full flex flex-col justify-center">
                                <h3 className="text-6xl font-black text-red-400 tracking-tighter mb-4">50%</h3>
                                <p className="text-slate-400 text-lg uppercase tracking-widest font-bold">Of Peak Time</p>
                                <p className="text-slate-500 mt-2 text-sm">spent exclusively clarifying incomplete orders—not taking new ones.</p>
                            </div>
                            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 h-full flex flex-col justify-center">
                                <h3 className="text-6xl font-black text-amber-400 tracking-tighter mb-4">50+</h3>
                                <p className="text-slate-400 text-lg uppercase tracking-widest font-bold">Threads Analyzed</p>
                                <p className="text-slate-500 mt-2 text-sm">revealing payment mismatch and lost orders as the two dominant failure modes.</p>
                            </div>
                        </div>
                    </div>

                    {/* Service Blueprint — Before / After */}
                    <h3 className="text-2xl font-bold text-slate-300 mb-8">Service Flow: Before vs. After</h3>

                    <div className="bg-slate-800/40 rounded-2xl p-8 md:p-12 border border-slate-700/50 mb-8 relative overflow-x-auto">
                        <div className="absolute top-0 right-0 bg-red-900/60 text-red-300 px-4 py-2 rounded-bl-2xl rounded-tr-xl font-bold text-sm uppercase tracking-widest border-b border-l border-red-800/30">Before</div>
                        <div className="min-w-[800px] grid grid-cols-4 gap-4 text-sm mt-4 font-medium">
                            <div className="font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2">Layer</div>
                            <div className="font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2">Menu Discovery</div>
                            <div className="font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2">Ordering & Payment</div>
                            <div className="font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2">Coordination</div>

                            <div className="py-4 font-bold text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2">Customer Actions</div>
                            <div className="bg-[#fff9c4]/10 border border-[#fff59d]/20 rounded p-3 text-slate-300">Views PDF menu</div>
                            <div className="bg-[#fff9c4]/10 border border-[#fff59d]/20 rounded p-3 text-slate-300">Sends chat order & UPI screenshot</div>
                            <div className="bg-[#fff9c4]/10 border border-[#fff59d]/20 rounded p-3 text-slate-300">Manually types address</div>

                            <div className="py-4 font-bold text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2">Frontstage</div>
                            <div className="bg-emerald-900/20 border border-emerald-800/30 rounded p-3 col-span-3 text-center text-emerald-300">WhatsApp Chat Interface</div>

                            <div className="py-4 font-bold text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2">Backstage (Owner)</div>
                            <div className="bg-red-900/20 border border-red-800/30 rounded p-3 col-span-2 text-red-300 font-bold">Reads, clarifies missing details, verifies payment screenshots</div>
                            <div className="bg-red-900/20 border border-red-800/30 rounded p-3 text-red-300 font-bold">Manually relays to kitchen</div>

                            <div className="py-4 font-bold text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2">Support Systems</div>
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded p-3 text-slate-400">PDF File</div>
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded p-3 text-slate-400">UPI App / Phone Gallery</div>
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded p-3 text-slate-400">Verbal Instructions</div>
                        </div>
                    </div>

                    <div className="bg-slate-800/40 rounded-2xl p-8 md:p-12 border border-slate-700/50 overflow-x-auto relative">
                        <div className="absolute top-0 right-0 bg-emerald-900/60 text-emerald-300 px-4 py-2 rounded-bl-2xl rounded-tr-xl font-bold text-sm uppercase tracking-widest border-b border-l border-emerald-800/30">After</div>
                        <div className="min-w-[800px] grid grid-cols-4 gap-4 text-sm mt-4 font-medium">
                            <div className="font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2">Layer</div>
                            <div className="font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2">Menu Discovery</div>
                            <div className="font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2">Checkout</div>
                            <div className="font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2">Fulfillment</div>

                            <div className="py-4 font-bold text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2">Customer Actions</div>
                            <div className="bg-[#fff9c4]/10 border border-[#fff59d]/20 rounded p-3 text-slate-300">Scans QR / Clicks link & browses menu</div>
                            <div className="bg-[#fff9c4]/10 border border-[#fff59d]/20 rounded p-3 text-slate-300">Adds to cart & pays via UPI</div>
                            <div className="bg-[#fff9c4]/10 border border-[#fff59d]/20 rounded p-3 text-slate-300">Receives WhatsApp confirmation</div>

                            <div className="py-4 font-bold text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2">Frontstage</div>
                            <div className="bg-sky-900/20 border border-sky-800/30 rounded p-3 col-span-2 text-sky-300 font-bold">Mobile web ordering & auto-formatted order summary</div>
                            <div className="bg-emerald-900/20 border border-emerald-800/30 rounded p-3 text-emerald-300">WhatsApp (confirmation only)</div>

                            <div className="py-4 font-bold text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2">Backstage</div>
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded p-3 text-slate-500 text-center italic">Fully Automated</div>
                            <div className="bg-emerald-900/20 border border-emerald-800/30 rounded p-3 text-emerald-300 font-bold">Order stored in Dashboard</div>
                            <div className="bg-emerald-900/20 border border-emerald-800/30 rounded p-3 text-emerald-300 font-bold">Telegram alert → Kitchen</div>

                            <div className="py-4 font-bold text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2">Support Systems</div>
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded p-3 text-slate-400">Web App Database</div>
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded p-3 text-slate-400 flex gap-2"><span className="bg-[#5f259f] text-white px-2 rounded font-bold uppercase text-[10px] flex items-center shadow-sm">PhonePe</span></div>
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded p-3 text-slate-400 flex gap-2"><span className="bg-[#229ED9] text-white px-2 rounded font-bold uppercase text-[10px] flex items-center shadow-sm">Telegram API</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Information Architecture */}
            <section className="bg-white py-32 px-6 w-full text-slate-900 border-b border-slate-200 fade-in-up">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">2. Information Architecture</h2>
                    <p className="text-xl md:text-2xl text-slate-600 mb-16 max-w-3xl leading-relaxed font-medium">
                        A flat, linear architecture built for extreme speed. No dead ends, no complex navigation trees—a direct funnel from discovery to payment to confirmation.
                    </p>

                    <div className="bg-[#fcfbf9] rounded-3xl p-8 md:p-12 border border-[#e5e5e5] shadow-sm overflow-x-auto relative" style={{ backgroundImage: 'radial-gradient(#d4d4d4 1px, transparent 0)', backgroundSize: '24px 24px' }}>
                        <div className="min-w-[800px] flex flex-col items-center gap-4 font-medium text-sm">

                            <div className="flex gap-16">
                                <div className="bg-[#fff9c4] shadow-sm border border-[#fff59d] px-6 py-4 rounded-xl text-slate-800 font-bold text-center w-52 relative z-10 hover:-translate-y-1 transition-transform">
                                    <i className="ph-fill ph-qr-code text-3xl mb-2 text-slate-500 block"></i>
                                    Table QR Code
                                </div>
                                <div className="bg-[#fff9c4] shadow-sm border border-[#fff59d] px-6 py-4 rounded-xl text-slate-800 font-bold text-center w-52 relative z-10 hover:-translate-y-1 transition-transform">
                                    <i className="ph-fill ph-instagram-logo text-3xl mb-2 text-pink-500 block"></i>
                                    Instagram Bio Link
                                </div>
                            </div>

                            <div className="flex gap-[160px] text-slate-300">
                                <i className="ph-bold ph-arrow-down text-2xl"></i>
                                <i className="ph-bold ph-arrow-down text-2xl"></i>
                            </div>

                            <div className="bg-[#e0f2fe] shadow-sm border border-[#bae6fd] px-8 py-5 rounded-2xl text-sky-900 font-bold text-lg text-center w-[480px] z-10 hover:-translate-y-1 transition-transform">
                                <i className="ph-fill ph-house text-3xl mb-2 text-sky-500 block"></i>
                                Main Menu (Single Page)
                            </div>

                            <i className="ph-bold ph-arrow-down text-2xl text-slate-300"></i>

                            <div className="flex gap-12 items-start relative pb-4">
                                <div className="flex flex-col items-center gap-4 mt-8">
                                    <div className="bg-white shadow-sm border border-slate-200 px-6 py-3 rounded-xl text-slate-700 text-center w-48 hover:-translate-y-1 transition-transform font-bold text-slate-600">
                                        Category Filters
                                    </div>
                                    <div className="bg-white shadow-sm border border-slate-200 px-6 py-3 rounded-xl text-slate-700 text-center w-48 hover:-translate-y-1 transition-transform font-bold text-slate-600">
                                        Search Bar
                                    </div>
                                    <div className="bg-white shadow-sm border border-slate-200 px-6 py-3 rounded-xl text-slate-700 text-center w-48 hover:-translate-y-1 transition-transform font-bold text-slate-600">
                                        Product Modal
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-12">
                                    <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Interacts</span>
                                    <i className="ph-bold ph-arrow-right text-2xl text-slate-300"></i>
                                </div>

                                <div className="flex flex-col items-center gap-6">
                                    <div className="bg-[#eefcf3] shadow-sm border border-[#bbf7d0] px-8 py-5 rounded-3xl text-green-900 font-bold text-center w-72 z-10 hover:-translate-y-1 transition-transform text-lg">
                                        <i className="ph-fill ph-shopping-cart text-3xl mb-2 text-green-500 block"></i>
                                        Slide-out Cart
                                    </div>

                                    <i className="ph-bold ph-arrow-down text-2xl text-slate-300 -mt-2"></i>

                                    <div className="bg-white shadow-sm border border-slate-200 p-8 rounded-3xl text-slate-800 w-[360px] text-left relative overflow-hidden z-10 hover:-translate-y-1 transition-transform">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                                        <h4 className="font-bold text-sm mb-4 uppercase tracking-widest text-slate-400">Checkout Modal</h4>
                                        <ul className="space-y-4 font-bold text-slate-600">
                                            <li className="flex items-center gap-3"><i className="ph-bold ph-check text-blue-500 text-lg"></i> Contact Details & Address</li>
                                            <li className="flex items-center gap-3"><i className="ph-bold ph-check text-blue-500 text-lg"></i> Order Type (Delivery/Pickup)</li>
                                            <li className="flex items-center gap-3"><i className="ph-bold ph-check text-blue-500 text-lg"></i> Kitchen Notes</li>
                                        </ul>
                                    </div>

                                    <i className="ph-bold ph-arrow-down text-2xl text-slate-300 -mt-2"></i>

                                    <div className="flex gap-6">
                                        <div className="bg-[#f3e8ff] shadow-sm border border-[#e9d5ff] px-6 py-4 rounded-xl text-purple-900 font-bold text-center w-48 relative z-10 hover:-translate-y-1 transition-transform">
                                            <i className="ph-fill ph-currency-inr text-3xl mb-2 text-purple-500 block"></i>
                                            UPI Deep Link
                                        </div>
                                        <div className="bg-[#fef2f2] shadow-sm border border-[#fecaca] px-6 py-4 rounded-xl text-red-900 font-bold text-center w-48 relative z-10 hover:-translate-y-1 transition-transform">
                                            <i className="ph-fill ph-paper-plane-tilt text-3xl mb-2 text-red-500 block"></i>
                                            Telegram Alert
                                        </div>
                                    </div>

                                    <i className="ph-bold ph-arrow-down text-2xl text-slate-300 -mt-2"></i>

                                    <div className="bg-slate-800 shadow-md border border-slate-700 px-8 py-5 rounded-3xl text-white font-bold text-center w-full z-10">
                                        <i className="ph-fill ph-check-circle text-3xl mb-2 text-green-400 block"></i>
                                        WhatsApp Confirmation
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. The Solution & UX Decisions */}
            <section className="bg-[#f8fafc] py-32 px-6 w-full border-t border-slate-200 fade-in-up">
                <div className="max-w-6xl mx-auto space-y-24">

                    {/* Solution + UX Decisions side-by-side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

                        {/* The Solution */}
                        <div>
                            <div className="w-16 h-1 bg-blue-500 mb-8"></div>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-10">3. The Solution</h2>
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xl font-bold text-slate-800 mb-2">1. Branded Web Interface</h4>
                                    <p className="text-slate-500 leading-relaxed">Mobile-first structured menu with real-time item availability. No login, no download, no friction at the door.</p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-800 mb-2">2. Structured Checkout</h4>
                                    <p className="text-slate-500 leading-relaxed">Cart, kitchen notes, GPS location capture, and a UPI deep link—all in a single scrollable form. Every required field is enforced at the UI level, so the owner never receives an incomplete order.</p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-800 mb-2">3. Automated Communication Layer</h4>
                                    <p className="text-slate-500 leading-relaxed">Orders route straight to a central Dashboard and trigger a Telegram alert to the kitchen. The owner is removed from the relay chain entirely.</p>
                                </div>
                            </div>
                            <p className="mt-10 text-xl font-bold text-blue-600 italic">&quot;This was not a UI redesign. It was a systems redesign.&quot;</p>
                        </div>

                        {/* UX Decisions — expanded with tradeoffs */}
                        <div>
                            <div className="w-16 h-1 bg-slate-300 mb-8"></div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-10">UX Decisions</h2>
                            <div className="space-y-4">
                                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-2">No login barrier</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">WhatsApp needed zero setup, so any signup gate would kill conversion instantly. Requiring account creation adds 2–3 minutes of friction for a ₹200 order. A session-based approach captured everything the business needed without asking the customer for anything upfront.</p>
                                </div>
                                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-2">Web-first, not a native app</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">App store installs add review delays and require maintenance overhead. A mobile web app delivers identical UX with zero download barrier, works on every device from day one, and can be updated instantly without a release cycle.</p>
                                </div>
                                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-2">WhatsApp kept as a trust layer, not an ordering channel</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">Customers had built habits around WhatsApp confirmation. Cutting it entirely would have created anxiety. Keeping it as a one-way confirmation signal preserved that trust without reintroducing the chaos of conversational ordering.</p>
                                </div>
                                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-2">Telegram for internal ops, not WhatsApp</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">WhatsApp business notifications get buried in personal chat noise and lack a reliable API. Telegram&apos;s bot API delivers structured, persistent, actionable alerts directly to the kitchen channel—even when the owner is away from the counter.</p>
                                </div>
                                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-2">Central dashboard as single source of truth</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">Without a central record, the owner recalled orders from memory or scrolled back through chat history. The dashboard eliminated this entirely, made shift handoffs possible, and created a searchable order history for the first time.</p>
                                </div>
                                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-2">Minimal fields by default</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">Users order on mobile networks during lunch breaks. Every extra field is an abandonment risk. We counted required inputs, cut anything not strictly needed for fulfillment, and converted every typing task into a tapping task wherever the data allowed it.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Iteration: Checkout Redesign */}
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">Iteration: The Checkout</h2>
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                            <p className="text-slate-600 font-medium leading-relaxed">
                                <strong>Step 1:</strong> Structured address capture with GPS or a Google Maps link, plus kitchen notes—replacing the ambiguous WhatsApp text field entirely. Every input enforced at the UI level.
                                <br /><br />
                                <strong>Step 2:</strong> A hardcoded PhonePe deep link with the exact order total pre-filled. No manual amount entry, no screenshot verification, no payment mismatch possible.
                                <br /><br />
                                <strong>Why it matters:</strong> Converting a typing task into a tapping task removed the owner&apos;s most time-consuming verification step and eliminated the largest source of order errors.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. The Shipped Product */}
            <section className="bg-white py-32 px-6 w-full border-t border-slate-200 fade-in-up">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-16 text-center">4. The Shipped Product</h2>

                    {/* Looping Recording */}
                    <div className="bg-slate-200 rounded-[2.5rem] p-4 md:p-8 shadow-inner overflow-hidden flex justify-center mb-24 max-w-5xl mx-auto">
                        <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-slate-300 relative group bg-white">
                            <img src="/assets/recording.webp" alt="Full app flow: Menu, Cart, Checkout, Confirmation" className="w-full h-auto object-cover" />
                        </div>
                    </div>

                    {/* Customer Flow */}
                    <div className="mb-24">
                        <h3 className="text-2xl font-bold text-slate-800 mb-12 flex items-center gap-3">
                            <i className="ph-fill ph-device-mobile text-blue-600"></i> Customer Flow
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-12">
                            <div className="relative group mx-auto max-w-[320px] md:max-w-none">
                                <img src="/assets/cs-menu-active.png" alt="Menu with real-time availability and Veg/Non-Veg filters" className="w-full h-auto rounded-[2rem] shadow-xl border-4 border-slate-100" />
                                <div className="absolute sm:-right-8 -right-4 top-16 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-slate-200 rotate-3 z-10 font-bold text-blue-600 max-w-[200px]" style={{ fontFamily: 'var(--font-caveat), cursive', fontSize: '1.5rem', lineHeight: '1.2' }}>
                                    Real-time filtering & availability checks.
                                </div>
                            </div>
                            <div className="relative group mx-auto max-w-[320px] md:max-w-none mt-12 md:mt-0">
                                <img src="/assets/cs-checkout-scroll.png" alt="Checkout form: address capture, order type, and kitchen notes" className="w-full h-auto rounded-[2rem] shadow-xl border-4 border-slate-100" />
                                <div className="absolute sm:-left-12 -left-4 top-1/2 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-slate-200 -rotate-2 z-10 font-bold text-blue-600 max-w-[200px]" style={{ fontFamily: 'var(--font-caveat), cursive', fontSize: '1.5rem', lineHeight: '1.2' }}>
                                    Structured data capture ends WhatsApp chaos.
                                </div>
                            </div>
                            <div className="relative group mx-auto max-w-[320px] md:max-w-none mt-12 md:mt-0">
                                <img src="/assets/cs-checkout-payment.png" alt="PhonePe payment: exact order total pre-filled via UPI deep link" className="w-full h-auto rounded-[2rem] shadow-xl border-4 border-slate-100" />
                                <div className="absolute sm:-right-8 -right-4 bottom-32 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-slate-200 -rotate-3 z-10 font-bold text-blue-600 max-w-[200px]" style={{ fontFamily: 'var(--font-caveat), cursive', fontSize: '1.5rem', lineHeight: '1.2' }}>
                                    Exact total pre-filled. Zero manual entry, zero mismatch.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Backend / Operations */}
                    <div className="bg-slate-50 p-8 md:p-16 rounded-[3rem] border border-slate-200 w-[100vw] relative left-1/2 -translate-x-1/2 shadow-inner">
                        <h3 className="text-2xl font-bold text-slate-800 mb-12 flex items-center justify-center gap-3">
                            <i className="ph-fill ph-cpu text-amber-500"></i> Backend & Operations
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-4xl mx-auto">
                            <div className="relative group mx-auto max-w-[320px] md:max-w-none">
                                <img src="/assets/cs-admin-panel.png" alt="Admin Panel: restaurant status toggle and closing message" className="w-full h-auto rounded-[2rem] shadow-xl border-4 border-white" />
                                <div className="absolute sm:-left-12 -left-4 top-24 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-slate-200 rotate-2 z-10 font-bold text-amber-600 max-w-[220px]" style={{ fontFamily: 'var(--font-caveat), cursive', fontSize: '1.5rem', lineHeight: '1.2' }}>
                                    Zero-dependency toggle for the owner.
                                </div>
                            </div>
                            <div className="relative group mx-auto max-w-[320px] md:max-w-none mt-12 md:mt-0">
                                <img src="/assets/cs-admin-orders.png" alt="Admin panel: menu availability management and coupon control" className="w-full h-auto rounded-[2rem] shadow-xl border-4 border-emerald-50" />
                                <div className="absolute sm:-right-16 -right-4 top-1/3 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-slate-200 -rotate-2 z-10 font-bold text-emerald-600 max-w-[240px]" style={{ fontFamily: 'var(--font-caveat), cursive', fontSize: '1.5rem', lineHeight: '1.2' }}>
                                    Live item availability & coupon control—no dev needed.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Impact */}
            <section className="bg-[#f8fafc] py-32 px-6 w-full border-t border-slate-200 fade-in-up">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-8 text-center">5. Impact <span className="text-slate-400 font-light text-2xl md:text-3xl block mt-2">(2-Week Pilot)</span></h2>

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-12">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-sm uppercase tracking-widest text-slate-400">
                                    <th className="p-4 md:p-6 font-bold">Metric</th>
                                    <th className="p-4 md:p-6 font-bold border-l border-slate-200">Before</th>
                                    <th className="p-4 md:p-6 font-bold border-l border-slate-200 text-blue-600">After</th>
                                </tr>
                            </thead>
                            <tbody className="text-[17px] md:text-lg font-medium text-slate-700 divide-y divide-slate-100">
                                <tr>
                                    <td className="p-4 md:p-6">Avg handling time (per order)</td>
                                    <td className="p-4 md:p-6 border-l border-slate-100 text-red-500">6–8 min</td>
                                    <td className="p-4 md:p-6 border-l border-slate-100 text-green-600 font-bold">2–3 min</td>
                                </tr>
                                <tr>
                                    <td className="p-4 md:p-6">Clarification messages (Rush Hour)</td>
                                    <td className="p-4 md:p-6 border-l border-slate-100 text-red-500">~12–15 messages</td>
                                    <td className="p-4 md:p-6 border-l border-slate-100 text-green-600 font-bold">2–3 messages</td>
                                </tr>
                                <tr>
                                    <td className="p-4 md:p-6">Payment mismatches (Weekly)</td>
                                    <td className="p-4 md:p-6 border-l border-slate-100 text-red-500">~8–10 mismatches</td>
                                    <td className="p-4 md:p-6 border-l border-slate-100 text-green-600 font-bold">1–2 mismatches</td>
                                </tr>
                                <tr>
                                    <td className="p-4 md:p-6">Owner relay dependency</td>
                                    <td className="p-4 md:p-6 border-l border-slate-100 text-red-500">5 manual steps</td>
                                    <td className="p-4 md:p-6 border-l border-slate-100 text-green-600 font-bold">1 oversight step</td>
                                </tr>
                                <tr>
                                    <td className="p-4 md:p-6">Order visibility</td>
                                    <td className="p-4 md:p-6 border-l border-slate-100 text-red-500">Fragmented</td>
                                    <td className="p-4 md:p-6 border-l border-slate-100 text-green-600 font-bold">Centralized</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center space-y-4 max-w-3xl mx-auto">
                        <p className="text-2xl text-slate-800 font-bold">The café shifted from conversation-driven operations to system-driven operations.</p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm font-bold uppercase tracking-widest text-blue-600 pt-4">
                            <span className="bg-blue-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm">Peak-hour stress reduced</span>
                            <span className="bg-blue-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm">Order reliability improved</span>
                            <span className="bg-blue-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm">Operational clarity increased</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. What's Next */}
            <section className="bg-slate-900 text-white py-32 px-6 w-full fade-in-up">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">6. What&apos;s Next</h2>
                    <p className="text-xl text-slate-400 mb-16 max-w-3xl font-medium leading-relaxed">
                        The current system solves the core ordering problem. These are the natural extensions that would compound that value—none were in scope, but all would be defensible next investments.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                                <i className="ph-fill ph-map-pin text-blue-400 text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Real-time Order Tracking</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">Customers get a WhatsApp confirmation but have no visibility into preparation status. A 3-state tracker (Received → Preparing → Out for Delivery) would cut &quot;where&apos;s my order?&quot; messages—currently the most common post-order query.</p>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                                <i className="ph-fill ph-clock text-amber-400 text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Estimated Delivery Time</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">Delivery fee is calculated by distance, but delivery time isn&apos;t surfaced. An ETA based on kitchen queue depth plus distance would set clearer expectations and eliminate the anxiety that drives post-order messages before they become support requests.</p>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                                <i className="ph-fill ph-arrow-clockwise text-emerald-400 text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Repeat Order & Saved Preferences</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">Many customers order the same items on a weekly cycle. A &quot;reorder last&quot; shortcut with a saved delivery address would collapse the entire checkout to 2 taps for returning customers—the highest-value cohort for a hyperlocal café.</p>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}
