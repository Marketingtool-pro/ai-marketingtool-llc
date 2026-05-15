// @mui
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';

// @project
import SettingCard from '@/components/cards/SettingCard';

/*******************************  BRAND - SHORT DESCRIPTION  ************************************* */

export default function BrandShortDescription() {
  return (
    <SettingCard title="Short Description" caption="Description of your business often used in bios and listings">
      <Box sx={{ p: 3 }}>
        <InputLabel>Short Description</InputLabel>
        <OutlinedInput
          placeholder="Enter a description..."
          multiline
          minRows={4}
          aria-describedby="outlined-address"
          fullWidth
          slotProps={{ input: { 'aria-label': 'Short Description' } }}
        />
      </Box>
    </SettingCard>
  );
}
