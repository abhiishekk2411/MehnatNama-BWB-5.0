import React from 'react';
import { PlaceholderCard } from '../components/common/PlaceholderCard';
import { FileText } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  return (
    <PlaceholderCard
      title="Reports & PDF Statement"
      hindiTitle="हिसाब पर्चा"
      route="/reports"
      description="Download and print clean, organized PDF MehnatNama Statements summarizing full attendance timesheets, payments, contractor verification timestamps, and physical signature endorsement sections."
      icon={FileText}
      phaseNumber={5}
    />
  );
};
