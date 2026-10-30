import React from 'react';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-borderNeutral px-4 py-3 flex items-center justify-between shadow-subtle">
      <BrandLogo size="sm" showTagline={false} />

      <button
        type="button"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="p-2 rounded-xl text-charcoal hover:bg-surface focus:outline-none"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </header>
  );
};
