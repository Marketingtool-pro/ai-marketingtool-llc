// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// @third-party
import { useSnackbar } from 'notistack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  NOTISTACK - DISMISS  ***************************/

export default function DismissSnackBar() {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  return (
    <PresentationCard title="Dismiss Programmatically">
      <Stack direction="row" sx={{ gap: 1.5, justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          fullWidth
          color="error"
          onClick={() =>
            enqueueSnackbar('No connection!', {
              variant: 'error',
              persist: true,
              anchorOrigin: { horizontal: 'center', vertical: 'bottom' }
            })
          }
        >
          Simulate connection loss
        </Button>
        <Button variant="outlined" fullWidth onClick={() => closeSnackbar()}>
          Back Online
        </Button>
      </Stack>
    </PresentationCard>
  );
}
