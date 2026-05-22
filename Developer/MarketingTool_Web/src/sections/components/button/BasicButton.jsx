// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  BUTTON - BASIC  ***************************/

export default function BasicButton() {
  return (
    <PresentationCard title="Basic">
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button>Text</Button>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
      </Stack>
    </PresentationCard>
  );
}
