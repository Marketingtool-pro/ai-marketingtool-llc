// @mui
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

// @assets
import { IconSparkles } from '@tabler/icons-react';

/***************************  ICON BUTTON - SIZE  ***************************/

export default function IconButtonSize() {
  return (
    <PresentationCard title="Icon Button Size">
      <Stack sx={{ gap: 2.5 }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <IconButton color="primary" size="small" aria-label="small primary button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton color="primary" aria-label="default primary button">
            <IconSparkles size={20} />
          </IconButton>
          <IconButton color="primary" size="large" aria-label="large primary button">
            <IconSparkles size={24} />
          </IconButton>
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <IconButton variant="contained" color="primary" size="small" aria-label="small contained button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton variant="contained" color="primary" aria-label="default contained button">
            <IconSparkles size={20} />
          </IconButton>
          <IconButton variant="contained" color="primary" size="large" aria-label="large contained button">
            <IconSparkles size={24} />
          </IconButton>
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <IconButton variant="outlined" color="primary" size="small" aria-label="small outlined button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton variant="outlined" color="primary" aria-label="default outlined button">
            <IconSparkles size={20} />
          </IconButton>
          <IconButton variant="outlined" color="primary" size="large" aria-label="large outlined button">
            <IconSparkles size={24} />
          </IconButton>
        </Stack>
      </Stack>
    </PresentationCard>
  );
}
