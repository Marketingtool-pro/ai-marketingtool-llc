const validPaletteKeys = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];
const isValidPaletteKey = (value) => validPaletteKeys.includes(value);

/***************************  COMPONENT - LINEAR PROGRESS  ***************************/

export default function LinearProgress(theme) {
  return {
    MuiLinearProgress: {
      defaultProps: {
        variant: 'determinate'
      },
      styleOverrides: {
        root: ({ ownerState }) => {
          const paletteColor = isValidPaletteKey(ownerState.color) ? theme.vars.palette[ownerState.color] : undefined;
          return {
            ...(paletteColor && {
              '& .MuiLinearProgress-bar': {
                backgroundColor: paletteColor.main,
                ...theme.applyStyles('dark', { backgroundColor: paletteColor.light })
              }
            }),
            borderRadius: 24,
            backgroundColor: theme.vars.palette.grey[100],
            ...theme.applyStyles('dark', { backgroundColor: theme.vars.palette.grey[300] }),
            variants: [
              {
                props: { type: 'light' },
                style: {
                  '& .MuiLinearProgress-bar': {
                    opacity: 0.6
                  }
                }
              }
            ]
          };
        },
        bar: {
          borderRadius: 24
        }
      }
    }
  };
}
