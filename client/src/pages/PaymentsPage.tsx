import React from 'react';
import { PlaceholderCard } from '../components/common/PlaceholderCard';
import { Wallet } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  return (
    <PlaceholderCard
      title="Payments & Advances"
      hindiTitle="खर्चा व भुगतान"
      route="/payments"
      description="Track cash advances ('kharcha' for groceries, travel, medicine) and partial or final settlements received from the contractor, tagging payment modes (Cash, UPI, Direct Bank Transfer)."
      icon={Wallet}
      phaseNumber={2}
    />
  );
};
