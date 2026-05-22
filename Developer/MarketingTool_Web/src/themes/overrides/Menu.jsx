/***************************  OVERRIDES - MENU  ***************************/

export default function Menu(theme) {
  return {
    MuiMenu: {
      defaultProps: {
        slotProps: {
          paper: {
            elevation: 0,
            sx: {
              minWidth: 150,
              padding: 0.5,
              border: `1px solid ${theme.vars.palette.divider}`,
              borderRadius: 3,
              boxShadow: theme.vars.customShadows.tooltip
            }
          }
        }
      },
      styleOverrides: {
        list: { padding: 0 }
      }
    }
  };
}
