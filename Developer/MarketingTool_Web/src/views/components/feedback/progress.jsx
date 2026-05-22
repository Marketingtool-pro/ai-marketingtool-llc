// @mui
import Grid from '@mui/material/Grid';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import {
  BasicProgress,
  ColorProgress,
  LightColorProgress,
  SizeProgress,
  WithLabelProgress,
  WithLabelSizeProgress,
  TragerProgress
} from '@/sections/components/progress';

/***************************  FEEDBACK - PROGRESS  ***************************/

export default function FeedbackProgress() {
  return (
    <ComponentsWrapper title="Progress">
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <BasicProgress />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <SizeProgress />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <ColorProgress />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <LightColorProgress />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <WithLabelProgress />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <WithLabelSizeProgress />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TragerProgress />
        </Grid>
      </Grid>
    </ComponentsWrapper>
  );
}
