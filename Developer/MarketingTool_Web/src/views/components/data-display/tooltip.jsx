// @mui
import Grid from '@mui/material/Grid';

// @assets
import ComponentsWrapper from '@/components/ComponentsWrapper';
import { BasicTooltip, IconTooltip, WithContentTooltip } from '@/sections/components/tooltip';

/***************************  DATA DISPLAY - TOOLTIP  ***************************/

export default function DataDisplayTooltip() {
  return (
    <ComponentsWrapper title="Tooltip">
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12 }}>
          <BasicTooltip />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <IconTooltip />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <WithContentTooltip />
        </Grid>
      </Grid>
    </ComponentsWrapper>
  );
}
