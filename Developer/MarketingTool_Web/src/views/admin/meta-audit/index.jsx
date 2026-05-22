import { useState, useCallback, useEffect } from 'react';

// @mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';

// @assets
import {
  IconShieldCheck,
  IconAlertTriangle,
  IconCircleCheck,
  IconChevronDown,
  IconChevronUp,
  IconDownload,
  IconRefresh,
  IconTargetArrow,
  IconCoin,
  IconPhoto,
  IconUsers,
  IconChartBar,
  IconArrowRight,
  IconTrendingUp,
  IconBolt,
  IconEye,
  IconLock,
  IconChecklist,
  IconFileAnalytics,
  IconRocket,
  IconClockHour4,
  IconFlame,
  IconSearch,
  IconChartLine,
  IconAdjustments
} from '@tabler/icons-react';

// @project
import { runMetaAudit } from '@/utils/api/windmill';
import { useAuth } from '@/contexts/AuthContext';

/***************************  DESIGN TOKENS  ***************************/

const ACCENT = '#805AF5';

const glass = {
  bg: 'rgba(10, 10, 14, 0.80)',
  border: '1px solid rgba(255,255,255,0.03)',
  blur: 'blur(40px)',
  shadow: 'inset 2px 4px 16px 0px rgba(0,0,0,0.25)',
  radius: 24,
  hoverBorder: 'rgba(255,255,255,0.07)',
};

const text = {
  primary: 'rgba(248,248,248,0.92)',
  secondary: 'rgba(248,248,248,0.55)',
  muted: 'rgba(248,248,248,0.35)',
  accent: ACCENT,
};

/***************************  AUDIT CATEGORIES  ***************************/

const AUDIT_CATEGORIES = [
  { key: 'accountHealth', name: 'Account Health', icon: IconShieldCheck, desc: 'Business Manager setup, verification & payment' },
  { key: 'campaignPerformance', name: 'Campaigns', icon: IconChartBar, desc: 'CPA trends, ROAS & campaign structure' },
  { key: 'adCreative', name: 'Ad Creative', icon: IconPhoto, desc: 'Fatigue, format diversity & A/B testing' },
  { key: 'audienceTargeting', name: 'Audiences', icon: IconUsers, desc: 'Overlap, custom audiences & exclusions' },
  { key: 'budgetBidding', name: 'Budget & Bids', icon: IconCoin, desc: 'Spend utilization, bid strategy & pacing' },
  { key: 'conversionTracking', name: 'Conversions', icon: IconTargetArrow, desc: 'Pixel health, CAPI & attribution' }
];

const SEVERITY_MAP = {
  critical: { icon: IconFlame, label: 'Critical' },
  warning: { icon: IconAlertTriangle, label: 'Warning' },
  passed: { icon: IconCircleCheck, label: 'Passed' }
};

/***************************  GLASS CARD WRAPPER  ***************************/

function GlassCard({ children, sx = {}, hover = false, ...props }) {
  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: `${glass.radius}px`,
        border: glass.border,
        background: glass.bg,
        backdropFilter: glass.blur,
        WebkitBackdropFilter: glass.blur,
        boxShadow: glass.shadow,
        overflow: 'hidden',
        transition: 'border-color 0.25s ease, transform 0.25s ease',
        ...(hover && {
          '&:hover': { borderColor: glass.hoverBorder, transform: 'translateY(-2px)' }
        }),
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/***************************  SCORE GAUGE  ***************************/

function ScoreGauge({ score, size = 180 }) {
  const label = score >= 80 ? 'Excellent' : score >= 50 ? 'Needs Work' : 'Critical';
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.2" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="url(#gauge-grad)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
      </svg>
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ fontWeight: 700, color: text.primary, fontSize: size > 150 ? '2.8rem' : '2rem', lineHeight: 1, fontFamily: '"DM Sans", sans-serif' }}>{score}</Typography>
        <Typography sx={{ color: text.muted, mt: 0.5, fontSize: '0.7rem', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</Typography>
      </Box>
    </Box>
  );
}

/***************************  CATEGORY SCORE CARD  ***************************/

function CategoryScoreCard({ catKey, name, score }) {
  const catMeta = AUDIT_CATEGORIES.find((c) => c.key === catKey) || AUDIT_CATEGORIES[0];
  const Icon = catMeta.icon;

  return (
    <GlassCard hover sx={{ height: '100%' }}>
      <Box sx={{ p: 2.5 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '10px',
            bgcolor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon size={17} style={{ color: text.secondary }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: text.primary, fontFamily: '"DM Sans", sans-serif' }}>{score}</Typography>
        </Stack>
        <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: text.primary, mb: 0.75 }}>{name}</Typography>
        <LinearProgress
          variant="determinate"
          value={score}
          sx={{
            height: 4, borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.04)',
            '& .MuiLinearProgress-bar': { bgcolor: ACCENT, borderRadius: 2, opacity: 0.85 }
          }}
        />
      </Box>
    </GlassCard>
  );
}

