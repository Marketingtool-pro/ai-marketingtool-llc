// @mui
import Grid from '@mui/material/Grid';

// @project
import GeneralBrandAssets from './GeneralBrandAssets';
import GeneralDetails from './GeneralDetails';
import GeneralResource from './GeneralResource';

import PageAnimateWrapper from '@/components/PageAnimateWrapper';

/***************************  SETTING - GENERAL  ***************************/

export default function GeneralSetting() {
  return (
    <PageAnimateWrapper>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={12}>
          <GeneralDetails />
        </Grid>
        <Grid size={12}>
          <GeneralResource />
        </Grid>
        <Grid size={12}>
          <GeneralBrandAssets tab="brand" />
        </Grid>
      </Grid>
    </PageAnimateWrapper>
  );
}
