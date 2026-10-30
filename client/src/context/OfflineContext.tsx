import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { OfflineStorage, type OfflineWorkdayEntry } from '../services/offlineStorage';
import { SyncManager, type SyncResult } from '../services/syncManager';

interface OfflineContextType {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  pendingEntries: OfflineWorkdayEntry[];
  triggerSync: () => Promise<SyncResult>;
  refreshPending: () => Promise<void>;
  resolveConflict: (localId: string, action: 'DISCARD_LOCAL' | 'OVERWRITE_SERVER') => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingEntries, setPendingEntries] = useState<OfflineWorkdayEntry[]>([]);

  const refreshPending = useCallback(async () => {
    try {
      const entries = await OfflineStorage.getPendingWorkdays();
      setPendingEntries(entries);
      setPendingCount(entries.filter(e => e.syncStatus !== 'SYNCING').length);
    } catch {
      // Ignore initial IndexedDB error
    }
  }, []);

  const triggerSync = useCallback(async (): Promise<SyncResult> => {
    setIsSyncing(true);
    try {
      const result = await SyncManager.syncPendingWorkdays();
      await refreshPending();
      return result;
    } finally {
      setIsSyncing(false);
    }
  }, [refreshPending]);

  const handleResolveConflict = useCallback(async (localId: string, action: 'DISCARD_LOCAL' | 'OVERWRITE_SERVER') => {
    await SyncManager.resolveConflict(localId, action);
    await refreshPending();
  }, [refreshPending]);

  useEffect(() => {
    refreshPending();

    const handleOnline = () => {
      setIsOnline(true);
      // Auto-trigger sync when network reconnects
      triggerSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = SyncManager.subscribe((status) => {
      setIsSyncing(status.isSyncing);
      setPendingCount(status.pendingCount);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, [refreshPending, triggerSync]);

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        pendingCount,
        isSyncing,
        pendingEntries,
        triggerSync,
        refreshPending,
        resolveConflict: handleResolveConflict,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