/***************************  ISSUE ROW  ***************************/

function IssueRow({ issue }) {
  const [expanded, setExpanded] = useState(false);
  const sev = SEVERITY_MAP[issue.severity] || SEVERITY_MAP.warning;
  const Icon = sev.icon;

  return (
    <Box
      sx={{
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.04)',
        transition: 'all 0.2s',
        '&:hover': { borderColor: 'rgba(255,255,255,0.08)', bgcolor: 'rgba(255,255,255,0.02)' }
      }}
    >
      <Stack
        direction="row"
        onClick={() => issue.fix && setExpanded(!expanded)}
        sx={{ alignItems: 'center', gap: 2, p: 2, cursor: issue.fix ? 'pointer' : 'default', userSelect: 'none' }}
      >
        <Box sx={{
          width: 36, height: 36, borderRadius: '10px',
          bgcolor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Icon size={16} style={{ color: text.secondary }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.25, flexWrap: 'wrap' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: text.primary }}>{issue.title}</Typography>
            <Chip
              label={sev.label}
              size="small"
              sx={{
                height: 20, fontSize: '0.6rem', fontWeight: 700, letterSpacing: 0.5,
                bgcolor: 'rgba(255,255,255,0.04)',
                color: text.secondary,
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            />
          </Stack>
          <Typography sx={{ lineHeight: 1.6, fontSize: '0.8rem', color: text.secondary }}>{issue.description}</Typography>
        </Box>
        {issue.fix && (
          <IconButton size="small" sx={{ color: text.muted, flexShrink: 0 }}>
            {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
          </IconButton>
        )}
      </Stack>
      {issue.fix && (
        <Collapse in={expanded}>
          <Box sx={{ px: 2, pb: 2, pl: 7.5 }}>
            <Box sx={{ p: 2, borderRadius: '12px', bgcolor: `${ACCENT}08`, border: `1px solid ${ACCENT}15` }}>
              <Stack direction="row" sx={{ gap: 1, alignItems: 'center', mb: 1 }}>
                <IconBolt size={14} style={{ color: ACCENT }} />
                <Typography sx={{ fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.6rem' }}>
                  Recommended Fix
                </Typography>
              </Stack>
              <Typography sx={{ lineHeight: 1.7, fontSize: '0.8rem', color: text.secondary }}>{issue.fix}</Typography>
            </Box>
          </Box>
        </Collapse>
      )}
    </Box>
  );
}

/***************************  ACTION ITEM  ***************************/

function ActionItem({ rec, index }) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center', gap: 2.5, py: 2, px: 2,
        borderRadius: '16px', transition: 'background 0.15s',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
        borderBottom: '1px solid rgba(255,255,255,0.03)'
      }}
    >
      <Box sx={{
        width: 40, height: 40, borderRadius: '50%',
        bgcolor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <Typography sx={{ fontWeight: 700, color: text.secondary, fontSize: '0.8rem' }}>{index + 1}</Typography>
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: text.primary, mb: 0.25 }}>{rec.title}</Typography>
        <Typography sx={{ display: 'block', lineHeight: 1.5, fontSize: '0.75rem', color: text.secondary }}>{rec.description}</Typography>
      </Box>
      <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
        <Chip label={rec.impact} size="small" sx={{ height: 24, fontSize: '0.65rem', fontWeight: 600, color: text.secondary, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
        <Chip label={rec.effort} size="small" sx={{ height: 24, fontSize: '0.65rem', color: text.muted, bgcolor: 'transparent', border: '1px solid rgba(255,255,255,0.06)' }} />
      </Stack>
    </Stack>
  );
}

/***************************  LOADING ANIMATION  ***************************/

function AuditLoadingState() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < AUDIT_CATEGORIES.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ maxWidth: 1920, mx: 'auto', width: '100%' }}>
      <GlassCard>
        <Box sx={{ p: { xs: 3, md: 6 }, textAlign: 'center' }}>
          <Box sx={{ position: 'relative', width: 80, height: 80, mx: 'auto', mb: 3 }}>
            <CircularProgress size={80} thickness={1.5} sx={{ color: ACCENT, position: 'absolute', opacity: 0.7 }} />
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconShieldCheck size={32} style={{ color: text.secondary }} />
            </Box>
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.35rem', color: text.primary, mb: 1, fontFamily: '"DM Sans", sans-serif' }}>
            Running 360 Audit
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', color: text.secondary, mb: 4, maxWidth: 480, mx: 'auto', lineHeight: 1.6 }}>
            Analyzing 6 critical areas of your Meta ad account. This takes 15-30 seconds.
          </Typography>

          <Stack spacing={1.5} sx={{ maxWidth: 440, mx: 'auto', textAlign: 'left' }}>
            {AUDIT_CATEGORIES.map((cat, i) => {
              const CatIcon = cat.icon;
              const done = i < step;
              const active = i === step;
              return (
                <Stack
                  key={cat.name}
                  direction="row"
                  sx={{
                    alignItems: 'center', gap: 2, py: 1.25, px: 2, borderRadius: '14px',
                    bgcolor: active ? 'rgba(255,255,255,0.03)' : 'transparent',
                    border: `1px solid ${active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)'}`,
                    opacity: done || active ? 1 : 0.3,
                    transition: 'all 0.4s'
                  }}
                >
                  <Box sx={{
                    width: 32, height: 32, borderRadius: '8px',
                    bgcolor: done ? `${ACCENT}12` : 'rgba(255,255,255,0.03)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s'
                  }}>
                    {done ? <IconCircleCheck size={16} style={{ color: ACCENT }} /> : active ? <CircularProgress size={14} sx={{ color: ACCENT, opacity: 0.7 }} /> : <CatIcon size={15} style={{ color: text.muted }} />}
                  </Box>
                  <Typography sx={{ fontWeight: active ? 600 : 400, color: done || active ? text.primary : text.muted, flex: 1, fontSize: '0.88rem' }}>
                    {cat.name}
                  </Typography>
                  {done && <Typography sx={{ color: ACCENT, fontWeight: 600, fontSize: '0.72rem', opacity: 0.8 }}>Done</Typography>}
                  {active && <Typography sx={{ color: text.secondary, fontWeight: 500, fontSize: '0.72rem' }}>Analyzing...</Typography>}
                </Stack>
              );
            })}
          </Stack>
        </Box>
      </GlassCard>
    </Box>
  );
}

