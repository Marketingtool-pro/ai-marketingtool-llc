import { motion } from 'motion/react';

// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';

// @assets
import {
  IconCheck, IconAlertTriangle, IconPlayerPause, IconPlayerPlay,
  IconArrowDown, IconArrowUp, IconBulb, IconRefresh,
  IconTrendingUp, IconTrendingDown, IconBrandGoogle, IconBrandFacebook,
  IconFlame, IconUsers, IconCurrencyDollar, IconTarget, IconChartBar,
  IconAB2, IconArrowRight, IconEye, IconClick, IconPercentage,
  IconTrophy, IconSkull, IconFilterBolt, IconReportAnalytics
} from '@tabler/icons-react';

/***************************  GLASS TOKENS  ***************************/

const glass = {
  surface: 'rgba(255,255,255,0.03)',
  surfaceHover: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderStrong: '1px solid rgba(255,255,255,0.1)',
};

/***************************  SHARED COMPONENTS  ***************************/

function Stagger({ children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay }}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ children, icon: Icon, color }) {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 2 }}>
      {Icon && (
        <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: color ? `${color}12` : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={14} color={color || 'rgba(255,255,255,0.4)'} />
        </Box>
      )}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 11.5, letterSpacing: 1.5, color: color || 'text.secondary' }}>
        {children}
      </Typography>
    </Stack>
  );
}

function MetricCard({ label, value, prefix = '', suffix = '', color, change, accent }) {
  const accentBg = accent ? `${accent}10` : glass.surface;
  const accentBorder = accent ? `1px solid ${accent}20` : glass.border;
  return (
    <Box sx={{ p: 2.5, borderRadius: 2.5, bgcolor: accentBg, border: accentBorder, minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, letterSpacing: 0.5, textTransform: 'capitalize', display: 'block', mb: 0.5 }}>
        {label.replace(/_/g, ' ')}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, color: color || 'text.primary', fontFamily: '"JetBrains Mono", monospace' }}>
        {prefix}{typeof value === 'number' ? value.toLocaleString() : String(value ?? '\u2014')}{suffix}
      </Typography>
      {change !== undefined && change !== null && (
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.25, mt: 0.5 }}>
          {change >= 0 ? <IconTrendingUp size={12} color="#3EB75E" /> : <IconTrendingDown size={12} color="#FF4757" />}
          <Typography variant="caption" sx={{ color: change >= 0 ? '#3EB75E' : '#FF4757', fontSize: 12, fontWeight: 600 }}>
            {change >= 0 ? '+' : ''}{change}%
          </Typography>
        </Stack>
      )}
    </Box>
  );
}

function MetricGrid({ children, columns = 'repeat(auto-fill, minmax(200px, 1fr))' }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: columns, gap: 2 }}>
      {children}
    </Box>
  );
}

function DataTable({ headers, rows, accentColor, highlightCol }) {
  return (
    <Box sx={{ borderRadius: 3, border: glass.border, overflow: 'hidden' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: `2fr ${headers.slice(1).map(() => '1fr').join(' ')}`, bgcolor: 'rgba(255,255,255,0.035)', px: 3, py: 1.5 }}>
        {headers.map((h, i) => (
          <Typography key={i} variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1.2, color: 'text.secondary', textAlign: i === 0 ? 'left' : 'right' }}>
            {h}
          </Typography>
        ))}
      </Box>
      {rows.map((row, ri) => (
        <motion.div key={ri} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + ri * 0.04 }}>
          <Box sx={{
            display: 'grid', gridTemplateColumns: `2fr ${row.slice(1).map(() => '1fr').join(' ')}`, px: 3, py: 1.75,
            borderTop: '1px solid rgba(255,255,255,0.03)',
            transition: 'background 0.15s',
            '&:hover': { bgcolor: glass.surfaceHover },
          }}>
            {row.map((cell, ci) => (
              <Typography key={ci} variant="body2" sx={{
                fontSize: 13.5, textAlign: ci === 0 ? 'left' : 'right',
                fontWeight: ci === highlightCol ? 700 : ci === 0 ? 600 : 400,
                color: ci === highlightCol ? (accentColor || 'primary.main') : 'text.primary',
                fontFamily: ci > 0 ? '"JetBrains Mono", monospace' : 'inherit',
              }}>
                {cell}
              </Typography>
            ))}
          </Box>
        </motion.div>
      ))}
      {rows.length === 0 && (
        <Box sx={{ px: 3, py: 5, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">No data available</Typography>
        </Box>
      )}
    </Box>
  );
}

function AIInsightsPanel({ text, title = 'AI Insights' }) {
  if (!text) return null;
  const content = typeof text === 'string' ? text : Array.isArray(text) ? text.join('\n') : String(text);
  const lines = content.split('\n').filter(Boolean);
  return (
    <Stagger delay={0.3}>
      <Box sx={{
        position: 'relative', borderRadius: 3, p: '2px',
        background: 'linear-gradient(135deg, rgba(128,90,245,0.5) 0%, rgba(27,162,219,0.35) 40%, rgba(62,183,94,0.35) 70%, rgba(255,200,118,0.3) 100%)',
      }}>
        <Box sx={{ bgcolor: 'rgba(8,8,12,0.94)', borderRadius: 3, p: 3.5 }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 2.5 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: 'rgba(128,90,245,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconBulb size={16} color="#805AF5" />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 14, letterSpacing: 0.3 }}>{title}</Typography>
          </Stack>
          <Stack spacing={1}>
            {lines.map((line, i) => (
              <Typography key={i} variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13.5, lineHeight: 1.8 }}>
                {line}
              </Typography>
            ))}
          </Stack>
        </Box>
      </Box>
    </Stagger>
  );
}

function WarningsPanel({ warnings }) {
  if (!warnings?.length) return null;
  return (
    <Stack spacing={1}>
      {warnings.map((w, i) => (
        <Alert key={i} severity="warning" icon={<IconAlertTriangle size={16} />} sx={{ borderRadius: 2, bgcolor: 'rgba(255,200,118,0.06)', border: '1px solid rgba(255,200,118,0.15)' }}>
          {typeof w === 'string' ? w : w.message || JSON.stringify(w)}
        </Alert>
      ))}
    </Stack>
  );
}

