import React from 'react';
import { PlaceholderCard } from '../components/common/PlaceholderCard';
import { CalendarCheck } from 'lucide-react';

export const DailyHisaabPage: React.FC = () => {
  return (
    <PlaceholderCard
      title="Daily Hisaab"
      hindiTitle="दैनिक हाजिरी"
      route="/daily-hisaab"
      description="Quick 15-second daily attendance logger. Record Full-Day (पूरा दिन), Half-Day (आधा दिन), Overtime (अतिरिक्त समय), or Absent (छुट्टी) with task notes, computing daily wages immediately."
      icon={CalendarCheck}
      phaseNumber={2}
    />
  );
};
