const withAndroidAbiFilters = require('./plugins/withAndroidAbiFilters');

// Authoritative plugin list lives in app.json. This file ONLY appends plugins
// that aren't representable as plain JSON (require()-based modules taking
// runtime options). Do NOT redefine `plugins` from scratch — that silently
// drops critical entries (RecaptchaEnterprise extraPod, messaging,
// expo-notifications, app-check, withIosFirebaseSwiftFix) and breaks Firebase
// Phone Auth on iOS with `auth/unknown reCAPTCHA SDK not linked`.
module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins || []),
    [withAndroidAbiFilters],
  ],
});
