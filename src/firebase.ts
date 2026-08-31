import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  collection, 
  doc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  DocumentData,
  writeBatch,
  disableNetwork,
  setLogLevel,
  Unsubscribe
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Silence verbose internal backoff logging from Firestore SDK
try {
  setLogLevel('silent');
} catch {
  // Ignore if not supported in environment
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId || '(default)');

// Flag to prevent infinite loop of syncing
let isSyncingFromServer = false;
// Circuit breaker flag when Firestore quota is exhausted
let isQuotaExhausted = false;
let activeUnsubscribes: Unsubscribe[] = [];

// Check persisted quota status (cooldown: 2 hours)
const QUOTA_KEY = 'optima_firestore_quota_exhausted_time';
try {
  const lastExhausted = localStorage.getItem(QUOTA_KEY);
  if (lastExhausted) {
    const elapsedHours = (Date.now() - parseInt(lastExhausted, 10)) / (1000 * 60 * 60);
    if (elapsedHours < 2) {
      isQuotaExhausted = true;
      disableNetwork(db).catch(() => {});
    } else {
      localStorage.removeItem(QUOTA_KEY);
    }
  }
} catch {
  // Ignore localStorage read error
}

export function getIsFirebaseQuotaExhausted() {
  return isQuotaExhausted;
}

export function stopAllFirebaseListeners() {
  activeUnsubscribes.forEach((unsub) => {
    try {
      unsub();
    } catch {
      // Ignore unsubscribe error
    }
  });
  activeUnsubscribes = [];
}

// Mapping of LocalStorage keys to Firestore collection names
const KEY_TO_COLLECTION: { [key: string]: string } = {
  'optima_catalog_kebutuhan': 'tenders',
  'optima_bids_history': 'bids',
  'optima_vendor_catalog': 'vendor_catalog',
  'optima_access_users': 'users',
  'optima_companies_profiles': 'companies',
  'optima_user_passwords': 'passwords'
};

// Cache last known values to avoid redundant writes
const lastSyncedValues: { [key: string]: string } = {};
// Debounce timers for write operations
const debounceTimers: { [key: string]: any } = {};

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errStr = error instanceof Error ? error.message : String(error);
  
  if (
    errStr.includes('resource-exhausted') || 
    errStr.includes('Quota exceeded') || 
    errStr.includes('quota metric') ||
    errStr.includes('quota limits') ||
    errStr.includes('maximum backoff')
  ) {
    if (!isQuotaExhausted) {
      isQuotaExhausted = true;
      try {
        localStorage.setItem(QUOTA_KEY, Date.now().toString());
      } catch {
        // Ignore storage error
      }
      stopAllFirebaseListeners();
      disableNetwork(db).catch(() => {});
      console.warn(
        `[Firebase] Firestore Free Tier daily quota limit exceeded. Network streaming disabled, seamless local storage active.`
      );
    }
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errStr,
    authInfo: {},
    operationType,
    path
  };
  console.error('[Firebase] Firestore Error:', JSON.stringify(errInfo));
}

