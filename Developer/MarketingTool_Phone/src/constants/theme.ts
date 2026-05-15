// MarketingTool Theme - Dark Mode (Vision UI Pro inspired)
export const Colors = {
  // Primary Brand Colors (Deep Navy)
  primary: '#0f1535',
  primaryLight: '#131538',
  primaryDark: '#0D0F1C',

  // Secondary Colors (Purple - CTAs & accents)
  secondary: '#7C3AED',
  secondaryLight: '#8B5CF6',
  secondaryDark: '#6D28D9',

  // Accent Colors (Purple/Violet)
  accent: '#7C3AED',
  accentLight: '#A78BFA',
  accentDark: '#6D28D9',

  // Success/Error/Warning
  success: '#01B574',
  successLight: '#34D399',
  error: '#E31A1A',
  errorLight: '#FF5166',
  warning: '#FFB547',
  warningLight: '#FBC04C',
  info: '#0075FF',

  // Background Colors (Vision UI Dark)
  background: '#0D0F1C',
  backgroundSecondary: '#0f1535',
  backgroundTertiary: '#131538',
  card: 'rgba(22, 24, 36, 0.8)',
  cardHover: 'rgba(22, 24, 36, 0.7)',

  // Surface Colors
  surface: 'rgba(40, 40, 40, 0.7)', // SimpleSocial $bg-surface
  surfaceLight: 'rgba(255, 255, 255, 0.05)',
  surfaceDark: '#121212', // SimpleSocial $n4

  // Text Colors
  text: 'rgba(248, 248, 248, 0.95)', // SimpleSocial $text-primary
  textSecondary: 'rgba(248, 248, 248, 0.7)', // SimpleSocial $text-secondary
  textTertiary: 'rgba(248, 248, 248, 0.5)', // SimpleSocial $text-tertiary
  textMuted: '#4A5568',
  textInverse: '#060b28',

  // Border Colors
  border: 'rgba(255, 255, 255, 0.06)',
  borderLight: 'rgba(255, 255, 255, 0.08)',
  borderFocus: '#7C3AED',

  // Gradient Colors
  gradientStart: '#0D0F1C',
  gradientEnd: '#131538',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',

  // Glassmorphism (Vision UI style)
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.06)',
  glassLight: 'rgba(255, 255, 255, 0.08)',
  glassDark: 'rgba(0, 0, 0, 0.3)',
  glassCard: 'rgba(22, 24, 36, 0.55)',
  glassAccent: 'rgba(124, 58, 237, 0.12)',

  // Transparent
  transparent: 'transparent',

  // White/Black
  white: '#FFFFFF',
  black: '#000000',

  // Additional Colors
  gold: '#FFB547',
  green: '#01B574',
  purple: '#7C3AED',
  blue: '#0075FF',
  cyan: '#00D9FF',
};

export const Gradients: Record<string, readonly [string, string, ...string[]]> = {
  primary: ['#0f1535', '#060b28'] as const,
  secondary: ['#7C3AED', '#6D28D9'] as const,
  accent: ['#7C3AED', '#A78BFA'] as const,
  card: ['rgba(22, 24, 36, 0.55)', 'rgba(22, 24, 36, 0.4)'] as const,
  button: ['#7C3AED', '#8B5CF6'] as const,
  success: ['#01B574', '#34D399'] as const,
  dark: ['#060b28', '#0f1535'] as const,
  premium: ['#131538', '#0f1535'] as const,
  gold: ['#FFB547', '#F39C12'] as const,
  purple: ['#7C3AED', '#A78BFA'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
  title: 28,
  header: 36,
};

export const FontFamily = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  glowPurple: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  glowGreen: {
    shadowColor: '#01B574',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  glassSubtle: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};

// Glassmorphism style helper (Vision UI style)
export const GlassStyle = {
  card: {
    backgroundColor: 'rgba(22, 24, 36, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
  },
  cardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  input: {
    backgroundColor: 'rgba(22, 24, 36, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  button: {
    backgroundColor: 'rgba(124, 58, 237, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
};

export const Theme = {
  colors: Colors,
  gradients: Gradients,
  spacing: Spacing,
  fontSize: FontSize,
  fontFamily: FontFamily,
  borderRadius: BorderRadius,
  shadow: Shadow,
};

export default Theme;
