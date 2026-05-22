// @project
import { extendPaletteWithChannels, withAlpha } from '@/utils/colorUtils';

/***************************  MARKETINGTOOL - PALETTE  ***************************/

export function buildPalette() {
  // ── Light Mode ──────────────────────────────────────────────
  const textPrimary = '#1B1B1F';
  const textSecondary = '#46464F';

  const secondaryMain = '#5A5C78';

  const divider = '#EFEDF4';
  const background = '#FFF';

  const disabled = '#777680';
  const disabledBackground = '#E4E1E6';

  const lightPalette = {
    primary: {
      lighter: '#EDE5FF',
      light: '#CD99FF',
      main: '#805AF5',
      dark: '#5C3DB8',
      darker: '#35316f'
    },
    secondary: {
      lighter: '#E0E0FF',
      light: '#C3C4E4',
      main: secondaryMain,
      dark: '#43455F',
      darker: '#171A31'
    },
    error: {
      lighter: '#FFEDEA',
      light: '#FFDAD6',
      main: '#FF0003',
      dark: '#BA1A1A',
      darker: '#690005'
    },
    warning: {
      lighter: '#FFF3E0',
      light: '#FFE0B2',
      main: '#FFC876',
      dark: '#F59E0B',
      darker: '#4A2800'
    },
    success: {
      lighter: '#C8FFC0',
      light: '#81D88A',
      main: '#3EB75E',
      dark: '#006E1C',
      darker: '#00390A'
    },
    info: {
      lighter: '#D4F7FF',
      light: '#80DEEA',
      main: '#1BA2DB',
      dark: '#006876',
      darker: '#00363E'
    },
    grey: {
      50: '#FBF8FF',
      100: '#F5F2FA',
      200: divider,
      300: '#EAE7EF',
      400: disabledBackground,
      500: '#DBD9E0',
      600: '#C7C5D0',
      700: disabled,
      800: textSecondary,
      900: textPrimary
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
      disabled: disabled
    },
    divider,
    background: {
      default: background
    },
    action: {
      hover: withAlpha(secondaryMain, 0.05),
      disabled: withAlpha(disabled, 0.6),
      disabledBackground: withAlpha(disabledBackground, 0.9)
    }
  };

  // ── Dark Mode (MarketingTool brand) ─────────────────────────
  const textPrimaryDark = '#FFFFFF';
  const textSecondaryDark = '#BCC3D7';

  const secondaryMainDark = '#9BA1B7';

  const dividerDark = 'rgba(255,255,255,0.05)';
  const backgroundDark = '#0E0C15';

  const disabledDark = '#6B7280';
  const disabledBackgroundDark = '#2E313D';

  const darkPalette = {
    primary: {
      lighter: '#35316f',
      light: '#9B7BF7',
      main: '#805AF5',
      dark: '#CD99FF',
      darker: '#EDE5FF'
    },
    secondary: {
      lighter: '#2E313D',
      light: '#6B7280',
      main: secondaryMainDark,
      dark: '#D1D5DB',
      darker: '#F3F4F6'
    },
    error: {
      lighter: '#7F1D1D',
      light: '#FF6B6B',
      main: '#FF0003',
      dark: '#FFDAD6',
      darker: '#FFF5F5'
    },
    warning: {
      lighter: '#78350F',
      light: '#FFD93D',
      main: '#FFC876',
      dark: '#FFF3E0',
      darker: '#FFFBEB'
    },
    success: {
      lighter: '#064E3B',
      light: '#6EE7B7',
      main: '#3EB75E',
      dark: '#C8FFC0',
      darker: '#ECFDF5'
    },
    info: {
      lighter: '#164E63',
      light: '#67E8F9',
      main: '#1BA2DB',
      dark: '#D4F7FF',
      darker: '#ECFEFF'
    },
    grey: {
      50: '#0E0C15',   // deepest surface (matches background)
      100: '#16181E',   // surface container low
      200: '#1A1C24',   // surface container
      300: '#21242D',   // surface container high
      400: '#2E313D',   // surface container highest
      500: '#0E0C15',   // surface container lowest
      600: '#374151',   // outline variant
      700: disabledDark, // outline
      800: textSecondaryDark,
      900: textPrimaryDark
    },
    text: {
      primary: textPrimaryDark,
      secondary: textSecondaryDark,
      disabled: disabledDark
    },
    divider: dividerDark,
    background: {
      default: backgroundDark,
      paper: '#0A0A0E'
    },
    action: {
      hover: withAlpha(secondaryMainDark, 0.08),
      disabled: withAlpha(disabledDark, 0.6),
      disabledBackground: withAlpha(disabledBackgroundDark, 0.9)
    }
  };

  const commonColor = { common: { black: '#000', white: '#fff' } };

  const extendedLight = extendPaletteWithChannels(lightPalette);
  const extendedDark = extendPaletteWithChannels(darkPalette);
  const extendedCommon = extendPaletteWithChannels(commonColor);

  return {
    light: {
      mode: 'light',
      ...extendedCommon,
      ...extendedLight
    },
    dark: {
      mode: 'dark',
      ...extendedCommon,
      ...extendedDark
    }
  };
}
