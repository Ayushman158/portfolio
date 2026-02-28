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
                    <div className="relative w-48 h-48 sm:w-64 sm:h-64 shrink-0 rounded-full bg-[#3b469b] overflow-hidden shadow-xl border-4 border-white flex items-center justify-center">
                        <img
                            src="/assets/avatar.png"
                            alt="Ayushman Bharadwaj"
                            className="relative w-full h-full object-cover transition-transform duration-700 hover:scale-[1.05]"
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

                            {/* Tool Icons & Skills */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="px-4 py-2 border-2 border-slate-300 rounded-full text-xs font-semibold text-slate-600 bg-white">Figma</span>
                                <span className="px-4 py-2 border-2 border-slate-300 rounded-full text-xs font-semibold text-slate-600 bg-white">Antigravity</span>
                                <span className="px-4 py-2 border-2 border-slate-300 rounded-full text-xs font-semibold text-slate-600 bg-white">Illustrator</span>
                                <span className="px-4 py-2 border-2 border-slate-300 rounded-full text-xs font-semibold text-slate-600 bg-white">After Effects</span>
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


                    </div>
                </div>

            </div>
        </main>
    );
}
