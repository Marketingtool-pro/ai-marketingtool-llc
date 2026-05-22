// @mui
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  COLOR - SWITCH  ***************************/

export default function ColorSwitch() {
  return (
    <PresentationCard title="Color">
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <Switch defaultChecked color="primary" />
        <Switch defaultChecked color="secondary" />
        <Switch defaultChecked color="success" />
        <Switch defaultChecked color="error" />
        <Switch defaultChecked color="warning" />
        <Switch defaultChecked color="info" />
      </Stack>
    </PresentationCard>
  );
}
