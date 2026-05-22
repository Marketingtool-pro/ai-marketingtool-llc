/***************************  OVERRIDES - PICKERS ARROW SWITCHER  ***************************/

export default function PickersArrowSwitcher(theme) {
  return {
    MuiPickersArrowSwitcher: {
      styleOverrides: {
        root: {
          '& .MuiPickersArrowSwitcher-button': { height: 36, width: 36, padding: 10 },
          svg: { width: 16, height: 16, color: theme.vars.palette.text.secondary }
        }
      }
    }
  };
}
