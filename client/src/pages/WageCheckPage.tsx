import React from 'react';
import { PlaceholderCard } from '../components/common/PlaceholderCard';
import { Scale } from 'lucide-react';

export const WageCheckPage: React.FC = () => {
  return (
    <PlaceholderCard
      title="Minimum Wage Check"
      hindiTitle="न्यूनतम मजदूरी"
      route="/wage-check"
      description="Compare agreed wages against officially published government gazette minimum wage benchmarks for your state and skill level (Unskilled, Semi-Skilled, Skilled) with citation references."
      icon={Scale}
      phaseNumber={4}
    />
  );
};
