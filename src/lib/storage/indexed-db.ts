/**
 * IndexedDB wrapper for offline elevation caching
 */

const DB_NAME = 'find-my-elevation';
const DB_VERSION = 1;
const STORE_ELEVATION = 'elevation-cache';
const STORE_PREFERENCES = 'preferences';

export interface ElevationCache {
  id: string; // "${lat.toFixed(4)},${lng.toFixed(4)}"
  latitude: number;
  longitude: number;
  elevation: number; // Always in meters
  source: 'gps' | 'api';
  accuracy: number; // in meters
  timestamp: number; // Unix timestamp (ms)
}

export interface Preference {
  key: string;
  value: any;
}

let db: IDBDatabase | null = null;

/**
 * Initialize the IndexedDB database
 */
export async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create elevation cache store
      if (!db.objectStoreNames.contains(STORE_ELEVATION)) {
        const elevationStore = db.createObjectStore(STORE_ELEVATION, { keyPath: 'id' });
        elevationStore.createIndex('by-timestamp', 'timestamp', { unique: false });
        elevationStore.createIndex('by-source', 'source', { unique: false });
      }

      // Create preferences store
      if (!db.objectStoreNames.contains(STORE_PREFERENCES)) {
        db.createObjectStore(STORE_PREFERENCES, { keyPath: 'key' });
      }
    };
  });
}

/**
 * Save elevation data to cache
 */
export async function saveElevation(data: ElevationCache): Promise<void> {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_ELEVATION], 'readwrite');
    const store = transaction.objectStore(STORE_ELEVATION);
    const request = store.put(data);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('Failed to save elevation data'));
  });
}

/**
 * Get elevation data by ID
 */
export async function getElevationById(id: string): Promise<ElevationCache | null> {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_ELEVATION], 'readonly');
    const store = transaction.objectStore(STORE_ELEVATION);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result || null);
    };
    request.onerror = () => reject(new Error('Failed to get elevation data'));
  });
}

/**
 * Get all elevation records
 */
export async function getAllElevations(): Promise<ElevationCache[]> {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_ELEVATION], 'readonly');
    const store = transaction.objectStore(STORE_ELEVATION);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Failed to get all elevations'));
  });
}

/**
 * Delete elevation record by ID
 */
export async function deleteElevation(id: string): Promise<void> {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_ELEVATION], 'readwrite');
    const store = transaction.objectStore(STORE_ELEVATION);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('Failed to delete elevation data'));
  });
}

/**
 * Clean up old elevation records (older than maxAge milliseconds)
 */
export async function cleanupOldElevations(maxAge: number = 30 * 24 * 60 * 60 * 1000): Promise<number> {
  const database = await initDB();
  const cutoff = Date.now() - maxAge;
  let deletedCount = 0;

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_ELEVATION], 'readwrite');
    const store = transaction.objectStore(STORE_ELEVATION);
    const index = store.index('by-timestamp');
    const range = IDBKeyRange.upperBound(cutoff);
    const request = index.openCursor(range);

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        deletedCount++;
        cursor.continue();
      } else {
        resolve(deletedCount);
      }
    };

    request.onerror = () => reject(new Error('Failed to cleanup old elevations'));
  });
}

/**
 * Save preference
 */
export async function savePreference(key: string, value: any): Promise<void> {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_PREFERENCES], 'readwrite');
    const store = transaction.objectStore(STORE_PREFERENCES);
    const request = store.put({ key, value });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('Failed to save preference'));
  });
}

/**
 * Get preference
 */
export async function getPreference(key: string): Promise<any> {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_PREFERENCES], 'readonly');
    const store = transaction.objectStore(STORE_PREFERENCES);
    const request = store.get(key);

    request.onsuccess = () => {
      resolve(request.result?.value || null);
    };
    request.onerror = () => reject(new Error('Failed to get preference'));
  });
}
