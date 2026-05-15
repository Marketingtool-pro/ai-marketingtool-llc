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
import RollerSkatingDoodle from '@/images/illustration/RollerSkatingDoodle';

/***************************  DIALOG - LOGOUT  ***************************/

export default function DialogLogout({ title, heading, open, description, onClose, onLogout }) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="logout-dialog-title" aria-describedby="logout-dialog-description" maxWidth="sm">
      <DialogTitle id="logout-dialog-title">{title || 'Logout'}</DialogTitle>
      <DialogContent dividers>
        <Stack sx={{ gap: 2.5, alignItems: 'center' }}>
          <Box sx={{ width: 230 }}>
            <RollerSkatingDoodle />
          </Box>
          <Stack sx={{ gap: 1, textAlign: 'center', alignItems: 'center' }}>
            <Typography id="logout-dialog-description" variant="h5" sx={{ color: 'text.primary' }}>
              {heading || 'Are you sure you want to logout?'}
            </Typography>
            {description && (
              <Typography variant="body1" color="grey.700" sx={{ width: '90%' }}>
                {description}
              </Typography>
            )}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button variant="outlined" color="secondary" onClick={onClose} autoFocus>
          Cancel
        </Button>
        <Button variant="contained" sx={{ ml: 0 }} onClick={onLogout}>
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DialogLogout.propTypes = {
  title: PropTypes.string,
  heading: PropTypes.string,
  open: PropTypes.bool,
  description: PropTypes.string,
  onClose: PropTypes.func,
  onLogout: PropTypes.func
};
