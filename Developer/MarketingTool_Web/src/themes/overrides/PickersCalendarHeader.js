/***************************  OVERRIDES - PICKERS CALENDAR HEADER  ***************************/

export default function PickersCalendarHeader(theme) {
  return {
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          '& .MuiPickersCalendarHeader-switchViewIcon': {
            fill: theme.vars.palette.text.secondary
          }
        },
        label: {
          ...theme.typography.subtitle2
        }
      }
    }
  };
}