function GenericSummaryGrid({ summary, accent }) {
  if (!summary || typeof summary !== 'object') return null;
  const entries = Object.entries(summary).filter(([, v]) => v !== null && v !== undefined);
  if (entries.length === 0) return null;
  return (
    <MetricGrid>
      {entries.map(([key, value]) => {
        const isMoney = /spend|saving|budget|cost|cpa|revenue/.test(key);
        const isPct = /rate|pct|percentage|roas|ctr/.test(key);
        return (
          <MetricCard
            key={key}
            label={key}
            value={typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
            prefix={isMoney && typeof value === 'number' ? '$' : ''}
            suffix={isPct && typeof value === 'number' ? (key.includes('roas') ? 'x' : '%') : ''}
            accent={accent}
          />
        );
      })}
    </MetricGrid>
  );
}

function GenericActionsList({ actions, accent = '#805AF5' }) {
  if (!actions?.length) return null;
  const ICONS = {
    pause_keyword: { icon: IconPlayerPause, color: '#FFC876' },
    lower_bid: { icon: IconArrowDown, color: '#1BA2DB' },
    raise_bid: { icon: IconArrowUp, color: '#3EB75E' },
    pause_ad: { icon: IconPlayerPause, color: '#FFC876' },
    enable_ad: { icon: IconPlayerPlay, color: '#3EB75E' },
    create: { icon: IconPlayerPlay, color: accent },
    update: { icon: IconRefresh, color: '#1BA2DB' },
    pause: { icon: IconPlayerPause, color: '#FFC876' },
    scale: { icon: IconTrendingUp, color: '#3EB75E' },
    kill: { icon: IconSkull, color: '#FF4757' },
  };
  return (
    <Box>
      <SectionLabel icon={IconTarget} color={accent}>Actions ({actions.length})</SectionLabel>
      <Stack spacing={1}>
        {actions.map((action, i) => {
          const ac = ICONS[action.type] || { icon: IconRefresh, color: accent };
          const AIcon = ac.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.04 }}>
              <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: glass.surface, border: glass.border, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: `${ac.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AIcon size={16} color={ac.color} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.25 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: 13, textTransform: 'capitalize' }}>
                      {(action.type || 'action').replace(/_/g, ' ')}
                    </Typography>
                    {action.entity && (
                      <Typography variant="caption" sx={{ opacity: 0.35, fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5 }}>
                        {action.entity} {action.id || ''}
                      </Typography>
                    )}
                  </Stack>
                  {action.reason && <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>{action.reason}</Typography>}
                  {(action.from !== undefined && action.to !== undefined) && (
                    <Typography variant="caption" sx={{ color: ac.color, display: 'block', mt: 0.25, fontFamily: '"JetBrains Mono", monospace' }}>
                      {action.from} {'\u2192'} {action.to}
                    </Typography>
                  )}
                </Box>
              </Box>
            </motion.div>
          );
        })}
      </Stack>
    </Box>
  );
}

/***************************  1. GOOGLE SEARCH LAUNCH  ***************************/

const GOOGLE_BLUE = '#4285F4';

function GoogleSearchLaunchOutput({ output, formData }) {
  const campaign = output.campaign || {};
  const adGroups = output.ad_groups || [];
  const ads = output.ads || [];

  return (
    <Stack spacing={3.5}>
      {/* KPI Strip */}
      <Stagger>
        <GenericSummaryGrid summary={output.summary} accent={GOOGLE_BLUE} />
      </Stagger>

      {/* Campaign Structure */}
      {(campaign.name || campaign.type) && (
        <Stagger delay={0.08}>
          <SectionLabel icon={IconBrandGoogle} color={GOOGLE_BLUE}>Campaign Blueprint</SectionLabel>
          <Box sx={{ p: 2.5, borderRadius: 2.5, bgcolor: glass.surface, border: `1px solid ${GOOGLE_BLUE}18`, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', bgcolor: GOOGLE_BLUE, borderRadius: '3px 0 0 3px' }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 2, pl: 1.5 }}>
              {[
                { label: 'Campaign', value: campaign.name },
                { label: 'Type', value: campaign.type || 'Search' },
                { label: 'Bid Strategy', value: campaign.bid_strategy },
                { label: 'Networks', value: campaign.networks },
                { label: 'Budget', value: campaign.daily_budget ? `$${campaign.daily_budget}/day` : null },
                { label: 'Location', value: campaign.location || formData?.geo },
              ].filter((x) => x.value).map((item) => (
                <Box key={item.label}>
                  <Typography variant="caption" sx={{ fontSize: 10, letterSpacing: 0.5, color: 'text.secondary', textTransform: 'uppercase' }}>{item.label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.25 }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Stagger>
      )}

      {/* Ad Groups + Keywords */}
      {adGroups.length > 0 && (
        <Stagger delay={0.14}>
          <SectionLabel icon={IconTarget} color={GOOGLE_BLUE}>Ad Groups & Keywords</SectionLabel>
          <Stack spacing={1.5}>
            {adGroups.map((group, gi) => (
              <Box key={gi} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: glass.surface, border: glass.border }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{group.name || `Ad Group ${gi + 1}`}</Typography>
                  {group.match_type && <Chip label={group.match_type} size="small" sx={{ fontSize: 10, height: 22, bgcolor: `${GOOGLE_BLUE}12`, color: GOOGLE_BLUE }} />}
                </Stack>
                <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap' }}>
                  {(group.keywords || []).map((kw, ki) => (
                    <Chip key={ki} label={kw} size="small" sx={{ bgcolor: 'rgba(66,133,244,0.08)', color: GOOGLE_BLUE, fontSize: 12, fontFamily: '"JetBrains Mono", monospace', height: 26 }} />
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Stagger>
      )}

      {/* Ad Copies — Search Result Preview */}
      {ads.length > 0 && (
        <Stagger delay={0.2}>
          <SectionLabel icon={IconEye} color={GOOGLE_BLUE}>Ad Previews</SectionLabel>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 2 }}>
            {ads.map((ad, ai) => (
              <Box key={ai} sx={{ p: 0, borderRadius: 2.5, bgcolor: '#fff', border: '1px solid #dfe1e5', overflow: 'hidden' }}>
                {/* Google search result mockup */}
                <Box sx={{ p: 2.5 }}>
                  <Typography sx={{ fontSize: 12, color: '#202124', fontFamily: 'Arial, sans-serif', mb: 0.25 }}>
                    Ad {'\u00B7'} {ad.final_url || formData?.website_url || 'yoursite.com'}
                  </Typography>
                  <Typography sx={{ fontSize: 20, color: '#1a0dab', fontFamily: 'Arial, sans-serif', fontWeight: 400, lineHeight: 1.3, mb: 0.5, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                    {[ad.headline1, ad.headline2, ad.headline3].filter(Boolean).join(' | ') || 'Headline Preview'}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: '#4d5156', fontFamily: 'Arial, sans-serif', lineHeight: 1.58 }}>
                    {[ad.description1, ad.description2].filter(Boolean).join(' ') || ad.description || 'Description preview'}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Stagger>
      )}

      <AIInsightsPanel text={output.ai_suggestions || output.ai_analysis} />
      <WarningsPanel warnings={output.warnings} />
      <GenericActionsList actions={output.actions} accent={GOOGLE_BLUE} />
    </Stack>
  );
}

/***************************  2. META CAMPAIGN LAUNCH  ***************************/

const META_BLUE = '#0668E1';

function MetaCampaignLaunchOutput({ output, formData }) {
  const adSets = output.ad_sets || [];
  const creatives = output.creatives || [];

  return (
    <Stack spacing={3.5}>
      <Stagger>
        <GenericSummaryGrid summary={output.summary} accent={META_BLUE} />
      </Stagger>

      {/* Ad Sets */}
      {adSets.length > 0 && (
        <Stagger delay={0.1}>
          <SectionLabel icon={IconUsers} color={META_BLUE}>Ad Sets & Audiences</SectionLabel>
          <Stack spacing={1.5}>
            {adSets.map((set, si) => (
              <Box key={si} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: glass.surface, border: glass.border, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', bgcolor: META_BLUE, borderRadius: '3px 0 0 3px' }} />
                <Box sx={{ pl: 1.5 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{set.name || `Ad Set ${si + 1}`}</Typography>
                    {set.budget && <Chip label={`$${set.budget}/day`} size="small" sx={{ bgcolor: 'rgba(62,183,94,0.1)', color: '#3EB75E', fontWeight: 700, fontSize: 12 }} />}
                  </Stack>
                  {set.audience && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 1.5 }}>
                      {set.audience.interests && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>Interests</Typography>
                          <Typography variant="body2" sx={{ mt: 0.25 }}>{Array.isArray(set.audience.interests) ? set.audience.interests.join(', ') : set.audience.interests}</Typography>
                        </Box>
                      )}
                      {set.audience.age && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>Age</Typography>
                          <Typography variant="body2" sx={{ mt: 0.25 }}>{set.audience.age}</Typography>
                        </Box>
                      )}
                      {set.audience.gender && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>Gender</Typography>
                          <Typography variant="body2" sx={{ mt: 0.25 }}>{set.audience.gender}</Typography>
                        </Box>
                      )}
                      {set.audience.locations && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>Locations</Typography>
                          <Typography variant="body2" sx={{ mt: 0.25 }}>{Array.isArray(set.audience.locations) ? set.audience.locations.join(', ') : set.audience.locations}</Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                  {set.placements && (
                    <Stack direction="row" sx={{ gap: 0.75, mt: 1.5, flexWrap: 'wrap' }}>
                      {(Array.isArray(set.placements) ? set.placements : [set.placements]).map((p, pi) => (
                        <Chip key={pi} label={p} size="small" variant="outlined" sx={{ fontSize: 11, height: 24, borderColor: `${META_BLUE}30` }} />
                      ))}
                    </Stack>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        </Stagger>
      )}

      {/* Creatives — Social Post Preview */}
      {creatives.length > 0 && (
        <Stagger delay={0.18}>
          <SectionLabel icon={IconEye} color={META_BLUE}>Creative Previews</SectionLabel>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
            {creatives.map((cr, ci) => (
              <Box key={ci} sx={{ borderRadius: 2.5, bgcolor: '#1c1c1e', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                {/* Social post header */}
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, p: 2, pb: 1.5 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: `${META_BLUE}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconBrandFacebook size={18} color={META_BLUE} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13 }}>Your Brand</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>Sponsored</Typography>
                  </Box>
                  {cr.format && <Chip label={cr.format} size="small" sx={{ ml: 'auto', fontSize: 10, height: 20, bgcolor: `${META_BLUE}12`, color: META_BLUE }} />}
                </Stack>
                {/* Post body */}
                <Box sx={{ px: 2, pb: 1.5 }}>
                  {cr.body && <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>{cr.body}</Typography>}
                </Box>
                {/* Image placeholder */}
                <Box sx={{ width: '100%', height: 160, bgcolor: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="caption" color="text.secondary">Creative Preview</Typography>
                </Box>
                {/* CTA bar */}
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', p: 2, pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <Box>
                    {cr.headline && <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13 }}>{cr.headline}</Typography>}
                  </Box>
                  {cr.cta && <Chip label={cr.cta} size="small" sx={{ bgcolor: META_BLUE, color: '#fff', fontWeight: 700, fontSize: 11 }} />}
                </Stack>
              </Box>
            ))}
          </Box>
        </Stagger>
      )}

      <AIInsightsPanel text={output.ai_suggestions || output.ai_analysis} />
      <WarningsPanel warnings={output.warnings} />
      <GenericActionsList actions={output.actions} accent={META_BLUE} />
    </Stack>
  );
}

