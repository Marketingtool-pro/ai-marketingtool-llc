import PropTypes from 'prop-types';
import { useState } from 'react';

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

// @project
import DialogDelete from '@/components/dialog/DialogDelete';
import MainCard from '@/components/MainCard';
import { varSlide } from '@/components/third-party/motion/animate/dialog';

// @assets
import { IconDotsVertical, IconDownload, IconPrinter, IconShare, IconTrash } from '@tabler/icons-react';

/***************************  DIALOG - DATA  ***************************/

const dialogDeleteData = {
  title: 'Delete User',
  heading: 'Are you sure you want to delete?'
};

/***************************  TABLE - ACTION  ***************************/

export default function ActionCell({ row, onDelete }) {
  const theme = useTheme();

  // Handle action popper
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'user-behavior-action-popper' : undefined;

  const handleActionClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  // Handle delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDialogDelete = (id) => {
    onDelete(row.id);
    console.log('User deleted', id, row);
    handleDeleteDialogClose();
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
          <Popper placement="bottom-end" id={id} open={open} anchorEl={anchorEl} transition>
            {({ TransitionProps }) => (
              <Fade in={open} {...TransitionProps}>
                <motion.div variants={varSlide('slideInDown', { distance: 20 })} initial="initial" animate="animate" exit="exit">
                  <MainCard sx={{ borderRadius: 3, boxShadow: theme.vars.customShadows.tooltip, minWidth: 150, p: 0.5 }}>
                    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                      <List disablePadding>
                        <ListItemButton sx={buttonStyle} onClick={handleActionClick}>
                          <ListItemIcon>
                            <IconDownload size={iconSize} />
                          </ListItemIcon>
                          <ListItemText>Download</ListItemText>
                        </ListItemButton>
                        <ListItemButton sx={{ ...buttonStyle }}>
                          <ListItemIcon sx={{ color: 'inherit' }}>
                            <IconPrinter size={iconSize} />
                          </ListItemIcon>
                          <ListItemText sx={{ color: 'inherit' }}>Print</ListItemText>
                        </ListItemButton>
                        <ListItemButton sx={{ ...buttonStyle }}>
                          <ListItemIcon sx={{ color: 'inherit' }}>
                            <IconShare size={iconSize} />
                          </ListItemIcon>
                          <ListItemText sx={{ color: 'inherit' }}>Share</ListItemText>
                        </ListItemButton>
                        <ListItemButton
                          onClick={handleDeleteDialogOpen}
                          sx={{
                            ...buttonStyle,
                            color: 'error.main',
                            ...theme.applyStyles('dark', { color: theme.vars.palette.error.light })
                          }}
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

      <DialogDelete
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        title={dialogDeleteData.title}
        heading={dialogDeleteData.heading}
        description={
          <>
            By deleting user{' '}
            <Typography component="span" sx={{ color: 'primary.main' }}>
              {row?.user?.name}
            </Typography>
            , it will vanish all records, so be careful about it.
          </>
        }
        onDelete={() => handleDialogDelete(row.id)}
      />
    </>
  );
}

ActionCell.propTypes = { row: PropTypes.any, onDelete: PropTypes.func };
