import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import PlantDoodle from '@/images/illustration/PlantDoodle';

// @icons
import { IconX } from '@tabler/icons-react';

/***************************  DIALOG - EXIT ALERT  ***************************/

export default function DialogExitAlert({ title, heading, actionProps, open, isProcessing, onClose, onDiscard, onSave }) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isProcessing) onClose();
      }}
      aria-labelledby="exit-dialog-title"
      aria-describedby="exit-dialog-description"
      maxWidth="xs"
      slotProps={{ paper: { elevation: 0, sx: { minWidth: { xs: 356, sm: 400 } } } }}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', pr: 1.25 }}>
        <DialogTitle id="exit-dialog-title">{title || 'Exit'}</DialogTitle>
        <IconButton color="secondary" size="small" aria-label="close" onClick={onClose} disabled={isProcessing}>
          <IconX />
        </IconButton>
      </Stack>
      <DialogContent dividers>
        <Stack sx={{ gap: 2.5, alignItems: 'center' }}>
          <Box sx={{ height: 172, width: 230 }}>
            <PlantDoodle />
          </Box>
          <Stack sx={{ gap: 1, textAlign: 'center', alignItems: 'center' }}>
            <Typography id="exit-dialog-description" variant="h5" sx={{ color: 'text.primary' }}>
              {heading || 'Are you sure you want to exit?'}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button variant="outlined" color="error" onClick={onDiscard} autoFocus disabled={isProcessing}>
          Discard
        </Button>
        <Button variant="contained" onClick={onSave} {...(isProcessing && { loading: true, loadingPosition: 'end' })} {...actionProps}>
          {actionProps?.children || 'Save & Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DialogExitAlert.propTypes = {
  title: PropTypes.string,
  heading: PropTypes.string,
  actionProps: PropTypes.any,
  open: PropTypes.bool,
  isProcessing: PropTypes.bool,
  onClose: PropTypes.func,
  onDiscard: PropTypes.func,
  onSave: PropTypes.func
};
