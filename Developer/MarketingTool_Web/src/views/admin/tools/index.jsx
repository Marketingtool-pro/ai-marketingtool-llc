import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';

// @assets
import { IconSearch, IconArrowRight } from '@tabler/icons-react';

// @project
import { searchTools, categories, allTools } from '@/utils/api/tools';

/***************************  DESIGN TOKENS  ***************************/

const ACCENT = '#805AF5';

// 14 unique hero videos — ALL landscape (1280x720+), dark backgrounds, NO people/hands/girls
const PAGE_VIDEOS = [
  '/images/ad-library/videos/artificial-intelligence-animation-with-machine-lea-2025-12-0.mp4',
  '/images/ad-library/videos/futuristic-cybersecurity-concept-with-animated-dat-2026-01-2.mp4',
  '/images/ad-library/videos/digital-holographic-user-interface-projecting-data-2026-01-2.mp4',
  '/images/ad-library/videos/computer-monitor-animation-with-blue-virtual-holog-2026-01-2.mp4',
  '/images/ad-library/videos/cyber-security-data-protection-and-privacy-concep-2026-01-28.mp4',
  '/images/ad-library/videos/holographic-data-analysis-and-projections-with-cha-2026-01-2.mp4',
  '/images/ad-library/videos/advanced-data-analytics-dashboard-display-futurist-2026-01-2.mp4',
  '/images/ad-library/videos/4k-meta-universe-ai-intelligent-robot-4k-2025-12-09-07-47-47.mp4',
  '/images/ad-library/videos/social-media-marketing-and-optimization-animation-2026-01-28.mp4',
  '/images/ad-library/videos/ai-agent-project-management-2026-01-28-05-05-25-utc.mp4',
  '/images/ad-library/videos/3d-animation-of-advertisement-growth-2026-01-28-04-20-32-utc.mp4',
  '/images/ad-library/videos/e-commerce-online-shopping-4k-2025-12-09-06-33-23-utc.mp4',
  '/images/ad-library/videos/online-display-ads-marketing-animated-scene-2026-01-28-04-12.mp4',
  '/images/ad-library/videos/stock-market-in-a-smartphone-2026-01-28-05-11-46-utc.mp4'
];

const glass = {
  bg: 'rgba(10, 10, 14, 0.80)',
  border: '1px solid rgba(255,255,255,0.03)',
  blur: 'blur(40px)',
  shadow: 'inset 2px 4px 16px 0px rgba(0,0,0,0.25)',
  radius: '24px'
};

/***************************  IMAGE MAP — NO DUPLICATES  ***************************/
// Each badge mapped to a folder. Categories sharing a folder are spread
// across different folders to maximize unique images.
//
// Folder capacities:  google:42  meta:39  instagram:67  ai-tools:57
//   content:15  ecommerce:53  social-media:20  analytics:17
//   seo:11  roi:6  youtube:6  linkedin:4  tiktok:4
// ZERO duplicates — all 314 tools have unique images

