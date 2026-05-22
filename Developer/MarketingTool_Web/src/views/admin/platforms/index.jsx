import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// @mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';

// @assets
import {
  IconBrandGoogle,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandTiktok,
  IconBrandLinkedin,
  IconArrowRight,
  IconChartBar,
  IconRocket,
  IconSettings,
  IconTrendingUp,
  IconSearch,
  IconPencil,
  IconShieldCheck,
  IconCoin,
  IconShare,
  IconUsers,
  IconHash,
  IconCamera,
  IconBriefcase,
  IconRobot,
  IconMail,
  IconCode
} from '@tabler/icons-react';

// @project
import toolsData from '@/data/tools.json';

/***************************  GLASS TOKENS  ***************************/

const glass = {
  bg: 'rgba(30, 30, 35, 0.65)',
  border: '1px solid rgba(255,255,255,0.06)',
  blur: 'blur(40px)',
  shadow: 'inset 2px 4px 16px 0px rgba(248,248,248,0.03)',
  radius: '24px',
  hoverBorder: 'rgba(255,255,255,0.12)'
};

/***************************  GOOGLE ASSETS (45 unique images)  ***************************/

const IMG = '/images/tools/google';
const GOOGLE_HERO_VIDEO = '/videos/google/hero.mp4';

// 42 unique images - one per tool, NO repeats
const GOOGLE_IMAGES = Array.from({ length: 42 }, (_, i) => `${IMG}/g-${String(i + 1).padStart(2, '0')}.jpg`);

/***************************  GOOGLE: TOOL CARD  ***************************/

function GoogleToolCard({ tool, image }) {
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
          borderColor: 'rgba(66,133,244,0.4)',
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(66,133,244,0.12)'
        },
        '&:hover .g-card-img': {
          transform: 'scale(1.05)'
        }
      }}
    >
      <Box sx={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative', bgcolor: 'grey.900' }}>
        <img
          className="g-card-img"
          src={image}
          alt={tool.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            transition: 'transform 0.4s ease'
          }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)',
            pointerEvents: 'none'
          }}
        />
        <Chip
          label={tool.badge}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            height: 22,
            fontSize: '0.6rem',
            fontWeight: 700,
            bgcolor: 'rgba(0,0,0,0.55)',
            color: 'white',
            backdropFilter: 'blur(8px)',
            borderLeft: '3px solid #4285F4'
          }}
        />
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            mb: 0.75,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {tool.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {tool.description}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, color: '#4285F4' }}
        >
          Run workflow <IconArrowRight size={14} />
        </Typography>
      </Box>
    </Box>
  );
}

/***************************  GOOGLE: TOOL SECTION  ***************************/

function GoogleToolSection({ title, subtitle, icon: Icon, tools, startIndex }) {
  if (tools.length === 0) return null;

  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(66,133,244,0.08)',
            color: '#4285F4'
          }}
        >
          <Icon size={18} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
          {title}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {subtitle}
      </Typography>

      <Grid container spacing={2}>
        {tools.map((tool, idx) => (
          <Grid key={tool.slug} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <GoogleToolCard tool={tool} image={GOOGLE_IMAGES[(startIndex + idx) % GOOGLE_IMAGES.length]} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

/***************************  GOOGLE PLATFORM CONTENT  ***************************/

function GooglePlatformContent() {
  const config = PLATFORM_CONFIG.google;

  const sectionsWithTools = useMemo(() => {
    if (!config) return [];
    const platformTools = config.filterFn ? toolsData.filter(config.filterFn) : toolsData;
    return config.sections.map((section) => ({
      ...section,
      tools: platformTools.filter(section.filter || (() => true))
    }));
  }, [config]);

  let idx = 0;

  return (
    <Box sx={{ position: 'relative' }}>
      {/* FIXED VIDEO HERO - stays in place while content scrolls over */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 0,
          height: { xs: 260, md: 340 },
          borderRadius: 4,
          overflow: 'hidden'
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            inset: 0
          }}
        >
          <source src={GOOGLE_HERO_VIDEO} type="video/mp4" />
        </video>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.7) 100%)'
          }}
        />
        {/* Clean hero - no text overlay */}
      </Box>

      {/* CONTENT - scrolls over the fixed video */}
      <Stack
        sx={{
          position: 'relative',
          zIndex: 1,
          bgcolor: 'background.default',
          mt: -3,
          borderRadius: '24px 24px 0 0',
          pt: 4,
          px: { xs: 0, md: 0 },
          gap: { xs: 4, md: 5 }
        }}
      >
        {sectionsWithTools.map((section) => {
          const start = idx;
          idx += section.tools.length;
          return (
            <GoogleToolSection
              key={section.key}
              title={section.title}
              subtitle={section.subtitle}
              icon={section.icon}
              tools={section.tools}
              startIndex={start}
            />
          );
        })}
      </Stack>
    </Box>
  );
}

/***************************  META ASSETS (39 unique images)  ***************************/

const META_IMG = '/images/tools/meta';
const META_HERO_VIDEO = '/videos/google/hero.mp4'; // shared hero video

// 39 unique images
const META_IMAGES = Array.from({ length: 39 }, (_, i) => `${META_IMG}/m-${String(i + 1).padStart(2, '0')}.jpg`);

/***************************  META: TOOL CARD  ***************************/

function MetaToolCard({ tool, image }) {
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
          borderColor: 'rgba(24,119,242,0.4)',
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(24,119,242,0.12)'
        },
        '&:hover .m-card-img': {
          transform: 'scale(1.05)'
        }
      }}
    >
      <Box sx={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative', bgcolor: 'grey.900' }}>
        <img
          className="m-card-img"
          src={image}
          alt={tool.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            transition: 'transform 0.4s ease'
          }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)',
            pointerEvents: 'none'
          }}
        />
        <Chip
          label={tool.badge}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            height: 22,
            fontSize: '0.6rem',
            fontWeight: 700,
            bgcolor: 'rgba(0,0,0,0.55)',
            color: 'white',
            backdropFilter: 'blur(8px)',
            borderLeft: '3px solid #1877F2'
          }}
        />
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            mb: 0.75,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {tool.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {tool.description}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, color: '#1877F2' }}
        >
          Run workflow <IconArrowRight size={14} />
        </Typography>
      </Box>
    </Box>
  );
}

