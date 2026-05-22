import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { motion } from 'motion/react';

// @project
import ProgressCard from '@/components/cards/ProgressCard';
import { varSlide } from '@/components/third-party/motion/animate/dialog';
import { TabsType } from '@/enum';
import { getRadiusStyles } from '@/utils/getRadiusStyles';

/***************************  TABS - DATA  ***************************/

const sevenDaysData = [
  { title: 'Google Search', value: '$0', progress: { value: 0 } },
  { title: 'Facebook Ads', value: '$0', progress: { value: 0 } },
  { title: 'Instagram Ads', value: '$0', progress: { value: 0 } },
  { title: 'Google Display', value: '$0', progress: { value: 0 } },
  { title: 'YouTube Ads', value: '$0', progress: { value: 0 } },
  { title: 'LinkedIn Ads', value: '$0', progress: { value: 0 } }
];

const monthData = [
  { title: 'Google Search', value: '$0', progress: { value: 0 } },
  { title: 'Facebook Ads', value: '$0', progress: { value: 0 } },
  { title: 'Instagram Ads', value: '$0', progress: { value: 0 } },
  { title: 'Google Display', value: '$0', progress: { value: 0 } },
  { title: 'YouTube Ads', value: '$0', progress: { value: 0 } },
  { title: 'LinkedIn Ads', value: '$0', progress: { value: 0 } }
];

const yearData = [
  { title: 'Google Search', value: '$0', progress: { value: 0 } },
  { title: 'Facebook Ads', value: '$0', progress: { value: 0 } },
  { title: 'Instagram Ads', value: '$0', progress: { value: 0 } },
  { title: 'Google Display', value: '$0', progress: { value: 0 } },
  { title: 'YouTube Ads', value: '$0', progress: { value: 0 } },
  { title: 'LinkedIn Ads', value: '$0', progress: { value: 0 } }
];

const routesData = [
  { title: 'Brand Awareness', value: '0', progress: { value: 0 } },
  { title: 'Lead Generation', value: '0', progress: { value: 0 } },
  { title: 'App Installs', value: '0', progress: { value: 0 } },
  { title: 'Retargeting', value: '0', progress: { value: 0 } },
  { title: 'Sales / ROAS', value: '0', progress: { value: 0 } },
  { title: 'Traffic', value: '0', progress: { value: 0 } }
];

const pageData = [
  { title: 'Brand Awareness', value: '0', progress: { value: 0 } },
  { title: 'Lead Generation', value: '0', progress: { value: 0 } },
  { title: 'App Installs', value: '0', progress: { value: 0 } },
  { title: 'Retargeting', value: '0', progress: { value: 0 } },
  { title: 'Sales / ROAS', value: '0', progress: { value: 0 } },
  { title: 'Traffic', value: '0', progress: { value: 0 } }
];

const affiliateData = [
  { title: 'Google Search', value: '0', progress: { value: 0 } },
  { title: 'Facebook Feed', value: '0', progress: { value: 0 } },
  { title: 'Instagram Reels', value: '0', progress: { value: 0 } },
  { title: 'Google Shopping', value: '0', progress: { value: 0 } },
  { title: 'YouTube Pre-roll', value: '0', progress: { value: 0 } },
  { title: 'Facebook Stories', value: '0', progress: { value: 0 } }
];

const campaignData = [
  { title: 'No campaigns yet', value: '$0', progress: { value: 0 } }
];

const marketingData = [
  { title: 'No spend data yet', value: '$0', progress: { value: 0 } }
];

/***************************  TABS - A11Y  ***************************/

function a11yProps(value) {
  return { value: value, id: `simple-tab-${value}`, 'aria-controls': `simple-tabpanel-${value}` };
}

/***************************  TABS - PANEL  ***************************/

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 1.5 }}>{children}</Box>}
    </div>
  );
}

/***************************  TABS - CONTENT  ***************************/

function TabContent({ data }) {
  return (
    <motion.div variants={varSlide('slideInDown', { distance: 30 })} initial="initial" animate="animate">
      <Stack sx={{ gap: 1.25 }}>
        {data.map((item, index) => (
          <ProgressCard key={index} {...item} />
        ))}
      </Stack>
    </motion.div>
  );
}

/***************************  CARDS - BORDER WITH RADIUS  ***************************/

