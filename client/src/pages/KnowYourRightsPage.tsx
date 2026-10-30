import React from 'react';
import { PlaceholderCard } from '../components/common/PlaceholderCard';
import { BookOpen } from 'lucide-react';

export const KnowYourRightsPage: React.FC = () => {
  return (
    <PlaceholderCard
      title="Know Your Rights"
      hindiTitle="श्रमिक अधिकार"
      route="/know-your-rights"
      description="Legal awareness guide detailing rights under the Minimum Wages Act and Payment of Wages Act, practical steps for peaceful wage grievance resolution, and the official national toll-free helpline (14434)."
      icon={BookOpen}
      phaseNumber={4}
    />
  );
};
