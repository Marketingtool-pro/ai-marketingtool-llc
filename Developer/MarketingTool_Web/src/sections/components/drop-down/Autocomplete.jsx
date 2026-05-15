import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// @assets
import { IconCommand } from '@tabler/icons-react';

// @data
import films from '@/data/films';

/***************************  DROP-DOWN - AUTOCOMPLETE  ***************************/

export default function CheckboxesTags({ selectedTags, setSelectedTags, isDisabled = false }) {
  const [value, setValue] = useState(selectedTags || []);

  return (
    <Autocomplete
      multiple
      options={films}
      disableCloseOnSelect
      value={value}
      disabled={isDisabled}
      onChange={(_event, newValue) => {
        setValue(newValue);
        if (setSelectedTags) setSelectedTags(newValue);
      }}
      getOptionLabel={(option) => option.title}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      slotProps={{
        chip: { clickable: true, variant: 'tag', size: 'small', sx: { margin: 0.25 } },
        clearIndicator: { sx: { width: 32, height: 32 } }
      }}
      renderOption={({ key: optionKey, ...optionProps }, option, { selected }) => (
        <li key={optionKey} {...optionProps}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', width: 1 }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
              <Checkbox checked={selected} sx={{ p: 0 }} />
              {option.title}
            </Stack>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" className="MuiTypography-custom">
                <IconCommand size={20} />C
              </Typography>
              <Checkbox checked={selected} sx={{ p: 0, mr: 0.75 }} />
            </Stack>
          </Stack>
        </li>
      )}
      renderInput={(params) => <TextField {...params} placeholder="Select Items" />}
      sx={{ width: 1 }}
    />
  );
}

CheckboxesTags.propTypes = { selectedTags: PropTypes.array, setSelectedTags: PropTypes.func, isDisabled: PropTypes.bool };
