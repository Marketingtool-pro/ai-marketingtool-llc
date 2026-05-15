import { Platform } from 'react-native';
import appCheck from '@react-native-firebase/app-check';
import Constants from 'expo-constants';

/**
 * Initializes Firebase App Check with reCAPTCHA Enterprise.
 * This proves the app's identity to Google/Firebase and helps avoid "Spam" labels on OTPs.
 */
export const initializeAppCheck = async () => {
  try {
    const firebaseConfig = Constants.expoConfig?.extra?.firebase;
    if (!firebaseConfig) {
      if (__DEV__) console.log('[AppCheck] No configuration found in app.json');
      return;
    }

    const provider = appCheck().newReactNativeFirebaseAppCheckProvider();

    // App Attest is the modern attestation provider (iOS 14+, free, no
    // extra pod). Firebase Phone Auth uses App Check tokens for device
    // verification — without this, Auth falls back to reCAPTCHA Enterprise
    // SDK which isn't linked, producing "[auth/unknown] reCAPTCHA SDK is
    // not linked" errors. deviceCheck stays as the fallback for the very
    // small slice of devices where App Attest is unavailable.
    provider.configure({
      android: {
        provider: 'playIntegrity',
      },
      apple: {
        provider: 'appAttestWithDeviceCheckFallback',
      },
    });

    await appCheck().initializeAppCheck({
      provider,
      isTokenAutoRefreshEnabled: true,
    });

    if (__DEV__) console.log('[AppCheck] Initialized successfully');
  } catch (error: any) {
    if (__DEV__) console.error('[AppCheck] Initialization failed:', error.message);
  }
};

export default initializeAppCheck;
