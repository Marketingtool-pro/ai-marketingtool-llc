// @mui
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  CHECKBOX - COLOR  ***************************/

export default function Color() {
  return (
    <PresentationCard title="Color">
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <Checkbox defaultChecked color="primary" />
        <Checkbox defaultChecked color="secondary" />
        <Checkbox defaultChecked color="success" />
        <Checkbox defaultChecked color="error" />
        <Checkbox defaultChecked color="warning" />
        <Checkbox defaultChecked color="info" />
      </Stack>
    </PresentationCard>
  );
}
