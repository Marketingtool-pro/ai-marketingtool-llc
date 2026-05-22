import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @project
import Drawer from './Drawer';
import Header from './Header';
import ConnectAdsModal from '@/components/ConnectAdsModal';
import { handlerDrawerOpen, useGetMenuMaster } from '@/states/menu';
import Breadcrumbs from '@/components/Breadcrumbs';
import Loader from '@/components/Loader';
import { DRAWER_WIDTH } from '@/config';
import useConfig from '@/hooks/useConfig';
import { useAuth } from '@/contexts/AuthContext';

/***************************  ADMIN LAYOUT  ***************************/

export default function DashboardLayout() {
  const { menuMasterLoading } = useGetMenuMaster();
  const { user } = useAuth();
  const isAdmin = user?.email?.toLowerCase() === 'help@marketingtool.pro' || user?.name === 'testuser1';
  const {
    state: { miniDrawer }
  } = useConfig();

  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  const [showConnectAds, setShowConnectAds] = useState(() => localStorage.getItem('fb_ads_connected') !== 'true');

  // Listen for fb_ads_connected changes (after callback redirect)
  useEffect(() => {
    const checkConnection = () => {
      if (localStorage.getItem('fb_ads_connected') === 'true') {
        setShowConnectAds(false);
      }
    };
    window.addEventListener('storage', checkConnection);
    // Also check on focus (when returning from Facebook OAuth)
    window.addEventListener('focus', checkConnection);
    return () => {
      window.removeEventListener('storage', checkConnection);
      window.removeEventListener('focus', checkConnection);
    };
  }, []);

  // set drawer media and `miniDrawer` config wise
  useEffect(() => {
    if (!miniDrawer) {
      handlerDrawerOpen(!downXL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  return (
    <Stack direction="row" sx={{ width: 1 }}>
      {showConnectAds && !isAdmin && <ConnectAdsModal />}
      <Header />
      <Drawer />
      <Box component="main" sx={{ width: `calc(100% - ${DRAWER_WIDTH}px)`, flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar sx={{ minHeight: { xs: 54, sm: 46, md: 76 } }} />
        <Box
          sx={{
            py: 0.4,
            px: 1.5,
            mx: { xs: -2, sm: -3 },
            display: { xs: 'block', md: 'none' },
            borderBottom: 1,
            borderColor: 'divider',
            mb: 2
          }}
        >
          <Breadcrumbs />
        </Box>
        <Container maxWidth={false} sx={{ px: { xs: 0, sm: 2, md: 3, lg: 4 }, maxWidth: 1920 }}>
          <Outlet />
        </Container>
      </Box>
    </Stack>
  );
}
