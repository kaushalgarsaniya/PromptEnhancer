import React from 'react';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-zinc-600 dark:text-zinc-400 py-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
            <Sparkles className="w-3.5 h-3.5 text-white dark:text-black" />
          </div>
          <span className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">PromptEnhancer</span>
        </div>

        <p className="text-xs text-zinc-500 text-center sm:text-right">
          © {new Date().getFullYear()} PromptEnhancer. Turn your thoughts into better AI prompts.
        </p>
      </div>
    </footer>
  );
};
