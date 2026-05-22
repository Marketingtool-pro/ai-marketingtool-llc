// @mui
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  SIZE - SWITCH  ***************************/

export default function SizeSwitch() {
  return (
    <PresentationCard title="Size">
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <Stack sx={{ gap: 2 }}>
          <Switch size="small" />
          <Switch size="small" defaultChecked />
          <Switch size="small" disabled />
        </Stack>
        <Stack sx={{ gap: 2 }}>
          <Switch />
          <Switch defaultChecked />
          <Switch disabled />
        </Stack>
        <Stack sx={{ gap: 2 }}>
          <Switch size="large" />
          <Switch size="large" defaultChecked />
          <Switch size="large" disabled />
        </Stack>
      </Stack>
    </PresentationCard>
  );
}
