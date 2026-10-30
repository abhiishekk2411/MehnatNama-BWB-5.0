import React from 'react';
import { NotebookTabs } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  showHindi?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  showHindi = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  };

  const containerSizes = {
    sm: 'h-8 w-8 rounded-lg',
    md: 'h-9 w-9 rounded-xl',
    lg: 'h-12 w-12 rounded-2xl',
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Ledger-inspired Mark */}
      <div
        className={`${containerSizes[size]} bg-forest flex items-center justify-center text-white shadow-subtle shrink-0`}
        aria-hidden="true"
      >
        <NotebookTabs className={iconSizes[size]} />
      </div>

      {/* Wordmark and Identity */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className={`${titleSizes[size]} font-bold tracking-tight text-charcoal`}>
            MehnatNama
          </span>
          {showHindi && (
            <span className="text-xs font-semibold text-forest">
              मेहनतनामा
            </span>
          )}
        </div>
        {showTagline && (
          <span className="text-[11px] text-charcoalMuted font-normal mt-1">
            Har din ka kaam. Har rupaye ka hisaab.
          </span>
        )}
      </div>
    </div>
  );
};