/***************************  CONNECT STATE  ***************************/

function ConnectState({ adAccountId, setAdAccountId, onRunAudit, error, setError }) {
  return (
    <Stack spacing={2.5} sx={{ maxWidth: 1920, mx: 'auto', width: '100%' }}>

      {/* Hero */}
      <GlassCard sx={{ position: 'relative' }}>
        {/* Subtle gradient orb */}
        <Box sx={{
          position: 'absolute', top: -120, right: -80, width: 350, height: 350, borderRadius: '50%',
          background: `radial-gradient(circle, ${ACCENT}0A 0%, transparent 70%)`,
          pointerEvents: 'none'
        }} />

        <Box sx={{ p: { xs: 3, md: 5 }, position: 'relative' }}>
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="META AUDIT"
                size="small"
                sx={{
                  mb: 2.5, height: 26, fontSize: '0.65rem', fontWeight: 700, letterSpacing: 1.5,
                  bgcolor: `${ACCENT}10`, color: ACCENT,
                  border: `1px solid ${ACCENT}20`,
                  borderRadius: '8px'
                }}
              />
              <Typography sx={{
                fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.4rem' }, lineHeight: 1.12,
                mb: 2, fontFamily: '"DM Sans", sans-serif', color: text.primary
              }}>
                Do You Really Know<br />
                <Box component="span" sx={{ color: ACCENT }}>Your Ad Account?</Box>
              </Typography>
              <Typography sx={{ mb: 3, lineHeight: 1.7, maxWidth: 500, fontSize: '0.95rem', color: text.secondary }}>
                Most advertisers only see the surface. Our 360 audit analyzes 6 critical areas — uncovering hidden issues silently burning your budget.
              </Typography>

              <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <TextField
                  placeholder="act_123456789"
                  value={adAccountId}
                  onChange={(e) => setAdAccountId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onRunAudit()}
                  size="medium"
                  sx={{
                    flex: 1, minWidth: 220, maxWidth: 340,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '14px',
                      bgcolor: 'rgba(255,255,255,0.03)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&.Mui-focused fieldset': { borderColor: ACCENT, borderWidth: 1 }
                    },
                    '& .MuiInputBase-input': { color: text.primary, fontSize: '0.9rem' }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={onRunAudit}
                  endIcon={<IconArrowRight size={18} />}
                  sx={{
                    height: 56, px: 4, borderRadius: '14px', whiteSpace: 'nowrap',
                    background: ACCENT, fontWeight: 600, fontSize: '0.9rem',
                    textTransform: 'none', letterSpacing: 0.3,
                    boxShadow: `0 8px 32px ${ACCENT}30`,
                    '&:hover': { background: '#6C47E0', boxShadow: `0 12px 40px ${ACCENT}40` }
                  }}
                >
                  Run Audit
                </Button>
              </Stack>
              {error && <Alert severity="error" sx={{ mt: 2, maxWidth: 500, borderRadius: '12px' }} onClose={() => setError(null)}>{error}</Alert>}
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={2.5}>
                {[
                  { icon: IconEye, label: 'Hidden blind spots', desc: 'Issues invisible in Ads Manager' },
                  { icon: IconTrendingUp, label: 'Performance leaks', desc: 'Wasted spend & missed opportunities' },
                  { icon: IconChecklist, label: 'Prioritized action plan', desc: 'Know exactly what to fix first' }
                ].map((item) => {
                  const F = item.icon;
                  return (
                    <Stack key={item.label} direction="row" sx={{ gap: 2, alignItems: 'center' }}>
                      <Box sx={{
                        width: 44, height: 44, borderRadius: '12px',
                        bgcolor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <F size={20} style={{ color: text.secondary }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: text.primary }}>{item.label}</Typography>
                        <Typography sx={{ fontSize: '0.78rem', color: text.muted }}>{item.desc}</Typography>
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </GlassCard>

      {/* 6 Category Cards */}
      <Grid container spacing={2}>
        {AUDIT_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Grid key={cat.key} size={{ xs: 6, sm: 4, lg: 2 }}>
              <GlassCard hover sx={{ height: '100%' }}>
                <Box sx={{ p: 2.5, textAlign: 'center' }}>
                  <Box sx={{
                    width: 48, height: 48, borderRadius: '14px',
                    bgcolor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 1.5
                  }}>
                    <Icon size={22} style={{ color: text.secondary }} />
                  </Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: text.primary, mb: 0.5 }}>{cat.name}</Typography>
                  <Typography sx={{ fontSize: '0.7rem', lineHeight: 1.45, color: text.muted }}>{cat.desc}</Typography>
                </Box>
              </GlassCard>
            </Grid>
          );
        })}
      </Grid>

      {/* How It Works */}
      <GlassCard>
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', mb: 3.5, textAlign: 'center', color: text.primary, fontFamily: '"DM Sans", sans-serif' }}>
            How It Works
          </Typography>
          <Grid container spacing={3}>
            {[
              { step: '01', title: 'Enter Account ID', desc: 'Paste your Meta Ad Account ID. We use read-only access — no changes to your account.' },
              { step: '02', title: 'AI Analyzes 6 Areas', desc: 'Our engine scans account health, campaigns, creative, targeting, budgets & tracking.' },
              { step: '03', title: 'Get Actionable Report', desc: 'Receive a scored report with critical issues, warnings & a prioritized action plan.' }
            ].map((item) => (
              <Grid key={item.step} size={{ xs: 12, md: 4 }}>
                <Stack sx={{ alignItems: 'center', textAlign: 'center' }}>
                  <Box sx={{
                    width: 52, height: 52, borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2
                  }}>
                    <Typography sx={{ fontWeight: 700, color: text.secondary, fontSize: '0.85rem', fontFamily: '"DM Sans", sans-serif', letterSpacing: 1 }}>{item.step}</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 700, mb: 0.75, fontSize: '0.95rem', color: text.primary }}>{item.title}</Typography>
                  <Typography sx={{ lineHeight: 1.6, maxWidth: 300, fontSize: '0.85rem', color: text.secondary }}>{item.desc}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>
      </GlassCard>

      {/* Stats */}
      <Grid container spacing={2}>
        {[
          { value: '73%', label: 'of accounts have critical pixel issues' },
          { value: '34%', label: 'average audience overlap found' },
          { value: '2.8x', label: 'ROAS improvement after fixes' },
          { value: '89%', label: 'of ad spend waste is recoverable' }
        ].map((stat) => (
          <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
            <GlassCard sx={{ textAlign: 'center' }}>
              <Box sx={{ p: 2.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1.75rem', color: text.primary, fontFamily: '"DM Sans", sans-serif', mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ fontSize: '0.72rem', lineHeight: 1.45, color: text.muted }}>
                  {stat.label}
                </Typography>
              </Box>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      {/* Common Issues */}
      <GlassCard>
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', mb: 0.5, color: text.primary, fontFamily: '"DM Sans", sans-serif' }}>
            Common Issues We Find
          </Typography>
          <Typography sx={{ mb: 3, fontSize: '0.85rem', color: text.muted }}>
            Most advertisers don't know these problems exist until they run an audit
          </Typography>
          <Grid container spacing={2}>
            {[
              { icon: IconTargetArrow, title: 'Broken Pixel Events', desc: 'Purchase events not firing on 30%+ of transactions, causing inaccurate ROAS reporting' },
              { icon: IconUsers, title: 'Audience Overlap', desc: 'Multiple ad sets competing against each other, inflating your CPMs by 15-30%' },
              { icon: IconPhoto, title: 'Creative Fatigue', desc: 'Ads with frequency above 3.5 burning budget on the same users repeatedly' },
              { icon: IconCoin, title: 'Budget Underspend', desc: 'Campaigns only using 40% of allocated budget due to narrow targeting or low bids' }
            ].map((issue) => {
              const IssueIcon = issue.icon;
              return (
                <Grid key={issue.title} size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" sx={{
                    gap: 2, p: 2, borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.04)',
                    transition: 'border-color 0.2s',
                    '&:hover': { borderColor: 'rgba(255,255,255,0.1)' }
                  }}>
                    <Box sx={{
                      width: 40, height: 40, borderRadius: '12px',
                      bgcolor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <IssueIcon size={18} style={{ color: text.secondary }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: text.primary, mb: 0.25 }}>{issue.title}</Typography>
                      <Typography sx={{ lineHeight: 1.55, fontSize: '0.78rem', color: text.muted }}>{issue.desc}</Typography>
                    </Box>
                  </Stack>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </GlassCard>

      {/* Trust bar */}
      <Stack direction="row" sx={{ gap: 4, justifyContent: 'center', flexWrap: 'wrap', py: 1 }}>
        {[
          { icon: IconLock, text: 'Read-only access' },
          { icon: IconClockHour4, text: '30 second analysis' },
          { icon: IconFileAnalytics, text: 'Exportable report' },
          { icon: IconRocket, text: 'Actionable fixes' }
        ].map((item) => {
          const TrustIcon = item.icon;
          return (
            <Stack key={item.text} direction="row" sx={{ gap: 0.75, alignItems: 'center' }}>
              <TrustIcon size={14} style={{ color: text.muted }} />
              <Typography sx={{ fontSize: '0.72rem', color: text.muted }}>{item.text}</Typography>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}

/***************************  RESULTS DASHBOARD  ***************************/

function ResultsDashboard({ auditResult, adAccountId, onExport, onReset }) {
  const [activeTab, setActiveTab] = useState(0);

  const score = auditResult?.score ?? 0;
  const issues = auditResult?.issues || [];
  const categories = auditResult?.categories || [];
  const recommendations = auditResult?.recommendations || [];

  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const passedCount = issues.filter((i) => i.severity === 'passed').length;

  const filteredIssues = activeTab === 0
    ? issues
    : activeTab === 1 ? issues.filter((i) => i.severity === 'critical')
    : activeTab === 2 ? issues.filter((i) => i.severity === 'warning')
    : issues.filter((i) => i.severity === 'passed');

  return (
    <Stack spacing={2.5} sx={{ maxWidth: 1920, mx: 'auto', width: '100%' }}>

      {/* Header */}
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: text.primary, fontFamily: '"DM Sans", sans-serif' }}>
            Audit Results
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: text.muted }}>
            {auditResult?.accountId || adAccountId} &middot; {new Date(auditResult?.auditDate || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            startIcon={<IconDownload size={15} />}
            onClick={onExport}
            sx={{
              borderRadius: '12px', textTransform: 'none', fontWeight: 600, fontSize: '0.82rem',
              color: text.secondary, border: '1px solid rgba(255,255,255,0.08)',
              '&:hover': { borderColor: 'rgba(255,255,255,0.15)', bgcolor: 'rgba(255,255,255,0.03)' }
            }}
          >
            Export
          </Button>
          <Button
            size="small"
            startIcon={<IconRefresh size={15} />}
            onClick={onReset}
            sx={{
              borderRadius: '12px', textTransform: 'none', fontWeight: 600, fontSize: '0.82rem',
              color: text.secondary, border: '1px solid rgba(255,255,255,0.08)',
              '&:hover': { borderColor: 'rgba(255,255,255,0.15)', bgcolor: 'rgba(255,255,255,0.03)' }
            }}
          >
            New Audit
          </Button>
        </Stack>
      </Stack>

      {/* Score + Quick Stats */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ height: '100%' }}>
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <ScoreGauge score={score} size={160} />
              <Typography sx={{ mt: 2, textAlign: 'center', maxWidth: 260, lineHeight: 1.6, fontSize: '0.82rem', color: text.secondary }}>
                {score >= 80
                  ? 'Your Meta account is well-optimized. Keep monitoring and testing.'
                  : score >= 50
                    ? 'Opportunities found. Address issues below to improve ROAS.'
                    : 'Critical issues detected. Fix immediately to stop wasting spend.'}
              </Typography>
            </Box>
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={2}>
            {[
              { label: 'Critical', value: criticalCount, icon: IconFlame, desc: 'Immediate action' },
              { label: 'Warnings', value: warningCount, icon: IconAlertTriangle, desc: 'Should fix soon' },
              { label: 'Passed', value: passedCount, icon: IconCircleCheck, desc: 'Looking good' },
              { label: 'Actions', value: recommendations.length, icon: IconRocket, desc: 'Prioritized fixes' }
            ].map((stat) => {
              const StatIcon = stat.icon;
              return (
                <Grid key={stat.label} size={{ xs: 6, sm: 3 }}>
                  <GlassCard sx={{ height: '100%' }}>
                    <Box sx={{ p: 2 }}>
                      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 1 }}>
                        <StatIcon size={14} style={{ color: text.muted }} />
                        <Typography sx={{ fontSize: '0.7rem', color: text.muted }}>{stat.label}</Typography>
                      </Stack>
                      <Typography sx={{ fontWeight: 700, fontSize: '1.75rem', color: text.primary, fontFamily: '"DM Sans", sans-serif' }}>{stat.value}</Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: text.muted }}>{stat.desc}</Typography>
                    </Box>
                  </GlassCard>
                </Grid>
              );
            })}

            <Grid size={{ xs: 12 }}>
              <GlassCard>
                <Box sx={{ p: 2.5 }}>
                  <Grid container spacing={2}>
                    {categories.map((cat) => (
                      <Grid key={cat.key || cat.name} size={{ xs: 6, sm: 4, md: 2 }}>
                        <CategoryScoreCard catKey={cat.key} name={cat.name} score={cat.score} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </GlassCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Issues */}
      <GlassCard>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: text.primary, fontFamily: '"DM Sans", sans-serif' }}>Issues & Findings</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: text.muted }}>{issues.length} checks</Typography>
          </Stack>

          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              mb: 2.5,
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              '& .MuiTab-root': { textTransform: 'none', minHeight: 40, fontSize: '0.82rem', fontWeight: 500, color: text.muted },
              '& .Mui-selected': { fontWeight: 700, color: `${text.primary} !important` },
              '& .MuiTabs-indicator': { backgroundColor: ACCENT, height: 2 }
            }}
          >
            <Tab label={`All (${issues.length})`} />
            <Tab label={`Critical (${criticalCount})`} />
            <Tab label={`Warnings (${warningCount})`} />
            <Tab label={`Passed (${passedCount})`} />
          </Tabs>

          <Stack spacing={1.5}>
            {filteredIssues.length > 0
              ? filteredIssues.map((issue, i) => <IssueRow key={i} issue={issue} />)
              : (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <IconCircleCheck size={32} style={{ color: text.muted }} />
                  <Typography sx={{ mt: 1, fontSize: '0.85rem', color: text.muted }}>No issues in this category</Typography>
                </Box>
              )}
          </Stack>
        </Box>
      </GlassCard>

      {/* Priority Action Plan */}
      {recommendations.length > 0 && (
        <GlassCard>
          <Box sx={{ p: 3 }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 2 }}>
              <IconRocket size={18} style={{ color: text.secondary }} />
              <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: text.primary, fontFamily: '"DM Sans", sans-serif' }}>Priority Action Plan</Typography>
            </Stack>
            <Stack>
              {recommendations.map((rec, i) => <ActionItem key={i} rec={rec} index={i} />)}
            </Stack>
          </Box>
        </GlassCard>
      )}
    </Stack>
  );
}

