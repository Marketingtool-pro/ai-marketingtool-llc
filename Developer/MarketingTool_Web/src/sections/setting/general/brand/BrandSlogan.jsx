// @mui
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';

// @project
import SettingCard from '@/components/cards/SettingCard';

/*******************************  BRAND - SLOGAN  ************************************* */

export default function BrandSlogan() {
  return (
    <SettingCard title="Slogan" caption="Brand statement or tagline is often used along with your logo.">
      <Box sx={{ p: 3 }}>
        <InputLabel>Slogan</InputLabel>
        <OutlinedInput
          placeholder="Enter a slogan..."
          multiline
          minRows={4}
          aria-describedby="outlined-address"
          fullWidth
          slotProps={{ input: { 'aria-label': 'Slogan' } }}
        />
      </Box>
    </SettingCard>
  );
}
