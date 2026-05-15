// @mui
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';

// @project
import { LinearProgressType } from '@/components/progress/LinearProgressWithLabel';
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  PROGRESS - LIGHT COLOR  ***************************/

export default function LightColorProgress() {
  return (
    <PresentationCard title="Light Color">
      <Stack sx={{ gap: 2.5 }}>
        <LinearProgress value={10} type={LinearProgressType.LIGHT} />
        <LinearProgress value={20} type={LinearProgressType.LIGHT} color="secondary" />
        <LinearProgress value={40} type={LinearProgressType.LIGHT} color="success" />
        <LinearProgress value={60} type={LinearProgressType.LIGHT} color="error" />
        <LinearProgress value={80} type={LinearProgressType.LIGHT} color="warning" />
        <LinearProgress value={90} type={LinearProgressType.LIGHT} color="info" />
        <LinearProgress value={10} type={LinearProgressType.LIGHT} sx={{ height: 8 }} />
        <LinearProgress value={20} type={LinearProgressType.LIGHT} sx={{ height: 8 }} color="secondary" />
        <LinearProgress value={40} type={LinearProgressType.LIGHT} sx={{ height: 8 }} color="success" />
        <LinearProgress value={60} type={LinearProgressType.LIGHT} sx={{ height: 8 }} color="error" />
        <LinearProgress value={80} type={LinearProgressType.LIGHT} sx={{ height: 8 }} color="warning" />
        <LinearProgress value={90} type={LinearProgressType.LIGHT} sx={{ height: 8 }} color="info" />
      </Stack>
    </PresentationCard>
  );
}
