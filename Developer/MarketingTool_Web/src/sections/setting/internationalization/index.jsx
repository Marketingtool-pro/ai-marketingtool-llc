// @mui
import Grid from '@mui/material/Grid';

// @project
import PageAnimateWrapper from '@/components/PageAnimateWrapper';
import AddLanguage from '@/sections/setting/internationalization/AddLanguage';
import PublishedLanguage from '@/sections/setting/internationalization/PublishedLanguage';
import UnpublishedLanguage from '@/sections/setting/internationalization/UnpublishedLanguage';

/***************************  SETTING - INTERNATIONALIZATION   ***************************/

export default function InternationalizationSetting() {
  return (
    <PageAnimateWrapper>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={12}>
          <AddLanguage />
        </Grid>
        <Grid size={12}>
          <PublishedLanguage />
        </Grid>
        <Grid size={12}>
          <UnpublishedLanguage />
        </Grid>
      </Grid>
    </PageAnimateWrapper>
  );
}
