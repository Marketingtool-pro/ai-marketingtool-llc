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

// @third-party
import { AnimatePresence, motion } from 'motion/react';
import { enqueueSnackbar } from 'notistack';

// @project
import { deleteBlog, deleteDraftBlog } from '../api';
import BlogPreview from '../BlogPreview';
import DialogDelete from '@/components/dialog/DialogDelete';
import RouterLink from '@/components/Link';
import MainCard from '@/components/MainCard';
import { varSlide } from '@/components/third-party/motion/animate/dialog';

// @assets
import { IconDotsVertical, IconEdit, IconTrash, IconFileText, IconLicense } from '@tabler/icons-react';

/***************************  DIALOG - DATA  ***************************/

const dialogDeleteData = {
  title: 'Delete Blog',
  heading: 'Are you sure you want to delete blog?',
  description: 'After deleting this blog there is no way to recover your data back.'
};

const dialogDraftDeleteData = {
  title: 'Delete Draft Blog',
  heading: 'Are you sure you want to delete this draft?',
  description: 'This action is irreversible. Once deleted, the draft blog cannot be recovered.'
};

/***************************  TABLE - ACTION  ***************************/

export default function ActionCell({ row }) {
  const theme = useTheme();

  const [isDeleteProcessing, startDeleteTransition] = useTransition();
  const [isDraftDeleteProcessing, startDraftDeleteTransition] = useTransition();

  // Handle action popper
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'user-action-popper' : undefined;

  const handleActionClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  // Handle preivew dialog
  const [openBlogPreview, setOpenBlogPreview] = useState(false);

  // Handle blog delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Handle draft delete dialog
  const [openDraftDeleteDialog, setDraftDeleteDialog] = useState(false);

  const handleDialogDelete = () => {
    startDeleteTransition(async () => {
      const { error } = await deleteBlog(row.refferenceId || row.id);
      if (error) {
        enqueueSnackbar(error, { variant: 'error' });
        return;
      }

      enqueueSnackbar('Blog has been deleted.', { variant: 'success' });
      setOpenDeleteDialog(false);
    });
  };

  const handleDialogDeleteDraft = () => {
    startDraftDeleteTransition(async () => {
      const { error } = await deleteDraftBlog(row.id);
      if (error) {
        enqueueSnackbar(error, { variant: 'error' });
        return;
      }

      enqueueSnackbar('Draft blog has been successfully deleted.', { variant: 'success' });
      setDraftDeleteDialog(false);
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
                <motion.div variants={varSlide('slideInUp', { distance: 20 })} initial="initial" animate="animate" exit="exit">
                  <MainCard sx={{ borderRadius: 3, boxShadow: theme.vars.customShadows.tooltip, minWidth: 150, p: 0.5 }}>
                    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                      <List disablePadding>
                        <ListItemButton sx={buttonStyle} component={RouterLink} to={`/blog/edit/${row.id}`}>
                          <ListItemIcon sx={{ color: 'inherit' }}>
                            <IconEdit size={iconSize} />
                          </ListItemIcon>
                          <ListItemText>Edit Blog</ListItemText>
                        </ListItemButton>
                        <ListItemButton sx={buttonStyle} component={RouterLink} to={`/blog/detail/${row.id}`}>
                          <ListItemIcon sx={{ color: 'inherit' }}>
                            <IconLicense size={iconSize} />
                          </ListItemIcon>
                          <ListItemText>Blog Detail</ListItemText>
                        </ListItemButton>
                        <ListItemButton onClick={() => setOpenBlogPreview(true)} sx={buttonStyle}>
                          <ListItemIcon sx={{ color: 'inherit' }}>
                            <IconFileText size={iconSize} />
                          </ListItemIcon>
                          <ListItemText sx={{ color: 'inherit' }}>Preview Blog</ListItemText>
                        </ListItemButton>
                        {!(row.isDraft && !row.refferenceId) && (
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
                            <ListItemText sx={{ color: 'inherit' }}>Delete Blog</ListItemText>
                          </ListItemButton>
                        )}
                        {row.isDraft && (
                          <ListItemButton
                            sx={{
                              ...buttonStyle,
                              color: 'error.main',
                              ...theme.applyStyles('dark', { color: theme.vars.palette.error.light })
                            }}
                            onClick={() => setDraftDeleteDialog(true)}
                          >
                            <ListItemIcon sx={{ color: 'inherit' }}>
                              <IconTrash size={iconSize} />
                            </ListItemIcon>
                            <ListItemText sx={{ color: 'inherit' }}>Delete Draft</ListItemText>
                          </ListItemButton>
                        )}
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
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onDelete={handleDialogDelete}
        isDeleting={isDeleteProcessing}
      />
      <DialogDelete
        {...dialogDraftDeleteData}
        open={openDraftDeleteDialog}
        onClose={() => setDraftDeleteDialog(false)}
        onDelete={handleDialogDeleteDraft}
        isDeleting={isDraftDeleteProcessing}
      />
      <BlogPreview {...{ open: openBlogPreview, handleClose: () => setOpenBlogPreview(false), blogData: row }} />
    </>
  );
}

ActionCell.propTypes = { row: PropTypes.any };
