import { Outlet } from 'react-router-dom';

// @mui
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import GetImagePath from '@/utils/GetImagePath';

// @assets
import dashboardLightIcon from '@/assets/images/graphics/hosting/dashboard-light.svg';
import dashboardDarkIcon from '@/assets/images/graphics/hosting/dashboard-dark.svg';

const dashBoardImage = { light: dashboardLightIcon, dark: dashboardDarkIcon };

/***************************  AUTH LAYOUT  ***************************/

export default function AuthLayout() {
  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid size={{ xs: 12, md: 6, lg: 7 }} sx={{ p: { xs: 3, sm: 7 } }}>
        <Outlet />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 5 }} sx={{ bgcolor: 'grey.100', pt: 7, display: { xs: 'none', md: 'block' } }}>
        <Stack sx={{ height: 1, justifyContent: 'space-between' }}>
          <Stack sx={{ alignItems: 'center', gap: 2, px: 3 }}>
            <Typography variant="body2" color="grey.700" align="center" sx={{ maxWidth: 400 }}>
              AI-powered ad management platform. Create campaigns, optimize performance, and scale your marketing with intelligent automation.
            </Typography>
          </Stack>
          <Box sx={{ pt: 6, pl: 6, height: 'calc(100% - 114px)' }}>
            <CardMedia
              image={GetImagePath(dashBoardImage)}
              sx={{
                height: 1,
                border: '4px solid',
                borderColor: 'grey.300',
                borderBottom: 'none',
                borderRight: 'none',
                backgroundPositionX: 'left',
                backgroundPositionY: 'top',
                borderTopLeftRadius: 24
              }}
            />
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
}
