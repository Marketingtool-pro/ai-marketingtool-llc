import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import ProgressCard from '@/components/cards/ProgressCard';
import MainCard from '@/components/MainCard';
import { TabsType } from '@/enum';

/***************************  TABS - DATA  ***************************/

const sevenDaysData = [
  { title: 'Direct', value: '16,890', progress: { value: 80 } },
  { title: 'Google.com', value: '4,909', progress: { value: 70 } },
  { title: 'Remix.com', value: '550', progress: { value: 50 } },
  { title: 'dev.to', value: '140', progress: { value: 30 } },
  { title: 'acpc.api.ic.io', value: '8,675', progress: { value: 60 } },
  { title: 'wewe.uv.us', value: '4,900', progress: { value: 40 } }
];

const monthData = [
  { title: 'Direct', value: '67,560', progress: { value: 80 } },
  { title: 'Google.com', value: '19,636', progress: { value: 70 } },
  { title: 'Remix.com', value: '2,220', progress: { value: 50 } },
  { title: 'dev.to', value: '560', progress: { value: 30 } },
  { title: 'acpc.api.ic.io', value: '34,700', progress: { value: 60 } },
  { title: 'wewe.uv.us', value: '19,600', progress: { value: 40 } }
];

const yearData = [
  { title: 'Direct', value: '8,10,720', progress: { value: 80 } },
  { title: 'Google.com', value: '2,35,632', progress: { value: 70 } },
  { title: 'Remix.com', value: '26,640', progress: { value: 40 } },
  { title: 'dev.to', value: '6,720', progress: { value: 10 } },
  { title: 'acpc.api.ic.io', value: '4,16,400', progress: { value: 60 } },
  { title: 'wewe.uv.us', value: '2,35,200', progress: { value: 65 } }
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
    <Stack sx={{ gap: 1.25 }}>
      {data.map((item, index) => (
        <ProgressCard key={index} {...item} />
      ))}
    </Stack>
  );
}

/***************************  CARDS - TOP REFERRERS  ***************************/

export default function TopReferrers() {
  const [value, setValue] = useState('label1');

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  return (
    <MainCard>
      <Stack sx={{ gap: 2.5 }}>
        <Typography variant="subtitle1">Top HTTP Referrers</Typography>
        <Box>
          <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="basic tabs example" type={TabsType.SEGMENTED}>
            <Tab label="Last 7 day" {...a11yProps('label1')} />
            <Tab label="Last Month" {...a11yProps('label2')} />
            <Tab label="Last Year" {...a11yProps('label3')} />
          </Tabs>
          <TabPanel value={value} index="label1">
            <TabContent data={sevenDaysData} />
          </TabPanel>
          <TabPanel value={value} index="label2">
            <TabContent data={monthData} />
          </TabPanel>
          <TabPanel value={value} index="label3">
            <TabContent data={yearData} />
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
