import { useState, useCallback } from 'react';

// @mui
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';

// @assets
import {
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandMeta,
  IconShieldCheck,
  IconChartBar,
  IconRocket,
  IconCheck,
  IconLock,
  IconLogout,
  IconStarFilled
} from '@tabler/icons-react';

// @project
import { logout } from '@/utils/api/auth';
import { AUTH_USER_KEY } from '@/config';

const FB_APP_ID = '1582682256320433';
const FB_SCOPES = 'ads_read,ads_management,business_management,pages_read_engagement,pages_manage_ads,pages_show_list,pages_manage_metadata,instagram_basic,instagram_manage_insights,instagram_content_publish,instagram_manage_comments,read_insights,catalog_management,leads_retrieval,email';

const GOOGLE_CLIENT_ID = '911925145433-lnqjvdu44j1krdoq95eqpf3rjo4sf6vv.apps.googleusercontent.com';
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/adwords https://www.googleapis.com/auth/adsense https://www.googleapis.com/auth/adsense.readonly https://www.googleapis.com/auth/analytics.manage.users https://www.googleapis.com/auth/adsdartsearch https://www.googleapis.com/auth/doubleclicksearch https://www.googleapis.com/auth/adsdatahub https://www.googleapis.com/auth/realtime-bidding https://www.googleapis.com/auth/service.management email profile';

// Load Google Identity Services script
function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
}

/***************************  CONNECT ADS — HARD MODAL  ***************************/

