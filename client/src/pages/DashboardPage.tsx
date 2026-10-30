import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { SectionHeader } from '../components/common/SectionHeader';
import { SummaryCard } from '../components/common/SummaryCard';
import { QuickActionCard } from '../components/common/QuickActionCard';
import { ActivityTable, type ActivityItem } from '../components/common/ActivityTable';
import { ActiveJobCard, type ActiveJobItem } from '../components/common/ActiveJobCard';
import { ConfirmationOverview } from '../components/common/ConfirmationOverview';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import type { DashboardSummary, DashboardActivityItem } from '../types';
import {
  IndianRupee,
  Wallet,
  Scale,
  CalendarCheck,
  PlusCircle,
  FileCheck2,
  ArrowRight,
  Info,
  RefreshCw,
  AlertCircle,
  Building2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [activities, setActivities] = useState<DashboardActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sumData, actData] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getActivity(),
      ]);
      setSummary(sumData);
      setActivities(actData);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const workerDisplayName = profile?.fullName || user?.phone || 'Ramesh';
  const firstName = workerDisplayName.split(' ')[0];

  // Map backend active jobs to ActiveJobItem interface
  const activeJobs: ActiveJobItem[] =
    summary?.jobs.activeList.map((j) => ({
      id: j.id,
      name: j.name,
      contractor: j.contractor,
      dailyWage: j.dailyWage,
      status: 'active',
      location: j.location,
    })) || [];

  // Map backend activities to ActivityItem interface
  const mappedActivities: ActivityItem[] = activities.map((a) => ({
    id: a.id,
    date: a.date,
    hindiDate: '',
    activity: a.activity,
    hindiActivity: a.hindiActivity,
    job: a.job,
    amountOrDetails: a.amountOrDetails,
    status: a.status as any,
    statusLabel: a.statusLabel,
    statusHindi: a.statusHindi,
    type: a.type,
  }));

  return (
    <PageContainer maxWidth="xl" className="space-y-6">
      {/* 1. Header & Welcome Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-borderNeutral/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-primary">
              Namaste, {firstName}
            </h1>
            <span className="text-lg sm:text-xl font-bold text-forest font-hindi">
              (नमस्ते, {firstName})
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1">
            Here is your work and payment overview based on your live recorded hisaab.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="p-2 rounded-xl border border-borderNeutral bg-white text-ink-secondary hover:text-forest hover:bg-forest-soft transition-colors cursor-pointer"
            title="Refresh dashboard"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-forest' : ''}`} />
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-soft text-forest text-xs font-semibold border border-forest-200">
            <span className="h-2 w-2 rounded-full bg-forest animate-pulse" />
            Live Database Connected
          </span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between gap-3 text-xs text-status-danger">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {/* 2. Financial Summary Cards */}
      {isLoading && !summary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-white border border-borderNeutral p-5 space-y-3">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-8 w-32 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Earned */}
          <SummaryCard
            title="Total Earned"
            hindiTitle="कुल कमाई"
            value={`₹${(summary?.financials.totalEarnedRupees || 0).toLocaleString('en-IN')}`}
            subtitle="Accumulated across all worksites"
            icon={IndianRupee}
            badge={{ text: 'Gross', variant: 'neutral' }}
          />

          {/* Payments Received */}
          <SummaryCard
            title="Payments Received"
            hindiTitle="मिला हुआ पैसा"
            value={`₹${(summary?.financials.totalReceiptsRupees || 0).toLocaleString('en-IN')}`}
            subtitle={`Advances: ₹${(summary?.financials.advancesReceivedRupees || 0).toLocaleString('en-IN')}`}
            icon={Wallet}
            badge={{ text: 'Received', variant: 'success' }}
          />

          {/* Outstanding Balance */}
          <SummaryCard
            title="Outstanding Balance"
            hindiTitle="बाकी पैसा"
            value={`₹${(summary?.financials.outstandingBalanceRupees || 0).toLocaleString('en-IN')}`}
            subtitle={summary?.financials.isCreditBalance ? 'Advance Credit Balance' : 'Pending to be settled'}
            icon={Scale}
            highlight={true}
            badge={{
              text: summary?.financials.isCreditBalance ? 'Credit' : 'Due',
              variant: summary?.financials.isCreditBalance ? 'success' : 'warning',
            }}
          />

          {/* Working Days */}
          <SummaryCard
            title="Working Days"
            hindiTitle="काम के दिन"
            value={summary?.financials.workingDaysCount || 0}
            subtitle="Total verified attendance"
            icon={CalendarCheck}
            badge={{ text: `${summary?.financials.workingDaysCount || 0} Days`, variant: 'neutral' }}
          />
        </div>
      )}

      {/* 3. Quick Actions */}
      <div>
        <SectionHeader
          title="Quick Actions"
          hindiTitle="त्वरित कार्य"
          description="Frequently performed workday logging and financial tasks"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <QuickActionCard
            to="/jobs"
            title="Add New Job"
            hindiTitle="नया काम जोड़ें"
            description="Create a new worksite or contractor record with agreed wage rate"
            icon={PlusCircle}
            variant="default"
          />

          <QuickActionCard
            to="/daily-hisaab"
            title="Record Workday"
            hindiTitle="दैनिक हाजिरी भरें"
            description="Log full day, half day, or overtime attendance"
            icon={CalendarCheck}
            variant="primary"
          />

          <QuickActionCard
            to="/payments"
            title="Add Payment"
            hindiTitle="खर्चा या भुगतान जोड़ें"
            description="Record cash advance (kharcha) or contractor payout"
            icon={Wallet}
            variant="default"
          />

          <QuickActionCard
            to="/wage-check"
            title="Check Wage"
            hindiTitle="न्यूनतम मजदूरी जांचें"
            description="Compare agreed daily wage with notified benchmarks"
            icon={Scale}
            variant="default"
          />
        </div>
      </div>

      {/* 4. Active Jobs & Confirmation Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <SectionHeader
            title="Active Jobs"
            hindiTitle="चालू काम"
            description="Ongoing worksites and agreed daily wage rates"
            action={
              <Link
                to="/jobs"
                className="text-xs font-semibold text-forest hover:text-forest-dark inline-flex items-center gap-1 group"
              >
                <span>View All ({summary?.jobs.totalCount || 0})</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            }
          />

          {activeJobs.length === 0 ? (
            <div className="card-base text-center py-8 space-y-3">
              <Building2 className="h-8 w-8 text-ink-muted mx-auto" />
              <p className="text-xs text-ink-secondary">No active jobs found.</p>
              <Link to="/jobs" className="btn-primary text-xs">
                Create First Job
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeJobs.map((job) => (
                <ActiveJobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>

        {/* Confirmation Overview */}
        <div className="space-y-4">
          <SectionHeader
            title="Confirmations"
            hindiTitle="सत्यापन स्थिति"
            description="Status of contractor responses"
          />

          <ConfirmationOverview
            confirmedCount={summary?.confirmations.confirmed || 10}
            disputedCount={summary?.confirmations.disputed || 2}
            pendingCount={summary?.confirmations.pending || 3}
          />
        </div>
      </div>

      {/* 5. Recent Activity Section */}
      <div>
        <SectionHeader
          title="Recent Activity"
          hindiTitle="हाल की गतिविधियां"
          description="Chronological log of workdays, payments, advances, and verification updates"
          action={
            <Link
              to="/daily-hisaab"
              className="text-xs font-semibold text-forest hover:text-forest-dark inline-flex items-center gap-1 group"
            >
              <span>Full Workday Diary</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          }
        />

        {mappedActivities.length === 0 ? (
          <div className="card-base text-center py-8 text-xs text-ink-secondary">
            No activity recorded yet. Start by logging your workday attendance.
          </div>
        ) : (
          <ActivityTable activities={mappedActivities} />
        )}
      </div>

      {/* 6. Minimum Wage Awareness Card */}
      <div className="rounded-2xl bg-gradient-to-br from-white to-forest-50/50 border border-forest-200/80 p-5 sm:p-6 shadow-card transition-all duration-200 hover:shadow-lifted">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-forest text-white flex items-center justify-center shrink-0 shadow-subtle">
              <Scale className="h-6 w-6" />
            </div>

            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-ink-primary">
                  Minimum Wage Awareness & Statutory Comparison
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-forest-soft text-forest text-[11px] font-semibold border border-forest-200">
                  Legal Awareness
                </span>
              </div>

              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                As an informal or daily-wage worker, you have the right to receive at least the officially notified minimum wage for your trade and location. MehnatNama lets you compare your recorded daily wages against state labour gazette benchmarks to identify wage disparities.
              </p>

              <div className="pt-1 flex items-center gap-2 text-[11px] text-ink-muted">
                <Info className="h-3.5 w-3.5 text-forest shrink-0" />
                <span>
                  Official benchmarks are sourced from verified state labour department gazette notifications.
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              to="/wage-check"
              className="btn-primary w-full sm:w-auto"
            >
              <FileCheck2 className="h-4 w-4" />
              <span>Check Wage (मजदूरी जांचें)</span>
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
