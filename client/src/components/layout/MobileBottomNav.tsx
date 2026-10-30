import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, Wallet, CheckCheck, Scale } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const MobileBottomNav: React.FC = () => {
  const { t } = useLanguage();

  const items = [
    {
      to: '/dashboard',
      label: t.nav.dashboard,
      icon: LayoutDashboard,
    },
    {
      to: '/daily-hisaab',
      label: t.nav.dailyHisaab,
      icon: CalendarCheck,
    },
    {
      to: '/payments',
      label: t.nav.payments,
      icon: Wallet,
    },
    {
      to: '/wage-check',
      label: t.nav.wageCheck,
      icon: Scale,
    },
    {
      to: '/confirmations',
      label: t.nav.confirmations,
      icon: CheckCheck,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-40 px-2 py-1 flex items-center justify-around shadow-lg"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2 min-w-[56px] rounded-xl transition-all ${
                isActive
                  ? 'text-forest-primary font-bold dark:text-forest-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1 rounded-lg transition-transform ${
                    isActive ? 'scale-110 bg-forest-50 dark:bg-forest-900/50' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 max-w-[62px] truncate text-center">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};
