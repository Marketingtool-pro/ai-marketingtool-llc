/***************************  OVERRIDES - TABLE HEAD  ***************************/

export default function TableHead(theme) {
  return {
    MuiTableHead: {
      styleOverrides: {
        root: { background: theme.vars.palette.grey[100] }
      }
    }
  };
}
