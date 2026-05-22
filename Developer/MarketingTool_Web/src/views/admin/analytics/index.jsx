import { useState, useEffect, useCallback } from 'react';

// @mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

// @assets
import {
  IconSparkles,
  IconTools,
  IconLayoutGrid,
  IconChartLine,
  IconChartPie,
  IconTrophy,
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandInstagram,
  IconBrandTiktok,
  IconWorld,
  IconArrowUpRight,
  IconArrowDownRight,
  IconRocket
} from '@tabler/icons-react';

// @project
import { useAuth } from '@/contexts/AuthContext';
import { fetchGenerationHistory } from '@/utils/api/windmill';

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS — matching web app glass theme
   ═══════════════════════════════════════════════════════════════ */

const G = {
  bg: 'rgba(30, 30, 35, 0.65)',
  surface: 'rgba(255,255,255,0.025)',
  border: 'rgba(255,255,255,0.06)',
  borderHover: 'rgba(255,255,255,0.12)',
  blur: 'blur(40px)',
  shadow: 'inset 2px 4px 16px 0px rgba(248,248,248,0.03)',
  radius: '24px',
};

const ACCENT = '#805AF5';

const platformMeta = {
  facebook: { icon: IconBrandFacebook, color: '#1877F2', label: 'Facebook' },
  meta: { icon: IconBrandFacebook, color: '#1877F2', label: 'Meta' },
  google: { icon: IconBrandGoogle, color: '#EA4335', label: 'Google' },
  instagram: { icon: IconBrandInstagram, color: '#E4405F', label: 'Instagram' },
  tiktok: { icon: IconBrandTiktok, color: '#010101', label: 'TikTok' },
  website: { icon: IconWorld, color: '#22c55e', label: 'Website' },
  shopify: { icon: IconWorld, color: '#96bf48', label: 'Shopify' },
};

/* ═══════════════════════════════════════════════════════════════
   GLASS CARD
   ═══════════════════════════════════════════════════════════════ */

function GlassCard({ children, sx = {} }) {
  return (
    <Box sx={{
      bgcolor: G.bg, backdropFilter: G.blur, WebkitBackdropFilter: G.blur,
      border: `1px solid ${G.border}`, borderRadius: G.radius,
      boxShadow: G.shadow, overflow: 'hidden',
      transition: 'all 0.3s ease',
      '&:hover': { borderColor: G.borderHover },
      ...sx,
    }}>
      {children}
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════════
   KPI CARD
   ═══════════════════════════════════════════════════════════════ */

function KpiCard({ label, value, icon: Icon, color, delay = 0 }) {
  return (
    <GlassCard sx={{ p: 3, position: 'relative', overflow: 'hidden', animation: `slideUp 400ms ease-out ${delay}ms both`,
      '@keyframes slideUp': { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
    }}>
      <Box sx={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(248,248,248,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>{label}</Typography>
          <Typography sx={{ fontSize: '1.6rem', fontWeight: 900, color: 'rgba(248,248,248,0.92)', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</Typography>
        </Box>
        <Box sx={{
          width: 44, height: 44, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `linear-gradient(135deg, ${color}25, ${color}08)`, border: `1px solid ${color}20`,
          boxShadow: `0 0 24px ${color}12`,
        }}>
          <Icon size={20} style={{ color }} />
        </Box>
      </Stack>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIMPLE BAR CHART (CSS only — no library needed)
   ═══════════════════════════════════════════════════════════════ */

function UsageChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: 280, gap: 1.5 }}>
        <IconChartLine size={32} style={{ color: 'rgba(248,248,248,0.1)' }} />
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(248,248,248,0.35)' }}>No usage data yet</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(248,248,248,0.2)' }}>Start using AI tools to see your usage chart</Typography>
      </Stack>
    );
  }

  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <Stack direction="row" sx={{ alignItems: 'flex-end', gap: '3px', height: 280, px: 1, pt: 2, pb: 4, position: 'relative' }}>
      {/* Y axis line */}
      <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 32, width: 1, bgcolor: 'rgba(255,255,255,0.04)' }} />
      {/* X axis line */}
      <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 32, height: 1, bgcolor: 'rgba(255,255,255,0.04)' }} />

      {data.map((d, i) => {
        const pct = (d.count / max) * 100;
        const isToday = i === data.length - 1;
        return (
          <Box key={d.date} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
            <Box sx={{
              width: '100%', maxWidth: 24, borderRadius: '6px 6px 2px 2px',
              minHeight: 4, height: `${Math.max(pct, 2)}%`,
              background: isToday
                ? `linear-gradient(180deg, ${ACCENT}, ${ACCENT}80)`
                : `linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))`,
              boxShadow: isToday ? `0 0 12px ${ACCENT}30` : 'none',
              transition: 'height 0.6s ease-out',
              animation: `growUp 600ms ease-out ${i * 20}ms both`,
              '@keyframes growUp': { from: { height: 0 } },
            }} />
            {/* Show date label every 5th bar or last */}
            {(i % Math.max(Math.floor(data.length / 7), 1) === 0 || isToday) && (
              <Typography sx={{ fontSize: '0.5rem', color: 'rgba(248,248,248,0.2)', transform: 'rotate(-45deg)', whiteSpace: 'nowrap', mt: 0.5 }}>
                {d.date.slice(5)}
              </Typography>
            )}
          </Box>
        );
      })}
    </Stack>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PLATFORM DONUT (CSS only)
   ═══════════════════════════════════════════════════════════════ */

