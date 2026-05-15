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

const languageList = ['English', 'Spanish', 'German', 'French', 'Portuguese', 'Hindi', 'Japanese', 'Korean', 'Chinese', 'Arabic'];

/***************************   PROFILE - PREFERRED LANGUAGE  ***************************/

export default function SettingLanguageCard({ selectedTags = 'English', setSelectedTags, isDisabled = false }) {
  const [value, setValue] = useState(selectedTags);

  useEffect(() => {
    // Load saved language from Appwrite prefs
    (async () => {
      try {
        const { appwriteAccount } = await import('@/utils/auth-client/appwrite');
        const prefs = await appwriteAccount.getPrefs();
        if (prefs?.language && languageList.includes(prefs.language)) {
          setValue(prefs.language);
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
        await appwriteAccount.updatePrefs({ ...prefs, language: newValue });
        enqueueSnackbar(`Your preferred language has been updated to ${newValue}.`, { variant: 'success' });
      } catch {
        enqueueSnackbar('Failed to save language preference.', { variant: 'error' });
      }
    }
  };

  return (
    <SettingCard title="Preferred language" caption="Manage your preferred language.">
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <InputLabel>Language</InputLabel>
        <Autocomplete
          options={languageList}
          value={value}
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
    </SettingCard>
  );
}

SettingLanguageCard.propTypes = { selectedTags: PropTypes.string, setSelectedTags: PropTypes.func, isDisabled: PropTypes.bool };
