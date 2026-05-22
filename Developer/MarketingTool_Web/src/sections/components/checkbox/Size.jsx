// @mui
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  CHECKBOX - SIZE  ***************************/

export default function Size() {
  return (
    <PresentationCard title="Size">
      <Stack sx={{ gap: 0.5 }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Checkbox size="small" />
          <Checkbox />
          <Checkbox size="large" />
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Checkbox checked size="small" />
          <Checkbox checked />
          <Checkbox checked size="large" />
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Checkbox indeterminate size="small" />
          <Checkbox indeterminate />
          <Checkbox indeterminate size="large" />
        </Stack>
      </Stack>
    </PresentationCard>
  );
}
