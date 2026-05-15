// @mui
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

// @assets
import { IconSparkles } from '@tabler/icons-react';

/***************************  ICON BUTTON - COLOR  ***************************/

export default function ColorIconButton() {
  return (
    <PresentationCard title="Color Icon Button">
      <Stack sx={{ gap: 2.5 }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <IconButton color="primary" aria-label="primary button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton color="secondary" aria-label="secondary button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton color="success" aria-label="success button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton color="error" aria-label="error button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton color="warning" aria-label="warning button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton color="info" aria-label="info button">
            <IconSparkles size={16} />
          </IconButton>
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <IconButton variant="contained" color="primary" aria-label="contained primary button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton variant="contained" color="secondary" aria-label="contained secondary button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton variant="contained" color="success" aria-label="contained success button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton variant="contained" color="error" aria-label="contained error button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton variant="contained" color="warning" aria-label="contained warning button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton variant="contained" color="info" aria-label="contained info button">
            <IconSparkles size={16} />
          </IconButton>
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <IconButton variant="outlined" color="primary" aria-label="outlined primary button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton variant="outlined" color="secondary" aria-label="outlined secondary button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton variant="outlined" color="success" aria-label="outlined success button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton variant="outlined" color="error" aria-label="outlined error button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton variant="outlined" color="warning" aria-label="outlined warning button">
            <IconSparkles size={16} />
          </IconButton>
          <IconButton variant="outlined" color="info" aria-label="outlined info button">
            <IconSparkles size={16} />
          </IconButton>
        </Stack>
      </Stack>
    </PresentationCard>
  );
}
