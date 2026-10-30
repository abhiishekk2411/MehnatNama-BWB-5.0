import type { LucideIcon } from 'lucide-react';

interface PlaceholderCardProps {
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-borderNeutral">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-forest text-[11px] font-semibold">
              Route: {route}
            </span>
            <span className="badge-sage text-[11px] font-semibold">
              Phase {phaseNumber}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">
            {title} <span className="text-forest font-semibold text-xl">({hindiTitle})</span>
          </h1>
          <p className="text-sm text-charcoalMuted mt-1">
            MehnatNama • Har din ka kaam. Har rupaye ka hisaab.
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card space-y-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-forest-50 text-forest border border-forest-200/60 flex items-center justify-center shrink-0">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-charcoal">
              {title} Module Overview
            </h2>
            <p className="text-sm text-charcoalMuted mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-borderNeutral flex items-center justify-between text-xs text-charcoalSubtle">
          <span>Module status: Architecture & routing initialised</span>
          <span className="font-medium text-forest">Ready for Phase {phaseNumber} implementation</span>
        </div>
      </div>
    </div>
  );
};
