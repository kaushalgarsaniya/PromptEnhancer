import React from 'react';

interface LogoProps {
  className?: string;
}

/**
 * Unique modern logo for PromptEnhancer.
 * Features a stylized geometric command prompt chevron combined with
 * an forward acceleration beam and precision focal point.
 */
export const PromptLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="PromptEnhancer Logo"
    >
      {/* Primary prompt command chevron */}
      <path
        d="M4.5 5.5L11.5 12L4.5 18.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Forward acceleration & expansion beam */}
      <path
        d="M12.5 7L17.5 12L12.5 17"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Precision terminal pulse dot */}
      <circle
        cx="19.5"
        cy="12"
        r="1.5"
        fill="currentColor"
      />
    </svg>
  );
};
