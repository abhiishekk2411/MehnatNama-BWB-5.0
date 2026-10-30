import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/common/BrandLogo';
import { navigationItems } from '../components/layout/Sidebar';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-8 py-4">
      {/* Hero Welcome Card */}
      <div className="card bg-white border-borderNeutral p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <BrandLogo size="lg" showTagline={false} />
          <span className="badge-forest text-xs font-semibold self-start sm:self-auto">
            Version 1.0 Initialised
          </span>
        </div>

        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight mt-2">
            Har din ka kaam. Har rupaye ka hisaab.
          </h1>
          <p className="text-sm sm:text-base text-charcoalMuted mt-2 leading-relaxed">
            MehnatNama (मेहनतनामा) is a worker-first digital wage diary and wage-rights awareness platform designed for daily-wage and informal workers across India.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link to="/dashboard" className="btn-primary">
            <span>Open Dashboard (डैशबोर्ड खोलें)</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/know-your-rights" className="btn-secondary">
            <span>Know Your Rights (श्रमिक अधिकार)</span>
          </Link>
        </div>
      </div>

      {/* Core Modules Grid */}
      <div>
        <h2 className="text-base font-bold text-charcoal mb-4">
          MehnatNama Core Application Modules (प्लेटफॉर्म मॉडयूल)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="card-hover p-4 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-10 w-10 rounded-xl bg-forest-50 text-forest flex items-center justify-center mb-3 group-hover:bg-forest group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-charcoal group-hover:text-forest transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-xs text-forest font-medium mt-0.5">
                    {item.hindiLabel}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-borderNeutral flex items-center justify-between text-[11px] text-charcoalSubtle">
                  <span>View Route</span>
                  <ArrowRight className="h-3.5 w-3.5 text-forest group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Trust & Principles Strip */}
      <div className="rounded-2xl bg-forest-50/70 border border-forest-200/60 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-forest shrink-0" />
          <div>
            <p className="text-xs font-bold text-charcoal">
              Contemporaneous & Verified Record Keeping
            </p>
            <p className="text-xs text-charcoalMuted mt-0.5">
              Empowering informal workers with immutable contemporaneous evidence and statutory minimum wage clarity.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-forest shrink-0">
          <CheckCircle2 className="h-4 w-4" />
          <span>Clean Architecture</span>
        </div>
      </div>
    </div>
  );
};
