module.exports = {
  dependencies: {
    'react-native-iap': {
      platforms: {
        ios: null, // MUST STAY — RNIap has compilation errors with Expo SDK 55 autolinking. iOS pod is included via patched podspec + withEasPodfileFix plugin.
      },
    },
  },
};
