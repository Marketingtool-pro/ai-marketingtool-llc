// @mui
import Grid from '@mui/material/Grid';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import { MainHeader, PageHeader, SectionHeader } from '@/sections/components/other';

/***************************  DATA DISPLAY - OTHER  ***************************/

export default function DataDisplayOther() {
  return (
    <ComponentsWrapper title="Common Blocks">
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={12}>
          <MainHeader />
        </Grid>
        <Grid size={12}>
          <PageHeader />
        </Grid>
        <Grid size={12}>
          <SectionHeader />
        </Grid>
      </Grid>
    </ComponentsWrapper>
  );
}
