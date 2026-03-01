'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CaseStudy() {
    const cursorDot = useRef(null);

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

        // 2. Scroll Animations
        const fadeSections = document.querySelectorAll('.fade-in-up');
        fadeSections.forEach((section) => {
            gsap.fromTo(section,
                { opacity: 0, y: 30 },
                { scrollTrigger: { trigger: section, start: "top 85%" }, opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
            );
        });

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseenter', handleMouseEnter);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <main className="min-h-screen bg-[#f8fafc] text-slate-800 overflow-x-hidden relative pb-32">

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

            {/* Editorial Hero Section */}
            <section className="pt-48 pb-16 px-6 fade-in-up bg-[#f8fafc] w-full min-h-[85vh] flex flex-col justify-center border-b border-slate-200">
                <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-8">
                            <span className="px-3 py-1 bg-blue-50 border border-blue-100 text-xs font-bold uppercase tracking-widest text-blue-600 rounded">UX Case Study</span>
                            <span className="px-3 py-1 bg-slate-200 border border-slate-300 text-xs font-bold uppercase tracking-widest text-slate-600 rounded">2025</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[1]">
                            Zero Friction<br /><span className="text-slate-400">Delivery.</span>
                        </h1>
                        <p className="text-2xl md:text-3xl text-slate-500 font-medium leading-tight max-w-2xl mb-12">
                            Designing an end-to-end hyperlocal Web App for Hoychoy Cafe that requires zero downloads and zero logins.
                        </p>
                        <Link href="https://www.hoychoycafe.com/" target="_blank" rel="noopener noreferrer" className="interactive-target group relative inline-flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-full text-lg font-bold hover:bg-blue-600 transition-colors">
                            View Live Project
                            <i className="ph ph-arrow-up-right text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                        </Link>
                    </div>
                    {/* Splash Screen Image Section */}
                    <div className="flex-1 w-full flex justify-center md:justify-end">
                        <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 rotate-2 hover:rotate-0 transition-transform duration-500 interactive-target">
                            <img src="/assets/hoychoy-thumb.png" alt="Hoychoy Cafe Splash Screen" className="w-full h-auto object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Act 1: The Problem (Full Width Slate) */}
            <section className="bg-slate-900 text-white py-32 px-6 w-full">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-16">🧩 The Problem</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <p className="text-2xl md:text-3xl text-slate-400 font-light leading-relaxed">
                                Local cafes face a massive hurdle: convincing users to download yet another heavy native app just to order lunch.
                            </p>
                            <p className="text-xl text-slate-300 leading-relaxed font-medium">
                                We noticed a troubling pattern in the local demographic. Users wanted immediate gratification but abandoned carts when hit with "Sign Up" or "Install App" walls.
                            </p>
                        </div>

                        {/* Dramatic Metric Callouts */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50">
                                <h3 className="text-6xl font-black text-red-400 tracking-tighter mb-4">60%</h3>
                                <p className="text-slate-400 text-lg uppercase tracking-widest font-bold">Drop-off Rate</p>
                                <p className="text-slate-500 mt-2 text-sm">When forced to download an app.</p>
                            </div>
                            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50">
                                <h3 className="text-6xl font-black text-amber-400 tracking-tighter mb-4">0</h3>
                                <p className="text-slate-400 text-lg uppercase tracking-widest font-bold">Patience</p>
                                <p className="text-slate-500 mt-2 text-sm">For complex onboarding during lunch hours.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Act 2: The Goal (Stark White) */}
            <section className="bg-white py-32 px-6 w-full border-b border-slate-100">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-12">🎯 The Goal was clear.</h2>
                    <p className="text-3xl md:text-5xl font-medium text-slate-400 leading-tight max-w-4xl mx-auto">
                        Build an accessible, <span className="text-blue-500">hyperlocal web portal</span> that handles dynamic delivery pricing and zero-login payments instantly.
                    </p>
                </div>
            </section>

            {/* Act 3: Narrative Feature Breakdown */}
            <section className="bg-[#f8fafc] py-32 px-6 w-full">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-start">

                    {/* Sticky Sidebar Text */}
                    <div className="md:col-span-4 md:sticky top-32 space-y-8">
                        <div className="w-16 h-1 bg-blue-500 mb-8"></div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">Zero-Friction Checkout Flow</h2>
                        <p className="text-xl text-slate-500 leading-relaxed font-medium">
                            The entire user journey from menu discovery to UPI payment was rigorously streamlined. We utilized the Web Share API and WhatsApp integration to bypass traditional backends.
                        </p>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-8">
                            <span className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Design Decision</span>
                            <p className="text-slate-700 text-sm">Replacing a standard database user-auth flow with an immediate WhatsApp API handoff reduced Time-To-Purchase by 4 minutes.</p>
                        </div>
                    </div>

                    {/* Scrolling Media Gallery */}
                    <div className="md:col-span-8 space-y-12">
                        <div className="bg-slate-200 rounded-[2.5rem] p-4 md:p-8 shadow-inner overflow-hidden flex justify-center">
                            <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-slate-300">
                                <img src="/assets/recording.webp" alt="Hoychoy App Ordering Flow Demo Full" className="w-full h-auto object-cover" />
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Final Act: The Tech Backbone */}
            <section className="bg-slate-900 py-32 px-6 w-full text-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-16">⚙️ The Zero-Subscription Backbone</h2>

                    <div className="bg-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700 overflow-x-auto">
                        <div className="min-w-[768px] grid grid-cols-4 gap-4 text-sm mt-4">
                            {/* Headers */}
                            <div className="font-bold text-slate-400 border-b border-slate-700 pb-2">Layer</div>
                            <div className="font-bold text-slate-400 border-b border-slate-700 pb-2">Discover & Order</div>
                            <div className="font-bold text-slate-400 border-b border-slate-700 pb-2">Payment Processing</div>
                            <div className="font-bold text-slate-400 border-b border-slate-700 pb-2">Fulfillment</div>

                            {/* Customer Actions */}
                            <div className="py-4 font-bold text-blue-400 flex items-center gap-2"><i className="ph-fill ph-user text-xl"></i> Customer Actions</div>
                            <div className="py-4 bg-slate-900 rounded p-4 border border-slate-700">Scans QR / Clicks Link & Browses Menu</div>
                            <div className="py-4 bg-slate-900 rounded p-4 border border-slate-700">Proceeds to UPI App & Pays</div>
                            <div className="py-4 bg-slate-900 rounded p-4 border border-slate-700">Receives order status via WhatsApp</div>

                            {/* Line of Interaction */}
                            <div className="col-span-4 border-t border-dashed border-slate-600 my-4 relative">
                                <span className="absolute -top-3 left-0 text-[10px] uppercase tracking-widest text-slate-500 bg-slate-800 pr-2">Line of Interaction</span>
                            </div>

                            {/* Frontstage Actions */}
                            <div className="py-4 font-bold text-indigo-400 flex items-center gap-2"><i className="ph-fill ph-device-mobile text-xl"></i> Frontstage (Next.js)</div>
                            <div className="py-4 bg-slate-900 rounded p-4 border border-slate-700">Renders Dynamic UI & Cart State</div>
                            <div className="py-4 bg-slate-900 rounded p-4 border border-slate-700">Generates Deep UPI URI with exact amount</div>
                            <div className="py-4 bg-slate-900 rounded p-4 border border-slate-700">Displays Success/Error UI State</div>

                            {/* Line of Visibility */}
                            <div className="col-span-4 border-t border-dashed border-slate-600 my-4 relative">
                                <span className="absolute -top-3 left-0 text-[10px] uppercase tracking-widest text-slate-500 bg-slate-800 pr-2">Line of Visibility</span>
                            </div>

                            {/* Backstage Actions */}
                            <div className="py-4 font-bold text-purple-400 flex items-center gap-2"><i className="ph-fill ph-code text-xl"></i> Backstage (Logic)</div>
                            <div className="py-4 bg-slate-900 rounded p-4 border border-slate-700">Calculates Haversine distance pricing</div>
                            <div className="py-4 bg-slate-900 rounded p-4 border border-slate-700">Generates UPI URL parameters automatically</div>
                            <div className="py-4 bg-slate-900 rounded p-4 border border-slate-700">Formats order JSON into WhatsApp string</div>

                            {/* Line of Internal Interaction */}
                            <div className="col-span-4 border-t border-dashed border-slate-600 my-4 relative">
                                <span className="absolute -top-3 left-0 text-[10px] uppercase tracking-widest text-slate-500 bg-slate-800 pr-2">Line of Internal Interaction</span>
                            </div>

                            {/* Support Processes */}
                            <div className="py-4 font-bold text-green-400 flex items-center gap-2"><i className="ph-fill ph-database text-xl"></i> Support (APIs)</div>
                            <div className="py-4 bg-slate-900 rounded p-4 border border-slate-700">Vercel Edge Functions running Node.js</div>
                            <div className="py-4 bg-slate-900 rounded p-4 border border-slate-700">Zero-fee UPI network rails</div>
                            <div className="py-4 bg-slate-900 rounded p-4 border border-slate-700">Telegram Bot API POST request to Merchant</div>
                        </div>
                        <p className="text-slate-400 text-center mt-12 text-lg max-w-3xl mx-auto">
                            By chaining together free-tier APIs into this service blueprint, we entirely sidestepped the need for continuous AWS/database hosting costs, providing the client with an infinitely scalable architecture for $0/month in server fees.
                        </p>
                    </div>
                </div>
            </section>

        </main>
    );
}
