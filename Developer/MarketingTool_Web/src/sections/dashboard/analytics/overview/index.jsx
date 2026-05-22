import PropTypes from 'prop-types';

// @mui
import Grid from '@mui/material/Grid';

// @project
import AnalyticsOverviewCard from './AnalyticsOverviewCard';
import AnalyticsOverviewChart from './AnalyticsOverviewChart';
import AnalyticsTopRef from './AnalyticsTopRef';

import PageAnimateWrapper from '@/components/PageAnimateWrapper';

/***************************  ANALYTICS - OVERVIEW  ***************************/

export default function AnalyticsOverview({ data, loading, hasData }) {
  return (
    <PageAnimateWrapper>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={12}>
          <AnalyticsOverviewCard data={data?.kpis} />
        </Grid>
        <Grid size={12}>
          <AnalyticsOverviewChart data={data?.chart} />
        </Grid>
        <Grid size={12}>
          <AnalyticsTopRef data={data?.topRef} />
        </Grid>
      </Grid>
    </PageAnimateWrapper>
  );
}

AnalyticsOverview.propTypes = { data: PropTypes.object, loading: PropTypes.bool, hasData: PropTypes.bool };