/***************************  3. A/B TEST GENERATOR  ***************************/

const AB_PURPLE = '#805AF5';

function ABTestOutput({ output }) {
  const control = output.control || null;
  const variations = output.variations || [];
  const testPlan = output.test_plan || null;

  return (
    <Stack spacing={3.5}>
      <Stagger>
        <GenericSummaryGrid summary={output.summary} accent={AB_PURPLE} />
      </Stagger>

      {/* Test Plan */}
      {testPlan && (
        <Stagger delay={0.08}>
          <SectionLabel icon={IconAB2} color={AB_PURPLE}>Test Plan</SectionLabel>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 1.5 }}>
            {testPlan.duration_days && <MetricCard label="Duration" value={testPlan.duration_days} suffix=" days" accent={AB_PURPLE} />}
            {testPlan.sample_size && <MetricCard label="Sample Size" value={testPlan.sample_size} accent={AB_PURPLE} />}
            {testPlan.statistical_power && <MetricCard label="Statistical Power" value={testPlan.statistical_power} suffix="%" accent={AB_PURPLE} />}
            {testPlan.confidence_level && <MetricCard label="Confidence" value={testPlan.confidence_level} suffix="%" accent={AB_PURPLE} />}
          </Box>
        </Stagger>
      )}

      {/* Control vs Variations — Split Design */}
      {(control || variations.length > 0) && (
        <Stagger delay={0.15}>
          <SectionLabel icon={IconAB2} color={AB_PURPLE}>Variations</SectionLabel>
          <Box sx={{ display: 'grid', gridTemplateColumns: variations.length > 2 ? 'repeat(auto-fill, minmax(280px, 1fr))' : `repeat(${(control ? 1 : 0) + variations.length}, 1fr)`, gap: 2 }}>
            {/* Control */}
            {control && (
              <Box sx={{ p: 2.5, borderRadius: 2.5, bgcolor: glass.surface, border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                <Chip label="CONTROL" size="small" sx={{ mb: 1.5, bgcolor: 'rgba(255,255,255,0.08)', color: 'text.secondary', fontWeight: 700, fontSize: 10, letterSpacing: 1 }} />
                {typeof control === 'object' ? (
                  Object.entries(control).map(([k, v]) => (
                    <Box key={k} sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{String(v)}</Typography>
                    </Box>
                  ))
                ) : <Typography variant="body2">{String(control)}</Typography>}
              </Box>
            )}
            {/* Variations */}
            {variations.map((v, vi) => (
              <Box key={vi} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: `${AB_PURPLE}08`, border: `1px solid ${AB_PURPLE}25`, position: 'relative' }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Chip label={v.name || `VAR ${vi + 1}`} size="small" sx={{ bgcolor: `${AB_PURPLE}15`, color: AB_PURPLE, fontWeight: 700, fontSize: 10, letterSpacing: 1 }} />
                  {v.predicted_impact && (
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#3EB75E' }}>
                      {v.predicted_impact > 0 ? '+' : ''}{v.predicted_impact}% predicted
                    </Typography>
                  )}
                </Stack>
                {v.changes && typeof v.changes === 'object' ? (
                  Object.entries(v.changes).map(([k, val]) => (
                    <Box key={k} sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: AB_PURPLE }}>{String(val)}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2">{typeof v === 'object' ? (v.description || v.text || JSON.stringify(v)) : String(v)}</Typography>
                )}
                {v.predicted_impact && (
                  <Box sx={{ mt: 1.5 }}>
                    <LinearProgress variant="determinate" value={Math.min(100, Math.abs(v.predicted_impact) * 5)} sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { bgcolor: v.predicted_impact > 0 ? '#3EB75E' : '#FF4757', borderRadius: 2 } }} />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Stagger>
      )}

      <AIInsightsPanel text={output.ai_suggestions || output.ai_analysis} />
      <WarningsPanel warnings={output.warnings} />
      <GenericActionsList actions={output.actions} accent={AB_PURPLE} />
    </Stack>
  );
}

/***************************  4. BID OPTIMISATION  ***************************/

const BID_CYAN = '#1BA2DB';

function BidOptimisationOutput({ output }) {
  const recommendations = output.recommendations || [];
  const budgetRealloc = output.budget_reallocation || [];

  return (
    <Stack spacing={3.5}>
      <Stagger>
        <GenericSummaryGrid summary={output.summary} accent={BID_CYAN} />
      </Stagger>

      {/* Bid Recommendations Table */}
      {recommendations.length > 0 && (
        <Stagger delay={0.1}>
          <SectionLabel icon={IconCurrencyDollar} color={BID_CYAN}>Bid Recommendations</SectionLabel>
          <DataTable
            headers={['Campaign', 'Current Bid', 'Recommended', 'Change', 'Confidence']}
            accentColor={BID_CYAN}
            highlightCol={2}
            rows={recommendations.map((r) => [
              r.campaign || r.name || 'Campaign',
              r.current_bid ? `$${r.current_bid}` : '\u2014',
              r.recommended_bid ? `$${r.recommended_bid}` : '\u2014',
              r.expected_change ? `${r.expected_change > 0 ? '+' : ''}${r.expected_change}%` : '\u2014',
              r.confidence ? `${r.confidence}%` : '\u2014',
            ])}
          />
        </Stagger>
      )}

      {/* Budget Reallocation */}
      {budgetRealloc.length > 0 && (
        <Stagger delay={0.18}>
          <SectionLabel icon={IconChartBar} color={BID_CYAN}>Budget Reallocation</SectionLabel>
          <Stack spacing={1.5}>
            {budgetRealloc.map((item, i) => {
              const change = item.recommended_budget && item.current_budget ? ((item.recommended_budget - item.current_budget) / item.current_budget * 100).toFixed(0) : null;
              return (
                <Box key={i} sx={{ p: 2, borderRadius: 2, bgcolor: glass.surface, border: glass.border }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{item.campaign || `Campaign ${i + 1}`}</Typography>
                    {change && (
                      <Chip label={`${change > 0 ? '+' : ''}${change}%`} size="small" sx={{ bgcolor: change > 0 ? 'rgba(62,183,94,0.1)' : 'rgba(255,71,87,0.1)', color: change > 0 ? '#3EB75E' : '#FF4757', fontWeight: 700, fontSize: 11 }} />
                    )}
                  </Stack>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>CURRENT</Typography>
                      <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', mt: 0.5, position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: `${item.current_budget ? Math.min(100, (item.current_budget / Math.max(item.current_budget, item.recommended_budget || 1)) * 100) : 50}%`, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 3 }} />
                      </Box>
                      <Typography variant="caption" sx={{ fontFamily: '"JetBrains Mono", monospace', mt: 0.25, display: 'block' }}>${item.current_budget?.toLocaleString() || '\u2014'}</Typography>
                    </Box>
                    <IconArrowRight size={16} color="rgba(255,255,255,0.3)" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>RECOMMENDED</Typography>
                      <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(27,162,219,0.1)', mt: 0.5, position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: `${item.recommended_budget ? Math.min(100, (item.recommended_budget / Math.max(item.current_budget || 1, item.recommended_budget)) * 100) : 50}%`, bgcolor: BID_CYAN, borderRadius: 3 }} />
                      </Box>
                      <Typography variant="caption" sx={{ fontFamily: '"JetBrains Mono", monospace', mt: 0.25, display: 'block', color: BID_CYAN, fontWeight: 700 }}>${item.recommended_budget?.toLocaleString() || '\u2014'}</Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Stagger>
      )}

      <AIInsightsPanel text={output.ai_suggestions || output.ai_analysis} />
      <WarningsPanel warnings={output.warnings} />
      <GenericActionsList actions={output.actions} accent={BID_CYAN} />
    </Stack>
  );
}

/***************************  5. CREATIVE REFRESH  ***************************/

const REFRESH_ORANGE = '#FF8C42';

function CreativeRefreshOutput({ output }) {
  const fatigueScores = output.fatigue_scores || [];
  const refreshSuggestions = output.refresh_suggestions || [];

  return (
    <Stack spacing={3.5}>
      <Stagger>
        <GenericSummaryGrid summary={output.summary} accent={REFRESH_ORANGE} />
      </Stagger>

      {/* Fatigue Scores */}
      {fatigueScores.length > 0 && (
        <Stagger delay={0.1}>
          <SectionLabel icon={IconFlame} color={REFRESH_ORANGE}>Creative Fatigue Scores</SectionLabel>
          <Stack spacing={1.5}>
            {fatigueScores.map((item, i) => {
              const score = item.score || 0;
              const fatigueColor = score > 70 ? '#FF4757' : score > 40 ? REFRESH_ORANGE : '#3EB75E';
              const fatigueLabel = score > 70 ? 'Critical' : score > 40 ? 'Fatigued' : 'Healthy';
              return (
                <Box key={i} sx={{ p: 2, borderRadius: 2, bgcolor: glass.surface, border: glass.border }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{item.name || item.creative_id || `Creative ${i + 1}`}</Typography>
                      {item.days_running && <Typography variant="caption" color="text.secondary">{item.days_running} days running</Typography>}
                    </Box>
                    <Chip label={fatigueLabel} size="small" sx={{ bgcolor: `${fatigueColor}15`, color: fatigueColor, fontWeight: 700, fontSize: 11 }} />
                  </Stack>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress variant="determinate" value={score} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { bgcolor: fatigueColor, borderRadius: 4 } }} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', color: fatigueColor, minWidth: 36, textAlign: 'right' }}>{score}%</Typography>
                  </Box>
                  {item.impressions && <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>{item.impressions.toLocaleString()} impressions</Typography>}
                </Box>
              );
            })}
          </Stack>
        </Stagger>
      )}

      {/* Refresh Suggestions */}
      {refreshSuggestions.length > 0 && (
        <Stagger delay={0.18}>
          <SectionLabel icon={IconRefresh} color={REFRESH_ORANGE}>Refresh Suggestions</SectionLabel>
          <Stack spacing={1.5}>
            {refreshSuggestions.map((sug, i) => (
              <Box key={i} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: glass.surface, border: glass.border }}>
                {sug.original && (
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>Original</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through', mt: 0.25 }}>{sug.original}</Typography>
                  </Box>
                )}
                {sug.suggestion && (
                  <Box>
                    <Typography variant="caption" sx={{ fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase', color: REFRESH_ORANGE }}>Suggested</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.25 }}>{sug.suggestion}</Typography>
                  </Box>
                )}
                {sug.rationale && <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', lineHeight: 1.5 }}>{sug.rationale}</Typography>}
              </Box>
            ))}
          </Stack>
        </Stagger>
      )}

      <AIInsightsPanel text={output.ai_suggestions || output.ai_analysis} />
      <WarningsPanel warnings={output.warnings} />
      <GenericActionsList actions={output.actions} accent={REFRESH_ORANGE} />
    </Stack>
  );
}

/***************************  6. AUDIENCE EXPANSION  ***************************/

const AUDIENCE_GREEN = '#3EB75E';

function AudienceExpansionOutput({ output }) {
  const currentAudience = output.current_audience || null;
  const newSegments = output.new_segments || [];

  return (
    <Stack spacing={3.5}>
      <Stagger>
        <GenericSummaryGrid summary={output.summary} accent={AUDIENCE_GREEN} />
      </Stagger>

      {/* Current Audience */}
      {currentAudience && (
        <Stagger delay={0.08}>
          <SectionLabel icon={IconUsers} color={AUDIENCE_GREEN}>Current Audience</SectionLabel>
          <Box sx={{ p: 2.5, borderRadius: 2.5, bgcolor: glass.surface, border: glass.border }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 2 }}>
              {currentAudience.description && (
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="body2" color="text.secondary">{currentAudience.description}</Typography>
                </Box>
              )}
              {currentAudience.size && <MetricCard label="Audience Size" value={currentAudience.size} accent={AUDIENCE_GREEN} />}
              {currentAudience.performance && <MetricCard label="Performance" value={currentAudience.performance} accent={AUDIENCE_GREEN} />}
            </Box>
          </Box>
        </Stagger>
      )}

      {/* New Segments */}
      {newSegments.length > 0 && (
        <Stagger delay={0.15}>
          <SectionLabel icon={IconTarget} color={AUDIENCE_GREEN}>Discovered Segments</SectionLabel>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
            {newSegments.map((seg, i) => (
              <Box key={i} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: `${AUDIENCE_GREEN}06`, border: `1px solid ${AUDIENCE_GREEN}18`, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: `${AUDIENCE_GREEN}06` }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>{seg.name || `Segment ${i + 1}`}</Typography>
                <Stack spacing={1}>
                  {seg.size && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>Est. Size</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>{typeof seg.size === 'number' ? seg.size.toLocaleString() : seg.size}</Typography>
                    </Box>
                  )}
                  {seg.overlap_pct !== undefined && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>Overlap</Typography>
                      <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                        <Box sx={{ flex: 1, height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)' }}>
                          <Box sx={{ width: `${seg.overlap_pct}%`, height: '100%', bgcolor: AUDIENCE_GREEN, borderRadius: 2 }} />
                        </Box>
                        <Typography variant="caption" sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 }}>{seg.overlap_pct}%</Typography>
                      </Stack>
                    </Box>
                  )}
                  {seg.potential_cpa && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>Est. CPA</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: AUDIENCE_GREEN }}>${seg.potential_cpa}</Typography>
                    </Box>
                  )}
                  {seg.rationale && <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, mt: 0.5 }}>{seg.rationale}</Typography>}
                </Stack>
              </Box>
            ))}
          </Box>
        </Stagger>
      )}

      <AIInsightsPanel text={output.ai_suggestions || output.ai_analysis} />
      <WarningsPanel warnings={output.warnings} />
      <GenericActionsList actions={output.actions} accent={AUDIENCE_GREEN} />
    </Stack>
  );
}

