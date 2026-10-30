import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Only show if user hasn't dismissed before in this session
      if (!sessionStorage.getItem('pwa_prompt_dismissed')) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    setIsVisible(false);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Install prompt outcome: ${outcome}`);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-sm bg-white dark:bg-slate-900 border border-forest-200 dark:border-forest-800 rounded-2xl p-4 shadow-xl shadow-forest-950/10 transition-all animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-forest-50 dark:bg-forest-900/40 text-forest-primary flex items-center justify-center shrink-0 border border-forest-100 dark:border-forest-800">
          <Download className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-ink-primary dark:text-white">
              MehnatNama ऐप इंस्टॉल करें
            </h4>
            <button
              onClick={handleDismiss}
              className="text-ink-muted hover:text-ink-secondary p-1 rounded-md"
              aria-label="Close install prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-ink-secondary dark:text-slate-400 mt-1 leading-relaxed">
            बिना इंटरनेट के भी हाजिरी दर्ज करने और सीधे होम स्क्रीन से खोलने के लिए ऐप इंस्टॉल करें।
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-forest-primary hover:bg-forest-dark text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              इंस्टॉल करें (Install)
            </button>
            <button
              onClick={handleDismiss}
              className="text-xs text-ink-muted hover:text-ink-secondary py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800"
            >
              बाद में
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
