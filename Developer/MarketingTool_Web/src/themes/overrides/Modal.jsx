/***************************  OVERRIDES - MODAL  ***************************/

export default function Modal() {
  return {
    MuiModal: {
      styleOverrides: {
        root: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
      }
    }
  };
}
