import React from 'react';
import { StatusBadge, type StatusVariant } from './StatusBadge';
import { Calendar, Building2, CheckCircle2, IndianRupee } from 'lucide-react';

export interface ActivityItem {
  id: string;
  date: string;
  hindiDate?: string;
  activity: string;
  hindiActivity?: string;
  job: string;
  amountOrDetails: string;
  status: StatusVariant;
  statusLabel?: string;
  statusHindi?: string;
  type?: 'work' | 'payment' | 'advance' | 'confirmation';
}

export interface ActivityTableProps {
  activities: ActivityItem[];
  title?: string;
  className?: string;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({
  activities,
  className = '',
}) => {
  return (
    <div className={`overflow-hidden rounded-2xl border border-borderNeutral bg-white shadow-card ${className}`}>
      {/* Table container for responsive horizontal scrolling on small viewports */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-borderNeutral text-left text-xs sm:text-sm">
          <thead className="bg-surface text-ink-secondary uppercase tracking-wider text-[11px] font-semibold">
            <tr>
              <th scope="col" className="py-3.5 pl-4 sm:pl-6 pr-3">
                Date (तारीख)
              </th>
              <th scope="col" className="px-3 py-3.5">
                Activity (विवरण)
              </th>
              <th scope="col" className="px-3 py-3.5">
                Job / Site (काम की जगह)
              </th>
              <th scope="col" className="px-3 py-3.5">
                Amount / Details (रकम / विवरण)
              </th>
              <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                Status (स्थिति)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderNeutral/60 bg-white">
            {activities.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-forest-soft/30 transition-colors duration-150"
              >
                {/* Date */}
                <td className="whitespace-nowrap py-3.5 pl-4 sm:pl-6 pr-3 font-medium text-ink-primary">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-forest shrink-0" />
                    <span>{item.date}</span>
                  </div>
                </td>

                {/* Activity */}
                <td className="px-3 py-3.5 text-ink-primary font-medium">
                  <div className="flex items-center gap-2">
                    {item.type === 'payment' && (
                      <span className="p-1 rounded-md bg-emerald-50 text-status-success">
                        <IndianRupee className="h-3.5 w-3.5" />
                      </span>
                    )}
                    {item.type === 'confirmation' && (
                      <span className="p-1 rounded-md bg-forest-soft text-forest">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <div>
                      <span>{item.activity}</span>
                      {item.hindiActivity && (
                        <span className="text-[11px] text-ink-secondary block font-hindi">
                          {item.hindiActivity}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Job / Site */}
                <td className="whitespace-nowrap px-3 py-3.5 text-ink-secondary">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-ink-secondary/70 shrink-0" />
                    <span className="truncate max-w-[160px] sm:max-w-[200px]">{item.job}</span>
                  </div>
                </td>

                {/* Amount / Details */}
                <td className="whitespace-nowrap px-3 py-3.5 font-semibold text-ink-primary font-sans stat-figure">
                  {item.amountOrDetails}
                </td>

                {/* Status */}
                <td className="whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                  <StatusBadge
                    status={item.status}
                    label={item.statusLabel}
                    hindiLabel={item.statusHindi}
                    size="sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
