import React from 'react';
import { PenTool, Brain, Sparkles, CheckCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'WRITE',
      desc: 'Write your idea naturally in plain text.', 
      icon: PenTool,
    },
    {
      num: '02',
      title: 'UNDERSTAND',
      desc: 'AI understands your intent and context.',
      icon: Brain, 
    },
    {
      num: '03',
      title: 'ENHANCE',
      desc: 'Your idea becomes clearer and more structured.',
      icon: Sparkles,
    },
    {
      num: '04',
      title: 'USE',
      desc: 'Copy the enhanced prompt and use it with your AI tool.',
      icon: CheckCircle,
    },
  ];

  return (
    <section id="how-it-works" className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6 sm:space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Workflow</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white transition-colors">How It Works</h2>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto transition-colors px-2">
          Four simple steps to transform raw thoughts into high-clarity instructions.
        </p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2.5 sm:space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm dark:shadow-none transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl font-mono font-bold text-zinc-400 dark:text-zinc-500">{s.num}</span>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-900 dark:text-white" />
              </div>
              <h3 className="text-xs font-bold tracking-wider text-zinc-900 dark:text-white uppercase">{s.title}</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
