import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// @mui
import Autocomplete from '@mui/material/Autocomplete';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { enqueueSnackbar } from 'notistack';

// @project
import SettingCard from '@/components/cards/SettingCard';

// Currency list — major world currencies
const currencyList = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '\u20AC', name: 'Euro' },
  { code: 'GBP', symbol: '\u00A3', name: 'British Pound' },
  { code: 'INR', symbol: '\u20B9', name: 'Indian Rupee' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'JPY', symbol: '\u00A5', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '\u00A5', name: 'Chinese Yuan' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'KRW', symbol: '\u20A9', name: 'South Korean Won' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'THB', symbol: '\u0E3F', name: 'Thai Baht' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'PHP', symbol: '\u20B1', name: 'Philippine Peso' }
];

// Detect user's currency from browser locale
function detectCurrency() {
  try {
    const locale = navigator.language || 'en-US';
    const parts = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).resolvedOptions();
    // Try to get currency from locale region
    const region = locale.split('-')[1]?.toUpperCase();
    const regionMap = {
      US: 'USD', GB: 'GBP', IN: 'INR', AU: 'AUD', CA: 'CAD', JP: 'JPY',
      CN: 'CNY', BR: 'BRL', AE: 'AED', SG: 'SGD', MX: 'MXN', ZA: 'ZAR',
      KR: 'KRW', SE: 'SEK', CH: 'CHF', NZ: 'NZD', TH: 'THB', ID: 'IDR',
      PH: 'PHP', DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
      PT: 'EUR', BE: 'EUR', AT: 'EUR', IE: 'EUR', FI: 'EUR', GR: 'EUR'
    };
    const code = regionMap[region] || parts?.currency || 'USD';
    return currencyList.find((c) => c.code === code) || currencyList[0];
  } catch {
    return currencyList[0]; // USD fallback
  }
}

function getCurrencyLabel(c) {
  return `${c.name} (${c.code} ${c.symbol})`;
}

/***************************   GENERAL - CURRENCY  ***************************/

function SettingsCurrency() {
  const [currency, setCurrency] = useState(detectCurrency());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load saved currency from Appwrite prefs (override auto-detect if saved)
    (async () => {
      try {
        const { appwriteAccount } = await import('@/utils/auth-client/appwrite');
        const prefs = await appwriteAccount.getPrefs();
        if (prefs?.currency) {
          const saved = currencyList.find((c) => c.code === prefs.currency);
          if (saved) setCurrency(saved);
        }
      } catch { /* ignore */ }
    })();
  }, []);

  const handleChange = async (_event, newValue) => {
    if (!newValue) return;
    setCurrency(newValue);
    setSaving(true);
    try {
      const { appwriteAccount } = await import('@/utils/auth-client/appwrite');
      const prefs = await appwriteAccount.getPrefs();
      await appwriteAccount.updatePrefs({ ...prefs, currency: newValue.code });
      enqueueSnackbar(`Currency updated to ${newValue.name} (${newValue.code}).`, { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to save currency preference.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ width: 1 }}>
      <InputLabel>Currency display</InputLabel>
      <Autocomplete
        options={currencyList}
        value={currency}
        onChange={handleChange}
        getOptionLabel={getCurrencyLabel}
        isOptionEqualToValue={(option, val) => option?.code === val?.code}
        disabled={saving}
        disableClearable
        renderOption={({ key: optionKey, ...optionProps }, option) => (
          <li key={optionKey} {...optionProps}>
            <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 28 }}>{option.symbol}</Typography>
              <Typography variant="body2">{option.name} ({option.code})</Typography>
            </Stack>
          </li>
        )}
        renderInput={(params) => <TextField {...params} slotProps={{ htmlInput: { ...params.inputProps, 'aria-label': 'currency' } }} />}
        sx={{ width: 1 }}
      />
      <FormHelperText>
        Currency used for billing and pricing display. Auto-detected from your location.
      </FormHelperText>
    </Box>
  );
}

/***************************   GENERAL - LANGUAGE  ***************************/

