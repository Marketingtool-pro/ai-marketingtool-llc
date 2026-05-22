import Box from '@mui/material/Box';

// @project
import { ThemeDirection } from '@/config';
import { generateFocusStyle } from '@/utils/generateFocusStyle';

// @assets
import { IconSquare, IconSquareCheckFilled, IconSquareMinusFilled } from '@tabler/icons-react';

const colors = ['primary', 'secondary', 'success', 'error', 'warning', 'info'];

/***************************  OVERRIDES - CHECKBOX  ***************************/

export default function Checkbox(theme) {
  const colorVariants = colors.map((color) => {
    const paletteColor = theme.vars.palette[color];

    return {
      props: { color },
      style: {
        ...theme.applyStyles('dark', {
          '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: paletteColor.light }
        })
      }
    };
  });

  return {
    MuiCheckbox: {
      defaultProps: {
        disableFocusRipple: true,
        icon: (
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              // dynamically set color based on theme mode
              ...theme.applyStyles('light', { color: theme.vars.palette.grey[500] }),
              ...theme.applyStyles('dark', { color: theme.vars.palette.grey[700] })
            }}
          >
            <IconSquare stroke={1} size={16} color="currentColor" />
          </Box>
        ),
        checkedIcon: <IconSquareCheckFilled stroke={1} size={16} />,
        indeterminateIcon: <IconSquareMinusFilled stroke={1} size={16} />
      },
      styleOverrides: {
        root: {
          variants: [...colorVariants],
          padding: 6.675,
          ...(theme.direction !== ThemeDirection.RTL && { marginLeft: 2.325 }), // 9 - 6.675 = For fix position of checkbox according to custom padding
          ...(theme.direction === ThemeDirection.RTL && { marginRight: 2.325 }),
          borderRadius: 4,
          color: theme.vars.palette.grey[500],
          '&:hover:not(.Mui-checked):not(.MuiCheckbox-indeterminate)': {
            color: theme.vars.palette.grey[600]
          },
          '& ~ .MuiFormControlLabel-label': theme.typography.body2,
          '& svg': { width: 21.34, height: 21.34 },
          '&.Mui-disabled': {
            cursor: 'not-allowed',
            pointerEvents: 'auto',
            ...theme.applyStyles('dark', { opacity: 0.5 }),
            '&:hover': {
              backgroundColor: 'transparent'
            }
          },
          '& .MuiTouchRipple-root span': {
            borderRadius: 4
          },
          '&.Mui-focusVisible': {
            '& svg': { borderRadius: 4, ...generateFocusStyle(theme.vars.palette.primary.main) }
          }
        },
        sizeSmall: {
          '& ~ .MuiFormControlLabel-label': theme.typography.caption,
          '& svg': { width: 18.6725, height: 18.6725 }
        },
        sizeLarge: {
          '& ~ .MuiFormControlLabel-label': theme.typography.body1,
          '& svg': { width: 26.675, height: 26.675 }
        }
      }
    }
  };
}
