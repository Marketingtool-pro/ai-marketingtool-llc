// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import PresentationCard from '@/components/cards/PresentationCard';
import LinearProgressWithLabel, { LinearProgressPlacement } from '@/components/progress/LinearProgressWithLabel';

/***************************  PROGRESS - WITH LABEL SIZE  ***************************/

export default function WithLabelSizeProgress() {
  return (
    <PresentationCard title="With label [height: 8px]">
      <Stack sx={{ gap: 2.5 }}>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Right side
        </Typography>
        <LinearProgressWithLabel value={10} sx={{ height: 8 }} />
        <LinearProgressWithLabel value={50} sx={{ height: 8 }} placement={LinearProgressPlacement.TOPRIGHT} />
        <LinearProgressWithLabel value={60} sx={{ height: 8 }} placement={LinearProgressPlacement.BOTTOMRIGHT} />
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Left side
        </Typography>
        <LinearProgressWithLabel value={20} sx={{ height: 8 }} placement={LinearProgressPlacement.LEFT} />
        <LinearProgressWithLabel value={70} sx={{ height: 8 }} placement={LinearProgressPlacement.TOPLEFT} />
        <LinearProgressWithLabel value={80} sx={{ height: 8 }} placement={LinearProgressPlacement.BOTTOMLEFT} />
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          In center
        </Typography>
        <LinearProgressWithLabel value={30} sx={{ height: 8 }} placement={LinearProgressPlacement.TOP} />
        <LinearProgressWithLabel value={40} sx={{ height: 8 }} placement={LinearProgressPlacement.BOTTOM} />
      </Stack>
    </PresentationCard>
  );
}
