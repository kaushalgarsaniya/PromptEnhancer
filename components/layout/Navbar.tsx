'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/components/theme/ThemeContext';
import { Sparkles, Menu, X, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const scrollToEditor = () => {
    const el = document.getElementById('editor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold shadow-sm transition-transform duration-150 group-hover:scale-[1.03]">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white dark:text-black" />
          </div>
          <span className="text-sm sm:text-base font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Prompt<span className="text-zinc-500 dark:text-zinc-400 font-normal">Enhancer</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-xs font-medium text-zinc-900 dark:text-white transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Home
          </Link>
          <button
            onClick={scrollToHowItWorks}
            className="text-xs font-medium text-zinc-600 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
          >
            How It Works
          </button>
        </nav>

        {/* Right Actions: Borderless Theme Toggle Icon + CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* Borderless Theme Toggle Icon Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors focus:outline-none"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-12 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-zinc-700 dark:text-zinc-300 hover:-rotate-12 transition-transform" />
            )}
          </button>

          <Button size="sm" onClick={scrollToEditor} className="px-4 py-2 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-white dark:text-black" />
            <span>Enhance Prompt</span>
          </Button>
        </div>

        {/* Mobile Buttons */}
        <div className="flex md:hidden items-center gap-1 sm:gap-2">
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors focus:outline-none"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700 dark:text-zinc-300" />
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-2 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-4 py-4 space-y-3 shadow-lg transition-all animate-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-zinc-900 dark:text-white py-1.5 hover:pl-1 transition-all"
          >
            Home
          </Link>
          <button
            onClick={() => {
              setMobileOpen(false);
              scrollToHowItWorks();
            }}
            className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 py-1.5 text-left w-full hover:pl-1 transition-all"
          >
            How It Works
          </button>
          <div className="pt-2">
            <Button
              size="sm"
              onClick={() => {
                setMobileOpen(false);
                scrollToEditor();
              }}
              className="w-full justify-center py-2.5"
            >
              <Sparkles className="w-4 h-4 text-white dark:text-black" />
              <span>Enhance Prompt</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
