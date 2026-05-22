import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';

// @mui
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @third-party
import { useForm } from 'react-hook-form';

// @project
import { emailSchema, passwordSchema, firstNameSchema, lastNameSchema } from '@/utils/validation-schema/common';

// @icons
import { IconEye, IconEyeOff } from '@tabler/icons-react';

/***************************  AUTH - BASIC INFORMATION  ***************************/

export default function BasicInformation({ inputSx, onValidate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Initialize react-hook-form
  const {
    register,
    watch,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange' // Trigger validation on input change
  });

  useEffect(() => {
    onValidate(isValid);
  }, [isValid, onValidate]);

  const password = useRef({});
  password.current = watch('password', '');

  return (
    <Stack sx={{ gap: 5 }}>
      <Stack sx={{ gap: 1.5, alignItems: 'center' }}>
        <Typography variant="h3">Basic Information</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Provide essential details to set up and manage your basic information.
        </Typography>
      </Stack>
      <form autoComplete="off">
        <Grid container rowSpacing={2.5} columnSpacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InputLabel>First Name</InputLabel>
            <OutlinedInput
              {...register('firstname', firstNameSchema)}
              placeholder="Enter first name"
              fullWidth
              error={Boolean(errors.firstname)}
              sx={{ ...inputSx }}
            />
            {errors.firstname?.message && <FormHelperText error>{errors.firstname?.message}</FormHelperText>}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InputLabel>Last Name</InputLabel>
            <OutlinedInput
              {...register('lastname', lastNameSchema)}
              placeholder="Enter last name"
              fullWidth
              error={Boolean(errors.lastname)}
              sx={{ ...inputSx }}
            />
            {errors.lastname?.message && <FormHelperText error>{errors.lastname?.message}</FormHelperText>}
          </Grid>
          <Grid size={12}>
            <InputLabel>Email</InputLabel>
            <OutlinedInput
              {...register('email', emailSchema)}
              placeholder="you@example.com"
              fullWidth
              error={Boolean(errors.email)}
              sx={{ ...inputSx }}
              autoComplete="email username"
            />
            {errors.email?.message && <FormHelperText error>{errors.email?.message}</FormHelperText>}
          </Grid>
          <Grid size={12}>
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              {...register('password', passwordSchema)}
              type={isOpen ? 'text' : 'password'}
              placeholder="Enter password"
              fullWidth
              autoComplete="new-password"
              error={Boolean(errors.password)}
              endAdornment={
                <InputAdornment
                  position="end"
                  sx={{ cursor: 'pointer', '& svg': { color: 'grey.700' } }}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                </InputAdornment>
              }
              sx={inputSx}
            />
            {errors.password?.message && <FormHelperText error>{errors.password?.message}</FormHelperText>}
          </Grid>
          <Grid size={12}>
            <InputLabel>Confirm Password</InputLabel>
            <OutlinedInput
              {...register('confirmPassword', { validate: (value) => value === password.current || 'The passwords do not match' })}
              type={isConfirmOpen ? 'text' : 'password'}
              placeholder="Enter confirm password"
              fullWidth
              autoComplete="new-password"
              error={Boolean(errors.confirmPassword)}
              endAdornment={
                <InputAdornment
                  position="end"
                  sx={{ cursor: 'pointer', '& svg': { color: 'grey.700' } }}
                  onClick={() => setIsConfirmOpen(!isConfirmOpen)}
                >
                  {isConfirmOpen ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                </InputAdornment>
              }
              sx={inputSx}
            />
            {errors.confirmPassword?.message && <FormHelperText error>{errors.confirmPassword?.message}</FormHelperText>}
          </Grid>
          <Grid size={12}>
            <InputLabel>Position</InputLabel>
            <OutlinedInput placeholder="e.g., Developer, Admin, Product Manager" fullWidth sx={{ ...inputSx }} />
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
}

BasicInformation.propTypes = { inputSx: PropTypes.any, onValidate: PropTypes.any };
