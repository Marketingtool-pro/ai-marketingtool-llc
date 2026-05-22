import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// @mui
import Autocomplete from '@mui/material/Autocomplete';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

// @third-party
import { enqueueSnackbar } from 'notistack';

// @project
import SettingCard from '@/components/cards/SettingCard';

const TimeList = [
  '(GMT-12:00) International Date Line West',
  '(GMT-11:00) Midway Island, Samoa',
  '(GMT-10:00) Hawaii',
  '(GMT-09:00) Alaska',
  '(GMT-08:00) Pacific Time (US & Canada) - Los Angeles, Seattle',
  '(GMT-07:00) Mountain Time (US & Canada) - Denver, Phoenix',
  '(GMT-06:00) Central Time (US & Canada) - Chicago, Dallas',
  '(GMT-05:00) Eastern Time (US & Canada) - New York, Washington, D.C.',
  '(GMT-04:00) Atlantic Time (Canada) - Halifax',
  '(GMT-03:00) Buenos Aires, Sao Paulo',
  '(GMT-02:00) Mid-Atlantic',
  '(GMT-01:00) Azores, Cape Verde',
  '(GMT+00:00) London, Dublin, Lisbon',
  '(GMT+01:00) Berlin, Paris, Rome, Madrid',
  '(GMT+02:00) Cairo, Johannesburg, Istanbul',
  '(GMT+03:00) Moscow, Riyadh, Nairobi',
  '(GMT+03:30) Tehran',
  '(GMT+04:00) Dubai, Baku',
  '(GMT+04:30) Kabul',
  '(GMT+05:00) Karachi, Tashkent',
  '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi',
  '(GMT+05:45) Kathmandu',
  '(GMT+06:00) Dhaka, Almaty',
  '(GMT+06:30) Yangon',
  '(GMT+07:00) Bangkok, Jakarta, Hanoi',
  '(GMT+08:00) Singapore, Hong Kong, Beijing, Perth',
  '(GMT+09:00) Tokyo, Seoul',
  '(GMT+09:30) Adelaide, Darwin',
  '(GMT+10:00) Sydney, Melbourne, Brisbane',
  '(GMT+11:00) Solomon Islands',
  '(GMT+12:00) Auckland, Fiji'
];

// Detect timezone from browser
function detectTimezone() {
  try {
    const offset = new Date().getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const mins = Math.abs(offset) % 60;
    const sign = offset <= 0 ? '+' : '-';
    const gmtStr = `GMT${sign}${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    return TimeList.find((t) => t.includes(gmtStr)) || TimeList[20];
  } catch {
    return TimeList[20];
  }
}

/***************************   PROFILE - TIMEZONE  ***************************/

export default function SettingTimezoneCard({ selectedTags, setSelectedTags, isDisabled = false }) {
  const [value, setValue] = useState(selectedTags || detectTimezone());

  useEffect(() => {
    // Load saved timezone from Appwrite prefs
    (async () => {
      try {
        const { appwriteAccount } = await import('@/utils/auth-client/appwrite');
        const prefs = await appwriteAccount.getPrefs();
        if (prefs?.timezone) {
          const saved = TimeList.find((t) => t === prefs.timezone);
          if (saved) setValue(saved);
        }
      } catch { /* ignore */ }
    })();
  }, []);

  const handleChange = async (_event, newValue) => {
    if (typeof newValue === 'string') {
      setValue(newValue);
      if (setSelectedTags) setSelectedTags(newValue);
      try {
        const { appwriteAccount } = await import('@/utils/auth-client/appwrite');
        const prefs = await appwriteAccount.getPrefs();
        await appwriteAccount.updatePrefs({ ...prefs, timezone: newValue });
        enqueueSnackbar('Timezone updated successfully.', { variant: 'success' });
      } catch {
        enqueueSnackbar('Failed to save timezone preference.', { variant: 'error' });
      }
    }
  };

  return (
    <SettingCard title="Timezone" caption="Set your preferred timezone for accurate timekeeping.">
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <InputLabel>Timezone</InputLabel>
        <Autocomplete
          options={TimeList}
          value={value}
          onChange={handleChange}
          disabled={isDisabled}
          disableClearable
          renderOption={({ key: optionKey, ...optionProps }, option) => (
            <li key={optionKey} {...optionProps}>
              {option}
            </li>
          )}
          renderInput={(params) => <TextField {...params} slotProps={{ htmlInput: { ...params.inputProps, 'aria-label': 'timezone' } }} />}
          sx={{ width: 1 }}
        />
        <FormHelperText>
          This is the timezone for your account. All scheduled reports and notifications use this timezone.
        </FormHelperText>
      </Box>
    </SettingCard>
  );
}

SettingTimezoneCard.propTypes = { selectedTags: PropTypes.string, setSelectedTags: PropTypes.func, isDisabled: PropTypes.bool };
