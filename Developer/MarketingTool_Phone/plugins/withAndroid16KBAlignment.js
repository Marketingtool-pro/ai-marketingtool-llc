const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Config plugin to enable 16 KB page alignment for Android native libraries.
 * This adds 'pageAlignTo16KB = true' to the android.packaging block in app/build.gradle.
 */
const withAndroid16KBAlignment = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      let buildGradle = config.modResults.contents;

      // 1. Ensure the packaging block exists and has pageAlignTo16KB = true
      const packagingConfig = `
    packaging {
        jniLibs {
            useLegacyPackaging = false
            pageAlignTo16KB = true
        }
    }`;

      // 2. Add C++ max-page-size flags
      const cppFlags = `
    externalNativeBuild {
        cmake {
            cppFlags "-Wl,-z,max-page-size=16384"
        }
    }`;

      if (buildGradle.includes('packaging {')) {
        if (!buildGradle.includes('pageAlignTo16KB = true')) {
          buildGradle = buildGradle.replace(/packaging\s*\{/, 'packaging {\n        jniLibs { useLegacyPackaging = false; pageAlignTo16KB = true }');
        }
      } else {
        buildGradle = buildGradle.replace(/android\s*\{/, `android {${packagingConfig}${cppFlags}`);
      }

      config.modResults.contents = buildGradle;
    }
    return config;
  });
};

module.exports = withAndroid16KBAlignment;
