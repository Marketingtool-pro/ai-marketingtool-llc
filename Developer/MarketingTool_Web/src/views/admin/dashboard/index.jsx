import { useState, useEffect } from 'react';

// @mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';

// @assets
import {
  IconCurrencyDollar,
  IconChartBar,
  IconTargetArrow,
  IconTrendingUp,
  IconBrandGoogle,
  IconBrandFacebook,
  IconDeviceDesktop,
  IconArrowUpRight,
  IconArrowDownRight
} from '@tabler/icons-react';

// @project
import { fetchDashboardSummary } from '@/utils/api/windmill';

/***************************  KPI CARD  ***************************/

function KpiCard({ title, value, change, changeType, icon: Icon, color }) {
  const isPositive = changeType === 'up';
  return (
    <Card>
      <CardContent>
        <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}18`,
              color: color
            }}
          >
            <Icon size={24} />
          </Box>
          {change && (
            <Chip
              icon={isPositive ? <IconArrowUpRight size={14} /> : <IconArrowDownRight size={14} />}
              label={change}
              size="small"
              sx={{
                bgcolor: isPositive ? 'success.lighter' : 'error.lighter',
                color: isPositive ? 'success.main' : 'error.main',
                fontWeight: 600,
                fontSize: 12,
                height: 24,
                '& .MuiChip-icon': { color: 'inherit' }
              }}
            />
          )}
        </Stack>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

/***************************  PLATFORM ROW  ***************************/

function PlatformRow({ name, icon: Icon, spend, revenue, roas, progress, color }) {
  return (
    <Box sx={{ py: 1.5 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
          <Icon size={18} color={color} />
          <Typography variant="subtitle2">{name}</Typography>
        </Stack>
        <Stack direction="row" spacing={3}>
          <Typography variant="caption" color="text.secondary">
            Spend: ${spend}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Revenue: ${revenue}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.main' }}>
            {roas}x ROAS
          </Typography>
        </Stack>
      </Stack>
      <LinearProgress variant="determinate" value={progress} sx={{ height: 4, borderRadius: 2, bgcolor: 'grey.200' }} />
    </Box>
  );
}

/***************************  DASHBOARD - MAIN  ***************************/

export default function DashboardPage() {
  const [tab, setTab] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadData = async () => {
      try {
        const summary = await fetchDashboardSummary();
        setData(summary);
      } catch {
        // API not connected yet — show default state
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const kpis = data?.kpis || {
    totalSpend: '$0',
    revenue: '$0',
    roas: '0.0x',
    conversions: '0'
  };

  const platforms = data?.platforms || [];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Marketing performance overview
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Overview" />
        <Tab label="Campaign Performance" />
        <Tab label="Finance" />
      </Tabs>

      {/* KPI Cards */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={130} />
          ) : (
            <KpiCard
              title="Total Spend"
              value={kpis.totalSpend}
              change="+12.5%"
              changeType="up"
              icon={IconCurrencyDollar}
              color="#805AF5"
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={130} />
          ) : (
            <KpiCard title="Revenue" value={kpis.revenue} change="+18.2%" changeType="up" icon={IconTrendingUp} color="#3EB75E" />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={130} />
          ) : (
            <KpiCard title="ROAS" value={kpis.roas} icon={IconTargetArrow} color="#1BA2DB" />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Skeleton variant="rounded" height={130} />
          ) : (
            <KpiCard
              title="Conversions"
              value={kpis.conversions}
              change="-2.3%"
              changeType="down"
              icon={IconChartBar}
              color="#FFC876"
            />
          )}
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Platform Breakdown */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Platform Performance
              </Typography>
              {loading ? (
                <Stack spacing={2}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rounded" height={50} />
                  ))}
                </Stack>
              ) : platforms.length > 0 ? (
                platforms.map((p) => <PlatformRow key={p.name} {...p} />)
              ) : (
                <Stack spacing={1.5}>
                  <PlatformRow
                    name="Google Ads"
                    icon={IconBrandGoogle}
                    spend="0"
                    revenue="0"
                    roas="0.0"
                    progress={0}
                    color="#EA4335"
                  />
                  <PlatformRow
                    name="Meta / Facebook"
                    icon={IconBrandFacebook}
                    spend="0"
                    revenue="0"
                    roas="0.0"
                    progress={0}
                    color="#1877F2"
                  />
                  <PlatformRow
                    name="Website / Organic"
                    icon={IconDeviceDesktop}
                    spend="0"
                    revenue="0"
                    roas="0.0"
                    progress={0}
                    color="#805AF5"
                  />
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Stack spacing={1}>
                {[
                  { label: 'Launch Campaign', href: '/command-centre' },
                  { label: 'Generate Ad Copy', href: '/tools/ad-copy-analyzer' },
                  { label: 'Run Meta Audit', href: '/meta-audit' },
                  { label: 'View Reports', href: '/reports' },
                  { label: 'Browse All Tools', href: '/tools' }
                ].map((action) => (
                  <Card key={action.label} variant="outlined">
                    <CardContent
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:last-child': { pb: 1.5 },
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => (window.location.href = action.href)}
                    >
                      <Typography variant="subtitle2">{action.label}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
