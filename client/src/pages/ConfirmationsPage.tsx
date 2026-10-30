import React from 'react';
import { PlaceholderCard } from '../components/common/PlaceholderCard';
import { CheckCheck } from 'lucide-react';

export const ConfirmationsPage: React.FC = () => {
  return (
    <PlaceholderCard
      title="Contractor Confirmations"
      hindiTitle="ठेकेदार सत्यापन"
      route="/confirmations"
      description="Generate secure, tamper-evident verification links to share with your thekedar (contractor) via WhatsApp. Contractors can confirm all entries or dispute specific dates without creating an account."
      icon={CheckCheck}
      phaseNumber={3}
    />
  );
};
