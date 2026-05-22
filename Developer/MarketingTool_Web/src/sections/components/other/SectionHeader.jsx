import { useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import NotificationItem from '@/components/NotificationItem';
import PresentationCard from '@/components/cards/PresentationCard';
import { TabsType } from '@/enum';

// @assets
import { IconCode, IconFilter, IconNote, IconPlus, IconX } from '@tabler/icons-react';

import avatar1 from '@/assets/images/users/avatar-1.png';
import avatar5 from '@/assets/images/users/avatar-5.png';

/***************************  TABS - PANEL  ***************************/

function a11yProps(value) {
  return {
    value: value,
    id: `simple-tab-${value}`,
    'aria-controls': `simple-tabpanel-${value}`
  };
}

function TextSet() {
  return (
    <Stack sx={{ gap: 0.5 }}>
      <Typography variant="h4">Analysis</Typography>
      <Typography variant="caption" color="grey.700">
        Analyze your data and insights.
      </Typography>
    </Stack>
  );
}

/***************************  COMPONENT BLOCKS - HEADER  ***************************/

export default function Header() {
  const theme = useTheme();

  const [sectionTab, setSectionTab] = useState('label');

  const handleSectionTabChange = (_event, newValue) => {
    setSectionTab(newValue);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const openPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

  const isOpen = Boolean(anchorEl);
  const id = isOpen ? 'simple-popover' : undefined;

  return (
    <PresentationCard title="Section Header">
      <Stack sx={{ gap: 5 }}>
        <Stack direction="row" sx={{ alignItems: 'end', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <TextSet />
          <Tabs value={sectionTab} onChange={handleSectionTabChange} aria-label="section tabs" type={TabsType.SEGMENTED}>
            <Tab label="Label" {...a11yProps('label')} />
            <Tab label="Monthly" {...a11yProps('monthly')} />
            <Tab label="Yearly" {...a11yProps('yearly')} />
          </Tabs>
        </Stack>
        <Stack direction="row" sx={{ alignItems: 'end', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <TextSet />
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
            <Box>
              <Button variant="outlined" color="secondary" startIcon={<IconFilter size={16} />} onClick={openPopover}>
                Filter
              </Button>
              <Popover
                id={id}
                open={isOpen}
                anchorEl={anchorEl}
                onClose={closePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                slotProps={{ paper: { elevation: 0, sx: { width: 352 } } }}
              >
                <Stack
                  direction="row"
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    p: 2,
                    borderBottom: `1px solid ${theme.vars.palette.divider}`
                  }}
                >
                  <Typography variant="h6">Filter</Typography>
                  <IconButton variant="outlined" color="secondary" aria-label="close" onClick={closePopover}>
                    <IconX size={16} />
                  </IconButton>
                </Stack>
                <Box sx={{ px: 1, py: 2 }}>Filter Content</Box>
                <Stack
                  direction="row"
                  sx={{ width: 1, justifyContent: 'space-between', gap: 2, p: 2, borderTop: `1px solid ${theme.vars.palette.divider}` }}
                >
                  <Button variant="outlined" color="secondary">
                    Reset
                  </Button>
                  <Button variant="contained">Show 34 Admin User</Button>
                </Stack>
              </Popover>
            </Box>
            <Button variant="contained" startIcon={<IconPlus size={16} />}>
              Add New
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Stack sx={{ mt: 5, width: { xs: 1, sm: 336 }, gap: 1.25 }}>
        <NotificationItem
          avatar={{ alt: 'Travis Howard', src: avatar1 }}
          badgeAvatar={{ children: <IconCode size={14} /> }}
          title="Developer · Add Build In Repo"
          subTitle="Brenda Skiles"
          dateTime="Jul 9"
        />
        <NotificationItem
          avatar={{ alt: 'Travis Howard', src: avatar5 }}
          badgeAvatar={{ children: <IconNote size={14} /> }}
          title="Admin · Submit Document"
          subTitle="Margarita Gibson"
          dateTime="Jul 9"
          isSeen
        />
      </Stack>
    </PresentationCard>
  );
}
