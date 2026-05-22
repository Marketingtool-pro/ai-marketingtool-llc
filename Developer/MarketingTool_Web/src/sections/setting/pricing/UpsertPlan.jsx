import PropTypes from 'prop-types';
import { useEffect, useMemo, useState, useTransition } from 'react';

// @mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @third-party
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

// @project
import PageAnimateWrapper from '@/components/PageAnimateWrapper';
import Features from '@/sections/setting/pricing/plan-create/Features';
import General from '@/sections/setting/pricing/plan-create/General';
import PricingModel from '@/sections/setting/pricing/plan-create/PricingModel';
import { useRouter } from '@/utils/navigation';
import { getPlanFormSchemas } from '@/utils/validation-schema/settings/plan';

// @assets
import { IconArrowLeft } from '@tabler/icons-react';

const initialData = {
  name: '',
  description: '',
  isRecommended: false,
  priceModal: '',
  trialPeriodDays: 0,
  yearlyDiscount: 0,
  features: [],
  pricingOptions: []
};

/***************************  PLAN - UPSERT  ***************************/

export default function UpsertPlan({ planData }) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDraftProcessing, startDraftTransition] = useTransition();
  const [isPlanProcessing, startPlanTransition] = useTransition();

  const schemas = useMemo(() => getPlanFormSchemas(isPublishing), [isPublishing]);

  // Get schema
  const { nameSchema, priceModalSchema, pricingOptionsSchema, featuresSchema } = schemas;

  const {
    handleSubmit,
    reset,
    control,
    formState: { isDirty },
    trigger
  } = useForm({ defaultValues: initialData });

  const onSubmit = (status) => (formData) => {
    const isDraft = status === 'Draft';

    const payload = {
      ...formData,
      ...(planData && { id: planData.id })
    };
    console.log(payload);

    if (isDraft) {
      startDraftTransition(async () => {
        // Replace the below timeout with your actual API call to save plan draft
        // Example: await savePlanDraft(payload);
        await new Promise((resolve) => setTimeout(() => resolve('ok'), 3000));
        enqueueSnackbar(`Plan has been ${planData ? 'updated' : 'drafted'}.`, { variant: 'success' });
        router.push('/setting/pricing');
      });
    } else {
      startPlanTransition(async () => {
        // Replace the below timeout with your actual API call to save plan and publish it
        // Example: await savePlanPublish(payload);
        await new Promise((resolve) => setTimeout(() => resolve('ok'), 3000));
        enqueueSnackbar(`Plan has been ${planData ? 'updated' : 'published'}.`, { variant: 'success' });
        router.push('/setting/pricing');
      });
    }
  };

  //if form data is passed, set the form values
  useEffect(() => {
    const formInitData = planData
      ? {
          name: planData.name || '',
          description: planData.description || '',
          isRecommended: planData.isRecommended,
          priceModal: planData.priceModal || '',
          pricingOptions: planData.pricingOptions || [],
          trialPeriodDays: planData.trialPeriodDays || 0,
          yearlyDiscount: planData.yearlyDiscount || 0,
          features: planData.features || []
        }
      : initialData;
    reset(formInitData);
  }, [planData, reset]);

  useEffect(() => {
    trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPublishing]);

  const handleReturnClick = () => {
    router.back();
  };

  return (
    <Stack sx={{ gap: { xs: 3, md: 4 } }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
          <IconButton variant="outlined" color="secondary" onClick={handleReturnClick}>
            <IconArrowLeft size={20} />
          </IconButton>
          <Typography variant="h6">{planData ? 'Edit' : 'Create'} Plan</Typography>
        </Stack>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ textTransform: 'none' }}
            disabled={!isDirty || isPlanProcessing}
            {...(isDraftProcessing && { loading: true, loadingPosition: 'end' })}
            onClick={() => {
              setIsPublishing(false);
              handleSubmit((data) => onSubmit('Draft')(data))();
            }}
          >
            Save as Draft
          </Button>
          <Button
            variant="contained"
            disabled={(!planData?.isDraft && !isDirty) || isDraftProcessing}
            {...(isPlanProcessing && { loading: true, loadingPosition: 'end' })}
            onClick={() => {
              setIsPublishing(true);
              handleSubmit((data) => onSubmit('Publish')(data))();
            }}
          >
            {planData ? 'Update & Publish' : 'Publish'}
          </Button>
        </Stack>
      </Stack>

      <form>
        <PageAnimateWrapper>
          <Stack sx={{ gap: { xs: 2, md: 3 } }}>
            <General control={control} nameSchema={nameSchema} />
            <PricingModel control={control} priceModalSchema={priceModalSchema} pricingOptionsSchema={pricingOptionsSchema} />
            <Features control={control} featuresSchema={featuresSchema} />
          </Stack>
        </PageAnimateWrapper>
      </form>
    </Stack>
  );
}

UpsertPlan.propTypes = { planData: PropTypes.any };
