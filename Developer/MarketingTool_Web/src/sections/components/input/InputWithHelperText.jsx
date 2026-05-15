// @mui
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @assets
import { IconMail, IconHelp } from '@tabler/icons-react';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  INPUT - WITH HELPER TEXT  ***************************/

export default function InputWithHelperText() {
  return (
    <PresentationCard title="With Helper Text">
      <Stack sx={{ gap: 2.5 }}>
        <Box>
          <InputLabel>Email</InputLabel>
          <OutlinedInput
            placeholder="example@saasable.io"
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
            aria-describedby="email-helper-text"
            slotProps={{ input: { 'aria-label': 'email' } }}
          />
          <FormHelperText>This is a hint text to help user.</FormHelperText>
        </Box>
        <Box>
          <InputLabel>Address</InputLabel>
          <OutlinedInput
            placeholder="Enter a description..."
            multiline
            minRows={4}
            aria-describedby="outlined-address-helper-text"
            slotProps={{ input: { 'aria-label': 'address' } }}
          />
          <FormHelperText>This is a hint text to help user.</FormHelperText>
        </Box>
        <Box>
          <InputLabel required>Email</InputLabel>
          <OutlinedInput
            placeholder="example@saasable.io"
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
            aria-describedby="email-helper-text"
            slotProps={{ input: { 'aria-label': 'email' } }}
          />
          <FormHelperText error>This is a hint text to help user.</FormHelperText>
        </Box>
      </Stack>
    </PresentationCard>
  );
}
