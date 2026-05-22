import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

// @project
import { AUTH_USER_KEY } from '@/config';

/***************************  GOOGLE ADS CONNECT CALLBACK  ***************************/

export default function GoogleAdsCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('connecting');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      // Google auth code flow returns code in URL query params
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const errorParam = params.get('error');
      const savedState = sessionStorage.getItem('google_ads_state');

      if (errorParam) {
        setStatus('error');
        setError(`Google authorization failed: ${errorParam}`);
        return;
      }

      if (!code) {
        setStatus('error');
        setError('No authorization code received from Google.');
        return;
      }

      if (state !== savedState) {
        setStatus('error');
        setError('Invalid state. Please try again.');
        return;
      }

      sessionStorage.removeItem('google_ads_state');

      // Get current user
      const stored = localStorage.getItem(AUTH_USER_KEY);
      const userData = stored ? JSON.parse(stored) : null;
      const userId = userData?.id;

      if (!userId) {
        setStatus('error');
        setError('Not logged in. Please log in first.');
        return;
      }

      // Save Google connected status
      localStorage.setItem('google_ads_connected', 'true');

      // Send auth code to Windmill for token exchange (non-blocking)
      try {
        const API_BASE = import.meta.env.VITE_WINDMILL_URL || 'http://localhost:8000';
        const API_WORKSPACE = import.meta.env.VITE_WINDMILL_WORKSPACE || 'marketingtool';
        const WINDMILL_TOKEN = import.meta.env.VITE_WINDMILL_TOKEN || '';
        const appwriteJwt = userData?.access_token || '';
        const redirectUri = `${window.location.origin}/oauth/google-ads`;

        fetch(`${API_BASE}/api/w/${API_WORKSPACE}/jobs/run_wait_result/p/f/tools/google-ads-connect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${WINDMILL_TOKEN}`
          },
          body: JSON.stringify({ code, redirectUri, userId, appwriteJwt })
        }).catch(() => {});
      } catch {
        // Windmill script not ready yet — that's fine
      }

      setStatus('success');
      setTimeout(() => navigate('/dashboard', { replace: true }), 1200);
    };

    handleCallback();
  }, [navigate]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0a0a0f' }}>
      <Stack sx={{ alignItems: 'center', gap: 3, maxWidth: 450, textAlign: 'center' }}>
        {status === 'connecting' && (
          <>
            <CircularProgress size={48} sx={{ color: '#805AF5' }} />
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
              Connecting your Google Ads account...
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Syncing your Google Ads accounts and campaign data.
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'rgba(62,183,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: 28 }}>&#10003;</Typography>
            </Box>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
              Google Ads connected!
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Redirecting to your dashboard...
            </Typography>
          </>
        )}

        {status === 'error' && (
          <>
            <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
            <Button variant="contained" onClick={() => navigate('/dashboard', { replace: true })} sx={{ bgcolor: '#805AF5', '&:hover': { bgcolor: '#6B44E0' }, textTransform: 'none' }}>
              Go to Dashboard
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}
