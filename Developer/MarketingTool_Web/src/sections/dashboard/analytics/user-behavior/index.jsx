import PropTypes from 'prop-types';

// @mui
import Grid from '@mui/material/Grid';

// @project;
import AnalyticsBehaviorCard from './AnalyticsBehaviorCard';
import AnalyticsBehaviorChart from './AnalyticsBehaviorChart';
import AnalyticsBehaviorTable from './analytics-behavior-table';
import AnalyticsBehaviorTrafficDevice from './AnalyticsBehaviorTrafficDevice';

import PageAnimateWrapper from '@/components/PageAnimateWrapper';

/***************************  ANALYTICS - USER BEHAVIOR  ***************************/

export default function AnalyticsUserBehavior({ data, loading, hasData }) {
  return (
    <PageAnimateWrapper>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={12}>
          <AnalyticsBehaviorCard data={data?.kpis} />
        </Grid>
        <Grid size={12}>
          <AnalyticsBehaviorChart data={data?.chart} />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <AnalyticsBehaviorTable data={data?.table} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <AnalyticsBehaviorTrafficDevice data={data?.deviceTraffic} />
        </Grid>
      </Grid>
    </PageAnimateWrapper>
  );
}

AnalyticsUserBehavior.propTypes = { data: PropTypes.object, loading: PropTypes.bool, hasData: PropTypes.bool };
