import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Building2, User, IndianRupee, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ActiveJobItem {
  id: string;
  name: string;
  hindiName?: string;
  contractor: string;
  contractorHindi?: string;
  dailyWage: number;
  status: 'active' | 'completed' | 'paused';
  location?: string;
}

export interface ActiveJobCardProps {
  job: ActiveJobItem;
  className?: string;
}

export const ActiveJobCard: React.FC<ActiveJobCardProps> = ({
  job,
  className = '',
}) => {
  return (
    <div
      className={`card-base flex flex-col justify-between transition-all duration-200 hover:shadow-lifted hover:border-forest-200 ${className}`}
    >
      <div>
        {/* Top: Title & Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-forest-soft text-forest flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink-primary leading-tight">
                {job.name}
              </h4>
              {job.hindiName && (
                <span className="text-xs text-forest font-hindi block mt-0.5">
                  {job.hindiName}
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={job.status} size="sm" />
        </div>

        {/* Contractor and Rate */}
        <div className="mt-4 pt-3 border-t border-borderNeutral/70 space-y-2 text-xs">
          <div className="flex items-center justify-between text-ink-secondary">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-ink-secondary/80" />
              Contractor (ठेकेदार):
            </span>
            <span className="font-semibold text-ink-primary">
              {job.contractor}
            </span>
          </div>

          <div className="flex items-center justify-between text-ink-secondary">
            <span className="flex items-center gap-1.5">
              <IndianRupee className="h-3.5 w-3.5 text-forest" />
              Daily Wage (दैनिक मजदूरी):
            </span>
            <span className="font-bold text-forest stat-figure text-sm">
              ₹{job.dailyWage.toLocaleString('en-IN')}/day
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-borderNeutral/70 flex items-center justify-between text-xs">
        <Link
          to="/daily-hisaab"
          className="text-forest hover:text-forest-dark font-medium inline-flex items-center gap-1 group"
        >
          <span>Log Workday (हाजिरी भरें)</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <Link
          to="/jobs"
          className="text-ink-secondary hover:text-ink-primary font-medium"
        >
          View Job
        </Link>
      </div>
    </div>
  );
};
