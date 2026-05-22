// @mui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import {
  BasicButton,
  BasicIconButton,
  Color,
  ColorIconButton,
  Disabled,
  DisabledIconButton,
  IconButtonSize,
  Size,
  WithIcon
} from '@/sections/components/button';

/***************************  INPUTS - BUTTON  ***************************/

export default function InputsButton() {
  return (
    <ComponentsWrapper title="Button">
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, sm: 5.5, md: 6 }}>
          <Stack sx={{ gap: { xs: 2, sm: 3 } }}>
            <BasicButton />
            <Disabled />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 6.5, md: 6 }}>
          <Size />
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Color />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <WithIcon />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <BasicIconButton />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DisabledIconButton />
        </Grid>
        <Grid size={{ xs: 12, sm: 7, md: 6 }}>
          <ColorIconButton />
        </Grid>
        <Grid size={{ xs: 12, sm: 5, md: 6 }}>
          <IconButtonSize />
        </Grid>
      </Grid>
    </ComponentsWrapper>
  );
}
