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

// @project
import { blockAccount, deleteAccount } from '../api';
import DialogBlock from '@/components/dialog/DialogBlock';
import DialogDelete from '@/components/dialog/DialogDelete';
import MainCard from '@/components/MainCard';
import { varSlide } from '@/components/third-party/motion/animate/dialog';
import AccountUpsert from '@/sections/account/AccountUpsert';

// @assets
import { IconBan, IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';

/***************************  DIALOG - DATA  ***************************/

const dialogDeleteData = {
  title: 'Delete Account',
  heading: 'Are you sure you want to delete?',
  description: 'By deleting account Audrey Leffler MD it will vanish all records so be careful about it'
};

const accountBlockData = {
  title: 'Block Account',
  heading: 'Are you sure you want to block?',
  description: 'By blocking account Audrey Leffler MD. Account will not able to access the service.',
  actionProps: {
    color: 'error',
    children: 'Block'
  }
};

const accountUnblockData = {
  title: 'Unblock Account',
  heading: 'Are you sure you want to unblock?',
  description: 'By blocking account Audrey Leffler MD. Account will not able to access the service.',
  actionProps: {
    color: 'primary',
    children: 'Unblock'
  }
};

/***************************  TABLE - ACTION  ***************************/

export default function ActionCell({ row, onDelete }) {
  const theme = useTheme();

  const [isDeleteProcessing, startDeleteTransition] = useTransition();
  const [isBlockProcessing, startBlockTransition] = useTransition();

  // Handle action popper
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'account-action-popper' : undefined;

  const handleActionClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  //Handle Edit Modal
  const [openEditModal, setOpenEditModal] = useState(false);

  // Handle delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDialogDelete = () => {
    startDeleteTransition(async () => {
      const { error } = await deleteAccount(row.id);
      if (error) {
        enqueueSnackbar(error, { variant: 'error' });
        return;
      }
      onDelete(row.id);
      enqueueSnackbar('Account has been deleted.', { variant: 'success' });
      setOpenDeleteDialog(false);
    });
  };

  // Handle block dialog open/close
  const [openBlockDialog, setOpenBlockDialog] = useState(false);

  const handleBlockDialogClose = () => {
    setOpenBlockDialog(false);
  };

  const handleDialogBlock = async () => {
    startBlockTransition(async () => {
      const { error } = await blockAccount(row.id, !row.isBlocked);
      if (error) {
        enqueueSnackbar(error, { variant: 'error' });
        return;
      }
      enqueueSnackbar(!row.isBlocked ? 'Account has been blocked.' : 'Account has been unblocked.', { variant: 'success' });
      setOpenBlockDialog(false);
    });
  };

  const dialogBlockData = row.isBlocked ? accountUnblockData : accountBlockData;

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
                <motion.div variants={varSlide('slideInUp', { distance: 20 })} initial="initial" animate="animate" exit="exit">
                  <MainCard sx={{ borderRadius: 3, boxShadow: theme.vars.customShadows.tooltip, minWidth: 150, p: 0.5 }}>
                    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                      <List disablePadding>
                        <ListItemButton sx={buttonStyle} onClick={() => setOpenEditModal(true)}>
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
                          onClick={() => setOpenDeleteDialog(true)}
                        >
                          <ListItemIcon sx={{ color: 'inherit' }}>
                            <IconTrash size={iconSize} />
                          </ListItemIcon>
                          <ListItemText sx={{ color: 'inherit' }}>Delete</ListItemText>
                        </ListItemButton>
                        <ListItemButton
                          sx={{
                            ...buttonStyle,
                            color: 'error.main',
                            ...theme.applyStyles('dark', { color: theme.vars.palette.error.light })
                          }}
                          onClick={() => setOpenBlockDialog(true)}
                        >
                          <ListItemIcon sx={{ color: 'inherit' }}>
                            <IconBan size={iconSize} />
                          </ListItemIcon>
                          <ListItemText sx={{ color: 'inherit' }}>{row.isBlocked ? 'Unblock' : 'Block'}</ListItemText>
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

      <DialogDelete
        {...dialogDeleteData}
        description={
          <>
            By deleting account{' '}
            <Typography component="span" sx={{ color: 'primary.main' }}>
              {row?.profile?.firstName} {row?.profile?.lastName}
            </Typography>
            , it will vanish all records, so be careful about it.
          </>
        }
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        onDelete={handleDialogDelete}
        isDeleting={isDeleteProcessing}
      />

      <DialogBlock
        {...dialogBlockData}
        description={
          <>
            {row.isBlocked ? (
              <>
                By unblocking the account{' '}
                <Typography component="span" sx={{ color: 'primary.main' }}>
                  {row?.profile?.firstName} {row?.profile?.lastName}
                </Typography>
                , the account will restore access to the service.
              </>
            ) : (
              <>
                By blocking account{' '}
                <Typography component="span" sx={{ color: 'primary.main' }}>
                  {row?.profile?.firstName} {row?.profile?.lastName}
                </Typography>
                , the account will not be able to access the service.
              </>
            )}
          </>
        }
        open={openBlockDialog}
        onClose={handleBlockDialogClose}
        onBlock={handleDialogBlock}
        isProcessing={isBlockProcessing}
      />

      <AccountUpsert open={openEditModal} onClose={() => setOpenEditModal(false)} accountData={row} />
    </>
  );
}

ActionCell.propTypes = { row: PropTypes.any, onDelete: PropTypes.func };
