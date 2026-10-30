import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Sidebar, navigationItems } from './Sidebar';
import { Header } from './Header';
import { BrandLogo } from '../common/BrandLogo';
import { X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row text-charcoal">
      {/* Mobile Top Header */}
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Desktop Persistent Sidebar */}
      <Sidebar />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-xs">
          <div className="bg-white w-4/5 max-w-xs h-full p-5 flex flex-col justify-between shadow-lifted">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-borderNeutral">
                <BrandLogo size="sm" showTagline={false} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-charcoalMuted hover:text-charcoal"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1 mt-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive
                            ? 'bg-forest-50 text-forest border border-forest-200'
                            : 'text-charcoalMuted hover:bg-surface'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <div>
                        <span>{item.label}</span>
                        <span className="text-[10px] text-charcoalSubtle block font-normal">
                          {item.hindiLabel}
                        </span>
                      </div>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-borderNeutral text-center text-[11px] text-charcoalSubtle">
              Har din ka kaam. Har rupaye ka hisaab.
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
