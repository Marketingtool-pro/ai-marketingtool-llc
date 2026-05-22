// @project
import { withAlpha } from '@/utils/colorUtils';

const colors = ['primary', 'secondary', 'success', 'error', 'warning', 'info'];

/***************************  COMPONENT - SLIDER  ***************************/

export default function Slider(theme) {
  // Generate color variants for the Slider component
  const colorVariants = colors.map((color) => {
    const paletteColor = theme.vars.palette[color];
    return {
      props: { color },
      style: {
        '& .MuiSlider-track': {
          ...theme.applyStyles('dark', { backgroundColor: paletteColor.light, borderColor: paletteColor.light })
        },
        '& .MuiSlider-thumb': {
          borderColor: paletteColor.main,
          ...theme.applyStyles('dark', { borderColor: paletteColor.light }),
          '&:focus, &:hover, &.Mui-focusVisible': {
            boxShadow: `0px 0px 0px 4px ${withAlpha(paletteColor.main, 0.2)}`
          },
          '&:active': {
            boxShadow: `0px 0px 0px 8px ${withAlpha(paletteColor.main, 0.5)}`
          }
        },
        '& .MuiSlider-valueLabel': {
          color: paletteColor.darker,
          backgroundColor: paletteColor.lighter,
          ...theme.applyStyles('dark', { color: theme.vars.palette.background.default, backgroundColor: paletteColor.light })
        }
      }
    };
  });

  return {
    MuiSlider: {
      styleOverrides: {
        track: {
          height: 6
        },
        thumb: {
          width: 10,
          height: 10,
          border: `2px solid ${theme.vars.palette.primary.main}`,
          backgroundColor: theme.vars.palette.background.default
        },
        rail: {
          height: 8,
          opacity: 1,
          color: theme.vars.palette.grey[100],
          ...theme.applyStyles('dark', { color: theme.vars.palette.grey[300] })
        },
        valueLabel: {
          ...theme.typography.caption,
          minWidth: 40,
          padding: 6,
          borderRadius: 8,
          top: -12,
          '&:before': {
            width: 10,
            height: 10
          }
        },
        root: {
          variants: [...colorVariants],
          '&.Mui-disabled': {
            '& .MuiSlider-rail': {
              opacity: 0.25
            },
            '& .MuiSlider-track': {
              backgroundColor: theme.vars.palette.action.disabled,
              borderColor: 'transparent'
            },
            '& .MuiSlider-thumb': {
              border: '2px solid',
              borderColor: theme.vars.palette.action.disabled
            }
          }
        }
      }
    }
  };
}
