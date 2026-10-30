import React from 'react';
import { PlaceholderCard } from '../components/common/PlaceholderCard';
import { Briefcase } from 'lucide-react';

export const JobsPage: React.FC = () => {
  return (
    <PlaceholderCard
      title="Jobs & Workplaces"
      hindiTitle="काम व साइट्स"
      route="/jobs"
      description="Create, view, and manage distinct construction sites, agricultural fields, or contracting projects. Configure agreed daily wages (₹), standard workday hours, and contractor contact details."
      icon={Briefcase}
      phaseNumber={2}
    />
  );
};
