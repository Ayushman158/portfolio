import sys

with open('app/case-study/page.js', 'r') as f:
    content = f.read()

# 1. Role & Ownership
role_insertion = """                            Transforming conversational, manual WhatsApp ordering into a structured, low-friction system.
                        </p>
                        <p className="text-lg md:text-xl text-slate-600 font-medium mb-12 max-w-2xl border-l-4 border-blue-500 pl-4 py-1">
                            <strong>My Role & Ownership:</strong> I led research synthesis, workflow mapping, service blueprint creation, UX architecture, client communication, and pilot validation.
                        </p>"""
content = content.replace("""                            Transforming conversational, manual WhatsApp ordering into a structured, low-friction system.
                        </p>""", role_insertion)

# 2. Problem Framing
problem_framing = """                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">"""
problem_framing_insertion = """                    {/* Problem Framing */}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">"""
content = content.replace(problem_framing, problem_framing_insertion)

# 3. Old System Architecture -> FigJam Style
old_system = """                            {/* "Before System" Flow Diagram */}
                            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mt-8">
                                <span className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-6 mb-4">Old System Architecture (Bottlenecked)</span>
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
                                    <div className="bg-slate-700 px-4 py-3 rounded-lg w-full sm:w-auto text-sm font-medium"><i className="ph-fill ph-user mb-1 block text-blue-400 text-xl"></i> Customer</div>
                                    <i className="ph-bold ph-arrow-right text-slate-500 hidden sm:block"></i>
                                    <i className="ph-bold ph-arrow-down text-slate-500 sm:hidden"></i>

                                    <div className="bg-slate-700 px-4 py-3 rounded-lg w-full sm:w-auto text-sm font-medium border-b-2 border-slate-500"><i className="ph-fill ph-whatsapp-logo mb-1 block text-green-400 text-xl"></i> Chat</div>
                                    <i className="ph-bold ph-arrow-right text-slate-500 hidden sm:block"></i>
                                    <i className="ph-bold ph-arrow-down text-slate-500 sm:hidden"></i>

                                    <div className="bg-red-900/50 px-4 py-3 rounded-lg w-full sm:w-auto text-sm font-bold border border-red-500/50 text-red-100 flex-1 relative">
                                        <i className="ph-fill ph-warning mb-1 block text-red-400 text-xl mx-auto"></i> Owner (Bottleneck)
                                    </div>
                                    <i className="ph-bold ph-arrow-right text-slate-500 hidden sm:block"></i>
                                    <i className="ph-bold ph-arrow-down text-slate-500 sm:hidden"></i>

                                    <div className="bg-slate-700 px-4 py-3 rounded-lg w-full sm:w-auto text-sm font-medium"><i className="ph-fill ph-cooking-pot mb-1 block text-orange-400 text-xl"></i> Kitchen</div>
                                </div>
                            </div>"""
old_system_figjam = """                            {/* "Before System" Flow Diagram (FigJam Style) */}
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
                            </div>"""
content = content.replace(old_system, old_system_figjam)

# 4. Real User Quotes
insight_section = """            {/* Act 2: Key Insight */}
            <section className="bg-white py-32 px-6 w-full border-b border-slate-100">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 font-serif italic text-blue-600">The Critical Insight</h2>
                    <p className="text-3xl md:text-5xl font-bold text-slate-400 leading-tight max-w-4xl mx-auto mt-8">
                        The problem wasn't WhatsApp itself. <br /><span className="text-slate-900">The problem was the absence of a structured system.</span>
                    </p>
                </div>
            </section>"""
insight_section_with_quotes = """            {/* Act 2: Key Insight & Real User Signals */}
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
            </section>"""
content = content.replace(insight_section, insight_section_with_quotes)

