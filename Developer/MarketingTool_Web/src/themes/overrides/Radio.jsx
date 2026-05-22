import Box from '@mui/material/Box';

// @project
import { generateFocusStyle } from '@/utils/generateFocusStyle';

const colors = ['primary', 'secondary', 'success', 'error', 'warning', 'info'];

/***************************  OVERRIDES - RADIO  ***************************/

export default function Radio(theme) {
  // Generate color variants for the Radio component
  const colorVariants = colors.map((color) => {
    const paletteColor = theme.vars.palette[color];
    return {
      props: { color },
      style: {
        '& .MuiRadio-blueprint.Mui-checked': {
          borderColor: paletteColor.main,
          ...theme.applyStyles('dark', { borderColor: paletteColor.light })
        }
      }
    };
  });

  return {
    MuiRadio: {
      defaultProps: {
        disableFocusRipple: true,
        icon: (
          <Box
            className="MuiRadio-blueprint"
            sx={{
              border: `1px solid ${theme.vars.palette.grey[500]}`,
              ...theme.applyStyles('dark', { borderColor: theme.vars.palette.grey[700] })
            }}
          />
        ),
        checkedIcon: <Box className="MuiRadio-blueprint Mui-checked" sx={{ border: `4px solid ${theme.vars.palette.primary.main}` }} />
      },
      styleOverrides: {
        root: {
          padding: 6,
          marginLeft: 4,
          marginRight: 4,
          '& .MuiRadio-blueprint': {
            borderRadius: '50%',
            borderColor: theme.vars.palette.grey[500],
            ...theme.applyStyles('dark', { borderColor: theme.vars.palette.grey[700] }),
            width: 16,
            height: 16
          },
          '&:hover:not(.Mui-checked):not(.Mui-disabled) .MuiRadio-blueprint': {
            borderColor: theme.vars.palette.grey[700]
          },
          '& ~ .MuiFormControlLabel-label': theme.typography.body2,
          '&.Mui-disabled': {
            '& .MuiRadio-blueprint, .MuiRadio-blueprint.Mui-checked': {
              borderColor: theme.vars.palette.action.disabledBackground
            },
            cursor: 'not-allowed',
            pointerEvents: 'auto',
            '&:hover': {
              backgroundColor: 'transparent'
            }
          },
          '&.Mui-focusVisible': { '& .MuiRadio-blueprint': generateFocusStyle(theme.vars.palette.primary.main) },
          variants: [...colorVariants]
        },
        sizeSmall: {
          '& ~ .MuiFormControlLabel-label': theme.typography.caption,
          '& .MuiRadio-blueprint': { width: 14, height: 14 }
        },
        sizeLarge: {
          '& ~ .MuiFormControlLabel-label': theme.typography.body1,
          '& .MuiRadio-blueprint': { width: 20, height: 20, '&.Mui-checked': { borderWidth: 6 } }
        }
      }
    }
  };
}
