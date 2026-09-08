'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme/ThemeContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { PromptEnhancer } from '@/components/enhancer/PromptEnhancer';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { ExamplesSection } from '@/components/sections/ExamplesSection';

export default function MainPage() {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 30); // 30ms microsecond detection
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="relative min-h-screen flex flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white selection:bg-zinc-300 dark:selection:bg-zinc-800 transition-colors">
        {/* ULTRA-FAST MOTION BLUR OVERLAY - SOFT NORMAL SUBTLE BLUR */}
        <div
          className={`pointer-events-none fixed inset-0 z-30 transition-all ${
            isScrolling
              ? 'backdrop-blur-[1.5px] opacity-100 duration-75'
              : 'backdrop-blur-none opacity-0 duration-0'
          }`}
        />

        <Navbar />

        <main className="flex-1 pt-28 sm:pt-32">
          <Hero />
          <PromptEnhancer />
          <HowItWorks />
          <ExamplesSection />
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
