// @mui
import Grid from '@mui/material/Grid';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import { ColorAvatar, IconAvatar, ProfileAvatar, TextAvatar } from '@/sections/components/avatar';

/***************************  DATA DISPLAY - AVATAR  ***************************/

export default function DataDisplayAvatar() {
  return (
    <ComponentsWrapper title="Avatar">
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ProfileAvatar />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <IconAvatar />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextAvatar />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ColorAvatar />
        </Grid>
      </Grid>
    </ComponentsWrapper>
  );
}
