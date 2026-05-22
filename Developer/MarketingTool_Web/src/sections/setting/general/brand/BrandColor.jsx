import { useState } from 'react';

// @mui
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import ColorPicker from '@/components/ColorPicker';
import SettingCard from '@/components/cards/SettingCard';

// @assets
import { IconTrash } from '@tabler/icons-react';

/***************************  BRAND - COLOR  ***************************/

export default function BrandLogo() {
  const listStyle = { p: { xs: 2, sm: 3 }, flexWrap: 'wrap', gap: 1 };
  const [primary, setPrimary] = useState('#606BDF');
  const [secondary, setSecondary] = useState('#5A5C78');

  return (
    <SettingCard title="Color" caption="Colors create a lasting impression on your audience.">
      <List disablePadding>
        <ListItem sx={listStyle} divider>
          <Stack sx={{ gap: 3, width: 1 }}>
            <Stack direction="row" sx={{ gap: 1.5, justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="body1">Primary</Typography>
                <Typography variant="body2" color="grey.700">
                  The brand colors that appear on your store, social media, and more
                </Typography>
              </Stack>
              <IconButton size="small" color="error" variant="outlined" aria-label="delete">
                <IconTrash size={16} />
              </IconButton>
            </Stack>
            <ColorPicker label="Primary color" defaultColor={primary} onColorChange={(data) => setPrimary(data)} />
          </Stack>
        </ListItem>
        <ListItem sx={listStyle}>
          <Stack sx={{ gap: 3, width: 1 }}>
            <Stack direction="row" sx={{ gap: 1.5, justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="body1">Secondary</Typography>
                <Typography variant="body2" color="grey.700">
                  Supporting colors used for accents and additional detail
                </Typography>
              </Stack>
              <IconButton size="small" color="error" variant="outlined" aria-label="delete">
                <IconTrash size={16} />
              </IconButton>
            </Stack>
            <ColorPicker label="Secondary color" defaultColor={secondary} onColorChange={(data) => setSecondary(data)} />
          </Stack>
        </ListItem>
      </List>
    </SettingCard>
  );
}
