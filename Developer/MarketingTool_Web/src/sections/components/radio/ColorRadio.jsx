// @mui
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  COLOR - RADIO  ***************************/

export default function ColorRadio() {
  return (
    <PresentationCard title="Color">
      <RadioGroup row aria-labelledby="radio-group-color" defaultValue="primary" name="radio-group-color" sx={{ ml: -1 }}>
        <Radio value="primary" color="primary" />
        <Radio value="secondary" color="secondary" />
        <Radio value="success" color="success" />
        <Radio value="error" color="error" />
        <Radio value="warning" color="warning" />
        <Radio value="info" color="info" />
      </RadioGroup>
    </PresentationCard>
  );
}
