import { useState } from 'react';

// @mui
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @project
import PresentationCard from '@/components/cards/PresentationCard';
import CheckboxesTags from '@/sections/components/drop-down/Autocomplete';

/***************************  INPUT - INPUTS  ***************************/

export default function TagInput() {
  const [selectedTags, setSelectedTags] = useState([
    { title: 'Se7en', year: 1995 },
    { title: 'Interstellar', year: 2014 }
  ]);

  return (
    <PresentationCard title="Tags Input">
      <Stack sx={{ gap: 2.5 }}>
        <Box>
          <InputLabel>Tags</InputLabel>
          <CheckboxesTags />
        </Box>
        <Box>
          <InputLabel>Filled</InputLabel>
          <CheckboxesTags selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        </Box>
        <Box>
          <InputLabel>Disabled</InputLabel>
          <CheckboxesTags selectedTags={selectedTags} isDisabled />
        </Box>
      </Stack>
    </PresentationCard>
  );
}
