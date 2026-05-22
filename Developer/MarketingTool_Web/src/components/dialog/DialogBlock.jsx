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
import ZombieingDoodle from '@/images/illustration/ZombieingDoodle';

/***************************  DIALOG - BLOCK  ***************************/

export default function DialogBlock({ title, heading, description, open, onClose, onBlock, isProcessing, actionProps }) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isProcessing) onClose();
      }}
      aria-labelledby="block-dialog-title"
      aria-describedby="block-dialog-description"
      maxWidth="xs"
    >
      <DialogTitle id="block-dialog-title">{title || 'Block'}</DialogTitle>
      <DialogContent dividers>
        <Stack sx={{ gap: 2.5, alignItems: 'center' }}>
          <Box sx={{ height: 170, width: 230 }}>
            <ZombieingDoodle />
          </Box>
          <Stack sx={{ gap: 1, textAlign: 'center', alignItems: 'center' }}>
            <Typography id="block-dialog-description" variant="h5" sx={{ color: 'text.primary' }}>
              {heading || 'Are you sure you want to block?'}
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
          onClick={onBlock}
          {...(isProcessing && { loading: true, loadingPosition: 'end' })}
          {...actionProps}
        >
          {actionProps?.children || 'Block'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DialogBlock.propTypes = {
  title: PropTypes.string,
  heading: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onBlock: PropTypes.func,
  isProcessing: PropTypes.bool,
  actionProps: PropTypes.any
};
