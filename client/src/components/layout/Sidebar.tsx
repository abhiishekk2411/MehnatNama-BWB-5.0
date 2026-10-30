import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  CalendarCheck,
  Wallet,
  Scale,
  CheckCheck,
  FileText,
  BookOpen,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const navigationItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    hindiLabel: 'डैशबोर्ड',
    icon: LayoutDashboard,
  },
  {
    to: '/jobs',
    label: 'Jobs & Sites',
    hindiLabel: 'काम व साइट्स',
    icon: Briefcase,
  },
  {
    to: '/daily-hisaab',
    label: 'Daily Hisaab',
    hindiLabel: 'दैनिक हाजिरी',
    icon: CalendarCheck,
  },
  {
    to: '/payments',
    label: 'Payments & Advances',
    hindiLabel: 'खर्चा व भुगतान',
    icon: Wallet,
  },
  {
    to: '/wage-check',
    label: 'Wage Check',
    hindiLabel: 'न्यूनतम मजदूरी',
    icon: Scale,
  },
  {
    to: '/confirmations',
    label: 'Confirmations',
    hindiLabel: 'ठेकेदार सत्यापन',
    icon: CheckCheck,
  },
  {
    to: '/reports',
    label: 'Reports & PDF',
    hindiLabel: 'हिसाब पर्चा',
    icon: FileText,
  },
  {
    to: '/know-your-rights',
    label: 'Know Your Rights',
    hindiLabel: 'श्रमिक अधिकार',
    icon: BookOpen,
  },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-borderNeutral z-30">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        {/* Brand Header */}
        <div className="px-5 pb-5 border-b border-borderNeutral">
          <BrandLogo size="md" showTagline={true} />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 mt-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-forest-50 text-forest border border-forest-200/80 shadow-subtle'
                      : 'text-charcoalMuted hover:bg-surface hover:text-charcoal'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive ? 'text-forest' : 'text-charcoalSubtle group-hover:text-charcoalMuted'
                      }`}
                    />
                    <div className="truncate">
                      <span className="block leading-snug">{item.label}</span>
                      <span className="text-[10px] text-charcoalSubtle block font-normal">
                        {item.hindiLabel}
                      </span>
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Brand Tagline in Sidebar Footer */}
        <div className="px-5 pt-4 border-t border-borderNeutral">
          <div className="rounded-xl bg-surface p-3 text-center border border-borderNeutral">
            <p className="text-[11px] font-semibold text-forest">MehnatNama</p>
            <p className="text-[10px] text-charcoalSubtle mt-0.5">
              Har din ka kaam. Har rupaye ka hisaab.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
