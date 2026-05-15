// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import { AUTH_PROVIDER } from '@/config';
import { AuthType } from '@/enum';
import AuthAwsPasswordRecovery from '@/sections/auth/aws/AuthPasswordRecovery';
import AuthPasswordRecovery from '@/sections/auth/AuthPasswordRecovery';
import Copyright from '@/sections/auth/Copyright';

/***************************  AUTH - PASSWORD RECOVERY  ***************************/

export default function PasswordRecovery() {
  return (
    <Stack sx={{ height: 1, gap: 3 }}>
      <Box sx={{ width: 1, maxWidth: 458, m: 'auto' }}>
        <Stack sx={{ gap: { xs: 1, sm: 1.5 }, textAlign: 'center', mb: { xs: 3, sm: 8 } }}>
          <Typography variant="h1">Password Recovery</Typography>
          <Typography variant="body1" color="text.secondary">
            Reset your password by entering new password.
          </Typography>
        </Stack>

        {/* Password recovery form */}
        {AUTH_PROVIDER === AuthType.AWS ? <AuthAwsPasswordRecovery /> : <AuthPasswordRecovery />}
      </Box>
      {/* Copyright section*/}
      <Copyright />
    </Stack>
  );
}