function SettingsLanguage({ selectedTags = 'English', setSelectedTags, isDisabled = false }) {
  const [language, setLanguage] = useState(selectedTags);
  const languageList = ['English', 'Spanish', 'German', 'French', 'Portuguese', 'Hindi', 'Japanese', 'Korean', 'Chinese', 'Arabic'];

  useEffect(() => {
    // Load saved language from Appwrite prefs
    (async () => {
      try {
        const { appwriteAccount } = await import('@/utils/auth-client/appwrite');
        const prefs = await appwriteAccount.getPrefs();
        if (prefs?.language && languageList.includes(prefs.language)) {
          setLanguage(prefs.language);
        }
      } catch { /* ignore */ }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = async (_event, newValue) => {
    if (typeof newValue === 'string') {
      setLanguage(newValue);
      if (setSelectedTags) setSelectedTags(newValue);
      try {
        const { appwriteAccount } = await import('@/utils/auth-client/appwrite');
        const prefs = await appwriteAccount.getPrefs();
        await appwriteAccount.updatePrefs({ ...prefs, language: newValue });
        enqueueSnackbar(`Your preferred language has been updated to ${newValue}.`, { variant: 'success' });
      } catch {
        enqueueSnackbar('Failed to save language preference.', { variant: 'error' });
      }
    }
  };

  return (
    <Box sx={{ width: 1 }}>
      <InputLabel>Language</InputLabel>
      <Autocomplete
        options={languageList}
        value={language}
        onChange={handleChange}
        disabled={isDisabled}
        disableClearable
        renderOption={({ key: optionKey, ...optionProps }, option) => (
          <li key={optionKey} {...optionProps}>
            {option}
          </li>
        )}
        renderInput={(params) => <TextField {...params} slotProps={{ htmlInput: { ...params.inputProps, 'aria-label': 'language' } }} />}
        sx={{ width: 1 }}
      />
      <FormHelperText>
        This is the language you will see across your MarketingTool dashboard.
      </FormHelperText>
    </Box>
  );
}

/***************************   GENERAL - TIMEZONE  ***************************/

function SettingsTimezone({ selectedTags, setSelectedTags, isDisabled = false }) {
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

  // Detect user's timezone
  const detectTimezone = () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const offset = new Date().getTimezoneOffset();
      const hours = Math.floor(Math.abs(offset) / 60);
      const mins = Math.abs(offset) % 60;
      const sign = offset <= 0 ? '+' : '-';
      const gmtStr = `GMT${sign}${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
      const match = TimeList.find((t) => t.includes(gmtStr));
      return match || TimeList.find((t) => t.includes('GMT+05:30')) || TimeList[0];
    } catch {
      return TimeList[0];
    }
  };

  const [timezone, setTimeZone] = useState(selectedTags || detectTimezone());

  useEffect(() => {
    // Load saved timezone from Appwrite prefs
    (async () => {
      try {
        const { appwriteAccount } = await import('@/utils/auth-client/appwrite');
        const prefs = await appwriteAccount.getPrefs();
        if (prefs?.timezone) {
          const saved = TimeList.find((t) => t === prefs.timezone);
          if (saved) setTimeZone(saved);
        }
      } catch { /* ignore */ }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = async (_event, newValue) => {
    if (typeof newValue === 'string') {
      setTimeZone(newValue);
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
    <Box sx={{ width: 1 }}>
      <InputLabel>Timezone</InputLabel>
      <Autocomplete
        options={TimeList}
        value={timezone}
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
  );
}

/***************************   GENERAL - DETAILS  ***************************/

export default function GeneralDetails() {
  const listStyle = { p: { xs: 2, sm: 3 }, flexWrap: 'wrap', gap: 1 };

  return (
    <SettingCard title="Details" caption="Manage your currency, language and timezone.">
      <List disablePadding>
        <ListItem sx={listStyle} divider>
          <SettingsCurrency />
        </ListItem>
        <ListItem sx={listStyle} divider>
          <SettingsLanguage />
        </ListItem>
        <ListItem sx={listStyle} divider>
          <SettingsTimezone />
        </ListItem>
        <ListItem sx={{ bgcolor: 'grey.100' }} divider>
          <Stack direction="row" sx={{ width: 1, alignItems: 'center', py: 1 }}>
            <Typography variant="body2">
              These settings apply to your MarketingTool account across all devices.
            </Typography>
          </Stack>
        </ListItem>
      </List>
    </SettingCard>
  );
}

SettingsLanguage.propTypes = { selectedTags: PropTypes.string, setSelectedTags: PropTypes.func, isDisabled: PropTypes.bool };

SettingsTimezone.propTypes = { selectedTags: PropTypes.string, setSelectedTags: PropTypes.func, isDisabled: PropTypes.bool };
