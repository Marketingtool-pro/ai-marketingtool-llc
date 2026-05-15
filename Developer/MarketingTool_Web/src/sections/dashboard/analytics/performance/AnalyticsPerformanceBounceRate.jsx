import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { motion } from 'motion/react';

// @project
import ProgressCard from '@/components/cards/ProgressCard';
import MainCard from '@/components/MainCard';
import { varSlide } from '@/components/third-party/motion/animate/dialog';
import { TabsType } from '@/enum';

/***************************  TABS - DATA  ***************************/

const sevenDaysData = [
  { title: 'Direct', value: '0', progress: { value: 0 } },
  { title: 'Search', value: '0', progress: { value: 0 } },
  { title: 'Social', value: '0', progress: { value: 0 } },
  { title: 'Ads', value: '0', progress: { value: 0 } },
  { title: 'Mail', value: '0', progress: { value: 0 } },
  { title: 'Links', value: '0', progress: { value: 0 } }
];

const monthData = [
  { title: 'Direct', value: '0', progress: { value: 0 } },
  { title: 'Search', value: '0', progress: { value: 0 } },
  { title: 'Social', value: '0', progress: { value: 0 } },
  { title: 'Ads', value: '0', progress: { value: 0 } },
  { title: 'Mail', value: '0', progress: { value: 0 } },
  { title: 'Links', value: '0', progress: { value: 0 } }
];

const yearData = [
  { title: 'Direct', value: '0', progress: { value: 0 } },
  { title: 'Search', value: '0', progress: { value: 0 } },
  { title: 'Social', value: '0', progress: { value: 0 } },
  { title: 'Ads', value: '0', progress: { value: 0 } },
  { title: 'Mail', value: '0', progress: { value: 0 } },
  { title: 'Links', value: '0', progress: { value: 0 } }
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

/***************************  PERFORMANCE - BOUNCE RATE  ***************************/

export default function AnalyticsPerformanceBounceRate({ data }) {
  const [bounce, setBounce] = useState('days');

  const handleChange = (_event, newBounce) => {
    setBounce(newBounce);
  };

  // Use real data from API if available, otherwise use defaults (zeros)
  const d7 = data?.sevenDays || sevenDaysData;
  const dMonth = data?.month || monthData;
  const dYear = data?.year || yearData;

  return (
    <MainCard>
      <Stack sx={{ gap: 2.5 }}>
        <Typography variant="subtitle1">Bounce Rate</Typography>
        <Box>
          <Tabs variant="fullWidth" value={bounce} onChange={handleChange} aria-label="basic tabs example" type={TabsType.SEGMENTED}>
            <Tab label="Last 7 day" {...a11yProps('days')} />
            <Tab label="Last Month" {...a11yProps('month')} />
            <Tab label="Last Year" {...a11yProps('year')} />
          </Tabs>
          <TabPanel value={bounce} index="days">
            <TabContent data={d7} />
          </TabPanel>
          <TabPanel value={bounce} index="month">
            <TabContent data={dMonth} />
          </TabPanel>
          <TabPanel value={bounce} index="year">
            <TabContent data={dYear} />
          </TabPanel>
        </Box>
      </Stack>
    </MainCard>
  );
}

TabPanel.propTypes = {
  children: PropTypes.any,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  other: PropTypes.any
};

TabContent.propTypes = { data: PropTypes.array };
