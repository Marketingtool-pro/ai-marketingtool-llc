import PropTypes from 'prop-types';
import { useEffect, useState, useTransition } from 'react';

// @mui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @third-party
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

// @project
import Modal from '@/components/Modal';
import { ModalSize } from '@/enum';
import { useAuth } from '@/contexts/AuthContext';
import { emailSchema, passwordSchema } from '@/utils/validation-schema/common';

// @assets
import { IconEye, IconEyeOff, IconMail } from '@tabler/icons-react';

const initialData = {
  email: '',
  password: ''
};

/***************************   MODAL - EMAIL  ***************************/

export default function ModalEmail({ email }) {
  const { refreshUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [isProcessing, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({ defaultValues: initialData });

  const onSubmit = (data) => {
    if (!isDirty) return;

    startTransition(async () => {
      try {
        const { appwriteAccount } = await import('@/utils/auth-client/appwrite');
        await appwriteAccount.updateEmail(data.email, data.password);
        await refreshUser();
        enqueueSnackbar(`Email has been ${email ? 'updated' : 'added'}.`, { variant: 'success' });
        setOpen(false);
      } catch (err) {
        const msg = err?.message || 'Failed to update email.';
        enqueueSnackbar(msg.includes('password') ? 'Password is incorrect.' : msg, { variant: 'error' });
      }
    });
  };

  useEffect(() => {
    if (open) {
      const formInitData = email ? { email, password: '' } : initialData;
      reset(formInitData);
      setShowPassword(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, email]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{email ? 'Update' : 'Add'}</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={ModalSize.MD}
        header={{ title: 'Email Address', subheader: `${email ? 'Update' : 'Add'} your email address to keep your account up to date.` }}
        onFormSubmit={handleSubmit(onSubmit)}
        modalContent={
          <Stack sx={{ gap: 2 }}>
            <Box>
              <InputLabel>Email</InputLabel>
              <OutlinedInput
                fullWidth
                startAdornment={
                  <InputAdornment position="start">
                    <IconMail />
                  </InputAdornment>
                }
                error={errors.email && Boolean(errors.email)}
                {...register('email', emailSchema)}
                aria-describedby="outlined-email"
                slotProps={{ input: { 'aria-label': 'email' } }}
              />
              {errors.email?.message && <FormHelperText error>{errors.email?.message}</FormHelperText>}
            </Box>
            <Box>
              <InputLabel>Current Password</InputLabel>
              <OutlinedInput
                {...register('password', passwordSchema)}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your current password"
                fullWidth
                autoComplete="current-password"
                error={errors.password && Boolean(errors.password)}
                endAdornment={
                  <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                  </InputAdornment>
                }
              />
              {errors.password?.message && <FormHelperText error>{errors.password?.message}</FormHelperText>}
            </Box>
          </Stack>
        }
        footer={
          <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
            <Button variant="outlined" color="secondary" onClick={() => setOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={!isDirty}
              {...(isProcessing && { loading: true, loadingPosition: 'end' })}
            >
              {email ? 'Update' : 'Add'} Email
            </Button>
          </Stack>
        }
      />
    </>
  );
}

ModalEmail.propTypes = { email: PropTypes.string };
