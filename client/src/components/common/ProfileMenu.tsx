import React, { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown, ShieldCheck, Check, Edit3, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export interface ProfileMenuProps {
  className?: string;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ className = '' }) => {
  const { user, profile, updateProfile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.fullName || 'Ramesh Kumar');
  const [workerType, setWorkerType] = useState(profile?.workerType || 'CONSTRUCTION');
  const [skillLevel, setSkillLevel] = useState<'UNSKILLED' | 'SEMI_SKILLED' | 'SKILLED' | 'HIGHLY_SKILLED'>(
    profile?.skillLevel || 'SKILLED'
  );
  const [isSaving, setIsSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setWorkerType(profile.workerType);
      setSkillLevel(profile.skillLevel);
    }
  }, [profile]);

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

  const displayName = profile?.fullName || user?.phone || 'Ramesh Kumar';
  const displayPhone = user?.phone ? `+91 ${user.phone}` : '+91 98765 43210';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        fullName,
        workerType,
        skillLevel,
      });
      setIsEditing(false);
      setIsOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
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
            <span>{initials}</span>
          </div>

          {/* Worker Name (hidden on small mobile) */}
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-xs font-semibold text-ink-primary truncate max-w-[120px]">
              {displayName}
            </span>
            <span className="text-[10px] text-ink-secondary">
              {profile?.skillLevel || 'Verified Worker'}
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
                <span className="text-xs font-bold text-ink-primary truncate max-w-[150px]">
                  {displayName}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-forest bg-forest-soft px-1.5 py-0.5 rounded-md">
                  <Check className="h-2.5 w-2.5" />
                  Active
                </span>
              </div>
              <p className="text-[11px] text-ink-secondary font-mono mt-0.5">
                {displayPhone}
              </p>
              <div className="mt-2 pt-2 border-t border-borderNeutral/80 flex items-center justify-between text-[10px] text-ink-muted">
                <span>Skill Level:</span>
                <span className="font-medium text-forest">{profile?.skillLevel || 'SKILLED'}</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-0.5 text-xs text-ink-primary">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsEditing(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-forest-soft/70 hover:text-forest transition-colors text-left"
                role="menuitem"
              >
                <Edit3 className="h-4 w-4 text-forest" />
                <div>
                  <span className="font-medium block">Edit Worker Profile</span>
                  <span className="text-[10px] text-ink-secondary block font-hindi">
                    प्रोफाइल संपादित करें
                  </span>
                </div>
              </button>

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
            </div>

            {/* Sign Out / Reset session */}
            <div className="mt-1 pt-1 border-t border-borderNeutral">
              <button
                type="button"
                onClick={async () => {
                  setIsOpen(false);
                  await logout();
                  window.location.reload();
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

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-ink-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-lifted border border-borderNeutral space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-borderNeutral">
              <div>
                <h3 className="text-base font-bold text-ink-primary">Edit Worker Profile</h3>
                <p className="text-xs text-forest font-hindi">श्रमिक प्रोफाइल अपडेट करें</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-ink-secondary hover:bg-surface"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-ink-primary mb-1">
                  Full Name (पूरा नाम)
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-borderNeutral px-3 py-2 text-sm focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-primary mb-1">
                  Primary Trade / Category (काम का प्रकार)
                </label>
                <input
                  type="text"
                  value={workerType}
                  onChange={(e) => setWorkerType(e.target.value)}
                  placeholder="e.g. Construction, Mason, Agriculture"
                  className="w-full rounded-xl border border-borderNeutral px-3 py-2 text-sm focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink-primary mb-1">
                  Skill Level (कौशल स्तर)
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as any)}
                  className="w-full rounded-xl border border-borderNeutral px-3 py-2 text-sm focus:border-forest focus:outline-none bg-white"
                >
                  <option value="UNSKILLED">Unskilled (अकुशल)</option>
                  <option value="SEMI_SKILLED">Semi-Skilled (अर्ध-कुशल)</option>
                  <option value="SKILLED">Skilled (कुशल / कारीगर)</option>
                  <option value="HIGHLY_SKILLED">Highly Skilled (उच्च कुशल)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
