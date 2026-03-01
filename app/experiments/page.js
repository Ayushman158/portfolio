'use client';
import Link from 'next/link';

export default function Experiments() {
    return (
        <main className="min-h-screen bg-white text-slate-800 font-sans md:py-24 py-16 px-6 sm:px-12 selection:bg-blue-200">
            {/* Top Navigation Wrapper */}
            <div className="max-w-4xl mx-auto md:mb-16 mb-12 fade-in-up flex items-center justify-between">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
                    <i className="ph ph-arrow-left"></i> Back
                </Link>
            </div>

            <div className="max-w-4xl mx-auto flex flex-col gap-16">

                {/* Header Section */}
                <header className="fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
                        AI Experiments.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl font-medium">
                        Rapid prototypes, LLM integrations, and experimental front-end engineering built on the weekends.
                    </p>
                </header>

                <div className="flex flex-col border-t border-slate-200 fade-in-up" style={{ animationDelay: '0.2s' }}>

                    {/* Experiment 1: AI Sales Rep */}
                    <div className="group flex flex-col md:flex-row md:items-start justify-between py-8 md:py-10 border-b border-slate-200 interactive-target hover:-translate-y-1 transition-transform">
                        <div className="flex-1 mb-6 md:mb-0 pr-4">
                            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mb-3 flex items-center gap-3">
                                Conversational AI Sales Rep
                            </h3>
                            <p className="text-slate-500 text-lg leading-relaxed max-w-lg mb-4">A fully autonomous voice agent built with modern LLM APIs to handle complex, multi-turn sales discoveries over the phone.</p>

                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">Next.js</span>
                                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">OpenAI Realtime</span>
                                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">Twilio WebRTC</span>
                            </div>
                        </div>
                        <div className="flex md:flex-col items-center md:items-end gap-4 shrink-0 mt-4 md:mt-0 relative z-10 block">
                            <Link href="https://github.com/Ayushman158/ai-sales-agent" target="_blank" className="text-slate-500 hover:text-blue-600 transition-colors px-4 py-2 border border-slate-200 hover:border-blue-200 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 bg-white">
                                <i className="ph-fill ph-github-logo text-base"></i> View Code
                            </Link>
                        </div>
                    </div>

                    {/* Experiment 2: FieldNote */}
                    <div className="group flex flex-col md:flex-row md:items-start justify-between py-8 md:py-10 border-b border-slate-200 interactive-target hover:-translate-y-1 transition-transform">
                        <div className="flex-1 mb-6 md:mb-0 pr-4">
                            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mb-3 flex items-center gap-3">
                                FieldNote
                            </h3>
                            <p className="text-slate-500 text-lg leading-relaxed max-w-lg mb-4">An AI-powered UX research assistant that automatically transcribes user interviews and synthesizes actionable insights using Gemini 1.5 Pro.</p>

                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">React</span>
                                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">Web Speech API</span>
                                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">Gemini Pro API</span>
                            </div>
                        </div>
                        <div className="flex md:flex-col items-center md:items-end gap-4 shrink-0 mt-4 md:mt-0 relative z-10 block">
                            <Link href="https://github.com/Ayushman158/User-Research-Summarizer" target="_blank" className="text-slate-500 hover:text-blue-600 transition-colors px-4 py-2 border border-slate-200 hover:border-blue-200 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 bg-white">
                                <i className="ph-fill ph-github-logo text-base"></i> View Code
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
