// @mui
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  PROGRESS - SIZE  ***************************/

export default function SizeProgress() {
  return (
    <PresentationCard title="Size [height: 8px]">
      <Stack sx={{ gap: 2.5 }}>
        <LinearProgress sx={{ height: 8 }} value={5} />
        <LinearProgress sx={{ height: 8 }} value={10} />
        <LinearProgress sx={{ height: 8 }} value={20} />
        <LinearProgress sx={{ height: 8 }} value={30} />
        <LinearProgress sx={{ height: 8 }} value={40} />
        <LinearProgress sx={{ height: 8 }} value={50} />
        <LinearProgress sx={{ height: 8 }} value={60} />
        <LinearProgress sx={{ height: 8 }} value={70} />
        <LinearProgress sx={{ height: 8 }} value={80} />
        <LinearProgress sx={{ height: 8 }} value={90} />
        <LinearProgress sx={{ height: 8 }} value={100} />
      </Stack>
    </PresentationCard>
  );
}
