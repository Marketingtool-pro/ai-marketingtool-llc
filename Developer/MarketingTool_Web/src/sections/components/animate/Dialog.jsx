import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

// @third-party
import { AnimatePresence, motion } from 'motion/react';

// @project
import Sidebar from './Sidebar';
import MainCard from '@/components/MainCard';
import { getVariant } from '@/components/third-party/motion/get-variant';

function MotionPaper({ initial, animate, exit, transition, ...other }) {
  return (
    <motion.div initial={initial} animate={animate} exit={exit} transition={transition}>
      <Paper {...other} />
    </motion.div>
  );
}

/***************************  DIALOG - ANIMATION  ***************************/

export default function DialogAnimation() {
  const [open, setOpen] = useState(false);
  const [animationType, setAnimationType] = useState('slideInUp');

  const handleAnimationChange = (type) => {
    setAnimationType(type);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const variants = getVariant(animationType);

  return (
    <MainCard sx={{ p: 0 }}>
      <Grid container spacing={2} direction={{ xs: 'column-reverse', md: 'row' }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Sidebar onAnimationChange={handleAnimationChange} />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Stack sx={{ gap: 2, height: 400, overflowY: 'auto', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Button variant="outlined" onClick={handleClickOpen}>
              Open alert dialog
            </Button>

            <AnimatePresence>
              {open && (
                <Dialog
                  open
                  onClose={handleClose}
                  PaperComponent={(props) => (
                    <MotionPaper
                      {...props}
                      initial={variants.initial}
                      animate={variants.animate}
                      exit={variants.exit}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                  )}
                >
                  <DialogTitle>{"Use Google's location service?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are
                      running.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={handleClose} autoFocus>
                      Agree
                    </Button>
                  </DialogActions>
                </Dialog>
              )}
            </AnimatePresence>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}

MotionPaper.propTypes = {
  initial: PropTypes.any,
  animate: PropTypes.any,
  exit: PropTypes.any,
  transition: PropTypes.any,
  other: PropTypes.any
};
