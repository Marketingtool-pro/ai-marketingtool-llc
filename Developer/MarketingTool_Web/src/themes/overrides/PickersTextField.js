/***************************  OVERRIDES - PICKERS TEXT FIELD  ***************************/

export default function PickersTextField() {
  return {
    MuiPickersTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
        color: 'primary'
      }
    }
  };
}