/***************************  META: TOOL SECTION  ***************************/

function MetaToolSection({ title, subtitle, icon: Icon, tools, startIndex }) {
  if (tools.length === 0) return null;

  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(24,119,242,0.08)',
            color: '#1877F2'
          }}
        >
          <Icon size={18} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
          {title}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {subtitle}
      </Typography>

      <Grid container spacing={2}>
        {tools.map((tool, idx) => (
          <Grid key={tool.slug} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <MetaToolCard tool={tool} image={META_IMAGES[(startIndex + idx) % META_IMAGES.length]} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

/***************************  META PLATFORM CONTENT  ***************************/

function MetaPlatformContent() {
  const config = PLATFORM_CONFIG.meta;

  const sectionsWithTools = useMemo(() => {
    if (!config) return [];
    const platformTools = config.filterFn ? toolsData.filter(config.filterFn) : toolsData;
    return config.sections.map((section) => ({
      ...section,
      tools: platformTools.filter(section.filter || (() => true))
    }));
  }, [config]);

  let idx = 0;

  return (
    <Box sx={{ position: 'relative' }}>
      {/* FIXED VIDEO HERO */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 0,
          height: { xs: 260, md: 340 },
          borderRadius: 4,
          overflow: 'hidden'
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            inset: 0
          }}
        >
          <source src={META_HERO_VIDEO} type="video/mp4" />
        </video>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(24,119,242,0.3) 0%, rgba(0,0,0,0.65) 50%, rgba(24,119,242,0.2) 100%)'
          }}
        />
      </Box>

      {/* CONTENT - scrolls over the fixed video */}
      <Stack
        sx={{
          position: 'relative',
          zIndex: 1,
          bgcolor: 'background.default',
          mt: -3,
          borderRadius: '24px 24px 0 0',
          pt: 4,
          px: { xs: 0, md: 0 },
          gap: { xs: 4, md: 5 }
        }}
      >
        {sectionsWithTools.map((section) => {
          const start = idx;
          idx += section.tools.length;
          return (
            <MetaToolSection
              key={section.key}
              title={section.title}
              subtitle={section.subtitle}
              icon={section.icon}
              tools={section.tools}
              startIndex={start}
            />
          );
        })}
      </Stack>
    </Box>
  );
}

/***************************  SOCIAL MEDIA ASSETS (49 images)  ***************************/

const INSTA_IMG = '/images/tools/instagram';
const SOCIAL_HERO_VIDEO = '/videos/social-media/hero.mp4';

// 21 Instagram images (i-01 to i-21)
const SOCIAL_IMAGES = Array.from({ length: 21 }, (_, i) => `${INSTA_IMG}/i-${String(i + 1).padStart(2, '0')}.jpg`);

// Platform-specific images for each section
const YOUTUBE_IMAGES = Array.from({ length: 5 }, (_, i) => `/images/tools/youtube/yt-${String(i + 1).padStart(2, '0')}.jpg`);
const TIKTOK_IMAGES = Array.from({ length: 4 }, (_, i) => `/images/tools/tiktok/tt-${String(i + 1).padStart(2, '0')}.jpg`);
const LINKEDIN_IMAGES = Array.from({ length: 3 }, (_, i) => `/images/tools/linkedin/li-${String(i + 1).padStart(2, '0')}.jpg`);

// 16 social media management images
const SM_IMG = '/images/tools/social-media';
const SOCIAL_MGMT_IMAGES = Array.from({ length: 16 }, (_, i) => `${SM_IMG}/sm-${String(i + 1).padStart(2, '0')}.jpg`);

const SECTION_IMAGES = {
  'social-management': SOCIAL_MGMT_IMAGES,
  youtube: YOUTUBE_IMAGES,
  tiktok: TIKTOK_IMAGES,
  linkedin: LINKEDIN_IMAGES
};

/***************************  SOCIAL MEDIA: TOOL CARD  ***************************/

const SOCIAL_ACCENT = {
  Instagram: '#4285F4',
  'Social Media': '#4285F4',
  YouTube: '#4285F4',
  TikTok: '#4285F4',
  LinkedIn: '#4285F4'
};

function SocialToolCard({ tool, image }) {
  const navigate = useNavigate();
  const accent = SOCIAL_ACCENT[tool.badge] || '#4285F4';

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
          borderColor: `${accent}66`,
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 40px ${accent}1F`
        },
        '&:hover .s-card-img': {
          transform: 'scale(1.05)'
        }
      }}
    >
      <Box sx={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative', bgcolor: 'grey.900' }}>
        <img
          className="s-card-img"
          src={image}
          alt={tool.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            transition: 'transform 0.4s ease'
          }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%)',
            pointerEvents: 'none'
          }}
        />
        <Chip
          label={tool.badge}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            height: 22,
            fontSize: '0.6rem',
            fontWeight: 700,
            bgcolor: 'rgba(0,0,0,0.55)',
            color: 'white',
            backdropFilter: 'blur(8px)',
            borderLeft: `3px solid ${accent}`
          }}
        />
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            mb: 0.75,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {tool.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {tool.description}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, color: accent }}
        >
          Run workflow <IconArrowRight size={14} />
        </Typography>
      </Box>
    </Box>
  );
}

/***************************  SOCIAL MEDIA: TOOL SECTION  ***************************/

function SocialToolSection({ title, subtitle, icon: Icon, tools, startIndex, accent, sectionKey }) {
  if (tools.length === 0) return null;

  const sectionImages = SECTION_IMAGES[sectionKey];

  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${accent}14`,
            color: accent
          }}
        >
          <Icon size={18} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
          {title}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {subtitle}
      </Typography>

      <Grid container spacing={2}>
        {tools.map((tool, idx) => (
          <Grid key={tool.slug} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <SocialToolCard
              tool={tool}
              image={sectionImages ? sectionImages[idx % sectionImages.length] : SOCIAL_IMAGES[(startIndex + idx) % SOCIAL_IMAGES.length]}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

/***************************  SOCIAL MEDIA PLATFORM CONTENT  ***************************/

function SocialMediaPlatformContent() {
  const config = PLATFORM_CONFIG['social-media'];

  const sectionsWithTools = useMemo(() => {
    if (!config) return [];
    const platformTools = config.filterFn ? toolsData.filter(config.filterFn) : toolsData;
    return config.sections.map((section) => ({
      ...section,
      tools: platformTools.filter(section.filter || (() => true))
    }));
  }, [config]);

  let idx = 0;

  return (
    <Box sx={{ position: 'relative' }}>
      {/* FIXED VIDEO HERO */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 0,
          height: { xs: 260, md: 340 },
          borderRadius: 4,
          overflow: 'hidden'
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            inset: 0
          }}
        >
          <source src={SOCIAL_HERO_VIDEO} type="video/mp4" />
        </video>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(225,48,108,0.3) 0%, rgba(0,0,0,0.65) 50%, rgba(124,58,237,0.2) 100%)'
          }}
        />
      </Box>

      {/* CONTENT - scrolls over the fixed video */}
      <Stack
        sx={{
          position: 'relative',
          zIndex: 1,
          bgcolor: 'background.default',
          mt: -3,
          borderRadius: '24px 24px 0 0',
          pt: 4,
          px: { xs: 0, md: 0 },
          gap: { xs: 4, md: 5 }
        }}
      >
        {sectionsWithTools.map((section) => {
          const start = idx;
          idx += section.tools.length;
          return (
            <SocialToolSection
              key={section.key}
              sectionKey={section.key}
              title={section.title}
              subtitle={section.subtitle}
              icon={section.icon}
              tools={section.tools}
              startIndex={start}
              accent={section.accent || '#4285F4'}
            />
          );
        })}
      </Stack>
    </Box>
  );
}

