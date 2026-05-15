// @mui
import Grid from '@mui/material/Grid';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import { Basic, Color, Content, Label, Size } from '@/sections/components/checkbox';

/***************************  INPUTS - CHECKBOX  ***************************/

export default function InputsCheckbox() {
  return (
    <ComponentsWrapper title="Checkbox">
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Basic />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Color />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Size />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Label />
        </Grid>
        <Grid size={12}>
          <Content />
        </Grid>
      </Grid>
    </ComponentsWrapper>
  );
}
