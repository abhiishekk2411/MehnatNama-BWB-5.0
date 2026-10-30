import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Languages,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from 'lucide-react';
import { ProfileMenu } from '../common/ProfileMenu';
import { useLanguage } from '../../context/LanguageContext';

export interface TopbarProps {
  onToggleMobileMenu: () => void;
  desktopCollapsed?: boolean;
  onToggleDesktopCollapse?: () => void;
  className?: string;
}

// Route titles map for breadcrumbs
const routeTitleMap: Record<string, { title: string; hindi: string }> = {
  '/': { title: 'Home', hindi: 'होम' },
  '/dashboard': { title: 'Dashboard', hindi: 'डैशबोर्ड' },
  '/jobs': { title: 'My Jobs & Sites', hindi: 'मेरे काम व साइट्स' },
  '/daily-hisaab': { title: 'Daily Hisaab', hindi: 'दैनिक हाजिरी' },
  '/payments': { title: 'Payments & Advances', hindi: 'खर्चा व भुगतान' },
  '/wage-check': { title: 'Minimum Wage Check', hindi: 'न्यूनतम मजदूरी जांच' },
  '/confirmations': { title: 'Contractor Confirmations', hindi: 'ठेकेदार सत्यापन' },
  '/reports': { title: 'My Reports & PDF', hindi: 'हिसाब पर्चा' },
  '/know-your-rights': { title: 'Know Your Rights', hindi: 'श्रमिक अधिकार' },
  '/settings': { title: 'Settings', hindi: 'सेटिंग्स व रिमाइंडर' },
};

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileMenu,
  desktopCollapsed = false,
  onToggleDesktopCollapse,
  className = '',
}) => {
  const location = useLocation();
  const current = routeTitleMap[location.pathname] || {
    title: 'MehnatNama',
    hindi: 'मेहनतनामा',
  };

  const { language, setLanguage } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Notifications state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-borderNeutral px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-200 ${className}`}
    >
      {/* Left: Mobile Toggle & Desktop Sidebar Toggle & Breadcrumb Title */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-ink-primary hover:bg-surface border border-transparent hover:border-borderNeutral transition-colors focus:outline-none"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5 text-ink-primary" />
        </button>

        {/* Desktop Sidebar Toggle Button */}
        {onToggleDesktopCollapse && (
          <button
            type="button"
            onClick={onToggleDesktopCollapse}
            className="hidden lg:flex p-1.5 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface border border-transparent hover:border-borderNeutral transition-colors"
            title={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar width"
          >
            {desktopCollapsed ? (
              <PanelLeftOpen className="h-4.5 w-4.5" />
            ) : (
              <PanelLeftClose className="h-4.5 w-4.5" />
            )}
          </button>
        )}

        {/* Page Breadcrumb Title */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <h1 className="text-sm sm:text-base font-bold text-ink-primary tracking-tight">
              {current.title}
            </h1>
            <span className="text-xs font-semibold text-forest font-hindi hidden xs:inline">
              • {current.hindi}
            </span>
          </div>
          <span className="text-[10px] text-ink-secondary hidden sm:inline">
            MehnatNama Platform
          </span>
        </div>
      </div>

      {/* Right: Language Selector, Notifications & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Language Selector Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-ink-primary bg-surface hover:bg-forest-soft/70 border border-borderNeutral transition-colors cursor-pointer"
            aria-label="Change language"
          >
            <Languages className="h-4 w-4 text-forest" />
            <span className="font-semibold">{language === 'hi' ? 'हिंदी' : 'English'}</span>
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white p-1.5 shadow-dropdown border border-borderNeutral z-50">
              <button
                type="button"
                onClick={() => {
                  setLanguage('hi');
                  setLangMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  language === 'hi'
                    ? 'bg-forest-soft text-forest font-bold'
                    : 'text-ink-primary hover:bg-surface'
                }`}
              >
                <span>हिंदी (Hindi)</span>
                {language === 'hi' && <Check className="h-3.5 w-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setLanguage('en');
                  setLangMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-forest-soft text-forest font-bold'
                    : 'text-ink-primary hover:bg-surface'
                }`}
              >
                <span>English</span>
                {language === 'en' && <Check className="h-3.5 w-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon with Indicator */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface border border-transparent hover:border-borderNeutral transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {/* Unread indicator */}
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-status-danger ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white p-3 shadow-dropdown border border-borderNeutral z-50">
              <div className="flex items-center justify-between pb-2 border-b border-borderNeutral">
                <span className="text-xs font-bold text-ink-primary">
                  Notifications (सूचनाएं)
                </span>
                <span className="text-[10px] bg-forest-soft text-forest font-bold px-1.5 py-0.5 rounded-full">
                  2 New
                </span>
              </div>
              <div className="mt-2 space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-forest-soft/50 border border-forest-200/50">
                  <p className="font-semibold text-ink-primary">
                    Contractor Confirmation
                  </p>
                  <p className="text-[11px] text-ink-secondary mt-0.5">
                    Rajesh Kumar confirmed attendance for 22 Oct.
                  </p>
                  <span className="text-[10px] text-forest font-medium mt-1 block">
                    10 minutes ago
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50/50 border border-amber-200/50">
                  <p className="font-semibold text-ink-primary">
                    Wage Check Reminder
                  </p>
                  <p className="text-[11px] text-ink-secondary mt-0.5">
                    Compare your current daily wage with official notified benchmarks.
                  </p>
                  <span className="text-[10px] text-amber-700 font-medium mt-1 block">
                    Yesterday
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings Action */}
        <Link
          to="/settings"
          className="p-2 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface border border-transparent hover:border-borderNeutral transition-colors"
          title="Settings & Preferences (सेटिंग्स)"
          aria-label="Settings"
        >
          <Settings className="h-4.5 w-4.5" />
        </Link>

        {/* Worker Profile Dropdown */}
        <ProfileMenu />
      </div>
    </header>
  );
};
