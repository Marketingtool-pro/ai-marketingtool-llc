// @mui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

// @third-party
import { enqueueSnackbar } from 'notistack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  NOTISTACK - POSTIONING  ***************************/

export default function PositioningSnackbar() {
  return (
    <PresentationCard title="Positioning">
      <Grid container spacing={1.5}>
        <Grid>
          <Button
            variant="contained"
            onClick={() => enqueueSnackbar('This is a Top-Left message', { anchorOrigin: { vertical: 'top', horizontal: 'left' } })}
          >
            Top-Left
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            onClick={() =>
              enqueueSnackbar('This is a Top-Center message', {
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'center'
                }
              })
            }
          >
            Top-Center
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            onClick={() =>
              enqueueSnackbar('This is a Top-Right message', {
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right'
                }
              })
            }
          >
            Top-right
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            onClick={() =>
              enqueueSnackbar('This is a Bottom-Left message', {
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left'
                }
              })
            }
          >
            Bottom-left
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            onClick={() =>
              enqueueSnackbar('This is a Bottom-Center message', {
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'center'
                }
              })
            }
          >
            Bottom-center
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            onClick={() =>
              enqueueSnackbar('This is a Bottom-Right message', {
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right'
                }
              })
            }
          >
            Bottom-Right
          </Button>
        </Grid>
      </Grid>
    </PresentationCard>
  );
}
