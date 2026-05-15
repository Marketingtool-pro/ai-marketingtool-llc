import { useState } from 'react';

// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @third-party
import { enqueueSnackbar } from 'notistack';

// @project
import { handlerIncrease, useGetSnackbar } from '@/states/snackbar';
import PresentationCard from '@/components/cards/PresentationCard';

// @assets
import { IconMinus, IconPlus } from '@tabler/icons-react';

/***************************  NOTISTACK - MAXIMUM SNACKBAR  ***************************/

export default function MaxSnackbar() {
  const width = { minWidth: 'auto' };

  const { snackbar } = useGetSnackbar();
  const [value, setValue] = useState(3);

  const handlerMaxStack = () => {
    enqueueSnackbar('Your notification here');
    handlerIncrease(value);
  };

  return (
    <PresentationCard title="Maximum snackbars">
      <Stack sx={{ gap: 1.5 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            size="small"
            sx={width}
            disabled={snackbar.maxStack === 0 || value <= 0}
            onClick={() => setValue((prev) => prev - 1)}
          >
            <IconMinus size={16} />
          </Button>
          <Typography variant="body1">stack up to {value}</Typography>
          <Button variant="outlined" size="small" sx={width} disabled={value === 4} onClick={() => setValue((prev) => prev + 1)}>
            <IconPlus size={16} />
          </Button>
        </Stack>
        <Button variant="contained" fullWidth onClick={() => handlerMaxStack()}>
          Show Snackbar
        </Button>
      </Stack>
    </PresentationCard>
  );
}
