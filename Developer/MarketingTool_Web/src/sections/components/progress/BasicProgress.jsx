// @mui
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  PROGRESS - BASIC  ***************************/

export default function BasicProgress() {
  return (
    <PresentationCard title="Basic">
      <Stack sx={{ gap: 2.5 }}>
        <LinearProgress value={5} />
        <LinearProgress value={10} />
        <LinearProgress value={20} />
        <LinearProgress value={30} />
        <LinearProgress value={40} />
        <LinearProgress value={50} />
        <LinearProgress value={60} />
        <LinearProgress value={70} />
        <LinearProgress value={80} />
        <LinearProgress value={90} />
        <LinearProgress value={100} />
      </Stack>
    </PresentationCard>
  );
}
