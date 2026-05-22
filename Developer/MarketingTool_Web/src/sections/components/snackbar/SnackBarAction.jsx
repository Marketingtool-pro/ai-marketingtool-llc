// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// @third-party
import { useSnackbar } from 'notistack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  NOTISTACK - ACTION BUTTONS  ***************************/

export default function SnackBarAction() {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const actionTask = (snackbarId) => (
    <Stack direction="row" sx={{ gap: 0.5 }}>
      <Button size="small" onClick={() => closeSnackbar(snackbarId)} sx={{ color: 'inherit', '&:hover': { bgcolor: 'error.main' } }}>
        DISMISS
      </Button>
      <Button
        size="small"
        color="warning"
        variant="contained"
        onClick={() => {
          alert(`I belong to snackbar with id ${snackbarId}`);
        }}
      >
        Continue
      </Button>
    </Stack>
  );

  return (
    <PresentationCard title="With Action">
      <Button variant="contained" fullWidth onClick={() => enqueueSnackbar('Your notification here', { action: (key) => actionTask(key) })}>
        Show Snackbar
      </Button>
    </PresentationCard>
  );
}
