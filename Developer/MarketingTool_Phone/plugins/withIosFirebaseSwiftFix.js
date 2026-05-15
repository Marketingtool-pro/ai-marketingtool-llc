const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Custom Firebase Swift Fix for Expo SDK 55
 * Handles AppDelegate.swift initialization which the official plugins fail at.
 */
module.exports = function withIosFirebaseSwiftFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const appDelegatePath = path.join(
        config.modRequest.platformProjectRoot,
        config.modRequest.projectName,
        'AppDelegate.swift'
      );

      if (!fs.existsSync(appDelegatePath)) {
        console.log('AppDelegate.swift not found, skipping Swift fix.');
        return config;
      }

      let content = fs.readFileSync(appDelegatePath, 'utf8');

      // 1. Add Firebase Import
      if (!content.includes('import Firebase')) {
        content = 'import Firebase\n' + content;
      }

      // 2. Add FirebaseApp.configure() in didFinishLaunchingWithOptions
      if (content.includes('func application(_ application: UIApplication, didFinishLaunchingWithOptions')) {
        if (!content.includes('FirebaseApp.configure()')) {
          content = content.replace(
            /func application\(_ application: UIApplication, didFinishLaunchingWithOptions[\s\S]*?\{/,
            (match) => `${match}\n    FirebaseApp.configure()`
          );
        }
      }

      fs.writeFileSync(appDelegatePath, content);
      return config;
    },
  ]);
};
