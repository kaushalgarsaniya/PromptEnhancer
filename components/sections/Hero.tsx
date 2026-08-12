'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowDown, Globe } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToEditor = () => {
    const el = document.getElementById('editor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center py-12">
      <div className="space-y-6 max-w-4xl -mt-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
            <span>AI-Powered Prompt Engineering Engine</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Multi-Language Input Support</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1] transition-colors">
          Turn Your Thoughts Into <span className="text-zinc-600 dark:text-zinc-400 underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-8">Better AI Prompts.</span>
        </h1>

        <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed transition-colors">
          Write your idea in <strong>any language</strong> (Spanish, Hindi, French, Gujarati, German, etc.). Our AI automatically understands your intent and transforms it into a clear, pro-grade <strong>English</strong> code specification & prompt.
        </p>

        <div className="pt-4 flex flex-col items-center space-y-3">
          <Button size="lg" onClick={scrollToEditor} className="px-8 py-3.5 text-sm font-semibold shadow-lg">
            <Sparkles className="w-4 h-4 text-white dark:text-black" />
            <span>Enhance My Prompt</span>
            <ArrowDown className="w-4 h-4 text-white dark:text-black animate-bounce" />
          </Button>
          <p className="text-xs text-zinc-500 font-medium">No prompt engineering knowledge required.</p>
        </div>
      </div>

      {/* Scroll Down Hint for Screen 1 */}
      <button
        onClick={scrollToEditor}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
        aria-label="Scroll to Prompt Enhancer"
      >
        <span className="text-[11px] font-medium tracking-wider uppercase">Scroll to Enhancer</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
};
