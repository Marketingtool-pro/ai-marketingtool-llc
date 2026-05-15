// @mui
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  LABEL - SWITCH  ***************************/

export default function LabelSwitch() {
  return (
    <PresentationCard title="Label">
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap', ml: 1.25 }}>
        <FormGroup sx={{ gap: 2 }}>
          <FormControlLabel control={<Switch size="small" />} label="Label" />
          <FormControlLabel control={<Switch size="small" defaultChecked />} label="Label" />
          <FormControlLabel disabled control={<Switch size="small" />} label="Label" />
        </FormGroup>
        <FormGroup sx={{ gap: 2 }}>
          <FormControlLabel control={<Switch />} label="Label" />
          <FormControlLabel control={<Switch defaultChecked />} label="Label" />
          <FormControlLabel disabled control={<Switch />} label="Label" />
        </FormGroup>
        <FormGroup sx={{ gap: 2 }}>
          <FormControlLabel control={<Switch size="large" />} label="Label" />
          <FormControlLabel control={<Switch size="large" defaultChecked />} label="Label" />
          <FormControlLabel disabled control={<Switch size="large" />} label="Label" />
        </FormGroup>
      </Stack>
    </PresentationCard>
  );
}