/***************************  7. SCALE WINNERS  ***************************/

const SCALE_GOLD = '#FFD700';

function ScaleWinnersOutput({ output }) {
  const winners = output.winners || [];
  const scalingPlan = output.scaling_plan || [];

  return (
    <Stack spacing={3.5}>
      <Stagger>
        <GenericSummaryGrid summary={output.summary} accent="#3EB75E" />
      </Stagger>

      {/* Winners Leaderboard */}
      {winners.length > 0 && (
        <Stagger delay={0.1}>
          <SectionLabel icon={IconTrophy} color={SCALE_GOLD}>Top Performers</SectionLabel>
          <Stack spacing={1.5}>
            {winners.map((w, i) => {
              const medal = i === 0 ? { emoji: '\uD83E\uDD47', border: SCALE_GOLD } : i === 1 ? { emoji: '\uD83E\uDD48', border: '#C0C0C0' } : i === 2 ? { emoji: '\uD83E\uDD49', border: '#CD7F32' } : { emoji: '', border: 'rgba(255,255,255,0.06)' };
              return (
                <Box key={i} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: glass.surface, border: `1px solid ${medal.border}${i < 3 ? '40' : ''}`, position: 'relative', overflow: 'hidden' }}>
                  {i < 3 && <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, bgcolor: medal.border, opacity: 0.5 }} />}
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.5 }}>
                        {medal.emoji && <Typography sx={{ fontSize: 18 }}>{medal.emoji}</Typography>}
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{w.campaign || w.name || `Campaign ${i + 1}`}</Typography>
                        {w.platform && <Chip label={w.platform} size="small" sx={{ height: 20, fontSize: 10, bgcolor: w.platform === 'google' ? 'rgba(66,133,244,0.1)' : 'rgba(6,104,225,0.1)', color: w.platform === 'google' ? '#4285F4' : '#0668E1' }} />}
                      </Stack>
                    </Box>
                    {w.recommended_increase && (
                      <Chip label={`+${w.recommended_increase}%`} size="small" sx={{ bgcolor: 'rgba(62,183,94,0.12)', color: '#3EB75E', fontWeight: 700 }} />
                    )}
                  </Stack>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mt: 1.5 }}>
                    {w.roas && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>ROAS</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#3EB75E', fontFamily: '"JetBrains Mono", monospace' }}>{w.roas}x</Typography>
                      </Box>
                    )}
                    {w.spend !== undefined && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>Spend</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>${w.spend?.toLocaleString()}</Typography>
                      </Box>
                    )}
                    {w.conversions !== undefined && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>Conversions</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>{w.conversions?.toLocaleString()}</Typography>
                      </Box>
                    )}
                    {w.cpa !== undefined && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>CPA</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>${w.cpa}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Stagger>
      )}

      {/* Scaling Plan */}
      {scalingPlan.length > 0 && (
        <Stagger delay={0.2}>
          <SectionLabel icon={IconTrendingUp} color="#3EB75E">Scaling Plan</SectionLabel>
          <Stack spacing={0}>
            {scalingPlan.map((phase, i) => (
              <Stack key={i} direction="row" sx={{ gap: 2, position: 'relative' }}>
                {/* Timeline connector */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#3EB75E', flexShrink: 0, mt: 0.75 }} />
                  {i < scalingPlan.length - 1 && <Box sx={{ width: 2, flex: 1, bgcolor: 'rgba(62,183,94,0.2)' }} />}
                </Box>
                <Box sx={{ pb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{phase.phase || phase.action || `Phase ${i + 1}`}</Typography>
                  {phase.action && phase.phase && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>{phase.action}</Typography>}
                  {phase.timeline && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>{phase.timeline}</Typography>}
                </Box>
              </Stack>
            ))}
          </Stack>
        </Stagger>
      )}

      <AIInsightsPanel text={output.ai_suggestions || output.ai_analysis} />
      <WarningsPanel warnings={output.warnings} />
      <GenericActionsList actions={output.actions} accent="#3EB75E" />
    </Stack>
  );
}

/***************************  8. KILL UNDERPERFORMERS  ***************************/

const KILL_RED = '#FF4757';

function KillUnderperformersOutput({ output }) {
  const underperformers = output.underperformers || [];

  return (
    <Stack spacing={3.5}>
      {/* Waste Alert Header */}
      {output.summary?.wasted_spend && (
        <Stagger>
          <Box sx={{ p: 3, borderRadius: 2.5, bgcolor: `${KILL_RED}08`, border: `1px solid ${KILL_RED}20`, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: KILL_RED, fontWeight: 700 }}>Wasted Spend Detected</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: KILL_RED, fontFamily: '"JetBrains Mono", monospace', mt: 0.5 }}>
              ${output.summary.wasted_spend.toLocaleString()}
            </Typography>
            {output.summary.potential_savings && (
              <Typography variant="body2" sx={{ color: '#3EB75E', mt: 0.5 }}>
                Potential savings: ${output.summary.potential_savings.toLocaleString()}
              </Typography>
            )}
          </Box>
        </Stagger>
      )}

      <Stagger delay={0.06}>
        <GenericSummaryGrid summary={{ ...output.summary, wasted_spend: undefined, potential_savings: undefined }} accent={KILL_RED} />
      </Stagger>

      {/* Underperformers Table */}
      {underperformers.length > 0 && (
        <Stagger delay={0.12}>
          <SectionLabel icon={IconSkull} color={KILL_RED}>Underperformers</SectionLabel>
          <Stack spacing={1.5}>
            {underperformers.map((item, i) => (
              <Box key={i} sx={{ p: 2, borderRadius: 2, bgcolor: glass.surface, border: `1px solid ${KILL_RED}15`, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', bgcolor: KILL_RED, borderRadius: '3px 0 0 3px' }} />
                <Box sx={{ pl: 1.5 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.campaign || item.name || `Item ${i + 1}`}</Typography>
                      {item.reason && <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>{item.reason}</Typography>}
                    </Box>
                    <Chip label={item.action || 'Pause'} size="small" sx={{ bgcolor: `${KILL_RED}15`, color: KILL_RED, fontWeight: 700, fontSize: 11 }} />
                  </Stack>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                    {item.spend !== undefined && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>Spend</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: KILL_RED, fontFamily: '"JetBrains Mono", monospace' }}>${item.spend?.toLocaleString()}</Typography>
                      </Box>
                    )}
                    {item.conversions !== undefined && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>Conversions</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>{item.conversions}</Typography>
                      </Box>
                    )}
                    {item.cpa !== undefined && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>CPA</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: KILL_RED, fontFamily: '"JetBrains Mono", monospace' }}>${item.cpa}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        </Stagger>
      )}

      <AIInsightsPanel text={output.ai_suggestions || output.ai_analysis} />
      <WarningsPanel warnings={output.warnings} />
      <GenericActionsList actions={output.actions} accent={KILL_RED} />
    </Stack>
  );
}

