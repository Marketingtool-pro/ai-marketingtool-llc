import { useEffect } from 'react';

// @mui
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

// @project
import { AnalyticsOverview, AnalyticsPerformance, AnalyticsUserBehavior } from '@/sections/dashboard/analytics';
import { handlerBreadcrumbs } from '@/states/breadcrumbs';
import { handlerActiveItem, useGetMenuMaster } from '@/states/menu';
import { useRouter, usePathname } from '@/utils/navigation';
import useDashboardData from '@/hooks/useDashboardData';

/***************************  DASHBOARD - ANALYTICS  ***************************/

export default function DashboardAnalytics() {
  const router = useRouter();
  const pathname = usePathname();
  const { menuMaster } = useGetMenuMaster();
  const { data, loading, hasData } = useDashboardData();

  const currentTab = router.params.tab || 'overview';

  const handleChange = (_event, newValue) => {
    if (newValue !== currentTab) {
      router.replace(`/dashboard/analytics/${newValue}`);
    }
  };

  useEffect(() => {
    if (menuMaster.openedItem !== 'dashboard') {
      handlerActiveItem('dashboard');
    }

    handlerBreadcrumbs(`/dashboard/analytics/${currentTab}`, [{ title: 'analytics' }, { title: currentTab }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, currentTab]);

  return (
    <Stack sx={{ gap: { xs: 3, md: 4 } }}>
      <Tabs variant="scrollable" scrollButtons="auto" value={currentTab} onChange={handleChange} aria-label="analytics tabs">
        <Tab label="Overview" value="overview" />
        <Tab label="Campaign Performance" value="user-behavior" />
        <Tab label="Finance & Revenue" value="performance" />
      </Tabs>
      <Box>
        {currentTab === 'overview' && <AnalyticsOverview data={data?.overview} loading={loading} hasData={hasData} />}
        {currentTab === 'user-behavior' && <AnalyticsUserBehavior data={data?.campaigns} loading={loading} hasData={hasData} />}
        {currentTab === 'performance' && <AnalyticsPerformance data={data?.finance} loading={loading} hasData={hasData} />}
      </Box>
    </Stack>
  );
}
