// @mui
import Grid from '@mui/material/Grid';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import { BasicSlider, ColorSlider } from '@/sections/components/slider';

/***************************  INPUTS - SLIDER  ***************************/

export default function InputsSlider() {
  return (
    <ComponentsWrapper title="Slider">
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <BasicSlider />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <ColorSlider />
        </Grid>
      </Grid>
    </ComponentsWrapper>
  );
}
