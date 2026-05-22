import PropTypes from 'prop-types';
import { useState, useTransition } from 'react';

import Switch from '@mui/material/Switch';

// @third-party
import { enqueueSnackbar } from 'notistack';

// @project
import { setBlogArchivedStatus } from '../api';
import DialogUnpublish from '@/components/dialog/DialogUnpublish';

/***************************  ACTION - BLOG PUBLISH  ***************************/

export default function BlogPublish({ row }) {
  const [isProcessing, startProcessing] = useTransition();

  const isArchived = row.isArchived;

  const dialogData = {
    title: isArchived ? 'Publish' : 'Archive',
    heading: isArchived ? 'Are you sure you want to publish?' : 'Are you sure you want to archive?',
    description: isArchived
      ? 'By publishing the blog, it will become visible to users.'
      : 'By archiving the blog, it will no longer be visible to users.',
    actionProps: {
      color: 'primary',
      children: isArchived ? 'Publish' : 'Archive'
    }
  };

  // Handle unpublish dialog open/close
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialog = () => {
    if (row.isDraft && !row.refferenceId) return;

    startProcessing(async () => {
      const { error } = await setBlogArchivedStatus(row.refferenceId || row.id, !isArchived);
      if (error) {
        enqueueSnackbar(error, { variant: 'error' });
        return;
      }

      enqueueSnackbar(`Blog has been ${isArchived ? 'published' : 'archived'}`, { variant: 'success' });
      handleDialogClose();
    });
  };

  return (
    <>
      <Switch
        checked={!isArchived}
        onChange={() => setOpenDialog(true)}
        slotProps={{ input: { 'aria-label': 'blog-controlled' } }}
        disabled={row.isDraft && !row.refferenceId}
      />
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

BlogPublish.propTypes = { row: PropTypes.any };
