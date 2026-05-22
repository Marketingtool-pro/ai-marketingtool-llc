const { withProjectBuildGradle, withAppBuildGradle, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const DEFAULTS = {
  kotlinVersion: '2.1.20',
  kspVersion: '2.1.20-1.0.32',
  agpVersion: '8.7.2',
  googlePlayServicesVersion: '18.0.0',
  gradleVersion: '8.13',
  crashlyticsVersion: '3.0.3',
  googleServicesVersion: '4.4.2'
};

/**
 * Android build.gradle + Gradle wrapper fixes for Expo SDK 55 / RN 0.83.
 * Includes Crashlytics build ID fix and 16 KB page size alignment.
 */
const withKotlinKspFix = (config, options) => {
  const opts = { ...DEFAULTS, ...(options || {}) };
  const { 
    kotlinVersion, kspVersion, agpVersion, 
    googlePlayServicesVersion, gradleVersion,
    crashlyticsVersion, googleServicesVersion
  } = opts;

  // 1. Project-level build.gradle
  config = withProjectBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') return config;
    let buildGradle = config.modResults.contents;

    // 🚨 CRITICAL FIX: Remove supportLibVersion from line 1
    buildGradle = buildGradle.replace(/^supportLibVersion\s*=\s*["'].*["']\s*/m, '');

    const varsToEnsure = [
      { name: 'kotlinVersion', value: `'${kotlinVersion}'` },
      { name: 'kspVersion', value: `'${kspVersion}'` },
      { name: 'googlePlayServicesVersion', value: `"${googlePlayServicesVersion}"` },
      { name: 'compileSdkVersion', value: '35' },
      { name: 'targetSdkVersion', value: '35' },
      { name: 'buildToolsVersion', value: '"35.0.0"' },
      { name: 'minSdkVersion', value: '24' },
    ];
    
    const missing = varsToEnsure.filter(v => !new RegExp(`\\b${v.name}\\s*=`).test(buildGradle));

    if (missing.length > 0) {
      const injectedLines = missing.map(v => `        ${v.name} = ${v.value}`).join('\n');
      if (/ext\s*\{/.test(buildGradle)) {
        buildGradle = buildGradle.replace(/ext\s*\{/, `ext {\n${injectedLines}`);
      } else {
        buildGradle = buildGradle.replace(/buildscript\s*\{/, `ext {\n${injectedLines}\n}\n\nbuildscript {`);
      }
    }

    // 🚨 AGP FIX
    if (!buildGradle.includes(`com.android.tools.build:gradle:${agpVersion}`)) {
        buildGradle = buildGradle.replace(
            /classpath\s*(?:\(\s*)?['"]com\.android\.tools\.build:gradle(?::[^'"]*)?['"]\s*\)?/g,
            `classpath("com.android.tools.build:gradle:${agpVersion}")`
        );
    }

    // Rewrite Kotlin gradle-plugin classpath
    if (!buildGradle.includes(`org.jetbrains.kotlin:kotlin-gradle-plugin:${kotlinVersion}`)) {
      buildGradle = buildGradle.replace(
        /classpath\s*(?:\(\s*)?['"]org\.jetbrains\.kotlin:kotlin-gradle-plugin(?::[^'"]*)?['"]\s*\)?/g,
        `classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:${kotlinVersion}")`
      );
    }

    // 🚨 Crashlytics Classpath FIX
    if (!buildGradle.includes('com.google.firebase:firebase-crashlytics-gradle')) {
        buildGradle = buildGradle.replace(
          /dependencies\s*\{/,
          `dependencies {
        classpath 'com.google.firebase:firebase-crashlytics-gradle:${crashlyticsVersion}'`
        );
    }
    if (!buildGradle.includes('com.google.gms:google-services')) {
        buildGradle = buildGradle.replace(
          /dependencies\s*\{/,
          `dependencies {
        classpath 'com.google.gms:google-services:${googleServicesVersion}'`
        );
    }

    const resolutionStrategy = `
allprojects {
    configurations.all {
        resolutionStrategy.eachDependency { DependencyResolveDetails details ->
            def requested = details.requested
            if (requested.group == 'org.jetbrains.kotlin' && requested.name.startsWith('kotlin-')) {
                details.useVersion kotlinVersion
            }
            if (requested.group == 'com.google.devtools.ksp') {
                details.useVersion kspVersion
            }
            // 🚨 Pin to SDK 35 compatible versions
            if (requested.group == 'androidx.core' && (requested.name == 'core-ktx' || requested.name == 'core')) {
                details.useVersion '1.15.0'
            }
            if (requested.group == 'androidx.activity') {
                details.useVersion '1.10.1'
            }
            if (requested.group == 'androidx.browser' && requested.name == 'browser') {
                details.useVersion '1.8.0'
            }
        }
    }
}
`;
    if (!buildGradle.includes('resolutionStrategy.eachDependency')) {
      buildGradle += resolutionStrategy;
    }

    config.modResults.contents = buildGradle;
    return config;
  });

  // 2. App-level build.gradle
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') return config;
    let contents = config.modResults.contents;

    // Apply plugins
    if (!contents.includes("apply plugin: 'com.google.gms.google-services'")) {
      contents += "\napply plugin: 'com.google.gms.google-services'";
    }
    if (!contents.includes("apply plugin: 'com.google.firebase.crashlytics'")) {
      contents += "\napply plugin: 'com.google.firebase.crashlytics'";
    }

    // 🚨 16 KB page size alignment fix
    if (!contents.includes("useLegacyPackaging = false")) {
      contents = contents.replace(
        /android\s*\{/,
        `android {
    packagingOptions {
        jniLibs {
            useLegacyPackaging = false
        }
    }`
      );
    }

    config.modResults.contents = contents;
    return config;
  });

  // 3. Gradle Wrapper
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.platformProjectRoot;
      const wrapperPath = path.join(projectRoot, 'gradle', 'wrapper', 'gradle-wrapper.properties');
      if (fs.existsSync(wrapperPath)) {
        let content = fs.readFileSync(wrapperPath, 'utf8');
        const lines = content.split('\n');
        const updatedLines = lines.map(line => {
          if (line.startsWith('distributionUrl=')) {
            return `distributionUrl=https\\://services.gradle.org/distributions/gradle-${gradleVersion}-bin.zip`;
          }
          return line;
        });
        fs.writeFileSync(wrapperPath, updatedLines.join('\n'));
      }
      return config;
    },
  ]);

  return config;
};

module.exports = withKotlinKspFix;
