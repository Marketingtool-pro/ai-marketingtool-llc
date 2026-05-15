// @third-party
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

/***************************  AUTH CLIENT - FIREBASE  ***************************/

export function createFirebaseClient() {
  // If already created, return existing instance
  if (getApps().length > 0) {
    return getApp();
  }

  const config = {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID
  };

  // Validate required config
  if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
    console.log('[Firebase Client] Missing required configuration variables.');
    return {};
  }

  return initializeApp(config);
}

export const firebaseApp = createFirebaseClient();
export const firebaseAuth = getAuth(firebaseApp);
