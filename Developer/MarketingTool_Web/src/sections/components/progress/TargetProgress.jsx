// @mui
import Stack from '@mui/material/Stack';

// @project
import LinearProgressWithTarget from '@/components/progress/LinearProgressWithTarget';
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  PROGRESS - TARGET PROGRESS  ***************************/

export default function TargetProgress() {
  return (
    <PresentationCard title="Target Progress">
      <Stack sx={{ gap: 1, width: 128 }}>
        <LinearProgressWithTarget target={20000} achieved={23000} goal={25000} />
        <LinearProgressWithTarget target={80} achieved={70} goal={100} />
      </Stack>
    </PresentationCard>
  );
}
