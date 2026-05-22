// @mui
import Stack from '@mui/material/Stack';

// @project
import RangeSlider from './RangeSlider';
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  BASIC - SLIDER  ***************************/

export default function BasicSlider() {
  return (
    <PresentationCard title="Basic">
      <Stack sx={{ gap: 2 }}>
        <RangeSlider />
        <RangeSlider valueLabelDisplay="on" defaultValue={[13, 87]} />
        <RangeSlider disabled defaultValue={[28, 82]} />
      </Stack>
    </PresentationCard>
  );
}