export default function ConnectAdsModal() {
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  const handleConnectFacebook = () => {
    setLoading('facebook');
    setError('');

    const redirectUri = `${window.location.origin}/oauth/facebook-ads`;
    const state = crypto.randomUUID();
    sessionStorage.setItem('fb_ads_state', state);

    const authUrl =
      `https://www.facebook.com/v21.0/dialog/oauth?` +
      `client_id=${FB_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(FB_SCOPES)}` +
      `&state=${state}` +
      `&response_type=token`;

    window.location.href = authUrl;
  };

  // Google Ads connect — uses popup (no redirect URI registration needed)
  const handleConnectGoogle = useCallback(async () => {
    setLoading('google');
    setError('');

    try {
      await loadGoogleScript();

      const stored = localStorage.getItem(AUTH_USER_KEY);
      const userData = stored ? JSON.parse(stored) : null;
      const userId = userData?.id;

      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: GOOGLE_SCOPES,
        ux_mode: 'popup',
        callback: async (response) => {
          if (response.error) {
            setError(`Google connect failed: ${response.error}`);
            setLoading('');
            return;
          }

          localStorage.setItem('google_ads_connected', 'true');

          // Send auth code to Windmill for token exchange
          try {
            const API_BASE = import.meta.env.VITE_WINDMILL_URL || 'http://localhost:8000';
            const API_WORKSPACE = import.meta.env.VITE_WINDMILL_WORKSPACE || 'marketingtool';
            const WINDMILL_TOKEN = import.meta.env.VITE_WINDMILL_TOKEN || '';

            await fetch(`${API_BASE}/api/w/${API_WORKSPACE}/jobs/run_wait_result/p/f/tools/google-ads-connect`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${WINDMILL_TOKEN}` },
              body: JSON.stringify({ code: response.code, redirectUri: 'postmessage', userId, appwriteJwt: userData?.access_token || '' })
            });
          } catch { /* Windmill sync non-blocking */ }

          setLoading('');
          window.location.reload();
        }
      });

      client.requestCode();
    } catch (err) {
      setError(err?.message || 'Failed to connect Google Ads.');
      setLoading('');
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <Dialog
      open
      maxWidth={false}
      disableEscapeKeyDown
      slotProps={{ backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' } } }}
      PaperProps={{
        sx: {
          maxWidth: 920,
          width: '100%',
          borderRadius: 4,
          overflow: 'hidden',
          bgcolor: 'transparent',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
          m: 2
        }
      }}
    >
      <Box sx={{ display: 'flex', minHeight: 520 }}>
        {/* Left branded panel */}
        <Box
          sx={{
            width: 400,
            flexShrink: 0,
            background: 'linear-gradient(160deg, #1a0533 0%, #0d1b3e 40%, #0a1628 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 5,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'absolute', top: -80, right: -80, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(128,90,245,0.2) 0%, transparent 70%)' }} />
          <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(24,119,242,0.15) 0%, transparent 70%)' }} />

          <Stack sx={{ gap: 3, position: 'relative', zIndex: 1 }}>
            <Box component="img" src="/images/logo-transparent.png" alt="MarketingTool" sx={{ width: 48, height: 48 }} />
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              The SuperApp
              <br />
              for Digital
              <br />
              Advertisers
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 280 }}>
              Manage, optimize, and scale your ad campaigns across all platforms from one dashboard.
            </Typography>
          </Stack>

          <Stack sx={{ gap: 2, position: 'relative', zIndex: 1 }}>
            {[
              { icon: IconChartBar, text: 'Real-time campaign analytics' },
              { icon: IconRocket, text: 'AI-powered optimization' },
              { icon: IconShieldCheck, text: 'Enterprise-grade security' }
            ].map((item, i) => (
              <Stack key={i} direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: 'rgba(128,90,245,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon size={16} color="#805AF5" />
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{item.text}</Typography>
              </Stack>
            ))}

            <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <IconBrandMeta size={16} color="rgba(255,255,255,0.4)" />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Meta & Google Partner</Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Right content panel */}
        <Box sx={{ flex: 1, bgcolor: '#111118', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 5 }}>
          <Stack sx={{ gap: 3, maxWidth: 400 }}>
            <Stack sx={{ gap: 1 }}>
              <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, letterSpacing: '-0.01em' }}>
                Connect Your Ad Account
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                Connect your ad platform to <strong style={{ color: 'rgba(255,255,255,0.8)' }}>sync your ad data</strong>. You will not be charged during your <strong style={{ color: '#805AF5' }}>7-day free trial</strong>.
              </Typography>
            </Stack>

            <Stack sx={{ gap: 1.5 }}>
              {[
                'Auto-sync all your ad accounts & campaigns',
                'Read-only access — we never modify your ads',
                'AI insights across all your ad spend',
                'Cancel anytime — no strings attached'
              ].map((text, i) => (
                <Stack key={i} direction="row" sx={{ alignItems: 'flex-start', gap: 1.5 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'rgba(62,183,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2 }}>
                    <IconCheck size={12} color="#3EB75E" stroke={3} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13.5, lineHeight: 1.5 }}>{text}</Typography>
                </Stack>
              ))}
            </Stack>

            {/* Facebook Connect */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={loading === 'facebook' ? <CircularProgress size={18} color="inherit" /> : <IconBrandFacebook size={20} />}
              disabled={!!loading}
              onClick={handleConnectFacebook}
              sx={{
                bgcolor: '#1877F2',
                '&:hover': { bgcolor: '#1466D2', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(24,119,242,0.35)' },
                py: 1.5,
                fontSize: 15,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(24,119,242,0.25)'
              }}
            >
              {loading === 'facebook' ? 'Connecting...' : 'Connect Facebook & Instagram Ads'}
            </Button>

            {/* Google Connect */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={loading === 'google' ? <CircularProgress size={18} color="inherit" /> : <IconBrandGoogle size={20} />}
              disabled={!!loading}
              onClick={handleConnectGoogle}
              sx={{
                bgcolor: '#fff',
                color: '#1f1f1f',
                '&:hover': { bgcolor: '#f2f2f2', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(0,0,0,0.2)' },
                py: 1.5,
                fontSize: 15,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
              }}
            >
              {loading === 'google' ? 'Connecting...' : 'Connect Google Ads'}
            </Button>

            {error && <Alert severity="info" sx={{ borderRadius: 2 }}>{error}</Alert>}

            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <IconLock size={14} color="rgba(255,255,255,0.3)" />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 11.5 }}>Guaranteed safe & secure connection</Typography>
            </Stack>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <IconStarFilled key={s} size={12} color="#FFC107" />
                ))}
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', ml: 0.5, fontSize: 11 }}>4.8 Rating</Typography>
              </Stack>
              <Button
                size="small"
                startIcon={<IconLogout size={14} />}
                onClick={handleLogout}
                sx={{
                  color: 'rgba(255,255,255,0.35)',
                  textTransform: 'none',
                  fontSize: 12,
                  '&:hover': { color: 'rgba(255,255,255,0.7)', bgcolor: 'rgba(255,255,255,0.05)' }
                }}
              >
                Logout
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
}
