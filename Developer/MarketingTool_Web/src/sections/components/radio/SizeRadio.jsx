// @mui

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  SIZE - RADIO  ***************************/

export default function SizeRadio() {
  return (
    <PresentationCard title="Size">
      <RadioGroup row aria-labelledby="radio-group-size" defaultValue="small" name="radio-group-size" sx={{ ml: -1 }}>
        <Radio value="small" size="small" />
        <Radio value="default" />
        <Radio value="large" size="large" />
      </RadioGroup>
    </PresentationCard>
  );
}
