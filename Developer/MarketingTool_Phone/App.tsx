import React, { useEffect, useState, useCallback } from 'react';
import '@tamagui/native/setup-zeego';
// expo-status-bar removed: it routes through deprecated APIs on Android 15
// (StatusBarModule -> Window.setStatusBarColor). react-native-edge-to-edge's
// <SystemBars /> replaces it cleanly on both platforms.
import { View, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SystemBars } from 'react-native-edge-to-edge';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Feather } from '@expo/vector-icons';
import AppNavigator from './src/navigation/AppNavigator';
import { useAuthStore } from './src/store/authStore';
import { Colors } from './src/constants/theme';
import { matomo } from './src/services/matomo';
import { initializeAppCheck } from './src/services/firebaseAppCheck';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';
import * as TrackingTransparency from 'expo-tracking-transparency';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    async function prepare() {
      try {
        // Request ATT permission on iOS
        if (Platform.OS === 'ios') {
          await TrackingTransparency.requestTrackingPermissionsAsync();
        }

        // Run fonts and auth in parallel, each with its own timeout.
        // Cap at 1.5s to prevent slow auth/network from gating the splash.
        const withTimeout = <T,>(p: Promise<T>, ms: number) =>
          Promise.race([p, new Promise(resolve => setTimeout(resolve, ms))]);

        // App Check must be ready BEFORE the user reaches the login screen.
        // Firebase Phone Auth on iOS uses the App Check token to verify the
        // device — without it, Auth falls back to reCAPTCHA Enterprise SDK
        // which isn't linked. Capping at 2s so a slow attestation call
        // doesn't block the splash forever.
        await Promise.all([
          withTimeout(Font.loadAsync({ ...Feather.font }), 1500),
          withTimeout(checkAuth(), 1500),
          withTimeout(initializeAppCheck(), 2000),
        ]);
      } catch (e) {
        console.warn('Error loading app resources:', e);
      } finally {
        setAppIsReady(true);
        // Non-critical inits run AFTER UI is ready — prevents ANR on cold start
        deferredInit();
      }
    }

    // Guard against listener registration after unmount. `deferredInit` is
    // fire-and-forget, so `messaging().requestPermission()` can still be
    // pending when the cleanup runs; without this flag we'd register an
    // onMessage listener with no way to unsubscribe it — classic leak on
    // fast remount (login → logout → login).
    let mounted = true;
    let unsubscribeFcm: (() => void) | undefined;

    async function deferredInit() {
      // Note: App Check init moved to prepare() above so the token is ready
      // when the user reaches the login screen. Don't call it again here.

      // Firebase auto-init is OFF in AndroidManifest (see
      // withFirebaseDeferredInit.js). On low-end devices in markets with
      // bad networks (India: Infinix, realme, vivo) the FID registration
      // network call hangs and FCM's blockingGetToken loop ANRs the app
      // (Play Console trace: thread "TAG" parked in CountDownLatch.await
      // > Tasks.await > FirebaseMessaging). Re-enabling here happens AFTER
      // onLayoutRootView, so the user-visible startup completes BEFORE
      // Firebase reaches for the network.
      messaging().setAutoInitEnabled(true)
        .catch(e => console.warn('Messaging auto-init enable error:', e));

      crashlytics().setCrashlyticsCollectionEnabled(true)
        .then(() => crashlytics().log('App started'))
        .catch(e => console.warn('Crashlytics init error:', e));

      analytics().setAnalyticsCollectionEnabled(true)
        .then(() => analytics().logAppOpen())
        .catch(e => console.warn('Analytics init error:', e));

      messaging().requestPermission()
        .then(async (authStatus) => {
          if (!mounted) return;
          if (authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
              authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
            const token = await messaging().getToken();
            if (!mounted) return;
            if (__DEV__) console.log('[FCM] Token:', token?.substring(0, 20) + '...');
            unsubscribeFcm = messaging().onMessage(async (msg) => {
              if (__DEV__) console.log('[FCM] Foreground:', msg.notification?.title);
            });
          }
        })
        .catch(e => console.warn('FCM init error:', e));

      matomo.init().catch(e => console.warn('Matomo init error', e));
    }

    prepare();

    return () => {
      mounted = false;
      unsubscribeFcm?.();
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <KeyboardProvider>
      <SafeAreaProvider>
        <View style={styles.container} onLayout={onLayoutRootView}>
          {/* SystemBars (from react-native-edge-to-edge) replaces both
              expo-status-bar and expo-navigation-bar. It uses the modern
              WindowInsetsControllerCompat path on Android 15 — no
              deprecated Window.setStatusBarColor / setNavigationBarColor
              calls. Same light icons on dark background on both platforms. */}
          <SystemBars style="light" />
          <AppNavigator />
        </View>
      </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
