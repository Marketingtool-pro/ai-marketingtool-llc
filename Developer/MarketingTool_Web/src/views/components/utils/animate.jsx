import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';

// @project
import Dialog from '@/sections/components/animate/Dialog';
import InView from '@/sections/components/animate/in-view';
import Scroll from '@/sections/components/animate/Scroll';

/***************************  TABS - PANEL  ***************************/

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`animate-tabpanel-${index}`} aria-labelledby={`animate-tab-${index}`} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(value) {
  return {
    value: value,
    id: `animate-tab-${value}`,
    'aria-controls': `animate-tabpanel-${value}`
  };
}

/***************************  ANIMATE - MAIN  ***************************/

export default function Animate() {
  const [currentTab, setCurrentTab] = useState('in-view');

  const handleChange = (_event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Stack sx={{ gap: { xs: 3, md: 4 } }}>
      <Tabs variant="scrollable" scrollButtons="auto" value={currentTab} onChange={handleChange} aria-label="animate tabs">
        <Tab label="In View" {...a11yProps('in-view')} />
        <Tab label="Scroll" {...a11yProps('scroll')} />
        <Tab label="Dialog" {...a11yProps('dialog')} />
      </Tabs>

      <TabPanel value={currentTab} index="in-view">
        <InView />
      </TabPanel>
      <TabPanel value={currentTab} index="scroll">
        <Scroll />
      </TabPanel>
      <TabPanel value={currentTab} index="dialog">
        <Dialog />
      </TabPanel>
    </Stack>
  );
}

TabPanel.propTypes = { children: PropTypes.any, value: PropTypes.string, index: PropTypes.string, other: PropTypes.any };
