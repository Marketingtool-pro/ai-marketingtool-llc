// @mui
import Stack from '@mui/material/Stack';

// @project
import RangeSlider from './RangeSlider';
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  COLOR - SLIDER  ***************************/

export default function ColorSlider() {
  return (
    <PresentationCard title="Color">
      <Stack sx={{ gap: 2 }}>
        <RangeSlider defaultValue={[0, 25]} color="primary" />
        <RangeSlider defaultValue={[15, 50]} color="secondary" />
        <RangeSlider defaultValue={[35, 100]} color="success" />
        <RangeSlider defaultValue={[20, 87]} color="error" />
        <RangeSlider defaultValue={[15, 50]} color="warning" />
        <RangeSlider defaultValue={[8, 65]} color="info" />
      </Stack>
    </PresentationCard>
  );
}
