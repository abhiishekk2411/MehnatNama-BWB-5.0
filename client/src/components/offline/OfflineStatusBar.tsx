import { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle, Clock, Trash2, ArrowUpRight } from 'lucide-react';
import { useOffline } from '../../context/OfflineContext';

export function OfflineStatusBar() {
  const { isOnline, pendingCount, isSyncing, pendingEntries, triggerSync, resolveConflict } = useOffline();
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleManualSync = async () => {
    setSyncFeedback(null);
    const result = await triggerSync();
    if (result.synced > 0) {
      setSyncFeedback(`सफलतापूर्वक ${result.synced} हाजिरी सिंक हुई!`);
    } else if (result.conflicts > 0) {
      setSyncFeedback(`${result.conflicts} एंट्री में कॉन्फ्लिक्ट है। कृपया नीचे जांचें।`);
    } else if (result.failed > 0) {
      setSyncFeedback(`सिंक विफल रहा (${result.errors[0] || 'नेटवर्क समस्या'})`);
    } else {
      setSyncFeedback('सभी रिकॉर्ड पहले से सिंक हैं।');
    }
    setTimeout(() => setSyncFeedback(null), 5000);
  };

  return (
    <>
      {/* Top Banner (Visible when offline or when pending entries exist) */}
      {(!isOnline || pendingCount > 0) && (
        <aside
          role="region"
          aria-label="Offline status banner"
          className={`w-full py-2 px-4 transition-colors text-xs font-medium flex items-center justify-between border-b ${
            !isOnline
              ? 'bg-amber-500 text-slate-950 border-amber-600'
              : 'bg-emerald-600 text-white border-emerald-700'
          }`}
        >
          <div className="flex items-center gap-2 max-w-xl truncate">
            {!isOnline ? (
              <>
                <WifiOff className="w-4 h-4 shrink-0 text-slate-950" />
                <span>
                  <strong>ऑफ़लाइन मोड:</strong> इंटरनेट बंद है। नई हाजिरी फ़ोन में सुरक्षित हो रही है ({pendingCount} पेंडिंग)।
                </span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 shrink-0 text-white" />
                <span>
                  <strong>इंटरनेट वापस आ गया:</strong> {pendingCount} हाजिरी रिकॉर्ड सिंक होने के लिए तैयार हैं।
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {pendingCount > 0 && (
              <button
                onClick={() => setShowQueueModal(true)}
                className="underline hover:opacity-90 font-semibold px-2 py-0.5 rounded"
              >
                कतार देखें ({pendingCount})
              </button>
            )}

            {isOnline && pendingCount > 0 && (
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'सिंक हो रहा है...' : 'अभी सिंक करें'}
              </button>
            )}
          </div>
        </aside>
      )}

      {/* Sync Feedback Toast */}
      {syncFeedback && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Pending Queue & Conflict Resolution Modal */}
      {showQueueModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  ऑफ़लाइन हाजिरी कतार (Sync Queue)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ये रिकॉर्ड फ़ोन में सुरक्षित हैं और इंटरनेट मिलने पर सर्वर पर भेजे जाएंगे।
                </p>
              </div>
              <button
                onClick={() => setShowQueueModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {pendingEntries.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle className="w-10 h-10 mx-auto text-emerald-500/50 mb-2" />
                  <p className="text-sm">कोई पेंडिंग ऑफ़लाइन रिकॉर्ड नहीं है।</p>
                </div>
              ) : (
                pendingEntries.map((entry) => (
                  <div
                    key={entry.localId}
                    className={`p-3 rounded-xl border text-xs flex flex-col gap-2 ${
                      entry.syncStatus === 'CONFLICT'
                        ? 'border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900'
                        : entry.syncStatus === 'FAILED'
                        ? 'border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900'
                        : 'border-slate-200 bg-slate-50 dark:bg-slate-800/40 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {entry.workDate} • {entry.status}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                          entry.syncStatus === 'CONFLICT'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                            : entry.syncStatus === 'FAILED'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                        }`}
                      >
                        {entry.syncStatus}
                      </span>
                    </div>

                    {entry.note && (
                      <p className="text-slate-600 dark:text-slate-300 italic">"{entry.note}"</p>
                    )}

                    {entry.syncError && (
                      <div className="flex items-start gap-1.5 text-red-600 dark:text-red-400 text-[11px] bg-red-50 dark:bg-red-950/40 p-2 rounded-lg">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{entry.syncError}</span>
                      </div>
                    )}

                    {/* Conflict resolution actions */}
                    {entry.syncStatus === 'CONFLICT' && (
                      <div className="flex items-center gap-2 pt-1 border-t border-red-100 dark:border-red-900">
                        <button
                          onClick={() => resolveConflict(entry.localId, 'OVERWRITE_SERVER')}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded font-semibold text-[11px] flex items-center justify-center gap-1"
                        >
                          <ArrowUpRight className="w-3 h-3" />
                          लोकल रिकॉर्ड से बदलें (Overwrite)
                        </button>
                        <button
                          onClick={() => resolveConflict(entry.localId, 'DISCARD_LOCAL')}
                          className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-1 px-2.5 rounded font-semibold text-[11px] flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          हटाएं (Discard)
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                कुल {pendingEntries.length} प्रविष्टियां
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowQueueModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                >
                  बंद करें
                </button>
                {isOnline && pendingEntries.length > 0 && (
                  <button
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="px-4 py-1.5 text-xs bg-forest-primary hover:bg-forest-dark text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'सिंक हो रहा है...' : 'अभी सिंक करें'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
