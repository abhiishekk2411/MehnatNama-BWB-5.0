import React, { useState } from 'react';
import { Scale, ExternalLink, ShieldAlert } from 'lucide-react';

export const WageBenchmarksPage: React.FC = () => {
  const [selectedState, setSelectedState] = useState<'CENTRAL' | 'MH' | 'DL' | 'UP'>('MH');

  const benchmarksData = [
    // Central Sphere
    {
      stateCode: 'CENTRAL',
      sphere: 'CENTRAL',
      scheduledEmployment: 'Construction, Maintenance and Operation of Buildings',
      skillCategory: 'UNSKILLED (अकुशल मजदूर)',
      dailyWage: 783,
      effectiveDate: '01 Oct 2024',
      notificationRef: 'Order No. 1/16(1)/2024-LS-II (Area A)',
      authorityName: 'Office of the Chief Labour Commissioner (Central)',
      sourceUrl: 'https://clc.gov.in/clc/min-wages',
    },
    {
      stateCode: 'CENTRAL',
      sphere: 'CENTRAL',
      scheduledEmployment: 'Construction, Maintenance and Operation of Buildings',
      skillCategory: 'SEMI_SKILLED (अर्ध-कुशल मजदूर)',
      dailyWage: 868,
      effectiveDate: '01 Oct 2024',
      notificationRef: 'Order No. 1/16(1)/2024-LS-II (Area A)',
      authorityName: 'Office of the Chief Labour Commissioner (Central)',
      sourceUrl: 'https://clc.gov.in/clc/min-wages',
    },
    {
      stateCode: 'CENTRAL',
      sphere: 'CENTRAL',
      scheduledEmployment: 'Construction, Maintenance and Operation of Buildings',
      skillCategory: 'SKILLED (कुशल राजमिस्त्री / बढ़ई)',
      dailyWage: 954,
      effectiveDate: '01 Oct 2024',
      notificationRef: 'Order No. 1/16(1)/2024-LS-II (Area A)',
      authorityName: 'Office of the Chief Labour Commissioner (Central)',
      sourceUrl: 'https://clc.gov.in/clc/min-wages',
    },
    // Maharashtra
    {
      stateCode: 'MH',
      sphere: 'STATE',
      scheduledEmployment: 'Building and Construction Industry (Zone I)',
      skillCategory: 'UNSKILLED (अकुशल मजदूर)',
      dailyWage: 615,
      effectiveDate: '01 Jul 2024',
      notificationRef: 'MAH-CLA/MW/SPL/2024-07/Zone1',
      authorityName: 'Office of the Labour Commissioner, Maharashtra',
      sourceUrl: 'https://mahakamgar.maharashtra.gov.in',
    },
    {
      stateCode: 'MH',
      sphere: 'STATE',
      scheduledEmployment: 'Building and Construction Industry (Zone I)',
      skillCategory: 'SEMI_SKILLED (अर्ध-कुशल मजदूर / बेलदार)',
      dailyWage: 685,
      effectiveDate: '01 Jul 2024',
      notificationRef: 'MAH-CLA/MW/SPL/2024-07/Zone1',
      authorityName: 'Office of the Labour Commissioner, Maharashtra',
      sourceUrl: 'https://mahakamgar.maharashtra.gov.in',
    },
    {
      stateCode: 'MH',
      sphere: 'STATE',
      scheduledEmployment: 'Building and Construction Industry (Zone I)',
      skillCategory: 'SKILLED (कुशल कारीगर / मिस्त्री)',
      dailyWage: 760,
      effectiveDate: '01 Jul 2024',
      notificationRef: 'MAH-CLA/MW/SPL/2024-07/Zone1',
      authorityName: 'Office of the Labour Commissioner, Maharashtra',
      sourceUrl: 'https://mahakamgar.maharashtra.gov.in',
    },
    // Delhi
    {
      stateCode: 'DL',
      sphere: 'STATE',
      scheduledEmployment: 'All Scheduled Employments (Construction & Shops)',
      skillCategory: 'UNSKILLED (अकुशल मजदूर)',
      dailyWage: 673,
      effectiveDate: '01 Oct 2024',
      notificationRef: 'Order F.No. (12)/MW/170/Lab/2024/761',
      authorityName: 'Labour Department, Govt of NCT of Delhi',
      sourceUrl: 'https://labour.delhi.gov.in',
    },
    {
      stateCode: 'DL',
      sphere: 'STATE',
      scheduledEmployment: 'All Scheduled Employments (Construction & Shops)',
      skillCategory: 'SEMI_SKILLED (अर्ध-कुशल मजदूर)',
      dailyWage: 742,
      effectiveDate: '01 Oct 2024',
      notificationRef: 'Order F.No. (12)/MW/170/Lab/2024/761',
      authorityName: 'Labour Department, Govt of NCT of Delhi',
      sourceUrl: 'https://labour.delhi.gov.in',
    },
    {
      stateCode: 'DL',
      sphere: 'STATE',
      scheduledEmployment: 'All Scheduled Employments (Construction & Shops)',
      skillCategory: 'SKILLED (कुशल कारीगर)',
      dailyWage: 816,
      effectiveDate: '01 Oct 2024',
      notificationRef: 'Order F.No. (12)/MW/170/Lab/2024/761',
      authorityName: 'Labour Department, Govt of NCT of Delhi',
      sourceUrl: 'https://labour.delhi.gov.in',
    },
    // Uttar Pradesh
    {
      stateCode: 'UP',
      sphere: 'STATE',
      scheduledEmployment: 'Construction and Building Operations',
      skillCategory: 'UNSKILLED (अकुशल मजदूर)',
      dailyWage: 440,
      effectiveDate: '01 Oct 2024',
      notificationRef: 'UP-DLC/MW-Notif/2024-B',
      authorityName: 'Labour Commissioner Office, Uttar Pradesh',
      sourceUrl: 'https://uplabour.gov.in',
    },
    {
      stateCode: 'UP',
      sphere: 'STATE',
      scheduledEmployment: 'Construction and Building Operations',
      skillCategory: 'SKILLED (कुशल कारीगर)',
      dailyWage: 550,
      effectiveDate: '01 Oct 2024',
      notificationRef: 'UP-DLC/MW-Notif/2024-B',
      authorityName: 'Labour Commissioner Office, Uttar Pradesh',
      sourceUrl: 'https://uplabour.gov.in',
    },
  ];

  const filtered = benchmarksData.filter((b) => b.stateCode === selectedState);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Scale className="h-3.5 w-3.5" />
          <span>सरकारी गजट अधिसूचित दरें (Source-Backed Benchmarks)</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          सरकारी न्यूनतम मजदूरी (Minimum Wage Rates)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          आधिकारिक सरकारी गजट अधिसूचनाओं से संकलित प्रमाणित न्यूनतम मजदूरी दरें।
        </p>
      </div>

      {/* State Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedState('MH')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            selectedState === 'MH'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          महाराष्ट्र (Maharashtra)
        </button>
        <button
          onClick={() => setSelectedState('DL')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            selectedState === 'DL'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          दिल्ली (Delhi NCT)
        </button>
        <button
          onClick={() => setSelectedState('UP')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            selectedState === 'UP'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          उत्तर प्रदेश (Uttar Pradesh)
        </button>
        <button
          onClick={() => setSelectedState('CENTRAL')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            selectedState === 'CENTRAL'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          केंद्रीय क्षेत्र (Central Sphere / Railways / NHAI)
        </button>
      </div>

      {/* Rates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((item, idx) => (
          <div key={idx} className="card-hover flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-semibold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                  {item.sphere === 'CENTRAL' ? 'Central Gov' : 'State Gov'}
                </span>
                <span className="text-xs text-slate-400 font-medium">लागू तिथि: {item.effectiveDate}</span>
              </div>

              <div className="mt-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {item.skillCategory}
                </span>
                <div className="mt-1 text-3xl font-extrabold text-slate-900">
                  ₹{item.dailyWage}
                  <span className="text-xs font-medium text-slate-500 ml-1">/ दिन (8 घंटे)</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                  उद्योग: {item.scheduledEmployment}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <p className="truncate">
                <strong>अधिसूचना:</strong> {item.notificationRef}
              </p>
              <p className="truncate">
                <strong>प्राधिकरण:</strong> {item.authorityName}
              </p>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-brand-700 hover:text-brand-800 font-medium pt-1"
              >
                <span>सरकारी पोर्टल स्रोत देखें</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Explicit Legal Disclaimer */}
      <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-5 flex items-start gap-3.5 shadow-subtle">
        <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed space-y-1">
          <p className="font-bold">
            कानूनी सूचना व अस्वीकरण (Legal Informational Disclaimer):
          </p>
          <p>
            यह दरें केवल जानकारी, जागरूकता और आपसी समझौते (Conciliation) में सहायता के लिए प्रकाशित आधिकारिक अधिसूचनाओं से संकलित की गई हैं। यह कोई न्यायिक निर्णय या डिक्री नहीं है। अलग-अलग शहरों (Zone A/B/C) और विशेष कार्यों में दरें भिन्न हो सकती हैं।
          </p>
        </div>
      </div>
    </div>
  );
};
