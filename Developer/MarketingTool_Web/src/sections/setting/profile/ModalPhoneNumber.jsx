import PropTypes from 'prop-types';
import { useEffect, useState, useTransition } from 'react';

// @mui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';

// @third-party
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

// @project
import Contact from '@/components/Contact';
import Modal from '@/components/Modal';
import { ModalSize } from '@/enum';
import { useAuth } from '@/contexts/AuthContext';

const initialData = {
  dialCode: '+1',
  contact: ''
};

/***************************   MODAL - PHONE NUMBER  ***************************/

export default function ModalPhoneNumber({ phoneData }) {
  const { refreshUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [isProcessing, startTransition] = useTransition();

  // Initialize react-hook-form
  const {
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors, isDirty }
  } = useForm({ defaultValues: initialData });

  const onSubmit = (data) => {
    if (!isDirty) return;

    startTransition(async () => {
      try {
        const { appwriteAccount } = await import('@/utils/auth-client/appwrite');
        const phone = `${data.dialCode}${data.contact}`;
        // Save phone to Appwrite user prefs (updatePhone requires password + E.164)
        const prefs = await appwriteAccount.getPrefs();
        await appwriteAccount.updatePrefs({ ...prefs, dialCode: data.dialCode, contact: data.contact });
        await refreshUser();
        enqueueSnackbar(`Phone number has been ${phoneData?.contact ? 'updated' : 'added'}.`, { variant: 'success' });
        setOpen(false);
      } catch (err) {
        enqueueSnackbar(err?.message || 'Failed to update phone number.', { variant: 'error' });
      }
    });
  };

  useEffect(() => {
    if (open) {
      const formInitData = phoneData
        ? {
            dialCode: phoneData.dialCode || '',
            contact: phoneData.contact || ''
          }
        : initialData;
      reset(formInitData);
    }
  }, [open, phoneData, reset]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{phoneData?.contact ? 'Update' : 'Add'}</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={ModalSize.MD}
        header={{ title: 'Phone Number', subheader: `${phoneData?.contact ? 'Update' : 'Add'} your phone number to stay connected.` }}
        modalContent={
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <InputLabel>Contact Number</InputLabel>
            <Contact
              fullWidth
              dialCode={watch('dialCode')}
              onCountryChange={(data) => setValue('dialCode', data.dialCode, { shouldDirty: true })}
              control={control}
              placeholder="8234454656"
              isError={!!errors.contact}
            />
            {errors.contact?.message && <FormHelperText error>{errors.contact?.message}</FormHelperText>}
          </form>
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
              {phoneData?.contact ? 'Update' : 'Add'} Number
            </Button>
          </Stack>
        }
      />
    </>
  );
}

ModalPhoneNumber.propTypes = { phoneData: PropTypes.object };
