import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';

/***************************  TABS - PANEL  ***************************/

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 2.5 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(value) {
  return {
    value: value,
    id: `simple-tab-${value}`,
    'aria-controls': `simple-tabpanel-${value}`
  };
}

/***************************  TABS  ***************************/

export default function Basic({ type }) {
  const [value, setValue] = useState('label1');

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs variant="scrollable" scrollButtons="auto" value={value} onChange={handleChange} aria-label="basic tabs example" {...{ type }}>
        <Tab label="Label 1" {...a11yProps('label1')} />
        <Tab label="Label 2" {...a11yProps('label2')} />
        <Tab label="Label 3" {...a11yProps('label3')} />
        <Tab label="Label 4" {...a11yProps('label4')} />
        <Tab label="Label 5" {...a11yProps('label5')} />
        <Tab label="Label 6" {...a11yProps('label6')} />
        <Tab disabled label="Label 7" {...a11yProps('label7')} />
      </Tabs>
      <TabPanel value={value} index="label1">
        Label 1
      </TabPanel>
      <TabPanel value={value} index="label2">
        Label 2
      </TabPanel>
      <TabPanel value={value} index="label3">
        Label 3
      </TabPanel>
      <TabPanel value={value} index="label4">
        Label 4
      </TabPanel>
      <TabPanel value={value} index="label5">
        Label 5
      </TabPanel>
      <TabPanel value={value} index="label6">
        Label 6
      </TabPanel>
      <TabPanel value={value} index="label7">
        Label 7
      </TabPanel>
    </>
  );
}

TabPanel.propTypes = {
  children: PropTypes.any,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  other: PropTypes.any
};

Basic.propTypes = { type: PropTypes.any };
