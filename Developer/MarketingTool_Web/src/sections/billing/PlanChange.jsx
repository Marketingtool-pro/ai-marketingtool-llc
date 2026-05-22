import PropTypes from 'prop-types';
import { useEffect } from 'react';

// @mui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
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
import { plans } from './data/plans';
import DynamicIcon from '@/components/DynamicIcon';
import Modal from '@/components/Modal';
import TagList from '@/components/third-party/table/TagList';
import { ModalSize } from '@/enum';

//@type
import { Plans, BillingCycle } from './type';

/***************************  NEW BILLING - PLANS  ***************************/

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

/*************************** MODAL - PLAN CHANGE  ***************************/

export default function PlanChange({ open, onClose, planData, billingCycle, onSubmitForm }) {
  const handleClose = () => {
    reset();
    onClose();
  };

  const {
    handleSubmit,
    watch,
    reset,
    control,
    formState: { isDirty }
  } = useForm({
    defaultValues: planData
      ? { plan: planData.name, billingCycle: billingCycle }
      : { plan: Plans.STARTER, billingCycle: BillingCycle.MONTHLY }
  });

  const onSubmit = (data) => {
    onSubmitForm(data.plan, data.billingCycle);
    enqueueSnackbar('Billing plan has been updated', { variant: 'success' });
    reset();
    onClose();
  };

  // if form data is passed, set the form values
  useEffect(() => {
    if (planData) {
      reset({ plan: planData.name, billingCycle: billingCycle });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, planData, reset]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth={ModalSize.MD}
      header={{
        title: 'Choose Your Plan',
        subheader: 'Upgrade the plan and change your journey now.',
        closeButton: true
      }}
      modalContent={
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack sx={{ gap: 2 }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="subtitle1">Plans</Typography>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                <Typography variant="subtitle1" color={watch('billingCycle') === BillingCycle.MONTHLY ? 'text.primary' : 'text.secondary'}>
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
                      label={<RadioPlan {...{ plan: item, billingCycle: watch('billingCycle') || BillingCycle.YEARLY }} />}
                      slotProps={{ typography: { sx: { width: 1, alignItems: 'center' } } }}
                    />
                  ))}
                </RadioGroup>
              )}
            />
          </Stack>
        </form>
      }
      footer={
        <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={!isDirty}>
            Update Plan
          </Button>
        </Stack>
      }
    />
  );
}

RadioPlan.propTypes = { plan: PropTypes.any, billingCycle: PropTypes.any };

PlanChange.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  planData: PropTypes.any,
  billingCycle: PropTypes.any,
  onSubmitForm: PropTypes.func
};
