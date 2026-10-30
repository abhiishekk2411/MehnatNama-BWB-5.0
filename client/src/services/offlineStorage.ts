// IndexedDB Database helper for Offline Workday Logging and Sync Queue
import type { Job, WorkDay, WorkDayStatus } from '../types';

const DB_NAME = 'mehnatnama_offline_db';
const DB_VERSION = 1;

export interface OfflineWorkdayEntry {
  localId: string; // generated client-side UUID/timestamp
  jobId: string;
  jobTitle?: string;
  contractorName?: string;
  workDate: string; // YYYY-MM-DD
  status: WorkDayStatus;
  overtimeMinutes: number;
  note: string;
  createdAtLocal: string; // ISO string
  syncStatus: 'PENDING' | 'SYNCING' | 'FAILED' | 'CONFLICT';
  syncError?: string;
}

export class OfflineStorage {
  private static dbPromise: Promise<IDBDatabase> | null = null;

  public static getDB(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          // Store for caching loaded jobs so worker can select offline
          if (!db.objectStoreNames.contains('cached_jobs')) {
            db.createObjectStore('cached_jobs', { keyPath: 'id' });
          }

          // Store for caching loaded workdays
          if (!db.objectStoreNames.contains('cached_workdays')) {
            const workdayStore = db.createObjectStore('cached_workdays', { keyPath: 'id' });
            workdayStore.createIndex('jobId', 'jobId', { unique: false });
            workdayStore.createIndex('workDate', 'workDate', { unique: false });
          }

          // Store for pending offline workday sync queue
          if (!db.objectStoreNames.contains('pending_workdays')) {
            const pendingStore = db.createObjectStore('pending_workdays', { keyPath: 'localId' });
            pendingStore.createIndex('syncStatus', 'syncStatus', { unique: false });
            pendingStore.createIndex('jobId_workDate', ['jobId', 'workDate'], { unique: true });
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    return this.dbPromise;
  }

  // --- Cached Jobs ---
  public static async cacheJobs(jobs: Job[]): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction('cached_jobs', 'readwrite');
    const store = tx.objectStore('cached_jobs');
    for (const job of jobs) {
      store.put(job);
    }
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public static async getCachedJobs(): Promise<Job[]> {
    const db = await this.getDB();
    const tx = db.transaction('cached_jobs', 'readonly');
    const store = tx.objectStore('cached_jobs');
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // --- Cached Workdays ---
  public static async cacheWorkdays(workdays: WorkDay[]): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction('cached_workdays', 'readwrite');
    const store = tx.objectStore('cached_workdays');
    for (const wd of workdays) {
      store.put(wd);
    }
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public static async getCachedWorkdays(): Promise<WorkDay[]> {
    const db = await this.getDB();
    const tx = db.transaction('cached_workdays', 'readonly');
    const store = tx.objectStore('cached_workdays');
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // --- Pending Sync Queue ---
  public static async addPendingWorkday(entry: Omit<OfflineWorkdayEntry, 'localId' | 'createdAtLocal' | 'syncStatus'>): Promise<OfflineWorkdayEntry> {
    const db = await this.getDB();
    const fullEntry: OfflineWorkdayEntry = {
      ...entry,
      localId: `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAtLocal: new Date().toISOString(),
      syncStatus: 'PENDING'
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction('pending_workdays', 'readwrite');
      const store = tx.objectStore('pending_workdays');

      // Check if duplicate entry already exists in pending
      const index = store.index('jobId_workDate');
      const checkReq = index.get([entry.jobId, entry.workDate]);

      checkReq.onsuccess = () => {
        if (checkReq.result) {
          reject(new Error(`इस तारीख (${entry.workDate}) के लिए हाजिरी पहले से कतार में मौजूद है।`));
          return;
        }
        const addReq = store.add(fullEntry);
        addReq.onsuccess = () => resolve(fullEntry);
        addReq.onerror = () => reject(addReq.error);
      };

      checkReq.onerror = () => reject(checkReq.error);
    });
  }

  public static async getPendingWorkdays(): Promise<OfflineWorkdayEntry[]> {
    const db = await this.getDB();
    const tx = db.transaction('pending_workdays', 'readonly');
    const store = tx.objectStore('pending_workdays');
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  public static async updatePendingWorkday(entry: OfflineWorkdayEntry): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction('pending_workdays', 'readwrite');
    const store = tx.objectStore('pending_workdays');
    store.put(entry);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public static async removePendingWorkday(localId: string): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction('pending_workdays', 'readwrite');
    const store = tx.objectStore('pending_workdays');
    store.delete(localId);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public static async getPendingCount(): Promise<number> {
    const entries = await this.getPendingWorkdays();
    return entries.filter(e => e.syncStatus === 'PENDING' || e.syncStatus === 'FAILED' || e.syncStatus === 'CONFLICT').length;
  }
}
