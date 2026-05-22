// @mui
import Grid from '@mui/material/Grid';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import { BasicSwitch, ColorSwitch, ContentSwitch, LabelPositionSwitch, LabelSwitch, SizeSwitch } from '@/sections/components/switch';

/***************************  INPUTS - SWITCH  ***************************/

export default function InputsSwitch() {
  return (
    <ComponentsWrapper title="Switch">
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <BasicSwitch />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <ColorSwitch />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2.7 }}>
          <SizeSwitch />
        </Grid>
        <Grid size={{ xs: 12, sm: 8, md: 4.8 }}>
          <LabelSwitch />
        </Grid>
        <Grid size={{ xs: 12, md: 4.5 }}>
          <LabelPositionSwitch />
        </Grid>
        <Grid size={12}>
          <ContentSwitch />
        </Grid>
      </Grid>
    </ComponentsWrapper>
  );
}
