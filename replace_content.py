import re

with open('app/case-study/page.js', 'r') as f:
    text = f.read()

# We want to replace from {/* Act 3: Narrative Feature Breakdown */} to </section>\n\n        </main>

target_start = r"\{\/\* Act 3: Narrative Feature Breakdown \*\/\}"
target_end = r"\{\/\* Final Act: The Tech Backbone \*\/\}.*?<\/section>"

# Wait, let's just find the exact chunks.
# First, split lines to be safer.
with open('app/case-study/page.js', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "{/* Act 3: Narrative Feature Breakdown */}" in line:
        skip = True
        
        # Insert new content here
        new_content = """            {/* Act 3: Service Blueprint */}
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
            </section>

            {/* Act 4: Strategy, Solution & Impact */}
            <section className="bg-[#f8fafc] py-32 px-6 w-full border-t border-slate-200">
                <div className="max-w-6xl mx-auto space-y-32">
                    
                    {/* Design Strategy */}
                    <div>
                        <div className="w-16 h-1 bg-blue-500 mb-8"></div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-8">4. Design Strategy (Model Shift)</h2>
                        <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl mb-12">
                            Instead of completely replacing WhatsApp, we repositioned it. We preserved user familiarity while introducing operational clarity for the owner.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        </div>
                    </div>

                    {/* Solution & UX Decisions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                        <div className="space-y-16">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-8">5. The Solution</h2>
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
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">6. UX Decisions</h2>
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
                        </div>

                        {/* Media Display */}
                        <div className="bg-slate-200 rounded-[2.5rem] p-4 md:p-8 shadow-inner overflow-hidden flex justify-center sticky top-32">
                            <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-slate-300 relative group bg-white">
                                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full z-10 shadow-lg">Mobile UI Screens</div>
                                <img src="/assets/recording.webp" alt="Menu, Cart, Checkout, Order Confirmation" className="w-full h-auto object-cover" />
                            </div>
                        </div>
                    </div>

                    {/* Impact */}
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-8 text-center">7. Impact <span className="text-slate-400 font-light text-2xl md:text-3xl block mt-2">(2-Week Pilot)</span></h2>
                        
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
            </section>\n"""
        new_lines.append(new_content)
        
    if skip and "</main>" in line:
        skip = False
        
    if not skip:
        new_lines.append(line)

with open('app/case-study/page.js', 'w') as f:
    f.writelines(new_lines)
