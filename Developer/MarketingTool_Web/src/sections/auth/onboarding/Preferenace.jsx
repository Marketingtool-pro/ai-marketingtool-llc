import { useState } from 'react';

// @mui
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const currencyName = ['EUR - Euro', 'USD - US Dollar', 'JPY - Japanese Yen', 'INR - Indian Rupee', 'GBP - British Pound'];
const timezoneName = ['UTC -12:00', 'UTC -11:00', 'UTC +05:30', 'UTC -10:00', 'UTC -09:00', 'UTC -08:00'];

/***************************  AUTH - PREFERENACE  ***************************/

export default function Preferenace() {
  // Set default selected value as the first item
  const [selectedCurrency, setSelectedCurrency] = useState(currencyName[0]);
  const [selectedTimezone, setSelectedTimezone] = useState(timezoneName[0]);

  return (
    <Stack sx={{ gap: 5 }}>
      <Stack sx={{ gap: 1.5, alignItems: 'center' }}>
        <Typography variant="h3">Preferences</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Customize your settings and preferences to enhance your experience.
        </Typography>
      </Stack>
      <form autoComplete="off">
        <Grid container spacing={2.5}>
          <Grid size={12}>
            <InputLabel sx={{ display: 'flex' }}>
              Select Integrations{' '}
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                (Optional)
              </Typography>
            </InputLabel>
            <FormGroup sx={{ gap: 1.25, mt: 1.5 }}>
              <FormControlLabel control={<Switch size="small" defaultChecked />} label="Slack" sx={{ ml: 1.25 }} />
              <FormControlLabel control={<Switch size="small" />} label="Zapier" sx={{ ml: 1.25 }} />
              <FormControlLabel control={<Switch size="small" />} label="Stripe" sx={{ ml: 1.25 }} />
              <FormControlLabel control={<Switch size="small" defaultChecked />} label="Google Analytics" sx={{ ml: 1.25 }} />
            </FormGroup>
          </Grid>
          <Grid size={12}>
            <InputLabel>Notification Preferences</InputLabel>
            <FormGroup>
              <FormControlLabel sx={{ ml: 0 }} control={<Checkbox size="small" />} label="Email" />
              <FormControlLabel sx={{ ml: 0 }} control={<Checkbox size="small" />} label="In-App" />
              <FormControlLabel sx={{ ml: 0 }} control={<Checkbox size="small" defaultChecked />} label="SMS" />
            </FormGroup>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InputLabel>Select Currency</InputLabel>
            <Autocomplete
              options={currencyName}
              value={selectedCurrency}
              onChange={(_event, newValue) => setSelectedCurrency(newValue)}
              getOptionLabel={(option) => option}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={({ key: optionKey, ...optionProps }, option) => (
                <li key={optionKey} {...optionProps}>
                  {option}
                </li>
              )}
              renderInput={(params) => <TextField {...params} placeholder="Select Items" />}
              slotProps={{ clearIndicator: { sx: { width: 32, height: 32 } } }}
              sx={{ width: 1 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InputLabel>Select Timezone</InputLabel>
            <Autocomplete
              options={timezoneName}
              value={selectedTimezone}
              onChange={(_event, newValue) => setSelectedTimezone(newValue)}
              getOptionLabel={(option) => option}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={({ key: optionKey, ...optionProps }, option) => (
                <li key={optionKey} {...optionProps}>
                  {option}
                </li>
              )}
              renderInput={(params) => <TextField {...params} placeholder="Select Items" />}
              slotProps={{ clearIndicator: { sx: { width: 32, height: 32 } } }}
              sx={{ width: 1 }}
            />
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
}
