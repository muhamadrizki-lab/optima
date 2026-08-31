import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  getDoc,
  DocumentData
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId || '(default)');

// Flag to prevent infinite loop of syncing
let isSyncingFromServer = false;

// Mapping of LocalStorage keys to Firestore collection names
const KEY_TO_COLLECTION: { [key: string]: string } = {
  'optima_catalog_kebutuhan': 'tenders',
  'optima_bids_history': 'bids',
  'optima_vendor_catalog': 'vendor_catalog',
  'optima_access_users': 'users',
  'optima_companies_profiles': 'companies',
  'optima_user_passwords': 'passwords'
};

// Initialize bidirectional real-time synchronization
export function startFirebaseSync(onSyncUpdate: () => void) {
  Object.entries(KEY_TO_COLLECTION).forEach(([localStorageKey, collectionName]) => {
    const colRef = collection(db, collectionName);

    // Setup real-time listener from Firestore
    onSnapshot(colRef, async (snapshot) => {
      // Set the syncing flag to avoid echoing back to Firestore
      isSyncingFromServer = true;

      try {
        if (snapshot.empty) {
          // If Firestore collection is empty, check if we have local data to seed/bootstrap
          const localValue = localStorage.getItem(localStorageKey);
          if (localValue) {
            const parsed = JSON.parse(localValue);
            console.log(`[Firebase] Seeding empty Firestore collection "${collectionName}" with local storage data.`);
            
            if (localStorageKey === 'optima_companies_profiles' || localStorageKey === 'optima_user_passwords') {
              // Dictionary map format
              for (const [docId, docData] of Object.entries(parsed)) {
                if (docId && docData) {
                  await setDoc(doc(db, collectionName, docId), docData as DocumentData);
                }
              }
            } else if (Array.isArray(parsed)) {
              // Array list format
              for (const item of parsed) {
                const docId = item.id || item.email; // Use id or email as document ID
                if (docId) {
                  await setDoc(doc(db, collectionName, docId), item);
                }
              }
            }
          }
          isSyncingFromServer = false;
          return;
        }

        // Firestore has data, update LocalStorage
        if (localStorageKey === 'optima_companies_profiles' || localStorageKey === 'optima_user_passwords') {
          // Rebuild as dictionary map
          const dataMap: { [key: string]: any } = {};
          snapshot.forEach((doc) => {
            dataMap[doc.id] = doc.data();
          });
          localStorage.setItem(localStorageKey, JSON.stringify(dataMap));
        } else {
          // Rebuild as array
          const dataList: any[] = [];
          snapshot.forEach((doc) => {
            dataList.push(doc.data());
          });
          
          // Sort lists appropriately to keep order consistent
          if (localStorageKey === 'optima_catalog_kebutuhan') {
            dataList.sort((a, b) => b.id.localeCompare(a.id));
          } else if (localStorageKey === 'optima_bids_history') {
            dataList.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
          } else if (localStorageKey === 'optima_vendor_catalog') {
            dataList.sort((a, b) => a.id.localeCompare(b.id));
          }

          localStorage.setItem(localStorageKey, JSON.stringify(dataList));
        }

        // Trigger React re-render by calling the callback and dispatching global event
        onSyncUpdate();
        window.dispatchEvent(new CustomEvent('optima-db-updated', { detail: { key: localStorageKey } }));
      } catch (err) {
        console.error(`[Firebase] Error syncing collection "${collectionName}" from Firestore:`, err);
      } finally {
        isSyncingFromServer = false;
      }
    });
  });

  // Intercept window.localStorage.setItem to push local modifications to Firestore
  const originalSetItem = window.localStorage.setItem;
  window.localStorage.setItem = function (key, value) {
    originalSetItem.apply(this, [key, value]);

    const collectionName = KEY_TO_COLLECTION[key];
    if (collectionName && !isSyncingFromServer) {
      try {
        const parsedData = JSON.parse(value);
        pushLocalToFirestore(collectionName, parsedData, key);
      } catch (e) {
        console.error(`[Firebase] Error preparing sync for key "${key}":`, e);
      }
    }
  };
}

// Push local state updates to Firestore (Create, Update, Delete)
async function pushLocalToFirestore(collectionName: string, localData: any, localStorageKey: string) {
  try {
    const colRef = collection(db, collectionName);
    const serverSnapshot = await getDocs(colRef);
    const serverDocsMap = new Map<string, DocumentData>();
    serverSnapshot.forEach(doc => {
      serverDocsMap.set(doc.id, doc.data());
    });

    if (localStorageKey === 'optima_companies_profiles' || localStorageKey === 'optima_user_passwords') {
      // Map dictionary synchronization
      const localKeys = Object.keys(localData);

      // Write or update existing local entries to Firestore
      for (const [docId, docData] of Object.entries(localData)) {
        if (docId && docData) {
          await setDoc(doc(db, collectionName, docId), docData as DocumentData);
        }
      }

      // Delete remote documents that no longer exist locally
      for (const serverId of serverDocsMap.keys()) {
        if (!localKeys.includes(serverId)) {
          console.log(`[Firebase] Deleting document "${serverId}" from collection "${collectionName}"`);
          await deleteDoc(doc(db, collectionName, serverId));
        }
      }
    } else if (Array.isArray(localData)) {
      // Array list synchronization
      const localIds = localData.map(item => item.id || item.email).filter(Boolean);

      // Write or update local array items to Firestore
      for (const item of localData) {
        const docId = item.id || item.email;
        if (docId) {
          await setDoc(doc(db, collectionName, docId), item);
        }
      }

      // Delete remote documents that are no longer in the local array
      for (const serverId of serverDocsMap.keys()) {
        if (!localIds.includes(serverId)) {
          console.log(`[Firebase] Deleting document "${serverId}" from collection "${collectionName}"`);
          await deleteDoc(doc(db, collectionName, serverId));
        }
      }
    }
  } catch (err) {
    console.error(`[Firebase] Error pushing local data to collection "${collectionName}":`, err);
  }
}
