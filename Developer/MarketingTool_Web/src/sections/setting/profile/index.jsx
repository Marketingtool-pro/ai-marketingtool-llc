// @mui
import Grid from '@mui/material/Grid';

// @project
import ProfileDetails from './ProfileDetails';
import ProfileLoginService from './ProfileLoginService';
import ProfilePreferredLanguage from './ProfilePreferredLanguage';
import ProfileTimezone from './ProfileTimezone';
import PageAnimateWrapper from '@/components/PageAnimateWrapper';

/***************************  SETTING - PROFILE  ***************************/

export default function ProfileSetting() {
  return (
    <PageAnimateWrapper>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={12}>
          <ProfileDetails />
        </Grid>
        <Grid size={12}>
          <ProfileLoginService />
        </Grid>
        <Grid size={12}>
          <ProfilePreferredLanguage />
        </Grid>
        <Grid size={12}>
          <ProfileTimezone />
        </Grid>
      </Grid>
    </PageAnimateWrapper>
  );
}
