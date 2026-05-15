import { useState } from 'react';

// @mui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import { plans } from './data/plans';
import PlanChange from './PlanChange';
import MainCard from '@/components/MainCard';
import TagList from '@/components/third-party/table/TagList';
import { AvatarSize } from '@/enum';

// @assets
import DynamicIcon from '@/components/DynamicIcon';

// @types
import { BillingCycle } from './type';

/***************************  BILLING PLAN - CARD ***************************/

export default function BuillingPlanCard() {
  const [plan, setPlan] = useState(plans[0]);
  const [billingCycle, setBillingCycle] = useState(BillingCycle.YEARLY);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmitForm = (plan, billingCycle) => {
    setBillingCycle(billingCycle);
    setPlan(plans.find((p) => p.name === plan));
  };

  return (
    <>
      <MainCard sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: 'grey.50', boxShadow: 'none' }}>
        <Stack
          direction="row"
          sx={{ gap: 0.5, width: 1, justifyContent: 'space-between', alignItems: 'center', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
        >
          <Stack direction="row" sx={{ gap: 1, alignItems: { sm: 'center' } }}>
            <Avatar
              variant="rounded"
              size={AvatarSize.SM}
              sx={(theme) => ({
                bgcolor: 'primary.lighter',
                ...theme.applyStyles('dark', {
                  bgcolor: 'primary.lighter'
                })
              })}
            >
              <DynamicIcon name={plan.icon} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 400 }}>
                {plan.title}
              </Typography>
              <TagList list={plan.features.map((feature) => feature.label)} max={3} />
            </Box>
          </Stack>
          <Stack direction="row" sx={{ alignItems: 'center', gap: { xs: 1.25, sm: 3 } }}>
            <Stack direction="row" sx={{ alignItems: 'flex-end', gap: 0.5 }}>
              <Typography variant="h3">{`$${billingCycle === BillingCycle.YEARLY ? plan.yearlyPrice : plan.monthlyPrice}`}</Typography>
              <Typography variant="body1" color="text.secondary">
                USD
              </Typography>
            </Stack>
            <Button variant="contained" onClick={handleOpen}>
              Change Plan
            </Button>
          </Stack>
        </Stack>
      </MainCard>
      <PlanChange {...{ open, onClose: handleClose, planData: plan, billingCycle, onSubmitForm }} />
    </>
  );
}
