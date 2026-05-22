import PropTypes from 'prop-types';
import { useState, useRef, useTransition } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @third-party
import { useForm } from 'react-hook-form';

// @project
import CodeVerification from '@/components/CodeVerification';
import { resetPassword } from '@/utils/api/auth';
import { useRouter, useSearchParams } from '@/utils/navigation';
import { passwordSchema } from '@/utils/validation-schema/common';

// @icons
import { IconEye, IconEyeOff } from '@tabler/icons-react';

/***************************  AWS - PASSWORD RECOVERY  ***************************/

export default function AuthAwsPasswordRecovery({ inputSx }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProcessing, startTransition] = useTransition();
  const [passwordRecoveryError, setPasswordRecoveryError] = useState('');

  const iconCommonProps = { size: 16, color: theme.vars.palette.grey[700] };

  // Initialize react-hook-form
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm();

  const password = useRef({});
  password.current = watch('password', '');

  // Handle form submission
  const onSubmit = (formData) => {
    const email = searchParams.get('email');

    if (!email) {
      setPasswordRecoveryError('Email not found');
      return;
    }

    setPasswordRecoveryError('');

    const payload = { email, otp: formData.otp, password: formData.password };

    startTransition(async () => {
      const { error } = await resetPassword(payload);
      if (error) {
        setPasswordRecoveryError(error || 'Something went wrong');
        return;
      }

      reset();
      router.replace('/login');
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Stack sx={{ gap: 2 }}>
        <Box>
          <InputLabel>Verification Code</InputLabel>
          <CodeVerification control={control} />
          {errors.otp?.message && <FormHelperText error>{errors.otp?.message}</FormHelperText>}
        </Box>
        <Box>
          <InputLabel>New Password</InputLabel>
          <OutlinedInput
            {...register('password', passwordSchema)}
            type={isOpen ? 'text' : 'password'}
            placeholder="Enter new password"
            fullWidth
            autoComplete="new-password"
            error={Boolean(errors.password)}
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
          <InputLabel>Confirm Password</InputLabel>
          <OutlinedInput
            {...register('confirmPassword', { validate: (value) => value === password.current || 'The passwords do not match' })}
            type={isConfirmOpen ? 'text' : 'password'}
            placeholder="Enter confirm password"
            fullWidth
            error={Boolean(errors.confirmPassword)}
            endAdornment={
              <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={() => setIsConfirmOpen(!isConfirmOpen)}>
                {isConfirmOpen ? <IconEye {...iconCommonProps} /> : <IconEyeOff {...iconCommonProps} />}
              </InputAdornment>
            }
            sx={inputSx}
          />
          {errors.confirmPassword?.message && <FormHelperText error>{errors.confirmPassword?.message}</FormHelperText>}
        </Box>
      </Stack>
      <Button
        type="submit"
        color="primary"
        variant="contained"
        disabled={isProcessing}
        endIcon={isProcessing && <CircularProgress color="secondary" size={16} />}
        sx={{ minWidth: 120, mt: { xs: 2, sm: 4 }, '& .MuiButton-endIcon': { ml: 1 } }}
      >
        Reset Password
      </Button>
      {passwordRecoveryError && (
        <Alert sx={{ mt: 2 }} severity="error" variant="filled" icon={false}>
          {passwordRecoveryError}
        </Alert>
      )}
    </form>
  );
}

AuthAwsPasswordRecovery.propTypes = { inputSx: PropTypes.any };
