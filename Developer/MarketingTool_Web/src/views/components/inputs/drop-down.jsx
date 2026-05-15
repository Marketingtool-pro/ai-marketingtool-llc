// @mui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import PresentationCard from '@/components/cards/PresentationCard';
import { Autocomplete, Menu, Select, SelectCheckbox } from '@/sections/components/drop-down';

/***************************  INPUTS - DROP-DOWN  ***************************/

export default function InputsDropDown() {
  return (
    <ComponentsWrapper title="Drop Down">
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <PresentationCard title="Basic">
            <Stack sx={{ gap: 1.5, alignItems: 'flex-start' }}>
              <Autocomplete />
              <Menu />
              <Select />
              <SelectCheckbox />
            </Stack>
          </PresentationCard>
        </Grid>
      </Grid>
    </ComponentsWrapper>
  );
}
