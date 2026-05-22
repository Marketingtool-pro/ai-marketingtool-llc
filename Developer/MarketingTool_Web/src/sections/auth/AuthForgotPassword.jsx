import PropTypes from 'prop-types';
import { useState, useTransition } from 'react';

// @mui
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

// @third-party
import { useForm } from 'react-hook-form';

// @project
import { forgotPassword } from '@/utils/api/auth';
import { useRouter } from '@/utils/navigation';
import { emailSchema } from '@/utils/validation-schema/common';

/***************************  AUTH - FORGOT PASSWORD  ***************************/

export default function AuthForgotPassword({ inputSx, redirectTo, doRedirect = false, attachEmail = false }) {
  const router = useRouter();

  const [isProcessing, startTransition] = useTransition();
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [mailSent, setMailSent] = useState(false);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Handle form submission
  const onSubmit = (formData) => {
    setForgotPasswordError('');
    setMailSent(false);

    const payload = { email: formData.email };
    const redirectUrl = redirectTo && attachEmail ? `${redirectTo}?email=${formData.email}` : redirectTo;

    // Add redirectTo if it's provided
    if (redirectUrl) {
      payload.redirectTo = redirectUrl;
    }

    startTransition(async () => {
      const { error } = await forgotPassword(payload);
      if (error) {
        setForgotPasswordError(error || 'Something went wrong');
        return;
      }

      reset();
      if (redirectUrl && doRedirect) {
        router.push(redirectUrl);
      } else {
        setMailSent(true);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <InputLabel>Email</InputLabel>
      <OutlinedInput
        {...register('email', emailSchema)}
        placeholder="you@example.com"
        fullWidth
        error={Boolean(errors.email)}
        sx={{ ...inputSx }}
      />
      {errors.email?.message && <FormHelperText error>{errors.email?.message}</FormHelperText>}

      <Button
        type="submit"
        color="primary"
        variant="contained"
        disabled={isProcessing}
        endIcon={isProcessing && <CircularProgress color="secondary" size={16} />}
        sx={{ minWidth: 120, mt: { xs: 2, sm: 4 }, '& .MuiButton-endIcon': { ml: 1 } }}
      >
        Request Code
      </Button>
      {forgotPasswordError && (
        <Alert sx={{ mt: 2 }} severity="error" variant="filled" icon={false}>
          {forgotPasswordError}
        </Alert>
      )}
      {mailSent && (
        <Alert sx={{ mt: 2 }} severity="success" variant="filled" icon={false}>
          An email with the recovery link has been sent to your inbox. Please check your email to proceed with account recovery.
        </Alert>
      )}
    </form>
  );
}

AuthForgotPassword.propTypes = {
  inputSx: PropTypes.any,
  redirectTo: PropTypes.string,
  doRedirect: PropTypes.bool,
  attachEmail: PropTypes.bool
};
