// @mui
import Grid from '@mui/material/Grid';

// @project
import FeaturesList from './FeaturesList';
import PlanList from './PlanList';
import PageAnimateWrapper from '@/components/PageAnimateWrapper';

/***************************  SETTING - PRICING  ***************************/

export default function PricingSetting() {
  return (
    <PageAnimateWrapper>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={12}>
          <PlanList />
        </Grid>
        <Grid size={12}>
          <FeaturesList />
        </Grid>
      </Grid>
    </PageAnimateWrapper>
  );
}
