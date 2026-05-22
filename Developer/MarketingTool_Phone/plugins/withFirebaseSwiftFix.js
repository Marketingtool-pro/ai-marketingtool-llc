const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Firebase Swift AppDelegate Fix for Expo SDK 55+
 *
 * The @react-native-firebase/app plugin only supports Objective-C AppDelegate.
 * Expo SDK 55 uses Swift AppDelegate, causing:
 *   "Cannot add Firebase code to AppDelegate of language swift"
 *
 * Fix: Patch the Firebase plugin source file on disk so it returns a no-op
 * for Swift, then use withDangerousMod to manually inject Firebase into Swift.
 */

// Patch the Firebase plugin FILE on disk (not in memory)
try {
  const firebaseAppDelegatePath = require.resolve(
    '@react-native-firebase/app/plugin/build/ios/appDelegate.js'
  );
  let src = fs.readFileSync(firebaseAppDelegatePath, 'utf8');

  // Only patch if not already patched
  if (!src.includes('SWIFT_PATCHED')) {
    const original = `async function modifyAppDelegateAsync(appDelegateFileInfo) {
    const { language, contents } = appDelegateFileInfo;
    if (!['objc', 'objcpp'].includes(language)) {
        throw new Error(\`Cannot add Firebase code to AppDelegate of language "\${language}"\`);
    }`;

    const patched = `async function modifyAppDelegateAsync(appDelegateFileInfo) {
    const { language, contents } = appDelegateFileInfo; // SWIFT_PATCHED
    if (!['objc', 'objcpp'].includes(language)) {
        console.log('[Firebase] Skipping ObjC plugin for ' + language + ' AppDelegate');
        return appDelegateFileInfo;
    }`;

    if (src.includes('Cannot add Firebase code to AppDelegate of language')) {
      src = src.replace(
        /async function modifyAppDelegateAsync\(appDelegateFileInfo\)\s*\{[^}]*?throw new Error\(`Cannot add Firebase code[^`]*`\);[^}]*?\}/s,
        `async function modifyAppDelegateAsync(appDelegateFileInfo) {
    const { language, contents } = appDelegateFileInfo; // SWIFT_PATCHED
    if (!['objc', 'objcpp'].includes(language)) {
        console.log('[Firebase] Skipping ObjC plugin for ' + language + ' AppDelegate');
        return appDelegateFileInfo;
    }
    // Original ObjC logic continues below`
      );
      fs.writeFileSync(firebaseAppDelegatePath, src);
      console.log('[withFirebaseSwiftFix] Patched Firebase appDelegate.js on disk');
    } else {
      console.warn('[withFirebaseSwiftFix] Could not find throw pattern in Firebase plugin');
    }
  } else {
    console.log('[withFirebaseSwiftFix] Firebase plugin already patched');
  }
} catch (e) {
  console.warn('[withFirebaseSwiftFix] Could not patch Firebase plugin:', e.message);
}

module.exports = function withFirebaseSwiftFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const appDelegatePath = path.join(
        config.modRequest.platformProjectRoot,
        config.modRequest.projectName,
        'AppDelegate.swift'
      );

      if (!fs.existsSync(appDelegatePath)) {
        console.warn('[withFirebaseSwiftFix] AppDelegate.swift not found, skipping');
        return config;
      }

      let content = fs.readFileSync(appDelegatePath, 'utf8');

      // 1. Add import if missing
      if (!content.includes('import Firebase')) {
        content = 'import Firebase\n' + content;
      }

      // 2. Add FirebaseApp.configure() to didFinishLaunchingWithOptions
      if (!content.includes('FirebaseApp.configure()')) {
        const searchPattern = /didFinishLaunchingWithOptions[\s\S]*?\{/;
        content = content.replace(searchPattern, (match) => {
          return `${match}\n    FirebaseApp.configure()`;
        });
      }

      fs.writeFileSync(appDelegatePath, content);
      console.log('[withFirebaseSwiftFix] Injected Firebase into AppDelegate.swift');
      return config;
    },
  ]);
};
