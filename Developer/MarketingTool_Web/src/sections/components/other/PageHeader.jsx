import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

// @assets
import { IconArrowLeft, IconFilter, IconPlus } from '@tabler/icons-react';

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

/***************************  OTHER - PAGE HEADER  ***************************/

export default function PageHeader() {
  const [value, setValue] = useState('overview');

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  return (
    <PresentationCard title="Page Header">
      <Stack sx={{ gap: 5 }}>
        <Box>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Tabs variant="scrollable" scrollButtons="auto" value={value} onChange={handleChange} aria-label="page tabs">
              <Tab label="Overview" {...a11yProps('overview')} />
              <Tab label="Unique Visitors" {...a11yProps('unique-visitors')} />
              <Tab label="Page View" {...a11yProps('page-view')} />
              <Tab label="Label" {...a11yProps('label')} />
              <Tab label="Setting" {...a11yProps('setting')} />
            </Tabs>
            <Button variant="outlined" color="secondary" startIcon={<IconFilter size={16} />} sx={{ minWidth: 78 }}>
              Filter
            </Button>
          </Stack>
          <TabPanel value={value} index="overview">
            Overview
          </TabPanel>
          <TabPanel value={value} index="unique-visitors">
            Unique Visitors
          </TabPanel>
          <TabPanel value={value} index="page-view">
            Page View
          </TabPanel>
          <TabPanel value={value} index="label">
            Label
          </TabPanel>
          <TabPanel value={value} index="setting">
            Setting
          </TabPanel>
        </Box>

        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6">Account</Typography>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
            <Button variant="outlined" color="secondary" startIcon={<IconFilter size={16} />}>
              Filter
            </Button>
            <Button variant="contained" startIcon={<IconPlus size={16} />}>
              Add New
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6">Account</Typography>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Show example code"
            labelPlacement="start"
            slotProps={{ typography: { sx: { color: 'grey.700' } } }}
          />
        </Stack>

        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
            <IconButton variant="outlined" color="secondary">
              <IconArrowLeft size={20} />
            </IconButton>
            <Typography variant="h6">Label</Typography>
          </Stack>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
            <Button variant="outlined" color="secondary" startIcon={<IconFilter size={16} />}>
              Filter
            </Button>
            <Button variant="contained" startIcon={<IconPlus size={16} />}>
              Add New
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </PresentationCard>
  );
}

TabPanel.propTypes = {
  children: PropTypes.any,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  other: PropTypes.any
};