# 5. Service Blueprints -> FigJam Style
# Let's replace the whole Act 3 section background from slate-900 to something soft.
bp_old = """            {/* Act 3: Service Blueprint */}
            <section className="bg-slate-900 py-32 px-6 w-full text-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">3. Uncovering Friction</h2>
                    <p className="text-xl md:text-2xl text-slate-400 mb-16 max-w-3xl leading-relaxed">
                        To uncover hidden friction, I mapped the entire service flow. The single point of failure became immediately obvious: <strong>the owner</strong>.
                    </p>
                    
                    {/* Before Blueprint */}
                    <div className="bg-slate-800 rounded-3xl p-8 md:p-12 border border-red-900/50 overflow-x-auto mb-16 relative">
                        <div className="absolute top-0 right-0 bg-red-500/10 text-red-400 px-4 py-2 rounded-bl-2xl rounded-tr-3xl font-bold text-sm uppercase tracking-widest border-b border-l border-red-500/20">Before Redesign</div>
                        <div className="min-w-[800px] grid grid-cols-4 gap-4 text-sm mt-4">
                            <div className="font-bold text-slate-400 border-b border-slate-700 pb-2">Layer</div>
                            <div className="font-bold text-slate-400 border-b border-slate-700 pb-2">Menu Discovery</div>
                            <div className="font-bold text-slate-400 border-b border-slate-700 pb-2">Ordering & Payment</div>
                            <div className="font-bold text-slate-400 border-b border-slate-700 pb-2">Coordination</div>

                            <div className="py-4 font-bold text-blue-400 flex items-center gap-2">Customer Actions</div>
                            <div className="py-2 bg-slate-900 rounded p-4 border border-slate-700">Views PDF menu</div>
                            <div className="py-2 bg-slate-900 rounded p-4 border border-slate-700">Sends chat order & UPI screenshot</div>
                            <div className="py-2 bg-slate-900 rounded p-4 border border-slate-700">Manually types address</div>

                            <div className="py-4 font-bold text-indigo-400 flex items-center gap-2">Frontstage</div>
                            <div className="py-2 bg-slate-900 rounded p-4 border border-slate-700 col-span-3 text-center text-slate-500 italic">WhatsApp Chat Interface</div>

                            <div className="py-4 font-bold text-red-400 flex items-center gap-2">Backstage (Owner)</div>
                            <div className="py-2 bg-red-900/20 rounded p-4 border border-red-900/50 col-span-2 text-red-200">Reads, clarifies missing details, verifies payment screenshots</div>
                            <div className="py-2 bg-red-900/20 rounded p-4 border border-red-900/50 text-red-200">Manually relays to kitchen</div>

                            <div className="py-4 font-bold text-green-400 flex items-center gap-2">Support Systems</div>
                            <div className="py-2 bg-slate-900 rounded p-4 border border-slate-700">PDF File</div>
                            <div className="py-2 bg-slate-900 rounded p-4 border border-slate-700">UPI App / Phone Gallery</div>
                            <div className="py-2 bg-slate-900 rounded p-4 border border-slate-700">Verbal Instructions</div>
                        </div>
                    </div>

                    {/* After Blueprint */}
                    <div className="bg-slate-800 rounded-3xl p-8 md:p-12 border border-green-900/50 overflow-x-auto relative">
                        <div className="absolute top-0 right-0 bg-green-500/10 text-green-400 px-4 py-2 rounded-bl-2xl rounded-tr-3xl font-bold text-sm uppercase tracking-widest border-b border-l border-green-500/20">After Redesign</div>
                        <div className="min-w-[800px] grid grid-cols-4 gap-4 text-sm mt-4">
                            <div className="font-bold text-slate-400 border-b border-slate-700 pb-2">Layer</div>
                            <div className="font-bold text-slate-400 border-b border-slate-700 pb-2">Menu Discovery</div>
                            <div className="font-bold text-slate-400 border-b border-slate-700 pb-2">Checkout</div>
                            <div className="font-bold text-slate-400 border-b border-slate-700 pb-2">Fulfillment</div>

                            <div className="py-4 font-bold text-blue-400 flex items-center gap-2">Customer Actions</div>
                            <div className="py-2 bg-slate-900 rounded p-4 border border-slate-700">Scans QR / Clicks Link & Browses menu</div>
                            <div className="py-2 bg-slate-900 rounded p-4 border border-slate-700">Adds to cart & Checkout via UPI</div>
                            <div className="py-2 bg-slate-900 rounded p-4 border border-slate-700">Receives order status via WhatsApp</div>

                            <div className="py-4 font-bold text-indigo-400 flex items-center gap-2">Frontstage</div>
                            <div className="py-2 bg-[#0ea5e9]/10 rounded p-4 border border-blue-900/30 col-span-2 text-blue-200">Mobile web ordering & Auto-formatted summary</div>
                            <div className="py-2 bg-slate-900 rounded p-4 border border-slate-700 text-slate-500">WhatsApp (Optional)</div>

                            <div className="py-4 font-bold text-purple-400 flex items-center gap-2">Backstage</div>
                            <div className="py-2 bg-slate-900 rounded p-4 border border-slate-700 text-slate-500 italic text-center">Fully Automated</div>
                            <div className="py-2 bg-green-900/20 rounded p-4 border border-green-900/50 text-green-200">Order securely stored in Dashboard</div>
                            <div className="py-2 bg-green-900/20 rounded p-4 border border-green-900/50 text-green-200">Telegram alert & Structured Kitchen Display</div>

                            <div className="py-4 font-bold text-green-400 flex items-center gap-2">Support Systems</div>
                            <div className="py-2 bg-slate-900 rounded p-4 border border-slate-700">Web App Database</div>
                            <div className="py-2 bg-slate-900 rounded p-4 border border-slate-700 flex gap-2"><span className="bg-[#5f259f] text-white px-2 rounded font-bold uppercase text-[10px] flex items-center">PhonePe</span> Payment Gateway</div>
                            <div className="py-2 bg-slate-900 rounded p-4 border border-slate-700 flex gap-2"><span className="bg-[#229ED9] text-white px-2 rounded font-bold uppercase text-[10px] flex items-center">Telegram</span> Bot API</div>
                        </div>
                    </div>
                </div>
            </section>"""
