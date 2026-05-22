import { useState } from 'react';

// @mui
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

//@project
import PresentationCard from '@/components/cards/PresentationCard';

const industryName = ['SaaS', 'eCommerce', 'Finance', 'Education'];

/***************************  DROP-DOWN - AUTOCOMPLETE  ***************************/

export default function IndustryInput() {
  // Set default selected value as the first item
  const [selectedIndustry, setSelectedIndustry] = useState(industryName[0]);

  return (
    <PresentationCard title="Select Input">
      <Box>
        <InputLabel>Industry</InputLabel>
        <Autocomplete
          options={industryName}
          value={selectedIndustry}
          onChange={(_event, newValue) => setSelectedIndustry(newValue)}
          disableCloseOnSelect
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
      </Box>
    </PresentationCard>
  );
}
