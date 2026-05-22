// @mui
import Grid from '@mui/material/Grid';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import PresentationCard from '@/components/cards/PresentationCard';
import { TabsType } from '@/enum';
import { Basic } from '@/sections/components/tabs';

/***************************  NAVIGATION - TABS  ***************************/

export default function NavigationTabs() {
  return (
    <ComponentsWrapper title="Tabs">
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={12}>
          <PresentationCard title="Basic Tabs">
            <Basic />
          </PresentationCard>
        </Grid>
        <Grid size={12}>
          <PresentationCard title="Segmented Button / Button Group">
            <Basic type={TabsType.SEGMENTED} />
          </PresentationCard>
        </Grid>
      </Grid>
    </ComponentsWrapper>
  );
}
