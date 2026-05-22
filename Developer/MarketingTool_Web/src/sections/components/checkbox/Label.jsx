// @mui
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  CHECKBOX - LABEL  ***************************/

export default function Label() {
  return (
    <PresentationCard title="Label">
      <Stack direction="row" sx={{ gap: 1.5, flexWrap: 'wrap' }}>
        <FormGroup sx={{ gap: 0.5 }}>
          <FormControlLabel control={<Checkbox size="small" />} label="Label" />
          <FormControlLabel control={<Checkbox size="small" defaultChecked />} label="Label" />
          <FormControlLabel control={<Checkbox size="small" indeterminate />} label="Label" />
        </FormGroup>
        <FormGroup sx={{ gap: 0.5 }}>
          <FormControlLabel control={<Checkbox />} label="Label" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
          <FormControlLabel control={<Checkbox indeterminate />} label="Label" />
        </FormGroup>
        <FormGroup sx={{ gap: 0.5 }}>
          <FormControlLabel control={<Checkbox size="large" />} label="Label" />
          <FormControlLabel control={<Checkbox size="large" defaultChecked />} label="Label" />
          <FormControlLabel control={<Checkbox size="large" indeterminate />} label="Label" />
        </FormGroup>
        <FormGroup sx={{ gap: 0.5 }}>
          <FormControlLabel disabled control={<Checkbox />} label="Label" />
          <FormControlLabel disabled control={<Checkbox defaultChecked />} label="Label" />
          <FormControlLabel disabled control={<Checkbox indeterminate />} label="Label" />
        </FormGroup>
      </Stack>
    </PresentationCard>
  );
}