bp_new = """            {/* Act 3: Service Blueprint (FigJam Style) */}
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
            </section>"""
content = content.replace(bp_old, bp_new)

# 6. Model Shift Strategy
model_old = """                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-red-400"></div>
                                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-6">Old Model</h3>
                                <div className="flex flex-col gap-4 text-slate-700 font-medium">
                                    <div className="flex items-center gap-4">
                                        <span className="bg-slate-100 px-4 py-2 rounded-lg">WhatsApp</span>
                                        <i className="ph-bold ph-arrow-right text-slate-400 hidden sm:block"></i>
                                        <i className="ph-bold ph-arrow-down text-slate-400 sm:hidden"></i>
                                        <span className="bg-red-50 text-red-600 px-4 py-2 rounded-lg border border-red-100 flex-1 text-center">Manual Processing</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-green-400"></div>
                                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-6">New Model</h3>
                                <div className="flex flex-col gap-3 text-slate-700 font-medium text-sm">
                                    <div className="flex items-center gap-3 w-full">
                                        <span className="bg-slate-100 px-3 py-2 rounded-lg text-center flex-1">QR / Link</span>
                                        <i className="ph-bold ph-arrow-right text-slate-400"></i>
                                        <span className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg border border-blue-100 text-center flex-[2]">Structured Web Order</span>
                                        <i className="ph-bold ph-arrow-right text-slate-400"></i>
                                        <span className="bg-slate-100 px-3 py-2 rounded-lg text-center flex-1 text-xs">WhatsApp <br/>(optional)</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-3 w-full mt-2 pt-4 border-t border-slate-100">
                                        <span className="bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-100 text-center flex-[1.5]">Dashboard</span>
                                        <i className="ph-bold ph-arrow-right text-slate-400"></i>
                                        <span className="bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg border border-indigo-100 text-center flex-[2]">Telegram Alert</span>
                                        <i className="ph-bold ph-arrow-right text-slate-400"></i>
                                        <span className="bg-orange-50 text-orange-600 px-3 py-2 rounded-lg border border-orange-100 text-center flex-1">Kitchen</span>
                                    </div>
                                </div>
                            </div>
                        </div>"""
model_new = """                        <div className="grid grid-cols-1 gap-8 max-w-4xl bg-[#fcfbf9] rounded-3xl border border-[#e5e5e5] p-8 md:p-12 shadow-sm">
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
                        </div>"""
content = content.replace(model_old, model_new)

# 7. Iteration Example
iteration_insertion = """                            <div>
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
                                        <strong>Before:</strong> The initial checkout draft forced users to manually type long delivery instructions and address formats. <br/><br/><strong>After:</strong> We swapped the manual text area for one-tap structured toggles (e.g., "Same as last time") and hardcoded direct UPI deep links. <br/><br/><strong>Why:</strong> This structural change eliminated keyboard interaction, dropping checkout abandonment by converting a typing task into a tapping task.
                                    </p>
                                </div>
                            </div>"""

content = content.replace('                                <p className="mt-8 text-xl font-bold text-blue-600 italic">"This was not a UI redesign. It was a systems redesign."</p>\n                            </div>', '                                <p className="mt-8 text-xl font-bold text-blue-600 italic">"This was not a UI redesign. It was a systems redesign."</p>\n                            </div>\n' + iteration_insertion)

# 8. Impact Metrics Update
impact_old = """                                    <tr>
                                        <td className="p-4 md:p-6">Avg handling time</td>
                                        <td className="p-4 md:p-6 border-l border-slate-100 text-red-500">6–8 min</td>
                                        <td className="p-4 md:p-6 border-l border-slate-100 text-green-600 font-bold">2–3 min</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 md:p-6">Missing details</td>
                                        <td className="p-4 md:p-6 border-l border-slate-100 text-red-500">Frequent</td>
                                        <td className="p-4 md:p-6 border-l border-slate-100 text-green-600 font-bold">Rare</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 md:p-6">Payment mismatch</td>
                                        <td className="p-4 md:p-6 border-l border-slate-100 text-red-500">Common</td>
                                        <td className="p-4 md:p-6 border-l border-slate-100 text-green-600 font-bold">Minimal</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 md:p-6">Owner relay dependency</td>
                                        <td className="p-4 md:p-6 border-l border-slate-100 text-red-500">High</td>
                                        <td className="p-4 md:p-6 border-l border-slate-100 text-green-600 font-bold">Reduced</td>
                                    </tr>"""
impact_new = """                                    <tr>
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
                                    </tr>"""
content = content.replace(impact_old, impact_new)

with open('app/case-study/page.js', 'w') as f:
    f.write(content)