/***************************  9. RETARGETING SETUP  ***************************/

const RETARGET_PURPLE = '#805AF5';

function RetargetingSetupOutput({ output }) {
  const funnel = output.funnel || [];
  const audiences = output.audiences || [];
  const stageColors = ['#805AF5', '#1BA2DB', '#3EB75E'];

  return (
    <Stack spacing={3.5}>
      <Stagger>
        <GenericSummaryGrid summary={output.summary} accent={RETARGET_PURPLE} />
      </Stagger>

      {/* Funnel Visualization */}
      {funnel.length > 0 && (
        <Stagger delay={0.1}>
          <SectionLabel icon={IconFilterBolt} color={RETARGET_PURPLE}>Retargeting Funnel</SectionLabel>
          <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 0, overflow: 'hidden' }}>
            {funnel.map((stage, si) => {
              const color = stageColors[si % stageColors.length];
              return (
                <Box key={si} sx={{ flex: 1, display: 'flex', alignItems: 'stretch' }}>
                  <Box sx={{ flex: 1, p: 2.5, bgcolor: `${color}08`, border: `1px solid ${color}20`, borderRadius: si === 0 ? '12px 0 0 12px' : si === funnel.length - 1 ? '0 12px 12px 0' : 0, borderRight: si < funnel.length - 1 ? 'none' : undefined, position: 'relative' }}>
                    {/* Stage number */}
                    <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: color, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                      <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{si + 1}</Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontSize: 13 }}>
                      {stage.name || stage.stage || `Stage ${si + 1}`}
                    </Typography>
                    <Stack spacing={0.75}>
                      {stage.audience_window && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>Window</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 12 }}>{stage.audience_window}</Typography>
                        </Box>
                      )}
                      {stage.budget && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>Budget</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color, fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>${stage.budget}/day</Typography>
                        </Box>
                      )}
                      {stage.frequency_cap && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>Freq Cap</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 12 }}>{stage.frequency_cap}</Typography>
                        </Box>
                      )}
                      {stage.creative_type && (
                        <Chip label={stage.creative_type} size="small" sx={{ mt: 0.5, fontSize: 10, height: 22, bgcolor: `${color}15`, color }} />
                      )}
                    </Stack>
                  </Box>
                  {/* Arrow connector */}
                  {si < funnel.length - 1 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mx: -0.5, zIndex: 1 }}>
                      <IconArrowRight size={18} color="rgba(255,255,255,0.2)" />
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Stagger>
      )}

      {/* Audiences */}
      {audiences.length > 0 && (
        <Stagger delay={0.18}>
          <SectionLabel icon={IconUsers} color={RETARGET_PURPLE}>Audiences</SectionLabel>
          <DataTable
            headers={['Audience', 'Source', 'Est. Size']}
            accentColor={RETARGET_PURPLE}
            rows={audiences.map((a) => [
              a.name || 'Audience',
              a.source || '\u2014',
              a.size_estimate ? (typeof a.size_estimate === 'number' ? a.size_estimate.toLocaleString() : a.size_estimate) : '\u2014',
            ])}
          />
        </Stagger>
      )}

      <AIInsightsPanel text={output.ai_suggestions || output.ai_analysis} />
      <WarningsPanel warnings={output.warnings} />
      <GenericActionsList actions={output.actions} accent={RETARGET_PURPLE} />
    </Stack>
  );
}