/***************************  META AUDIT PAGE  ***************************/

export default function MetaAuditPage() {
  const { user } = useAuth();
  const [adAccountId, setAdAccountId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auditResult, setAuditResult] = useState(null);

  const handleRunAudit = async () => {
    if (!adAccountId.trim()) {
      setError('Enter your Meta Ad Account ID (e.g. act_123456789)');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await runMetaAudit({ adAccountId: adAccountId.trim(), userId: user?.id || 'anonymous' });
      setAuditResult(result);
    } catch (err) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError') || err.message?.includes('ERR_CONNECTION')) {
        setError('Unable to connect to audit service. Please check your connection and try again.');
      } else {
        setError(err.message || 'Audit failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExport = useCallback(() => {
    if (!auditResult) return;
    const blob = new Blob([JSON.stringify(auditResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meta-audit-${auditResult.accountId || 'report'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [auditResult]);

  const handleReset = () => {
    setAuditResult(null);
    setAdAccountId('');
    setError(null);
  };

  if (loading) return <AuditLoadingState />;

  if (auditResult) {
    return (
      <ResultsDashboard
        auditResult={auditResult}
        adAccountId={adAccountId}
        onExport={handleExport}
        onReset={handleReset}
      />
    );
  }

  return (
    <ConnectState
      adAccountId={adAccountId}
      setAdAccountId={setAdAccountId}
      onRunAudit={handleRunAudit}
      error={error}
      setError={setError}
    />
  );
}
