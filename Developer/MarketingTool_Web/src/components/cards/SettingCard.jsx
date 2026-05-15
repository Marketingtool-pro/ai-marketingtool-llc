import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

// @project
import MainCard from '@/components/MainCard';
import Typeset from '@/components/Typeset';

/***************************   SETTING - CARDS  ***************************/

export default function SettingCard({ title, caption, children }) {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <MainCard sx={{ p: 0 }}>
      <Grid container>
        {/* ml put for grid manage because of divider */}
        <Grid size={{ xs: 12, md: 4 }} sx={{ ml: '-1px' }}>
          <Typeset heading={title} caption={caption} stackProps={{ sx: { p: { xs: 2, sm: 3 } } }} />
        </Grid>
        <Divider {...(!downMD ? { orientation: 'vertical', flexItem: true } : { sx: { width: 1 } })} />
        <Grid size={{ xs: 12, md: 8 }}>{children}</Grid>
      </Grid>
    </MainCard>
  );
}

SettingCard.propTypes = { title: PropTypes.string, caption: PropTypes.string, children: PropTypes.any };
