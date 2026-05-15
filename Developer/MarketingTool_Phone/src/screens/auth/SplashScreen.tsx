import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { Colors } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

// App logo - MarketingTool M+signal icon
const AppLogo = require('../../../assets/images/logo-icon.webp');

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoGlowWrapper}>
          <Animated.View style={[styles.logoGlow, { opacity: glowAnim }]} />
          <View style={styles.logoWrapper}>
            <Image
              source={AppLogo}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>
        <Animated.Text style={styles.brandText}>MarketingTool</Animated.Text>
        <Animated.Text style={styles.taglineText}>AI-Powered Marketing</Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#060b28',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoGlowWrapper: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 20,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#060b28',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
  },
  logoImage: {
    width: 70,
    height: 70,
  },
  brandText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  taglineText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
