// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

// @assets
import { IconSparkles } from '@tabler/icons-react';

/***************************  BUTTON - WITHICON  ***************************/

export default function WithIcon() {
  return (
    <PresentationCard title=" With Icon">
      <Stack sx={{ gap: 2.5 }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button startIcon={<IconSparkles size={16} />}>Text</Button>
          <Button variant="contained" startIcon={<IconSparkles size={16} />}>
            Contained
          </Button>
          <Button variant="outlined" startIcon={<IconSparkles size={16} />}>
            Outlined
          </Button>
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button endIcon={<IconSparkles size={16} />}>Text</Button>
          <Button variant="contained" endIcon={<IconSparkles size={16} />}>
            Contained
          </Button>
          <Button variant="outlined" endIcon={<IconSparkles size={16} />}>
            Outlined
          </Button>
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button startIcon={<IconSparkles size={16} />} endIcon={<IconSparkles size={16} />}>
            Text
          </Button>
          <Button variant="contained" startIcon={<IconSparkles size={16} />} endIcon={<IconSparkles size={16} />}>
            Contained
          </Button>
          <Button variant="outlined" startIcon={<IconSparkles size={16} />} endIcon={<IconSparkles size={16} />}>
            Outlined
          </Button>
        </Stack>
      </Stack>
    </PresentationCard>
  );
}
