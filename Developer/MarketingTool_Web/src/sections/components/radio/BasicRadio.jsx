// @mui
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  BASIC - RADIO  ***************************/

export default function BasicRadio() {
  return (
    <PresentationCard title="Basic">
      <Stack sx={{ gap: 0.5 }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap', ml: -1 }}>
          <Radio />
          <Radio defaultChecked />
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap', ml: -1 }}>
          <Radio disabled />
          <Radio disabled defaultChecked />
        </Stack>
      </Stack>
    </PresentationCard>
  );
}
