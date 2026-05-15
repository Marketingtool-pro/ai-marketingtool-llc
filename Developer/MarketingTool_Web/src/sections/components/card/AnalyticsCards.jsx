// @mui
import Grid from '@mui/material/Grid';

// @project
import BehaviorCard from '@/components/cards/BehaviorCard';
import OverviewCard from '@/components/cards/OverviewCard';
import PerformanceCard from '@/components/cards/PerformanceCard';
import PresentationCard from '@/components/cards/PresentationCard';

// @assets
import { IconArrowDown, IconArrowUpRight } from '@tabler/icons-react';

/***************************  CARDS - DATA  ***************************/

const overviewCardData = {
  title: 'Events',
  value: '34,789',
  compare: 'Compare to last week',
  chip: {
    label: '20.5%',
    color: 'error',
    avatar: <IconArrowDown />
  }
};

const behaviorCardData = {
  title: 'Total Users',
  value: '34,789',
  compare: 'vs last month',
  chip: {
    label: '20.5%',
    icon: <IconArrowUpRight />
  }
};

const performanceCardData = {
  title: 'Sales',
  value: '$9140.20',
  compare: 'Target: $8295.50',
  targetProgress: { target: 8295.5, achieved: 9140.2, goal: 10000 }
};

/***************************  ANALYTICS - CARDS  ***************************/

export default function AnalyticsOverviewCards() {
  return (
    <PresentationCard title="Analytics Cards">
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <OverviewCard {...overviewCardData} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <BehaviorCard {...behaviorCardData} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <PerformanceCard {...performanceCardData} />
        </Grid>
      </Grid>
    </PresentationCard>
  );
}
