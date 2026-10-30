import { useState, useEffect } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { SectionHeader } from '../components/common/SectionHeader';
import { useLanguage } from '../context/LanguageContext';
import { Bell, ShieldCheck, CheckCircle2, AlertCircle, Volume2, Globe, Clock, Smartphone } from 'lucide-react';

interface NotificationPreferences {
  dailyReminder: boolean;
  contractorAlert: boolean;
  syncAlert: boolean;
  paymentAlert: boolean;
}

export function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
    const saved = localStorage.getItem('mehnatnama_notif_prefs');
    return saved
      ? JSON.parse(saved)
      : {
          dailyReminder: true,
          contractorAlert: true,
          syncAlert: true,
          paymentAlert: true,
        };
  });
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationAccess = async () => {
    if (!('Notification' in window)) {
      alert('इस ब्राउज़र में नोटिफिकेशन समर्थित नहीं है।');
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      new Notification('MehnatNama (मेहनतनामा)', {
        body: 'सूचनाएं चालू कर दी गई हैं! आपको समय पर हाजिरी और भुगतान रिमाइंडर मिलेंगे।',
        icon: '/favicon.svg',
      });
    }
  };

  const handleTogglePref = (key: keyof NotificationPreferences) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    localStorage.setItem('mehnatnama_notif_prefs', JSON.stringify(updated));
  };

  const sendTestNotification = () => {
    if (notificationPermission !== 'granted') {
      requestNotificationAccess();
      return;
    }
    new Notification('दैनिक हाजिरी रिमाइंडर (MehnatNama)', {
      body: 'शाम के 8 बज गए हैं! आज का काम और दिहाड़ी दर्ज करना न भूलें।',
      icon: '/favicon.svg',
    });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
  };

  return (
    <PageContainer>
      <SectionHeader
        title={language === 'hi' ? 'सेटिंग्स व प्राथमिकताएं' : 'Settings & Preferences'}
        hindiTitle="ऐप भाषा और सूचना प्राथमिकताएं"
        description="Customize app language, browser notifications, and offline preferences."
      />

      <div className="max-w-3xl space-y-6">
        {/* Language Selection Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-forest-50 dark:bg-forest-900/40 text-forest-primary flex items-center justify-center shrink-0 border border-forest-100 dark:border-forest-800">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? 'इंटरफ़ेस भाषा (Language)' : 'Interface Language'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'अपनी पसंदीदा भाषा चुनें (हिंदी या English)'
                  : 'Choose your preferred language (Hindi or English)'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLanguage('hi')}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                language === 'hi'
                  ? 'bg-forest-50 border-forest-500 text-forest-900 dark:bg-forest-950/40 dark:border-forest-600 dark:text-forest-200 font-semibold ring-1 ring-forest-500'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <p className="text-sm font-bold">हिंदी (Hindi)</p>
                <p className="text-xs text-slate-500 mt-0.5">कामगार-प्रथम भाषा</p>
              </div>
              {language === 'hi' && <CheckCircle2 className="w-5 h-5 text-forest-primary" />}
            </button>

            <button
              onClick={() => setLanguage('en')}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                language === 'en'
                  ? 'bg-forest-50 border-forest-500 text-forest-900 dark:bg-forest-950/40 dark:border-forest-600 dark:text-forest-200 font-semibold ring-1 ring-forest-500'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <p className="text-sm font-bold">English</p>
                <p className="text-xs text-slate-500 mt-0.5">Standard English UI</p>
              </div>
              {language === 'en' && <CheckCircle2 className="w-5 h-5 text-forest-primary" />}
            </button>
          </div>
        </div>

        {/* Notifications & Reminders Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.notifications.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {t.notifications.subtitle}
                </p>
              </div>
            </div>

            {notificationPermission !== 'granted' ? (
              <button
                onClick={requestNotificationAccess}
                className="bg-forest-primary hover:bg-forest-dark text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Bell className="w-3.5 h-3.5" />
                अनुमति दें (Enable)
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                सक्रिय (Active)
              </span>
            )}
          </div>

          {notificationPermission === 'denied' && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                ब्राउज़र सेटिंग्स में नोटिफिकेशन ब्लॉक हैं। कृपया साइट सेटिंग्स से इसे अनब्लॉक करें।
              </span>
            </div>
          )}

          {/* Preferences Checklist */}
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {t.notifications.dailyReminder}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    शाम को हाजिरी दर्ज करने का विनम्र स्मरण
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.dailyReminder}
                onChange={() => handleTogglePref('dailyReminder')}
                className="w-4 h-4 rounded text-forest-primary focus:ring-forest-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {t.notifications.contractorAlert}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    जब ठेकेदार पुष्टि करे या किसी दिन पर आपत्ति दर्ज करे
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.contractorAlert}
                onChange={() => handleTogglePref('contractorAlert')}
                className="w-4 h-4 rounded text-forest-primary focus:ring-forest-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {t.notifications.syncAlert}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    ऑफ़लाइन हाजिरी इंटरनेट मिलने पर सिंक होने पर सूचित करें
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.syncAlert}
                onChange={() => handleTogglePref('syncAlert')}
                className="w-4 h-4 rounded text-forest-primary focus:ring-forest-500"
              />
            </label>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              रिमाइंडर का परीक्षण करें:
            </span>
            <button
              onClick={sendTestNotification}
              className="text-xs text-forest-primary hover:text-forest-dark font-semibold inline-flex items-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5" />
              {testSent ? 'टेस्ट रिमाइंडर भेजा गया!' : 'टेस्ट नोटिफिकेशन भेजें'}
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
