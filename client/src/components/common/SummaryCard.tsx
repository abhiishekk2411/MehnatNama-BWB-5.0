import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface SummaryCardProps {
  title: string;
  hindiTitle?: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    variant?: 'success' | 'warning' | 'danger' | 'neutral';
  };
  highlight?: boolean;
  className?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  hindiTitle,
  value,
  subtitle,
  icon: Icon,
  badge,
  highlight = false,
  className = '',
}) => {
  return (
    <div
      className={`card-base flex flex-col justify-between transition-all duration-200 hover:shadow-lifted hover:border-forest-200/80 ${
        highlight ? 'bg-gradient-to-b from-white to-forest-50/30 border-forest-200' : ''
      } ${className}`}
    >
      {/* Card Header with Icon */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              {title}
            </span>
            {hindiTitle && (
              <span className="text-xs font-medium text-forest font-hindi">
                • {hindiTitle}
              </span>
            )}
          </div>
        </div>
        <div
          className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            highlight
              ? 'bg-forest text-white'
              : 'bg-forest-soft text-forest'
          }`}
          aria-hidden="true"
        >
          <Icon className="h-4.5 w-4.5" strokeWidth={2} />
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="mt-4">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary font-sans stat-figure">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-ink-secondary mt-1 font-normal flex items-center gap-2">
            {badge && (
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  badge.variant === 'success'
                    ? 'bg-forest-soft text-status-success'
                    : badge.variant === 'warning'
                    ? 'bg-amber-50 text-status-warning'
                    : badge.variant === 'danger'
                    ? 'bg-red-50 text-status-danger'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {badge.text}
              </span>
            )}
            <span>{subtitle}</span>
          </p>
        )}
      </div>
    </div>
  );
};
