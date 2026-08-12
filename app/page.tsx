'use client';

import React from 'react';
import { ThemeProvider } from '@/components/theme/ThemeContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { PromptEnhancer } from '@/components/enhancer/PromptEnhancer';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { ExamplesSection } from '@/components/sections/ExamplesSection';

export default function MainPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white selection:bg-zinc-300 dark:selection:bg-zinc-800 transition-colors">
        <Navbar />

        <main className="flex-1">
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
