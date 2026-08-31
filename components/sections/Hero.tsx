'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToEditor = () => {
    const el = document.getElementById('editor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[75vh] sm:min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center py-10 sm:py-16">
      <div className="space-y-5 sm:space-y-6 max-w-4xl">

        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15] sm:leading-[1.1] transition-colors">
          Turn Your Thoughts Into <span className="text-zinc-600 dark:text-zinc-400 underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4 sm:underline-offset-8">Better AI Prompts.</span>
        </h1>

        <p className="text-sm sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed transition-colors px-1">
          Write your idea in <strong>any language</strong> (Spanish, Hindi, French, Gujarati, German, etc.). Our AI automatically understands your intent and transforms it into a clear, pro-grade <strong>English</strong> code specification & prompt.
        </p>

        <div className="pt-2 sm:pt-4 flex flex-col items-center space-y-3 w-full sm:w-auto">
          <Button size="lg" onClick={scrollToEditor} className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold shadow-lg justify-center">
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
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
        aria-label="Scroll to Prompt Enhancer"
      >
        <span className="text-[11px] font-medium tracking-wider uppercase">Scroll to Enhancer</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
};
