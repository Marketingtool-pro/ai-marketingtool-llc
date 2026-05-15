// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  BUTTON - SIZE  ***************************/

export default function Size() {
  return (
    <PresentationCard title="Size">
      <Stack sx={{ gap: 2.5 }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="small">Small</Button>
          <Button>Default / Medium</Button>
          <Button size="large">Large</Button>
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" size="small">
            Small
          </Button>
          <Button variant="contained">Default / Medium</Button>
          <Button variant="contained" size="large">
            Large
          </Button>
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="outlined" size="small">
            Small
          </Button>
          <Button variant="outlined">Default / Medium</Button>
          <Button variant="outlined" size="large">
            Large
          </Button>
        </Stack>
      </Stack>
    </PresentationCard>
  );
}
