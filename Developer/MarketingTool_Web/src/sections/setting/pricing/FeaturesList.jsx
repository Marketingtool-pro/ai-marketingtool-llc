import { useState } from 'react';

// @mui
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';

// @project
import UpsertFeature from './UpsertFeature';
import MainCard from '@/components/MainCard';
import FeatureTable from '@/sections/setting/pricing/feature-table/FeatureTable';

// @assets
import { IconPlus } from '@tabler/icons-react';

/***************************  PRICING - FEATURES LIST  ***************************/

export default function FeaturesList() {
  const [open, setOpen] = useState(false);

  return (
    <MainCard sx={{ p: 0 }}>
      <CardHeader
        title="Features"
        subheader="Set a list of features"
        action={
          <Button variant="contained" onClick={() => setOpen(true)} startIcon={<IconPlus size={16} />}>
            Add Feature
          </Button>
        }
        sx={{ p: { xs: 1.75, sm: 2.25, md: 3 } }}
        slotProps={{ title: { sx: { fontWeight: 400 } }, subheader: { variant: 'body2', sx: { color: 'grey.700' } } }}
      />
      <UpsertFeature open={open} onClose={() => setOpen(false)} />
      <FeatureTable />
    </MainCard>
  );
}
