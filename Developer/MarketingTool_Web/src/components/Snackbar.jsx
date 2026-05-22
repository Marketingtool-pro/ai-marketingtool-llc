// @mui
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import MuiSnackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Zoom from '@mui/material/Zoom';

// @project
import { closeSnackbar, useGetSnackbar } from '@/states/snackbar';
import { withAlpha } from '@/utils/colorUtils';

// @assets
import { IconX } from '@tabler/icons-react';

// @types

/***************************  SNACKBAR - ANIMATION  ***************************/

function TransitionSlideLeft(props) {
  return <Slide {...props} direction="left" />;
}

function TransitionSlideUp(props) {
  return <Slide {...props} direction="up" />;
}

function TransitionSlideRight(props) {
  return <Slide {...props} direction="right" />;
}

function TransitionSlideDown(props) {
  return <Slide {...props} direction="down" />;
}

function GrowTransition(props) {
  return <Grow {...props} />;
}

function ZoomTransition(props) {
  return <Zoom {...props} />;
}

const animation = {
  SlideLeft: TransitionSlideLeft,
  SlideUp: TransitionSlideUp,
  SlideRight: TransitionSlideRight,
  SlideDown: TransitionSlideDown,
  Grow: GrowTransition,
  Zoom: ZoomTransition,
  Fade
};

const closeIcon = { p: 0.75, mt: -0.25, width: 30, height: 30, '& svg': { transition: `transform 0.2s ease-in-out` } };
const closeIconScale = { transform: 'scale(1.2)' };

/***************************  SNACKBAR  ***************************/

export default function Snackbar() {
  const { snackbar } = useGetSnackbar();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    closeSnackbar();
  };

  if (!snackbar) return null;

  return (
    <>
      {/* default snackbar */}
      {snackbar.variant === 'default' && (
        <MuiSnackbar
          anchorOrigin={snackbar.anchorOrigin}
          open={snackbar.open}
          autoHideDuration={1500}
          onClose={handleClose}
          message={snackbar.message}
          slots={{ transition: animation[snackbar.transition] }}
          action={
            <>
              <Button
                onClick={handleClose}
                color="secondary"
                sx={(theme) => ({
                  ...theme.typography.caption,
                  height: 24,
                  color: 'background.paper',
                  '&:hover': { bgcolor: withAlpha(theme.vars.palette.error.main, 0.6) }
                })}
              >
                UNDO
              </Button>
              <IconButton
                aria-label="close"
                color="secondary"
                onClick={handleClose}
                sx={{ ...closeIcon, color: 'inherit', '&:hover': { bgcolor: 'transparent', '& svg': closeIconScale } }}
              >
                <IconX />
              </IconButton>
            </>
          }
          sx={{ '& .MuiPaper-root': { bgcolor: 'secondary.main' } }}
        />
      )}
      {/* alert snackbar */}
      {snackbar.variant === 'alert' && (
        <MuiSnackbar
          slots={{ transition: animation[snackbar.transition] }}
          anchorOrigin={snackbar.anchorOrigin}
          open={snackbar.open}
          autoHideDuration={1500}
          onClose={handleClose}
        >
          <Alert
            variant={snackbar.alert.variant}
            severity={snackbar.severity}
            action={
              <>
                {snackbar.actionButton !== false && (
                  <>
                    <Button color={snackbar.severity} size="small" onClick={handleClose} sx={{ mt: 0, height: 25 }}>
                      UNDO
                    </Button>
                    <IconButton
                      aria-label="close"
                      color={snackbar.severity}
                      onClick={handleClose}
                      sx={{ ...closeIcon, '&:hover': { bgcolor: 'transparent', '& svg': closeIconScale } }}
                    >
                      <IconX />
                    </IconButton>
                  </>
                )}
                {snackbar.actionButton === false && snackbar.close && (
                  <IconButton
                    aria-label="close"
                    color="secondary"
                    onClick={handleClose}
                    sx={(theme) => ({
                      ...closeIcon,
                      color: 'inherit',
                      '&:hover': { '& svg': closeIconScale },
                      ...theme.applyStyles('dark', { color: 'secondary.lighter' })
                    })}
                  >
                    <IconX />
                  </IconButton>
                )}
              </>
            }
            sx={{ ...snackbar.alert.sx, ...(snackbar.alert.variant === 'outlined' && { bgcolor: 'background.default' }) }}
          >
            {snackbar.message}
          </Alert>
        </MuiSnackbar>
      )}
    </>
  );
}
