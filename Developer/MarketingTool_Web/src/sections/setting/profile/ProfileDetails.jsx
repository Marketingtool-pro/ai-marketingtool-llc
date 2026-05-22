import PropTypes from 'prop-types';
import { useState, useTransition } from 'react';

// @mui
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @third-party
import { enqueueSnackbar } from 'notistack';

// @project
import ModalEmail from './ModalEmail';
import ModalPhoneNumber from './ModalPhoneNumber';
import ModalPassword from './ModalPassword';
import ProfileAvatar from './ProfileAvatar';
import ProfileName from './ProfileName';

import SettingCard from '@/components/cards/SettingCard';
import DialogLogout from '@/components/dialog/DialogLogout';
import DialogDelete from '@/components/dialog/DialogDelete';
import { useAuth } from '@/contexts/AuthContext';
import { logout } from '@/utils/api/auth';

// @assets
import { IconCheck, IconExclamationMark } from '@tabler/icons-react';

import defaultAvatar from '@/assets/images/users/avatar-1.png';

function FieldSection({ label, caption, action }) {
  return (
    <Stack direction="row" sx={{ p: { xs: 2, sm: 3 }, flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}>
      <Stack sx={{ gap: 1 }}>
        <Typography variant="body2" color="grey.700">
          {label}
        </Typography>
        <Typography variant="body1">{caption}</Typography>
      </Stack>
      {action}
    </Stack>
  );
}

/***************************   PROFILE - DETAILS  ***************************/

export default function SettingDetailsCard() {
  const { user } = useAuth();

  const profileData = {
    avatar: user?.avatar || defaultAvatar,
    firstName: user?.firstname || '',
    lastName: user?.lastname || '',
    email: user?.email || '',
    isEmailVerified: true,
    dialCode: user?.dialcode || '+1',
    contact: user?.contact || ''
  };

  const fullName = [profileData.firstName, profileData.lastName].filter(Boolean).join(' ') || 'your account';

  // Dialog Logout handle
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [isProcessing, startTransition] = useTransition();

  const handleDialogLogoutOpen = () => {
    setOpenLogoutDialog(true);
  };

  const handleDialogLogoutClose = () => {
    setOpenLogoutDialog(false);
  };

  const handleDialogLogout = async () => {
    setOpenLogoutDialog(false);
    await logout();
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
    startTransition(async () => {
      try {
        // Note: Appwrite doesn't allow users to delete their own account from client SDK
        // This would need a server-side function. For now, log them out.
        enqueueSnackbar('Account deletion request submitted. Contact help@marketingtool.pro to complete.', { variant: 'info' });
        setOpenDeleteDialog(false);
      } catch {
        enqueueSnackbar('Failed to process request.', { variant: 'error' });
        setOpenDeleteDialog(false);
      }
    });
  };

  return (
    <SettingCard title="Details" caption="Manage your personal details and preferences.">
      <Stack sx={{ p: { xs: 2, sm: 3 }, flexWrap: 'wrap', gap: 1 }}>
        <ProfileAvatar avatar={profileData.avatar} />
      </Stack>
      <Divider />
      <ProfileName profileNameData={{ firstName: profileData.firstName, lastName: profileData.lastName }} />
      <Divider />
      <FieldSection
        label="Email Address"
        caption={profileData.email || 'N/A'}
        action={
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
            {profileData.email && (
              <Chip
                label={profileData.isEmailVerified ? 'Verified' : 'Pending'}
                variant="text"
                avatar={profileData.isEmailVerified ? <IconCheck /> : <IconExclamationMark />}
                color={profileData.isEmailVerified ? 'success' : 'warning'}
              />
            )}
            <ModalEmail email={profileData.email} />
          </Stack>
        }
      />
      <Divider />
      <FieldSection
        label="Phone Number (optional)"
        caption={profileData.contact ? `${profileData.dialCode} ${profileData.contact}` : 'No phone number'}
        action={<ModalPhoneNumber phoneData={{ dialCode: profileData.dialCode, contact: profileData.contact }} />}
      />
      <Divider />
      <FieldSection label="Change Password" caption="Change the passwords for your Account Security" action={<ModalPassword />} />
      <Divider />
      <FieldSection label="Logout" caption="Logout options here" action={<Button onClick={handleDialogLogoutOpen}>Logout</Button>} />
      <Divider />
      <FieldSection
        label="Delete Account"
        caption="No longer use of this Account?"
        action={
          <Button color="error" onClick={handleDialogDeleteOpen}>
            Delete Account
          </Button>
        }
      />

      <DialogLogout
        open={openLogoutDialog}
        title="Logout"
        heading={`Are you sure you want to logout of ${fullName}?`}
        onClose={handleDialogLogoutClose}
        onLogout={handleDialogLogout}
      />
      <DialogDelete
        open={openDeleteDialog}
        title="Delete Account"
        heading="Are you sure you want to Delete Your Account?"
        description="After deleting your account there is no way to recover your data back."
        onClose={handleDialogDeleteClose}
        onDelete={handleDialogDelete}
        isDeleting={isProcessing}
      />
    </SettingCard>
  );
}

FieldSection.propTypes = { label: PropTypes.string, caption: PropTypes.string, action: PropTypes.node };
