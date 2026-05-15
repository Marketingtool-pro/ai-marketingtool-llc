import { useState } from 'react';

// @mui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @third-party
import { enqueueSnackbar } from 'notistack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  NOTISTACK - PREVENT DUPLICATE  ***************************/

export default function PreventDuplicate() {
  const [checked, setChecked] = useState(true);

  const handleChangeCheck = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <PresentationCard title="Prevent Duplicate">
      <Stack sx={{ gap: 1.5 }}>
        <Box>
          <Checkbox checked={checked} onChange={handleChangeCheck} slotProps={{ input: { 'aria-label': 'controlled' } }} />
          Prevent duplicate
        </Box>
        <Button
          variant="outlined"
          fullWidth
          onClick={() =>
            enqueueSnackbar('You only see me once.', {
              preventDuplicate: checked ? true : false
            })
          }
        >
          Show snackbar
        </Button>
      </Stack>
    </PresentationCard>
  );
}