/***************************  GENERIC TOOL CARD (other platforms)  ***************************/

function ToolCard({ tool, large }) {
  const navigate = useNavigate();

  const getIconImage = (badge) => {
    const iconMap = {
      Grader: '/images/icons/data-analytic-3d.png',
      'Google Ads': '/images/icons/marketing-strategy-3d.png',
      Audit: '/images/icons/optimization-3d.png',
      Campaign: '/images/icons/promotion-3d.png',
      Budget: '/images/icons/data-analytic-3d.png',
      'PPC Optimization': '/images/icons/backlink-3d.png',
      'Facebook/Meta': '/images/icons/facebook-3d.png',
      Instagram: '/images/icons/social-media-engagement-3d.png',
      Creative: '/images/icons/copywriting-3d.png',
      'Social Media': '/images/icons/social-media-engagement-3d.png',
      SEO: '/images/icons/optimization-3d.png',
      'Content Writing': '/images/icons/copywriting-3d.png',
      Analytics: '/images/icons/data-analytic-3d.png',
      'ROI & Attribution': '/images/icons/data-analytic-3d.png',
      YouTube: '/images/icons/promotion-3d.png',
      TikTok: '/images/icons/social-media-engagement-3d.png',
      LinkedIn: '/images/icons/backlink-3d.png'
    };
    return iconMap[badge] || '/images/icons/marketing-strategy-3d.png';
  };

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
        transition: 'border-color 0.25s ease, transform 0.25s ease',
        '&:hover': { borderColor: glass.hoverBorder, transform: 'translateY(-2px)' }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: large ? 3 : 2.5 }}>
        <Box sx={{ width: large ? 52 : 44, height: large ? 52 : 44, mb: 2 }}>
          <img src={getIconImage(tool.badge)} alt={tool.name} width={large ? 52 : 44} height={large ? 52 : 44} style={{ objectFit: 'contain' }} />
        </Box>
        <Typography variant={large ? 'h6' : 'subtitle1'} sx={{ fontWeight: 600, mb: 1 }}>{tool.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>{tool.description}</Typography>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75, mb: 1.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
          <Typography variant="caption" color="text.secondary">{tool.badge}</Typography>
        </Stack>
        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          Run workflow <IconArrowRight size={14} />
        </Typography>
      </Box>
    </Box>
  );
}

/***************************  GENERIC SECTION (other platforms)  ***************************/

