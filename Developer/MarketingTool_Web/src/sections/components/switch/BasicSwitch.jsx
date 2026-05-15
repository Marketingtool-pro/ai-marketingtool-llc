// @mui
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  BASIC - SWITCH  ***************************/

export default function BasicSwitch() {
  return (
    <PresentationCard title="Basic">
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <Switch />
        <Switch defaultChecked />
        <Switch disabled />
        <Switch disabled defaultChecked />
      </Stack>
    </PresentationCard>
  );
}
