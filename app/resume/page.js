import Link from 'next/link';

export default function Resume() {
    return (
        <main className="min-h-screen bg-white text-slate-800 font-sans md:py-24 py-16 px-6 sm:px-12 selection:bg-[#3b469b]/20">

            {/* Top Navigation Wrapper for consistency (optional if you want it to feel like part of the site, but this page is standalone per the design) */}
            <div className="max-w-4xl mx-auto md:mb-12 mb-8 fade-in-up">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#3b469b] transition-colors">
                    <i className="ph ph-arrow-left"></i> Back to Portfolio
                </Link>
            </div>

            <div className="max-w-4xl mx-auto flex flex-col gap-16">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 stagger-fade">

                    {/* Circular Image Container */}
                    <div className="relative w-48 h-48 sm:w-64 sm:h-64 shrink-0 rounded-full bg-[#3b469b] overflow-hidden shadow-xl border-4 border-white flex items-end justify-center">
                        {/* Note: The user's image is a cutout on a blue circle. We are using the existing hero image heavily masked/rounded into the circle to approximate it. */}
                        <div className="absolute inset-0 bg-[#3b469b]"></div>
                        <img
                            src="/assets/hero.png"
                            alt="Ayushman Bharadwaj"
                            className="relative w-[110%] h-auto -bottom-4 mix-blend-luminosity opacity-90 transition-transform duration-700 hover:opacity-100 hover:scale-[1.05]"
                        />
                    </div>

                    {/* Intro Content */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left pt-2 md:pt-4">
                        <span className="text-lg md:text-xl font-medium text-slate-500 mb-1">UX/UI designer</span>
                        <h1 className="text-4xl md:text-6xl font-black text-[#3b469b] leading-[1.1] mb-6 tracking-tight">
                            Ayushman<br />Bharadwaj
                        </h1>
                        <p className="text-base md:text-lg text-slate-600 max-w-md leading-relaxed">
                            I'm a UX-focused design engineer who turns complex problems into clear, build-ready systems.<br />
                            From personas to product requirements, I align design, tech, and business around what matters most — the user.
                        </p>
                    </div>
                </header>

                {/* Contact Strip */}
                <div className="w-full text-center md:text-left text-xs sm:text-sm font-medium text-slate-500 pb-8 border-b border-slate-200 stagger-fade">
                    <span>+91-7002400184</span>
                    <span className="mx-2 md:mx-4">•</span>
                    <a href="mailto:ayushman15899@gmail.com" className="hover:text-[#3b469b] hover:underline underline-offset-4 transition-colors">ayushman15899@gmail.com</a>
                    <span className="mx-2 md:mx-4">•</span>
                    <a href="https://linkedin.com/in/ayushman-bharadwaj-660759289" target="_blank" rel="noopener noreferrer" className="hover:text-[#3b469b] hover:underline underline-offset-4 transition-colors break-all">linkedin.com/in/ayushman-bharadwaj-660759289</a>
                </div>

                {/* Two Column Layout (Experience + Skills VS Education + QR) */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-16 fade-in-up">

                    {/* LEFT COLUMN */}
                    <div className="flex flex-col gap-12">

                        {/* Work Experience */}
                        <section>
                            <h2 className="text-2xl font-bold text-[#3b469b] mb-8">Work Experience</h2>

                            <div className="flex flex-col gap-8">
                                {/* Role 1 */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Dopamine Ventures - Manager, Product & Websites</h3>
                                    <p className="text-sm font-semibold text-slate-600 mb-4">June 2024 → July 2025</p>
                                    <ul className="text-base text-slate-700 leading-relaxed space-y-3 pl-4 list-disc marker:text-slate-300">
                                        <li>Led UX and system design for early-stage products, focusing on clarity in flows, interactions, and scalable architecture</li>
                                        <li>Designed complex scheduling systems handling availability logic, conflicts, manual overrides, and edge cases</li>
                                        <li>Conducted user research and developed personas to guide experience and feature strategy</li>
                                        <li>Defined end-to-end journeys across onboarding, scheduling, and client engagement ecosystems</li>
                                        <li>Translated UX decisions into structured PRDs and aligned design, engineering, and business for build-ready execution</li>
                                    </ul>
                                </div>

                                {/* Role 2 */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Ernst & Young - Cybersecurity Analyst</h3>
                                    <p className="text-sm font-semibold text-slate-600 mb-4">July 2022 → Aug 2023</p>
                                    <ul className="text-base text-slate-700 leading-relaxed space-y-3 pl-4 list-disc marker:text-slate-300">
                                        <li>Performed SAST/DAST and VAPT on web and mobile applications, identifying critical usability-impacting security risks.</li>
                                        <li>Conducted API and web application testing, strengthening understanding of system behavior, edge cases, and failure states.</li>
                                        <li>Reviewed firewall and OS configurations, reinforcing a mindset of defensive design and risk-aware systems thinking.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Skills */}
                        <section className="mt-4">
                            <h2 className="text-2xl font-bold text-[#3b469b] mb-6">Skills</h2>

                            {/* Tool Icons */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shadow-sm">
                                    <svg width="24" height="24" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 28.5C19 33.7467 14.7467 38 9.5 38C4.25329 38 0 33.7467 0 28.5C0 23.2533 4.25329 19 9.5 19C14.7467 19 19 23.2533 19 28.5Z" fill="#0ACF83" /><path d="M0 28.5C0 23.2533 4.25329 19 9.5 19L19 19V38L9.5 38C4.25329 38 0 33.7467 0 28.5Z" fill="#A259FF" /><path d="M0 9.5C0 4.25329 4.25329 0 9.5 0L19 0V19L9.5 19C4.25329 19 0 14.7467 0 9.5Z" fill="#F24E1E" /><path d="M19 0L28.5 0C33.7467 0 38 4.25329 38 9.5C38 14.7467 33.7467 19 28.5 19L19 19V0Z" fill="#FF7262" /><path d="M38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5Z" fill="#1ABCFE" /></svg>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shadow-sm">
                                    {/* Webflow Approximation */}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M24 6v12h-3v-7.39l-4 7.39h-3l-4-7.39V18H7v-7.39l-4 7.39H0V6h3v7.39l4-7.39h3l4 7.39V6h3l4 7.39 3-7.39h3z" /></svg>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-[#330000] border-2 border-[#ff7c00] flex items-center justify-center shadow-sm text-[#ff7c00] font-bold text-xl">
                                    Ai
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-[#000033] border-2 border-[#ff7cff] flex items-center justify-center shadow-sm text-[#ff7cff] font-bold text-xl">
                                    Ae
                                </div>
                            </div>

                            {/* Text Pills */}
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 border-2 border-slate-300 rounded-full text-xs font-semibold text-slate-600 bg-white">UX Research</span>
                                <span className="px-4 py-2 border-2 border-slate-300 rounded-full text-xs font-semibold text-slate-600 bg-white">Usability Design</span>
                                <span className="px-4 py-2 border-2 border-slate-300 rounded-full text-xs font-semibold text-slate-600 bg-white">Design Thinking</span>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col gap-16 md:border-l border-slate-100 md:pl-10">

                        {/* Education */}
                        <section>
                            <h2 className="text-2xl font-bold text-[#3b469b] mb-8">Education</h2>

                            <div className="flex flex-col gap-6">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 mb-1">UPES, Dehradun</h3>
                                    <p className="text-sm font-semibold text-slate-600 mb-1">June 2024 → July 2025</p>
                                    <p className="text-sm text-slate-700">M.des — Interaction Design</p>
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-slate-900 mb-1">SMIT, Sikkim</h3>
                                    <p className="text-sm font-semibold text-slate-600 mb-1">June 2022</p>
                                    <p className="text-sm text-slate-700">B.Tech — Computer Science<br />Engineering</p>
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-slate-900 mb-1">Sai RNS Academy</h3>
                                    <p className="text-sm font-semibold text-slate-600 mb-1">June 2018</p>
                                    <p className="text-sm text-slate-700">Class XII, Higher Secondary, PCM</p>
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-slate-900 mb-1">Sangam Academy</h3>
                                    <p className="text-sm font-semibold text-slate-600 mb-1">June 2018</p>
                                    <p className="text-sm text-slate-700">Class X, SSC</p>
                                </div>
                            </div>
                        </section>

                        {/* QR Section */}
                        <section className="flex flex-col items-center justify-center mt-auto md:pb-12 h-64 relative group">
                            <div className="flex flex-col -ml-4 items-center gap-1 -rotate-6 mb-4 translate-x-4">
                                <span className="font-display font-medium text-lg tracking-tight text-slate-800">Curious how it all comes together?</span>
                                <span className="font-display font-medium text-lg tracking-tight text-slate-800">Scan to explore the work.</span>
                            </div>

                            {/* Hand-drawn arrow approximation */}
                            <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-4 top-12 opacity-80 z-20 overflow-visible text-[#3b469b]">
                                <path d="M5 5 C 40 10, 50 30, 20 40 C 0 50, 60 60, 40 70 L 30 65 M 40 70 L 45 60" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="group-hover:stroke-blue-500 transition-colors duration-500"></path>
                            </svg>

                            <div className="w-32 h-32 aspect-square relative flex-shrink-0 mt-2 z-10 transition-transform duration-500 group-hover:scale-110">
                                {/* QR Code Placeholder styling */}
                                <div className="w-full h-full border-4 border-[#3b469b] rounded-xl flex flex-wrap p-1">
                                    {/* Generative blocks to look like a QR */}
                                    {Array.from({ length: 49 }).map((_, i) => (
                                        <div key={i} className={`w-[14.28%] h-[14.28%] ${Math.random() > 0.4 ? 'bg-[#3b469b]' : 'bg-transparent'} ${i === 0 || i === 6 || i === 42 ? 'border-2 border-white' : ''}`}></div>
                                    ))}
                                    {/* Large markers */}
                                    <div className="absolute top-2 left-2 w-6 h-6 border-4 border-[#3b469b] bg-white rounded-sm flex items-center justify-center"><div className="w-2 h-2 bg-[#3b469b]"></div></div>
                                    <div className="absolute top-2 right-2 w-6 h-6 border-4 border-[#3b469b] bg-white rounded-sm flex items-center justify-center"><div className="w-2 h-2 bg-[#3b469b]"></div></div>
                                    <div className="absolute bottom-2 left-2 w-6 h-6 border-4 border-[#3b469b] bg-white rounded-sm flex items-center justify-center"><div className="w-2 h-2 bg-[#3b469b]"></div></div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>

            </div>
        </main>
    );
}
