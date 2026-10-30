import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/common/PageContainer';
import { BrandLogo } from '../components/common/BrandLogo';
import { mainNavItems } from '../components/layout/Sidebar';
import { ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Scale } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <PageContainer maxWidth="xl" className="space-y-8 py-2">
      {/* Hero Welcome Card */}
      <div className="card-base bg-white p-6 sm:p-8 space-y-5 border-borderNeutral/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <BrandLogo size="lg" showTagline={false} />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-soft text-forest text-xs font-semibold border border-forest-200 self-start sm:self-auto">
            <Sparkles className="h-3.5 w-3.5" />
            Phase 2 Design System Active
          </span>
        </div>

        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight mt-1">
            Har din ka kaam. Har rupaye ka hisaab.
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary mt-2 leading-relaxed">
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
          <Link to="/wage-check" className="btn-ghost">
            <Scale className="h-4 w-4 text-forest" />
            <span>Check Minimum Wage</span>
          </Link>
        </div>
      </div>

      {/* Core Modules Grid */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-bold text-ink-primary">
            Core Application Modules (प्लेटफॉर्म मॉडयूल)
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Designed for informal daily-wage labour tracking and rights awareness
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="card-base p-4 flex flex-col justify-between group hover:border-forest-200 hover:shadow-lifted hover:bg-forest-50/20 transition-all duration-200 cursor-pointer"
              >
                <div>
                  <div className="h-10 w-10 rounded-xl bg-forest-soft text-forest flex items-center justify-center mb-3 group-hover:bg-forest group-hover:text-white transition-colors duration-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-ink-primary group-hover:text-forest transition-colors duration-200">
                    {item.label}
                  </h3>
                  <p className="text-xs text-forest font-hindi mt-0.5">
                    {item.hindiLabel}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-borderNeutral/70 flex items-center justify-between text-[11px] text-ink-secondary">
                  <span>Explore Route</span>
                  <ArrowRight className="h-3.5 w-3.5 text-forest group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Trust & Principles Strip */}
      <div className="rounded-2xl bg-forest-soft/60 border border-forest-200/80 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-forest text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink-primary">
              Contemporaneous & Verified Record Keeping
            </p>
            <p className="text-xs text-ink-secondary mt-0.5">
              Empowering informal workers with immutable contemporaneous evidence and statutory minimum wage clarity.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-forest shrink-0 bg-white px-3 py-1.5 rounded-xl border border-forest-200/60 shadow-subtle">
          <CheckCircle2 className="h-4 w-4" />
          <span>Linear-Grade SaaS Design</span>
        </div>
      </div>
    </PageContainer>
  );
};
