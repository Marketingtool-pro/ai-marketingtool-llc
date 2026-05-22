// @mui
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  LABEL POSITION - SWITCH  ***************************/

export default function LabelPositionSwitch() {
  return (
    <PresentationCard title="Label Position">
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormGroup sx={{ gap: 2, ml: -2 }}>
          <FormControlLabel control={<Switch size="small" />} label="Label" labelPlacement="start" />
          <FormControlLabel control={<Switch size="small" defaultChecked />} label="Label" labelPlacement="start" />
          <FormControlLabel disabled control={<Switch size="small" />} label="Label" labelPlacement="start" />
        </FormGroup>
        <FormGroup sx={{ gap: 2, ml: -2 }}>
          <FormControlLabel control={<Switch />} label="Label" labelPlacement="start" />
          <FormControlLabel control={<Switch defaultChecked />} label="Label" labelPlacement="start" />
          <FormControlLabel disabled control={<Switch />} label="Label" labelPlacement="start" />
        </FormGroup>
        <FormGroup sx={{ gap: 2, ml: -2 }}>
          <FormControlLabel control={<Switch size="large" />} label="Label" labelPlacement="start" />
          <FormControlLabel control={<Switch size="large" defaultChecked />} label="Label" labelPlacement="start" />
          <FormControlLabel disabled control={<Switch size="large" />} label="Label" labelPlacement="start" />
        </FormGroup>
      </Stack>
    </PresentationCard>
  );
}
