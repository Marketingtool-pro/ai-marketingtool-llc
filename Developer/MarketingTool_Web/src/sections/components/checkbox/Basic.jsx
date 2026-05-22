// @mui
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  CHECKBOX - BASIC  ***************************/

export default function Basic() {
  return (
    <PresentationCard title="Basic">
      <Stack sx={{ gap: 2.5 }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Checkbox />
          <Checkbox checked />
          <Checkbox indeterminate />
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Checkbox disabled />
          <Checkbox disabled checked />
          <Checkbox disabled indeterminate />
        </Stack>
      </Stack>
    </PresentationCard>
  );
}
