import React from 'react';
import { CheckCheck, CheckCircle2, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ConfirmationOverviewProps {
  confirmedCount: number;
  disputedCount: number;
  pendingCount: number;
  className?: string;
}

export const ConfirmationOverview: React.FC<ConfirmationOverviewProps> = ({
  confirmedCount,
  disputedCount,
  pendingCount,
  className = '',
}) => {
  const total = confirmedCount + disputedCount + pendingCount;
  const confirmedPct = total > 0 ? (confirmedCount / total) * 100 : 0;
  const disputedPct = total > 0 ? (disputedCount / total) * 100 : 0;
  const pendingPct = total > 0 ? (pendingCount / total) * 100 : 0;

  return (
    <div className={`card-base flex flex-col justify-between ${className}`}>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-forest-soft text-forest flex items-center justify-center">
              <CheckCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink-primary">
                Contractor Confirmations
              </h3>
              <p className="text-xs text-forest font-hindi">ठेकेदार सत्यापन स्थिति</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-ink-secondary bg-surface px-2 py-0.5 rounded-full border border-borderNeutral">
            {total} Total Days
          </span>
        </div>

        {/* Visual Progress Bar Breakdown */}
        <div className="mt-4">
          <div className="h-2.5 w-full bg-surface rounded-full overflow-hidden flex border border-borderNeutral/50">
            <div
              style={{ width: `${confirmedPct}%` }}
              className="bg-status-success transition-all duration-300"
              title={`Confirmed: ${confirmedCount}`}
            />
            <div
              style={{ width: `${disputedPct}%` }}
              className="bg-status-danger transition-all duration-300"
              title={`Disputed: ${disputedCount}`}
            />
            <div
              style={{ width: `${pendingPct}%` }}
              className="bg-status-warning transition-all duration-300"
              title={`Pending: ${pendingCount}`}
            />
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {/* Confirmed */}
          <div className="p-2.5 rounded-xl bg-forest-50/60 border border-forest-200">
            <div className="flex items-center justify-center gap-1 text-status-success mb-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                Confirmed
              </span>
            </div>
            <div className="text-lg font-bold text-status-success stat-figure">
              {confirmedCount}
            </div>
            <span className="text-[10px] text-ink-secondary font-hindi block">
              सत्यापित
            </span>
          </div>

          {/* Disputed */}
          <div className="p-2.5 rounded-xl bg-red-50/60 border border-red-200">
            <div className="flex items-center justify-center gap-1 text-status-danger mb-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                Disputed
              </span>
            </div>
            <div className="text-lg font-bold text-status-danger stat-figure">
              {disputedCount}
            </div>
            <span className="text-[10px] text-ink-secondary font-hindi block">
              विवादित
            </span>
          </div>

          {/* Pending */}
          <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200">
            <div className="flex items-center justify-center gap-1 text-status-warning mb-1">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                Pending
              </span>
            </div>
            <div className="text-lg font-bold text-status-warning stat-figure">
              {pendingCount}
            </div>
            <span className="text-[10px] text-ink-secondary font-hindi block">
              प्रतीक्षारत
            </span>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="mt-4 pt-3 border-t border-borderNeutral/70 flex items-center justify-between text-xs">
        <span className="text-ink-secondary">
          Contractor reviewed via WhatsApp link
        </span>
        <Link
          to="/confirmations"
          className="text-forest hover:text-forest-dark font-medium inline-flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
