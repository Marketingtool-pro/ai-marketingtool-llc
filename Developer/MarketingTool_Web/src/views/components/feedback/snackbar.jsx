// @mui
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import PresentationCard from '@/components/cards/PresentationCard';
import {
  ColorVariants,
  CustomComponent,
  Dense,
  DismissSnackBar,
  HideDuration,
  IconVariants,
  MaxSnackbar,
  PositioningSnackbar,
  PreventDuplicate,
  SnackBarAction,
  TransitionBar
} from '@/sections/components/snackbar';
import { openSnackbar } from '@/states/snackbar';

// @types

/***************************  FEEDBACK - SNACKBAR  ***************************/

export default function FeedbackSnackbar() {
  return (
    <ComponentsWrapper title="Snackbar">
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <PresentationCard title="Basic">
            <Grid container spacing={1.5}>
              <Grid>
                <Button
                  variant="contained"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a default message',
                      variant: 'alert',
                      severity: 'primary'
                    })
                  }
                >
                  Default
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a secondary message',
                      variant: 'alert',
                      severity: 'secondary'
                    })
                  }
                >
                  Secondary
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a success message',
                      variant: 'alert',
                      severity: 'success'
                    })
                  }
                >
                  Success
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a warning message',
                      variant: 'alert',
                      severity: 'warning'
                    })
                  }
                >
                  Warning
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  color="info"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a info message',
                      variant: 'alert',
                      severity: 'info'
                    })
                  }
                >
                  Info
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a error message',
                      variant: 'alert',
                      severity: 'error'
                    })
                  }
                >
                  Error
                </Button>
              </Grid>
            </Grid>
          </PresentationCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <PresentationCard title="Outlined">
            <Grid container spacing={1.5}>
              <Grid>
                <Button
                  variant="outlined"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a default message',
                      variant: 'alert',
                      alert: { variant: 'outlined' },
                      severity: 'primary'
                    })
                  }
                >
                  Default
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a secondary message',
                      variant: 'alert',
                      alert: { variant: 'outlined' },
                      severity: 'secondary'
                    })
                  }
                >
                  Secondary
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a success message',
                      variant: 'alert',
                      alert: { variant: 'outlined' },
                      severity: 'success'
                    })
                  }
                >
                  Success
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a warning message',
                      variant: 'alert',
                      alert: { variant: 'outlined' },
                      severity: 'warning'
                    })
                  }
                >
                  Warning
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a info message',
                      variant: 'alert',
                      alert: { variant: 'outlined' },
                      severity: 'info'
                    })
                  }
                >
                  Info
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a error message',
                      variant: 'alert',
                      alert: { variant: 'outlined' },
                      severity: 'error'
                    })
                  }
                >
                  Error
                </Button>
              </Grid>
            </Grid>
          </PresentationCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <PresentationCard title="With Close">
            <Grid container spacing={1.5}>
              <Grid>
                <Button
                  variant="contained"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a default message',
                      variant: 'alert',
                      severity: 'primary',
                      close: true
                    })
                  }
                >
                  Default
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a secondary message',
                      variant: 'alert',
                      severity: 'secondary',
                      close: true
                    })
                  }
                >
                  Secondary
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a success message',
                      variant: 'alert',
                      severity: 'success',
                      close: true
                    })
                  }
                >
                  Success
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a warning message',
                      variant: 'alert',
                      severity: 'warning',
                      close: true
                    })
                  }
                >
                  Warning
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  color="info"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a info message',
                      variant: 'alert',
                      severity: 'info',
                      close: true
                    })
                  }
                >
                  Info
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a error message',
                      variant: 'alert',
                      severity: 'error',
                      close: true
                    })
                  }
                >
                  Error
                </Button>
              </Grid>
            </Grid>
          </PresentationCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <PresentationCard title="With Close + Action">
            <Grid container spacing={1.5}>
              <Grid>
                <Button
                  variant="outlined"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a default message',
                      variant: 'alert',
                      alert: { variant: 'outlined' },
                      severity: 'primary',
                      actionButton: true,
                      close: true
                    })
                  }
                >
                  Default
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a secondary message',
                      variant: 'alert',
                      alert: { variant: 'outlined' },
                      severity: 'secondary',
                      actionButton: true,
                      close: true
                    })
                  }
                >
                  Secondary
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a success message',
                      variant: 'alert',
                      alert: { variant: 'outlined' },
                      severity: 'success',
                      actionButton: true,
                      close: true
                    })
                  }
                >
                  Success
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a warning message',
                      variant: 'alert',
                      alert: { variant: 'outlined' },
                      severity: 'warning',
                      actionButton: true,
                      close: true
                    })
                  }
                >
                  Warning
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a info message',
                      variant: 'alert',
                      alert: { variant: 'outlined' },
                      severity: 'info',
                      actionButton: true,
                      close: true
                    })
                  }
                >
                  Info
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a error message',
                      variant: 'alert',
                      alert: { variant: 'outlined' },
                      severity: 'error',
                      actionButton: true,
                      close: true
                    })
                  }
                >
                  Error
                </Button>
              </Grid>
            </Grid>
          </PresentationCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <PresentationCard title="Position">
            <Grid container spacing={1.5}>
              <Grid>
                <Button
                  variant="contained"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      anchorOrigin: { vertical: 'top', horizontal: 'left' },
                      message: 'This is a Top-Left message!',
                      close: true
                    })
                  }
                >
                  Top-Left
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      anchorOrigin: { vertical: 'top', horizontal: 'center' },
                      message: 'This is a Top-Center message!',
                      close: true
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
                    openSnackbar({
                      open: true,
                      anchorOrigin: { vertical: 'top', horizontal: 'right' },
                      message: 'This is a Top-Right message!',
                      close: true
                    })
                  }
                >
                  Top-Right
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                      message: 'This is a Bottom-Right message!',
                      close: true
                    })
                  }
                >
                  Bottom-Right
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                      message: 'This is a Bottom-Center message!',
                      close: true
                    })
                  }
                >
                  Bottom-Center
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                      message: 'This is a Bottom-Left message!',
                      close: true
                    })
                  }
                >
                  Bottom-Left
                </Button>
              </Grid>
            </Grid>
          </PresentationCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <PresentationCard title="Transitions">
            <Grid container spacing={1.5}>
              <Grid>
                <Button
                  variant="contained"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a Fade message!',
                      transition: 'Fade',
                      close: true
                    })
                  }
                >
                  Default/Fade
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a Slide-Left message!',
                      transition: 'SlideLeft',
                      close: true
                    })
                  }
                >
                  Slide Left
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a Slide-Up message!',
                      transition: 'SlideUp',
                      close: true
                    })
                  }
                >
                  Slide Up
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a Slide-Right message!',
                      transition: 'SlideRight',
                      close: true
                    })
                  }
                >
                  Slide Right
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a Slide-Down message!',
                      transition: 'SlideDown',
                      close: true
                    })
                  }
                >
                  Slide Down
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  onClick={() =>
                    openSnackbar({
                      open: true,
                      message: 'This is a Grow message!',
                      transition: 'Grow',
                      close: true
                    })
                  }
                >
                  Grow
                </Button>
              </Grid>
            </Grid>
          </PresentationCard>
        </Grid>
        <Grid size={12}>
          <Typography variant="subtitle1" sx={{ mt: 1.5 }}>
            Extended - Notistack
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ColorVariants />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <MaxSnackbar />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <IconVariants />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <HideDuration />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SnackBarAction />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <DismissSnackBar />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <PreventDuplicate />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <TransitionBar />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Dense />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <CustomComponent />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <PositioningSnackbar />
        </Grid>
      </Grid>
    </ComponentsWrapper>
  );
}
