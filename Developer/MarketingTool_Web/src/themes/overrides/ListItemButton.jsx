/***************************  OVERRIDES - MENU  ***************************/

export default function ListItemButton(theme) {
  return {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          padding: '10px 8px',
          borderRadius: 4,
          '&.Mui-selected': {
            backgroundColor: theme.vars.palette.primary.lighter,
            '&:hover': { backgroundColor: theme.vars.palette.primary.light },
            ...theme.applyStyles('dark', {
              backgroundColor: theme.vars.palette.primary.main,
              color: theme.vars.palette.background.default,
              '&:hover': { backgroundColor: theme.vars.palette.primary.light }
            })
          }
        }
      }
    }
  };
}
