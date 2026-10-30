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
  Settings,
  HelpCircle,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export interface NavigationItem {
  to: string;
  label: string;
  hindiLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const mainNavItems: NavigationItem[] = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    hindiLabel: 'डैशबोर्ड',
    icon: LayoutDashboard,
  },
  {
    to: '/jobs',
    label: 'My Jobs',
    hindiLabel: 'मेरे काम',
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
    label: 'Minimum Wage Check',
    hindiLabel: 'न्यूनतम मजदूरी जांच',
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
    label: 'My Reports',
    hindiLabel: 'हिसाब पर्चा',
    icon: FileText,
  },
];

export const supportNavItems: NavigationItem[] = [
  {
    to: '/know-your-rights',
    label: 'Know Your Rights',
    hindiLabel: 'श्रमिक अधिकार',
    icon: BookOpen,
  },
];

// Backwards compatibility export
export const navigationItems = [...mainNavItems, ...supportNavItems];

export interface SidebarProps {
  collapsed?: boolean;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  className = '',
}) => {
  return (
    <aside
      className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-borderNeutral z-30 transition-all duration-300 ${
        collapsed ? 'lg:w-20' : 'lg:w-64'
      } ${className}`}
    >
      <div className="flex flex-col flex-grow pt-4 pb-4 overflow-y-auto custom-scrollbar">
        {/* Brand Header */}
        <div className={`pb-4 border-b border-borderNeutral ${collapsed ? 'px-3 flex justify-center' : 'px-5'}`}>
          <NavLink to="/dashboard" aria-label="MehnatNama Dashboard">
            <BrandLogo size="md" showTagline={!collapsed} collapsed={collapsed} />
          </NavLink>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-3 space-y-6 mt-4">
          {/* Main Navigation */}
          <div>
            {!collapsed && (
              <span className="px-3 text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-2">
                Main Menu (मुख्य मेनू)
              </span>
            )}
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={collapsed ? `${item.label} (${item.hindiLabel})` : undefined}
                    className={({ isActive }) =>
                      `group flex items-center rounded-xl transition-all duration-150 ${
                        collapsed
                          ? 'justify-center p-2.5 text-center'
                          : 'gap-3 px-3 py-2.5 text-xs font-semibold'
                      } ${
                        isActive
                          ? 'bg-forest text-white shadow-subtle'
                          : 'text-ink-secondary hover:bg-forest-soft/70 hover:text-forest'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                            isActive ? 'text-white' : 'text-ink-secondary group-hover:text-forest'
                          }`}
                        />
                        {!collapsed && (
                          <div className="truncate">
                            <span className="block leading-snug">{item.label}</span>
                            <span
                              className={`text-[10px] block font-normal font-hindi ${
                                isActive ? 'text-forest-100' : 'text-ink-muted group-hover:text-forest-dark'
                              }`}
                            >
                              {item.hindiLabel}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Support Section */}
          <div className="pt-2 border-t border-borderNeutral/60">
            {!collapsed && (
              <span className="px-3 text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-2">
                Support & Help (सहायता)
              </span>
            )}
            <nav className="space-y-1">
              {supportNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={collapsed ? `${item.label} (${item.hindiLabel})` : undefined}
                    className={({ isActive }) =>
                      `group flex items-center rounded-xl transition-all duration-150 ${
                        collapsed
                          ? 'justify-center p-2.5 text-center'
                          : 'gap-3 px-3 py-2.5 text-xs font-semibold'
                      } ${
                        isActive
                          ? 'bg-forest text-white shadow-subtle'
                          : 'text-ink-secondary hover:bg-forest-soft/70 hover:text-forest'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                            isActive ? 'text-white' : 'text-ink-secondary group-hover:text-forest'
                          }`}
                        />
                        {!collapsed && (
                          <div className="truncate">
                            <span className="block leading-snug">{item.label}</span>
                            <span
                              className={`text-[10px] block font-normal font-hindi ${
                                isActive ? 'text-forest-100' : 'text-ink-muted group-hover:text-forest-dark'
                              }`}
                            >
                              {item.hindiLabel}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}

              {/* Settings Action Item */}
              <NavLink
                to="/settings"
                title={collapsed ? 'Settings (सेटिंग्स)' : undefined}
                className={({ isActive }) =>
                  `w-full group flex items-center rounded-xl transition-all duration-150 ${
                    collapsed
                      ? 'justify-center p-2.5 text-center'
                      : 'gap-3 px-3 py-2.5 text-xs font-semibold'
                  } ${
                    isActive
                      ? 'bg-forest text-white shadow-subtle'
                      : 'text-ink-secondary hover:bg-forest-soft/70 hover:text-forest'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Settings
                      className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-ink-secondary group-hover:text-forest'
                      }`}
                    />
                    {!collapsed && (
                      <div className="truncate">
                        <span className="block leading-snug">Settings</span>
                        <span
                          className={`text-[10px] block font-normal font-hindi ${
                            isActive ? 'text-forest-100' : 'text-ink-muted group-hover:text-forest-dark'
                          }`}
                        >
                          सेटिंग्स
                        </span>
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        {!collapsed && (
          <div className="px-4 pt-3 border-t border-borderNeutral">
            <div className="rounded-xl bg-surface p-3 text-center border border-borderNeutral/70">
              <p className="text-[11px] font-bold text-forest">MehnatNama (मेहनतनामा)</p>
              <p className="text-[10px] text-ink-secondary mt-0.5 leading-snug">
                Har din ka kaam. Har rupaye ka hisaab.
              </p>
              <div className="mt-2 pt-2 border-t border-borderNeutral flex items-center justify-center gap-1.5 text-[10px] text-ink-muted">
                <HelpCircle className="h-3 w-3 text-forest" />
                <span>Helpline: 14434</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