function ToolSection({ title, subtitle, icon: Icon, tools }) {
  if (tools.length === 0) return null;
  const hasLargeCards = tools.length >= 2;

  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Icon size={20} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>{title}</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{subtitle}</Typography>
      <Grid container spacing={2}>
        {tools.map((tool, i) => (
          <Grid key={tool.slug} size={{ xs: 12, sm: 6, md: hasLargeCards && i < 2 ? 6 : 3 }}>
            <ToolCard tool={tool} large={hasLargeCards && i < 2} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

/***************************  PLATFORM CONFIGS  ***************************/

const PLATFORM_CONFIG = {
  google: {
    title: 'Google Ads Tools',
    icon: IconBrandGoogle,
    filterFn: (tool) => {
      const name = tool.name.toLowerCase();
      const slug = tool.slug.toLowerCase();
      if (name.includes('facebook') || name.includes('meta ') || name.includes('microsoft') ||
          name.includes('instagram') || name.includes('tiktok') || name.includes('linkedin') ||
          name.includes('shopify') || name.includes('pinterest') || name.includes('twitter') ||
          tool.badge === 'Facebook/Meta' || tool.badge === 'Instagram' || tool.badge === 'TikTok' ||
          tool.badge === 'LinkedIn' || tool.badge === 'E-commerce') {
        return false;
      }
      if (name.includes('google') || slug.includes('google') || tool.badge === 'Google Ads') return true;
      if (tool.badge === 'Campaign' || tool.badge === 'Budget' || tool.badge === 'PPC Optimization' || tool.badge === 'Audit') return true;
      return false;
    },
    sections: [
      { key: 'grader', title: 'Google Graders', subtitle: 'Score and analyze your Google accounts', icon: IconChartBar, filter: (t) => (t.badge === 'Grader' && t.name.toLowerCase().includes('google')) || t.badge === 'Google Ads' },
      { key: 'audit', title: 'Audit & Analysis', subtitle: 'Diagnose issues and find opportunities', icon: IconShieldCheck, filter: (t) => t.badge === 'Audit' },
      { key: 'campaign', title: 'Campaign Management', subtitle: 'Build, manage and optimize campaigns', icon: IconRocket, filter: (t) => t.badge === 'Campaign' },
      { key: 'budget', title: 'Budget & Bidding', subtitle: 'Control spend and maximize ROI', icon: IconCoin, filter: (t) => t.badge === 'Budget' || t.badge === 'PPC Optimization' }
    ]
  },
  meta: {
    title: 'Meta Ads Tools',
    icon: IconBrandFacebook,
    filterFn: (tool) => {
      const name = tool.name.toLowerCase();
      return name.includes('facebook') || name.includes('meta') || tool.badge === 'Facebook/Meta' ||
        (tool.badge === 'Creative' && !name.includes('google'));
    },
    sections: [
      {
        key: 'ads-management',
        title: 'Ads Management',
        subtitle: 'Launch, manage and optimize Facebook & Instagram ad campaigns',
        icon: IconRocket,
        filter: (t) => {
          const s = t.slug;
          return ['facebook-ads-manager', 'facebook-ads-orchestrator', 'meta-ads-manager-2', 'meta-ad-launcher', 'facebook-marketing-suite', 'meta-full-automation-suite'].includes(s);
        }
      },
      {
        key: 'audience-targeting',
        title: 'Audience & Targeting',
        subtitle: 'Discover, build, and launch high-converting audiences',
        icon: IconSearch,
        filter: (t) => {
          const s = t.slug;
          return ['meta-audience-launcher', 'meta-audience-studio', 'meta-audience-builder', 'meta-target-audience-finder', 'meta-custom-audiences', 'meta-hidden-insights'].includes(s);
        }
      },
      {
        key: 'creative-analytics',
        title: 'Creative & Copy',
        subtitle: 'Generate ad creatives, copy, and analyze creative performance',
        icon: IconPencil,
        filter: (t) => {
          const s = t.slug;
          return ['meta-ai-copywriter', 'meta-creative-studio', 'meta-creative-insights', 'ad-copy-insights', 'meta-ai-comment-responder', 'meta-comment-manager'].includes(s) || t.badge === 'Creative';
        }
      },
      {
        key: 'automation-optimization',
        title: 'Automation & Optimization',
        subtitle: 'AI-powered rules, budget optimization, and real-time adjustments',
        icon: IconSettings,
        filter: (t) => {
          const s = t.slug;
          return ['meta-automation-tactics', 'meta-custom-automation', 'meta-autonomous-budget-optimizer', 'meta-budget-optimizer', 'real-time-meta-optimizer', 'meta-ai-marketer', 'meta-placement-optimizer', 'meta-smart-filter'].includes(s);
        }
      },
      {
        key: 'tracking-analytics',
        title: 'Tracking & Analytics',
        subtitle: 'Conversion tracking, attribution, dashboards, and reporting',
        icon: IconChartBar,
        filter: (t) => {
          const s = t.slug;
          return ['meta-conversions-api', 'meta-cloud-tracking', 'meta-conversion-tracker', 'meta-attribution-tool', 'meta-campaign-analyzer', 'facebook-performance-dashboard', 'meta-ads-dashboard', 'meta-ad-cost-calculator', 'ad-set-storyline'].includes(s);
        }
      },
      {
        key: 'agency-tools',
        title: 'Agency Tools',
        subtitle: 'White-labeling, automated reports, and client management',
        icon: IconTrendingUp,
        filter: (t) => {
          const s = t.slug;
          return ['meta-white-label', 'meta-automated-reporting'].includes(s);
        }
      }
    ]
  },
  instagram: {
    title: 'Instagram Tools',
    icon: IconBrandInstagram,
    filterFn: (tool) => {
      const name = tool.name.toLowerCase();
      return name.includes('instagram') || tool.badge === 'Instagram' || tool.badge === 'Social Media';
    },
    sections: [
      { key: 'instagram', title: 'Instagram', subtitle: 'Reels, Stories & Engagement', icon: IconBrandInstagram, filter: (t) => t.badge === 'Instagram' },
      { key: 'social', title: 'Social Media', subtitle: 'Social media management', icon: IconTrendingUp, filter: (t) => t.badge === 'Social Media' }
    ]
  },
  youtube: {
    title: 'YouTube Tools',
    icon: IconBrandYoutube,
    filterFn: (tool) => {
      const name = tool.name.toLowerCase();
      return name.includes('youtube') || tool.badge === 'YouTube';
    },
    sections: [
      { key: 'youtube', title: 'YouTube', subtitle: 'Video ads and content', icon: IconBrandYoutube, filter: (t) => t.badge === 'YouTube' || t.name.toLowerCase().includes('youtube') }
    ]
  },
  tiktok: {
    title: 'TikTok Tools',
    icon: IconBrandTiktok,
    filterFn: (tool) => {
      const name = tool.name.toLowerCase();
      return name.includes('tiktok') || tool.badge === 'TikTok';
    },
    sections: [
      { key: 'tiktok', title: 'TikTok', subtitle: 'Short-form video marketing', icon: IconBrandTiktok, filter: (t) => t.badge === 'TikTok' || t.name.toLowerCase().includes('tiktok') }
    ]
  },
  linkedin: {
    title: 'LinkedIn Tools',
    icon: IconBrandLinkedin,
    filterFn: (tool) => {
      const name = tool.name.toLowerCase();
      return name.includes('linkedin') || tool.badge === 'LinkedIn';
    },
    sections: [
      { key: 'linkedin', title: 'LinkedIn', subtitle: 'B2B marketing and lead gen', icon: IconBrandLinkedin, filter: (t) => t.badge === 'LinkedIn' || t.name.toLowerCase().includes('linkedin') }
    ]
  },
  seo: {
    title: 'SEO Tools',
    icon: IconSearch,
    filterFn: (tool) => tool.badge === 'SEO' || tool.badge === 'Content Writing' || tool.badge === 'Copywriting',
    sections: [
      { key: 'seo', title: 'SEO', subtitle: 'Search engine optimization', icon: IconSearch, filter: (t) => t.badge === 'SEO' },
      { key: 'content', title: 'Content Writing', subtitle: 'Create engaging content', icon: IconPencil, filter: (t) => t.badge === 'Content Writing' || t.badge === 'Copywriting' }
    ]
  },
  analytics: {
    title: 'Analytics & Insights',
    icon: IconChartBar,
    filterFn: (tool) => tool.badge === 'Analytics' || tool.badge === 'ROI & Attribution',
    sections: [
      { key: 'analytics', title: 'Analytics', subtitle: 'Data-driven insights and performance tracking', icon: IconChartBar, filter: (t) => t.badge === 'Analytics' },
      { key: 'roi', title: 'ROI & Attribution', subtitle: 'Track conversions and measure campaign returns', icon: IconTrendingUp, filter: (t) => t.badge === 'ROI & Attribution' }
    ]
  },
  ecommerce: {
    title: 'E-commerce & Shopify',
    icon: IconBriefcase,
    filterFn: (tool) => {
      return tool.badge === 'E-commerce' || tool.badge === 'Shopify' || tool.badge === 'Campaign' && tool.name.toLowerCase().includes('shopify');
    },
    sections: [
      {
        key: 'shopify', title: 'Shopify Tools', subtitle: 'Store optimization, marketing, and conversion tools for Shopify', icon: IconBriefcase, accent: '#4285F4',
        filter: (t) => t.badge === 'Shopify' || t.name.toLowerCase().includes('shopify')
      },
      {
        key: 'ecommerce-ads', title: 'E-commerce Advertising', subtitle: 'Product ads, shopping campaigns, retargeting, and budget optimization', icon: IconRocket, accent: '#4285F4',
        filter: (t) => {
          const s = t.slug;
          const adSlugs = ['cart-recovery-ads','cross-sell-ad-generator','dynamic-product-ads','ecommerce-ad-platform','advantage-plus-campaign-builder','google-shopping-optimizer','tiktok-ecommerce-ad-creator','performance-max-campaign-manager','ad-budget-allocator','retargeting-funnel-builder','social-commerce-ad-launcher','amazon-ppc-optimizer','creative-fatigue-detector'];
          return adSlugs.includes(s);
        }
      },
      {
        key: 'ecommerce-analytics', title: 'E-commerce Analytics', subtitle: 'KPI tracking, ROAS analysis, conversion optimization, and reporting', icon: IconChartBar, accent: '#4285F4',
        filter: (t) => {
          const s = t.slug;
          const analyticsSlugs = ['ecommerce-kpi-dashboard','conversion-rate-optimizer','customer-lifetime-value-calculator','roas-analyzer','marketing-efficiency-ratio-tracker','cart-abandonment-analyzer','customer-acquisition-cost-optimizer','attribution-window-optimizer','ecommerce-reporting-automator','gross-margin-analyzer','product-performance-tracker'];
          return analyticsSlugs.includes(s);
        }
      },
      {
        key: 'ecommerce-automation', title: 'E-commerce Automation', subtitle: 'Email flows, loyalty programs, replenishment, and workflow automation', icon: IconSettings, accent: '#4285F4',
        filter: (t) => {
          const s = t.slug;
          const autoSlugs = ['welcome-series-generator','post-purchase-follow-up-builder','customer-winback-flow-creator','loyalty-vip-rewards-designer','replenishment-reminder-engine','milestone-email-automator','cross-sell-upsell-flow-builder','ecommerce-workflow-automator','omnichannel-campaign-orchestrator'];
          return autoSlugs.includes(s);
        }
      },
      {
        key: 'ecommerce-strategy', title: 'E-commerce Strategy', subtitle: 'Growth planning, pricing, inventory forecasting, and platform expansion', icon: IconTrendingUp, accent: '#4285F4',
        filter: (t) => {
          const s = t.slug;
          const strategySlugs = ['dynamic-pricing-optimizer','predictive-inventory-manager','ecommerce-chatbot-builder','ecommerce-growth-roadmap-generator','platform-expansion-planner','ecommerce-ab-test-planner','voice-search-product-optimizer','product-feed-optimizer','product-recommendation-engine','seasonal-ecommerce-planner','inventory-based-ad-manager'];
          return strategySlugs.includes(s);
        }
      }
    ]
  },
  'social-media': {
    title: 'Social Media Tools',
    icon: IconShare,
    filterFn: (tool) => {
      return tool.badge === 'Instagram' || tool.badge === 'Social Media' ||
        tool.badge === 'YouTube' || tool.badge === 'TikTok' || tool.badge === 'LinkedIn';
    },
    sections: [
      {
        key: 'instagram',
        title: 'Instagram',
        subtitle: 'Reels, Stories, engagement growth and shopping ads',
        icon: IconBrandInstagram,
        accent: '#4285F4',
        filter: (t) => t.badge === 'Instagram'
      },
      {
        key: 'social-management',
        title: 'Social Media Management',
        subtitle: 'Cross-platform scheduling, analytics and content creation',
        icon: IconHash,
        accent: '#4285F4',
        filter: (t) => t.badge === 'Social Media'
      },
      {
        key: 'youtube',
        title: 'YouTube',
        subtitle: 'Video ads, scripts and channel optimization',
        icon: IconBrandYoutube,
        accent: '#4285F4',
        filter: (t) => t.badge === 'YouTube'
      },
      {
        key: 'tiktok',
        title: 'TikTok',
        subtitle: 'Short-form video ads and viral content',
        icon: IconBrandTiktok,
        accent: '#4285F4',
        filter: (t) => t.badge === 'TikTok'
      },
      {
        key: 'linkedin',
        title: 'LinkedIn',
        subtitle: 'B2B advertising and professional lead generation',
        icon: IconBrandLinkedin,
        accent: '#4285F4',
        filter: (t) => t.badge === 'LinkedIn'
      }
    ]
  },
  'ai-tools': {
    title: 'AI Tools',
    icon: IconRobot,
    filterFn: (tool) => {
      const badges = ['Marketing', 'AI Agent', 'Text Editing', 'Advertising', 'Developer', 'Email', 'Branding', 'Education', 'Schema', 'Automation', 'Pinterest', 'Twitter/X'];
      if (badges.includes(tool.badge)) return true;
      if (tool.badge === 'Grader' && !tool.name.toLowerCase().includes('google')) return true;
      return false;
    },
    sections: [
      { key: 'ai-agents', title: 'AI Agents', subtitle: 'Autonomous AI marketing agents and intelligent automation', icon: IconRobot, accent: '#4285F4', filter: (t) => t.badge === 'AI Agent' },
      { key: 'marketing', title: 'Marketing & Advertising', subtitle: 'Marketing copy, growth tools, ad analysis, and brand assets', icon: IconTrendingUp, accent: '#4285F4', filter: (t) => ['Marketing', 'Advertising', 'Branding'].includes(t.badge) },
      { key: 'text-editing', title: 'Text & Content Editing', subtitle: 'Rewrite, expand, simplify, and improve any text', icon: IconPencil, accent: '#4285F4', filter: (t) => t.badge === 'Text Editing' },
      { key: 'developer', title: 'Developer & Automation', subtitle: 'API documentation, schemas, and workflow automation', icon: IconCode, accent: '#4285F4', filter: (t) => ['Developer', 'Schema', 'Automation'].includes(t.badge) },
      { key: 'communication', title: 'Email, Graders & More', subtitle: 'Email templates, scoring tools, education, and cross-platform marketing', icon: IconMail, accent: '#4285F4', filter: (t) => ['Email', 'Grader', 'Education', 'Pinterest', 'Twitter/X'].includes(t.badge) }
    ]
  }
};

/***************************  SEO / CONTENT ASSETS  ***************************/

const SEO_IMG = '/images/tools/seo';
const CONTENT_IMG = '/images/tools/content';
const SEO_HERO_VIDEO = '/videos/seo/hero.mp4';

const SEO_IMAGES = Array.from({ length: 11 }, (_, i) => `${SEO_IMG}/seo-${String(i + 1).padStart(2, '0')}.jpg`);
const CONTENT_IMAGES = Array.from({ length: 15 }, (_, i) => `${CONTENT_IMG}/ct-${String(i + 1).padStart(2, '0')}.jpg`);

const SEO_ACCENT = { SEO: '#4285F4', 'Content Writing': '#4285F4', Copywriting: '#4285F4' };

function SEOToolCard({ tool, image }) {
  const navigate = useNavigate();
  const accent = SEO_ACCENT[tool.badge] || '#4285F4';

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
        '&:hover': { borderColor: `${accent}66`, transform: 'translateY(-4px)', boxShadow: `0 12px 40px ${accent}1F` },
        '&:hover .seo-card-img': { transform: 'scale(1.05)' }
      }}
    >
      <Box sx={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative', bgcolor: 'grey.900' }}>
        <img
          className="seo-card-img"
          src={image}
          alt={tool.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'transform 0.4s ease' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />
        <Chip
          label={tool.badge}
          size="small"
          sx={{ position: 'absolute', top: 10, left: 10, height: 22, fontSize: '0.6rem', fontWeight: 700, bgcolor: 'rgba(0,0,0,0.55)', color: 'white', backdropFilter: 'blur(8px)', borderLeft: `3px solid ${accent}` }}
        />
      </Box>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {tool.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {tool.description}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, color: accent }}>
          Run workflow <IconArrowRight size={14} />
        </Typography>
      </Box>
    </Box>
  );
}

function SEOToolSection({ title, subtitle, icon: Icon, tools, images, accent }) {
  if (tools.length === 0) return null;

  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${accent}14`, color: accent }}>
          <Icon size={18} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{subtitle}</Typography>
      <Grid container spacing={2}>
        {tools.map((tool, idx) => (
          <Grid key={tool.slug} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <SEOToolCard tool={tool} image={images[idx % images.length]} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function SEOPlatformContent() {
  const config = PLATFORM_CONFIG.seo;

  const sectionsWithTools = useMemo(() => {
    if (!config) return [];
    const platformTools = config.filterFn ? toolsData.filter(config.filterFn) : toolsData;
    return config.sections.map((section) => ({
      ...section,
      tools: platformTools.filter(section.filter || (() => true))
    }));
  }, [config]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 0, height: { xs: 260, md: 340 }, borderRadius: 4, overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}>
          <source src={SEO_HERO_VIDEO} type="video/mp4" />
        </video>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(16,185,129,0.3) 0%, rgba(0,0,0,0.65) 50%, rgba(139,92,246,0.2) 100%)' }} />
      </Box>
      <Stack sx={{ position: 'relative', zIndex: 1, bgcolor: 'background.default', mt: -3, borderRadius: '24px 24px 0 0', pt: 4, gap: { xs: 4, md: 5 } }}>
        {sectionsWithTools.map((section) => (
          <SEOToolSection
            key={section.key}
            title={section.title}
            subtitle={section.subtitle}
            icon={section.icon}
            tools={section.tools}
            images={section.key === 'seo' ? SEO_IMAGES : CONTENT_IMAGES}
            accent={section.key === 'seo' ? '#4285F4' : '#4285F4'}
          />
        ))}
      </Stack>
    </Box>
  );
}

/***************************  ANALYTICS ASSETS  ***************************/

const ANALYTICS_IMG = '/images/tools/analytics';
const ROI_IMG = '/images/tools/roi';
const ANALYTICS_HERO_VIDEO = '/videos/analytics/hero.mp4';

const ANALYTICS_IMAGES = Array.from({ length: 13 }, (_, i) => `${ANALYTICS_IMG}/an-${String(i + 1).padStart(2, '0')}.jpg`);
const ROI_IMAGES = Array.from({ length: 6 }, (_, i) => `${ROI_IMG}/roi-${String(i + 1).padStart(2, '0')}.jpg`);

function AnalyticsToolCard({ tool, image }) {
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
        '&:hover': { borderColor: 'rgba(66,133,244,0.4)', transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(66,133,244,0.12)' },
        '&:hover .an-card-img': { transform: 'scale(1.05)' }
      }}
    >
      <Box sx={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative', bgcolor: 'grey.900' }}>
        <img
          className="an-card-img"
          src={image}
          alt={tool.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'transform 0.4s ease' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />
        <Chip
          label={tool.badge}
          size="small"
          sx={{ position: 'absolute', top: 10, left: 10, height: 22, fontSize: '0.6rem', fontWeight: 700, bgcolor: 'rgba(0,0,0,0.55)', color: 'white', backdropFilter: 'blur(8px)', borderLeft: '3px solid #4285F4' }}
        />
      </Box>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {tool.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {tool.description}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, color: '#4285F4' }}>
          Run workflow <IconArrowRight size={14} />
        </Typography>
      </Box>
    </Box>
  );
}

function AnalyticsToolSection({ title, subtitle, icon: Icon, tools, images }) {
  if (tools.length === 0) return null;

  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(66,133,244,0.08)', color: '#4285F4' }}>
          <Icon size={18} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{subtitle}</Typography>
      <Grid container spacing={2}>
        {tools.map((tool, idx) => (
          <Grid key={tool.slug} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <AnalyticsToolCard tool={tool} image={images[idx % images.length]} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function AnalyticsPlatformContent() {
  const config = PLATFORM_CONFIG.analytics;

  const sectionsWithTools = useMemo(() => {
    if (!config) return [];
    const platformTools = config.filterFn ? toolsData.filter(config.filterFn) : toolsData;
    return config.sections.map((section) => ({
      ...section,
      tools: platformTools.filter(section.filter || (() => true))
    }));
  }, [config]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 0, height: { xs: 260, md: 340 }, borderRadius: 4, overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}>
          <source src={ANALYTICS_HERO_VIDEO} type="video/mp4" />
        </video>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(66,133,244,0.3) 0%, rgba(0,0,0,0.65) 50%, rgba(139,92,246,0.2) 100%)' }} />
      </Box>
      <Stack sx={{ position: 'relative', zIndex: 1, bgcolor: 'background.default', mt: -3, borderRadius: '24px 24px 0 0', pt: 4, gap: { xs: 4, md: 5 } }}>
        {sectionsWithTools.map((section) => (
          <AnalyticsToolSection
            key={section.key}
            title={section.title}
            subtitle={section.subtitle}
            icon={section.icon}
            tools={section.tools}
            images={section.key === 'analytics' ? ANALYTICS_IMAGES : ROI_IMAGES}
          />
        ))}
      </Stack>
    </Box>
  );
}

/***************************  ECOMMERCE ASSETS  ***************************/

const EC_IMG = '/images/tools/ecommerce';
const ECOMMERCE_HERO_VIDEO = '/videos/ecommerce/hero.mp4';

const ECOMMERCE_IMAGES = Array.from({ length: 49 }, (_, i) => `${EC_IMG}/ec-${String(i + 1).padStart(2, '0')}.jpg`);
const SHOPIFY_IMAGES = ECOMMERCE_IMAGES.slice(22); // ec-23 to ec-29 (Shopify/ecommerce store images)

function EcommerceToolCard({ tool, image, accent = '#4285F4' }) {
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
        '&:hover': { borderColor: `${accent}66`, transform: 'translateY(-4px)', boxShadow: `0 12px 40px ${accent}1F` },
        '&:hover .ec-card-img': { transform: 'scale(1.05)' }
      }}
    >
      <Box sx={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative', bgcolor: 'grey.900' }}>
        <img
          className="ec-card-img"
          src={image}
          alt={tool.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'transform 0.4s ease' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />
        <Chip
          label={tool.badge}
          size="small"
          sx={{ position: 'absolute', top: 10, left: 10, height: 22, fontSize: '0.6rem', fontWeight: 700, bgcolor: 'rgba(0,0,0,0.55)', color: 'white', backdropFilter: 'blur(8px)', borderLeft: `3px solid ${accent}` }}
        />
      </Box>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {tool.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {tool.description}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, color: accent }}>
          Run workflow <IconArrowRight size={14} />
        </Typography>
      </Box>
    </Box>
  );
}

function EcommerceToolSection({ title, subtitle, icon: Icon, tools, images, accent = '#4285F4' }) {
  if (tools.length === 0) return null;

  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${accent}14`, color: accent }}>
          <Icon size={18} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</Typography>
        <Chip label={`${tools.length} tools`} size="small" sx={{ height: 22, fontSize: '0.65rem', fontWeight: 600, bgcolor: `${accent}14`, color: accent }} />
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{subtitle}</Typography>
      <Grid container spacing={2}>
        {tools.map((tool, idx) => (
          <Grid key={tool.slug} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <EcommerceToolCard tool={tool} image={images[idx % images.length]} accent={accent} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function EcommercePlatformContent() {
  const config = PLATFORM_CONFIG.ecommerce;

  const sectionsWithTools = useMemo(() => {
    if (!config) return [];
    const platformTools = config.filterFn ? toolsData.filter(config.filterFn) : toolsData;
    return config.sections.map((section) => ({
      ...section,
      tools: platformTools.filter(section.filter || (() => true))
    }));
  }, [config]);

  const pick = (primary) => {
    const imgs = primary.map(i => ECOMMERCE_IMAGES[i]);
    const rest = ECOMMERCE_IMAGES.filter((_, i) => !primary.includes(i));
    return [...imgs, ...rest];
  };
  const sectionImages = {
    shopify: pick([8, 22, 23, 24, 29, 40, 43]),
    'ecommerce-ads': pick([0, 1, 2, 3, 4, 7, 12, 30, 41, 45]),
    'ecommerce-analytics': pick([5, 9, 11, 13, 14, 15, 31, 32, 42, 48]),
    'ecommerce-automation': pick([6, 10, 18, 19, 20, 25, 28, 33, 34, 44]),
    'ecommerce-strategy': pick([16, 17, 21, 26, 27, 35, 36, 37, 38, 39, 46, 47])
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 0, height: { xs: 260, md: 340 }, borderRadius: 4, overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}>
          <source src={ECOMMERCE_HERO_VIDEO} type="video/mp4" />
        </video>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(66,133,244,0.3) 0%, rgba(0,0,0,0.65) 50%, rgba(139,92,246,0.2) 100%)' }} />
      </Box>
      <Stack sx={{ position: 'relative', zIndex: 1, bgcolor: 'background.default', mt: -3, borderRadius: '24px 24px 0 0', pt: 4, gap: { xs: 4, md: 5 } }}>
        {sectionsWithTools.map((section) => (
          <EcommerceToolSection
            key={section.key}
            title={section.title}
            subtitle={section.subtitle}
            icon={section.icon}
            tools={section.tools}
            images={sectionImages[section.key] || ECOMMERCE_IMAGES}
            accent={section.accent || '#f6ad55'}
          />
        ))}
      </Stack>
    </Box>
  );
}

/***************************  AI TOOLS ASSETS  ***************************/

const AI_ACCENT = '#4285F4';
const AI_IMG = '/images/tools/ai-tools';
const AI_HERO_VIDEO = '/videos/ai-tools/hero.mp4';

const AI_IMAGES = Array.from({ length: 57 }, (_, i) => `${AI_IMG}/ai-${String(i + 1).padStart(2, '0')}.jpg`);

function AIToolCard({ tool, image }) {
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
        '&:hover': { borderColor: `${AI_ACCENT}66`, transform: 'translateY(-4px)', boxShadow: `0 12px 40px ${AI_ACCENT}1F` },
        '&:hover .ai-card-img': { transform: 'scale(1.05)' }
      }}
    >
      <Box sx={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative', bgcolor: 'grey.900' }}>
        <img
          className="ai-card-img"
          src={image}
          alt={tool.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'transform 0.4s ease' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />
        <Chip
          label={tool.badge}
          size="small"
          sx={{ position: 'absolute', top: 10, left: 10, height: 22, fontSize: '0.6rem', fontWeight: 700, bgcolor: 'rgba(0,0,0,0.55)', color: 'white', backdropFilter: 'blur(8px)', borderLeft: `3px solid ${AI_ACCENT}` }}
        />
      </Box>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {tool.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {tool.description}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, color: AI_ACCENT }}>
          Run workflow <IconArrowRight size={14} />
        </Typography>
      </Box>
    </Box>
  );
}

