import re

with open('app/page.js', 'r') as f:
    content = f.read()

# 1. Remove gridRef and cursor glow effects from useEffect
content = re.sub(r'  // Bento Grid Ref.*?const gridRef = useRef\(null\);\n', '', content, flags=re.DOTALL)
content = re.sub(r'    // 6\. Mouse Tracking Glow.*?window\.addEventListener\(\'mousemove\', handleMouseMoveGlow\);\n', '', content, flags=re.DOTALL)
content = re.sub(r'      window\.removeEventListener\(\'mousemove\', handleMouseMoveGlow\);\n', '', content)

# 2. Replace the entire #work and Weekend Builds section
start_marker = "      {/* Selected Works Section */}"
end_marker = "      {/* Footer */}"

new_works_section = """      {/* Minimal Selected Works List */}
      <section id="work" className="py-24 md:py-32 px-6 bg-white border-t border-slate-100 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 card-reveal">
            <h2 className="text-sm font-mono tracking-[0.2em] text-slate-400 uppercase mb-4">Selected Works</h2>
            <p className="text-xl md:text-2xl text-slate-800 tracking-tight leading-[1.4] max-w-2xl font-medium">
              End-to-end engineered products demonstrating design thinking and technical execution.
            </p>
          </div>

          <div className="flex flex-col border-t border-slate-200">
            {/* Project Row 1 */}
            <Link href="/case-study" className="group flex flex-col md:flex-row md:items-center justify-between py-8 md:py-10 border-b border-slate-200 interactive-target">
              <div className="flex-1 mb-4 md:mb-0 pr-4">
                <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors mb-2 flex items-center gap-3">
                  Hoychoy Cafe
                  <i className="ph ph-arrow-up-right text-2xl md:text-3xl opacity-0 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300"></i>
                </h3>
                <p className="text-slate-500 text-lg md:text-xl leading-relaxed">End-to-end hyperlocal delivery web application.</p>
              </div>
              <div className="flex items-center gap-3 md:w-64 md:justify-end shrink-0">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">UX Design</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">2024</span>
              </div>
            </Link>
          </div>
          
          {/* AI Experiments CTA */}
          <div className="mt-24 text-center">
            <Link href="/experiments" className="group inline-flex items-center gap-3 text-sm md:text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors interactive-target px-8 py-4 rounded-full border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50">
              Explore AI Experiments
              <i className="ph ph-arrow-right transition-transform group-hover:translate-x-1"></i>
            </Link>
          </div>
        </div>
      </section>

"""

if start_marker in content and end_marker in content:
    before = content.split(start_marker)[0]
    after = end_marker + content.split(end_marker)[1]
    new_content = before + new_works_section + after
    
    with open('app/page.js', 'w') as f:
        f.write(new_content)
    print("Successfully replaced Selected Works and Weekend Builds.")
else:
    print("Markers not found.")
    
