// @mui
import Grid from '@mui/material/Grid';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import { BasicRadio, ContentRadio, ColorRadio, LabelRadio, SizeRadio } from '@/sections/components/radio';

/***************************  INPUTS - RADIO  ***************************/

export default function InputsRadio() {
  return (
    <ComponentsWrapper title="Radio">
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <BasicRadio />
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <LabelRadio />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <ColorRadio />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <SizeRadio />
        </Grid>
        <Grid size={12}>
          <ContentRadio />
        </Grid>
      </Grid>
    </ComponentsWrapper>
  );
}
