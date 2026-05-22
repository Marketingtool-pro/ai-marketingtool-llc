const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Pin com.google.android.material:material to a version that no longer
 * uses the deprecated LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES /
 * LAYOUT_IN_DISPLAY_CUTOUT_MODE_DEFAULT constants.
 *
 * Why: Play Console -> Android Vitals flags BottomSheetDialog,
 * SheetDialog, EdgeToEdgeUtils for deprecated cutout-mode usage on
 * Android 15. Older Material releases use the deprecated path; 1.13+
 * routes through WindowInsets instead. The lib comes in transitively
 * (Play Services, react-native-screens, etc.) so we force-pin it on
 * every configuration via Gradle's resolutionStrategy.
 */
const FORCE_BLOCK = `
configurations.all {
    resolutionStrategy {
        // Force Material 1.13.x — drops deprecated LAYOUT_IN_DISPLAY_CUTOUT_MODE_*
        // references that show up in Play Console deprecated-APIs report.
        force 'com.google.android.material:material:1.13.0-alpha09'
    }
}
`;

module.exports = function withAndroidMaterialPin(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.contents.includes("force 'com.google.android.material:material")) {
      return config;
    }
    config.modResults.contents = config.modResults.contents + '\n' + FORCE_BLOCK + '\n';
    return config;
  });
};
