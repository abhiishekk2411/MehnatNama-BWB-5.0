import React from 'react';
import { BookOpen, PhoneCall, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LabourRightsGuidePage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'दैनिक हाजिरी का तुरंत हिसाब रखें (Daily Contemporaneous Logging)',
      desc: 'हर शाम काम खत्म होने पर तारीख, हाजिरी (पूरा दिन/आधा दिन) और लिया गया खर्चा अपने फोन में दर्ज करें। यह आपकी तरफ से प्राथमिक साक्ष्य बनता है।',
    },
    {
      num: '02',
      title: 'ठेकेदार से नियमित सत्यापन लिंक साझा करें (Weekly Verification Link)',
      desc: 'हफ्ते या महीने के अंत में ठेकेदार को हिसाब-सबूत लिंक WhatsApp पर भेजें। ठेकेदार के "Confirm" करते ही डिजिटल मुहर लग जाती है।',
    },
    {
      num: '03',
      title: 'विवाद होने पर शांतिपूर्ण वार्ता (Amicable Resolution)',
      desc: 'अगर ठेकेदार किसी तारीख पर असहमति जताता है, तो विवादित दिन की टिप्पणी देखें और आपसी सहमति से हिसाब का निपटारा करें।',
    },
    {
      num: '04',
      title: 'पीडीएफ सबूत पत्र डाउनलोड करें (Download Hisaab-Saboot PDF)',
      desc: 'अगर ठेकेदार पैसा देने से मना करे, तो हिसाब-सबूत से पूरी हाजिरी और बकाया राशि का आधिकारिक पीडीएफ पर्चा डाउनलोड करें।',
    },
    {
      num: '05',
      title: 'श्रम अधिकारी के पास शिकायत (Conciliation with Labour Officer)',
      desc: 'सबूत पत्र के साथ अपने जिले के श्रम अधिकारी (District Labour Officer - DLO) या हेल्पलाइन 14434 पर शिकायत दर्ज करें।',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
          <BookOpen className="h-3.5 w-3.5" />
          <span>श्रमिक अधिकार एवं समाधान मार्गदर्शिका</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          मजदूरी अधिकार व समाधान मार्गदर्शिका
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          असंगठित व दैनिक वेतनभोगी श्रमिकों के लिए कानूनी अधिकार व सहायता।
        </p>
      </div>

      {/* Emergency Helpline Strip */}
      <div className="card bg-brand-700 text-white p-5 border-none shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <PhoneCall className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-brand-200 block uppercase tracking-wider">
                राष्ट्रीय श्रम टोल-फ्री हेल्पलाइन
              </span>
              <span className="text-2xl font-black tracking-tight block">14434</span>
              <span className="text-xs text-brand-100">
                श्रम एवं रोजगार मंत्रालय, भारत सरकार (निःशुल्क सहायता)
              </span>
            </div>
          </div>

          <a
            href="tel:14434"
            className="inline-flex items-center justify-center gap-2 bg-white text-brand-800 hover:bg-brand-50 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
          >
            <span>कॉल करें (14434)</span>
          </a>
        </div>
      </div>

      {/* 5-Step Resolution Roadmap */}
      <div className="card space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          बकाया मजदूरी विवाद सुलझाने के 5 कदम (Step-by-Step Procedure)
        </h2>

        <div className="space-y-3">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3.5 hover:bg-slate-100/60 transition-colors"
            >
              <span className="h-8 w-8 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {st.num}
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{st.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Labour Laws Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-600" />
            <span>न्यूनतम मजदूरी अधिनियम, 1948 (Minimum Wages Act)</span>
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            किसी भी ठेकेदार या मालिक द्वारा सरकार द्वारा अधिसूचित न्यूनतम मजदूरी से कम भुगतान करना कानूनन अपराध है। चाहे मौखिक समझौता कम दर पर ही क्यों न हुआ हो, कानूनी रूप से अधिसूचित न्यूनतम दर मान्य होती है।
          </p>
        </div>

        <div className="card">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand-600" />
            <span>मजदूरी संदाय अधिनियम (Payment of Wages Act)</span>
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            मजदूरी का भुगतान तय समय सीमा के भीतर (दैनिक, साप्ताहिक या माह समाप्त होने के 7 से 10 दिनों के अंदर) बिना किसी अनधिकृत कटौती के किया जाना अनिवार्य है।
          </p>
        </div>
      </div>
    </div>
  );
};
