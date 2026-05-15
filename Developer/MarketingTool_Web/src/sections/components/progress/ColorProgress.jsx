// @mui
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  PROGRESS - COLOR  ***************************/

export default function ColorProgress() {
  return (
    <PresentationCard title="Color">
      <Stack sx={{ gap: 2.5 }}>
        <LinearProgress value={10} />
        <LinearProgress value={20} color="secondary" />
        <LinearProgress value={40} color="success" />
        <LinearProgress value={60} color="error" />
        <LinearProgress value={80} color="warning" />
        <LinearProgress value={90} color="info" />
        <LinearProgress value={10} sx={{ height: 8 }} />
        <LinearProgress value={20} sx={{ height: 8 }} color="secondary" />
        <LinearProgress value={40} sx={{ height: 8 }} color="success" />
        <LinearProgress value={60} sx={{ height: 8 }} color="error" />
        <LinearProgress value={80} sx={{ height: 8 }} color="warning" />
        <LinearProgress value={90} sx={{ height: 8 }} color="info" />
      </Stack>
    </PresentationCard>
  );
}
