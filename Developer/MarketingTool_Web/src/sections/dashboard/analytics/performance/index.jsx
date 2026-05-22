import PropTypes from 'prop-types';

// @mui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

// @project
import AnalyticsPerformanceBounceRate from './AnalyticsPerformanceBounceRate';
import AnalyticsPerformanceCard from './AnalyticsPerformanceCard';
import AnalyticsPerformanceChart from './AnalyticsPerformanceChart';
import AnalyticsPerformanceMapChart from './AnalyricsPerformanceMapChart';
import AnalyticsPerformanceRedialChart from './AnalyticsPerformanceRedialChart';

import PageAnimateWrapper from '@/components/PageAnimateWrapper';

/***************************  ANALYTICS - PERFORMANCE  ***************************/

export default function AnalyticsPerformance({ data, loading, hasData }) {
  return (
    <PageAnimateWrapper>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={12}>
          <AnalyticsPerformanceCard data={data?.kpis} />
        </Grid>
        <Grid size={12}>
          <AnalyticsPerformanceChart data={data?.chart} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPerformanceBounceRate data={data?.channelBreakdown} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack sx={{ gap: { xs: 2, md: 3 } }}>
            <AnalyticsPerformanceMapChart data={data?.geoData} />
            <AnalyticsPerformanceRedialChart data={data?.totalRevenue} />
          </Stack>
        </Grid>
      </Grid>
    </PageAnimateWrapper>
  );
}

AnalyticsPerformance.propTypes = { data: PropTypes.object, loading: PropTypes.bool, hasData: PropTypes.bool };
