'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/components/theme/ThemeContext';
import { PromptLogo } from '@/components/ui/Logo';
import { Zap, Menu, X, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full px-3 sm:px-6 lg:px-8 transition-all duration-300 ease-out pointer-events-none ${
        scrolled
          ? 'pt-3 sm:pt-3.5 pb-2'
          : 'pt-5 sm:pt-6 pb-3'
      }`}
    >
      <div className="max-w-6xl mx-auto pointer-events-auto">
        {/* Main Floating Bar */}
        <div
          className={`relative bg-zinc-100/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 shadow-md border border-zinc-300/80 dark:border-zinc-800/80 backdrop-blur-md flex items-center justify-between overflow-hidden transition-all duration-300 ease-in-out ${
            scrolled
              ? 'h-11 sm:h-13 rounded-xl sm:rounded-2xl shadow-lg'
              : 'h-14 sm:h-16 rounded-2xl sm:rounded-3xl shadow-md'
          }`}
        >
          {/* Left: Dark Angled Tab with Logo and Brand Name */}
          <Link
            href="/"
            className={`h-full bg-black text-white flex items-center gap-2 sm:gap-2.5 group shrink-0 relative transition-all duration-300 ease-in-out ${
              scrolled ? 'pl-3 sm:pl-5 pr-7 sm:pr-8' : 'pl-4 sm:pl-6 pr-8 sm:pr-10'
            }`}
            style={{
              clipPath: 'polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%)',
            }}
          >
            <div
              className={`rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-all duration-300 ${
                scrolled ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-7 h-7 sm:w-8 sm:h-8'
              }`}
            >
              <PromptLogo
                className={`text-white transition-all duration-300 ${
                  scrolled ? 'w-3 h-3 sm:w-3.5 sm:h-3.5' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'
                }`}
              />
            </div>
            <span
              className={`font-extrabold tracking-tight text-white pr-2 transition-all duration-300 ${
                scrolled ? 'text-xs sm:text-xs' : 'text-xs sm:text-sm'
              }`}
            >
              Prompt<span className="text-zinc-400 font-light">Enhancer</span>
            </span>
          </Link>

          {/* Center/Right Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 px-4">
            <Link
              href="/"
              className="text-xs font-semibold text-zinc-800 hover:text-black dark:text-zinc-300 dark:hover:text-white transition-colors"
            >
              Home
            </Link>
            <button
              onClick={scrollToHowItWorks}
              className="text-xs font-semibold text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              How It Works
            </button>
            <a
              href="https://kaushalthakor.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              Meet the Developer
            </a>
          </nav>

          {/* Right Actions: Theme Toggle + CTA Button */}
          <div className="hidden md:flex items-center gap-2.5 pr-4 sm:pr-5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
              className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-12 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Enhance Prompt CTA */}
            <button
              onClick={scrollToEditor}
              className={`bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                scrolled ? 'px-3 py-1 sm:py-1.5' : 'px-3.5 py-1.5 sm:py-2'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-white dark:text-black fill-current" />
              <span>Enhance Prompt</span>
            </button>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex md:hidden items-center gap-1.5 pr-3">
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
              className="p-1.5 rounded-lg text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 focus:outline-none"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700" />
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-zinc-800 dark:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-200/70 dark:hover:bg-zinc-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden mt-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3 shadow-xl animate-in slide-in-from-top-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-semibold text-zinc-900 dark:text-white py-1 hover:pl-1 transition-all"
            >
              Home
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false);
                scrollToHowItWorks();
              }}
              className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 py-1 text-left w-full hover:pl-1 transition-all"
            >
              How It Works
            </button>
            <a
              href="https://kaushalthakor.in"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 py-1 hover:pl-1 transition-all"
            >
              Meet the Developer
            </a>
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  scrollToEditor();
                }}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Enhance Prompt</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
