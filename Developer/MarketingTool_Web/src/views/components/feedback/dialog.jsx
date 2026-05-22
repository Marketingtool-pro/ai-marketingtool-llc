import { useState } from 'react';

// @mui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import PresentationCard from '@/components/cards/PresentationCard';
import ComponentsWrapper from '@/components/ComponentsWrapper';
import DialogExitAlert from '@/components/dialog/DialogExitAlert';
import DialogLogout from '@/components/dialog/DialogLogout';
import DialogUnpubilsh from '@/components/dialog/DialogUnpublish';
import DialogDelete from '@/components/dialog/DialogDelete';
import DialogBlock from '@/components/dialog/DialogBlock';
import Modal from '@/components/Modal';

import { ModalSize } from '@/enum';
import FullscreenDialog from '@/sections/components/dialog/FullscreenDialog';

/***************************  DIALOG - DATA  ***************************/

const dialogExitData = {
  title: 'Exit Alert',
  heading: 'Are you sure you want exit?'
};

const dialogLogoutData = {
  title: 'Logout',
  heading: 'Are you sure you want to logout of Erika Collins?',
  description: 'by logging out, you will no longer have access to your account.'
};

const dialogUnpublishData = {
  title: 'Unpublish',
  heading: 'Are you sure you want to unpublish?',
  description: 'by unpublishing the blog it will no longer visible to user'
};

const dialogDeleteData = {
  title: 'Delete Account',
  heading: 'Are you sure you want to Delete Your Account?'
};

const dialogBlockData = {
  title: 'Block User',
  heading: 'Are you sure you want to block?'
};

/***************************  DIALOGS  ***************************/

export default function Dialogs() {
  // Dialog Exit handle
  const [openExitDialog, setOpenExitAlertDialog] = useState(false);

  const handleExitAlertOpen = () => {
    setOpenExitAlertDialog(true);
  };

  const handleExitAlertClose = () => {
    setOpenExitAlertDialog(false);
  };

  const handleExitAlertDiscard = () => {
    console.log('discard');
    setOpenExitAlertDialog(false);
  };

  const handleExitAlertSave = () => {
    console.log('exit');
    setOpenExitAlertDialog(false);
  };

  // Dialog Logout handle
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleDialogLogoutOpen = () => {
    setOpenLogoutDialog(true);
  };

  const handleDialogLogoutClose = () => {
    setOpenLogoutDialog(false);
  };

  const handleDialogLogout = () => {
    console.log('logout');
    setOpenLogoutDialog(false);
  };

  // Dialog Unpublish handle
  const [openUnpublishDialog, setOpenUnpublishDialog] = useState(false);

  const handleDialogUnpublishOpen = () => {
    setOpenUnpublishDialog(true);
  };

  const handleDialogUnpublishClose = () => {
    setOpenUnpublishDialog(false);
  };

  const handleDialogUnpublish = () => {
    console.log('unpublish user');
    setOpenUnpublishDialog(false);
  };

  // Dialog Delete handle
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDialogDeleteOpen = () => {
    setOpenDeleteDialog(true);
  };

  const handleDialogDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDialogDelete = () => {
    console.log('Delete');
    setOpenDeleteDialog(false);
  };

  // Dialog Block handle
  const [openBlockDialog, setOpenBlockDialog] = useState(false);

  const handleDialogBlockOpen = () => {
    setOpenBlockDialog(true);
  };

  const handleDialogBlockClose = () => {
    setOpenBlockDialog(false);
  };

  const handleDialogBlock = () => {
    console.log('Block');
    setOpenBlockDialog(false);
  };

  // Modal handle
  const [open, setOpen] = useState(false);

  // Fullscreen dialog handle
  const [openFSDialog, setOpenFSDialog] = useState(false);

  return (
    <ComponentsWrapper title="Dialogs">
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PresentationCard title="Action Dialogs">
            <Stack direction="row" sx={{ gap: 1.5, flexWrap: 'wrap' }}>
              <Button variant="outlined" onClick={handleExitAlertOpen}>
                Exit Alert
              </Button>
              <Button variant="outlined" onClick={handleDialogLogoutOpen}>
                Logout
              </Button>
              <Button variant="outlined" onClick={handleDialogUnpublishOpen}>
                Unpublish
              </Button>
              <Button variant="outlined" onClick={handleDialogDeleteOpen}>
                Delete
              </Button>
              <Button variant="outlined" onClick={handleDialogBlockOpen}>
                Block
              </Button>
            </Stack>
          </PresentationCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PresentationCard title="Modal">
            <Stack direction="row" sx={{ gap: 1.5, flexWrap: 'wrap' }}>
              <Button variant="outlined" onClick={() => setOpen(true)}>
                Default
              </Button>
              <Button variant="outlined" onClick={() => setOpenFSDialog(true)}>
                Fullscreen
              </Button>
            </Stack>
          </PresentationCard>
        </Grid>
      </Grid>

      <DialogExitAlert
        open={openExitDialog}
        title={dialogExitData.title}
        heading={dialogExitData.heading}
        onClose={handleExitAlertClose}
        onDiscard={handleExitAlertDiscard}
        onSave={handleExitAlertSave}
      />

      <DialogLogout
        open={openLogoutDialog}
        title={dialogLogoutData.title}
        heading={dialogLogoutData.heading}
        description={dialogLogoutData.description}
        onClose={handleDialogLogoutClose}
        onLogout={handleDialogLogout}
      />

      <DialogUnpubilsh
        open={openUnpublishDialog}
        title={dialogUnpublishData.title}
        heading={dialogUnpublishData.heading}
        description={dialogUnpublishData.description}
        onClose={handleDialogUnpublishClose}
        onUnpublish={handleDialogUnpublish}
      />

      <DialogDelete
        open={openDeleteDialog}
        title={dialogDeleteData.title}
        heading={dialogDeleteData.heading}
        description={
          <>
            By deleting account{' '}
            <Typography component="span" sx={{ color: 'primary.main' }}>
              Audrey Leffler
            </Typography>
            , it will vanish all records, so be careful about it.
          </>
        }
        onClose={handleDialogDeleteClose}
        onDelete={handleDialogDelete}
      />

      <DialogBlock
        open={openBlockDialog}
        title={dialogBlockData.title}
        heading={dialogBlockData.heading}
        description={
          <>
            By blocking user{' '}
            <Typography component="span" sx={{ color: 'primary.main' }}>
              Audrey Leffler
            </Typography>
            , the user will not be able to access the service.
          </>
        }
        onClose={handleDialogBlockClose}
        onBlock={handleDialogBlock}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={ModalSize.MD}
        header={{ title: 'Modal Title', subheader: 'Modal Subheader', closeButton: true }}
        modalContent={<Typography variant="h3">Modal Content</Typography>}
        footer={
          <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
            <Button variant="outlined" color="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained">Update</Button>
          </Stack>
        }
      />

      <FullscreenDialog open={openFSDialog} handleClose={() => setOpenFSDialog(false)} />
    </ComponentsWrapper>
  );
}
