/***************************  OVERRIDES - PICKERS POPPER  ***************************/

export default function PickersPopper(theme) {
  return {
    MuiPickersPopper: {
      defaultProps: {
        slotProps: { paper: { elevation: 0 } }
      },
      styleOverrides: {
        root: {
          '& .MuiPaper-root': {
            borderRadius: 8,
            border: `1px solid ${theme.vars.palette.divider}`,
            boxShadow: theme.vars.customShadows.tooltip,
            backgroundImage: 'none'
          }
        }
      }
    }
  };
}
