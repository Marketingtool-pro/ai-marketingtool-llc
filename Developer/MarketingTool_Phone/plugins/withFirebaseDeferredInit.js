const { AndroidConfig, withAndroidManifest } = require('@expo/config-plugins');
const { getMainApplicationOrThrow } = AndroidConfig.Manifest;

/**
 * Disable Firebase auto-init for Messaging / Analytics / Crashlytics so the
 * SDK doesn't fire FID registration + token fetch on cold start. On low-end
 * Android devices in markets with bad networks (India: Infinix, realme,
 * vivo), the FID network call hangs and FCM's blockingGetToken loop ANRs
 * the app — confirmed by the Play Console stack trace where TAG thread
 * is parked in CountDownLatch.await > Tasks.await > FirebaseMessaging.
 *
 * App.tsx re-enables collection in deferredInit() after onLayoutRootView
 * fires, so the user-visible startup completes BEFORE Firebase reaches
 * for the network.
 *
 * Why tools:replace="android:value" — @react-native-firebase/analytics (and
 * /crashlytics) ship their own manifest entries setting these flags to
 * `true`. Without tools:replace the manifest merger fails with:
 *   Attribute meta-data#firebase_analytics_collection_enabled@value
 *   value=(false) ... is also present ... value=(true).
 */
module.exports = function withFirebaseDeferredInit(config) {
  return withAndroidManifest(config, async (config) => {
    // Ensure xmlns:tools is declared on the root manifest tag.
    const manifestRoot = config.modResults.manifest;
    manifestRoot.$ = manifestRoot.$ || {};
    if (!manifestRoot.$['xmlns:tools']) {
      manifestRoot.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    const application = getMainApplicationOrThrow(config.modResults);
    application.$ = application.$ || {};
    application.$['android:extractNativeLibs'] = 'false';

    if (!application['meta-data']) application['meta-data'] = [];

    const flags = [
      ['firebase_messaging_auto_init_enabled', 'false'],
      ['firebase_analytics_collection_enabled', 'false'],
      ['firebase_crashlytics_collection_enabled', 'false'],
      ['firebase_performance_collection_enabled', 'false'],
    ];

    for (const [name, value] of flags) {
      // Remove any existing entry with the same name first.
      application['meta-data'] = application['meta-data'].filter(
        (m) => m.$ && m.$['android:name'] !== name
      );
      // Add with tools:replace so it wins the merger over RN Firebase libs.
      application['meta-data'].push({
        $: {
          'android:name': name,
          'android:value': value,
          'tools:replace': 'android:value',
        },
      });
    }

    return config;
  });
};
