import { createTamagui } from 'tamagui'
import { config as configV3 } from '@tamagui/config/v3'

export const config = createTamagui({
  ...configV3,
  themes: {
    light: {
      background: '#ffffff',
      color: '#000000',
    },
    dark: {
      background: '#060b28',
      color: '#ffffff',
    }
  },
  defaultTheme: 'dark',
  shouldAddPrefersColorScheme: true,
  themeClassNameOnRoot: false,
})

export type AppConfig = typeof config
declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
export default config