export function applyBorderWithRadius(radius, theme) {
  return {
    overflow: 'hidden',
    '--Grid-borderWidth': '1px',
    borderTop: 'var(--Grid-borderWidth) solid',
    borderLeft: 'var(--Grid-borderWidth) solid',
    borderColor: 'divider',
    '& > div': {
      overflow: 'hidden',
      borderRight: 'var(--Grid-borderWidth) solid',
      borderBottom: 'var(--Grid-borderWidth) solid',
      borderColor: 'divider',
      [theme.breakpoints.only('xs')]: {
        '&:first-of-type': getRadiusStyles(radius, 'topLeft', 'topRight'),
        '&:last-of-type': getRadiusStyles(radius, 'bottomLeft', 'bottomRight')
      },
      [theme.breakpoints.between('sm', 'md')]: {
        '&:nth-of-type(1)': getRadiusStyles(radius, 'topLeft'),
        '&:nth-of-type(2)': getRadiusStyles(radius, 'topRight'),
        '&:nth-of-type(3)': getRadiusStyles(radius, 'bottomLeft', 'bottomRight')
      },
      [theme.breakpoints.up('md')]: {
        '&:first-of-type': getRadiusStyles(radius, 'topLeft', 'bottomLeft'),
        '&:last-of-type': getRadiusStyles(radius, 'topRight', 'bottomRight')
      }
    }
  };
}

/***************************  CARDS - TOP REFERRERS  ***************************/
export default function TopReferrers({ data }) {
  const theme = useTheme();
  const [httpReferrers, setHttpReferrers] = useState('days');
  const [pages, setPages] = useState('routes');
  const [sources, setSources] = useState('affiliate');

  // Use real data from API if available, otherwise use defaults (zeros)
  const ps = data?.platformSpend || {};
  const co = data?.campaignObjectives || {};
  const tp = data?.topPlacements || {};

  const p7d = ps.sevenDays || sevenDaysData;
  const pMonth = ps.month || monthData;
  const pYear = ps.year || yearData;
  const cGoal = co.byGoal || routesData;
  const cBudget = co.byBudget || pageData;
  const tPlacement = tp.placement || affiliateData;
  const tCampaign = tp.campaign || campaignData;
  const tSpend = tp.spend || marketingData;

  // Separate handleChange functions
  const handleHTTPReferrers = (_event, newValue) => {
    setHttpReferrers(newValue);
  };

  const handlePages = (_event, newValue) => {
    setPages(newValue);
  };

  const handleSources = (_event, newValue) => {
    setSources(newValue);
  };

  return (
    <>
      <Grid container sx={{ borderRadius: 4, boxShadow: theme.vars.customShadows.section, ...applyBorderWithRadius(16, theme) }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Stack sx={{ gap: 2.5, p: 3 }}>
            <Typography variant="subtitle1">Platform Spend</Typography>
            <Box>
              <Tabs
                variant="fullWidth"
                value={httpReferrers}
                onChange={handleHTTPReferrers}
                aria-label="basic tabs example"
                type={TabsType.SEGMENTED}
              >
                <Tab label="Last 7 days" {...a11yProps('days')} />
                <Tab label="Last Month" {...a11yProps('month')} />
                <Tab label="Last Year" {...a11yProps('year')} />
              </Tabs>
              <TabPanel value={httpReferrers} index="days">
                <TabContent data={p7d} />
              </TabPanel>
              <TabPanel value={httpReferrers} index="month">
                <TabContent data={pMonth} />
              </TabPanel>
              <TabPanel value={httpReferrers} index="year">
                <TabContent data={pYear} />
              </TabPanel>
            </Box>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Stack sx={{ gap: 2.5, p: 3 }}>
            <Typography variant="subtitle1">Campaign Objectives</Typography>
            <Box>
              <Tabs variant="fullWidth" value={pages} onChange={handlePages} aria-label="basic tabs example" type={TabsType.SEGMENTED}>
                <Tab label="By Goal" {...a11yProps('routes')} />
                <Tab label="By Budget" {...a11yProps('pages')} />
              </Tabs>
              <TabPanel value={pages} index="routes">
                <TabContent data={cGoal} />
              </TabPanel>
              <TabPanel value={pages} index="pages">
                <TabContent data={cBudget} />
              </TabPanel>
            </Box>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack sx={{ gap: 2.5, p: 3 }}>
            <Typography variant="subtitle1">Top Placements</Typography>
            <Box>
              <Tabs variant="fullWidth" value={sources} onChange={handleSources} aria-label="basic tabs example" type={TabsType.SEGMENTED}>
                <Tab label="Placement" {...a11yProps('affiliate')} />
                <Tab label="Campaign" {...a11yProps('campaign')} />
                <Tab label="Spend" {...a11yProps('marketing')} />
              </Tabs>
              <TabPanel value={sources} index="affiliate">
                <TabContent data={tPlacement} />
              </TabPanel>
              <TabPanel value={sources} index="campaign">
                <TabContent data={tCampaign} />
              </TabPanel>
              <TabPanel value={sources} index="marketing">
                <TabContent data={tSpend} />
              </TabPanel>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

TabPanel.propTypes = {
  children: PropTypes.any,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  other: PropTypes.any
};

TabContent.propTypes = { data: PropTypes.array };
