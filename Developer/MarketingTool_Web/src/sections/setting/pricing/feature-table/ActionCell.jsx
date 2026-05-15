import PropTypes from 'prop-types';
import { useState, useTransition } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';

// @third-party
import { AnimatePresence, motion } from 'motion/react';
import { enqueueSnackbar } from 'notistack';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';

// @project
import UpsertFeature from '../UpsertFeature';
import DialogDelete from '@/components/dialog/DialogDelete';
import MainCard from '@/components/MainCard';
import { varSlide } from '@/components/third-party/motion/animate/dialog';

/***************************  DIALOG - DATA  ***************************/

const dialogDeleteData = {
  title: 'Delete Feature',
  heading: 'Are you sure you want to delete?'
};

/***************************  TABLE - ACTION  ***************************/

export default function ActionCell({ row, onDelete }) {
  const theme = useTheme();

  const [isProcessing, startTransition] = useTransition();

  // Handle action popper
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'feature-action-popper' : undefined;

  const handleActionClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  // Handle edit dialog
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // Handle delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDialogDelete = (id) => {
    startTransition(async () => {
      // Replace the below timeout with your actual API call to delete feature
      // Example: await deleteFeature(id);
      await new Promise((resolve) => setTimeout(() => resolve('ok'), 3000));
      enqueueSnackbar(`Feature has been deleted.`, { variant: 'success' });
      onDelete(id);
      setOpenDeleteDialog(false);
    });
  };

  const buttonStyle = { borderRadius: 2 };
  const iconSize = 16;

  return (
    <>
      <IconButton color="secondary" size="small" onClick={handleActionClick} aria-label="action">
        <IconDotsVertical size={iconSize} color={theme.vars.palette.text.secondary} />
      </IconButton>
      <AnimatePresence>
        {open && (
          <Popper placement="top-end" id={id} open={open} anchorEl={anchorEl} transition>
            {({ TransitionProps }) => (
              <Fade in={open} {...TransitionProps}>
                <motion.div variants={varSlide('slideInUp', { distance: 10 })} initial="initial" animate="animate" exit="exit">
                  <MainCard sx={{ borderRadius: 3, boxShadow: theme.vars.customShadows.tooltip, minWidth: 150, p: 0.5 }}>
                    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                      <List disablePadding>
                        <ListItemButton sx={buttonStyle} onClick={() => setOpenEditDialog(true)}>
                          <ListItemIcon>
                            <IconEdit size={iconSize} />
                          </ListItemIcon>
                          <ListItemText>Edit</ListItemText>
                        </ListItemButton>
                        <ListItemButton
                          sx={{
                            ...buttonStyle,
                            color: 'error.main',
                            ...theme.applyStyles('dark', { color: theme.vars.palette.error.light })
                          }}
                          onClick={handleDeleteDialogOpen}
                        >
                          <ListItemIcon sx={{ color: 'inherit' }}>
                            <IconTrash size={iconSize} />
                          </ListItemIcon>
                          <ListItemText sx={{ color: 'inherit' }}>Delete</ListItemText>
                        </ListItemButton>
                      </List>
                    </ClickAwayListener>
                  </MainCard>
                </motion.div>
              </Fade>
            )}
          </Popper>
        )}
      </AnimatePresence>

      <UpsertFeature open={openEditDialog} onClose={() => setOpenEditDialog(false)} data={row} />
      <DialogDelete
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        title={dialogDeleteData.title}
        heading={dialogDeleteData.heading}
        description={
          <>
            By deleting feature{' '}
            <Typography component="span" sx={{ color: 'primary.main' }}>
              {row?.name}
            </Typography>
            , it will vanish all records, so be careful about it.
          </>
        }
        onDelete={() => handleDialogDelete(row.id)}
        isDeleting={isProcessing}
      />
    </>
  );
}

ActionCell.propTypes = { row: PropTypes.any, onDelete: PropTypes.func };
