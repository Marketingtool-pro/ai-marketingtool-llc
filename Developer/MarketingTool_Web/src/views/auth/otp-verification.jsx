import { useEffect, useState } from 'react';

// @mui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import Copyright from '@/sections/auth/Copyright';
import { resendOtp } from '@/utils/api/auth';
import { useSearchParams, useRouter } from '@/utils/navigation';

// @types
import AuthOtpVerification from '@/sections/auth/AuthOtpVerification';

const resendTypes = {
  signup: 'signup',
  email_change: 'email_change'
};

/***************************  AUTH - OTP VERIFICATION  ***************************/

export default function OtpVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const verify = searchParams.get('verify') || 'signup';
  if (!email) {
    router.replace('/register');
  }

  const [timer, setTimer] = useState(60); // 1 minute = 60 seconds
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const resendCode = async () => {
    setTimer(60); // Reset timer to 60 seconds
    setIsTimerActive(true);

    const type = resendTypes[verify] ?? resendTypes.signup;
    const payload = { email, type };

    const { error } = await resendOtp(payload);
    if (error) {
      console.log(error || 'Something went wrong');
    }
  };

  return (
    <Stack sx={{ height: 1, gap: 3 }}>
      <Box sx={{ width: 1, maxWidth: 458, m: 'auto' }}>
        <Stack sx={{ gap: { xs: 1, sm: 1.5 }, textAlign: 'center', mb: { xs: 3, sm: 8 } }}>
          <Typography variant="h1">Verify Code</Typography>
          <Typography variant="body1" color="text.secondary">
            Code is sent to{' '}
            <Typography component="span" variant="subtitle1" color="text.primary">
              {email}
            </Typography>
          </Typography>
        </Stack>

        {/* Code verification form */}
        <AuthOtpVerification email={email} verify={verify} />

        <Typography variant="body2" color="text.secondary" sx={{ mt: { xs: 2, sm: 3 } }}>
          Didn’t receive a code?{' '}
          {isTimerActive ? (
            <Typography component="span" variant="body2" sx={{ color: 'text.disabled' }}>
              Resend code in{' '}
              <Typography component="span" variant="subtitle2" color="primary.main">
                {String(timer).padStart(2, '0')} s
              </Typography>
            </Typography>
          ) : (
            <Link variant="subtitle2" underline="hover" onClick={resendCode} sx={{ cursor: 'pointer' }}>
              Resend OTP
            </Link>
          )}
        </Typography>
      </Box>

      {/* Copyright section*/}
      <Copyright />
    </Stack>
  );
}
