import React from 'react';

export const ExamplesSection: React.FC = () => {
  const examples = [
    {
      title: 'Web Development Request',
      role: '🌐 Web Development',
      before: 'make website for gym',
      after: `🎯 ROLE: Lead Frontend Systems Architect\n📍 OBJECTIVE: Build a responsive, high-converting gym landing page.\n⚡ EXECUTION RULES:\n- Modern UI layout with sleek typography & smooth micro-animations.\n- Fully responsive adaptation across mobile, tablet, and desktop.\n- Include services, class schedule & user-friendly booking form.\n📄 OUTPUT FORMAT: Production-ready Next.js & Tailwind component code.`,
    },
    {
      title: 'Learning & Tutoring Request',
      role: '🎓 Educational Tutor',
      before: 'teach me java basics',
      after: `🎯 ROLE: Senior Academic Educator & Pedagogical Expert\n📍 OBJECTIVE: Teach Java from core fundamentals to advanced OOP mastery.\n⚡ EXECUTION RULES:\n- Break down complex terms into simple step-by-step building blocks.\n- Anchor key takeaways with practical real-world analogies.\n- Include 3 self-assessment verification questions with answer keys.\n📄 OUTPUT FORMAT: Comprehensive educational guide with code examples.`,
    },
    {
      title: 'Code Debugging Request',
      role: '💻 Software Developer',
      before: 'fix my code error',
      after: `🎯 ROLE: Principal Software Architect & Debugging Expert\n📍 OBJECTIVE: Analyze, refactor, and fix code runtime failures.\n⚡ EXECUTION RULES:\n- Identify root cause error & explain performance impact clearly.\n- Provide production-ready, type-safe code with zero placeholders.\n- Include edge-case validation and unit test verification steps.\n📄 OUTPUT FORMAT: Executable corrected code block with technical breakdown.`,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Demonstration</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white transition-colors">Before & After Examples</h2>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto transition-colors">
          See how basic natural language inputs become structured, role-driven Pro prompts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {examples.map((ex, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 shadow-md dark:shadow-2xl transition-all"
          >
            <div className="space-y-3">
              {/* FIXED HEIGHT HEADER (h-12) FOR PERFECT ROW ALIGNMENT */}
              <div className="h-12 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 gap-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider truncate">
                  {ex.title}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex-shrink-0">
                  {ex.role}
                </span>
              </div>

              {/* BEFORE SECTION WITH FIXED HEIGHT (h-14) FOR PERFECT ROW ALIGNMENT */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">BEFORE</span>
                <div className="h-14 flex items-center p-2.5 rounded-xl bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-400 leading-snug">
                  "{ex.before}"
                </div>
              </div>

              {/* AFTER SECTION WITH FIXED HEIGHT (h-56) FOR PERFECT ROW ALIGNMENT */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider block">AFTER ENHANCEMENT</span>
                <div className="h-56 text-[11px] font-mono text-zinc-100 bg-zinc-950 dark:bg-black border border-zinc-800 dark:border-zinc-800 p-3 rounded-xl leading-relaxed whitespace-pre-wrap shadow-inner overflow-y-auto">
                  {ex.after}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
