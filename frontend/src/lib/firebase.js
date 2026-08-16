// Firebase initialization — safe fallback to localStorage if config vars are missing.
// Set values in /app/frontend/.env (all REACT_APP_FIREBASE_* keys) then restart yarn/build.
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const firebaseEnabled = !!(
  config.apiKey &&
  config.authDomain &&
  config.projectId
);

export let app = null;
export let auth = null;
export let db = null;

if (firebaseEnabled) {
  app = getApps()[0] || initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);
  // Keep admin logged in across reloads
  setPersistence(auth, browserLocalPersistence).catch(() => {});
  // eslint-disable-next-line no-console
  console.log("[cloud] Firebase enabled — data syncs across all browsers.");
} else {
  // eslint-disable-next-line no-console
  console.log(
    "[cloud] Firebase not configured — running in local-only mode (localStorage)."
  );
}