const BADGE_FOLDER = {
  // google (42): Google Ads(19) + Audit(16) = 35
  'Google Ads':       { folder: '/images/tools/google',        prefix: 'g-',    count: 42 },
  'Audit':            { folder: '/images/tools/google',        prefix: 'g-',    count: 42 },

  // instagram (67): Instagram(16) + Campaign(18) + Budget(10) + Grader(7) + Text Editing(10) = 61
  'Instagram':        { folder: '/images/tools/instagram',     prefix: 'i-',    count: 67 },
  'Campaign':         { folder: '/images/tools/instagram',     prefix: 'i-',    count: 67 },
  'Budget':           { folder: '/images/tools/instagram',     prefix: 'i-',    count: 67 },
  'Grader':           { folder: '/images/tools/instagram',     prefix: 'i-',    count: 67 },
  'Text Editing':     { folder: '/images/tools/instagram',     prefix: 'i-',    count: 67 },

  // ai-tools (57): AI Agent(10) + Marketing(13) + Advertising(7) + Developer(4) + Branding(2) + Education(2) + Automation(2) + PPC Optimization(9) = 49
  'AI Agent':         { folder: '/images/tools/ai-tools',      prefix: 'ai-',   count: 57 },
  'Marketing':        { folder: '/images/tools/ai-tools',      prefix: 'ai-',   count: 57 },
  'Advertising':      { folder: '/images/tools/ai-tools',      prefix: 'ai-',   count: 57 },
  'Developer':        { folder: '/images/tools/ai-tools',      prefix: 'ai-',   count: 57 },
  'Branding':         { folder: '/images/tools/ai-tools',      prefix: 'ai-',   count: 57 },
  'Education':        { folder: '/images/tools/ai-tools',      prefix: 'ai-',   count: 57 },
  'Automation':       { folder: '/images/tools/ai-tools',      prefix: 'ai-',   count: 57 },
  'PPC Optimization': { folder: '/images/tools/ai-tools',      prefix: 'ai-',   count: 57 },

  // meta (39): Facebook/Meta(37) = 37
  'Facebook/Meta':    { folder: '/images/tools/meta',          prefix: 'm-',    count: 39 },

  // social-media (20): Social Media(8) + Pinterest(1) + Twitter/X(1) + Creative(8) = 18
  'Social Media':     { folder: '/images/tools/social-media',  prefix: 'sm-',   count: 20 },
  'Pinterest':        { folder: '/images/tools/social-media',  prefix: 'sm-',   count: 20 },
  'Twitter/X':        { folder: '/images/tools/social-media',  prefix: 'sm-',   count: 20 },
  'Creative':         { folder: '/images/tools/social-media',  prefix: 'sm-',   count: 20 },

  // content (15): Content Writing(15) = 15
  'Content Writing':  { folder: '/images/tools/content',       prefix: 'ct-',   count: 15 },

  // ecommerce (53): E-commerce(45) + Shopify(8) = 53 ✓
  'E-commerce':       { folder: '/images/tools/ecommerce',     prefix: 'ec-',   count: 53 },
  'Shopify':          { folder: '/images/tools/ecommerce',     prefix: 'ec-',   count: 53 },

  // analytics (17): Analytics(17) = 17 ✓
  'Analytics':        { folder: '/images/tools/analytics',     prefix: 'an-',   count: 17 },

  // seo (11): SEO(11) = 11
  'SEO':              { folder: '/images/tools/seo',           prefix: 'seo-',  count: 11 },

  // roi (6): ROI & Attribution(5) = 5
  'ROI & Attribution':{ folder: '/images/tools/roi',           prefix: 'roi-',  count: 6 },

  // youtube (6): YouTube(3) + Email(3) = 6 ✓
  'YouTube':          { folder: '/images/tools/youtube',       prefix: 'yt-',   count: 6 },
  'Email':            { folder: '/images/tools/youtube',       prefix: 'yt-',   count: 6 },

  // tiktok (4): TikTok(1) + Copywriting(3) = 4
  'TikTok':           { folder: '/images/tools/tiktok',        prefix: 'tt-',   count: 4 },
  'Copywriting':      { folder: '/images/tools/tiktok',        prefix: 'tt-',   count: 4 },

  // linkedin (4): LinkedIn(1) + Schema(2) = 3
  'LinkedIn':         { folder: '/images/tools/linkedin',      prefix: 'li-',   count: 4 },
  'Schema':           { folder: '/images/tools/linkedin',      prefix: 'li-',   count: 4 }
};

// Build global image map — tools sharing the same folder get sequential images
const TOOL_IMAGE_MAP = (() => {
  const counters = {};
  const map = {};
  allTools.forEach((tool) => {
    const cfg = BADGE_FOLDER[tool.badge];
    if (!cfg) { map[tool.slug] = '/images/tools/ai-tools/ai-01.jpg'; return; }
    const key = cfg.folder;
    if (!counters[key]) counters[key] = 0;
    const idx = counters[key];
    counters[key] += 1;
    const num = (idx % cfg.count) + 1;
    map[tool.slug] = `${cfg.folder}/${cfg.prefix}${String(num).padStart(2, '0')}.jpg`;
  });
  return map;
})();

/***************************  BENTO TOOL CARD  ***************************/

