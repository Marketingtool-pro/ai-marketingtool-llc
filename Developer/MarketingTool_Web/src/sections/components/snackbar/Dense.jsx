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
import { handlerDense } from '@/states/snackbar';

/***************************  NOTISTACK - DENSE  ***************************/

export default function Dense() {
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    handlerDense(event.target.checked);
  };

  return (
    <PresentationCard title="Dense">
      <Stack sx={{ gap: 1.5 }}>
        <Box>
          <Checkbox checked={checked} onChange={handleChange} slotProps={{ input: { 'aria-label': 'controlled' } }} />
          Dense margins
        </Box>
        <Button variant="outlined" onClick={() => enqueueSnackbar('Your notification here')}>
          Show snackbar
        </Button>
      </Stack>
    </PresentationCard>
  );
}
