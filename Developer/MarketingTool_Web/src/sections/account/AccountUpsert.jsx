import PropTypes from 'prop-types';
import { useEffect, useTransition } from 'react';

// @mui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { enqueueSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';

// @project
import { createAccount, updateAccount } from './api';
import { plans } from './data/plans';

import Contact from '@/components/Contact';
import DynamicIcon from '@/components/DynamicIcon';
import Modal from '@/components/Modal';
import TagList from '@/components/third-party/table/TagList';

import { ModalSize } from '@/enum';
import { emailSchema, firstNameSchema, lastNameSchema, usernameSchema } from '@/utils/validation-schema/common';

//@type
import { BillingCycle, BillingStatus, Plans } from './type';

// @assets
import { IconMail } from '@tabler/icons-react';

const statusOptions = ['Paid', 'Scheduled'];

const initialData = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  contact: '',
  dialCode: '+1',
  plan: Plans.BASIC,
  billingCycle: BillingCycle.MONTHLY,
  billingStatus: BillingStatus.SCHEDULED
};

/***************************  NEW ACCOUNT - PLANS  ***************************/

function RadioPlan({ plan, billingCycle }) {
  return (
    <Stack
      direction="row"
      sx={{ gap: 0.5, width: 1, justifyContent: 'space-between', alignItems: 'center', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
    >
      <Stack direction="row" sx={{ gap: 1, alignItems: { sm: 'center' } }}>
        <Avatar sx={{ borderRadius: 2.5 }}>
          <DynamicIcon name={plan.icon} />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            {plan.title}
          </Typography>
          <TagList list={plan.features.map((feature) => feature.label)} max={2} />
        </Box>
      </Stack>
      <Stack direction="row" sx={{ alignItems: 'flex-end', gap: 0.5 }}>
        <Typography variant="h3">{billingCycle === BillingCycle.YEARLY ? `$${plan.yearlyPrice}` : `$${plan.monthlyPrice}`}</Typography>
        <Typography variant="body1">USD</Typography>
      </Stack>
    </Stack>
  );
}

/*************************** MODAL - NEW ACCOUNT  ***************************/

export default function AccountUpsert({ open, onClose, accountData }) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    setValue,
    formState: { errors, isDirty }
  } = useForm({ defaultValues: initialData });

  const onSubmit = ({ firstName, lastName, username, email, contact, plan, dialCode, billingCycle, billingStatus }) => {
    const planData = plans.find((item) => item.name === plan);
    const baseProfile = { firstName, lastName, username, email, contact, dialCode };
    const profile = accountData ? { ...accountData.profile, ...baseProfile } : baseProfile;
    const account = { profile, plan: planData, billingCycle, billingStatus, isBlocked: false };

    startTransition(async () => {
      const { error } = accountData ? await updateAccount({ ...accountData, ...account }) : await createAccount(account);

      if (error) {
        enqueueSnackbar(error, { variant: 'error' });
        return;
      }

      enqueueSnackbar(`Account has been ${accountData ? 'updated' : 'created'}`, { variant: 'success' });
      onClose();
    });
  };

  //if form data is passed, set the form values
  useEffect(() => {
    if (open) {
      const formInitData = accountData
        ? {
            firstName: accountData.profile.firstName,
            lastName: accountData.profile.lastName,
            username: accountData.profile.username,
            email: accountData.profile.email,
            contact: accountData.profile.contact,
            plan: accountData.plan.name,
            dialCode: accountData.profile.dialCode,
            billingCycle: accountData.billingCycle,
            billingStatus: accountData.billingStatus
          }
        : initialData;
      reset(formInitData);
    }
  }, [open, accountData, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth={ModalSize.MD}
      header={{
        title: accountData ? 'Edit Account' : 'Add Account',
        subheader: 'Manage account with the right plan to support your team’s needs.',
        closeButton: true
      }}
      onFormSubmit={handleSubmit(onSubmit)}
      modalContent={
        <>
          <Stack sx={{ gap: 3 }}>
            <Stack sx={{ gap: 2 }}>
              <Typography variant="subtitle1">Personal Detail</Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel required>First Name</InputLabel>
                  <OutlinedInput
                    fullWidth
                    placeholder="ex. John"
                    error={errors.firstName && Boolean(errors.firstName)}
                    {...register('firstName', firstNameSchema)}
                  />
                  {errors.firstName?.message && <FormHelperText error>{errors.firstName?.message}</FormHelperText>}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel required>Last Name</InputLabel>
                  <OutlinedInput
                    fullWidth
                    placeholder="ex. Doe"
                    error={errors.lastName && Boolean(errors.lastName)}
                    {...register('lastName', lastNameSchema)}
                  />
                  {errors.lastName?.message && <FormHelperText error>{errors.lastName?.message}</FormHelperText>}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel required>Username</InputLabel>
                  <OutlinedInput
                    placeholder="ex. john_doe"
                    fullWidth
                    error={errors.username && Boolean(errors.username)}
                    {...register('username', usernameSchema)}
                    aria-describedby="outlined-username"
                    slotProps={{ input: { 'aria-label': 'username' } }}
                  />
                  {errors.username?.message && <FormHelperText error>{errors.username?.message}</FormHelperText>}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel required>Email</InputLabel>
                  <OutlinedInput
                    placeholder="example@saasable.io"
                    fullWidth
                    error={errors.email && Boolean(errors.email)}
                    {...register('email', emailSchema)}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconMail />
                      </InputAdornment>
                    }
                    aria-describedby="outlined-email"
                    slotProps={{ input: { 'aria-label': 'email' } }}
                  />
                  {errors.email?.message && <FormHelperText error>{errors.email?.message}</FormHelperText>}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel required>Contact</InputLabel>
                  <Contact
                    fullWidth
                    dialCode={watch('dialCode')}
                    onCountryChange={(data) => setValue('dialCode', data.dialCode)}
                    control={control}
                    isError={errors.contact && Boolean(errors.contact)}
                  />
                  {errors.contact?.message && <FormHelperText error>{errors.contact?.message}</FormHelperText>}
                </Grid>
              </Grid>
              <Box>
                <InputLabel>Status</InputLabel>
                <Controller
                  name="billingStatus"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row aria-labelledby="radio-group-status" {...field}>
                      {statusOptions.map((item, index) => (
                        <FormControlLabel key={index} value={item} control={<Radio />} label={item} />
                      ))}
                    </RadioGroup>
                  )}
                />
              </Box>
            </Stack>
            <Stack sx={{ gap: 2 }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="subtitle1">Plans</Typography>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                  <Typography
                    variant="subtitle1"
                    color={watch('billingCycle') === BillingCycle.MONTHLY ? 'text.primary' : 'text.secondary'}
                  >
                    Monthly
                  </Typography>
                  <Controller
                    name="billingCycle"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value === BillingCycle.YEARLY}
                        onChange={(e) => field.onChange(e.target.checked ? BillingCycle.YEARLY : BillingCycle.MONTHLY)}
                        slotProps={{ input: { 'aria-label': 'time period switch' } }}
                      />
                    )}
                  />
                  <Typography variant="subtitle1" color={watch('billingCycle') === BillingCycle.YEARLY ? 'text.primary' : 'text.secondary'}>
                    Yearly
                  </Typography>
                </Stack>
              </Stack>
              <Controller
                name="plan"
                control={control}
                render={({ field }) => (
                  <RadioGroup aria-labelledby="radio-group-pricing-plans" {...field} sx={{ gap: 2 }}>
                    {plans.map((item, index) => (
                      <FormControlLabel
                        key={index}
                        value={item.name}
                        control={<Radio size="large" sx={{ pl: 0, mr: { xs: 0.75, sm: 1.75 } }} />}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'grey.100',
                          alignItems: 'flex-start',
                          ml: 0,
                          width: 1,
                          ...(watch('plan') === item.name && { bgcolor: 'grey.50' })
                        }}
                        label={<RadioPlan {...{ plan: item, billingCycle: watch('billingCycle') }} />}
                        slotProps={{ typography: { sx: { width: 1, alignItems: 'center' } } }}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
            </Stack>
          </Stack>
        </>
      }
      footer={
        <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={!isDirty || isPending} loading={isPending} loadingPosition="end">
            {accountData ? 'Update Account' : 'Create Account'}
          </Button>
        </Stack>
      }
    />
  );
}

RadioPlan.propTypes = { plan: PropTypes.any, billingCycle: PropTypes.any };

AccountUpsert.propTypes = { open: PropTypes.bool, onClose: PropTypes.func, accountData: PropTypes.any };
