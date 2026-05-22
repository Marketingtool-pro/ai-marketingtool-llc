import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import UnboxingDoodle from '@/images/illustration/UnboxingDoodle';

/***************************  DIALOG - UNPUBLISH  ***************************/

export default function DialogUnpublish({ title, heading, description, open, isProcessing, onClose, onUnpublish, actionProps }) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isProcessing) onClose();
      }}
      aria-labelledby="unpublish-dialog-title"
      aria-describedby="unpublish-dialog-description"
      maxWidth="xs"
    >
      <DialogTitle id="unpublish-dialog-title">{title || 'Unpublish'}</DialogTitle>
      <DialogContent dividers>
        <Stack sx={{ gap: 2.5, alignItems: 'center' }}>
          <Box sx={{ height: 170, width: 230 }}>
            <UnboxingDoodle />
          </Box>
          <Stack sx={{ gap: 1, textAlign: 'center', alignItems: 'center' }}>
            <Typography id="unpublish-dialog-description" variant="h5" sx={{ color: 'text.primary' }}>
              {heading || 'Are you sure you want to unpublish?'}
            </Typography>
            <Typography variant="body1" color="grey.700" sx={{ width: '90%' }}>
              {description}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button variant="outlined" color="secondary" onClick={onClose} autoFocus disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onUnpublish}
          {...(isProcessing && { loading: true, loadingPosition: 'end' })}
          {...actionProps}
        >
          {actionProps?.children || 'Unpublish'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DialogUnpublish.propTypes = {
  title: PropTypes.string,
  heading: PropTypes.string,
  description: PropTypes.string,
  open: PropTypes.bool,
  isProcessing: PropTypes.bool,
  onClose: PropTypes.func,
  onUnpublish: PropTypes.func,
  actionProps: PropTypes.any
};
