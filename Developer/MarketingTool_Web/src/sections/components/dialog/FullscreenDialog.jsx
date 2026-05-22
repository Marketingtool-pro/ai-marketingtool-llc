import PropTypes from 'prop-types';

// @mui
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import MainCard from '@/components/MainCard';
import PresentationCard from '@/components/cards/PresentationCard';

// @assets
import { IconX } from '@tabler/icons-react';

import fullscreenImg from '@/assets/images/components/fullscreen.webp';

/***************************  DIALOG - ANIMATION  ***************************/

function Transition({ ref, ...props }) {
  return <Slide direction="up" ref={ref} {...props} />;
}

/***************************  DIALOG - FULLSCREEN  ***************************/

export default function FullscreenDialog({ open, handleClose }) {
  return (
    <Dialog fullScreen open={open} onClose={handleClose} slots={{ transition: Transition }} slotProps={{ container: { sx: { width: 1 } } }}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <IconX />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Fullscreen Dialog
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ m: { xs: 1.5, sm: 2, md: 4 } }}>
        <PresentationCard title="SaasAble Blog">
          <MainCard sx={{ height: 'calc(100vh - 228px)', p: 0 }}>
            <CardMedia component="img" src={fullscreenImg} sx={{ width: 1, height: 1 }} alt="dialog fullscreen" />
          </MainCard>
        </PresentationCard>
      </Box>
    </Dialog>
  );
}

Transition.propTypes = { ref: PropTypes.any, props: PropTypes.any };

FullscreenDialog.propTypes = { open: PropTypes.bool, handleClose: PropTypes.func };
