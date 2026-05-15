// @mui
import Grid from '@mui/material/Grid';

// @project
import PageAnimateWrapper from '@/components/PageAnimateWrapper';
import { FileUpload, AvatarUpload } from '@/sections/plugins/dropzone';

/***************************  PLUGINES - DROPZONE  ***************************/

export default function Dropzone() {
  return (
    <PageAnimateWrapper>
      <Grid container spacing={{ xs: 1.5, md: 2.5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FileUpload />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AvatarUpload />
        </Grid>
      </Grid>
    </PageAnimateWrapper>
  );
}
