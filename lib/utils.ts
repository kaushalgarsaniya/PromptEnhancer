import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  // Approximation: 1 token ~ 4 characters or ~0.75 words for English, ~0.5 words for Indic languages
  const wordCount = text.trim().split(/\s+/).length;
  const charCount = text.length;
  return Math.ceil(Math.max(wordCount * 1.3, charCount / 3.8));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function getScoreBadgeColor(score: number): string {
  if (score >= 85) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  if (score >= 70) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
}
