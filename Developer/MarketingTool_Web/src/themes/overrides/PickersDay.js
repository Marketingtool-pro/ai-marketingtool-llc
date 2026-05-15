/***************************  OVERRIDES - PICKERS DAY  ***************************/

export default function PickersDay(theme) {
  return {
    MuiPickersDay: {
      styleOverrides: {
        root: {
          ...theme.typography.body1,
          color: theme.vars.palette.grey[700],
          ':not(.Mui-selected)': {
            borderColor: theme.vars.palette.primary.main
          }
        },
        today: {
          color: theme.vars.palette.primary.main
        }
      }
    }
  };
}