// Initialize bidirectional real-time synchronization
export function startFirebaseSync(onSyncUpdate: () => void) {
  if (isQuotaExhausted) {
    disableNetwork(db).catch(() => {});
    return;
  }

  // Clear any existing active listeners before subscribing
  stopAllFirebaseListeners();

  Object.entries(KEY_TO_COLLECTION).forEach(([localStorageKey, collectionName]) => {
    try {
      const colRef = collection(db, collectionName);

      // Setup real-time listener from Firestore with required error callback and unsubscribe handle
      const unsubscribe = onSnapshot(
        colRef,
        async (snapshot) => {
          if (isQuotaExhausted) {
            stopAllFirebaseListeners();
            return;
          }

          // Set the syncing flag to avoid echoing back to Firestore
          isSyncingFromServer = true;

          try {
            if (snapshot.empty) {
              // If Firestore collection is empty, check if we have local data to seed/bootstrap
              const localValue = localStorage.getItem(localStorageKey);
              if (localValue && !isQuotaExhausted) {
                lastSyncedValues[localStorageKey] = localValue;
                const parsed = JSON.parse(localValue);
                
                if (localStorageKey === 'optima_companies_profiles' || localStorageKey === 'optima_user_passwords') {
                  const entries = Object.entries(parsed);
                  if (entries.length > 0) {
                    const batch = writeBatch(db);
                    for (const [docId, docData] of entries) {
                      if (docId && docData) {
                        batch.set(doc(db, collectionName, docId), docData as DocumentData);
                      }
                    }
                    await batch.commit();
                  }
                } else if (Array.isArray(parsed) && parsed.length > 0) {
                  const batch = writeBatch(db);
                  for (const item of parsed) {
                    const docId = item.id || item.email;
                    if (docId) {
                      batch.set(doc(db, collectionName, docId), item);
                    }
                  }
                  await batch.commit();
                }
              }
              isSyncingFromServer = false;
              return;
            }

            // Firestore has data, update LocalStorage
            if (localStorageKey === 'optima_companies_profiles' || localStorageKey === 'optima_user_passwords') {
              const dataMap: { [key: string]: any } = {};
              snapshot.forEach((docSnap) => {
                dataMap[docSnap.id] = docSnap.data();
              });
              const serialized = JSON.stringify(dataMap);
              lastSyncedValues[localStorageKey] = serialized;
              localStorage.setItem(localStorageKey, serialized);
            } else {
              const dataList: any[] = [];
              snapshot.forEach((docSnap) => {
                dataList.push(docSnap.data());
              });
              
              if (localStorageKey === 'optima_catalog_kebutuhan') {
                dataList.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
              } else if (localStorageKey === 'optima_bids_history') {
                dataList.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
              } else if (localStorageKey === 'optima_vendor_catalog') {
                dataList.sort((a, b) => (a.id || '').localeCompare(b.id || ''));
              }

              const serialized = JSON.stringify(dataList);
              lastSyncedValues[localStorageKey] = serialized;
              localStorage.setItem(localStorageKey, serialized);
            }

            // Trigger React re-render
            onSyncUpdate();
            window.dispatchEvent(new CustomEvent('optima-db-updated', { detail: { key: localStorageKey } }));
          } catch (err) {
            handleFirestoreError(err, OperationType.GET, collectionName);
          } finally {
            isSyncingFromServer = false;
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, collectionName);
        }
      );

      activeUnsubscribes.push(unsubscribe);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, collectionName);
    }
  });

  // Intercept window.localStorage.setItem to push local modifications to Firestore with debouncing & diff check
  const originalSetItem = window.localStorage.setItem;
  window.localStorage.setItem = function (key, value) {
    originalSetItem.apply(this, [key, value]);

    const collectionName = KEY_TO_COLLECTION[key];
    if (collectionName && !isSyncingFromServer && !isQuotaExhausted) {
      if (lastSyncedValues[key] === value) {
        return; // Data has not changed, skip redundant write
      }

      if (debounceTimers[key]) {
        clearTimeout(debounceTimers[key]);
      }

      debounceTimers[key] = setTimeout(() => {
        try {
          const parsedData = JSON.parse(value);
          lastSyncedValues[key] = value;
          pushLocalToFirestore(collectionName, parsedData, key);
        } catch (e) {
          console.error(`[Firebase] Error preparing sync for key "${key}":`, e);
        }
      }, 300);
    }
  };
}

// Push local state updates to Firestore with batching & error guards
async function pushLocalToFirestore(collectionName: string, localData: any, localStorageKey: string) {
  if (isQuotaExhausted) return;

  try {
    const colRef = collection(db, collectionName);
    const serverSnapshot = await getDocs(colRef);
    const serverDocsMap = new Map<string, DocumentData>();
    serverSnapshot.forEach(docSnap => {
      serverDocsMap.set(docSnap.id, docSnap.data());
    });

    const batch = writeBatch(db);
    let operationCount = 0;

    if (localStorageKey === 'optima_companies_profiles' || localStorageKey === 'optima_user_passwords') {
      const localKeys = Object.keys(localData);

      for (const [docId, docData] of Object.entries(localData)) {
        if (docId && docData) {
          const cleanData = JSON.parse(JSON.stringify(docData));
          const existingData = serverDocsMap.get(docId);
          // Only write if newly added or data content has changed
          if (!existingData || JSON.stringify(existingData) !== JSON.stringify(cleanData)) {
            batch.set(doc(db, collectionName, String(docId)), cleanData as DocumentData);
            operationCount++;
          }
        }
      }

      for (const serverId of serverDocsMap.keys()) {
        if (!localKeys.includes(serverId)) {
          batch.delete(doc(db, collectionName, serverId));
          operationCount++;
        }
      }
    } else if (Array.isArray(localData)) {
      const localIds = localData.map(item => item.id || item.email).filter(Boolean);

      for (const item of localData) {
        const docId = item.id || item.email;
        if (docId) {
          const cleanItem = JSON.parse(JSON.stringify(item));
          const existingData = serverDocsMap.get(docId);
          // Only write if newly added or data content has changed
          if (!existingData || JSON.stringify(existingData) !== JSON.stringify(cleanItem)) {
            batch.set(doc(db, collectionName, String(docId)), cleanItem);
            operationCount++;
          }
        }
      }

      for (const serverId of serverDocsMap.keys()) {
        if (!localIds.includes(serverId)) {
          batch.delete(doc(db, collectionName, serverId));
          operationCount++;
        }
      }
    }

    if (operationCount > 0) {
      await batch.commit();
      console.log(`[Firebase] Successfully pushed ${operationCount} document changes to collection "${collectionName}"`);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, collectionName);
  }
}


