import React from 'react';

export interface SectionHeaderProps {
  title: string;
  hindiTitle?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  hindiTitle,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 ${className}`}>
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-base sm:text-lg font-bold text-ink-primary tracking-tight">
            {title}
          </h2>
          {hindiTitle && (
            <span className="text-xs sm:text-sm font-semibold text-forest font-hindi">
              ({hindiTitle})
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-ink-secondary mt-0.5">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