/***************************  10. CROSS-PLATFORM REPORT  ***************************/

const REPORT_PURPLE = '#805AF5';
const PLATFORM_COLORS = { google: '#4285F4', meta: '#0668E1', facebook: '#0668E1', instagram: '#E1306C' };

function CrossPlatformReportOutput({ output }) {
  const platforms = output.platforms || [];
  const topCampaigns = output.top_campaigns || [];
  const trends = output.trends || null;

  return (
    <Stack spacing={3.5}>
      <Stagger>
        <GenericSummaryGrid summary={output.summary} accent={REPORT_PURPLE} />
      </Stagger>

      {/* Trend Indicators */}
      {trends && (
        <Stagger delay={0.08}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 1.5 }}>
            {trends.spend_change !== undefined && <MetricCard label="Spend Trend" value={`${trends.spend_change > 0 ? '+' : ''}${trends.spend_change}%`} color={trends.spend_change > 0 ? '#FF4757' : '#3EB75E'} accent={REPORT_PURPLE} />}
            {trends.conversion_change !== undefined && <MetricCard label="Conversion Trend" value={`${trends.conversion_change > 0 ? '+' : ''}${trends.conversion_change}%`} color={trends.conversion_change > 0 ? '#3EB75E' : '#FF4757'} accent={REPORT_PURPLE} />}
            {trends.cpa_change !== undefined && <MetricCard label="CPA Trend" value={`${trends.cpa_change > 0 ? '+' : ''}${trends.cpa_change}%`} color={trends.cpa_change > 0 ? '#FF4757' : '#3EB75E'} accent={REPORT_PURPLE} />}
            {trends.roas_change !== undefined && <MetricCard label="ROAS Trend" value={`${trends.roas_change > 0 ? '+' : ''}${trends.roas_change}%`} color={trends.roas_change > 0 ? '#3EB75E' : '#FF4757'} accent={REPORT_PURPLE} />}
          </Box>
        </Stagger>
      )}

      {/* Platform Comparison */}
      {platforms.length > 0 && (
        <Stagger delay={0.14}>
          <SectionLabel icon={IconReportAnalytics} color={REPORT_PURPLE}>Platform Breakdown</SectionLabel>
          <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(platforms.length, 3)}, 1fr)`, gap: 2 }}>
            {platforms.map((plat, i) => {
              const pColor = PLATFORM_COLORS[plat.platform?.toLowerCase()] || REPORT_PURPLE;
              const PIcon = plat.platform?.toLowerCase() === 'google' ? IconBrandGoogle : IconBrandFacebook;
              return (
                <Box key={i} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: `${pColor}06`, border: `1px solid ${pColor}20`, position: 'relative', overflow: 'hidden' }}>
                  <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, bgcolor: pColor }} />
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 2 }}>
                    <PIcon size={20} color={pColor} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'capitalize' }}>{plat.platform || 'Platform'}</Typography>
                  </Stack>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                    {plat.spend !== undefined && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>Spend</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>${plat.spend?.toLocaleString()}</Typography>
                      </Box>
                    )}
                    {plat.conversions !== undefined && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>Conversions</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>{plat.conversions?.toLocaleString()}</Typography>
                      </Box>
                    )}
                    {plat.cpa !== undefined && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>CPA</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>${plat.cpa}</Typography>
                      </Box>
                    )}
                    {plat.roas !== undefined && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>ROAS</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: plat.roas >= 2 ? '#3EB75E' : '#FF4757', fontFamily: '"JetBrains Mono", monospace' }}>{plat.roas}x</Typography>
                      </Box>
                    )}
                    {plat.impressions !== undefined && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>Impressions</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>{plat.impressions?.toLocaleString()}</Typography>
                      </Box>
                    )}
                    {plat.clicks !== undefined && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>Clicks</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>{plat.clicks?.toLocaleString()}</Typography>
                      </Box>
                    )}
                    {plat.ctr !== undefined && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, textTransform: 'uppercase' }}>CTR</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>{plat.ctr}%</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Stagger>
      )}

      {/* Top Campaigns */}
      {topCampaigns.length > 0 && (
        <Stagger delay={0.2}>
          <SectionLabel icon={IconTrophy} color={REPORT_PURPLE}>Top Campaigns</SectionLabel>
          <DataTable
            headers={['Campaign', 'Platform', 'Spend', 'Conversions', 'ROAS']}
            accentColor={REPORT_PURPLE}
            highlightCol={4}
            rows={topCampaigns.map((c) => [
              c.name || 'Campaign',
              c.platform || '\u2014',
              c.spend !== undefined ? `$${c.spend.toLocaleString()}` : '\u2014',
              c.conversions !== undefined ? c.conversions.toLocaleString() : '\u2014',
              c.roas !== undefined ? `${c.roas}x` : '\u2014',
            ])}
          />
        </Stagger>
      )}

      <AIInsightsPanel text={output.ai_suggestions || output.ai_analysis} />
      <WarningsPanel warnings={output.warnings} />
      <GenericActionsList actions={output.actions} accent={REPORT_PURPLE} />
    </Stack>
  );
}

/***************************  GENERIC FALLBACK  ***************************/

function GenericOutput({ output }) {
  return (
    <Stack spacing={3}>
      <GenericSummaryGrid summary={output.summary} />
      <GenericActionsList actions={output.actions} />
      <AIInsightsPanel text={output.ai_suggestions || output.ai_analysis} />
      <WarningsPanel warnings={output.warnings} />

      {/* Raw fallback if nothing structured */}
      {!output.summary && !output.actions && (
        <Box sx={{ bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 2.5, p: 3, fontFamily: '"JetBrains Mono", monospace', fontSize: 12, lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 500, overflow: 'auto', border: glass.border }}>
          {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
        </Box>
      )}
    </Stack>
  );
}

/***************************  DISPATCHER  ***************************/

const RENDERERS = {
  google_search_launch: GoogleSearchLaunchOutput,
  meta_campaign_launch: MetaCampaignLaunchOutput,
  ab_test_generator: ABTestOutput,
  bid_optimisation: BidOptimisationOutput,
  creative_refresh: CreativeRefreshOutput,
  audience_expansion: AudienceExpansionOutput,
  scale_winners: ScaleWinnersOutput,
  kill_underperformers: KillUnderperformersOutput,
  retargeting_setup: RetargetingSetupOutput,
  cross_platform_report: CrossPlatformReportOutput,
};

export default function WorkflowOutput({ workflowId, output, formData }) {
  if (!output) return null;
  const Renderer = RENDERERS[workflowId] || GenericOutput;
  return <Renderer output={output} formData={formData} />;
}
