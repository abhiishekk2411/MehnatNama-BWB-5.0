import React from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { SectionHeader } from '../components/common/SectionHeader';
import { SummaryCard } from '../components/common/SummaryCard';
import { QuickActionCard } from '../components/common/QuickActionCard';
import { ActivityTable, type ActivityItem } from '../components/common/ActivityTable';
import { ActiveJobCard, type ActiveJobItem } from '../components/common/ActiveJobCard';
import { ConfirmationOverview } from '../components/common/ConfirmationOverview';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  Wallet,
  Scale,
  CalendarCheck,
  PlusCircle,
  FileCheck2,
  ArrowRight,
  Info,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  // Demo Active Jobs as specified in Part D
  const activeJobs: ActiveJobItem[] = [
    {
      id: 'job-1',
      name: 'Construction Site A',
      hindiName: 'कंस्ट्रक्शन साइट ए',
      contractor: 'Rajesh Kumar',
      contractorHindi: 'राजेश कुमार',
      dailyWage: 600,
      status: 'active',
      location: 'Sector 62, Noida',
    },
    {
      id: 'job-2',
      name: 'Farm Work B',
      hindiName: 'खेत काम बी',
      contractor: 'Suresh',
      contractorHindi: 'सुरेश',
      dailyWage: 450,
      status: 'active',
      location: 'Badlapur Rural',
    },
  ];

  // Demo Recent Activities exactly matching Part D:
  // 25 October — Full day recorded — Construction Site A
  // 24 October — Payment received — ₹2,000
  // 23 October — Half day recorded — Construction Site A
  // 22 October — Contractor confirmation received
  // 21 October — Advance recorded — ₹1,000
  const recentActivities: ActivityItem[] = [
    {
      id: 'act-1',
      date: '25 Oct 2026',
      hindiDate: '२५ अक्टूबर',
      activity: 'Full day recorded',
      hindiActivity: 'पूरा दिन काम दर्ज',
      job: 'Construction Site A',
      amountOrDetails: '₹600 (1.0 Day)',
      status: 'full-day',
      statusLabel: 'Full Day',
      statusHindi: 'पूरा दिन',
      type: 'work',
    },
    {
      id: 'act-2',
      date: '24 Oct 2026',
      hindiDate: '२४ अक्टूबर',
      activity: 'Payment received',
      hindiActivity: 'भुगतान प्राप्त हुआ',
      job: 'Construction Site A',
      amountOrDetails: '₹2,000',
      status: 'paid',
      statusLabel: 'Received',
      statusHindi: 'प्राप्त',
      type: 'payment',
    },
    {
      id: 'act-3',
      date: '23 Oct 2026',
      hindiDate: '२३ अक्टूबर',
      activity: 'Half day recorded',
      hindiActivity: 'आधा दिन काम दर्ज',
      job: 'Construction Site A',
      amountOrDetails: '₹300 (0.5 Day)',
      status: 'half-day',
      statusLabel: 'Half Day',
      statusHindi: 'आधा दिन',
      type: 'work',
    },
    {
      id: 'act-4',
      date: '22 Oct 2026',
      hindiDate: '२२ अक्टूबर',
      activity: 'Contractor confirmation received',
      hindiActivity: 'ठेकेदार सत्यापन प्राप्त',
      job: 'Construction Site A',
      amountOrDetails: 'Confirmed by Rajesh',
      status: 'confirmed',
      statusLabel: 'Confirmed',
      statusHindi: 'सत्यापित',
      type: 'confirmation',
    },
    {
      id: 'act-5',
      date: '21 Oct 2026',
      hindiDate: '२१ अक्टूबर',
      activity: 'Advance recorded',
      hindiActivity: 'खर्चा / पेशगी दर्ज',
      job: 'Construction Site A',
      amountOrDetails: '₹1,000',
      status: 'advance',
      statusLabel: 'Advance',
      statusHindi: 'खर्चा',
      type: 'advance',
    },
  ];

  return (
    <PageContainer maxWidth="xl" className="space-y-6">
      {/* 1. Header & Welcome Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-borderNeutral/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-primary">
              Namaste, Ramesh
            </h1>
            <span className="text-lg sm:text-xl font-bold text-forest font-hindi">
              (नमस्ते, रमेश)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1">
            Here is your work and payment overview.
          </p>
        </div>

        {/* Quick Date Range Tag */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-soft text-forest text-xs font-semibold border border-forest-200">
            <span className="h-2 w-2 rounded-full bg-forest animate-pulse" />
            October 2026 • चालू महीना
          </span>
        </div>
      </div>

      {/* 2. Financial Summary Cards (Part D) */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Earned: ₹12,000 */}
          <SummaryCard
            title="Total Earned"
            hindiTitle="कुल कमाई"
            value="₹12,000"
            subtitle="Accumulated across all sites"
            icon={IndianRupee}
            badge={{ text: 'Gross', variant: 'neutral' }}
          />

          {/* Payments Received: ₹8,000 */}
          <SummaryCard
            title="Payments Received"
            hindiTitle="मिला हुआ पैसा"
            value="₹8,000"
            subtitle="Advances & wage settlements"
            icon={Wallet}
            badge={{ text: 'Received', variant: 'success' }}
          />

          {/* Outstanding Balance: ₹4,000 */}
          <SummaryCard
            title="Outstanding Balance"
            hindiTitle="बाकी पैसा"
            value="₹4,000"
            subtitle="Pending to be settled"
            icon={Scale}
            highlight={true}
            badge={{ text: 'Due', variant: 'warning' }}
          />

          {/* Working Days: 20 */}
          <SummaryCard
            title="Working Days"
            hindiTitle="काम के दिन"
            value="20"
            subtitle="Recorded this month"
            icon={CalendarCheck}
            badge={{ text: '20 Days', variant: 'neutral' }}
          />
        </div>
      </div>

      {/* 3. Quick Actions Grid (Part D) */}
      <div>
        <SectionHeader
          title="Quick Actions"
          hindiTitle="त्वरित कार्य"
          description="Frequently performed workday logging and financial tasks"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Add New Job */}
          <QuickActionCard
            to="/jobs"
            title="Add New Job"
            hindiTitle="नया काम जोड़ें"
            description="Create a new worksite or employer record with daily rate"
            icon={PlusCircle}
            variant="default"
          />

          {/* Record Workday */}
          <QuickActionCard
            to="/daily-hisaab"
            title="Record Workday"
            hindiTitle="दैनिक हाजिरी भरें"
            description="Log full day, half day, or overtime attendance"
            icon={CalendarCheck}
            variant="primary"
          />

          {/* Add Payment */}
          <QuickActionCard
            to="/payments"
            title="Add Payment"
            hindiTitle="खर्चा या भुगतान जोड़ें"
            description="Record cash advance (kharcha) or contractor payout"
            icon={Wallet}
            variant="default"
          />

          {/* Check Wage */}
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

      {/* 4. Active Jobs & Confirmation Overview (Side-by-Side Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Jobs (2 Columns on Desktop) */}
        <div className="lg:col-span-2 space-y-4">
          <SectionHeader
            title="Active Jobs"
            hindiTitle="चालू काम"
            description="Ongoing sites and agreed daily wage rates"
            action={
              <Link
                to="/jobs"
                className="text-xs font-semibold text-forest hover:text-forest-dark inline-flex items-center gap-1 group"
              >
                <span>View All Jobs</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeJobs.map((job) => (
              <ActiveJobCard key={job.id} job={job} />
            ))}
          </div>
        </div>

        {/* Confirmation Overview (1 Column on Desktop) */}
        <div className="space-y-4">
          <SectionHeader
            title="Confirmations"
            hindiTitle="सत्यापन स्थिति"
            description="Status of contractor responses"
          />

          <ConfirmationOverview
            confirmedCount={10}
            disputedCount={2}
            pendingCount={3}
          />
        </div>
      </div>

      {/* 5. Recent Activity Section (Part D) */}
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

        <ActivityTable activities={recentActivities} />
      </div>

      {/* 6. Minimum Wage Awareness Card (Part D) */}
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
