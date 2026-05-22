import PropTypes from 'prop-types';
import { useState, useTransition } from 'react';

import Switch from '@mui/material/Switch';

// @third-party
import { enqueueSnackbar } from 'notistack';

// @project
import { publicProfile } from '../api';

import DialogUnpublish from '@/components/dialog/DialogUnpublish';

/***************************  ACTION - BLOG PUBLISH  ***************************/

export default function PublicPerson({ row }) {
  const dialogData = {
    title: row.isPublic ? 'Private' : 'Public',
    heading: row.isPublic ? 'Are you sure you want to move this to private profile?' : 'Do you really want to set this profile as public?',
    description: row.isPublic
      ? 'By making the profile private, it will no longer be visible to users.'
      : 'By making the profile public, it will become visible to users.',
    actionProps: {
      color: 'primary',
      children: row.isPublic ? 'Make Private' : 'Make Public'
    }
  };

  // Handle unpublish dialog open/close
  const [openDialog, setOpenDialog] = useState(false);
  const [isProcessing, startProcessingTransition] = useTransition();

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialog = () => {
    startProcessingTransition(async () => {
      const { error } = await publicProfile(row.id, !row.isPublic);
      if (error) {
        enqueueSnackbar(error, { variant: 'error' });
        return;
      }
      enqueueSnackbar(row.isPublic ? 'Profile has been moved to private successfully.' : 'Profile has been made public successfully.', {
        variant: 'success'
      });
      setOpenDialog(false);
    });
  };

  return (
    <>
      <Switch checked={row.isPublic} onChange={() => setOpenDialog(true)} slotProps={{ input: { 'aria-label': 'blog-controlled' } }} />
      <DialogUnpublish
        {...dialogData}
        open={openDialog}
        onClose={handleDialogClose}
        onUnpublish={handleDialog}
        isProcessing={isProcessing}
      />
    </>
  );
}

PublicPerson.propTypes = { row: PropTypes.any };
