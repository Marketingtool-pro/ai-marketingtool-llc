// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  BUTTON - DISABLED  ***************************/

export default function Disabled() {
  return (
    <PresentationCard title="Disabled & Loading">
      <Stack sx={{ gap: 2.5 }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button disabled>Text</Button>
          <Button disabled variant="contained">
            Contained
          </Button>
          <Button disabled variant="outlined">
            Outlined
          </Button>
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button loading loadingPosition="start">
            Text
          </Button>
          <Button variant="contained" loading>
            Contained
          </Button>
          <Button variant="outlined" loading loadingPosition="end">
            Outlined
          </Button>
        </Stack>
      </Stack>
    </PresentationCard>
  );
}
