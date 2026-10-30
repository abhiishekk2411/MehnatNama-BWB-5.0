import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { PageContainer } from './PageContainer';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface PlaceholderCardProps {
  title: string;
  hindiTitle: string;
  route: string;
  description: string;
  icon: LucideIcon;
  phaseNumber: number;
}

export const PlaceholderCard: React.FC<PlaceholderCardProps> = ({
  title,
  hindiTitle,
  route,
  description,
  icon: Icon,
  phaseNumber,
}) => {
  return (
    <PageContainer maxWidth="xl" className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-borderNeutral/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-forest-soft text-forest text-[11px] font-semibold border border-forest-200">
              Route: {route}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-status-warning text-[11px] font-semibold border border-amber-200">
              <Clock className="h-3 w-3" />
              Phase {phaseNumber} Roadmap
            </span>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-primary">
              {title}
            </h1>
            <span className="text-lg sm:text-xl font-bold text-forest font-hindi">
              ({hindiTitle})
            </span>
          </div>

          <p className="text-xs sm:text-sm text-ink-secondary mt-1">
            MehnatNama (मेहनतनामा) • Har din ka kaam. Har rupaye ka hisaab.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="btn-secondary self-start sm:self-auto text-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Main Content Card */}
      <div className="card-base space-y-5">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-forest-soft text-forest border border-forest-200/80 flex items-center justify-center shrink-0 shadow-subtle">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-ink-primary">
                {title} Module Overview
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-forest font-semibold bg-forest-50 px-2 py-0.5 rounded-md">
                <Sparkles className="h-3 w-3" />
                Designed in Phase 2
              </span>
            </div>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1.5 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-borderNeutral/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-ink-secondary">
          <span>Routing & interface contracts established in Phase 2.</span>
          <span className="font-semibold text-forest">
            Scheduled for Phase {phaseNumber} backend integration
          </span>
        </div>
      </div>
    </PageContainer>
  );
};