function BentoToolCard({ tool, image }) {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate(`/tools/${tool.slug}`)}
      sx={{
        height: '100%',
        background: glass.bg,
        backdropFilter: glass.blur,
        WebkitBackdropFilter: glass.blur,
        border: glass.border,
        boxShadow: glass.shadow,
        borderRadius: glass.radius,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: 'rgba(248,248,248,0.07)',
          borderColor: 'rgba(128,90,245,0.4)',
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 48px -12px rgba(128,90,245,0.15), 2px 4px 16px 0px rgba(248,248,248,0.06) inset'
        },
        '&:hover .bento-img': { transform: 'scale(1.06)' }
      }}
    >
      <Box sx={{ aspectRatio: { xs: '4/3', sm: '16/10', md: '16/9' }, overflow: 'hidden', position: 'relative', bgcolor: 'rgba(14,12,21,0.6)' }}>
        <img
          className="bento-img"
          src={image}
          alt={tool.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(14,12,21,0.7) 100%)', pointerEvents: 'none' }} />
        <Chip
          label={tool.badge}
          size="small"
          sx={{
            position: 'absolute', top: 12, left: 12, height: 24,
            fontSize: '0.65rem', fontWeight: 700,
            bgcolor: 'rgba(14,12,21,0.6)', color: '#fff',
            backdropFilter: 'blur(12px)', borderLeft: `3px solid ${ACCENT}`,
            letterSpacing: '0.02em'
          }}
        />
      </Box>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75, lineHeight: 1.3, letterSpacing: '-0.01em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {tool.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', opacity: 0.7 }}>
          {tool.description}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, color: ACCENT }}>
          Run workflow <IconArrowRight size={14} />
        </Typography>
      </Box>
    </Box>
  );
}

/***************************  TOOLS CATALOGUE PAGE  ***************************/

const PER_PAGE = 24;

export default function ToolsCataloguePage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);

  const handleSearch = useCallback((e) => { setQuery(e.target.value); setPage(1); }, []);
  const handleCategoryClick = useCallback((cat) => { setSelectedCategory(selectedCategory === cat ? '' : cat); setPage(1); }, [selectedCategory]);

  const results = useMemo(() => searchTools({ query, category: selectedCategory, page, perPage: PER_PAGE }), [query, selectedCategory, page]);

  // Different video for each page
  const heroVideo = PAGE_VIDEOS[(page - 1) % PAGE_VIDEOS.length];

  return (
    <Box sx={{ position: 'relative' }}>
      {/* HERO VIDEO — changes per page */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 0, width: '100%', height: { xs: 200, sm: 260, md: 320, lg: 360 }, borderRadius: { xs: '12px', md: '20px' }, overflow: 'hidden' }}>
        <video
          key={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', position: 'absolute', top: 0, left: 0 }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(14,12,21,0.7) 0%, rgba(14,12,21,0.4) 50%, rgba(14,12,21,0.65) 100%)' }} />
      </Box>

      {/* CONTENT */}
      <Stack sx={{ position: 'relative', zIndex: 1, bgcolor: 'background.default', mt: -3, borderRadius: '24px 24px 0 0', pt: 4, gap: { xs: 3, md: 4 } }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.02em', mb: 0.5 }}>AI Tools</Typography>
          <Typography variant="body2" color="text.secondary">{allTools.length} tools across {categories.length} categories</Typography>
        </Box>

        <TextField
          fullWidth placeholder="Search tools by name, category, or description..." value={query} onChange={handleSearch}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><IconSearch size={20} /></InputAdornment> } }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, background: glass.bg, backdropFilter: glass.blur, border: glass.border } }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          <Chip label={`All (${allTools.length})`} variant={selectedCategory === '' ? 'filled' : 'outlined'} color={selectedCategory === '' ? 'primary' : 'default'} onClick={() => handleCategoryClick('')} size="small" sx={{ cursor: 'pointer' }} />
          {categories.map((cat) => (
            <Chip key={cat.name} label={`${cat.name} (${cat.count})`} variant={selectedCategory === cat.name ? 'filled' : 'outlined'} color={selectedCategory === cat.name ? 'primary' : 'default'} onClick={() => handleCategoryClick(cat.name)} size="small" sx={{ cursor: 'pointer' }} />
          ))}
        </Box>

        {results.total > 0 && (
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, results.total)} of {results.total} tools
            {selectedCategory && ` in ${selectedCategory}`}{query && ` matching "${query}"`}
          </Typography>
        )}

        <Grid container spacing={2}>
          {results.tools.map((tool) => (
            <Grid key={tool.slug} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <BentoToolCard tool={tool} image={TOOL_IMAGE_MAP[tool.slug] || '/images/tools/ai-tools/ai-01.jpg'} />
            </Grid>
          ))}
        </Grid>

        {results.tools.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">No tools found</Typography>
            <Typography variant="body2" color="text.disabled">Try a different search term or category</Typography>
          </Box>
        )}

        {results.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, pb: 4 }}>
            <Pagination count={results.totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" shape="rounded" />
          </Box>
        )}
      </Stack>
    </Box>
  );
}