function PlatformBreakdown({ breakdown }) {
  const entries = Object.entries(breakdown).sort(([, a], [, b]) => b - a);
  const total = entries.reduce((sum, [, v]) => sum + v, 0) || 1;

  if (entries.length === 0) {
    return (
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: 280, gap: 1.5 }}>
        <IconChartPie size={32} style={{ color: 'rgba(248,248,248,0.1)' }} />
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(248,248,248,0.35)' }}>No platform data</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={2} sx={{ py: 2 }}>
      {entries.map(([platform, count], i) => {
        const meta = platformMeta[platform] || { icon: IconWorld, color: '#64748b', label: platform };
        const PIcon = meta.icon;
        const pct = ((count / total) * 100).toFixed(0);
        return (
          <Box key={platform} sx={{ px: 1, animation: `slideUp 400ms ease-out ${i * 60}ms both` }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${meta.color}15`, border: `1px solid ${meta.color}20` }}>
                  <PIcon size={14} style={{ color: meta.color }} />
                </Box>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(248,248,248,0.75)', textTransform: 'capitalize' }}>{meta.label}</Typography>
              </Stack>
              <Stack direction="row" sx={{ alignItems: 'baseline', gap: 0.75 }}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: 'rgba(248,248,248,0.92)' }}>{count}</Typography>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(248,248,248,0.3)' }}>{pct}%</Typography>
              </Stack>
            </Stack>
            <Box sx={{ height: 5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
              <Box sx={{
                height: '100%', borderRadius: 3, width: `${pct}%`,
                background: `linear-gradient(90deg, ${meta.color}, ${meta.color}80)`,
                boxShadow: `0 0 8px ${meta.color}20`,
                transition: 'width 0.8s ease-out',
                animation: `growWidth 800ms ease-out ${i * 100}ms both`,
                '@keyframes growWidth': { from: { width: 0 } },
              }} />
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOADING SKELETON
   ═══════════════════════════════════════════════════════════════ */

function AnalyticsSkeleton() {
  return (
    <Stack spacing={3} sx={{ maxWidth: 1920, mx: 'auto', width: '100%' }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Box><Skeleton width={180} height={32} /><Skeleton width={250} height={18} sx={{ mt: 0.5 }} /></Box>
        <Skeleton width={200} height={36} variant="rounded" />
      </Stack>
      <Grid container spacing={2.5}>
        {[0, 1, 2].map(i => (
          <Grid key={i} size={{ xs: 12, sm: 4 }}>
            <Skeleton variant="rounded" height={110} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 8 }}><Skeleton variant="rounded" height={340} sx={{ borderRadius: 3 }} /></Grid>
        <Grid size={{ xs: 12, lg: 4 }}><Skeleton variant="rounded" height={340} sx={{ borderRadius: 3 }} /></Grid>
      </Grid>
      <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
    </Stack>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════════════════ */

function EmptyState() {
  return (
    <Stack sx={{ maxWidth: 1920, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: 'rgba(248,248,248,0.92)', letterSpacing: '-0.02em' }}>Analytics</Typography>
        <Typography sx={{ fontSize: '0.85rem', color: 'rgba(248,248,248,0.35)' }}>0 generations in selected period</Typography>
      </Box>

      {/* KPIs at zero */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}><KpiCard label="Total Generations" value="0" icon={IconSparkles} color="#0075ff" delay={0} /></Grid>
        <Grid size={{ xs: 12, sm: 4 }}><KpiCard label="Unique Tools Used" value="0" icon={IconTools} color="#8b5cf6" delay={80} /></Grid>
        <Grid size={{ xs: 12, sm: 4 }}><KpiCard label="Platforms Active" value="0" icon={IconLayoutGrid} color="#01b574" delay={160} /></Grid>
      </Grid>

      {/* Empty charts */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <GlassCard>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1, px: 3, py: 2, borderBottom: `1px solid ${G.border}` }}>
              <IconChartLine size={15} style={{ color: ACCENT }} />
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: 'rgba(248,248,248,0.92)' }}>Usage Over Time</Typography>
            </Stack>
            <Box sx={{ p: 3 }}>
              <UsageChart data={[]} />
            </Box>
          </GlassCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <GlassCard>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1, px: 3, py: 2, borderBottom: `1px solid ${G.border}` }}>
              <IconChartPie size={15} style={{ color: '#8b5cf6' }} />
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: 'rgba(248,248,248,0.92)' }}>Platform Breakdown</Typography>
            </Stack>
            <Box sx={{ p: 3 }}>
              <PlatformBreakdown breakdown={{}} />
            </Box>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Empty top tools */}
      <GlassCard>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1, px: 3, py: 2, borderBottom: `1px solid ${G.border}` }}>
          <IconTrophy size={15} style={{ color: '#f59e0b' }} />
          <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: 'rgba(248,248,248,0.92)' }}>Top Tools</Typography>
        </Stack>
        <Stack sx={{ alignItems: 'center', justifyContent: 'center', py: 8, gap: 1.5 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.04)', border: `1px solid ${G.border}` }}>
            <IconTools size={24} style={{ color: 'rgba(248,248,248,0.15)' }} />
          </Box>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(248,248,248,0.55)' }}>No tool usage data yet</Typography>
          <Button href="/chat" variant="contained" size="small" startIcon={<IconRocket size={14} />}
            sx={{ mt: 1, borderRadius: 2.5, px: 3, py: 0.75, fontSize: '0.75rem', fontWeight: 700, textTransform: 'none',
              background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT}cc)`, '&:hover': { background: `linear-gradient(135deg, ${ACCENT}dd, ${ACCENT}aa)` }
            }}>
            Start Using Tools
          </Button>
        </Stack>
      </GlassCard>
    </Stack>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANALYTICS PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generations, setGenerations] = useState([]);
  const [range, setRange] = useState('30d');

  const fetchData = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetchGenerationHistory({ userId: user.id, limit: 500 });
      setGenerations(res?.generations || res?.history || []);
    } catch (err) {
      console.error('Analytics fetch error:', err);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { if (user?.id) fetchData(); }, [user?.id, fetchData]);

  if (loading) return <AnalyticsSkeleton />;

  // Filter by range
  const now = Date.now();
  const filteredGens = generations.filter(g => {
    if (range === 'all') return true;
    const days = range === '7d' ? 7 : 30;
    return now - new Date(g.created_at || g.$createdAt || '').getTime() < days * 86400000;
  });

  // Platform breakdown
  const platformBreakdown = {};
  filteredGens.forEach(g => {
    const p = g.platform || g.engine || 'website';
    platformBreakdown[p] = (platformBreakdown[p] || 0) + 1;
  });

  // Daily usage
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const dailyUsage = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = filteredGens.filter(g => (g.created_at || g.$createdAt || '').split('T')[0] === dateStr).length;
    dailyUsage.push({ date: dateStr, count });
  }

  // Top tools
  const toolCounts = {};
  filteredGens.forEach(g => {
    const slug = g.tool_slug || g.toolSlug || 'unknown';
    if (!toolCounts[slug]) {
      toolCounts[slug] = { name: g.tool_name || g.toolName || slug, count: 0, platform: g.platform || g.engine || 'website' };
    }
    toolCounts[slug].count++;
  });
  const topTools = Object.entries(toolCounts).sort(([, a], [, b]) => b.count - a.count).slice(0, 10);

  // KPIs
  const totalGens = filteredGens.length;
  const uniqueTools = Object.keys(toolCounts).length;
  const platformsActive = Object.keys(platformBreakdown).length;

  const rangeLabels = { '7d': '7 Days', '30d': '30 Days', 'all': 'All Time' };

  // If no data at all, show empty state
  if (generations.length === 0 && !loading) return <EmptyState />;

  return (
    <Stack spacing={3} sx={{ maxWidth: 1920, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: 'rgba(248,248,248,0.92)', letterSpacing: '-0.02em' }}>Analytics</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: 'rgba(248,248,248,0.35)' }}>{filteredGens.length} generations in selected period</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {(['7d', '30d', 'all']).map(r => (
            <Button key={r} size="small" onClick={() => setRange(r)}
              sx={{
                px: 2, py: 0.75, borderRadius: 2.5, fontSize: '0.75rem', fontWeight: range === r ? 700 : 500, textTransform: 'none',
                bgcolor: range === r ? `${ACCENT}20` : 'rgba(255,255,255,0.03)',
                color: range === r ? ACCENT : 'rgba(248,248,248,0.45)',
                border: `1px solid ${range === r ? `${ACCENT}40` : G.border}`,
                '&:hover': { bgcolor: range === r ? `${ACCENT}25` : 'rgba(255,255,255,0.05)' },
              }}>
              {rangeLabels[r]}
            </Button>
          ))}
        </Stack>
      </Stack>

      {/* KPI Row */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 4 }}><KpiCard label="Total Generations" value={totalGens} icon={IconSparkles} color="#0075ff" delay={0} /></Grid>
        <Grid size={{ xs: 12, sm: 4 }}><KpiCard label="Unique Tools Used" value={uniqueTools} icon={IconTools} color="#8b5cf6" delay={80} /></Grid>
        <Grid size={{ xs: 12, sm: 4 }}><KpiCard label="Platforms Active" value={platformsActive} icon={IconLayoutGrid} color="#01b574" delay={160} /></Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2.5}>
        {/* Usage Over Time */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <GlassCard>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1, px: 3, py: 2, borderBottom: `1px solid ${G.border}` }}>
              <IconChartLine size={15} style={{ color: ACCENT }} />
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: 'rgba(248,248,248,0.92)' }}>Usage Over Time</Typography>
            </Stack>
            <Box sx={{ p: 3 }}>
              <UsageChart data={dailyUsage} />
            </Box>
          </GlassCard>
        </Grid>

        {/* Platform Breakdown */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <GlassCard>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1, px: 3, py: 2, borderBottom: `1px solid ${G.border}` }}>
              <IconChartPie size={15} style={{ color: '#8b5cf6' }} />
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: 'rgba(248,248,248,0.92)' }}>Platform Breakdown</Typography>
            </Stack>
            <Box sx={{ p: 3 }}>
              <PlatformBreakdown breakdown={platformBreakdown} />
            </Box>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Top Tools */}
      <GlassCard>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1, px: 3, py: 2, borderBottom: `1px solid ${G.border}` }}>
          <IconTrophy size={15} style={{ color: '#f59e0b' }} />
          <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: 'rgba(248,248,248,0.92)' }}>Top Tools</Typography>
        </Stack>
        {topTools.length > 0 ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(248,248,248,0.35)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', borderColor: G.border, py: 1.5, width: 40 }}>#</TableCell>
                  <TableCell sx={{ color: 'rgba(248,248,248,0.35)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', borderColor: G.border, py: 1.5 }}>Tool</TableCell>
                  <TableCell sx={{ color: 'rgba(248,248,248,0.35)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', borderColor: G.border, py: 1.5 }}>Platform</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(248,248,248,0.35)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', borderColor: G.border, py: 1.5 }}>Uses</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topTools.map(([slug, info], i) => {
                  const meta = platformMeta[info.platform] || { icon: IconWorld, color: '#64748b', label: info.platform };
                  const PIcon = meta.icon;
                  return (
                    <TableRow key={slug} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }, transition: 'background 0.2s' }}>
                      <TableCell sx={{ borderColor: G.border, py: 1.75 }}>
                        <Box sx={{ width: 22, height: 22, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.04)' }}>
                          <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(248,248,248,0.35)' }}>{i + 1}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderColor: G.border, py: 1.75 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(248,248,248,0.85)' }}>{info.name}</Typography>
                      </TableCell>
                      <TableCell sx={{ borderColor: G.border, py: 1.75 }}>
                        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 24, height: 24, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${meta.color}15`, border: `1px solid ${meta.color}20` }}>
                            <PIcon size={13} style={{ color: meta.color }} />
                          </Box>
                          <Typography sx={{ fontSize: '0.78rem', color: 'rgba(248,248,248,0.45)', textTransform: 'capitalize' }}>{meta.label}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right" sx={{ borderColor: G.border, py: 1.75 }}>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: 'rgba(248,248,248,0.92)' }}>{info.count}</Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Stack sx={{ alignItems: 'center', justifyContent: 'center', py: 8, gap: 1.5 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.04)', border: `1px solid ${G.border}` }}>
              <IconTools size={24} style={{ color: 'rgba(248,248,248,0.15)' }} />
            </Box>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(248,248,248,0.55)' }}>No tool usage data yet</Typography>
            <Button href="/chat" variant="contained" size="small" startIcon={<IconRocket size={14} />}
              sx={{ mt: 1, borderRadius: 2.5, px: 3, py: 0.75, fontSize: '0.75rem', fontWeight: 700, textTransform: 'none',
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT}cc)`, '&:hover': { background: `linear-gradient(135deg, ${ACCENT}dd, ${ACCENT}aa)` }
              }}>
              Start Using Tools
            </Button>
          </Stack>
        )}
      </GlassCard>
    </Stack>
  );
}
