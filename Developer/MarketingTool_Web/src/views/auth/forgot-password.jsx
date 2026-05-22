// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import { AUTH_PROVIDER } from '@/config';
import { AuthType } from '@/enum';
import useBaseUrl from '@/hooks/useBaseUrl';
import AuthForgotPassword from '@/sections/auth/AuthForgotPassword';
import Copyright from '@/sections/auth/Copyright';

/***************************  AUTH - FORGOT PASSWORD  ***************************/

export default function ForgotPassword() {
  const baseUrl = useBaseUrl();
  const redirectUrl = `${baseUrl}/password-recovery`;

  return (
    <Stack sx={{ height: 1, gap: 3 }}>
      <Box sx={{ width: 1, maxWidth: 458, m: 'auto' }}>
        <Stack sx={{ gap: { xs: 1, sm: 1.5 }, textAlign: 'center', mb: { xs: 3, sm: 8 } }}>
          <Typography variant="h1">Forgot Password</Typography>
          <Typography variant="body1" color="text.secondary">
            Provide your email address to recover your password.
          </Typography>
        </Stack>

        {/* Forgot password form */}
        <AuthForgotPassword redirectTo={redirectUrl} {...(AUTH_PROVIDER === AuthType.AWS && { doRedirect: true, attachEmail: true })} />
      </Box>

      {/* Copyright section*/}
      <Copyright />
    </Stack>
  );
}
