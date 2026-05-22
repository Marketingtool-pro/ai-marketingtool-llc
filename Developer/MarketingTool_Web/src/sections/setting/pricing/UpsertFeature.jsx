import PropTypes from 'prop-types';
import { useEffect, useTransition } from 'react';

// @mui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

// @third-party
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import Modal from '@/components/Modal';
import { ModalSize } from '@/enum';
import { featureNameSchema } from '@/utils/validation-schema/settings/feature';

const initialData = {
  name: ''
};

/***************************  FEATURE - UPSERT  ***************************/

export default function UpsertFeature({ open, onClose, data }) {
  const [isProcessing, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({ defaultValues: { name: data ? data.name : '' } });

  const onSubmit = (formData) => {
    if (!isDirty) return;
    const payload = {
      ...formData,
      ...(data && { id: data.id })
    };
    console.log(payload);

    startTransition(async () => {
      // Replace the below timeout with your actual API call to add or update feature.
      // Example: await addEmail(payload);
      await new Promise((resolve) => setTimeout(() => resolve('ok'), 3000));
      enqueueSnackbar(`Feature has been ${data ? 'updated' : 'added'}.`, { variant: 'success' });
      onClose();
    });
  };

  useEffect(() => {
    if (open) {
      const formInitData = data ? { name: data.name } : initialData;
      reset(formInitData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, data]);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        maxWidth={ModalSize.MD}
        header={{
          title: data ? 'Edit Feature' : 'Add Fetaure',
          subheader: 'A powerful features to boost functionality and efficiency.',
          closeButton: true
        }}
        onFormSubmit={handleSubmit(onSubmit)}
        modalContent={
          <>
            <InputLabel>Feature Name</InputLabel>
            <OutlinedInput
              fullWidth
              placeholder="Enter feature name ex. API"
              error={errors.name && Boolean(errors.name)}
              {...register('name', featureNameSchema)}
            />
            {errors.name?.message && <FormHelperText error>{errors.name?.message}</FormHelperText>}
          </>
        }
        footer={
          <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
            <Button variant="outlined" color="secondary" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={!isDirty} {...(isProcessing && { loading: true, loadingPosition: 'end' })}>
              {data ? 'Update' : 'Add'} Feature
            </Button>
          </Stack>
        }
      />
    </>
  );
}

UpsertFeature.propTypes = { open: PropTypes.bool, onClose: PropTypes.func, data: PropTypes.any };
