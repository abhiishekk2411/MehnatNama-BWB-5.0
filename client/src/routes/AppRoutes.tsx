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

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
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
