// @mui
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

// @assets
import { IconSparkles } from '@tabler/icons-react';

/***************************  ICON BUTTON - DISABLED  ***************************/

export default function DisabledIconButton() {
  return (
    <PresentationCard title="Disabled & Loading Icon Button">
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <IconButton disabled color="primary" aria-label="disabled primary button">
          <IconSparkles size={16} />
        </IconButton>
        <IconButton disabled variant="contained" color="primary" aria-label="disabled contained button">
          <IconSparkles size={16} />
        </IconButton>
        <IconButton disabled variant="outlined" color="primary" aria-label="disabled outlined button">
          <IconSparkles size={16} />
        </IconButton>
        <IconButton color="primary" loading aria-label="loading primary button">
          <IconSparkles size={16} />
        </IconButton>
        <IconButton variant="contained" color="primary" loading aria-label="loading contained button">
          <IconSparkles size={16} />
        </IconButton>
        <IconButton variant="outlined" color="primary" loading aria-label="loading outlined button">
          <IconSparkles size={16} />
        </IconButton>
      </Stack>
    </PresentationCard>
  );
}
