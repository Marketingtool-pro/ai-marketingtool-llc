import PropTypes from 'prop-types';
import { useEffect, useTransition } from 'react';

// @mui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

// @project
import { useAuth } from '@/contexts/AuthContext';
import { firstNameSchema, lastNameSchema } from '@/utils/validation-schema/common';

// @third-party
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

const initialData = {
  firstName: '',
  lastName: ''
};

/***************************  PROFILE - NAME  ***************************/

export default function ProfileName({ profileNameData }) {
  const { refreshUser } = useAuth();
  const [isProcessing, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({ defaultValues: initialData });

  const onSubmit = (formData) => {
    startTransition(async () => {
      try {
        const { appwriteAccount } = await import('@/utils/auth-client/appwrite');
        const fullName = [formData.firstName?.trim(), formData.lastName?.trim()].filter(Boolean).join(' ');
        await appwriteAccount.updateName(fullName);
        await refreshUser();
        enqueueSnackbar('Profile name has been saved.', { variant: 'success' });
      } catch (err) {
        enqueueSnackbar(err?.message || 'Failed to update name.', { variant: 'error' });
      }
    });
  };

  useEffect(() => {
    const formInitData = profileNameData
      ? {
          firstName: profileNameData.firstName || '',
          lastName: profileNameData.lastName || ''
        }
      : initialData;
    reset(formInitData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileNameData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ width: 1, gap: 2, alignItems: 'flex-end', p: { xs: 2, sm: 3 } }}>
        <Grid container columnSpacing={2} rowSpacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InputLabel>First Name</InputLabel>
            <OutlinedInput
              {...register('firstName', firstNameSchema)}
              error={errors.firstName && Boolean(errors.firstName)}
              fullWidth
              aria-describedby="outlined-name"
              slotProps={{ input: { 'aria-label': 'first-name' } }}
              placeholder="ex. Jone"
            />
            {errors.firstName?.message && <FormHelperText error>{errors.firstName?.message}</FormHelperText>}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InputLabel>Last Name</InputLabel>
            <OutlinedInput
              {...register('lastName', lastNameSchema)}
              error={errors.lastName && Boolean(errors.lastName)}
              fullWidth
              aria-describedby="outlined-name"
              slotProps={{ input: { 'aria-label': 'last-name' } }}
              placeholder="ex. Doe"
            />
            {errors.lastName?.message && <FormHelperText error>{errors.lastName?.message}</FormHelperText>}
          </Grid>
          <Grid size={12}>
            <FormHelperText sx={{ mt: 0 }}>Use your first and last name as they appear on your government-issued ID.</FormHelperText>
          </Grid>
        </Grid>

        <Button
          variant="outlined"
          color="secondary"
          size="small"
          type="submit"
          disabled={!isDirty}
          {...(isProcessing && { loading: true, loadingPosition: 'end' })}
        >
          Submit
        </Button>
      </Stack>
    </form>
  );
}

ProfileName.propTypes = { profileNameData: PropTypes.object };
