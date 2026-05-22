import PropTypes from 'prop-types';
import { useState, useRef, useTransition } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

// @project
import Modal from '@/components/Modal';
import { ModalSize } from '@/enum';
import { passwordSchema } from '@/utils/validation-schema/common';

// @assets
import { IconEye, IconEyeOff } from '@tabler/icons-react';

/***************************   MODAL - CHANGE PASSWORD   ***************************/

export default function ModalPassword({ inputSx }) {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = useState(false);
  const [isProcessing, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [isOldOpen, setIsOldOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const iconCommonProps = { size: 16, color: theme.vars.palette.grey[700] };

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty }
  } = useForm({ defaultValues: { oldPassword: '', password: '', confirmPassword: '' } });

  const password = useRef({});
  password.current = watch('password', '');

  const closeModal = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    if (!isDirty) return;

    startTransition(async () => {
      try {
        const { appwriteAccount } = await import('@/utils/auth-client/appwrite');
        await appwriteAccount.updatePassword(data.password, data.oldPassword);
        enqueueSnackbar('Your password has been updated successfully.', { variant: 'success' });
        closeModal();
      } catch (err) {
        const msg = err?.message || 'Failed to update password.';
        enqueueSnackbar(msg.includes('password') ? 'Current password is incorrect.' : msg, { variant: 'error' });
      }
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Change Password</Button>
      <Modal
        open={open}
        onClose={closeModal}
        maxWidth={ModalSize.MD}
        header={{ title: 'Change Password', subheader: 'Regularly updating your password helps safeguard your information.' }}
        onFormSubmit={handleSubmit(onSubmit)}
        modalContent={
          <Stack sx={{ gap: 2 }}>
            <Box>
              <InputLabel>Old Password</InputLabel>
              <OutlinedInput
                {...register('oldPassword', passwordSchema)}
                type={isOldOpen ? 'text' : 'password'}
                placeholder="Enter your old password"
                fullWidth
                autoComplete="old-password"
                error={errors.oldPassword && Boolean(errors.oldPassword)}
                endAdornment={
                  <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={() => setIsOldOpen(!isOldOpen)}>
                    {isOldOpen ? <IconEye {...iconCommonProps} /> : <IconEyeOff {...iconCommonProps} />}
                  </InputAdornment>
                }
                sx={inputSx}
              />
              {errors.oldPassword?.message && <FormHelperText error>{errors.oldPassword?.message}</FormHelperText>}
            </Box>
            <Box>
              <InputLabel>New Password</InputLabel>
              <OutlinedInput
                {...register('password', passwordSchema)}
                type={isOpen ? 'text' : 'password'}
                placeholder="Enter your new password"
                fullWidth
                autoComplete="new-password"
                error={errors.password && Boolean(errors.password)}
                endAdornment={
                  <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <IconEye {...iconCommonProps} /> : <IconEyeOff {...iconCommonProps} />}
                  </InputAdornment>
                }
                sx={inputSx}
              />
              {errors.password?.message && <FormHelperText error>{errors.password?.message}</FormHelperText>}
            </Box>
            <Box>
              <InputLabel>New Confirm Password</InputLabel>
              <OutlinedInput
                {...register('confirmPassword', { validate: (value) => value === password.current || 'The passwords do not match' })}
                type={isConfirmOpen ? 'text' : 'password'}
                placeholder="Enter your new confirm password"
                fullWidth
                error={errors.confirmPassword && Boolean(errors.confirmPassword)}
                endAdornment={
                  <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={() => setIsConfirmOpen(!isConfirmOpen)}>
                    {isConfirmOpen ? <IconEye {...iconCommonProps} /> : <IconEyeOff {...iconCommonProps} />}
                  </InputAdornment>
                }
                sx={inputSx}
              />
              {errors.confirmPassword?.message && <FormHelperText error>{errors.confirmPassword?.message}</FormHelperText>}
            </Box>
            <Stack {...(!downSM && { direction: 'row' })} sx={{ gap: 1.5, alignItems: { sm: 'center' } }}>
              <Stack sx={{ gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'grey.700' }}>
                  Forgot Password
                </Typography>
                <Typography variant="body1">In case if you forgot older password then you can recover password here.</Typography>
              </Stack>
              <Button
                {...(!isProcessing && { href: '/auth/forgot-password', target: '_blank' })}
                sx={{ minWidth: 'fit-content', ml: 'auto' }}
                disabled={isProcessing}
              >
                Forgot Password
              </Button>
            </Stack>
          </Stack>
        }
        footer={
          <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
            <Button variant="outlined" color="secondary" onClick={closeModal} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={!isDirty}
              {...(isProcessing && { loading: true, loadingPosition: 'end' })}
            >
              Change Password
            </Button>
          </Stack>
        }
      />
    </>
  );
}

ModalPassword.propTypes = { inputSx: PropTypes.any };
