// @mui
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  INPUT - ADDRESS  ***************************/

export default function AddressInput() {
  return (
    <PresentationCard title="Address Input">
      <Stack sx={{ gap: 2.5 }}>
        <Box>
          <InputLabel>Address</InputLabel>
          <OutlinedInput
            placeholder="Enter a description..."
            multiline
            minRows={4}
            aria-describedby="outlined-address"
            fullWidth
            slotProps={{ input: { 'aria-label': 'email' } }}
          />
        </Box>
        <Box>
          <InputLabel>Filled</InputLabel>
          <OutlinedInput
            placeholder="Enter a description..."
            multiline
            minRows={4}
            fullWidth
            value="Providing innovative tech solutions to streamline your workflow and enhance productivity."
            aria-describedby="outlined-address"
            slotProps={{ input: { 'aria-label': 'email' } }}
          />
        </Box>
        <Box>
          <InputLabel>Disabled</InputLabel>
          <OutlinedInput
            placeholder="Enter a description..."
            multiline
            minRows={4}
            disabled
            fullWidth
            aria-describedby="outlined-address"
            slotProps={{ input: { 'aria-label': 'email' } }}
          />
        </Box>
      </Stack>
    </PresentationCard>
  );
}
