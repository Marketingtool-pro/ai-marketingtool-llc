const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * REFINED FIREBASE & IAP FIX
 * 1. Mandatory CocoaPods sources (Specs + CDN)
 * 2. $RNFirebaseAsStaticFramework = true
 * 3. Robust modular headers
 * 4. Xcode 16/26 compatibility
 */
module.exports = function withEasPodfileFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      if (!fs.existsSync(podfilePath)) return config;

      let contents = fs.readFileSync(podfilePath, 'utf8');

      // 1. Mandatory Sources - fixes "Unable to find a specification for RCT-Folly"
      const mandatorySources = [
        "source 'https://github.com/CocoaPods/Specs.git'",
        "source 'https://cdn.cocoapods.org/'"
      ];
      mandatorySources.forEach(src => {
        if (!contents.includes(src)) contents = src + '\n' + contents;
      });

      // 2. Set global static framework flag
      if (!contents.includes('$RNFirebaseAsStaticFramework = true')) {
        contents = '$RNFirebaseAsStaticFramework = true\n' + contents;
      }

      // 3. Robust Patch Snippet
      const snippet = `
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |bc|
        bc.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
        bc.build_settings['CLANG_ENABLE_MODULES'] = 'YES'
        bc.build_settings['SWIFT_ENABLE_EXPLICIT_MODULES'] = 'NO'
        bc.build_settings['CLANG_ENABLE_EXPLICIT_MODULES'] = 'NO'
        bc.build_settings['SWIFT_STRICT_CONCURRENCY'] = 'minimal'
        bc.build_settings['OTHER_SWIFT_FLAGS'] = '$(inherited) -Xfrontend -strict-concurrency=minimal'

        if target.name == 'ExpoModulesCore'
          bc.build_settings['SWIFT_VERSION'] = '6.0'
        else
          bc.build_settings['SWIFT_VERSION'] = '5'
        end

        if target.name.start_with?('RNFB') || target.name.start_with?('RNIap')
          bc.build_settings['HEADER_SEARCH_PATHS'] = '$(inherited) "$(PODS_ROOT)/Headers/Public/React-Core" "$(PODS_ROOT)/Headers/Public/React-RCTBridge" "$(PODS_ROOT)/Headers/Public/FirebaseCore" "$(PODS_ROOT)/Headers/Public/FirebaseAuth" "$(PODS_ROOT)/Headers/Public/FirebaseAppCheck"'
          bc.build_settings['DEFINES_MODULE'] = 'NO'
        end

        if target.name.include?('react-native-skia')
          bc.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
        end
      end
    end`;

      // Unique sentinel so this plugin's snippet is detected regardless of what
      // other inline plugins (past or future) may inject into the Podfile.
      const PLUGIN_SENTINEL = '# --- withEasPodfileFix-v3 ---';
      const snippetWithSentinel = `\n    ${PLUGIN_SENTINEL}${snippet}`;

      // Inject into post_install
      if (contents.includes('post_install do |installer|')) {
        if (!contents.includes(PLUGIN_SENTINEL)) {
          contents = contents.replace('post_install do |installer|', 'post_install do |installer|' + snippetWithSentinel);
        }
      } else {
        contents += `\npost_install do |installer|\n${snippet}\nend\n`;
      }

      fs.writeFileSync(podfilePath, contents);
      return config;
    },
  ]);
};
