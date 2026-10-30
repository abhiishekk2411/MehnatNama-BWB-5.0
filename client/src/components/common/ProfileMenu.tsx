import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown, ShieldCheck, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ProfileMenuProps {
  workerName?: string;
  workerPhone?: string;
  workerId?: string;
  className?: string;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  workerName = 'Ramesh Kumar',
  workerPhone = '+91 98765 43210',
  workerId = 'MN-2026-7890',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-ink-primary hover:bg-surface border border-transparent hover:border-borderNeutral transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-forest"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Worker Profile Menu"
      >
        {/* Worker Avatar with Initials */}
        <div className="h-8 w-8 rounded-full bg-forest text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-subtle ring-2 ring-forest-soft">
          <span>RK</span>
        </div>

        {/* Worker Name (hidden on small mobile) */}
        <div className="hidden sm:flex flex-col text-left leading-tight">
          <span className="text-xs font-semibold text-ink-primary truncate max-w-[120px]">
            {workerName}
          </span>
          <span className="text-[10px] text-ink-secondary">
            Verified Worker
          </span>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-ink-secondary transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-forest' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl bg-white p-2 shadow-dropdown border border-borderNeutral z-50 animate-in fade-in zoom-in-95 duration-150"
          role="menu"
          aria-orientation="vertical"
        >
          {/* Header Worker Profile Block */}
          <div className="px-3 py-3 rounded-xl bg-surface border border-borderNeutral/60 mb-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink-primary">
                {workerName}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-forest bg-forest-soft px-1.5 py-0.5 rounded-md">
                <Check className="h-2.5 w-2.5" />
                Active
              </span>
            </div>
            <p className="text-[11px] text-ink-secondary font-mono mt-0.5">
              {workerPhone}
            </p>
            <div className="mt-2 pt-2 border-t border-borderNeutral/80 flex items-center justify-between text-[10px] text-ink-muted">
              <span>Worker ID:</span>
              <span className="font-mono font-medium text-ink-secondary">{workerId}</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5 text-xs text-ink-primary">
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-forest-soft/70 hover:text-forest transition-colors"
              role="menuitem"
            >
              <User className="h-4 w-4 text-forest" />
              <div>
                <span className="font-medium block">Worker Profile</span>
                <span className="text-[10px] text-ink-secondary block font-hindi">
                  श्रमिक प्रोफाइल
                </span>
              </div>
            </Link>

            <Link
              to="/know-your-rights"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-forest-soft/70 hover:text-forest transition-colors"
              role="menuitem"
            >
              <ShieldCheck className="h-4 w-4 text-forest" />
              <div>
                <span className="font-medium block">Wage Rights & Help</span>
                <span className="text-[10px] text-ink-secondary block font-hindi">
                  श्रमिक अधिकार व सहायता
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                alert('Settings configured for MehnatNama v1.0');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-forest-soft/70 hover:text-forest transition-colors text-left"
              role="menuitem"
            >
              <Settings className="h-4 w-4 text-ink-secondary" />
              <div>
                <span className="font-medium block">App Settings</span>
                <span className="text-[10px] text-ink-secondary block font-hindi">
                  सेटिंग्स
                </span>
              </div>
            </button>
          </div>

          {/* Sign Out / Reset session */}
          <div className="mt-1 pt-1 border-t border-borderNeutral">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                window.location.href = '/dashboard';
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-status-danger hover:bg-red-50 transition-colors text-left text-xs font-medium cursor-pointer"
              role="menuitem"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out (लॉग आउट)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
