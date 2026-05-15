import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { IconCrown, IconCheck } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const ACCENT = '#805AF5';

const DEFAULT_FEATURES = [
  'Unlimited campaign creation & management',
  'Real-time performance analytics & insights',
  'AI-powered optimization & automation'
];

export default function LockedPageOverlay({ featureName = 'Feature', featureDescription, features = DEFAULT_FEATURES }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)',
        width: '100%',
        p: 3,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 600,
          borderRadius: '24px',
          overflow: 'hidden',
          bgcolor: 'rgba(248,248,248,0.04)',
          backdropFilter: 'blur(50px)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'inset 2px 4px 16px 0px rgba(0,0,0,0.25)',
        }}
      >
        {/* Gradient accent top */}
        <Box
          sx={{
            height: 4,
            background: `linear-gradient(90deg, ${ACCENT}, #A78BFA, ${ACCENT})`,
          }}
        />

        <Stack spacing={3} sx={{ p: { xs: 4, sm: 5 }, alignItems: 'center', textAlign: 'center' }}>
          {/* Crown icon */}
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${ACCENT}20, ${ACCENT}08)`,
              border: `1px solid ${ACCENT}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconCrown size={36} color={ACCENT} />
          </Box>

          {/* Title + subtitle */}
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Unlock {featureName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto' }}>
              {featureDescription || `Upgrade to a paid plan to access ${featureName} and take your advertising to the next level.`}
            </Typography>
          </Box>

          {/* Feature bullets */}
          <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 380, textAlign: 'left' }}>
            {features.map((f, i) => (
              <Stack key={i} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: `${ACCENT}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconCheck size={14} color={ACCENT} />
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(248,248,248,0.75)' }}>{f}</Typography>
              </Stack>
            ))}
          </Stack>

          {/* Upgrade button */}
          <Button
            variant="contained"
            size="large"
            startIcon={<IconCrown size={20} />}
            onClick={() => navigate('/pricing')}
            sx={{
              mt: 1,
              px: 5,
              py: 1.5,
              borderRadius: '14px',
              fontWeight: 600,
              fontSize: '1rem',
              background: `linear-gradient(135deg, ${ACCENT}, #6C3AE0)`,
              boxShadow: `0 4px 20px ${ACCENT}40`,
              '&:hover': {
                background: `linear-gradient(135deg, #9370FF, ${ACCENT})`,
                boxShadow: `0 6px 28px ${ACCENT}50`,
              },
            }}
          >
            Upgrade to Pro
          </Button>

          <Typography variant="caption" color="text.disabled">
            Starting at $49/month — cancel anytime
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
