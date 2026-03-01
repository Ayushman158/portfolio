import re

with open('app/case-study/page.js', 'r') as f:
    content = f.read()

# Isolate the parts to keep (imports, cursors, nav) and the parts to replace (header, article)
match = re.search(r'(<nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50.*?</nav>).*?{/\* Case Study Header \*/}', content, flags=re.DOTALL)

if not match:
    print("Could not find insertion boundary.")
    exit(1)

before_nav = content[:match.end(1)]

new_editorial_body = """

            {/* Editorial Hero Section */}
            <section className="pt-48 pb-16 px-6 fade-in-up bg-[#f8fafc] w-full min-h-[85vh] flex flex-col justify-center border-b border-slate-200">
                <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-8">
                            <span className="px-3 py-1 bg-blue-50 border border-blue-100 text-xs font-bold uppercase tracking-widest text-blue-600 rounded">UX Case Study</span>
                            <span className="px-3 py-1 bg-slate-200 border border-slate-300 text-xs font-bold uppercase tracking-widest text-slate-600 rounded">2024</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[1]">
                            Zero Friction<br/><span className="text-slate-400">Delivery.</span>
                        </h1>
                        <p className="text-2xl md:text-3xl text-slate-500 font-medium leading-tight max-w-2xl mb-12">
                            Designing an end-to-end hyperlocal Web App for Hoychoy Cafe that requires zero downloads and zero logins.
                        </p>
                        <Link href="https://www.hoychoycafe.com/" target="_blank" rel="noopener noreferrer" className="interactive-target group relative inline-flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-full text-lg font-bold hover:bg-blue-600 transition-colors">
                            View Live Project
                            <i className="ph ph-arrow-up-right text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                        </Link>
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
                            <div className="w-full max-w-[320px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-4 ring-slate-100 overflow-hidden border-[6px] border-slate-900 relative">
                                <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-b-xl z-20 flex justify-center">
                                    <div className="w-16 h-4 bg-black rounded-full mt-1"></div>
                                </div>
                                <div className="relative w-full aspect-[9/19.5] bg-slate-100">
                                    <img src="/assets/recording.webp" alt="Hoychoy App Ordering Flow Demo" className="absolute inset-0 w-full h-full object-cover" />
                                </div>
                                <div className="absolute bottom-2 inset-x-0 flex justify-center z-50 pointer-events-none">
                                    <div className="w-1/3 h-1 bg-black/20 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Final Act: The Tech Backbone */}
            <section className="bg-slate-900 py-32 px-6 w-full text-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-16">⚙️ The Zero-Subscription Backbone</h2>
                    
                    <div className="bg-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center items-center">
                            <div className="bg-slate-900 py-6 px-4 rounded-2xl border border-slate-700">
                                <i className="ph-fill ph-user text-4xl text-blue-400 mb-3"></i>
                                <p className="font-bold">Next.js Web App</p>
                                <p className="text-xs text-slate-400 mt-1">Frontend Interface</p>
                            </div>
                            
                            <i className="ph-bold ph-arrow-right text-slate-500 text-3xl hidden md:block"></i>
                            
                            <div className="bg-slate-900 py-6 px-4 rounded-2xl border border-slate-700">
                                <i className="ph-fill ph-robot text-4xl text-purple-400 mb-3"></i>
                                <p className="font-bold">Telegram Bot API</p>
                                <p className="text-xs text-slate-400 mt-1">Order Processing</p>
                            </div>

                            <i className="ph-bold ph-arrow-right text-slate-500 text-3xl hidden md:block"></i>

                            <div className="bg-slate-900 py-6 px-4 rounded-2xl border border-slate-700">
                                <i className="ph-fill ph-whatsapp-logo text-4xl text-green-400 mb-3"></i>
                                <p className="font-bold">WhatsApp Business</p>
                                <p className="text-xs text-slate-400 mt-1">Merchant Dashboard</p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-center mt-12 text-lg max-w-3xl mx-auto">
                            By chaining together free-tier APIs, we entirely sidestepped the need for continuous AWS/database hosting costs, providing the client with an infinitely scalable architecture for $0/month in server fees.
                        </p>
                    </div>
                </div>
            </section>

        </main>
    );
}
"""

final = before_nav + new_editorial_body

with open('app/case-study/page.js', 'w') as f:
    f.write(final)

print("Generated immersive editorial layout.")
