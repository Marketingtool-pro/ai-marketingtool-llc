import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
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
  IconBrandMeta,
  IconShieldCheck,
  IconLock,
  IconChartBar,
  IconRocket,
  IconCheck,
  IconStarFilled
} from '@tabler/icons-react';

const FB_APP_ID = '1582682256320433';
const FB_SCOPES = 'ads_read,ads_management,business_management,email';

/***************************  CONNECT ADS — MADGICX-STYLE  ***************************/

export default function ConnectAdsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('fb_ads_connected') === 'true') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleConnect = () => {
    setLoading(true);
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0a0a0f',
        backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(128,90,245,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(24,119,242,0.06) 0%, transparent 50%)',
        p: 3
      }}
    >
      <Box
        sx={{
          maxWidth: 920,
          width: '100%',
          display: 'flex',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
          minHeight: 520
        }}
      >
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
          {/* Decorative gradient orbs */}
          <Box sx={{ position: 'absolute', top: -80, right: -80, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(128,90,245,0.2) 0%, transparent 70%)' }} />
          <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(24,119,242,0.15) 0%, transparent 70%)' }} />

          <Stack sx={{ gap: 3, position: 'relative', zIndex: 1 }}>
            {/* Logo */}
            <Box component="img" src="/images/logo-transparent.png" alt="MarketingTool" sx={{ width: 48, height: 48 }} />

            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              The SuperApp
              <br />
              for Digital
              <br />
              Advertisers
            </Typography>

            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 280 }}>
              Manage, optimize, and scale your ad campaigns across Meta platforms from one dashboard.
            </Typography>
          </Stack>

          {/* Features list */}
          <Stack sx={{ gap: 2, position: 'relative', zIndex: 1 }}>
            {[
              { icon: IconChartBar, text: 'Real-time campaign analytics' },
              { icon: IconRocket, text: 'AI-powered optimization' },
              { icon: IconShieldCheck, text: 'Enterprise-grade security' }
            ].map((item, i) => (
              <Stack key={i} direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: 'rgba(128,90,245,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <item.icon size={16} color="#805AF5" />
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                  {item.text}
                </Typography>
              </Stack>
            ))}

            {/* Partner badges */}
            <Stack direction="row" sx={{ alignItems: 'center', gap: 2, mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                <IconBrandMeta size={16} color="rgba(255,255,255,0.4)" />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                  Meta Partner
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        {/* Right content panel */}
        <Box
          sx={{
            flex: 1,
            bgcolor: '#111118',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 5
          }}
        >
          <Stack sx={{ gap: 3.5, maxWidth: 400 }}>
            {/* Heading */}
            <Stack sx={{ gap: 1 }}>
              <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, letterSpacing: '-0.01em' }}>
                Connect Your Ad Account
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                This is to <strong style={{ color: 'rgba(255,255,255,0.8)' }}>sync your ad data</strong>. You will not be charged during your <strong style={{ color: '#805AF5' }}>7-day free trial</strong>.
              </Typography>
            </Stack>

            {/* Benefits checklist */}
            <Stack sx={{ gap: 1.5 }}>
              {[
                'Auto-sync all your ad accounts & campaigns',
                'Read-only access — we never modify your ads',
                'AI insights across all your ad spend',
                'Cancel anytime — no strings attached'
              ].map((text, i) => (
                <Stack key={i} direction="row" sx={{ alignItems: 'flex-start', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: 'rgba(62,183,94,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      mt: 0.2
                    }}
                  >
                    <IconCheck size={12} color="#3EB75E" stroke={3} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13.5, lineHeight: 1.5 }}>
                    {text}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            {/* Connect Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <IconBrandFacebook size={20} />}
              disabled={loading}
              onClick={handleConnect}
              sx={{
                bgcolor: '#1877F2',
                '&:hover': { bgcolor: '#1466D2', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(24,119,242,0.35)' },
                py: 1.6,
                fontSize: 15,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(24,119,242,0.25)'
              }}
            >
              {loading ? 'Connecting...' : 'Continue with Facebook'}
            </Button>

            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

            {/* Security note */}
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <IconLock size={14} color="rgba(255,255,255,0.3)" />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 11.5 }}>
                Guaranteed safe & secure connection
              </Typography>
            </Stack>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

            {/* Trust / Reviews */}
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', gap: 3 }}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <IconStarFilled key={s} size={12} color="#FFC107" />
                ))}
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', ml: 0.5, fontSize: 11 }}>
                  4.8 Rating
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)' }}>|</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                Trusted by 500+ advertisers
              </Typography>
            </Stack>

            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)', textAlign: 'center', fontSize: 10.5 }}>
              By connecting, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
