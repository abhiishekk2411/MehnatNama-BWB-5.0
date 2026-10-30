import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { DashboardPage } from '../pages/DashboardPage';
import { JobsPage } from '../pages/JobsPage';
import { DailyHisaabPage } from '../pages/DailyHisaabPage';
import { PaymentsPage } from '../pages/PaymentsPage';
import { WageCheckPage } from '../pages/WageCheckPage';
import { ConfirmationsPage } from '../pages/ConfirmationsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { KnowYourRightsPage } from '../pages/KnowYourRightsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

import { ContractorConfirmPage } from '../pages/public/ContractorConfirmPage';
import { PublicSharedReportPage } from '../pages/public/PublicSharedReportPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Standalone Portals (Zero-Login) */}
      <Route path="/contractor/confirm/:token" element={<ContractorConfirmPage />} />
      <Route path="/shared/report/:token" element={<PublicSharedReportPage />} />

      {/* Main Authenticated Application */}
      <Route path="/" element={<AppLayout />}>
        {/* Core application routes */}
        <Route index element={<HomePage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="daily-hisaab" element={<DailyHisaabPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="wage-check" element={<WageCheckPage />} />
        <Route path="confirmations" element={<ConfirmationsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="know-your-rights" element={<KnowYourRightsPage />} />

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
