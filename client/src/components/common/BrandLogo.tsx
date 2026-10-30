import React from 'react';
import { NotebookTabs } from 'lucide-react';
import { DESIGN_TOKENS } from '../../styles/tokens';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  showHindi?: boolean;
  collapsed?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  showHindi = true,
  collapsed = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const containerSizes = {
    sm: 'h-8 w-8 rounded-lg',
    md: 'h-10 w-10 rounded-xl',
    lg: 'h-12 w-12 rounded-xl',
  };

  const titleSizes = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-bold',
    lg: 'text-xl font-bold',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon Badge */}
      <div
        className={`${containerSizes[size]} bg-forest text-white flex items-center justify-center shadow-subtle shrink-0 transition-transform duration-150 hover:scale-105`}
        aria-hidden="true"
        title={DESIGN_TOKENS.identity.name}
      >
        <NotebookTabs className={iconSizes[size]} strokeWidth={2.2} />
      </div>

      {/* Wordmark and Tagline (hidden if sidebar collapsed) */}
      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className={`${titleSizes[size]} tracking-tight text-ink-primary font-sans leading-none`}>
              {DESIGN_TOKENS.identity.name}
            </span>
            {showHindi && (
              <span className="text-xs font-semibold text-forest font-hindi leading-none">
                {DESIGN_TOKENS.identity.nameHindi}
              </span>
            )}
          </div>
          {showTagline && (
            <span className="text-[11px] text-ink-secondary mt-1 truncate">
              {DESIGN_TOKENS.identity.tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
