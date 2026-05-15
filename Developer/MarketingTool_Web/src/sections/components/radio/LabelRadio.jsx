// @mui
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  LABLE - RADIO  ***************************/

export default function LabelRadio() {
  return (
    <PresentationCard title="Label">
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <RadioGroup aria-labelledby="radio-group-label-small" defaultValue={1} name="radio-group-label-small">
          <FormControlLabel control={<Radio value={0} size="small" />} label="Label" />
          <FormControlLabel control={<Radio value={1} size="small" />} label="Label" />
        </RadioGroup>
        <RadioGroup aria-labelledby="radio-group-label-default" defaultValue={1} name="radio-group-label-default">
          <FormControlLabel control={<Radio value={0} />} label="Label" />
          <FormControlLabel control={<Radio value={1} />} label="Label" />
        </RadioGroup>
        <RadioGroup aria-labelledby="radio-group-label-large" defaultValue={1} name="radio-group-label-large">
          <FormControlLabel control={<Radio value={0} size="large" />} label="Label" />
          <FormControlLabel control={<Radio value={1} size="large" />} label="Label" />
        </RadioGroup>
        <RadioGroup aria-labelledby="radio-group-label-disabled" defaultValue={1} name="radio-group-label-disabled">
          <FormControlLabel disabled control={<Radio value={0} />} label="Label" />
          <FormControlLabel disabled control={<Radio value={1} />} label="Label" />
        </RadioGroup>
      </Stack>
    </PresentationCard>
  );
}
