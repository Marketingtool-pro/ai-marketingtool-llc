import { useEffect, useState, useTransition } from 'react';

// @mui
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import ItemNotFound from '@/components/ItemNotFound';
import Loader from '@/components/Loader';
import { pricingPlanData } from '@/sections/setting/pricing/data/plan-data';
import UpsertPlan from '@/sections/setting/pricing/UpsertPlan';
import { handlerBreadcrumbs } from '@/states/breadcrumbs';
import { useRouter } from '@/utils/navigation';

// @assets
import { IconArrowLeft } from '@tabler/icons-react';

/***************************  PRICING PLAN - EDIT  ***************************/

export default function PricingPlanEdit() {
  const router = useRouter();
  const id = router.params.id;

  const [isProcessing, startTransition] = useTransition();
  const [planData, setPlanData] = useState();

  const handleReturnClick = () => {
    router.back();
  };

  const getUser = () => {
    startTransition(async () => {
      // Replace the below timeout with your actual API call to get plan
      // Example: await getPricingPlan(id);
      await new Promise((resolve) => setTimeout(() => resolve('ok'), 2000));
      const data = pricingPlanData.find((item) => item.id === id);
      setPlanData(data);
    });
  };

  useEffect(() => {
    if (!id) return;

    handlerBreadcrumbs(`/setting/pricing/plan-edit/${id}`, [
      { title: 'setting' },
      { title: 'pricing', url: '/setting/pricing' },
      { title: 'plan-edit' }
    ]);
    getUser();
    // eslint-disable-next-line
  }, [id]);

  if (isProcessing) return <Loader />;

  return planData ? (
    <UpsertPlan planData={planData} />
  ) : (
    <Stack sx={{ gap: { xs: 2, sm: 3 } }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
        <IconButton variant="outlined" color="secondary" onClick={handleReturnClick}>
          <IconArrowLeft size={20} />
        </IconButton>
        <Typography variant="h6">Edit Plan</Typography>
      </Stack>
      <ItemNotFound heading="Plan Not Found" caption="The plan you are looking for does not exist or may have been removed." />
    </Stack>
  );
}
