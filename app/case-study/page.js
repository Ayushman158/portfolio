'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CaseStudy() {
    const cursorDot = useRef(null);
    const cursorRing = useRef(null);

    useEffect(() => {
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);

        // 1. Custom Cursor Logic
        const xToDot = gsap.quickTo(cursorDot.current, "x", { duration: 0.1, ease: "power3" });
        const yToDot = gsap.quickTo(cursorDot.current, "y", { duration: 0.1, ease: "power3" });
        const xToRing = gsap.quickTo(cursorRing.current, "x", { duration: 0.3, ease: "power3" });
        const yToRing = gsap.quickTo(cursorRing.current, "y", { duration: 0.3, ease: "power3" });

        const moveCursor = (e) => {
            xToDot(e.clientX);
            yToDot(e.clientY);
            xToRing(e.clientX);
            yToRing(e.clientY);
        };

        window.addEventListener('mousemove', moveCursor);

        // Interactive Elements Cursor State
        const interactiveEls = document.querySelectorAll('a, button, .interactive-target');
        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursorRing.current, { scale: 1.5, backdropFilter: 'blur(4px)', backgroundColor: 'rgba(14, 165, 233, 0.1)', duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursorRing.current, { scale: 1, backdropFilter: 'blur(0px)', backgroundColor: 'transparent', duration: 0.3 });
            });
        });

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
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <main className="min-h-screen bg-[#f8fafc] text-slate-800 overflow-x-hidden relative pb-32">

            {/* Custom Cursor Elements */}
            <div className="hidden md:block">
                <div ref={cursorDot} className="fixed top-0 left-0 w-2 h-2 rounded-full bg-blue-500 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"></div>
                <div ref={cursorRing} className="fixed top-0 left-0 w-10 h-10 rounded-full border border-blue-400 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-colors duration-300"></div>
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

            {/* Case Study Header */}
            <header className="pt-48 pb-16 px-6 fade-in-up">
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        <span className="px-3 py-1 bg-white border border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500 rounded-full">UI/UX Design</span>
                        <span className="px-3 py-1 bg-white border border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500 rounded-full">Frontend Development</span>
                        <span className="px-3 py-1 bg-white border border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500 rounded-full">Vibe Coding</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-4">
                        Hoychoy Cafe
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 font-light mb-8">
                        End-to-End Hyperlocal Delivery App
                    </p>

                    <div className="flex justify-center mb-16">
                        <Link href="https://www.hoychoycafe.com/" target="_blank" rel="noopener noreferrer" className="interactive-target group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:bg-slate-800 transition-all hover:-translate-y-1 hover:shadow-xl">
                            View Live Project
                            <i className="ph ph-arrow-up-right text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-left border-y border-slate-200 py-8">
                        <div>
                            <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Client</span>
                            <span className="text-slate-900 font-medium">Hoychoy Cafe<br /><span className="text-slate-500 text-sm">Golaghat, Assam</span></span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Role</span>
                            <span className="text-slate-900 font-medium">UI/UX Designer<br /><span className="text-slate-500 text-sm">Frontend Developer</span></span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Timeline</span>
                            <span className="text-slate-900 font-medium">Shipped 2026</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Formatted for Readability */}
            <article className="max-w-3xl mx-auto px-6 space-y-24">

                {/* Section 1 */}
                <section className="fade-in-up space-y-6">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight border-b border-slate-200 pb-2">1. Context & Overview</h2>

                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">The Story</h3>
                            <p className="text-slate-600 leading-relaxed">
                                In the small town of Golaghat, Assam, working professionals—especially those at companies like ONGC—frequently face a dilemma: a lack of reliable food delivery. Major aggregators like Zomato and Swiggy are unavailable, leaving a gap for accessible, fast, and digital-first food ordering.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">The Problem</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Hoychoy Cafe needed a direct-to-consumer digital ordering experience. The solution had to be frictionless, requiring zero app downloads or logins, while offering a modern, premium feel that working professionals expect.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">The Goal</h3>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                To design and build an easy-to-use hyperlocal web application from scratch—handling everything from menu browsing and dynamic distance-based delivery calculations to final UPI payment and automated order transmission.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 2: User Research & Empathy */}
                <section className="fade-in-up space-y-6">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight border-b border-slate-200 pb-2">2. User Research & Empathy</h2>
                    <p className="text-slate-600 leading-relaxed">
                        To build a frictionless ordering system, I needed to deeply understand the core users in Golaghat. I identified key pain points and structured them into actionable User Stories to drive the design architecture.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {/* Persona 1 */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col h-full">
                            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                                    <i className="ph-fill ph-briefcase text-2xl text-blue-500"></i>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 leading-tight">The Busy Professional</h3>
                                    <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Persona Snapshot</span>
                                </div>
                            </div>
                            <p className="text-lg text-slate-700 font-medium italic mb-6 flex-grow">"I want a quick way to order lunch without downloading another app, so I can eat and get back to work immediately."</p>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-auto">
                                <span className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Product Decision</span>
                                <p className="text-sm text-slate-700">Opted for a zero-login Web App solution rather than a native App Store download to eliminate onboarding friction and ensure instant access.</p>
                            </div>
                        </div>
                        {/* Persona 2 */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col h-full">
                            <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                                    <i className="ph-fill ph-house-line text-2xl text-amber-500"></i>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 leading-tight">The Local Resident</h3>
                                    <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Persona Snapshot</span>
                                </div>
                            </div>
                            <p className="text-lg text-slate-700 font-medium italic mb-6 flex-grow">"I want to easily see what's actually available right now and exactly how much delivery will cost to my specific neighborhood."</p>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-auto">
                                <span className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Product Decision</span>
                                <p className="text-sm text-slate-700">Implemented real-time visual inventory toggles and precise GPS-based coordinate tracking for fair, dynamic delivery pricing.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: UX Strategy */}
                <section className="fade-in-up space-y-6">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight border-b border-slate-200 pb-2">3. Product Strategy & Flow</h2>

                    <div className="space-y-4 text-slate-600 leading-relaxed">
                        <p>The core product strategy was bridging the gap between local merchant operations and modern consumer expectations. Rather than over-engineering a heavy native application, the product relies on extreme accessibility and business constraints.</p>
                        <h3 className="text-xl font-bold text-blue-600 mt-6">Discover → Select → Pay</h3>
                        <p>The product journey was rigorously streamlined to minimize friction and maximize conversion rates:</p>

                        {/* Graphical User Task Flow */}
                        <div className="flex flex-col md:flex-row items-center gap-4 mt-8 pb-4">
                            {/* Step 1 */}
                            <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center relative w-full">
                                <div className="w-10 h-10 mx-auto bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                                    <i className="ph-fill ph-storefront text-xl"></i>
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">Immediate Access</h4>
                                <p className="text-xs text-slate-500">Users land directly on the menu. No signups, no onboarding.</p>
                            </div>

                            <i className="ph-bold ph-arrow-right text-slate-300 text-2xl hidden md:block"></i>
                            <i className="ph-bold ph-arrow-down text-slate-300 text-2xl block md:hidden"></i>

                            {/* Step 2 */}
                            <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center relative w-full">
                                <div className="w-10 h-10 mx-auto bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-3">
                                    <i className="ph-fill ph-toggle-left text-xl"></i>
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">Clear Availability</h4>
                                <p className="text-xs text-slate-500">Out-of-stock items visually disable in real-time, preventing errors.</p>
                            </div>

                            <i className="ph-bold ph-arrow-right text-slate-300 text-2xl hidden md:block"></i>
                            <i className="ph-bold ph-arrow-down text-slate-300 text-2xl block md:hidden"></i>

                            {/* Step 3 */}
                            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm text-center relative w-full">
                                <div className="w-10 h-10 mx-auto bg-slate-800 text-white rounded-full flex items-center justify-center mb-3">
                                    <i className="ph-fill ph-navigation-arrow text-xl"></i>
                                </div>
                                <h4 className="font-bold text-white mb-1">Frictionless Pay</h4>
                                <p className="text-xs text-slate-400">GPS triggers automated Haversine distance pricing logic.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 4 */}
                <section className="fade-in-up space-y-6">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight border-b border-slate-200 pb-2">4. Visual Identity</h2>
                    <p className="text-slate-600 leading-relaxed">
                        Taking cues from modern food-tech paradigms, the app employs a <strong className="text-slate-800">Premium Dark Theme</strong> designed to evoke an exclusive, high-end feel while remaining highly functional on mobile screens.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                            <div className="w-16 h-16 mx-auto bg-[#0A0A0A] border border-slate-200 rounded-full shadow-inner mb-4"></div>
                            <strong className="block text-slate-900 mb-1">Backgrounds</strong>
                            <p className="text-xs text-slate-500">Deep black (`#0A0A0A`) for high contrast.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                            <div className="w-16 h-16 mx-auto bg-[#F4C542] rounded-full shadow-[0_0_20px_rgba(244,197,66,0.3)] mb-4"></div>
                            <strong className="block text-slate-900 mb-1">Action Color</strong>
                            <p className="text-xs text-slate-500">Appetizing yellow (`#F4C542`) drives interaction.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                            <div className="w-16 h-16 mx-auto flex items-center justify-center bg-slate-900 text-white font-bold text-2xl rounded-full mb-4">Aa</div>
                            <strong className="block text-slate-900 mb-1">Typography</strong>
                            <p className="text-xs text-slate-500">System-native sans-serif for blazing performance.</p>
                        </div>
                    </div>
                </section>

                {/* Section 5: Mobile Mockups */}
                <section className="fade-in-up space-y-8">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight border-b border-slate-200 pb-2">5. Shipped Application (Mockups)</h2>
                    <p className="text-slate-600 leading-relaxed max-w-2xl">
                        Below is the live application flow. The interface is optimized entirely for mobile interactions, focusing on speed, visual clarity, and preventing user error during checkout.
                    </p>

                    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 pt-8">

                        {/* Interactive Mobile Mockup Frame */}
                        <div className="relative mx-auto lg:mx-0 w-[300px] sm:w-[320px] rounded-[3rem] border-[8px] border-slate-900 shadow-2xl bg-slate-950 overflow-hidden shrink-0 flex flex-col h-[650px]">
                            {/* Hardware Details: Dynamic Island & Bezel */}
                            <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 flex justify-center z-50 rounded-b-xl w-[120px] mx-auto pointer-events-none"></div>

                            {/* Digital Breadcrumbs Header (App Overlay) */}
                            <div className="bg-slate-900 pt-10 pb-3 px-5 z-40 relative shadow-sm border-b border-white/10 flex justify-between items-center text-white/80">
                                <div className="text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5 opacity-80">
                                    <span className="text-blue-400">Home</span>
                                    <i className="ph-bold ph-caret-right text-[8px]"></i>
                                    <span>Menu</span>
                                    <i className="ph-bold ph-caret-right text-[8px]"></i>
                                    <span className="opacity-50">Cart</span>
                                </div>
                                <i className="ph-fill ph-list text-lg"></i>
                            </div>

                            {/* Screen Content (Video/Image Loop) */}
                            <div className="relative flex-grow bg-slate-100 overflow-hidden">
                                {/* Simulated Video / Animated Frame Sequence */}
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover"
                                    poster="/assets/hero.png"
                                >
                                    <source src="/assets/demo.mp4" type="video/mp4" />
                                    {/* Fallback to image if video isn't linked yet */}
                                    <img src="/assets/hero.png" alt="App Mockup" className="absolute inset-0 w-full h-full object-cover" />
                                </video>
                                {/* Gradient fade at bottom for realistic scroll cutoff */}
                                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none"></div>
                            </div>

                            {/* Simulated Native OS Home Indicator */}
                            <div className="absolute bottom-2 inset-x-0 flex justify-center z-50 pointer-events-none">
                                <div className="w-1/3 h-1 bg-white/50 rounded-full"></div>
                            </div>
                        </div>

                        {/* Annotations / Context */}
                        <div className="max-w-md space-y-6">
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Zero-Friction Journey</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    The entire flow from discovery to checkout minimizes cognitive load. Notice the breadcrumbs locking the user into context—always aware of their position in the funnel without feeling trapped.
                                </p>
                            </div>
                            <div className="flex gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                <i className="ph-duotone ph-play-circle text-3xl text-blue-500"></i>
                                <p className="text-sm text-blue-900 font-medium">The prototype demonstrates the real-time interaction feedback and seamless transitions between catalog and cart states.</p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Section 6 */}
                <section className="fade-in-up space-y-6">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight border-b border-slate-200 pb-2">6. Engineering & "Vibe Coding"</h2>
                    <p className="text-slate-600 leading-relaxed">
                        This project wasn't just designed; it was <em className="text-slate-900 font-medium">built end-to-end</em>. It exemplifies the power of <strong>Vibe Coding</strong>—using rapid, intent-driven, AI-assisted development to move from UX concept to shipping production logic.
                    </p>

                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Service Blueprint</h3>
                            <p className="text-sm text-slate-600 max-w-2xl">
                                Mapping the Zero-Subscription Ecosystem: Flow of user actions into frontstage UI, backstage serverless functions, and third-party integrations.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                            {/* Phase 1: Discovery */}
                            <div className="flex flex-col gap-4">
                                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center">
                                    <h4 className="font-bold text-slate-900 text-sm">1. Discovery</h4>
                                </div>

                                {/* Customer */}
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-blue-500 mb-1 lg:hidden">Customer Action</span>
                                    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-sm text-slate-700 h-full">
                                        Scans table QR code or opens direct URL.
                                    </div>
                                </div>
                                {/* Frontstage */}
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 lg:hidden">Frontstage UI</span>
                                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm text-slate-600 h-full">
                                        Next.js app serves static shell instantly.
                                    </div>
                                </div>
                                {/* Backstage */}
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 lg:hidden">Backstage Logic</span>
                                    <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl text-sm text-slate-700 h-full">
                                        Vercel Edge Network routes the request globally.
                                    </div>
                                </div>
                                {/* Process */}
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 lg:hidden">Support Process</span>
                                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs text-slate-500 h-full">
                                        DNS resolution & SSL handshake.
                                    </div>
                                </div>
                            </div>

                            {/* Phase 2: Selection */}
                            <div className="flex flex-col gap-4">
                                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center">
                                    <h4 className="font-bold text-slate-900 text-sm">2. Selection</h4>
                                </div>

                                {/* Customer */}
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-blue-500 mb-1 lg:hidden">Customer Action</span>
                                    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-sm text-slate-700 h-full">
                                        Browses digital menu and adds items to cart.
                                    </div>
                                </div>
                                {/* Frontstage */}
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 lg:hidden">Frontstage UI</span>
                                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm text-slate-600 h-full">
                                        Real-time cart updates and state management.
                                    </div>
                                </div>
                                {/* Backstage */}
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 lg:hidden">Backstage Logic</span>
                                    <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl text-sm text-slate-700 h-full">
                                        Local storage persists cart data cross-session.
                                    </div>
                                </div>
                                {/* Process */}
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 lg:hidden">Support Process</span>
                                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs text-slate-500 h-full">
                                        React Context API state triggers.
                                    </div>
                                </div>
                            </div>

                            {/* Phase 3: Checkout */}
                            <div className="flex flex-col gap-4">
                                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center">
                                    <h4 className="font-bold text-slate-900 text-sm">3. Checkout</h4>
                                </div>

                                {/* Customer */}
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-blue-500 mb-1 lg:hidden">Customer Action</span>
                                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm text-sm text-blue-900 font-bold h-full">
                                        Approves GPS location & clicks 'Place Order'.
                                    </div>
                                </div>
                                {/* Frontstage */}
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 lg:hidden">Frontstage UI</span>
                                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm text-slate-600 h-full">
                                        Calculates distance fees & validates minimums.
                                    </div>
                                </div>
                                {/* Backstage */}
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 lg:hidden">Backstage Logic</span>
                                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-sm text-white shadow-md h-full font-medium">
                                        Next.js API POST compiles JSON order payload.
                                    </div>
                                </div>
                                {/* Process */}
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 lg:hidden">Support Process</span>
                                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs text-slate-500 h-full font-medium">
                                        <i className="ph-bold ph-math-operations mr-1"></i>
                                        Haversine GPS Math Formula.
                                    </div>
                                </div>
                            </div>

                            {/* Phase 4: Fulfillment */}
                            <div className="flex flex-col gap-4">
                                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center">
                                    <h4 className="font-bold text-slate-900 text-sm">4. Fulfillment</h4>
                                </div>

                                {/* Customer */}
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-blue-500 mb-1 lg:hidden">Customer Action</span>
                                    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-sm text-slate-700 h-full">
                                        Redirects to WhatsApp & hits send.
                                    </div>
                                </div>
                                {/* Frontstage */}
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 lg:hidden">Frontstage UI</span>
                                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm text-slate-600 h-full">
                                        Success screen displays confirmation state.
                                    </div>
                                </div>
                                {/* Backstage */}
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 lg:hidden">Backstage Logic</span>
                                    <div className="bg-blue-600 border border-blue-500 p-4 rounded-xl text-sm text-white shadow-md h-full font-medium">
                                        <i className="ph-fill ph-telegram-logo mr-1"></i>
                                        Telegram BotFather pushes alert to Staff.
                                    </div>
                                </div>
                                {/* Process */}
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 lg:hidden">Support Process</span>
                                    <div className="bg-slate-50 text-slate-700 border border-slate-200 p-4 rounded-xl text-xs font-semibold h-full">
                                        <i className="ph-fill ph-whatsapp-logo mr-1 text-slate-400"></i>
                                        WhatsApp wa.me Protocol
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Labels Row (Hidden on Mobile) */}
                            <div className="absolute top-[3.5rem] -left-20 w-16 hidden xl:flex flex-col gap-4 text-right pt-[10px]">
                                <div className="h-[68px] flex items-center justify-end">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-blue-500 rotate-180" style={{ writingMode: 'vertical-rl' }}>Customer</span>
                                </div>
                                <div className="h-[68px] flex items-center justify-end">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 rotate-180" style={{ writingMode: 'vertical-rl' }}>Frontstage</span>
                                </div>
                                <div className="h-[68px] flex items-center justify-end">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 rotate-180" style={{ writingMode: 'vertical-rl' }}>Backstage</span>
                                </div>
                                <div className="h-[68px] flex items-center justify-end">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 rotate-180" style={{ writingMode: 'vertical-rl' }}>Process</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed italic border-l-4 border-blue-500 pl-4 py-2 mt-8">
                        "Building Hoychoy Cafe required bridging the gap between designing a beautiful interface and engineering a working, resilient product. It proves an ability to own the entire product life cycle—from empathetic user research in Golaghat down to shipping the final React component that processes a payment."
                    </p>
                </section>

            </article>

            {/* Footer */}
            <footer className="mt-24 py-12 border-t border-slate-200 bg-slate-50 relative z-10 fade-in-up">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                    <Link href="/" className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-medium transition-all shadow-lg hover:-translate-y-1 interactive-target mb-8">
                        Return to Portfolio
                    </Link>
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} Ayushman Bharadwaj. Crafting digital experiences.
                    </p>
                </div>
            </footer>

        </main>
    );
}
