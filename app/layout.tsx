import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});


export const metadata: Metadata = {
  title: 'PromptEnhancer — Turn Your Thoughts Into Better AI Prompts',
  description: 'Write your idea naturally and transform it into a clear, structured prompt that AI systems can understand better.',
  keywords: ['Prompt Engineering', 'AI Prompt Enhancer', 'Structured Prompts', 'AI Instructions'],
  openGraph: {
    title: 'PromptEnhancer — Turn Your Thoughts Into Better AI Prompts',
    description: 'Write your idea naturally and transform it into a clear, structured prompt that AI systems can understand better.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptEnhancer — Turn Your Thoughts Into Better AI Prompts',
    description: 'Write your idea naturally and transform it into a clear, structured prompt that AI systems can understand better.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-black text-white min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

