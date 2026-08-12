import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'cyan' | 'purple';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  const base = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border';
  
  const variants = {
    default: 'bg-zinc-900 text-zinc-200 border-zinc-800',
    outline: 'bg-transparent text-zinc-400 border-zinc-800',
    success: 'bg-zinc-900 text-zinc-100 border-zinc-700 font-medium',
    warning: 'bg-zinc-900 text-zinc-300 border-zinc-800',
    cyan: 'bg-zinc-900 text-white border-zinc-700 font-semibold',
    purple: 'bg-white text-black border-white font-semibold',
  };

  return (
    <div className={cn(base, variants[variant], className)} {...props}>
      {children}
    </div>
  );
};


