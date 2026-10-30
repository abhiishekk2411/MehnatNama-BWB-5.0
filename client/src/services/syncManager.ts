// Offline Sync Manager
import { OfflineStorage } from './offlineStorage';
import { workdayService } from './workdayService';

export interface SyncResult {
  total: number;
  synced: number;
  conflicts: number;
  failed: number;
  errors: string[];
}

export class SyncManager {
  private static isSyncing = false;
  private static listeners: ((status: { isSyncing: boolean; pendingCount: number }) => void)[] = [];

  public static subscribe(listener: (status: { isSyncing: boolean; pendingCount: number }) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notify(pendingCount: number) {
    this.listeners.forEach(l => l({ isSyncing: this.isSyncing, pendingCount }));
  }

  public static async syncPendingWorkdays(): Promise<SyncResult> {
    if (this.isSyncing) {
      return { total: 0, synced: 0, conflicts: 0, failed: 0, errors: ['Sync already in progress'] };
    }

    if (!navigator.onLine) {
      const count = await OfflineStorage.getPendingCount();
      return { total: count, synced: 0, conflicts: 0, failed: count, errors: ['No internet connection'] };
    }

    this.isSyncing = true;
    const entries = await OfflineStorage.getPendingWorkdays();
    const result: SyncResult = {
      total: entries.length,
      synced: 0,
      conflicts: 0,
      failed: 0,
      errors: []
    };

    try {
      for (const entry of entries) {
        if (entry.syncStatus === 'CONFLICT') {
          result.conflicts++;
          continue; // wait for manual user resolution
        }

        try {
          entry.syncStatus = 'SYNCING';
          await OfflineStorage.updatePendingWorkday(entry);

          // Submit to server
          await workdayService.recordWorkday({
            jobId: entry.jobId,
            workDate: entry.workDate,
            status: entry.status,
            overtimeMinutes: entry.overtimeMinutes,
            note: entry.note ? `${entry.note} (Synced from offline)` : 'Synced from offline'
          });

          // Successfully created on server: remove from pending queue
          await OfflineStorage.removePendingWorkday(entry.localId);
          result.synced++;
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : String(err);
          // Check if conflict (e.g. entry for this date already exists on server)
          if (errMsg.toLowerCase().includes('already exists') || errMsg.toLowerCase().includes('duplicate') || errMsg.toLowerCase().includes('409')) {
            entry.syncStatus = 'CONFLICT';
            entry.syncError = 'सर्वर पर इस तारीख की हाजिरी पहले से मौजूद है (Conflict detected)';
            result.conflicts++;
          } else {
            entry.syncStatus = 'FAILED';
            entry.syncError = errMsg;
            result.failed++;
          }
          result.errors.push(`${entry.workDate}: ${entry.syncError}`);
          await OfflineStorage.updatePendingWorkday(entry);
        }
      }
    } finally {
      this.isSyncing = false;
      const remainingCount = await OfflineStorage.getPendingCount();
      this.notify(remainingCount);
    }

    return result;
  }

  // Conflict resolution helper
  public static async resolveConflict(localId: string, action: 'DISCARD_LOCAL' | 'OVERWRITE_SERVER'): Promise<void> {
    const entries = await OfflineStorage.getPendingWorkdays();
    const entry = entries.find(e => e.localId === localId);
    if (!entry) return;

    if (action === 'DISCARD_LOCAL') {
      await OfflineStorage.removePendingWorkday(localId);
    } else if (action === 'OVERWRITE_SERVER') {
      // Find server workday id and update it
      const serverWorkdays = await workdayService.getWorkdays({ jobId: entry.jobId, startDate: entry.workDate, endDate: entry.workDate });
      const existing = serverWorkdays.find(w => w.workDate.slice(0, 10) === entry.workDate);
      if (existing) {
        await workdayService.updateWorkday(existing.id, {
          status: entry.status,
          overtimeMinutes: entry.overtimeMinutes,
          note: entry.note
        });
      }
      await OfflineStorage.removePendingWorkday(localId);
    }

    const count = await OfflineStorage.getPendingCount();
    this.notify(count);
  }
}
