// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import PageAnimateWrapper from '@/components/PageAnimateWrapper';
import { BuillingPlanCard, BillingList } from '@/sections/billing';

/***************************  BILLING  ***************************/

export default function Billing() {
  return (
    <>
      <Stack sx={{ gap: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ py: 1.25 }}>
          Billing
        </Typography>
        <PageAnimateWrapper>
          <Stack sx={{ gap: { xs: 2, md: 3 } }}>
            <BuillingPlanCard />
            <BillingList />
          </Stack>
        </PageAnimateWrapper>
      </Stack>
    </>
  );
}
