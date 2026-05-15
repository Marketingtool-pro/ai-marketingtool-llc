// @mui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';

// @third-party
import { enqueueSnackbar } from 'notistack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';
import { handlerIconVariants, useGetSnackbar } from '@/states/snackbar';

/***************************  NOTISTACK - CUSTOM ICON  ***************************/

export default function IconVariants() {
  const { snackbar } = useGetSnackbar();

  const handleChange = (event) => {
    handlerIconVariants(event.target.value);
  };

  return (
    <PresentationCard title="With Icons">
      <Stack sx={{ gap: 1.5 }}>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            value={snackbar.iconVariant}
            onChange={handleChange}
            name="row-radio-buttons-group"
          >
            <FormControlLabel value="usedefault" control={<Radio />} label="Use Default" />
            <FormControlLabel value="useemojis" control={<Radio />} label="Use Emojis" />
            <FormControlLabel value="hide" control={<Radio />} label="Hide" />
          </RadioGroup>
        </FormControl>
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            enqueueSnackbar('Your notification here', { variant: 'success' });
          }}
        >
          Show Snackbar
        </Button>
      </Stack>
    </PresentationCard>
  );
}
