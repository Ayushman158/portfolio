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
                            <span className="px-3 py-1 bg-purple-50 border border-purple-100 text-xs font-bold uppercase tracking-widest text-purple-600 rounded">UX Lead & Product Owner</span>
                            <span className="px-3 py-1 bg-slate-200 border border-slate-300 text-xs font-bold uppercase tracking-widest text-slate-600 rounded">6 Weeks</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[1]">
                            Structured<br /><span className="text-slate-400">Ordering.</span>
                        </h1>
                        <p className="text-2xl md:text-3xl text-slate-500 font-medium leading-tight max-w-2xl mb-12">
                            Transforming conversational, manual WhatsApp ordering into a structured, low-friction system.
                        </p>
                        <p className="text-lg md:text-xl text-slate-600 font-medium mb-12 max-w-2xl border-l-4 border-blue-500 pl-4 py-1">
                            <strong>My Role & Ownership:</strong> I led research synthesis, workflow mapping, service blueprint creation, UX architecture, client communication, and pilot validation.
                        </p>
                        <Link href="https://www.hoychoycafe.com/" target="_blank" rel="noopener noreferrer" className="interactive-target group relative inline-flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-full text-lg font-bold hover:bg-blue-600 transition-colors">
                            View Live Project
                            <i className="ph ph-arrow-up-right text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                        </Link>
                    </div>
                    {/* Splash Screen Image Section */}
                    <div className="flex-1 w-full flex justify-center md:justify-end relative">
                        <div className="w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 rotate-2 hover:rotate-0 transition-transform duration-500 interactive-target">
                            <img src="/assets/hoychoy-thumb.png" alt="Hoychoy Cafe Splash Screen" className="w-full h-auto object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Act 1: The Context & flow Issue */}
            <section className="bg-slate-900 text-white py-32 px-6 w-full">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-16">1. The Workflow Issue</h2>

                    {/* Problem Framing */}
                    <div className="bg-slate-800/80 rounded-3xl p-8 md:p-10 border border-slate-700/50 mb-16 max-w-4xl">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Problem Framing</h3>
                        <p className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed mb-6">
                            Operational chaos was caused by unstructured conversational ordering. The owner became the sole bottleneck, attempting to parse hundreds of disjointed messages, payments, and addresses simultaneously during rush hours.
                        </p>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                            <span className="text-blue-400 font-bold uppercase tracking-widest text-xs block mb-2">How Might We</span>
                            <p className="text-lg text-blue-100 font-medium">
                                Preserve WhatsApp's familiarity and trust while introducing structured, automated clarity for the business owner?
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                        <div className="space-y-8">
                            <p className="text-2xl md:text-3xl text-slate-400 font-light leading-relaxed">
                                Hoychoy Café handled all online orders through WhatsApp. Customers viewed a PDF, typed their address, and sent UPI screenshots.
                            </p>
                            <p className="text-xl text-slate-300 leading-relaxed font-medium mb-8">
                                The system worked—until peak hours exposed its fragility. The owner manually clarified missing details, verified payments, and relayed orders to the kitchen. <strong>This wasn't a UI issue. It was a workflow issue.</strong>
                            </p>

                            {/* "Before System" Flow Diagram (FigJam Style) */}
                            <div className="bg-[#fcfbf9] rounded-2xl p-8 border border-[#e5e5e5] mt-8 shadow-sm">
                                <span className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-6">Old System Architecture (Bottlenecked)</span>
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
                                    <div className="bg-white shadow-sm border border-[#e5e5e5] px-4 py-4 rounded w-full sm:w-auto text-sm font-medium text-slate-700 shrink-0">
                                        <i className="ph-fill ph-user mb-2 block text-slate-400 text-xl"></i> Customer
                                    </div>
                                    <i className="ph-bold ph-arrow-right text-slate-400 hidden sm:block"></i>
                                    <i className="ph-bold ph-arrow-down text-slate-400 sm:hidden"></i>

                                    <div className="bg-[#eefcf3] shadow-sm border border-[#bbf7d0] px-4 py-4 rounded w-full sm:w-auto text-sm font-medium text-green-800 shrink-0">
                                        <i className="ph-fill ph-whatsapp-logo mb-2 block text-green-600 text-xl"></i> Chat
                                    </div>
                                    <i className="ph-bold ph-arrow-right text-slate-400 hidden sm:block"></i>
                                    <i className="ph-bold ph-arrow-down text-slate-400 sm:hidden"></i>

                                    <div className="bg-[#fef2f2] shadow-sm border border-[#fecaca] px-4 py-4 rounded w-full sm:w-auto text-sm font-bold text-red-800 flex-1 relative">
                                        <i className="ph-fill ph-warning mb-2 block text-red-500 text-xl mx-auto"></i> Owner (Bottleneck)
                                    </div>
                                    <i className="ph-bold ph-arrow-right text-slate-400 hidden sm:block"></i>
                                    <i className="ph-bold ph-arrow-down text-slate-400 sm:hidden"></i>

                                    <div className="bg-white shadow-sm border border-[#e5e5e5] px-4 py-4 rounded w-full sm:w-auto text-sm font-medium text-slate-700 shrink-0">
                                        <i className="ph-fill ph-cooking-pot mb-2 block text-slate-400 text-xl"></i> Kitchen
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Research Insights Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 h-full flex flex-col justify-center">
                                <h3 className="text-6xl font-black text-red-400 tracking-tighter mb-4">50%</h3>
                                <p className="text-slate-400 text-lg uppercase tracking-widest font-bold">Of Peak Time</p>
                                <p className="text-slate-500 mt-2 text-sm">spent exclusively clarifying incomplete orders with customers.</p>
                            </div>
                            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 h-full flex flex-col justify-center">
                                <h3 className="text-6xl font-black text-amber-400 tracking-tighter mb-4">50+</h3>
                                <p className="text-slate-400 text-lg uppercase tracking-widest font-bold">Threads Analyzed</p>
                                <p className="text-slate-500 mt-2 text-sm">revealing payment mismatch and lost orders as core friction points.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Act 2: Key Insight & Real User Signals */}
            <section className="bg-[#f9fafb] py-32 px-6 w-full border-b border-slate-200">
                <div className="max-w-6xl mx-auto flex flex-col items-center">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 font-serif italic text-blue-600">The Critical Insight</h2>
                        <p className="text-3xl md:text-5xl font-bold text-slate-400 leading-tight max-w-4xl mx-auto mt-8">
                            The problem wasn't WhatsApp itself. <br /><span className="text-slate-900">The problem was the absence of a structured system.</span>
                        </p>
                    </div>

                    <div className="w-full max-w-3xl">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 text-center">Real User Signals (Informality & Ambiguity)</h3>
                        <div className="flex flex-col gap-4">
                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl rounded-tl-sm self-start max-w-md shadow-sm">
                                <p className="text-slate-700 font-medium font-mono text-sm">"Bro payment sent check once"</p>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl rounded-tl-sm self-start max-w-md shadow-sm">
                                <p className="text-slate-700 font-medium font-mono text-sm">"Address same as last time"</p>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl rounded-tl-sm self-start max-w-md shadow-sm">
                                <p className="text-slate-700 font-medium font-mono text-sm">"Add extra gravy pls"</p>
                            </div>
                            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tr-sm self-end max-w-md shadow-sm mt-2">
                                <p className="text-slate-500 font-medium text-sm">Owner: <span className="italic text-slate-400">Scrambling to match screenshots to addresses while 6 other messages arrive.</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Act 3: Service Blueprint (FigJam Style) */}
            <section className="bg-[#f2f0eb] py-32 px-6 w-full text-slate-900 border-b border-slate-200" style={{ backgroundImage: 'radial-gradient(#d4d4d4 1px, transparent 0)', backgroundSize: '24px 24px' }}>
                <div className="max-w-6xl mx-auto backdrop-blur-sm">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">3. Uncovering Friction</h2>
                    <p className="text-xl md:text-2xl text-slate-600 mb-16 max-w-3xl leading-relaxed font-medium">
                        To uncover hidden friction, I mapped the entire service flow using classic FigJam-style blueprints. The single point of failure became immediately obvious: <strong>the owner</strong>.
                    </p>

                    {/* Before Blueprint (FigJam) */}
                    <div className="bg-white/80 rounded-2xl p-8 md:p-12 border border-slate-200 shadow-sm mb-16 relative overflow-x-auto">
                        <div className="absolute top-0 right-0 bg-red-50 text-red-600 px-4 py-2 rounded-bl-2xl rounded-tr-xl font-bold text-sm uppercase tracking-widest border-b border-l border-red-100">Before Redesign</div>
                        <div className="min-w-[800px] grid grid-cols-4 gap-4 text-sm mt-4 font-medium">
                            <div className="font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Layer</div>
                            <div className="font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Menu Discovery</div>
                            <div className="font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Ordering & Payment</div>
                            <div className="font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Coordination</div>

                            <div className="py-4 font-bold text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2">Customer Actions</div>
                            <div className="bg-[#fff9c4] shadow-sm border border-[#fff59d] rounded p-3 text-slate-800">Views PDF menu</div>
                            <div className="bg-[#fff9c4] shadow-sm border border-[#fff59d] rounded p-3 text-slate-800">Sends chat order & UPI screenshot</div>
                            <div className="bg-[#fff9c4] shadow-sm border border-[#fff59d] rounded p-3 text-slate-800">Manually types address</div>

                            <div className="py-4 font-bold text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2">Frontstage</div>
                            <div className="bg-[#eefcf3] shadow-sm border border-[#bbf7d0] rounded p-3 col-span-3 text-center text-green-800">WhatsApp Chat Interface</div>

                            <div className="py-4 font-bold text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2">Backstage (Owner)</div>
                            <div className="bg-[#fef2f2] shadow-sm border border-[#fecaca] rounded p-3 col-span-2 text-red-800 font-bold">Reads, clarifies missing details, verifies payment screenshots</div>
                            <div className="bg-[#fef2f2] shadow-sm border border-[#fecaca] rounded p-3 text-red-800 font-bold">Manually relays to kitchen</div>

                            <div className="py-4 font-bold text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2">Support Systems</div>
                            <div className="bg-slate-50 shadow-sm border border-slate-200 rounded p-3 text-slate-700">PDF File</div>
                            <div className="bg-slate-50 shadow-sm border border-slate-200 rounded p-3 text-slate-700">UPI App / Phone Gallery</div>
                            <div className="bg-slate-50 shadow-sm border border-slate-200 rounded p-3 text-slate-700">Verbal Instructions</div>
                        </div>
                    </div>

                    {/* After Blueprint (FigJam) */}
                    <div className="bg-white/80 rounded-2xl p-8 md:p-12 border border-slate-200 shadow-sm overflow-x-auto relative">
                        <div className="absolute top-0 right-0 bg-green-50 text-green-600 px-4 py-2 rounded-bl-2xl rounded-tr-xl font-bold text-sm uppercase tracking-widest border-b border-l border-green-100">After Redesign</div>
                        <div className="min-w-[800px] grid grid-cols-4 gap-4 text-sm mt-4 font-medium">
                            <div className="font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Layer</div>
                            <div className="font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Menu Discovery</div>
                            <div className="font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Checkout</div>
                            <div className="font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Fulfillment</div>

                            <div className="py-4 font-bold text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2">Customer Actions</div>
                            <div className="bg-[#fff9c4] shadow-sm border border-[#fff59d] rounded p-3 text-slate-800">Scans QR / Clicks Link & Browses menu</div>
                            <div className="bg-[#fff9c4] shadow-sm border border-[#fff59d] rounded p-3 text-slate-800">Adds to cart & Checkout via UPI</div>
                            <div className="bg-[#fff9c4] shadow-sm border border-[#fff59d] rounded p-3 text-slate-800">Receives order status via WhatsApp</div>

                            <div className="py-4 font-bold text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2">Frontstage</div>
                            <div className="bg-[#e0f2fe] shadow-sm border border-[#bae6fd] rounded p-3 col-span-2 text-sky-800 font-bold">Mobile web ordering & Auto-formatted summary</div>
                            <div className="bg-[#eefcf3] shadow-sm border border-[#bbf7d0] rounded p-3 text-green-800">WhatsApp (Optional)</div>

                            <div className="py-4 font-bold text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2">Backstage</div>
                            <div className="bg-slate-50 shadow-sm border border-slate-200 rounded p-3 text-slate-500 text-center italic">Fully Automated</div>
                            <div className="bg-[#ecfdf5] shadow-sm border border-[#a7f3d0] rounded p-3 text-emerald-800 font-bold">Order securely stored in Dashboard</div>
                            <div className="bg-[#ecfdf5] shadow-sm border border-[#a7f3d0] rounded p-3 text-emerald-800 font-bold">Telegram alert & Structured Kitchen Display</div>

                            <div className="py-4 font-bold text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2">Support Systems</div>
                            <div className="bg-slate-50 shadow-sm border border-slate-200 rounded p-3 text-slate-700">Web App Database</div>
                            <div className="bg-slate-50 shadow-sm border border-slate-200 rounded p-3 text-slate-700 flex gap-2"><span className="bg-[#5f259f] text-white px-2 rounded font-bold uppercase text-[10px] flex items-center shadow-sm">PhonePe</span></div>
                            <div className="bg-slate-50 shadow-sm border border-slate-200 rounded p-3 text-slate-700 flex gap-2"><span className="bg-[#229ED9] text-white px-2 rounded font-bold uppercase text-[10px] flex items-center shadow-sm">Telegram API</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Act 4: Information Architecture (FigJam Style) */}
            <section className="bg-white py-32 px-6 w-full text-slate-900 border-b border-slate-200">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">4. Information Architecture</h2>
                    <p className="text-xl md:text-2xl text-slate-600 mb-16 max-w-3xl leading-relaxed font-medium">
                        A flat, linear architecture designed for extreme speed. No dead ends, no complex navigation trees—just a direct funnel from discovery to payment to confirmation.
                    </p>

                    {/* IA Diagram */}
                    <div className="bg-[#fcfbf9] rounded-3xl p-8 md:p-12 border border-[#e5e5e5] shadow-sm overflow-x-auto relative" style={{ backgroundImage: 'radial-gradient(#d4d4d4 1px, transparent 0)', backgroundSize: '24px 24px' }}>
                        <div className="min-w-[800px] flex flex-col items-center gap-4 font-medium text-sm">

                            {/* Level 1: Entry */}
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

                            {/* Level 2: Core */}
                            <div className="bg-[#e0f2fe] shadow-sm border border-[#bae6fd] px-8 py-5 rounded-2xl text-sky-900 font-bold text-lg text-center w-[480px] z-10 hover:-translate-y-1 transition-transform">
                                <i className="ph-fill ph-house text-3xl mb-2 text-sky-500 block"></i>
                                Main Menu (Single Page)
                            </div>

                            <i className="ph-bold ph-arrow-down text-2xl text-slate-300"></i>

                            {/* Level 3: Branches */}
                            <div className="flex gap-12 items-start relative pb-4">
                                {/* Filter Branch */}
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

                                {/* Cart Branch */}
                                <div className="flex flex-col items-center gap-6">
                                    <div className="bg-[#eefcf3] shadow-sm border border-[#bbf7d0] px-8 py-5 rounded-3xl text-green-900 font-bold text-center w-72 z-10 hover:-translate-y-1 transition-transform text-lg">
                                        <i className="ph-fill ph-shopping-cart text-3xl mb-2 text-green-500 block"></i>
                                        Slide-out Cart
                                    </div>

                                    <i className="ph-bold ph-arrow-down text-2xl text-slate-300 -mt-2"></i>

                                    {/* Checkout */}
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

                                    {/* Payment / Automation */}
                                    <div className="flex gap-6">
                                        <div className="bg-[#f3e8ff] shadow-sm border border-[#e9d5ff] px-6 py-4 rounded-xl text-purple-900 font-bold text-center w-48 relative z-10 hover:-translate-y-1 transition-transform">
                                            <i className="ph-fill ph-currency-inr text-3xl mb-2 text-purple-500 block"></i>
                                            UPI Deep Link
                                        </div>
                                        <div className="bg-[#fef2f2] shadow-sm border border-[#fecaca] px-6 py-4 rounded-xl text-red-900 font-bold text-center w-48 relative z-10 hover:-translate-y-1 transition-transform">
                                            <i className="ph-fill ph-paper-plane-tilt text-3xl mb-2 text-red-500 block"></i>
                                            Telegram Connect
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

            {/* Act 5: Strategy, Solution & Impact */}
            <section className="bg-[#f8fafc] py-32 px-6 w-full border-t border-slate-200">
                <div className="max-w-6xl mx-auto space-y-32">

                    {/* Design Strategy */}
                    <div>
                        <div className="w-16 h-1 bg-blue-500 mb-8"></div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-8">5. Design Strategy (Model Shift)</h2>
                        <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl mb-12">
                            Instead of completely replacing WhatsApp, we repositioned it. We preserved user familiarity while introducing operational clarity for the owner.
                        </p>

                        <div className="grid grid-cols-1 gap-8 max-w-4xl bg-[#fcfbf9] rounded-3xl border border-[#e5e5e5] p-8 md:p-12 shadow-sm">
                            <div className="relative">
                                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Old Model (Friction)</h3>
                                <div className="flex flex-col sm:flex-row items-center gap-4 text-sm font-medium">
                                    <span className="bg-[#eefcf3] shadow-sm border border-[#bbf7d0] text-green-800 px-4 py-3 rounded">WhatsApp</span>
                                    <i className="ph-bold ph-arrow-right text-slate-400 hidden sm:block"></i>
                                    <i className="ph-bold ph-arrow-down text-slate-400 sm:hidden"></i>
                                    <span className="bg-[#fef2f2] shadow-sm border border-[#fecaca] text-red-800 px-4 py-3 rounded flex-1 text-center font-bold">Manual Owner Relay</span>
                                    <i className="ph-bold ph-arrow-right text-slate-400 hidden sm:block"></i>
                                    <i className="ph-bold ph-arrow-down text-slate-400 sm:hidden"></i>
                                    <span className="bg-white shadow-sm border border-[#e5e5e5] text-slate-700 px-4 py-3 rounded">Kitchen</span>
                                </div>
                            </div>

                            <div className="border-t border-dashed border-slate-300 my-2"></div>

                            <div className="relative">
                                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">New Model (Flow)</h3>
                                <div className="flex flex-col gap-4 text-sm font-medium">
                                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                                        <span className="bg-white shadow-sm border border-[#e5e5e5] text-slate-700 px-4 py-3 rounded shrink-0">QR / Link</span>
                                        <i className="ph-bold ph-arrow-right text-slate-400 hidden sm:block"></i>
                                        <i className="ph-bold ph-arrow-down text-slate-400 sm:hidden"></i>
                                        <span className="bg-[#e0f2fe] shadow-sm border border-[#bae6fd] text-sky-800 px-4 py-3 rounded text-center flex-1 font-bold">Structured Web Order</span>
                                        <i className="ph-bold ph-arrow-right text-slate-400 hidden sm:block"></i>
                                        <i className="ph-bold ph-arrow-down text-slate-400 sm:hidden"></i>
                                        <span className="bg-[#ecfdf5] shadow-sm border border-[#a7f3d0] text-emerald-800 px-4 py-3 rounded text-center font-bold flex-1">Dashboard + Alerts</span>
                                        <i className="ph-bold ph-arrow-right text-slate-400 hidden sm:block"></i>
                                        <i className="ph-bold ph-arrow-down text-slate-400 sm:hidden"></i>
                                        <span className="bg-white shadow-sm border border-[#e5e5e5] text-slate-700 px-4 py-3 rounded shrink-0">Kitchen</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Solution & UX Decisions */}
                    {/* Problem Framing */}
                    <div className="bg-slate-800/80 rounded-3xl p-8 md:p-10 border border-slate-700/50 mb-16 max-w-4xl">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Problem Framing</h3>
                        <p className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed mb-6">
                            Operational chaos was caused by unstructured conversational ordering. The owner became the sole bottleneck, attempting to parse hundreds of disjointed messages, payments, and addresses simultaneously during rush hours.
                        </p>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                            <span className="text-blue-400 font-bold uppercase tracking-widest text-xs block mb-2">How Might We</span>
                            <p className="text-lg text-blue-100 font-medium">
                                Preserve WhatsApp's familiarity and trust while introducing structured, automated clarity for the business owner?
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                        <div className="space-y-16">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-8">6. The Solution</h2>
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-800 mb-2">1. Branded Web Interface</h4>
                                        <p className="text-slate-500 leading-relaxed">Mobile-first structured menu with real-time availability and absolutely no login barrier.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-800 mb-2">2. Streamlined Checkout</h4>
                                        <p className="text-slate-500 leading-relaxed">Add-to-cart, kitchen notes, UPI or COD integration, and minimal required fields.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-800 mb-2">3. Communication Layer</h4>
                                        <p className="text-slate-500 leading-relaxed">Structured orders routed straight to a Dashboard, triggering automated Telegram alerts to the Kitchen. The owner is no longer the relay bottleneck.</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">7. UX Decisions</h2>
                                <ul className="space-y-4 text-slate-600 font-medium list-disc pl-5">
                                    <li>No login barrier prioritizing immediate conversion.</li>
                                    <li>Web-first logic over forcing a native app download.</li>
                                    <li>WhatsApp preserved as a trust and confirmation layer.</li>
                                    <li>Telegram designated for internal staff coordination.</li>
                                    <li>Single Source of Truth established via a central dashboard.</li>
                                    <li>Minimal cognitive load design.</li>
                                </ul>
                                <p className="mt-8 text-xl font-bold text-blue-600 italic">"This was not a UI redesign. It was a systems redesign."</p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 mt-16">Iteration Example</h2>
                                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm mb-6">
                                    <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                                        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-8 flex items-center justify-center text-slate-400 text-sm font-medium text-center shadow-inner h-32">
                                            [Visual: Text-heavy Checkout Form]
                                        </div>
                                        <i className="ph-bold ph-arrow-right text-2xl text-slate-300 hidden sm:block"></i>
                                        <i className="ph-bold ph-arrow-down text-2xl text-slate-300 sm:hidden"></i>
                                        <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-8 flex items-center justify-center text-blue-500 text-sm font-bold text-center shadow-inner h-32">
                                            [Visual: One-Tap UPI Checkout Screen]
                                        </div>
                                    </div>
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                        <strong>Before:</strong> The initial checkout draft forced users to manually type long delivery instructions and address formats. <br /><br /><strong>After:</strong> We swapped the manual text area for one-tap structured toggles (e.g., "Same as last time") and hardcoded direct UPI deep links. <br /><br /><strong>Why:</strong> This structural change eliminated keyboard interaction, dropping checkout abandonment by converting a typing task into a tapping task.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Media Display */}
                        <div className="bg-slate-200 rounded-[2.5rem] p-4 md:p-8 shadow-inner overflow-hidden flex justify-center sticky top-32">
                            <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-slate-300 relative group bg-white">
                                <img src="/assets/recording.webp" alt="Menu, Cart, Checkout, Order Confirmation" className="w-full h-auto object-cover" />
                            </div>
                        </div>
                    </div>

                    {/* Impact */}
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-8 text-center">8. Impact <span className="text-slate-400 font-light text-2xl md:text-3xl block mt-2">(2-Week Pilot)</span></h2>

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
                </div>
            </section>
        </main>
    );
}
