// @mui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

// @third-party
import { enqueueSnackbar } from 'notistack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  NOTISTACK - COLOR VARIANTS  ***************************/

export default function ColorVariants() {
  return (
    <PresentationCard title="Color Variants">
      <Grid container spacing={1.5}>
        <Grid>
          <Button variant="contained" onClick={() => enqueueSnackbar('This is default message.')}>
            Default
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" color="success" onClick={() => enqueueSnackbar('This is success message', { variant: 'success' })}>
            Success
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" color="warning" onClick={() => enqueueSnackbar('This is warning message', { variant: 'warning' })}>
            Warning
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" color="info" onClick={() => enqueueSnackbar('This is info message', { variant: 'info' })}>
            Info
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" color="error" onClick={() => enqueueSnackbar('This is error message', { variant: 'error' })}>
            Error
          </Button>
        </Grid>
      </Grid>
    </PresentationCard>
  );
}
