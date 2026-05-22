// @mui
import Grid from '@mui/material/Grid';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import { PerformanceChart, TrafficInDevice, SaleMappingChart, LineChart, BarChart, RadialChart } from '@/sections/components/chart';

/***************************  COMPONENT - CHART  ***************************/

export default function Chart() {
  return (
    <ComponentsWrapper title="Charts">
      <Grid container spacing={3}>
        <Grid size={12}>
          <LineChart />
        </Grid>
        <Grid size={12}>
          <BarChart />
        </Grid>
        <Grid size={12}>
          <PerformanceChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TrafficInDevice />
        </Grid>
        <Grid container size={{ xs: 12, md: 6 }}>
          <Grid size={12}>
            <SaleMappingChart />
          </Grid>
          <Grid size={12}>
            <RadialChart />
          </Grid>
        </Grid>
      </Grid>
    </ComponentsWrapper>
  );
}
