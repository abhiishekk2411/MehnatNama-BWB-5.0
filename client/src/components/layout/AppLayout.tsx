import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Sidebar, mainNavItems, supportNavItems } from './Sidebar';
import { Topbar } from './Topbar';
import { BrandLogo } from '../common/BrandLogo';
import { X, HelpCircle, Settings } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col text-ink-primary font-sans">
      {/* Desktop Persistent Sidebar */}
      <Sidebar collapsed={desktopCollapsed} />

      {/* Mobile Drawer Backdrop & Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-ink-primary/40 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-white w-4/5 max-w-xs h-full p-5 flex flex-col justify-between shadow-lifted animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto custom-scrollbar">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-borderNeutral">
                <BrandLogo size="sm" showTagline={false} />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-ink-secondary hover:text-ink-primary hover:bg-surface border border-transparent"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Main Menu Links */}
              <div className="mt-4">
                <span className="px-3 text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-2">
                  Main Navigation (मुख्य मेनू)
                </span>
                <nav className="space-y-1">
                  {mainNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                            isActive
                              ? 'bg-forest text-white shadow-subtle'
                              : 'text-ink-secondary hover:bg-forest-soft/70 hover:text-forest'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              className={`h-4.5 w-4.5 shrink-0 ${
                                isActive ? 'text-white' : 'text-ink-secondary'
                              }`}
                            />
                            <div>
                              <span>{item.label}</span>
                              <span
                                className={`text-[10px] block font-normal font-hindi ${
                                  isActive ? 'text-forest-100' : 'text-ink-muted'
                                }`}
                              >
                                {item.hindiLabel}
                              </span>
                            </div>
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              {/* Support Menu Links */}
              <div className="mt-5 pt-3 border-t border-borderNeutral">
                <span className="px-3 text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-2">
                  Support (सहायता)
                </span>
                <nav className="space-y-1">
                  {supportNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                            isActive
                              ? 'bg-forest text-white shadow-subtle'
                              : 'text-ink-secondary hover:bg-forest-soft/70 hover:text-forest'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              className={`h-4.5 w-4.5 shrink-0 ${
                                isActive ? 'text-white' : 'text-ink-secondary'
                              }`}
                            />
                            <div>
                              <span>{item.label}</span>
                              <span
                                className={`text-[10px] block font-normal font-hindi ${
                                  isActive ? 'text-forest-100' : 'text-ink-muted'
                                }`}
                              >
                                {item.hindiLabel}
                              </span>
                            </div>
                          </>
                        )}
                      </NavLink>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      alert('Settings configuration view');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-ink-secondary hover:bg-forest-soft/70 hover:text-forest text-left"
                  >
                    <Settings className="h-4.5 w-4.5 shrink-0 text-ink-secondary" />
                    <div>
                      <span>Settings</span>
                      <span className="text-[10px] block font-normal font-hindi text-ink-muted">
                        सेटिंग्स
                      </span>
                    </div>
                  </button>
                </nav>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-borderNeutral text-center space-y-1">
              <p className="text-[11px] font-semibold text-forest">
                MehnatNama • मेहनतनामा
              </p>
              <p className="text-[10px] text-ink-secondary">
                Har din ka kaam. Har rupaye ka hisaab.
              </p>
              <div className="pt-1 flex items-center justify-center gap-1 text-[10px] text-ink-muted">
                <HelpCircle className="h-3 w-3 text-forest" />
                <span>Helpline: 14434</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Area: Topbar + Page Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          desktopCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Topbar */}
        <Topbar
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          desktopCollapsed={desktopCollapsed}
          onToggleDesktopCollapse={() => setDesktopCollapsed(!desktopCollapsed)}
        />

        {/* Dynamic Page Outlet */}
        <main className="flex-1 pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
