/***************************  OVERRIDES - CARD (DARK GLASS)  ***************************/

export default function Card(theme) {
  const isDark = theme.palette.mode === 'dark';

  return {
    MuiCard: {
      styleOverrides: {
        root: {
          ...(isDark && {
            background: 'rgba(10, 10, 14, 0.80)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.03)',
            boxShadow: 'inset 2px 4px 16px 0px rgba(0,0,0,0.25)',
            borderRadius: 24
          })
        }
      }
    }
  };
}
