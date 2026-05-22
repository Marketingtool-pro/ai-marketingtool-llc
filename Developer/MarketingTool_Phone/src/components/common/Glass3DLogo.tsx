import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/theme';

interface Glass3DLogoProps {
  type: 'seo' | 'ads' | 'ai' | 'social';
  size?: number;
}

const typeColors: Record<string, string[]> = {
  seo: [Colors.success, '#34d399'],
  ads: [Colors.accent, '#a78bfa'],
  ai: [Colors.secondary || '#818cf8', '#6366f1'],
  social: [Colors.info || '#38bdf8', '#0ea5e9'],
};

export const Glass3DLogo = ({ type, size = 60 }: Glass3DLogoProps) => {
  const colors = typeColors[type] || typeColors.ai;
  const innerSize = size * 0.6;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.glow, { width: size, height: size, borderRadius: size / 2, backgroundColor: colors[0] + '30' }]} />
      <LinearGradient
        colors={[colors[0] + 'CC', colors[1] + '99']}
        style={[styles.inner, { width: innerSize, height: innerSize, borderRadius: innerSize * 0.3 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
  },
  inner: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default Glass3DLogo;
