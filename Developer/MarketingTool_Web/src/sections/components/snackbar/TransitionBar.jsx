import { useState } from 'react';

// @mui
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grow from '@mui/material/Grow';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Zoom from '@mui/material/Zoom';

// @third-party
import { enqueueSnackbar } from 'notistack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  NOTISTACK - TRANSITIONS  ***************************/

export default function TransitionBar() {
  const [value, setValue] = useState('slide');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleClick = () => {
    switch (value) {
      case 'slide':
        enqueueSnackbar('Your notification here', { TransitionComponent: Slide });
        break;
      case 'grow':
        enqueueSnackbar('Your notification here', { TransitionComponent: Grow });
        break;
      case 'fade':
        enqueueSnackbar('Your notification here', { TransitionComponent: Fade });
        break;
      case 'zoom':
        enqueueSnackbar('Your notification here', { TransitionComponent: Zoom });
        break;
      default:
        enqueueSnackbar('Your notification here', { TransitionComponent: Slide });
        break;
    }
  };

  return (
    <PresentationCard title="Animation">
      <Stack sx={{ gap: 1.5 }}>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            value={value}
            onChange={handleChange}
            name="row-radio-buttons-group"
          >
            <FormControlLabel value="slide" control={<Radio />} label="Slide" />
            <FormControlLabel value="grow" control={<Radio />} label="Grow" />
            <FormControlLabel value="fade" control={<Radio />} label="Fade" />
            <FormControlLabel value="zoom" control={<Radio />} label="Zoom" />
          </RadioGroup>
        </FormControl>
        <Button variant="contained" fullWidth onClick={() => handleClick()}>
          Show Snackbar
        </Button>
      </Stack>
    </PresentationCard>
  );
}
