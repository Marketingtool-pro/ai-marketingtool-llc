import { useState } from 'react';

// @mui
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';

// @third-party
import { enqueueSnackbar } from 'notistack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

const marks = [{ value: 1 }, { value: 3 }, { value: 5 }, { value: 7 }, { value: 9 }, { value: 11 }];

/***************************  NOTISTACK - TIMEOUT  ***************************/

export default function HideDuration() {
  const [value, setValue] = useState(3);

  const handleChange = (event, newValue) => {
    if (typeof newValue === 'number') {
      setValue(newValue);
    }
  };

  function valueLabelFormat(value) {
    if (value === 11) return `persist`;
    return `${value}s`;
  }

  return (
    <PresentationCard title="Hide Duration">
      <Stack sx={{ mt: 1.5, gap: 1.5 }}>
        <Slider
          value={value}
          min={1}
          step={2}
          max={11}
          valueLabelDisplay="on"
          marks={marks}
          getAriaValueText={valueLabelFormat}
          valueLabelFormat={valueLabelFormat}
          onChange={handleChange}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            if (value !== 11) {
              enqueueSnackbar('Your notification here', { autoHideDuration: value * 1000 });
            } else {
              enqueueSnackbar('Your notification here', { persist: true });
            }
          }}
        >
          Show Snackbar
        </Button>
      </Stack>
    </PresentationCard>
  );
}
