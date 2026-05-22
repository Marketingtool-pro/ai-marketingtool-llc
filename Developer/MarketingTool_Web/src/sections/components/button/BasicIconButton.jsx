// @mui
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

// @assets
import { IconSparkles } from '@tabler/icons-react';

/***************************  ICON BUTTON - BASIC  ***************************/

export default function BasicIconButton() {
  return (
    <PresentationCard title="Basic Icon Button">
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <IconButton color="primary" aria-label="default primary button">
          <IconSparkles size={16} />
        </IconButton>
        <IconButton variant="contained" color="primary" aria-label="contained primary button">
          <IconSparkles size={16} />
        </IconButton>
        <IconButton variant="outlined" color="primary" aria-label="outlined primary button">
          <IconSparkles size={16} />
        </IconButton>
      </Stack>
    </PresentationCard>
  );
}
