// @mui

import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

// @assets
import { IconMail, IconHelp } from '@tabler/icons-react';

/***************************  INPUT - EMAIL  ***************************/

export default function EmailInput() {
  return (
    <PresentationCard title="Email Input">
      <Stack sx={{ gap: 2.5 }}>
        <Box>
          <InputLabel>Default</InputLabel>
          <OutlinedInput
            placeholder="example@saasable.io"
            fullWidth
            startAdornment={
              <InputAdornment position="start">
                <IconMail />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconHelp />
              </InputAdornment>
            }
            aria-describedby="outlined-email"
            slotProps={{ input: { 'aria-label': 'email' } }}
          />
        </Box>
        <Box>
          <InputLabel>Filled</InputLabel>
          <OutlinedInput
            placeholder="example@saasable.io"
            value="example@saasable.io"
            fullWidth
            startAdornment={
              <InputAdornment position="start">
                <IconMail />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconHelp />
              </InputAdornment>
            }
            aria-describedby="outlined-email"
            slotProps={{ input: { 'aria-label': 'email' } }}
          />
        </Box>
        <Box>
          <InputLabel>Disabled</InputLabel>
          <OutlinedInput
            placeholder="example@saasable.io"
            value="example@saasable.io"
            fullWidth
            disabled
            startAdornment={
              <InputAdornment position="start">
                <IconMail />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconHelp />
              </InputAdornment>
            }
            aria-describedby="outlined-email"
            slotProps={{ input: { 'aria-label': 'email' } }}
          />
        </Box>
      </Stack>
    </PresentationCard>
  );
}
