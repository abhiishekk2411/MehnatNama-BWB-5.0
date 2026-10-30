import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

export interface QuickActionCardProps {
  to: string;
  title: string;
  hindiTitle: string;
  description: string;
  icon: LucideIcon;
  variant?: 'primary' | 'default';
  className?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  to,
  title,
  hindiTitle,
  description,
  icon: Icon,
  variant = 'default',
  className = '',
}) => {
  const isPrimary = variant === 'primary';

  return (
    <Link
      to={to}
      className={`group relative rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${
        isPrimary
          ? 'bg-forest text-white border-forest shadow-card hover:bg-forest-dark hover:shadow-lifted'
          : 'bg-white text-ink-primary border-borderNeutral shadow-card hover:border-forest-200 hover:shadow-lifted hover:bg-forest-50/20'
      } ${className}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${
              isPrimary
                ? 'bg-white/15 text-white'
                : 'bg-forest-soft text-forest group-hover:bg-forest group-hover:text-white'
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>

          <div
            className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
              isPrimary
                ? 'text-white/80 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                : 'text-ink-secondary group-hover:text-forest group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
            }`}
          >
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold tracking-tight leading-snug">
            {title}
          </h3>
          <p
            className={`text-xs font-medium font-hindi ${
              isPrimary ? 'text-forest-200' : 'text-forest'
            }`}
          >
            {hindiTitle}
          </p>
        </div>
      </div>

      <p
        className={`text-xs mt-3 line-clamp-2 ${
          isPrimary ? 'text-white/80' : 'text-ink-secondary'
        }`}
      >
        {description}
      </p>
    </Link>
  );
};
