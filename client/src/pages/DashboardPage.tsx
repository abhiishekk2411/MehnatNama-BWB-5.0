import React from 'react';
import { PlaceholderCard } from '../components/common/PlaceholderCard';
import { LayoutDashboard } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <PlaceholderCard
      title="Dashboard"
      hindiTitle="डैशबोर्ड"
      route="/dashboard"
      description="The central command center providing an executive summary of Total Earned (कुल कमाई), Advances/Kharcha Received (मिला हुआ पैसा), and Net Balance Due (बाकी पैसा), along with recent activity and quick actions."
      icon={LayoutDashboard}
      phaseNumber={2}
    />
  );
};