function AIToolSection({ title, subtitle, icon: Icon, tools, images, startIndex = 0 }) {
  if (tools.length === 0) return null;

  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${AI_ACCENT}14`, color: AI_ACCENT }}>
          <Icon size={18} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</Typography>
        <Chip label={`${tools.length} tools`} size="small" sx={{ height: 22, fontSize: '0.65rem', fontWeight: 600, bgcolor: `${AI_ACCENT}14`, color: AI_ACCENT }} />
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{subtitle}</Typography>
      <Grid container spacing={2}>
        {tools.map((tool, idx) => (
          <Grid key={tool.slug} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <AIToolCard tool={tool} image={images[(startIndex + idx) % images.length]} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function AIToolsPlatformContent() {
  const config = PLATFORM_CONFIG['ai-tools'];

  const sectionsWithTools = useMemo(() => {
    if (!config) return [];
    const platformTools = config.filterFn ? toolsData.filter(config.filterFn) : toolsData;
    return config.sections.map((section) => ({
      ...section,
      tools: platformTools.filter(section.filter || (() => true))
    }));
  }, [config]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 0, height: { xs: 260, md: 340 }, borderRadius: 4, overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}>
          <source src={AI_HERO_VIDEO} type="video/mp4" />
        </video>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(66,133,244,0.3) 0%, rgba(0,0,0,0.65) 50%, rgba(139,92,246,0.2) 100%)' }} />
      </Box>
      <Stack sx={{ position: 'relative', zIndex: 1, bgcolor: 'background.default', mt: -3, borderRadius: '24px 24px 0 0', pt: 4, gap: { xs: 4, md: 5 } }}>
        {sectionsWithTools.reduce((acc, section) => {
          const offset = acc.length === 0 ? 0 : acc[acc.length - 1].offset + acc[acc.length - 1].count;
          acc.push({ ...section, offset, count: section.tools.length });
          return acc;
        }, []).map((section) => (
          <AIToolSection
            key={section.key}
            title={section.title}
            subtitle={section.subtitle}
            icon={section.icon}
            tools={section.tools}
            images={AI_IMAGES}
            startIndex={section.offset}
          />
        ))}
      </Stack>
    </Box>
  );
}

/***************************  PLATFORM PAGE  ***************************/

export default function PlatformPage() {
  const { platform } = useParams();
  const config = PLATFORM_CONFIG[platform];
  const [categoryFilter, setCategoryFilter] = useState('all');

  const sectionsWithTools = useMemo(() => {
    if (!config) return [];
    const platformTools = config.filterFn ? toolsData.filter(config.filterFn) : toolsData;
    return config.sections.map((section) => ({
      ...section,
      tools: platformTools.filter(section.filter || (() => true))
    }));
  }, [config]);

  const filteredSections = useMemo(() => {
    if (categoryFilter === 'all') return sectionsWithTools;
    return sectionsWithTools.filter((s) => s.key === categoryFilter);
  }, [sectionsWithTools, categoryFilter]);

  const totalTools = useMemo(() => {
    return sectionsWithTools.reduce((acc, s) => acc + s.tools.length, 0);
  }, [sectionsWithTools]);

  if (platform === 'google') {
    return <GooglePlatformContent />;
  }

  if (platform === 'meta') {
    return <MetaPlatformContent />;
  }

  if (platform === 'social-media' || platform === 'instagram' || platform === 'youtube' || platform === 'tiktok' || platform === 'linkedin') {
    return <SocialMediaPlatformContent />;
  }

  if (platform === 'seo') {
    return <SEOPlatformContent />;
  }

  if (platform === 'analytics') {
    return <AnalyticsPlatformContent />;
  }

  if (platform === 'ecommerce') {
    return <EcommercePlatformContent />;
  }

  if (platform === 'ai-tools') {
    return <AIToolsPlatformContent />;
  }

  if (!config) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">Platform not found</Typography>
      </Box>
    );
  }

  const PlatIcon = config.icon;

  return (
    <Stack sx={{ gap: { xs: 4, md: 5 } }}>
      <Box
        sx={{
          background: glass.bg,
          backdropFilter: glass.blur,
          WebkitBackdropFilter: glass.blur,
          border: glass.border,
          boxShadow: glass.shadow,
          borderRadius: glass.radius,
          p: 3
        }}
      >
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 2, mb: 1 }}>
              <PlatIcon size={32} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{config.title}</Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary">{totalTools} tools available</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter</InputLabel>
              <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} label="Filter">
                <MenuItem value="all">All ({totalTools})</MenuItem>
                {sectionsWithTools.map((s) => (
                  <MenuItem key={s.key} value={s.key}>{s.title} ({s.tools.length})</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      {filteredSections.map((section) => (
        <ToolSection key={section.key} title={section.title} subtitle={section.subtitle} icon={section.icon} tools={section.tools} />
      ))}
      {totalTools === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary">No tools available</Typography>
        </Box>
      )}
    </Stack>
  );
}
