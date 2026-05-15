// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import PresentationCard from '@/components/cards/PresentationCard';
import LinearProgressWithLabel, { LinearProgressPlacement } from '@/components/progress/LinearProgressWithLabel';

/***************************  PROGRESS - WITH LABEL  ***************************/

export default function WithLabelProgress() {
  return (
    <PresentationCard title="With Label">
      <Stack sx={{ gap: 2.5 }}>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Right side
        </Typography>
        <LinearProgressWithLabel value={10} />
        <LinearProgressWithLabel value={50} placement={LinearProgressPlacement.TOPRIGHT} />
        <LinearProgressWithLabel value={60} placement={LinearProgressPlacement.BOTTOMRIGHT} />
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Left side
        </Typography>
        <LinearProgressWithLabel value={20} placement={LinearProgressPlacement.LEFT} />
        <LinearProgressWithLabel value={70} placement={LinearProgressPlacement.TOPLEFT} />
        <LinearProgressWithLabel value={80} placement={LinearProgressPlacement.BOTTOMLEFT} />
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          In center
        </Typography>
        <LinearProgressWithLabel value={30} placement={LinearProgressPlacement.TOP} />
        <LinearProgressWithLabel value={40} placement={LinearProgressPlacement.BOTTOM} />
      </Stack>
    </PresentationCard>
  );
}
